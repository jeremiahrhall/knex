
var havingInterface = {

  // [AND | OR] [NOT] HAVING expression

  having() {
    return clause(this, havingDispatch(...arguments))
  },

  notHaving() {
    return clause(this, not(havingDispatch(...arguments)))
  },

  orHaving() {
    return clause(this, or(havingDispatch(...arguments)))
  },

  orNotHaving() {
    return clause(this, or(not(havingDispatch(...arguments))))
  },

  havingRaw(sql, bindings) {
    return clause(this, having(raw(sql, bindings)))
  },
  
  orHavingRaw(sql, bindings) {
    return clause(this, or(having(raw(sql, bindings))))
  }

}

class HavingElements {
  constructor() {
    this.havings = []
  }
}

export default class HavingBuilder {
  constructor() {
    this.elements = new HavingElements()
    this.grouping = 'havings'
  }
}
mixin(HavingBuilder, havingInterface)

function havingDispatch(...args) {
  switch (args.length) {
    case 0: return '';
    case 1: return '';
    case 2: return '';
  }
}

function having() {

}

function havingArity1() {

}

function havingArity2() {

}

function havingArity3() {

}

export default havingInterface