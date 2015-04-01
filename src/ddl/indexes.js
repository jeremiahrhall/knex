
class Key {

  constructor(type, columns, name) {
    this.type    = type
    this.columns = columns
    this.name    = name
    this.action  = null
  }

  compile(options) {
    
  }

}

export function add(key) {
  key.action = 'ADD'
  return key
}

export function drop(key) {
  key.action = 'DROP'
  return key
}

export function primaryKey(columns, keyName) {
  return new Key('PRIMARY', columns, keyName)
}

export function index(columns, keyName) {
  return new Key('INDEX', columns, keyName)
}

export function unique(columns, keyName) {
  return new Key('UNIQUE', columns, keyName)
}

export function foreignKey(columns, keyName) {
  return new Key('FOREIGN', columns, keyName)
}
