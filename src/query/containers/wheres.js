
class Wheres {

  build() {

  }

}


var wheres = this.grouped.where;
if (!wheres) return;
var sql = [];
sql[0] = 'where';
for (var i = 0, l = wheres.length; i < l; i++) {
  var stmt = wheres[i];
  if (i !== 0) sql.push(stmt.bool);
  sql.push(this[stmt.type](stmt));
}
return sql.length > 1 ? sql.join(' ') : '';