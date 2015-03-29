
class Aggregate extends Clause {

  constructor(func, value) {
    this.func     = func
    this.value    = value
    this.type     = 'aggregate'
    this.grouping = 'columns'
  }

  build(target) {
    return into(target, [`${this.func}(${ident(this.value)})`])
  }

}

export function count(column) {
  return new Aggregate('COUNT', column)
}

export function min(column) {
  return new Aggregate('MIN', column)
}

export function max(column) {
  return new Aggregate('MAX', column)
}

export function sum(column) {
  return new Aggregate('SUM', column)
}

export function avg(column) {
  return new Aggregate('AVG', column)
}
