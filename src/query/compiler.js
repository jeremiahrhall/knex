// Query Compiler
// -------

class SQL {

  constructor(statement = '', bindings = []) {
    this.statement = statement
    this.bindings  = bindings
  }

  init() {

  }

  step(result, value) {

  }

  result() {
    return this
  }

}

// The "QueryCompiler" takes all of the query statements which have been
// gathered in the "QueryBuilder" and assembles them into a properly formatted / bound
// query string.
export default class QueryCompiler {
  
  constructor(elements) {
    this.elements = elements
  }

  select() {
    var sql = new SQL()
    for (var component of components) {
      t.into(sql, this.elements[component])
    }
    return sql
  }

  insert() {

  }

  update() {
    // [update(tableName), ]


    return new SQL(`UPDATE ${parameter(tableName)}`)
    return `UPDATE ${tableName} SET ${updateData.join(', ')}` (wheres ? ' ' + wheres : '');
  }

  // Compiles a `delete` query.
  del() {
    

    
    // Make sure tableName is processed by the formatter first.
    var tableName = this.tableName
    var wheres    = this.where()
    return `delete from ${this.tableName} `
  }

  // Compiles a `truncate` query.
  truncate() {
    return `truncate ${this.tableName}`
  }

  // Compiles the "locks".
  lock() {
    if (this.single.lock) {
      if (!this.transacting) {
        helpers.warn('You are attempting to perform a "lock" command outside of a transaction.');
      } else {
        return this[this.single.lock]();
      }
    }
  }

}