
QueryCompiler_MySQL.prototype._emptyInsertValue = '() values ()';

// Update method, including joins, wheres, order & limits.
QueryCompiler_MySQL.prototype.update = function() {
  var join    = this.join();
  var updates = this._prepUpdate(this.single.update);
  var where   = this.where();
  var order   = this.order();
  var limit   = this.limit();
  return 'update ' + this.tableName +
    (join ? ' ' + join : '') +
    ' set ' + updates.join(', ') +
    (where ? ' ' + where : '') +
    (order ? ' ' + order : '') +
    (limit ? ' ' + limit : '');
}

QueryCompiler_MySQL.prototype.forUpdate = function() {
  return 'for update';
}
QueryCompiler_MySQL.prototype.forShare = function() {
  return 'lock in share mode';
}

// Compiles a `columnInfo` query.
QueryCompiler_MySQL.prototype.columnInfo = function() {
  var column = this.single.columnInfo;
  return {
    sql: 'select * from information_schema.columns where table_name = ? and table_schema = ?',
    bindings: [this.single.table, client.database()],
    output: function(resp) {
      var out = _.reduce(resp, function(columns, val) {
        columns[val.COLUMN_NAME] = {
          defaultValue: val.COLUMN_DEFAULT,
          type: val.DATA_TYPE,
          maxLength: val.CHARACTER_MAXIMUM_LENGTH,
          nullable: (val.IS_NULLABLE === 'YES')
        };
        return columns;
      }, {});
      return column && out[column] || out;
    }
  }
}

QueryCompiler_MySQL.prototype.limit = function() {
  var noLimit = !this.single.limit && this.single.limit !== 0;
  if (noLimit && !this.single.offset) return '';

  // Workaround for offset only, see http://stackoverflow.com/questions/255517/mysql-offset-infinite-rows
  return 'limit ' + ((this.single.offset && noLimit) ? '18446744073709551615' : this.formatter.parameter(this.single.limit));
}
