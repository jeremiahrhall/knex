
class LimitOffsetClause {

  constructor(type, value) {
    this.type     = type
    this.value    = value
    this.grouping = 'limitOffset'
  }

  build(target) {
    return [`${this.type} ?`, this.value]
  }

}

function limit(value) {
  return new LimitOffsetClause('LIMIT', value)
}

function offset(value) {
  return new LimitOffsetClause('OFFSET', value)
}