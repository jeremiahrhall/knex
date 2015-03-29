import {alias} from '../sql/alias'

export function extractAlias(val) {
  if (typeof val !== 'string') return val;
  var asIndex = val.toLowerCase().indexOf(' as ')
  if (asIndex !== -1) {
    return alias(first, second)
  }
  return val
}
