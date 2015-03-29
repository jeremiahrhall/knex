import Clause from './clause'
import extractAlias from '../'

class Join extends Clause {

  constructor(joinType, value, column) {
    this.joinType = joinType
    this.column   = column
    this.value    = value
    this.type     = 'join'
  }

  build(compile) {
    return `${this.joinType} JOIN ${compile(this.column)} ${compile(this.value)}`
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


function join(joinType, args) {
  switch(args.length) {
    case 
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

function innerJoin(args) {
  return join('INNER', args)
}

function leftJoin(args) {
  return join('LEFT', args)
}

function leftOuterJoin(args) {
  return join('LEFT OUTER', args)
}

function rightJoin(args) {
  return join('RIGHT', args)
}

function rightOuterJoin(args) {
  return join('RIGHT OUTER', args)
}

function outerJoin(args) {
  return join('OUTER', args)
}

function fullOuterJoin(args) {
  return join('FULL OUTER', args)
}

function crossJoin(args) {
  return join('CROSS', args)
}

function joinRaw(sql, bindings) {
  return new Join(raw(sql, bindings))
}
