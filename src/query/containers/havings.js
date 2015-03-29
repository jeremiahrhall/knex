
class Havings {

    

    
}

var havings = this.grouped.having;
    if (!havings) return '';
    var sql = ['having'];
    for (var i = 0, l = havings.length; i < l; i++) {
      var str = '', s = havings[i];
      if (i !== 0) str = s.bool + ' ';
      if (s.type === 'havingBasic') {
        sql.push(str + this.formatter.columnize(s.column) + ' ' +
          this.formatter.operator(s.operator) + ' ' + this.formatter.parameter(s.value));
      }else{
        if(s.type === 'whereWrapped'){
          sql.push(this.whereWrapped(s));
        } else {
          sql.push(str + this.formatter.checkRaw(s.value));
        }
      }
    }
    return sql.length > 1 ? sql.join(' ') : '';