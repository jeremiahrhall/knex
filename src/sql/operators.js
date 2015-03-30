import isArray from 'lodash/lang/isArray'

class Operator {

  constructor(type, value) {
    this.type  = type
    this.value = value
  }

}

function any(subquery) {
  
}

function some(subquery) {

}

// Comparison

// =
function eq() {
  
}

// <
function lt() {

}

// >
function gt() {

}

// <=
function lte() {

}

// >=
function gte() {

}

// <>, !=
// not(eq())

// Mathematical

// +
function add(a, b) {
  switch(arguments.length) {

  }
}

// -
function subtract() {

}

// *
function multiply() {

}

// /
function divided() {

}

// %
function modulo() {

}

// ^
function exponent() {

}

// |/
function sqrt() {

}

// ||/
function cubeRoot() {

}

// !
function factorial() {

}

// !!
function factorialPrefix() {

}

// @
function abs() {

}

// &
function bitwiseAnd() {

}

// |
function bitwiseOr() {

}

// #
function xor() {

}

// ~
function bitwiseNot() {

}

// <<
function leftShift() {

}

// IS NULL
function isNull() {

}

function and() {

}

function like() {
  
}

function ilike() {

}

function between() {
  
}

function tilde() {

}

function tildeStar() {

}

function bangTilde() {

}

function bangTildeStar() {

}

function rlike() {

}

function regexp() {

}

function leftShift() {

}

function rightShift() {

}

function or(...statements) {
  if (statements.length === 0) {
    return empty()
  }
  if (statements.length === 1) {
    if (isArray(statements[0])) {
      return or(...statements[0])
    }
    return new Operator('OR', statement)
  }
  var wrapped = []
  for (var statement of statements) {
    wrapped.push(or(statement))
  }
  return wrap(wrapped)
}

  '=', '<', '>', '<=', '>=', '<>', '!=',
  'like', 'not like', 'between', 'ilike',
  '&', '|', '^', '<<', '>>',
  'rlike', 'regexp', 'not regexp'
