
class Columns {

  construtor() {
    this.columns = []
  }

  push(v) {
    this.columns.push(v)
    return v
  }

  build() {
    
  }

}

import {column} from './column'

export function columns(...cols) {
  var compiled = new Columns()
  if (cols.length === 1) {
    if (isArray(cols[0])) {
      for (let c of cols) {
        compiled.push(column(c))
      }  
    }
  }
  return columns
}