
Formatter_MySQL.prototype.operators = [
  '=', '<', '>', '<=', '>=', '<>', '!=',
  'like', 'not like', 'between', 'ilike',
  '&', '|', '^', '<<', '>>',
  'rlike', 'regexp', 'not regexp'
];

// Wraps a value (column, tableName) with the correct ticks.
Formatter_MySQL.prototype.wrapValue = function(value) {
  return (value !== '*' ? '`' + value + '`' : '*');
};
