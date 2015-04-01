// Builder
// -------
import {EventEmitter}  from 'events'
import JoinBuilder     from './join-builder'
import Elements        from './elements'
import knexInterface   from '../interface'
import whereInterface  from './interfaces/where'
import havingInterface from './interfaces/where'

import {extractAlias, mixin, clause} from '../helpers'
import {
  columns, column, table, not, or, set, values,
  where, whereIn, whereExists, whereBetween
} from '../sql'

// Typically called from `knex.builder`,
// start a new query building chain.
export default class QueryBuilder extends EventEmitter {

  constructor(engine) {
    this.engine   = engine
    this.elements = new Elements()

    // Internal flags used in the builder.
    this.__boolFlag = false  // false === and, true === or
    this.__notFlag  = false  // true  === not
    this.__cache    = false
  }

  compile(config) {
    if (this._promise) {
      
    }
    if (this.__cache) return this.__cache
    for (var item of this.elements) {

    }
  }

  [Symbol.iterator]() {
    return this.elements[Symbol.iterator]()
  }

  // A few getters to make the chain look nice:

  get and() {
    this.__boolFlag = false
    return this
  }
  get or() {
    this.__boolFlag = true
    return this
  }
  get not() {
    this.__notFlag = true
    return this
  }

  // Create a shallow clone of the current query builder.
  clone() {
    console.log('Builder.clone is deprecated, you can now compose queries using the knex.sql functions')
    var cloned = new this.constructor()
    cloned._method      = this._method
    cloned._transacting = this._transacting
    cloned._connection  = this._connection
    return cloned
  }

  addHook(location, fn) {
    return clause(this, hook(location, fn))
  }

  // Select
  // ------

  // Sets the values for a `select` query,
  // which is the same as specifying the columns.
  select() {
    switch(arguments.length) {
      case 0: return this;
      case 1: return clause(this, column(arguments[0]))
    }
    return clause(this, columns(...arguments))
  }

  // Allow for the current statement to be aliased
  as(ident) {
    return clause(this, aliasAs(ident), true)
  }

  // Sets the `tableName` on the query.
  // Alias to "from" for select and "into" for insert clauses
  // e.g. builder.insert({a: value}).into('tableName')
  table(tableName) {
    var [tbl, aliased] = extractAlias(tableName)
    tbl = table(tbl)
    if (aliased) tbl = aliasAs(tbl, aliased)
    return clause(this, tbl, true)
  }

  // Adds a `distinct` clause to the query.
  distinct() {
    return clause(this, distinct(columns(...arguments)))
  }

  // JOIN(s)

  join(...args) {
    return clause(this, innerJoin(args))
  }
  
  innerJoin(...args) {
    return clause(this, innerJoin(args))
  }

  leftJoin(...args) {
    return clause(this, leftJoin(args))
  }

  leftOuterJoin(...args) {
    return clause(this, leftOuterJoin(args))
  }

  rightJoin(...args) {
    return clause(this, rightJoin(args))
  }

  rightOuterJoin(...args) {
    return clause(this, rightOuterJoin(args))
  }

  outerJoin(...args) {
    return clause(this, outerJoin(args))
  }

  fullOuterJoin(...args) {
    return clause(this, fullOuterJoin(args))
  }

  crossJoin(...args) {
    return clause(this, crossJoin(args))
  }

  joinRaw(...args) {
    return clause(this, joinRaw(args))
  }

  // GROUP BY ${col}

  groupBy(item) {
    return clause(this, groupBy(item))
  }

  groupByRaw(sql, bindings) {
    return clause(this, groupBy(raw(sql, bindings)))
  }

  // ORDER BY ${col}

  orderBy(column, direction) {
    return clause(this, orderBy(column, direction))
  }

  orderByRaw(sql, bindings) {
    return clause(this, orderBy(raw(sql, bindings)))
  }

  // UNION [ALL] ${col}

  union(value, wrap) {
    if (wrap) return clause(this, wrap(union(value)))
    return clause(this, union(value))
  }

  unionAll(value, wrap) {
    if (wrap) return clause(this, wrap(unionAll(value)))
    return clause(this, unionAll(value))
  }

  // LIMIT ${n}

  limit(value) {
    return clause(this, limit(value), true)
  }

  // OFFSET ${n}

  offset(value) {
    return clause(this, offset(value), true)
  }

  // aggregates:
  
  count(column) {
    return aggregate(this, 'COUNT', column)
  }

