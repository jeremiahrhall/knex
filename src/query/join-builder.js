// JoinBuilder
// -------

// The "JoinBuilder" is a chainable builder for the join clause
class JoinBuilder {
  
  constructor(table, type) {
    this.elements = {}
    this.table    = table;
    this.joinType = type;
    this.clauses  = [];
    this.and      = this;
    this.grouping = 'join'
  }

  // Adds an "on" clause to the current join object.
  on(first, operator, second) {
    switch (arguments.length) {
      case 1:  data = ['on', this._bool(), first]; break;
      case 2:  data = ['on', this._bool(), first, '=', operator]; break;
      default: data = ['on', this._bool(), first, operator, second];
    }
    this.clauses.push(data);
    return this;
  }

  // Adds a "using" clause to the current join.
  using(table) {
    return this.clauses.push(['using', this._bool(), table]);
  }

  // Adds an "and on" clause to the current join object.
  andOn() {
    return this.on.apply(this, arguments);
  }

  // Adds an "or on" clause to the current join object.
  orOn(first, operator, second) {
    /*jshint unused: false*/
    return this._bool('or').on.apply(this, arguments);
  }

  // Explicitly set the type of join, useful within a function when creating a grouped join.
  type(type) {
    this.joinType = type;
    return this;
  }

  _bool(bool) {
    if (arguments.length === 1) {
      this._boolFlag = bool;
      return this;
    }
    var ret = this._boolFlag || 'and';
    this._boolFlag = 'and';
    return ret;
  }

}

Object.defineProperty(JoinBuilder.prototype, 'or', {
  get: function () {
    return this._bool('or');
  }
});

module.exports = JoinBuilder;