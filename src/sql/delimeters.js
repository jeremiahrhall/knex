
class Delimeter {

  constructor(value) {
    this.value = value
    this.type  = 'delimeter'
  }

}

export var COMMA       = new Delimeter(',')
export var SEMICOLON   = new Delimeter(';')
export var LEFT_PAREN  = new Delimeter('(')
export var RIGHT_PAREN = new Delimeter(')')

function delimit(arr) {
  if (typeof arr) {
    
  }
}