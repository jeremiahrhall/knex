import {isArray, isBoolean, isString} from 'lodash/lang'
import {
  between, isNull, isIn, exists,
  lt, gt, eq, notEq
} from './operators'
import {OR, AND, WHERE} from './keywords'
import {identifier as i, parameter as p} from './wrapping'

class WhereExpression {
  
  constructor(column, operator, value) {
    this.column     = column
    this.operator   = operator
    this.value      = value
    this.grouping   = 'wheres'
    this.negated    = false
    this.or         = false
    this.type       = 'WhereExpression'
  }

  // OR WHERE NOT EXISTS value

  compile() {
    return [
      this.or ? OR : AND,
      WHERE,
      i(this.column),
      this.negated ? NOT : undefined,
      this.operator,
      p(this.value)
    ]
  }
}

export function where(column, operator, value) {
  if (typeof operator === 'string') {
    return new WhereExpression(operatorToFn[operator](value), column)  
  }
}

const operatorToFn = {
  '>': gt,
  '<': lt,
  '=': eq,
  '<>': notEq,
  '!=': notEq
}

export function whereBetween(col, values) {
  if (!isArray(values) || values.length !== 2) {
    throw new TypeError('You must specify a two value array to the whereBetween clause')
  }
  return where(col, kwd.BETWEEN, and(values[0], values[1]))
}

export function whereExists(fn) {
  if (typeof fn === 'function') {

  }
  return new WhereExpression(exists(value), column)
}

export function whereIn(col, value) {
  if (isArray(value) && isArray(value[0])) {
    // TODO: Multi where in...
  }
  return where(col, kwd.IN, value)
}

export function whereNull(col, value) {

}

export function whereRaw(raw) {
  return new WhereExpression(raw)
}

// multiWhereIn(statement) {
//   return '(' + _.map(statement.column, this.formatter.wrap, this.formatter) + ') ' +
//     this._not(statement, 'in ') + '((' +
//     _.map(statement.value, this.formatter.parameterize, this.formatter).join('),(') + '))';
// }
