
export * from './operators'
export * from './wrapping'
export * from './where'

import isArray from 'lodash/lang/isArray'
import {identifier as i} from './wrapping'
import {AS, DISTINCT} from './keywords'

class Table {
  constructor(value) {
    this.value    = value
    this.grouping = 'table'
  }
  compile() {
    return i(this.value)
  }
}
export function table(value) {
  return new Table(value)
}

class Column {
  constructor(value) {
    this.value    = value
    this.distinct = false
    this.alias    = undefined
    this.type     = 'column'
    this.grouping = 'columns'
  }
  compile() {
    return [
      this.distinct ? DISTINCT : undefined,
      i(this.value),
      this.alias ? AS : undefined,
      i(this.alias)
    ]
  }
}

export function column(value) {
  return new Column(value)
}

export function columns(...cols) {
  return cols.map((val) => new Column(val))
}

class Cast {}

function cast(expression, type) {
  return new Cast(expression, type)
}

class Fn {
  constructor(fnName, params) {
    this.fnName = fnName
    this.params = params
  }
  build(builder) {
    return [`${fnName}(`, i(this.params), `)`]
  }
}

/**
 * Creates a new sql function call
 * @return {Fn} Instance of Fn class
 */
export function fn(fnName, ...params) {
  if (typeof fnName !== 'string') {
    throw new TypeError('The sql.fn takes a function as a string')
  }
  return new Fn(fnName, params)
}


class Alias {
  constructor(source, aliased) {
    this.source  = source
    this.aliased = aliased
  }
  build() {
    return [this.source, AS, this.aliased]
  }
}

function not(clause) {
  clause.negated = true
  return clause
}

function alias(source, aliased) {
  return new Alias(source, aliased)
}

// Ordering:

export function groupBy(value) {
  return new Node('GroupBy', value)
}

export function orderBy(value, direction = 'ASC') {
  return new Node('OrderBy', value, direction)
}

// Limit, Offset:

class LimitOffsetClause {

  constructor(type, value) {
    this.type     = type
    this.value    = value
    this.grouping = 'limitOffset'
  }

  build(target) {
    return [this.type, p(this.value)]
  }

}

function limit(value) {
  return new LimitOffsetClause(kwd.LIMIT, value)
}

function offset(value) {
  return new LimitOffsetClause(kwd.OFFSET, value)
}

export function set(values) {
  if (arguments.length !== 1) {
    throw new TypeError('Set takes an object or iterable')
  }
  if (isArray(values) && values.length > 0) {
    if (!isArray(values[0]) || values[0].length !== 2) {
      throw new TypeError()
    }
    for (var [k, v] of values) {

    }
  }
}

export function values(insertValues) {

}

class RawClause {
  constructor(sql, bindings) {
    this.sql      = sql
    this.bindings = bindings
  }
  compile() {
    // TODO: Split the raw string and mixin the bindings
    if (typeof this.sql === 'string') {
      return compileRaw(this.sql, this.bindings)
    }
    return this.sql
  }
}

function compileRaw(sql, bindings) {
  if (isArray(bindings)) {

  } else if (isPlainObject(bindings)) {

  }
  return sql
}
function compileNamedRaw(sql, obj) {
  var keys = Object.keys(obj)
  // for ()
}

export function raw(sql, bindings) {
  return new RawClause(sql, bindings)
}
