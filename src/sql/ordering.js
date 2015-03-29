
class OrderBy {

  constructor(value, direction) {
    this.value = value
    this.direction = direction
  }

  build() {
    return [`ORDER BY ${}`]
  }

}


class GroupBy {

  constructor(value) {

  }

  build() {
    return [`GROUP BY ${}`]
  }

}

export function groupBy(value) {
  return new GroupBy(value)
}

export function orderBy(value, direction = 'ASC') {
  return new OrderBy(value, direction)
}
