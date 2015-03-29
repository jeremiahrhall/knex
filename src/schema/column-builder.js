
class ColumnBuilder {

  constructor() {

  }

  

}


// All of the modifier methods that can be used to modify the current query.
var modifiers = [
  'default', 'defaultsTo', 'defaultTo', 'unsigned',
  'nullable', 'notNull', 'notNullable',
  'first', 'after', 'comment'
];

// Aliases for convenience.
var aliasMethod = {
  default: 'defaultTo',
  defaultsTo: 'defaultTo',
  notNull: 'notNullable'
};

// Alias a few methods for clarity when processing.
var columnAlias = {
  'float'  : 'floating',
  'enum'   : 'enu',
  'boolean': 'bool',
  'string' : 'varchar',
  'bigint' : 'bigInteger'
};

// The chainable interface off the original "column" method.
function ColumnBuilder(tableBuilder, type, args) {
  this._single       = {};
  this._modifiers    = {};
  this._statements   = [];
  this._type         = columnAlias[type] || type;
  this._args         = args;
  this._tableBuilder = tableBuilder;

  // If we're altering the table, extend the object
  // with the available "alter" methods.
  if (tableBuilder._method === 'alter') {
    _.extend(this, AlterMethods);
  }
}

// If we call any of the modifiers (index or otherwise) on the chainable, we pretend
// as though we're calling `table.method(column)` directly.
_.each(modifiers, function(method) {
  ColumnBuilder.prototype[method] = function() {
    if (aliasMethod[method]) {
      method = aliasMethod[method];
    }
    if (method === 'notNullable') return this.nullable(false);
    this._modifiers[method] = _.toArray(arguments);
    return this;
  };
});

_.each(['index', 'primary', 'unique'], function(method) {
  ColumnBuilder.prototype[method] = function() {
    if (this._type.toLowerCase().indexOf('increments') === -1) {
      this._tableBuilder[method].apply(this._tableBuilder,
        [this._args[0]].concat(_.toArray(arguments)));
    }
    return this;
  };
});

// Specify that the current column "references" a column,
// which may be tableName.column or just "column"
ColumnBuilder.prototype.references = function(value) {
  return this._tableBuilder.foreign.call(this._tableBuilder, this._args[0], this)
    ._columnBuilder(this)
    .references(value);
};

module.exports = ColumnBuilder;
