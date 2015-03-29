
var builderInterface = {

  transacting() {
    
  },

  connection(conn) {
    deprecated('connection', 'setConnection')
    return this.setConnection(conn)
  },

  setConnection(conn) {
    this._connection = conn
    return this;
  },

  debug(bool = true) {
    return clauses(this, modifier('debug', bool), true)
  },

  options(opts) {
    if (!this.statements.options) {
      this.statements.options = []
    }
    this.statements.options.push(opts)
    return this;
  },

  // "Then" interface only works when there's an "engine" specified.
  then() {
    if (!this.engine) {
      throw new Error('Cannot call then on a builder without an engine')
    }

    // Eventually this will become the value of the promise,
    // for now it's used to signal a warning when we've tried using a
    // clause as both a promise and later as a value.
    if (!this._promise) {
      this._promise = true
    }

    var running = this.engine.run(this)
    return running.then.apply(running, arguments)
  },

  // Functional: 

  map(...args) {
    return this.then().map(..args)
  },

  reduce(...args) {
    return this.then().reduce(...args)
  },

  // Promises:

  bind() {
    return this.then().bind(...arguments)
  },

  spread() {
    return this.then().spread(...arguments)
  }
  
  tap() {
    return this.then().tap(...arguments)
  },

  yield() {
    deprecated('yield', 'return')
    return this.return(...arguments)
  },

  thenReturn() {
    return this.return(...arguments)
  },

  return() {
    return this.then().return(...arguments)
  },

  otherwise() {
    deprecated('otherwise', 'catch')
    return this.catch(...arguments)
  },

  catch() {
    return this.then().catch(...arguments)
  }  

  ensure() {
    deprecated('ensure', 'finally')
    return this.finally(...arguments)
  },

  finally() {
    return this.then().finally(...arguments)
  },

  // Callbacks:

  exec() {
    console.log('Knex: .exec is deprecated, please use .asCallback')
  },

  asCallback(cb) {
    return this.then().asCallback(cb)
  },

  nodeify() {
    deprecated('Knex: .nodeify is deprecated, please use .asCallback')
  },

  // Streams:

  toStream() {
    return engine(this, 'toStream').toStream()
  },

  toString() {
    return this.toQuery()
  },

  pipe() {
    
  },

  toQuery() {

  },

  toSQL() {
    if (!this.engine) {
      throw new Error('toSQL cannot be called on a builder chain without an "engine" specified.')
    }
    return this.engine.dialect.builderToSQL(this)
  }

}
