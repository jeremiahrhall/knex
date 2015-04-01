import {TRUNCATE}  from '../../sql/keywords'

class DeleteStatement {

  constructor(elements) {
    this.elements = elements
    this.type     = 'DeleteStatement'
  }

  compile() {
    let {table} = this.elements.single
    return [
      DELETE_FROM,
      table
    ]
  }

}

export default function deleteStatement(elements) {
  return new DeleteStatement(elements)
}
