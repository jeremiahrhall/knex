
import {columnIter, whereIter, joinIter, groupByIter, 
  havingIter, orderByIter, limitIter, offsetIter, lockIter} from '../iterators'
import {SELECT, FROM} from '../../sql/keywords'

class SelectStatement {

  constructor(elements) {
    this.elements = elements
    this.type     = 'SelectStatement'
  }

  compile() {
    let {columns, wheres, joins, groupBy, havings, orderBy} = this.elements
    let {limit, offset, table, lock} = this.elements.single
    return [
      SELECT,
      columnIter(columns),
      FROM,
      table,
      whereIter(wheres),
      joinIter(joins),
      groupByIter(groupBy),
      havingIter(havings),
      orderByIter(orderBy),
      limitIter(limit),
      offsetIter(offset), 
      lockIter(lock)
    ]
  }

}

export default function selectStatement(elements) {
  return new SelectStatement(elements)
}