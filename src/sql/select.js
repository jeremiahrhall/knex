import columsn from './column'

class Select {

  constructor(columns) {
    this.type    = 'select'
    this.columns = columns
  }

  build(builder, target) {
    if (builder.hooks.beforeBuildSelect) {
      compiling = builder.hooks.beforeBuildSelect(compiling)
    }
    if (builder.hook.buildSelect) {

    }
    if (builder.hooks.afterBuildSelect) {

    }
  }

}

function select(cols) {
  export new Select(columns(cols))
}