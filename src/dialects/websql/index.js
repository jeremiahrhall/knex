import Engine_SQLite3 from '../sqlite3/engine'

export default class Engine_WebSQL extends Engine_SQLite3 {

  constructor(config = {}) {
    super(config)
    this.name          = config.name || 'knex_database'
    this.version       = config.version || '1.0'
    this.displayName   = config.displayName || this.name
    this.estimatedSize = config.estimatedSize || 5 * 1024 * 1024
  }

  get dialect() {
    return 'websql'
  }

  transaction() {
    return this
  }

  acquireConnection() {
    return new Promise((resolve, reject) => {
      try {
        /*jslint browser: true*/
        var db = openDatabase(this.name, this.version, this.displayName, this.estimatedSize)
        db.transaction((t) => {
          t.__cid = _.uniqueId('__cid')
          resolve(t)
        })
      } catch (e) {
        reject(e)
      }
    })
  }

  releaseConnection() {
    return new Promise((resolver) => resolver())
  }

}