// Raw
// -------
import _ from 'lodash'
import {EventEmitter} from 'events'

class Raw extends EventEmitter {
  
  constructor(engine) {
    this.engine = engine
    this.sql    = null
  }

  set(sql, bindings) {
    this.sql = raw(sql, bindings)
    return this
  }

  // Wraps the current sql with `before` and `after`.
  wrap(prefix, suffix) {
    this.sql = wrap(this.sql, prefix, suffix)
    return this
  }

  // Calls `toString` on the Knex object.
  toString() {
    return this.toQuery()
  }

  // Returns the raw sql for the query.
  toSQL() {
    return {
      sql: this.sql,
      bindings: this.bindings
    }
  }

}

// Allow the `Raw` object to be utilized with full access to the relevant
// promise API.
require('./interface')(Raw);

module.exports = Raw;