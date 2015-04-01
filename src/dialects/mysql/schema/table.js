
// .hook('afterCreateTable', (result, table) => {
  
// })

// TableCompiler_MySQL.prototype.createQuery = function(columns, ifNot) {
//   var createStatement = ifNot ? 'CREATE TABLE IF NOT EXISTS ' : 'CREATE TABLE ';

//   var conn = {}, sql = createStatement + this.tableName() + ' (' + columns.sql.join(', ') + ')';

//   // Check if the connection settings are set.
//   if (client.connectionSettings) {
//     conn = client.connectionSettings;
//   }

//   var charset   = this.single.charset || conn.charset || '';
//   var collation = this.single.collate || conn.collate || '';
//   var engine    = this.single.engine  || '';

//   // var conn = builder.client.connectionSettings;
//   if (charset)   sql += ' default character set ' + charset;
//   if (collation) sql += ' collate ' + collation;
//   if (engine)    sql += ' engine = ' + engine;

//   if (this.single.comment) {
//     var comment = (this.single.comment || '');
//     if (comment.length > 60) helpers.warn('The max length for a table comment is 60 characters');
//     sql += ` comment = '${comment}'`;
//   }

//   this.pushQuery(sql);
// };

// TableCompiler_MySQL.prototype.addColumnsPrefix = 'add ';
// TableCompiler_MySQL.prototype.dropColumnPrefix = 'drop ';

// // Compiles the comment on the table.
// TableCompiler_MySQL.prototype.comment = function(comment) {
//   this.pushQuery('alter table ' + this.tableName() + " comment = '" + comment + "'");
// };

// changeType() {
//   // alter table + table + ' modify ' + wrapped + '// type';
// };

// // Renames a column on the table.
// renameColumn(from, to) {
//   var compiler = this;
//   var table    = this.tableName();
//   var wrapped  = this.formatter.wrap(from) + ' ' + this.formatter.wrap(to);
//   this.pushQuery({
//     sql: `show fields from ${table} where field = ${parameter(from)}`
//     output(resp) {
//       var column = resp[0];
//       var runner = this;
//       return compiler.getFKRefs(runner).get(0)
//       .then(function (refs) {
//         return Promise.try(function () {
//           if (!refs.length) { return; }
//           return compiler.dropFKRefs(runner, refs);
//         }).then(function () {
//           return runner.query({
//             sql: 'alter table ' + table + ' change ' + wrapped + ' ' + column.Type
//           });
//         }).then(function () {
//           if (!refs.length) { return; }
//           return compiler.createFKRefs(runner, refs.map(function (ref) {
//             if (ref.REFERENCED_COLUMN_NAME === from) {
//               ref.REFERENCED_COLUMN_NAME = to;
//             }
//             if (ref.COLUMN_NAME === from) {
//               ref.COLUMN_NAME = to;
//             }
//             return ref;
//           }));
//         });
//       });
//     }
//   });
// };

// function getFKRefs(runner) {
//   let kcu = alias('INFORMATION_SCHEMA.KEY_COLUMN_USAGE')
//   let rc  = alias('INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS')
//   select(
//     kcu.c(['CONSTRAINT_NAME', 'TABLE_NAME', 'COLUMN_NAME', 'REFERENCED_TABLE_NAME', 'REFERENCED_COLUMN_NAME']),
//     rc.c(['UPDATE_RULE', 'DELETE_RULE'])
//   ), 
//   from(kcu), 
//   join(rc, using(wrap('CONSTRAINT_NAME'))),
//   where(kcu.c('REFERENCED_TABLE_NAME'), parameter(this.tableName))
//   where(kcu.c('CONSTRAINT_SCHEMA'), parameter(this.databaseName))
// }

// dropFKRefs (runner, refs) {
//   var formatter = new this.Formatter();
  
//   return Promise.all(refs.map(function (ref) {
//     var constraintName = formatter.wrap(ref.CONSTRAINT_NAME);
//     return runner.query({
//       sql: 'alter table ' + this.tableName() + ' drop foreign key ' + constraintName
//     });
//   }.bind(this)));
// };

// createFKRefs (runner, refs) {
//   var formatter = new this.Formatter();
  
//   return Promise.all(refs.map(function (ref) {
//     var keyName    = formatter.wrap(ref.COLUMN_NAME);
//     var column     = formatter.columnize(ref.COLUMN_NAME);
//     var references = formatter.columnize(ref.REFERENCED_COLUMN_NAME);
//     var inTable    = formatter.wrap(ref.REFERENCED_TABLE_NAME);
//     var onUpdate   = ' ON UPDATE ' + ref.UPDATE_RULE;
//     var onDelete   = ' ON DELETE ' + ref.DELETE_RULE;
    
//     return runner.query({
//       sql: 'alter table ' + this.tableName() + ' add constraint ' + keyName + ' ' + 
//         'foreign key (' + column + ') references ' + inTable + ' (' + references + ')' + onUpdate + onDelete
//     });
//   }.bind(this)));
// };

// index(columns, indexName) {
//   indexName = indexName || this._indexCommand('index', this.tableNameRaw, columns);
//   this.pushQuery('alter table ' + this.tableName() + " add index " + indexName + "(" + this.formatter.columnize(columns) + ")");
// };

// primary(columns, indexName) {
//   indexName = indexName || this._indexCommand('primary', this.tableNameRaw, columns);
//   this.pushQuery('alter table ' + this.tableName() + " add primary key " + indexName + "(" + this.formatter.columnize(columns) + ")");
// };

// unique(columns, indexName) {
//   indexName = indexName || this._indexCommand('unique', this.tableNameRaw, columns);
//   this.pushQuery('alter table ' + this.tableName() + " add unique " + indexName + "(" + this.formatter.columnize(columns) + ")");
// };

// // Compile a drop index command.
// dropIndex(columns, indexName) {
//   indexName = indexName || this._indexCommand('index', this.tableNameRaw, columns);
//   this.pushQuery('alter table ' + this.tableName() + ' drop index ' + indexName);
// };

// // Compile a drop foreign key command.
// dropForeign(columns, indexName) {
//   indexName = indexName || this._indexCommand('foreign', this.tableNameRaw, columns);
//   this.pushQuery('alter table ' + this.tableName() + ' drop foreign key ' + indexName);
// };

// // Compile a drop primary key command.
// dropPrimary() {
//   this.pushQuery('alter table ' + this.tableName() + ' drop primary key');
// };

// // Compile a drop unique key command.
// dropUnique(column, indexName) {
//   indexName = indexName || this._indexCommand('unique', this.tableNameRaw, column);
//   this.pushQuery('alter table ' + this.tableName() + ' drop index ' + indexName);
// };
