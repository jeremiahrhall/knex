import isArray   from 'lodash/lang/isArray'
import * as kwd  from './keywords'

import {
  parameter as p, 
  identifier as i
} from './wrapping'


class Operator {
  get grouping() {
    return this.statement.grouping
  }
}

// AND, OR, NOT
class LogicalOperator extends Operator {}

class AllOperator extends LogicalOperator {

  constructor(expression, comparison, subquery) {
    this.expression = expression
    this.comparison = comparison
    this.subquery   = subquery
    this.type       = 'AllOperator'
  }

  nodes() {
    return [this.value, this.statement]
  }
}

function all(fn) {

}

// <, >, <=, >=, =, <>, !=, BETWEEN
class ComparisonOperator extends Operator {
  constructor(operator, lhs, rhs) {
    this.lhs      = lhs
    this.rhs      = rhs
    this.operator = operator
    this.type     = 'ComparisonOperator'
  }
  nodes() {
    return [i(this.lhs), this.operator, p(this.rhs)]
  }
}

class BetweenOperator extends ComparisonOperator {
  nodes() {
    return [this.operator, p(this.lhs), kwd.AND, p(this.rhs)]
  }
}

// +, -, *, /, %, ^, |/, ||/, !, !!, @, &, |, #, ~, <<, >>
class ArithmeticOperator extends Operator {
  constructor() {
    this.type = 'ArithmeticOperator'
  }
  nodes() {
    
  }
}

export function between(a, b) {
  return new BetweenOperator(kwd.BETWEEN, a, b)
}

export function not(statement) {
  return new LogicalOperator(kwd.NOT, statement)
}

export function or(statement) {
  return new LogicalOperator(kwd.OR, statement)
}

export function any(subquery) {
  
}

export function some(subquery) {

}

// Comparison

// =
export function eq() {
  
}

// !=, <>
export function notEq() {

}

// <
export function lt() {

}

// >
export function gt() {

}

// <=
export function lte() {

}

// >=
export function gte() {

}

// Mathematical

// +
export function add(a, b) {
  
}

// -
export function subtract() {

}

// *
export function multiply() {

}

// /
export function divided() {

}

// %
export function modulo() {

}

// ^
export function exponent() {

}

// |/
export function sqrt() {

}

// ||/
export function cubeRoot() {

}

// !
export function factorial() {

}

// !!
export function factorialPrefix() {

}

// @
export function abs() {

}

// &
export function bitwiseAnd() {

}

// |
export function bitwiseOr() {

}

// #
export function xor() {

}

// ~
export function bitwiseNot() {

}

// <<
export function rightShift() {

}

// <<
export function leftShift() {

}

// IS NULL
export function isNull() {

}

export function and() {

}

export function like() {
  
}

export function ilike() {

}

export function rlike() {

}

export function regexp() {

}

// // MySQL:
// '=', '<', '>', '<=', '>=', '<>', '!=',
// 'like', 'not like', 'between', 'ilike',
// '&', '|', '^', '<<', '>>',
// 'rlike', 'regexp', 'not regexp'

// // Oracle:
// '=', '<', '>', '<=', '>=', '<>', '!=',
// 'like', 'not like', 'between', 'ilike',
// '&', '|', '^', '<<', '>>',
// 'rlike', 'regexp', 'not regexp'

// // PG:
// '=', '<', '>', '<=', '>=', '<>', '!=',
// 'like', 'not like', 'between', 'ilike', '~', '~*', '!~', '!~*',
// '&', '|', '#', '<<', '>>', '&&', '^', '@>', '<@', '||'

// // Baseline:
// '=', '<', '>', '<=', '>=', '<>', '!=',
// 'like', 'not like', 'between', 'ilike',
// '&', '|', '^', '<<', '>>',
// 'rlike', 'regexp', 'not regexp'

// // SQLite3:
// '=', '<', '>', '<=', '>=', '<>', '!=',
// 'like', 'not like', 'between', 'ilike',
// '&', '|', '<<', '>>'

