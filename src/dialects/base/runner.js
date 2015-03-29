import {isArray, isFunction} from 'lodash/lang'
import assign from 'lodash/object/assign'

var _            = require('lodash');
var Promise      = require('./promise');
var PassThrough  = require('readable-stream').PassThrough

// The "Runner" constructor takes a "builder" (query, schema, or raw)
// and runs through each of the query statements, calling any additional
// "output" method provided alongside the query and bindings.
export class BaseRunner {
  
  constructor(engine) {
    this.engine  = engine;
    this.queries = [];

    // The "connection" object is set on the runner when
    // "run" is called.
    this.connection = void 0;
  }

  // "Run" the target, calling "toSQL" on the builder, returning
  // an object or array of queries to run, each of which are run on
  // a single connection.
  run() {
    if (this.builder._transacting) {
      return this.transactionQuery();
    }
    return Promise.bind(this)
      .then(this.ensureConnection)
      .then(function(connection) {
        this.connection = connection;

        // Emit a "start" event on both the builder and the client,
        // allowing us to listen in on any events. We fire on the "client"
        // before building the SQL, and on the builder after building the SQL
        // in case we want to determine at how long it actually
        // took to build the query.
        this.client.emit('start', this.builder);
        var sql = this.builder.toSQL();
        this.builder.emit('start', this.builder);

        if (_.isArray(sql)) {
          return this.queryArray(sql);
        }
        return this.query(sql);
      })

      // If there are any "error" listeners, we fire an error event
      // and then re-throw the error to be eventually handled by
      // the promise chain. Useful if you're wrapping in a custom `Promise`.
      .catch(function(err) {
        if (this.builder._events && this.builder._events.error) {
          this.builder.emit('error', err);
        }
        throw err;
      })

      // Fire a single "end" event on the builder when
      // all queries have successfully completed.
      .tap(function() {
        this.builder.emit('end');
      })
      .finally(this.cleanupConnection);
  }

  // Stream the result set, by passing through to the dialect's streaming
  // capabilities. If the options are
  stream(options, handler) {
    // If we specify stream(handler).then(...
    if (arguments.length === 1) {
      if (_.isFunction(options)) {
        handler = options;
        options = {};
      }
    }

    // Determines whether we emit an error or throw here.
    var hasHandler = _.isFunction(handler);

    var stream  = new PassThrough({objectMode: true});
    var promise = Promise.bind(this)
      .then(this.ensureConnection)
      .then(function(connection) {
        this.connection = connection;
        var sql = this.builder.toSQL();
        var err = new Error('The stream may only be used with a single query statement.');
        if (_.isArray(sql)) {
          if (hasHandler) throw err;
          stream.emit('error', err);
        }
        return sql;
      }).then(function(sql) {
        return this._stream(sql, stream, options);
      }).finally(this.cleanupConnection);

    // If a function is passed to handle the stream, send the stream
    // there and return the promise, otherwise just return the stream
    // and the promise will take care of itsself.
    if (hasHandler) {
      handler(stream);
      return promise;
    }
    return stream;
  }

  // Allow you to pipe the stream to a writable stream.
  pipe(writable) {
    return this.stream().pipe(writable);
  }

  // "Runs" a query, returning a promise. All queries specified by the builder are guaranteed
  // to run in sequence, and on the same connection, especially helpful when schema building
  // and dealing with foreign key constraints, etc.
  query(obj) {
    return new Promise((resolver, rejecter) => {
      if (!this.connection) {
        throw new Error('There is an error with the database connection. Please check your config.');
      }
      obj.__cid = this.connection.__cid;
      this.builder.emit('query', obj);
      this.client.emit('query', obj);
      return this._query(obj).bind(this).then(this.processResponse);
    }) 
  }

  // In the case of the "schema builder" we call `queryArray`, which runs each
  // of the queries in sequence.
  queryArray(queries) {
    return new Promise((resolver, rejecter) => {
      return queries.length === 1 ? this.query(queries[0]) : Promise.bind(this)
        .thenReturn(queries)
        .reduce(function(memo, query) {
          return this.query(query).then(function(resp) {
            memo.push(resp);
            return memo;
          });
        }, []);      
    })
  }

  // Check whether there's a transaction flag, and that it has a connection.
  ensureConnection() {
    return new Promise((resolver, rejecter) => {
      if (this.builder._connection) {
        return this.builder._connection;
      }
      return this.client.acquireConnection();      
    })
  }

  // "Debug" the query being run.
  debug(obj) {
    console.dir(assign({__cid: this.connection.__cid}, obj))
  }

  // Check whether we're "debugging", based on either calling `debug` on the query.
  isDebugging() {
    return this.builder._debug || (this.client.isDebugging === true && this.builder._debug !== false);
  }

  // Transaction Methods:
  // -------

  // Run the transaction on the correct "runner" instance.
  transactionQuery() {
    return new Promise(() => {
      var runner = this.builder._transacting._runner;
      if (!(runner instanceof Runner)) {
        throw new Error('Invalid transaction object provided.');
      }
      var sql = this.builder.toSQL();
      if (_.isArray(sql)) {
        return runner.queryArray(sql);
      }
      return runner.query(sql);      
    })
  }

  // Begins a transaction statement on the instance,
  // resolving with the current runner.
  startTransaction() {
    return Promise.bind(this)
      .then(this.ensureConnection)
      .then(function(connection) {
        this.connection  = connection;
        this.transaction = true;
        return this.beginTransaction();
      }).thenReturn(this);
  }

  // Finishes the transaction statement and handles disposing of the connection,
  // resolving / rejecting the transaction's promise, and ensuring the transaction object's
  // `_runner` property is `null`'ed out so it cannot continue to be used.
  finishTransaction(action, containerObject, msg) {
    return new Promise((resolver, rejecter) => {
      var query, dfd = containerObject.__dfd__;

      // Run the query to commit / rollback the transaction.
      switch (action) {
        case 0:
          query = this.commitTransaction();
          break;
        case 1:
          query = this.rollbackTransaction();
          break;
      }

      return query.then(function(resp) {
        msg = (msg === void 0) ? resp : msg;
        switch (action) {
          case 0:
            dfd.fulfill(msg);
            break;
          case 1:
            dfd.reject(msg);
            break;
        }

      // If there was a problem committing the transaction,
      // reject the transaction block (to reject the entire transaction block),
      // then re-throw the error for any promises chained off the commit.
      }).catch(function(e) {
        dfd.reject(e);
        throw e;
      })
      .bind(this)
      .finally(function() {

        // Kill the "_runner" object on the containerObject,
        // so it's not possible to continue using the transaction object.
        containerObject._runner = void 0;

        return this.cleanupConnection();
      });
    })
  }

  beginTransaction() {
    return this._beginTransaction   && this.query({sql: this._beginTransaction});
  }
  commitTransaction() {
    return this._commitTransaction   && this.query({sql: this._commitTransaction});
  }
  rollbackTransaction() {
    return this._rollbackTransaction && this.query({sql: this._rollbackTransaction});
  }

  // Cleanup the connection as necessary, if the `_connection` was
  // explicitly set on the query we don't need to do anything here,
  // otherwise we
  cleanupConnection() {
    if (!this.builder._connection && typeof this.connection !== "undefined") {
      return this.client.releaseConnection(this.connection);
    }
  }

}