
class Columns {

  build() {
    
  }

  [Symbol.iterator]() {
    return new ColumnsIterator(this)
  }

}

class ColumnsIterator {

  constructor(columns) {
    this.columns = columns
  }

}