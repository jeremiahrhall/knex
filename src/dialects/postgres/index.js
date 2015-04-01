
// PostgreSQL
// -------
var _        = require('lodash');
var inherits = require('inherits');

var Client  = require('../../client');
var Promise = require('../../promise');

var pg = (function() {
  try {
    return require('pg');
  } catch (e) {
    return require('pg.js');
  }
})();

var utils = require('./utils');

// Always initialize with the "QueryBuilder" and "QueryCompiler"
// objects, which extend the base 'lib/query/builder' and
// 'lib/query/compiler', respectively.
export class Engine_PG extends Engine {

  constructor(config) {
    super(config)
    if (config.returning) this.defaultReturning = config.returning;
    if (config.debug) this.isDebugging = true;
    this.connectionSettings = config.connection;
    this.pool = new Pool(assign({
      release(client, callback) { 
        client.end()
        callback()
      }
    }, config.pool))
  }

  get pool() {
    
  }

  get dialect() {
    return 'postgresql'
  }

  // Lazy load the pg dependency, since we might just be using
  // the client to generate SQL strings.
  initDriver() {

  }

  // Prep the bindings as needed by PostgreSQL.
  prepBindings(bindings, tz) {
    return _.map(bindings, utils.prepareValue);
  }

  endConnection(client, connection) {
    if (!connection || connection.__knex__disposed) return;
    if (client.pool.pool) {
      connection.__knex__disposed = true;
      client.pool.pool.destroy(connection);
    }
  }

  // Get a raw connection, called by the `pool` whenever a new
  // connection needs to be added to the pool.
  acquireRawConnection(callback) {
    /*jshint unused: false*/
    // TODO: use callback or remove callback
    var connection = new pg.Client(this.connectionSettings);
    this.databaseName = connection.database;

    var client = this;
    return new Promise(function(resolver, rejecter) {
      connection.connect(function(err, connection) {
        if (err) return rejecter(err);
        connection.on('error', endConnection.bind(null, client, connection));
        connection.on('end', endConnection.bind(null, client, connection));
        if (!client.version) {
          return client.checkVersion(connection).then(function(version) {
            client.version = version;
            resolver(connection);
          });
        }
        resolver(connection);
      });
    });
  }

  // Used to explicitly close a connection, called internally by the pool
  // when a connection times out or the pool is shutdown.
  destroyRawConnection(connection) {
    connection.end();
  }

  // In PostgreSQL, we need to do a version check to do some feature
  // checking on the database.
  checkVersion(connection) {
    return new Promise(function(resolver, rejecter) {
      connection.query('select version();', function(err, resp) {
        if (err) return rejecter(err);
        resolver(/^PostgreSQL (.*?) /.exec(resp.rows[0].version)[1]);
      });
    });
  }

}

// Position the bindings for the query.
function positionBindings(sql) {
  var questionCount = 0;
  return sql.replace(/\?/g, function() {
    questionCount++;
    return '$' + questionCount;
  });
}