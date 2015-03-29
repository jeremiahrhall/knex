import Joins     from './containers/joins'
import Wheres    from './containers/wheres'
import Columns   from './containers/columns'
import Unions    from './containers/unions'
import Havings   from './containers/havings'
import Orders    from './containers/orders'
import Groupings from './containers/groupings'

class Statements {

  constructor() {

    // All of the possible query statements
    this.wheres    = new Wheres()
    this.joins     = new Joins()
    this.columns   = new Columns()
    this.unions    = new Unions()
    this.havings   = new Havings()
    this.orders    = new Orders()
    this.groupings = new Groupings()

    // Update / Insert values
    this.updates   = []
    this.inserts   = []

    // Single query statements
    this.single    = {}

    // Any options which need to be passed to the "engine"
    this.options   = []
    
    // Hooks
    this.hooks     = {}
  }

  get method() {
    return this.single.method || 'select'
  }

  get offset() {
    return this.single.offset
  }

  get limit() {
    return this.single.limit
  }

}