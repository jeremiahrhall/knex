
class RawClause extends Clause {

  constructor(sql, bindings) {
    this.sql = sql
    this.bindings = bindings
  }

  build() {
    return [this.sql, this.bindings]
  }

}

function raw(sql, bindings) {
  if (isPlainObject(bindings)) {
    var keys = Object.keys(bindings)
  }
  return new RawClause(sql, bindings)
}

    if (sql && sql.toSQL) {
      var output = sql.toSQL();
      sql = output.sql;
      bindings = output.bindings;
    }
    this.sql = sql + '';
    this.bindings = _.isArray(bindings) ? bindings :
      bindings ? [bindings] : [];
    this.interpolateBindings();


function raw(sql, bindings) {
  var raw = (sql instanceof Raw ? sql : new Raw(sql, bindings));
  this._statements.push({
    grouping: 'where',
    type: 'whereRaw',
    value: raw,
    bool: this._bool()
  });
  return this
}



  // Ensure all Raw / builder bindings are mixed-in to the ? placeholders
  // as appropriate.
  interpolateBindings() {
    var replacements = [];
    this.bindings = _.reduce(this.bindings, function(accum, param, index) {
      var innerBindings = [param];
      if (param && param.toSQL) {
        var result    = this.splicer(param, index);
        innerBindings = result.bindings;
        replacements.push(result.replacer);
      }
      return accum.concat(innerBindings);
    }, [], this);

    // we run this in reverse order, because ? concats earlier in the
    // query string will disrupt indices for later ones
    this.sql = _.reduce(replacements.reverse(), function(accum, fn) {
      return fn(accum);
    }, this.sql.split('?')).join('?')
  }

  // Returns a replacer function that splices into the i'th
  // ? in the sql string the inner raw's sql,
  // and the bindings associated with it
  splicer(raw, i) {
    var obj = raw.toSQL();

    // the replacer function assumes that the sql has been
    // already sql.split('?') and will be arr.join('?')
    var replacer = function(arr) {
      arr[i] = arr[i] + obj.sql + arr[i + 1];
      arr.splice(i + 1, 1);
      return arr;
    }

    return {
      replacer: replacer,
      bindings: obj.bindings
    }
  }