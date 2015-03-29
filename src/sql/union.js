
class UnionClause extends Clause {

  constructor() {
    this.grouping = 'unions'
  }

}

function union(callback) {
  if (isArray(callback)) {
    return union(...callback)
  }
}

function unionAll(callbacks) {
  
}

  union() {
    if (arguments.length === 1 ||
        (arguments.length === 2 && _.isBoolean(wrap))) {
      if (!_.isArray(callbacks)) {
        callbacks = [callbacks];
      }
      for (var i = 0, l = callbacks.length; i < l; i++) {
        this._statements.push({
          grouping: 'union',
          clause: 'union',
          value: callbacks[i],
          wrap: wrap || false
        });
      }
    } else {
      callbacks = _.toArray(arguments).slice(0, arguments.length - 1);
      wrap = arguments[arguments.length - 1];
      if (!_.isBoolean(wrap)) {
        callbacks.push(wrap);
        wrap = false;
      }
      this.union(callbacks, wrap);
    }
    return this    
  }


    this._statements.push({
      grouping: 'union',
      clause: 'union all',
      value: callback,
      wrap: wrap || false
    });
    return this




  // Compile the "union" queries attached to the main query.
  union() {
    this.
    var onlyUnions = this.onlyUnions();
    var unions = this.grouped.union;
    if (!unions) return '';
    var sql = '';
    for (var i = 0, l = unions.length; i < l; i++) {
      var union = unions[i];
      if (i > 0) sql += ' ';
      if (i > 0 || !onlyUnions) sql += union.clause + ' ';
      var statement = this.formatter.rawOrFn(union.value);
      if (statement) {
        if (union.wrap) sql += '(';
        sql += statement;
        if (union.wrap) sql += ')';
      }
    }
    return sql;
  }

  // If we haven't specified any columns or a `tableName`, we're assuming this
  // is only being used for unions.
  onlyUnions() {
    return (!this.grouped.columns && this.grouped.union && !this.tableName);
  }
