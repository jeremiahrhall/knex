// SQLite3_DDL
//
// All of the SQLite3 specific DDL helpers for renaming/dropping
// columns and changing datatypes.
// -------

// So altering the schema in SQLite3 is a major pain.
// We have our own object to deal with the renaming and altering the types
// for sqlite3 things.
class SQLite3_DDL {
  
  constructor(runner, tableCompiler, pragma) {
    this.tableCompiler = tableCompiler;
    this.pragma = pragma;
    this.runner = runner;
    this.tableName = this.tableCompiler.tableNameRaw;
    this.alteredName = '_knex_temp_alter' + _.uniqueId();
  }

  getColumn(column) {
    var currentCol = _.findWhere(this.pragma, {name: column});
    if (!currentCol) throw new Error('The column ' + column + ' is not in the ' + this.tableName + ' table');
    return currentCol;
  }

  ensureTransaction() {
    if (!this.runner.transaction) {
      return this.runner.beginTransaction();
    }
  }

  commitTransaction() {
    if (!this.runner.transaction) {
      return this.runner.commitTransaction();
    }
  }

  rollbackTransaction(e) {
    if (this.runner.transaction) throw e;
    return this.runner.rollbackTransaction().throw(e);
  }

  getTableSql() {
    return this.runner.query({sql: 'SELECT name, sql FROM sqlite_master WHERE type="table" AND name="' + this.tableName + '"'});
  }

  renameTable() {
    return this.runner.query({sql: 'ALTER TABLE "' + this.tableName + '" RENAME TO "' + this.alteredName + '"'});
  }

  dropOriginal() {
    return this.runner.query({sql: 'DROP TABLE "' + this.tableName + '"'});
  }

  dropTempTable() {
    return this.runner.query({sql: 'DROP TABLE "' + this.alteredName + '"'});
  }

  copyData() {
    return this.runner.query({sql: 'SELECT * FROM "' + this.tableName + '"'})
      .bind(this)
      .then(this.insertChunked(20, this.alteredName));
  }

  reinsertData(iterator) {
    return function() {
      return this.runner.query({sql: 'SELECT * FROM "' + this.alteredName + '"'})
        .bind(this)
        .then(this.insertChunked(20, this.tableName, iterator));
    }
  }

  insertChunked(amount, target, iterator) {
    iterator = iterator || function(noop) { return noop; };
    return function(result) {
      var batch = [];
      var ddl = this;
      return Promise.reduce(result, function(memo, row) {
        memo++;
        batch.push(row);
        if (memo % 20 === 0 || memo === result.length) {
          return new client.QueryBuilder()
            .connection(ddl.runner.connection)
            .table(target)
            .insert(_.map(batch, iterator))
            .then(function() { batch = []; })
            .thenReturn(memo);
        }
        return memo;
      }, 0);
    }
  }

  createTempTable(createTable) {
    return function() {
      return this.runner.query({sql: createTable.sql.replace(this.tableName, this.alteredName)});
    }
  }
  
  // Boy, this is quite a method.
  renameColumn(from, to) {
    var currentCol;
    return this.ensureTransaction()
      .bind(this)
      .then(function() {
        return this.getColumn(from);
      })
      .tap(function(col) { currentCol = col; })
      .then(this.getTableSql)
      .then(function(sql) {
        var a = this.formatter.wrap(from);
        var b = this.formatter.wrap(to);
        var createTable = sql[0];
        
        var newSql = doReplace(createTable.sql, a, b);
        if (sql === newSql) {
          throw new Error('Unable to find the column to change');
        }
        
        return Promise.bind(this)
        .then(this.createTempTable(createTable))
        .then(this.copyData)
        .then(this.dropOriginal)
        .then(function() {
          return this.runner.query({sql: newSql });
        })
        .then(this.reinsertData(function(row) {
          row[to] = row[from];
          return _.omit(row, from);
        }))
        .then(this.dropTempTable);
      })
      .tap(this.commitTransaction)
      .catch(this.rollbackTransaction);
  }

  dropColumn(column) {
     var currentCol;
     return this.ensureTransaction()
      .bind(this)
      .then(function() {
        return this.getColumn(column);
      })
      .tap(function(col) { currentCol = col; })
      .then(this.getTableSql)
      .then(function(sql) {
        var createTable = sql[0];
        var a = this.formatter.wrap(column);
        var newSql = doReplace(createTable.sql, a, '');
        if (sql === newSql) {
          throw new Error('Unable to find the column to change');
        }
        return Promise.bind(this)
          .then(this.createTempTable(createTable))
          .then(this.copyData)
          .then(this.dropOriginal)
          .then(function() {
            return this.runner.query({sql: newSql});
          })
          .then(this.reinsertData(function(row) {
            return _.omit(row, column);
          }))
          .then(this.dropTempTable);
      })
      .tap(this.commitTransaction)
      .catch(this.rollbackTransaction);
  }

}


function doReplace(sql, from, to) {
  var matched = sql.match(/^CREATE TABLE (\S+) \((.*)\)/);
  var tableName = matched[1],
      defs      = matched[2];
  if (!defs) throw new Error('No column definitions in this statement!');

  var parens = 0, args = [], ptr = 0;
  for (var i = 0, x = defs.length; i < x; i++) {
    switch (defs[i]) {
      case '(':
        parens++;
      break;
      case ')':
        parens--;
      break;
      case ',':
        if (parens === 0) {
          args.push(defs.slice(ptr, i));
          ptr = i + 1;
        }
      break;
      case ' ':
        if (ptr === i) {
          ptr = i + 1;
        }
      break;
    }
  }
  args.push(defs.slice(ptr, i));
  
  args = args.map(function (item) {
    var split = item.split(' ');

    if (split[0] === from) {
      // column definition
      if (to) {
        split[0] = to;
        return split.join(' ');
      }
      return ''; // for deletions
    }
    
    // skip constraint name
    var idx = (/constraint/i.test(split[0]) ? 2 : 0);
    
    // primary key and unique constraints have one or more
    // columns from this table listed between (); replace
    // one if it matches
    if (/primary|unique/i.test(split[idx])) {
      return item.replace(/\(.*\)/, function (columns) {
        return columns.replace(from, to);
      }
    }
    
    // foreign keys have one or more columns from this table
    // listed between (); replace one if it matches
    // foreign keys also have a 'references' clause
    // which may reference THIS table; if it does, replace
    // column references in that too!
    if (/foreign/.test(split[idx])) {
      
      split = item.split(/ references /i);
      
      // the quoted column names save us from having to do anything
      // other than a straight replace here
      split[0] = split[0].replace(from, to);
      
      if (split[1].slice(0, tableName.length) === tableName) {
        split[1] = split[1].replace(/\(.*\)/, function (columns) {
          return columns.replace(from, to)
        })
      }
      return split.join(' references ');
    }
    
    return item;
  }
  return sql.replace(/\(.*\)/, function () {
    return '(' + args.join(', ') + ')';
  }).replace(/,\s*([,)])/, '$1');
}
