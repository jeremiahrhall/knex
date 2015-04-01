// MySQL2 Client
// -------

import Promise      from 'bluebird'
import mysql2       from 'mysql2'
import Engine_MySQL from '../mysql'
import pick         from 'lodash/object/pick'

const configOptions = ['user', 'database', 'host', 'password', 'ssl', 'connection', 'stream'];

export default class Engine_MySQL2 extends Engine_MySQL {

  get engine() {
    return 'mysql2'
  }

  get dialect() {
    return 'mysql'
  }

  acquireRawConnection() {
    var connection = mysql2.createConnection(pick(this.connectionSettings, configOptions))
    this.databaseName = connection.config.database
    return new Promise((resolver, rejecter) => {
      connection.connect(function(err) {
        if (err) return rejecter(err)
        resolver(connection)
      })
    })
  }

}