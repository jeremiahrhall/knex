
Formatter_SQLite3.prototype.operators = [
  '=', '<', '>', '<=', '>=', '<>', '!=',
  'like', 'not like', 'between', 'ilike',
  '&', '|', '<<', '>>'
];

// Wraps a value (column, tableName) with the correct ticks.
Formatter_SQLite3.prototype.wrapValue = function(value) {
  return (value !== '*' ? '"' + value.replace(/"/g, '""') + '"' : '*');
}