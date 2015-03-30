import {raw} from './sql/raw'

export function now() {
  return raw('CURRENT_TIMESTAMP')  
}
