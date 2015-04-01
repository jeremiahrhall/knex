
class ColumnData {

  get default() {
    return this._default || null
  }

  toJSON() {
    return {
      default: this.default
    }
  }

}

class Column {

  constructor(columnName) {
    this.name  = columnName
    this.chain = new ColumnData()
  }

  default(value) {
    this.chain.default = value
    return this;
  }

  get nullable() {
    this.chain.nullable
    return this
  }

  get notNullable() {
    this.chain.notNullable
    return this;
  }

}

function column(columnName) {
  
}
