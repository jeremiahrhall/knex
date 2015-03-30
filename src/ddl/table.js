
class Table {

  constructor(tableName, columns) {
    this.tableName = tableName
    this.columns   = columns
  }

  toJSON() {
    
  }

  diff(engine) {
    return new Promise((resolver, rejecter) => {
      
    })
  }

}

export function table(tableName, ...columns) {

}