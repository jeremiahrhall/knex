
function first() {
  var i, args = new Array(arguments.length);
  for (i = 0; i < args.length; i++) {
    args[i] = arguments[i];
  }
  this.select.apply(this, args);
  this._method = 'first';
  this.limit(1);
  return this  
}

function pluck() {
  this._method = 'pluck';
  this._single.pluck = column;
  this._statements.push({
    grouping: 'columns',
    type: 'pluck',
    value: column
  });
  return this  
}