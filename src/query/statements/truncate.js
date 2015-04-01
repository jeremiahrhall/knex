import {TRUNCATE}  from '../../sql/keywords'

class TruncateStatement {

  constructor(elements) {
    this.elements = elements
    this.type     = 'TruncateStatement'
  }

  compile() {
    let {table}  = this.elements.single
    return [
      TRUNCATE,
      table
    ]
  }

}

export default function truncateStatement(elements) {
  return new TruncateStatement(elements)
}
