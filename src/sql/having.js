
class Having extends Clause {

  constructor(value) {
    this.type    = 'having'
    this.value   = value
    this.negated = false
    this.or      = false
    this.wrapped = false
  }

}

function having(...args) {
  switch(args.length) {
    case 1: 
      if (isArray(args[0])) return having(...args[0])
      return havingArity1(args[0])
    case 2: return havingArity2(args[0], args[1])
    case 3: return havingArity2(args[0], args[1], args[2])
  }
}

function havingArity1() {
  return new Having()
}

function havingArity2() {
  return new Having()
}

function havingArity3() {
  return new Having() 
}