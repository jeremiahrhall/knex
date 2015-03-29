
class ColumnData {



  get default() {
    return this._default || null
  }

}


class Column {

  build() {
    return 
  }

  defaultTo(value) {
    deprecate('defaultTo', 'default')
    return this.default(value)
  }

  default(value) {
    this._default = value
    return this
  }

}

function column(columnName) {

  

}