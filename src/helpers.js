// helpers.js
// -------

// Just some common functions needed in multiple places within the library.
import _ from 'lodash'

export function isEngine(obj) {
  return obj && obj[IS_ENGINE]
}

export var helpers = {

  // Pick off the attributes from only the current layer of the object.
  skim(data) {
    return _.map(data, function(obj) {
      return _.pick(obj, _.keys(obj));
    });
  },

  // Check if the first argument is an array, otherwise
  // uses all arguments as an array.
  normalizeArr() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    if (_.isArray(args[0])) {
      return args[0];
    }
    return args;
  },

  // Used to signify deprecated functionality.
  deprecate(msg) {
    this.warn(msg);
  },

  // Used to warn about incorrect use, without error'ing
  warn(msg) {
    if (typeof console !== "undefined" && console !== null &&
      typeof console.warn === "function") {
      console.warn("Knex: " + msg);
    }
  },

  // Sort the keys for the insert
  sortObject(obj) {
    return _.sortBy(_.pairs(obj), function(a) {
      return a[0];
    });
  }

}