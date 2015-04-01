
class IdentityClause {
  constructor(value) {
    this.value = value
  }
  compile() {
    return this.value
  }
}

class Wrapped {
  constructor(value, prefix, suffix) {
    this.prefix = prefix
    this.value  = value
    this.suffix = suffix
    this.type   = 'wrapped'
  }
  compile() {
    return [this.prefix, this.value, this.suffix]
  }
}

export function wrap(value, prefix = delim.LEFT_PAREN, suffix = delim.RIGHT_PAREN) {
  return new Wrapped(value, prefix, suffix)
}

class Identifier extends IdentityClause {
  constructor(value) {
    super(value)
    this.type  = 'identifier'
  }
}

export function identifier(value) {
  if (typeof value === 'string') {
    return new Identifier(value)
  }
  return value
}

class Parameter extends IdentityClause {
  constructor(value) {
    super(value)
    this.type  = 'parameter'
  }
}
export function parameter(value) {
  return new Parameter(value)
}
