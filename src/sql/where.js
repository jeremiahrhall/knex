
import Clause from './clause'
import {isArray, isBoolean, isString} from 'lodash/lang'
import {between, isNull, isIn, exists} from './operators'

class WhereClause extends Clause {

  constructor(value, column) {
    this.grouping = 'wheres'
    this.value    = value
    this.column   = column
    this.negated  = false
    this.or       = false
    this.wrapped  = false
  }

}

var wheres = this.grouped.where;
    if (!wheres) return;
    var sql = [];
    sql[0] = 'where';
    for (var i = 0, l = wheres.length; i < l; i++) {
      var stmt = wheres[i];
      if (i !== 0) sql.push(stmt.bool);
      sql.push(this[stmt.type](stmt));
    }
    return sql.length > 1 ? sql.join(' ') : '';

export function whereBetween(col, values) {
  if (!isArray(values) || values.length !== 2) {
    throw new TypeError('You must specify a two value array to the whereBetween clause')
  }
  return new WhereClause(between(values[0], values[1]), col)
}

export function whereExists(col, value) {
  return new WhereClause(exists(value), column)
}

export function whereIn(col, value) {
  return new WhereClause(isIn(value), col)
}


  multiWhereIn(statement) {
    return '(' + _.map(statement.column, this.formatter.wrap, this.formatter) + ') ' +
      this._not(statement, 'in ') + '((' +
      _.map(statement.value, this.formatter.parameterize, this.formatter).join('),(') + '))';
  }


export function where(...args) {
  switch (args.length) {
    case 1: return whereArity1(args[1])
    case 2: return whereArity2(args[1], args[2])
    case 3: return whereArity3(args[1], args[2], args[3])
  }
}

// e.g. where(raw()), where('col = 2'), where({col: 2, id: 2}), where(fn)
function whereArity1(value) {
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
  if (isPlainObject()) {
    return 
  }
}

function whereArity2() {

}

function whereArity3() {

}

whereIn(column, values)
if (_.isArray(values) && _.isEmpty(values)) return this.where(this._not());
    this._statements.push({
      grouping: 'where',
      type: 'whereIn',
      column: column,
      value: values,
      not: this._not(),
      bool: this._bool()
    });
    return this


    this._statements.push({
      grouping: 'where',
      type: 'whereExists',
      value: callback,
      not: this._not(),
      bool: this._bool(),
    });
    return this



  // Where Clause
  // ------

  whereIn(statement) {
    if (_.isArray(statement.column)) return this.multiWhereIn(statement);
    return this.formatter.wrap(statement.column) + ' ' + this._not(statement, 'in ') +
      this.wrap(this.formatter.parameterize(statement.value));
  }



// Processes an object literal provided in a "where" clause.
function _objectWhere(obj) {
  var boolVal = this._bool();
  for (var key in obj) {
    this[boolVal + 'Where'](key, obj[key]);
  }
  return this
}

function where(/* column, operator, value */) {

  // Support "where true || where false"
  if (column === false || column === true) {
    return this.whereRaw(column);
  }

  // Check if the column is a function, in which case it's
  // a where statement wrapped in parens.
  if (_.isFunction(column)) {
    return this.whereWrapped(column);
  }

  // Allow a raw statement to be passed along to the query.
  if (column instanceof Raw) return this.whereRaw(column);

  // Allows `where({id: 2})` syntax.
  if (_.isObject(column)) return this._objectWhere(column);

  // Enable the where('key', value) syntax, only when there
  // are explicitly two arguments passed, so it's not possible to
  // do where('key', '!=') and have that turn into where key != null
  if (arguments.length === 2) {
    value    = operator;
    operator = '=';

    // If the value is null, and it's a two argument query,
    // we assume we're going for a `whereNull`.
    if (value === null) {
      return this.whereNull(column);
    }
  }

  // lower case the operator for comparison purposes
  var checkOperator = ('' + operator).toLowerCase().trim();

  // If there are 3 arguments, check whether 'in' is one of them.
  if (arguments.length === 3) {
    if (checkOperator === 'in' || checkOperator === 'not in') {
      return this._not(checkOperator === 'not in').whereIn(arguments[0], arguments[2]);
    }
    if (checkOperator === 'between' || checkOperator === 'not between') {
      return this._not(checkOperator === 'not between').whereBetween(arguments[0], arguments[2]);
    }
  }

  // If the value is still null, check whether they're meaning
  // where value is null
  if (value === null) {

    // Check for .where(key, 'is', null) or .where(key, 'is not', 'null');
    if (checkOperator === 'is' || checkOperator === 'is not') {
      return this._not(checkOperator === 'is not').whereNull(column);
    }
  }

  // Push onto the where statement stack.
  this._statements.push({
    grouping: 'where',
    type: 'whereBasic',
    column: column,
    operator: operator,
    value: value,
    bool: this._bool()
  });
  return this  
}