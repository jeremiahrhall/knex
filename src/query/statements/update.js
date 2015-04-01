import {UPDATE}    from '../../sql/keywords'
import {whereIter} from '../iterators'

class UpdateStatement {

  constructor(elements) {
    this.elements = elements
    this.type     = 'UpdateStatement'
  }

  compile() {
    let {wheres} = this.elements
    let {table}  = this.elements.single
    return [
      UPDATE, 
      table,
      whereIter(wheres)
    ]
  }

}

export default function updateStatement(elements) {
  return new UpdateStatement(elements)
}