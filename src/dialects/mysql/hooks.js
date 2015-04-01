import {UPDATE} from '../../sql/keywords'

var mysqlHooks = {

  identifier(val) {
    return '`' + val.replace(/`/g, '``').replace(/\./g, '`.`') + '`'
  },

  SelectStatement() {
    
  },

  UpdateStatement() {
    return [UPDATE, this.tableName, this.joins, this.order, this.limit]
  },

  columnInfo() {
    return new Builder(engine)
      .select('*')
      .from('information_schema.columns')
      .where('table_name',   this.table)
      .where('table_schema', this.database)
      .hook({
        onRow(row) {
          return [row.COLUMN_NAME, {
            defaultValue: row.COLUMN_DEFAULT,
            type:         row.DATA_TYPE,
            maxLength:    row.CHARACTER_MAXIMUM_LENGTH,
            nullable:     (row.IS_NULLABLE === 'YES')
          }]
        }
      })
  },

  lock() {
    return null ? FOR_UPDATE : LOCK_IN_SHARE_MODE
  },

  limit() {

  }

}

QueryCompiler_MySQL.prototype._emptyInsertValue = '() values ()';



// Compiles a `columnInfo` query.


QueryCompiler_MySQL.prototype.limit = function() {
  var noLimit = !this.single.limit && this.single.limit !== 0;
  if (noLimit && !this.single.offset) return '';

  // Workaround for offset only, see http://stackoverflow.com/questions/255517/mysql-offset-infinite-rows
  return 'limit ' + ((this.single.offset && noLimit) ? '18446744073709551615' : this.formatter.parameter(this.single.limit));
}
