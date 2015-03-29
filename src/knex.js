// Knex.js  0.7.5
// --------------------
// (c) 2013-2015 Tim Griesser
// Knex may be freely distributed under the MIT license.
// For details and documentation:
// http://knexjs.org

import Builder    from './query/builder'
import Raw        from './raw'
import {isEngine} from './helpers'
import assign     from 'lodash/object/assign'

// Each of the methods which may be statically chained from knex
import {sql}      from './sql'
import {SQL}      from './sql/sql'
import {ddl}      from './ddl'
import {DDL}      from './ddl/ddl'

export default function Knex(engineOrConf) {
  if (!isEngine(engineOrConf)) {
    return Knex(makeEngine(engineOrConf))
  }
  return makeKnex(engineOrConf)
}

assign(Knex, {
  
  get VERSION() {
    return '0.9.0'
  },

  // let {or, where} = knex.sql
  // or(where('id', '<', 2), where('id', '>', 3))
  sql,

  // let {OR, WHERE} = knex.sql
  // OR(WHERE('id', '<', 2), WHERE('id', '>', 3))
  SQL,

  // knex.ddl.alterTable('tableName')
  ddl,

  // knex.ddl.ALTER_TABLE('tableName')
  DDL,

  // new Builder([engine]).select('*').from('accounts')
  Builder,

  // new SchemaBuidler([engine]).createTable(tableName, () => {})
  SchemaBuilder

})

function makeEngine(config) {
  var Engine
  var dialectStr = dialectAlias[config.dialect] || config.dialect
  try {
    Engine = require(`${__dirname}/dialects/${dialectStr}`)  
  } catch (e) {
    throw new Error(`${dialectStr} is not a valid Knex client, did you misspell it?`)
  }
  return new Engine(config)
}

const dialectAlias = {
  'mariadb'       : 'maria'
  'mariasql'      : 'maria'
  'pg'            : 'postgres'
  'postgresql'    : 'postgres'
  'sqlite'        : 'sqlite3'
}

function makeKnex(engine) {

  function knex(tableName) {
    var builder = new Builder(engine)
    if (tableName) return builder.table(tableName)
  }
  
  var emitter = new EventEmitter()

  assign(knex, emitter, {

    toString() {
      return `[object Knex:${engine.dialect}]`
    },

    transaction(container) {
      return new Transaction(engine).container(container)
    },

    raw(sql, bindings) {
      return new Raw(engine).set(sql, bindings)
    },

    destroy(cb) {
      return engine.destroy(cb)
    },

    get sql() {
      return SQL
    },

    get seed() {
      return new Seeder(engine)
    },

    get schema() {
      return new SchemaBuilder(engine)
    },

    get migrate() {
      return new Migrator(engine)
    },

    get client() {
      deprecate('knex.client', 'knex.engine')
      return engine
    },

    get engine() {
      return engine
    },

    get fn() {
      deprecate('knex.fn.*', 'Knex.sql.*')
      return Knex.sql
    },

    get __knex__() {
      return Knex.VERSION
    },

    get VERSION() {
      return Knex.VERSION
    }

  })

  // Most of the standard sql functions may be used to kick off 
  // a query chain.
  Object.keys(sql).forEach((method) => {
    knex[method] = () => {
      var builder = new Builder(engine)
      return builder[method].apply(builder, arguments);
    }
  })

  // Passthrough all "start" and "query" events to the knex object.
  engine.on('start', obj => knex.emit('start', obj))
  engine.on('query', obj => knex.emit('query', obj))

  return knex
}

Knex.raw = (sql, bindings) => {
  deprecate('Knex.raw is deprecated, use Knex.sql.raw')
  return Knex.sql.raw(sql, bindings)
}
