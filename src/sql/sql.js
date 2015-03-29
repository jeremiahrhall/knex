
import snakeCase from 'lodash/string/snakeCase'
import * as sql  from './index'

var fns = Object.keys(sql)

var SQL = {}

for (var key of fns) {
  SQL[snakeCase(key).toUpperCase()] = fns[key]
}

export default SQL