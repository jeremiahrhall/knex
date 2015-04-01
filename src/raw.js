// Raw
// -------
import _              from 'lodash'
import {raw, wrap}    from './sql'
import {EventEmitter} from 'events'
import knexInterface  from './interface'
import {mixin}        from './helpers'

export default class Raw extends EventEmitter {
  
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

}

mixin(Raw, knexInterface)