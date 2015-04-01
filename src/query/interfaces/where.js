import {or, not, raw, where, whereExists, whereBetween, whereNull} from '../../sql'
import {clause, mixin} from '../../helpers'

var whereInterface = {

  // [AND | OR] WHERE [NOT]

  where() {
    return clause(this, whereDispatch(...arguments))
  },

  orWhere() {
    return clause(this, or(whereDispatch(...arguments)))
  },

  whereNot() {
    return clause(this, not(whereDispatch(...arguments)))
  },

  orWhereNot() {
    return clause(this, or(not(whereDispatch(...arguments))))
  },

  whereRaw(sql, bindings) {
    return clause(this, whereRaw(raw(sql, bindings)))
  },

  orWhereRaw(sql, bindings) {
    return clause(this, or(whereRaw(raw(sql, bindings))))
  },

  // [AND | OR] WHERE [NOT] EXISTS (subquery)

  whereExists(callback) {
    return clause(this, whereExists(callback))
  },

  orWhereExists(callback) {
    return clause(this, or(whereExists(callback)))
  },

  whereNotExists(callback) {
    return clause(this, not(whereExists(callback)))
  },

  orWhereNotExists(callback) {
    return clause(this, or(not(whereExists(callback))))
  },

  // [AND | OR] WHERE [NOT] IN

  whereIn(column, value) {
    return clause(this, whereIn(column, value))
  },

  orWhereIn(column, value) {
    return clause(this, or(whereIn(column, value)))
  },

  whereNotIn(column, value) {
    return clause(this, not(whereIn(column, value)))
  },

  orWhereNotIn(column, value) {
    return clause(this, or(not(whereIn(column, value))))
  },

  // [AND | OR] WHERE ${col} IS [NOT] NULL

  whereNull(column) {
    return clause(this, whereNull(column))
  },

  orWhereNull(column) {
    return clause(this, or(whereNull(column)))
  },

  whereNotNull(column) {
    return clause(this, not(whereNull(column)))
  },

  orWhereNotNull(column) {
    return clause(this, or(not(whereNull(column))))
  },

  // [AND | OR] WHERE ${col} [NOT] BETWEEN ${a} AND ${b}

  whereBetween(column, values) {
    return clause(this, whereBetween(column, values))
  },

  whereNotBetween(column, values) {
    return clause(this, not(whereBetween(column, values)))
  },

  orWhereBetween(column, values) {
    return clause(this, or(whereBetween(column, values)))
  },

  orWhereNotBetween(column, values) {
    return clause(this, or(not(whereBetween(values))))
  }

}

class WhereElements {
  constructor() {
    this.wheres = []
  }
}

export default class WhereBuilder {
  constructor() {
    this.elements = new WhereElements()
    this.grouping = 'wheres'
  }
  [Symbol.iterator]() {

  }
}
mixin(WhereBuilder, whereInterface)

function whereDispatch(...args) {
  switch (args.length) {
    case 0: return;
    case 1: return whereArity1(args[0])
    case 2: return whereArity2(args[0], args[1])
    case 3: return where(args[0], args[1], args[2])
  }
}

// e.g. where(raw()), where('col = 2'), where({col: 2, id: 2}), where(fn)
function whereArity1(value) {
  if (typeof value === 'function') {
    var w = new WhereBuilder()
    value.call(w, w)
    return w
  }
  if (isClause(value)) {
    return new WhereClause(value)
  }
  if (isFunction(value)) {
    return new WhereClause(wrap(builder(value)))
  }
  if (isBoolean(value)) {
    return new WhereClause(wrap(bool(value)))
  }
  if (isString(value)) {
    
  }
}

function whereArity2(column, value) {
  if (value === null) {
    return new WhereClause(isNull(value), column)
  }
  return where(column, '=', value)
}

export default whereInterface
