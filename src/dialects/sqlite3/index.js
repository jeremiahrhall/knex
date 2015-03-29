// SQLite3
// -------

var Client  = require('../../client')
var Promise = require('../../promise')

// Lazy load the sqlite3 module, since we might just be using
// the client to generate SQL strings.
var sqlite3 = require('sqlite3')

class Engine_SQLite3 extends Engine {
  
  constructor(config) {
    super(config)
    if (config.debug) this.isDebugging = true
    this.connectionSettings = config.connection
    this.initPool()
    this.pool = new this.Pool(config.pool)
  }

  get dialect() {
    return 'sqlite3'
  }

  // Get a raw connection from the database, returning a promise with the connection object.
  acquireRawConnection() {
    var driver = this
    return new Promise(function(resolve, reject) {
      var db = new sqlite3.Database(driver.connectionSettings.filename, function(err) {
        if (err) return reject(err)
        resolve(db)
      })
    })
  }

  // Used to explicitly close a connection, called internally by the pool
  // when a connection times out or the pool is shutdown.
  // TODO: See if this is needed.
  destroyRawConnection(connection) {
    return new Promise(() => {
      return connection.close()
    })
  }

module.exports = Client_SQLite3