import Clause from './clause'
import {JOIN} from './keywords'

class Join extends Clause {

  constructor(joinType, a) {
    this.joinType  = joinType
    this.column    = column
    this.value     = value
    this.grouping  = 'joins'
    this.type      = 'JoinClause'
  }

  build(compile) {
    let {joinType, column, value}
    return [joinType, kwd.JOIN, column, value]
  }

}

function using() {
  
}

function on() {

}

var joins = this.grouped.join;
if (!joins) return '';
var sql = _.reduce(joins, function(acc, join) {
  if (join.joinType === 'raw') {
    acc.push(this.formatter.checkRaw(join.table));
  } else {
    acc.push(join.joinType + ' join ' + this.formatter.wrap(join.table));
    _.each(join.clauses, function(clause, i) {
      acc.push(i > 0 ? clause[1] : clause[0]);
      acc.push(this.formatter.wrap(clause[2]));
      if (clause[3]) acc.push(this.formatter.operator(clause[3]));
      if (clause[4]) acc.push(this.formatter.wrap(clause[4]));
    }, this);
  }
  return acc;
}, [], this);
return sql.length > 0 ? sql.join(' ') : '';

function joinArity1(join) {
  if (isClause(join)) {
    
  }
  if (isString(join)) {
    
  }
  if (isFucntion(join)) {
    
  }
}

export function join(joinType, args) {
  switch(args.length) {
    case 1: return joinArity1(joinType, args[0])
    case 2: return joinArity2(joinType, args[0], args[1])
    case 2: return joinArity3(joinType, args[0], args[1])
  }

  if (_.isFunction(first)) {
    join = new Join(table, joinType);
    first.call(join, join);
  } else if (joinType === 'raw') {
    join = new Join(new Raw(table, first), 'raw');
  } else {
    join = new Join(table, joinType);
    if (arguments.length > 1) {
      join.on.apply(join, _.toArray(arguments).slice(1));
    }
  }
  this._statements.push(join);
  return this
}

export function innerJoin(args) {
  return join(kwd.INNER, args)
}

export function leftJoin(args) {
  return join(kwd.LEFT, args)
}

export function leftOuterJoin(args) {
  return join(kwd.LEFT_OUTER, args)
}

export function rightJoin(args) {
  return join(kwd.RIGHT, args)
}

export function rightOuterJoin(args) {
  return join(kwd.RIGHT_OUTER, args)
}

export function outerJoin(args) {
  return join(kwd.OUTER, args)
}

export function fullOuterJoin(args) {
  return join(kwd.FULL_OUTER, args)
}

export function crossJoin(args) {
  return join(kwd.CROSS, args)
}

export function joinRaw(sql, bindings) {
  return new Join(raw(sql, bindings))
}
