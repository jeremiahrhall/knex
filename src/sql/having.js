
class Having extends Clause {

  constructor(value) {
    this.type    = 'having'
    this.value   = value
    this.negated = false
    this.or      = false
    this.wrapped = false
  }

}

function having(...args) {
  switch(args.length) {
    
  }
}

function havingArity1() {

}

function havingArity2() {

}

function havingArity3() {
  
}

  arguments.slice(0, 1)


  if (isClause(value)) {
    return new Having(value)
  }
}



    this._statements.push({
      grouping: 'having',
      type: 'whereWrapped',
      value: callback,
      bool: this._bool()
    });
    return this


    if (column instanceof Raw && arguments.length === 1) {
      return this._havingRaw(column);
    }
    
    // Check if the column is a function, in which case it's
    // a having statement wrapped in parens.
    if (_.isFunction(column)) {
      return this.havingWrapped(column);
    }
    
    this._statements.push({
      grouping: 'having',
      type: 'havingBasic',
      column: column,
      operator: operator,
      value: value,
      bool: this._bool()
    });
    return this

  // Adds a raw `having` clause to the query.
  _havingRaw(sql, bindings) {
    var raw = (sql instanceof Raw ? sql : new Raw(sql, bindings));
    this._statements.push({
      grouping: 'having',
      type: 'havingRaw',
      value: raw,
      bool: this._bool()
    });
    return this
  }

    