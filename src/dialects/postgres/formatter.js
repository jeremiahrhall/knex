
Formatter_PG.prototype.operators = [
  '=', '<', '>', '<=', '>=', '<>', '!=',
  'like', 'not like', 'between', 'ilike', '~', '~*', '!~', '!~*',
  '&', '|', '#', '<<', '>>', '&&', '^', '@>', '<@', '||'
];

// Wraps a value (column, tableName) with the correct ticks.
Formatter_PG.prototype.wrapValue = function(value) {
  if (value === '*') return value;
  var matched = value.match(/(.*?)(\[[0-9]\])/);
  if (matched) return this.wrapValue(matched[1]) + matched[2];
  return '"' + value.replace(/"/g, '""') + '"';
};
