
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

// table('tableName', (tbl) => {
//   tbl.string('account')
//   tbl.index([])
// })

export function table(tableName, ...columns) {

}