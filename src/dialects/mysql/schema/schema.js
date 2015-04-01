
// Rename a table on the schema.
SchemaCompiler_MySQL.prototype.renameTable = function(tableName, to) {
  this.pushQuery('rename table ' + this.formatter.wrap(tableName) + ' to ' + this.formatter.wrap(to));
};

// Check whether a table exists on the query.
SchemaCompiler_MySQL.prototype.hasTable = function(tableName) {
  this.pushQuery({
    sql: 'show tables like ' + this.formatter.parameter(tableName),
    output(resp) {
      return resp.length > 0;
    }
  });
};

// Check whether a column exists on the schema.
SchemaCompiler_MySQL.prototype.hasColumn = function(tableName, column) {
  this.pushQuery({
    sql: 'show columns from ' + this.formatter.wrap(tableName) +
      ' like ' + this.formatter.parameter(column),
    output(resp) {
      return resp.length > 0;
    }
  });
};