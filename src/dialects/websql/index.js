

// WebSQL
// -------
var inherits = require('inherits');
var _        = require('lodash');

import SQLite3_Engine from '../sqlite3/engine'

var Client_SQLite3 = require('../sqlite3/index');
var Promise = require('../../promise');

class Engine_WebSQL extends SQLite3_Engine {

  constructor(config = {}) {
    super()
  }

  get dialect() {
    return 'websql'
  }

  get transaction() {
    return this;
  }

  acquireConnection() {
    return new Promise((resolve, reject) => {
      try {
        /*jslint browser: true*/
        var db = openDatabase(this.name, this.version, this.displayName, this.estimatedSize);
        db.transaction(function(t) {
          t.__cid = _.uniqueId('__cid');
          resolve(t);
        });
      } catch (e) {
        reject(e);
      }
    });
  }

}

function Client_WebSQL(config) {
  config = config || {};
  Client_SQLite3.super_.apply(this, arguments);
  if (config.debug) this.isDebugging = true;
  this.name = config.name || 'knex_database';
  this.version = config.version || '1.0';
  this.displayName = config.displayName || this.name;
  this.estimatedSize = config.estimatedSize || 5 * 1024 * 1024;
  this.initDriver();
  this.initRunner();
  this.transaction = function () {
    return this;
  };
}
inherits(Client_WebSQL, Client_SQLite3);

Client_WebSQL.prototype.dialect = 'websql';
Client_WebSQL.prototype.initDriver = function() {};
Client_WebSQL.prototype.initPool = function() {};
Client_WebSQL.prototype.initMigrator = function() {};

// Initialize the query "runner"
Client_WebSQL.prototype.initRunner = function() {
  require('./runner')(this);
};

// Used to explicitly close a connection, called internally by the pool
// when a connection times out or the pool is shutdown.
Client_WebSQL.prototype.releaseConnection = Promise.method(function() {});

module.exports = Client_WebSQL;