  min(column) {
    return aggregate(this, 'MIN', column)
  }

  max(column) {
    return aggregate(this, 'MAX', column)
  }

  sum(column) {
    return aggregate(this, 'SUM', column)
  }

  avg(column) {
    return aggregate(this, 'AVG', column)
  }

  // increment / decrement helpers

  increment(column, amount = 1) {
    return clause(this, statementType('update'), true)
      .set(column, wrap(column(column), '', ` + ${int(amount)}`))
  }

  decrement(column, amount = 1) {
    return clause(this, statementType('update'), true)
      .set(column, wrap(column(column), '', ` - ${int(amount)}`))
  }

  // First object / pluck helpers

  first() {
    // onBeforeBuild -> order by, limit ??
    return this.hook('onResult', (rows) => rows && rows[0])
  }

  pluck(column) {
    return this.hook('onRow', (row) => pluck(row, column))
  }

  // Insert & Update
  // ------

  // Sets the values for an `insert` query.
  insert(values, returning) {
    switch(arguments.length) {
      case 1: return this.values(values)
      case 2: return this.values(values).returning(returning)
    }
  }

  // insertInto(tableName).values(vals)
  insertInto(tableName) {
    return this.into(tableName)
  }

  // .values(vals)
  values(vals) {
    return clause(this, values(vals), true)
  }

  // Sets the values for an `update`, allowing for:
  // .update(tableName).set(values)
  // .update(tableName).set(key, value)
  // .update(key, value, [returning])
  // .update(values, [returning])
  update(...args) {
    switch(args.length) {
      case 3: return this.update([args[1], args[2]], args[3])
      case 2: 
        if (typeof args[1] === 'string') {
          return this.update([args[1], args[2]])
        }
        return this.returning(args[2]).update(args[1])
      case 1: 
        if (typeof args[0] === 'string') {
          return this.tableName(args[0])
        }
    }
    return clause(this, statementType('update', set(args[0])))
  }

  set(key, value) {
    
  }

  upsert(columns) {
    // ?? TODO
  }

  withClause(clause) {
    return clause(this, withClause(clause), true)
  }

  withRecursive() {
    return clause(this, withRecursive(clause), true)
  }

  // Sets the returning value for the query.
  returning(returning) {
    return clause(this, returning(returning), true)
  }

  // Delete
  // ------

  // Executes a delete statement on the query
  delete(ret) {
    switch (arguments.length) {
      case 1: return this.returning(ret).delete()
    }
    return clause(this, statementType('delete'), true)
  }

  // Truncates a table, ends the query chain.
  truncate() {
    return clause(this, statementType('truncate'), true)
  }

  // Retrieves columns for the table specified by `knex(tableName)`
  columnInfo(column) {
    return clause(this, statementType('columnInfo', column), true)
  }

  // Set a lock for update constraint.
  forUpdate() {
    return clause(this, lock('update'), true)
  }

  // Set a lock for share constraint.
  forShare() {
    return clause(this, lock('share'), true)
  }

}

mixin(QueryBuilder, knexInterface)
mixin(QueryBuilder, whereInterface)
mixin(QueryBuilder, havingInterface)

function aggregate(builder, fnName, column) {
  var [ident, aliased] = extractAlias(column)
  var agg = fn(fnName, ident)
  if (aliased) agg = alias(agg, aliased)
  return agg
}

function int(val) {
  val = parseInt(val, 10)
  if (isNaN(val)) return 0
  return val
}

// Aliases:

QueryBuilder.prototype.del     = QueryBuilder.prototype.delete
QueryBuilder.prototype.column  = QueryBuilder.prototype.select
QueryBuilder.prototype.columns = QueryBuilder.prototype.select
QueryBuilder.prototype.from    = QueryBuilder.prototype.table
QueryBuilder.prototype.into    = QueryBuilder.prototype.table

QueryBuilder.prototype.andHaving = function() {
  console.log('andHaving is deprecated, you can just use an additional having statement.')
  return this.andHaving.apply(this, arguments)
}

QueryBuilder.prototype.andWhereRaw = function() {
  console.log('andWhereRaw is deprecated, you can just use an additional whereRaw statement.')
  return this.whereRaw.apply(this, arguments)
}

QueryBuilder.prototype.andWhere = function() {
  console.log('andWhere is deprecated, you can just use an additional where statement.')
  return this.where.apply(this, arguments)
}
