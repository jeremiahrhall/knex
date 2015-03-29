// Pool
// -------
import _       from 'lodash'
import Pool2   from 'pool2'
import Promise from './promise'

const DEFAULT_MIN = 2
const DEFAULT_MAX = 10

const poolDefaults = {
  min: 2,
  max: 10,
  acquire(engine) {
    return (callback) => {
      return engine.acquireRawConnection()
        .tap(function(connection) {
          connection.__cid = _.uniqueId('__cid');
          if (engine.poolConfig.afterCreate) {
            return Promise.promisify(engine.poolConfig.afterCreate)(connection);
          }
        })
        .asCallback(callback);
    }
  },
  release(connection, callback) {
    if (pool.config.beforeDestroy) {
      return pool.config.beforeDestroy(connection, function() {
        if (connection !== void 0) connection.end(callback);
      });
    }
    else if (connection !== void 0) connection.end(callback);
  }
}

// The "Pool" object is a thin wrapper around the
// "generic-pool-redux" library, exposing a `destroy`
// method for explicitly draining the pool. The
// `init` method is called internally and initializes
// the pool if it doesn't already exist.
class Pool {
  
  constructor(engine) {
    this.config = assign({}, config)
    this.pool   = this.setup()
  }

  // Typically only called internally, this initializes
  // a new `Pool` instance, based on the `config`
  // options passed into the constructor.
  setup(config) {
    return new Pool2(_.defaults(this.config, _.result(this, 'defaults')));
  }

  // Teardown the pool
  teardown() {
    
  }

  // Some basic defaults for the pool...
  defaults() {
    var pool = this;
    return 
  }

  // Acquires a connection from the pool.
  acquire(callback) {
    if (this.pool) {
      this.pool.acquire(callback);
    } else {
      callback(new Error('The pool is not initialized.'));
    }
  }

  // Release a connection back to the connection pool.
  release(connection, callback) {
    if (this.pool) {
      // release is now fire-and-forget
      this.pool.release(connection);
      callback();
    } else {
      callback(new Error('The pool is not initialized.'));
    }
  }

  // Tear down the pool, only necessary if you need it.
  destroy(callback) {
    var pool = this.pool;
    if (pool) {
      pool.end(callback);
      this.pool = void 0;
    } else {
      callback();
    }
    return this;
  }

}

module.exports = Pool;
