
export function set(values) {
  if (arguments.length !== 1) {
    throw new TypeError('Set takes an object or iterable')
  }
  if (isArray(values) && values.length > 0) {
    if (!isArray(values[0]) || values[0].length !== 2) {
      throw new TypeError()
    }
    for (var [k, v] of values) {

    }
  }
}

export function setDefault(value) {

}

export function setInsert() {

  // "Preps" the insert.
  _prepInsert(data) {
    var isRaw = this.formatter.rawOrFn(data);
    if (isRaw) return isRaw;
    var values = [];
    var columns, colList;
    if (!_.isArray(data)) data = data ? [data] : [];
    for (var i = 0, l = data.length; i<l; i++) {
      var sorted = helpers.sortObject(data[i]);
      columns = _.pluck(sorted, 0);
      colList = colList || columns;
      if (!_.isEqual(columns, colList)) {
        return this._prepInsert(this._normalizeInsert(data));
      }
      values.push(_.pluck(sorted, 1));
    }
    return {
      columns: columns,
      values: values
    }
  }

  // If we are running an insert with variable object keys, we need to normalize
  // for the missing keys, presumably setting the values to undefined.
  _normalizeInsert(data) {
    if (!_.isArray(data)) return _.clone(data);
    var defaultObj = _.reduce(_.union.apply(_, _.map(data, function(val) {
      return _.keys(val);
    })), function(memo, key) {
      memo[key] = void 0;
      return memo;
    }, {});
    return _.map(data, function(row) { return _.defaults(row, defaultObj); });
  }
  
}