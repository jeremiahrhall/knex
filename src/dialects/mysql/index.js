// MySQL Client
// -------
import clone   from 'lodash/object/clone'
import Engine  from '../base/engine'
import Client  from '../../client'
import Promise from '../../promise'

// Always initialize with the "QueryBuilder" and "QueryCompiler"
// objects, which extend the base 'lib/query/builder' and
// 'lib/query/compiler', respectively.
export default class Engine_MySQL extends Engine {

  constructor(config) {
    this.driver = require('mysql')
    if (config.debug) this.isDebugging = true
    this.connectionSettings = clone(config.connection)
    this.pool = new this.Pool(config.pool)
  }

  // The "dialect", for reference elsewhere.
  get dialect() {
    return 'mysql'
  }

  // MySQL Specific error handler
  connectionErrorHandler(client, connection, err) {
    if (connection && err && err.fatal) {
      if (connection.__knex__disposed) return
      connection.__knex__disposed = true
      client.pool.destroy(connection)
    }
  }

  // Get a raw connection, called by the `pool` whenever a new
  // connection needs to be added to the pool.
  acquireRawConnection() {
    var client = this
    var connection = mysql.createConnection(this.connectionSettings)
    this.databaseName = connection.config.database
    return new Promise(function(resolver, rejecter) {
      connection.connect(function(err) {
        if (err) return rejecter(err)
        connection.on('error', connectionErrorHandler.bind(null, client, connection))
        connection.on('end', connectionErrorHandler.bind(null, client, connection))
        resolver(connection)
      })
    })
  }

  // Used to explicitly close a connection, called internally by the pool
  // when a connection times out or the pool is shutdown.
  destroyRawConnection(connection) {
    connection.end()
  }

}