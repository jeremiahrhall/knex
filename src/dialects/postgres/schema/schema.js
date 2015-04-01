
// Check whether the current table
hasTable(tableName) {
  return sql([
    select('*'),
    from('information_schema.tables'),
    where('table_name', tableName)
  ], {test: true})
};

// Compile the query to determine if a column exists in a table.
hasColumn(tableName, columnName) {
  return sql([
    select('*'), 
    from('information_schema.columns'), 
    where({table_name: tableName, column_name: columnName})
  ], {test: true})
}

// Compile a rename table command.
SchemaCompiler_PG.prototype.renameTable = function(from, to) {
  this.pushQuery('alter table ' + this.formatter.wrap(from) + ' rename to ' + this.formatter.wrap(to));
};

SchemaCompiler_PG.prototype.createSchema = function(schemaName) {
  this.pushQuery('create schema ' + this.formatter.wrap(schemaName));
};

SchemaCompiler_PG.prototype.createSchemaIfNotExists = function(schemaName) {
  this.pushQuery('create schema if not exists ' + this.formatter.wrap(schemaName));
};

SchemaCompiler_PG.prototype.dropSchema = function(schemaName) {
  this.pushQuery('drop schema ' + this.formatter.wrap(schemaName));
};

SchemaCompiler_PG.prototype.dropSchemaIfExists = function(schemaName) {
  this.pushQuery('drop schema if exists ' + this.formatter.wrap(schemaName));
};

SchemaCompiler_PG.prototype.dropExtension = function(extensionName) {
  this.pushQuery('drop extension ' + this.formatter.wrap(extensionName));
};

SchemaCompiler_PG.prototype.dropExtensionIfExists = function(extensionName) {
  this.pushQuery('drop extension if exists ' + this.formatter.wrap(extensionName));
};

SchemaCompiler_PG.prototype.createExtension = function(extensionName) {
  this.pushQuery('create extension ' + this.formatter.wrap(extensionName));
};

SchemaCompiler_PG.prototype.createExtensionIfNotExists = function(extensionName) {
  this.pushQuery('create extension if not exists ' + this.formatter.wrap(extensionName));
};
