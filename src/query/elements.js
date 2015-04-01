import {SELECT, FROM, UPDATE, INSERT_INTO, DELETE_FROM, TRUNCATE} from '../sql/keywords'
import LazyQuery from './lazy'

import selectStatement from './statements/select'
import updateStatement from './statements/update'
import deleteStatement from './statements/delete'
import insertStatement from './statements/insert'
import truncateStatement from './statements/truncate'

export default class Elements {

  constructor() {

    // All of the possible query statements
    this.wheres    = []
    this.joins     = []
    this.columns   = []
    this.unions    = []
    this.havings   = []
    this.orders    = []
    this.groupings = []

    // Update / Insert values
    this.updates   = []

    // Single query statements
    this.single    = {}

    // Any options which need to be passed to the "engine"
    this.options   = []
    
    // Hooks:
    this.hooks     = {}

    // Default statement type is "select"
    this.statementType = 'select'
  }

  get table() {
    return this.single.table
  }

  get insertValues() {
    return this.single.insertValues
  }

  get offset() {
    return this.single.offset
  }

  get limit() {
    return this.single.limit
  }

  get lock() {
    return this.single.lock
  }

  get returning() {
    return this.single.returning
  }

  [Symbol.iterator]() {
    var coll, stmt = this.statementType
    if (stmt === 'select') {
      coll = selectStatement(this)
    } else if (stmt === 'update') {
      coll = updateStatement(this)
    } else if (stmt === 'insert') {
      coll = insertStatement(this)
    } else if (stmt === 'delete') {
      coll = deleteStatement(this)
    } else if (stmt === 'truncate') {
      coll = truncateStatement(this)
    }
    if (this.hooks[coll.type]) {
      coll = this.hooks[coll.type](() => coll)
    }
    return new LazyQuery(coll, this.hooks, this)[Symbol.iterator]()
  }

}
