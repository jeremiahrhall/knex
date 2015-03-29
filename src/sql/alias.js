
class Alias extends Clause {

  constructor(source, aliased) {
    this.source  = source
    this.aliased = aliased
  }

  build() {
    
  }
  
}

function alias(source, aliased) {
  return new Alias(source, aliased)
}