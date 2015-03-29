
class UpdateClause extends Clause {

  

}


var ret, obj = {};
this._method = 'update';
var i, args = new Array(arguments.length);
for (i = 0; i < args.length; i++) {
  args[i] = arguments[i];
}
if (_.isString(values)) {
  obj[values] = returning;
  if (args.length > 2) {
    ret = args[2];
  }
} else {
  obj = values;
  ret = args[1];
}
if (!_.isEmpty(ret)) this.returning(ret);
this._single.update = obj;
return this