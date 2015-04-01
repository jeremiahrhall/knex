import Promise from '../../promise'
import Runner  from '../../runner'
import {skim}  from '../../helpers'

export default class Runner_MySQL2 extends Runner {

  // Grab a connection, run the query via the MySQL streaming interface,
  // and pass that through to the stream we've sent back to the client.
  _stream(sql, stream, options) {
    /*jshint unused: false*/
    var runner = this;
    return new Promise(function(resolver, rejecter) {
      stream.on('error', rejecter);
      stream.on('end', resolver);
      return runner.query(sql).map(function(row) {
        stream.write(row)
      })
      .catch((err) => stream.emit('error', err))
      .then(() => stream.end())
    });
  }

  // Runs the query on the specified connection, providing the bindings
  // and any other necessary prep work.
  _query(obj) {
    var sql = obj.sql;
    if (this.isDebugging()) this.debug(obj);
    if (obj.options) sql = _.extend({sql: sql}, obj.options);
    var connection = this.connection;
    if (!sql) throw new Error('The query is empty');
    return new Promise(function(resolver, rejecter) {
      connection.query(sql, obj.bindings, function(err, rows, fields) {
        if (err) return rejecter(err);
        obj.response = [rows, fields];
        resolver(obj);
      });
    });
  }

  // Process the response as returned from the query.
  processResponse(obj) {
    var [rows, fields] = obj.response
    var method = obj.method
    if (obj.output) return obj.output.call(this, rows, fields)
    switch (method) {
      case 'select':
      case 'pluck':
      case 'first':
        var resp = helpers.skim(rows)
        if (method === 'pluck') return _.pluck(resp, obj.pluck)
        return method === 'first' ? resp[0] : resp
      case 'insert':
        return [rows.insertId]
      case 'del':
      case 'update':
      case 'counter':
        return rows.affectedRows
      default:
        return response
    }
  }

}