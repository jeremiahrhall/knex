// Strong Oracle Engine
// -------
import Engine_Oracle from '../oracle'

export default class Engine_StrongOracle extends Engine_Oracle {

  constructor(options) {
    super(options)
    this.driver = require('strong-oracle')()
  }

}