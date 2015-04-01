// "Base Engine"
// ------
import _              from 'lodash'
import {EventEmitter} from 'events'
import Promise        from './promise'

// The base engine provides the general structure
// for a dialect specific engine object. The engine
// object attaches fresh constructors for each component
// of the library.
export default class Engine extends EventEmitter {

  constructor(config) {
    this.isDebugging     = false
    this.migrationConfig = _.clone(config && config.migrations)
    this.seedConfig      = _.clone(config && config.seeds)
  }

  // Acquire a connection from the pool.
  acquireConnection() {
    return new Promise((resolver, rejecter) => {
      this.pool.acquire((err, connection) => {
        if (err) return rejecter(err)
        resolver(connection)
      })
    })
  }

  // Releases a connection from the connection pool,
  // returning a promise resolved when the connection is released.
  releaseConnection(connection) {
    return new Promise((resolver, rejecter) => {
      this.pool.release(connection, (err) => {
        if (err) return rejecter(err)
        resolver(connection)
      })
    })
  }

  // Destroy the current connection pool for the engine.
  destroy(callback) {
    var promise = new Promise((resolver, rejecter) => {
      if (!this.pool) return resolver()
      this.pool.destroy((err) => {
        if (err) return rejecter(err)
        resolver()
      })
    })
    
    // Allow either a callback or promise interface for destruction.
    if (typeof callback === 'function') {
      promise.asCallback(callback)
    } else {
      return promise;
    }
  }

  get engine() {
    return this.dialect
  }

  // Return the database being used by this engine.
  get databaseName() {
    return this.connectionSettings.database
  }

}
