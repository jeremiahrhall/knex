
var _            = require('lodash');
var Client_MySQL = require('../mysql');
var Promise      = require('../../promise');

try {
  var Mariasql = require('mariasql');  
} catch (e) {
  error('The MariaSQL driver must be installed, please run npm install --mariasql')
  process.exit()
}

// Always initialize with the "QueryBuilder" and "QueryCompiler"
// objects, which extend the base 'lib/query/builder' and
// 'lib/query/compiler', respectively.
export class Engine_MariaSQL extends Engine_MySQL {
  
  get dialect() {
    return 'mariasql'
  }

  // Get a raw connection, called by the `pool` whenever a new
  // connection needs to be added to the pool.
  acquireRawConnection() {
    var connection = new Mariasql();
    connection.connect(_.extend({metadata: true}, this.connectionSettings));
    return new Promise(function(resolver, rejecter) {
      connection.on('connect', function() {
        connection.removeAllListeners('end');
        connection.removeAllListeners('error');
        resolver(connection);
      })
      .on('error', rejecter);
    });
  };

  // Return the database for the MariaSQL client.
  database() {
    return this.connectionSettings.db;
  }

}
