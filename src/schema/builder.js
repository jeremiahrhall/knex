import {EventEmitter} from 'events'

export default class SchemaBuilder extends EventEmitter {
  
  constructor(engine) {
    this.engine    = engine
    this._sequence = []
  }

  toString() {
    return this.toSQL()
  }

  toSQL() {
    return compiler()
  }

  createTable(tableName, fn) {
    createTable(tableName, fn)
    return this
  }

  createTableIfNotExists(tableName, fn) {
    return sequence(this, ifNotExists(createTable(tableName), new CreateTableBuilder(fn)))
  }

  createSchema(schemaName) {
    return sequence(this, createSchema(schemaName), )
  }

  createSchemaIfNotExists() {
    return sequence(this, ifNotExists(createSchema(schemaName)), ))
  }

  createExtension() {
    return sequence(this, createExtension(schemaName), )
  }

  createExtensionIfNotExists() {
    return sequence(this, ifNotExists(createExtension(schemaName), ))
  }

  dropExtension() {
    return sequence(this, dropExtension(schemaName), )
  }
  
  dropExtensionIfExists() {
    return sequence(this, ifExists(dropExtension(schemaName), ))
  }

  dropSchema() {
    return sequence(this, dropSchema(schemaName), )
  }

  dropSchemaIfExists() {
    return sequence(this, ifExists(dropSchema(schemaName), ))
  }

  table() {
    deprecate('builder.table', 'builder.alterTable')
    return this.alterTable()
  }

  alterTable() {
    return sequence(this, ifExists(dropSchema(schemaName), new AlterTableBuilder()))
  }

  dropTable() {
    return sequence(this, ifExists(dropSchema(schemaName), ))
  }

  dropTableIfExists() {
    return sequence(this, ifExists(dropSchema(schemaName), ))
  }

  raw() {
    return raw()
  }

  hasTable() {
    return sequence(this, hasTable(schemaName))
  }

  hasColumn() {
    return sequence(this, ifExists(dropSchema(schemaName), ))
  }

  debug() {
    return sequence(this, ifExists(dropSchema(schemaName), ))
  }

}

function sequence(builder, stmt) {

}
