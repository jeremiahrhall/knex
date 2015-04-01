
import {whereIter}   from '../iterators'
import {INSERT_INTO} from '../../sql/keywords'

class InsertStatement {

  constructor(elements) {
    this.elements = elements
    this.type     = 'InsertStatement'
  }

  compile() {
    let {table} = this.elements.single
    return [
      INSERT_INTO, 
      table
    ]
  }

}

export default function insertStatement(elements) {
  return new InsertStatement(elements)
}
