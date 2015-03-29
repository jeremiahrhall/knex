
class Wrapped {

  constructor(value, prefix, suffix) {
    this.value  = value
    this.prefix = prefix
    this.suffix = suffix
  }

  build() {
    
  }

}

function wrap(value, prefix = '(', suffix = ')') {
  return new Wrapped(value, prefix, suffix)
}
