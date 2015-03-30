// Builder
// -------
import _              from 'lodash'
import {EventEmitter} from 'events'
import helpers        from './helpers'
import JoinBuilder    from './join-builder'
import Statements     from ''
import {extractAlias} from './helpers'

// Typically called from `knex.builder`,
// start a new query building chain.
export class QueryBuilder extends EventEmitter {

  constructor(engine) {
    this.engine   = engine
    this.elements = new Statements()

    // Internal flags used in the builder.
    this.__boolFlag = false  // false === and, true === or
    this.__notFlag  = false  // true  === not
  }

  build(config) {
    if (this._promise) {
      
    }
  }

  // A few getters to make the chain look nice:

  get and() {
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
  select(...args) {
    return clause(this, columns(...args))
  }

  // Allow for the current statement to be aliased
  as(ident) {
    return clause(this, alias(ident), true)
  }

  // Sets the `tableName` on the query.
  // Alias to "from" for select and "into" for insert statements
  // e.g. builder.insert({a: value}).into('tableName')
  table(tableName) {
    return clause(this, table(extractAlias(tableName)), true)
  }

  // Adds a `distinct` clause to the query.
  distinct() {
    return clause(this, distinct(columns(...arguments)))
  }

  // Adds a join clause to the query, allowing for advanced joins
  // with an anonymous function as the second argument.
  // function(table, first, operator, second)
  join(...args) {
    return clause(this, innerJoin(args))
  }

  // JOIN blocks:
  // ----------
  
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

  // The where function can be used in several ways:
  // The most basic is `where(key, value)`, which expands to
  // where key = value.
  where(...args) {
    return clause(this, where(...args))
  }

  // Adds an `or where` clause to the query.
  orWhere(...args) {
    return clause(this, or(where(...args)))
  }

  whereNot(...args) {
    return clause(this, not(where(...args)))
  }

  orWhereNot(...args) {
    return clause(this, not(or(where(...args))))
  }

  // Adds a raw `where` clause to the query.
  whereRaw(sql, bindings) {
    return clause(this, where(raw(...args)))
  }

  orWhereRaw(sql, bindings) {
    return clause(this, or(where(raw(...args))))
  }

  // Helper for compiling any advanced `where` queries.
  whereWrapped(callback) {
    return clause(this, wrap(where(callback)))
  }

  // Adds a `where exists` clause to the query.
  whereExists(callback) {
    return clause(this, whereExists(callback))
  }

  // Adds an `or where exists` clause to the query.
  orWhereExists(callback) {
    return clause(this, or(whereExists(callback)))
  }

  // Adds a `where not exists` clause to the query.
  whereNotExists(callback) {
    return clause(this, not(whereExists(callback)))
  }

  // Adds a `or where not exists` clause to the query.
  orWhereNotExists(callback) {
    return clause(this, or(not(whereExists(callback))))
  }

  // Adds a `where in` clause to the query.
  whereIn(column, value) {
    return clause(this, whereIn(column, value))
  }

  // Adds a `or where in` clause to the query.
  // Arguments: column, values
  orWhereIn(column, value) {
    return clause(this, or(whereIn(column, value)))
  }

  // Adds a `where not in` clause to the query.
  whereNotIn(column, value) {
    return clause(this, not(whereIn(column, value))
  }

  // Adds a `or where not in` clause to the query.
  orWhereNotIn(column, value) {
    return clause(this, or(not(whereIn(column, value))))
  }

  // Adds a `where null` clause to the query.
  whereNull(column) {
    return clause(this, where(isNull(column)))
  }

  // Adds a `or where null` clause to the query.
  orWhereNull(column) {
    return clause(this, or(where(isNull(column)))
  }

  // Adds a `where not null` clause to the query.
  whereNotNull(column) {
    return clause(this, not(where(isNull(column))))
  }

  // Adds a `or where not null` clause to the query.
  orWhereNotNull(column) {
    return clause(this, or(not(where(isNull(column))))
  }

  // Adds a `where between` clause to the query.
  whereBetween(column, values) {
    return clause(this, where(between(column, values)))
  }

  // Adds a `where not between` clause to the query.
  whereNotBetween(column, values) {
    return clause(this, not(where(between(column, values))))
  }

  // Adds a `or where between` clause to the query.
  orWhereBetween(column, values) {
    return clause(this, or(where(between(column, values))))
  }

  // Adds a `or where not between` clause to the query.
  orWhereNotBetween(column, values) {
    return clause(this, or(not(where(between(column, values)))))
  }

  // Adds a `group by` clause to the query.
  groupBy(item) {
    return clause(this, groupBy(item))
  }

  // Adds a raw `group by` clause to the query.
  groupByRaw(sql, bindings) {
    return clause(this, groupBy(raw(sql, bindings)))
  }

  // Adds a `order by` clause to the query.
  orderBy(column, direction) {
    return clause(this, orderBy(column, direction))
  }

  // Add a raw `order by` clause to the query.
  orderByRaw(sql, bindings) {
    return clause(this, orderBy(raw(sql, bindings)))
  }

  // Add a union statement to the query.
  union(value, wrap) {
    if (wrap) return clause(this, wrap(union(value)))
    return clause(this, union(value))
  }

  // Adds a union all statement to the query.
  unionAll(value, wrap) {
    if (wrap) return clause(this, wrap(unionAll(value)))
    return clause(this, unionAll(value))
  }

  // Adds a `having` clause to the query.
  having() {
    return clause(this, having(...arguments))
  }

  // Adds an `or having` clause to the query.
  orHaving() {
    return clause(this, or(having(...arguments)))
  }
  
  havingRaw(sql, bindings) {
    return clause(this, having(raw(sql, bindings)))
  }
  
  orHavingRaw(sql, bindings) {
    return clause(this, or(having(raw(sql, bindings))))
  }

  // Helper for compiling any advanced `having` queries.
  havingWrapped(callback) {
    return clause(this, wrap(having(callback)))
  }  

  // Only allow a single "offset" to be set for the current query.
  offset(value) {
    return clause(this, offset(value), true)
  }

  // Only allow a single "limit" to be set for the current query.
  limit(value) {
    return clause(this, limit(value), true)
  }

  // Retrieve the "count" result of the query.
  count(column) {
    return clause(this, count(column))
  }

  // Retrieve the minimum value of a given column.
  min(column) {
    return aggregate(this, min, column)
  }

  // Retrieve the maximum value of a given column.
  max(column) {
    return aggregate(this, max, column)
  }

  // Retrieve the sum of the values of a given column.
  sum(column) {
    return aggregate(this, sum, column)
  }

  // Retrieve the average of the values of a given column.
  avg(column) {
    return aggregate(this, avg, column)
  }

  // Increments a column's value by the specified amount.
  increment(column, amount = 1) {
    return clause(this, modifier('update'))
      .set(column, wrap(column(column), '', ` + ${int(amount)}`))
  }

  // Decrements a column's value by the specified amount.
  decrement(column, amount = 1) {
    return clause(this, modifier('update'))
      .set(column, wrap(column(column), '', ` - ${int(amount)}`))
  }

  // Sets the values for a `select` query, informing that only the first
  // row should be returned (limit 1).
  first() {
    return clause(this, modifier('first'))
  }

  // Pluck a column from a query.
  pluck(column) {
    return clause(this, modifier('pluck', column))
  }

  // Insert & Update
  // ------

  // Sets the values for an `insert` query.
  insert(values, returning) {
    this._method = 'insert'
    if (!_.isEmpty(returning)) this.returning(returning)
    this._single.insert = values
    return this
  }

  insertInto(tableName) {
    return this.tableName(tableName)
  }

  values(insertValues) {
    
  }

  // Sets the values for an `update`, allowing for both
  // `.update(key, value, [returning])` and `.update(obj, [returning])` syntaxes.
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
    return clause(this, modifier('update', set(args[0])))
  }

  set(key, value) {
    switch (arguments.length) {
      case 1: 
      case 2: 
    }
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
    return clause(this, modifier('delete'), true)
  }

  // Truncates a table, ends the query chain.
  truncate() {
    return clause(this, modifier('truncate'), true)
  }

  // Retrieves columns for the table specified by `knex(tableName)`
  columnInfo(column) {
    return clause(this, modifier('columnInfo', column), true)
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

mixin(QueryBuilder, builderInterface)

function clause(builder, statement, single) {
  builder.__cache = false
  if (builder.__notFlag) {
    builder.__notFlag = false
    return clause(builder, not(statement))
  }
  if (builder.__boolFlag) {
    builder.__boolFlag = false
    return clause(builder, or(statement))
  }
  if (single) {
    builder.statements[statement.type] = statement
    return builder
  }
  if (!builder.statements.hasOwnProperty(statement.type)) {
    builder.statements[statement.type] = []
  }
  builder.statements[statement.type].push(statement)
  return builder
}

function aggregate(builder, fn, column) {
  var extracted = extractAlias(column)
  if (extracted !== column) {
    return alias(extracted.column, )
  }
}

function int(val) {
  val = parseInt(val, 10)
  if (isNaN(val)) return 0
  return val;
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
