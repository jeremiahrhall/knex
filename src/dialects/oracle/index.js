
// Oracle Engine
// -------
import _        from  'lodash'
import Engine   from  '../base'
import Promise  from  '../../promise'
import {ReturningHelper} from './utils'

// Always initialize with the "QueryBuilder" and "QueryCompiler"
// objects, which extend the base 'lib/query/builder' and
// 'lib/query/compiler', respectively.
export default class Engine_Oracle extends Engine {

  constructor(config) {
    super(config)
    this.driver = require('oracle')
    if (config.debug) this.isDebugging = true
    this.connectionSettings = _.clone(config.connection)
    this.initPool()
    this.pool = new this.Pool(config.pool)
  }

  get dialect() {
    return 'oracle'
  }

  // Get a raw connection, called by the `pool` whenever a new
  // connection needs to be added to the pool.
  acquireRawConnection() {
    return new Promise((resolver, rejecter) => {
      return this.driver.connect(this.connectionSettings, (err, connection) => {
        if (err) return rejecter(err)
        if (self.connectionSettings.prefetchRowCount) {
          connection.setPrefetchRowCount(self.connectionSettings.prefetchRowCount)
        }
        resolver(connection)
      })
    })
  }

  // Used to explicitly close a connection, called internally by the pool
  // when a connection times out or the pool is shutdown.
  destroyRawConnection(connection) {
    connection.close()
  }

  // Return the database for the Oracle client.
  database() {
    return this.connectionSettings.database
  }

  // Position the bindings for the query.
  positionBindings(sql) {
    var questionCount = 0
    return sql.replace(/\?/g, function() {
      questionCount += 1
      return ':' + questionCount
    })
  }

  preprocessBindings(bindings) {
    if (!bindings) return;
    return bindings.map(function(binding) {
      if (binding instanceof ReturningHelper && driver) {
        // returning helper uses always ROWID as string
        return new this.driver.OutParam(driver.OCCISTRING)
      }
      if (typeof binding === 'boolean') {
        return binding ? 1 : 0
      }
      return binding
    })
  }

}