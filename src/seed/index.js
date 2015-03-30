
// Seeder
// -------
var fs       = require('fs')
var path     = require('path')
var _        = require('lodash')
var mkdirp   = require('mkdirp')
var Promise  = require('../promise')

// The new seeds we're performing, typically called from the `knex.seed`
// interface on the main `knex` object. Passes the `knex` instance performing
// the seeds.
class Seeder {
  
  constructor(engine) {
    this.engine = engine;
    this.config = this.setConfig(knex.client.seedConfig);
  }

  // Runs all seed files for the given environment.
  run(config) {
    this.config = this.setConfig(config);
    return this._seedData()
      .bind(this)
      .spread(function(all) {
        return this._runSeeds(all);
      });
  }

  // Creates a new seed file, with a given name.
  make(name, config) {
    this.config = this.setConfig(config);
    if (!name) Promise.rejected(new Error('A name must be specified for the generated seed'));
    return this._ensureFolder(config)
      .bind(this)
      .then(this._generateStubTemplate)
      .then(this._writeNewSeed(name));
  }

}

// Lists all available seed files as a sorted array.
function listAll(config) {
  this.config = this.setConfig(config);
  return Promise.promisify(fs.readdir, fs)(this._absoluteConfigDir())
    .bind(this)
    .then(function(seeds) {
      return _.filter(seeds, function(value) {
        var extension = path.extname(value);
        return _.contains(['.co', '.coffee', '.iced', '.js', '.litcoffee', '.ls'], extension);
      }).sort();
    });
}

// Gets the seed file list from the specified seed directory.
function seedData() {
  return Promise.join(this.listAll());
}

// Ensures a folder for the seeds exist, dependent on the
// seed config settings.
function ensureFolder() {
    var dir = this._absoluteConfigDir();
    return Promise.promisify(fs.stat, fs)(dir)
      .catch(function() {
        return Promise.promisify(mkdirp)(dir);
      });
}

// Run seed files, in sequence.
function runSeeds(seeds) {
  return Promise.map(seeds, name => this._validateSeedStructure(name))
    .then((seeds) => {
      return this._waterfallBatch(seeds);
    });
}

// Validates seed files by requiring and checking for a `seed` function.
function validateSeedStructure(name) {
  var seed = require(path.join(this._absoluteConfigDir(), name));
  if (!_.isFunction(seed.seed)) {
    throw new Error('Invalid seed file: ' + name + ' must have a seed function');
  }
  return name;
}

// Generates the stub template for the current seed file, returning a compiled template.
function generateStubTemplate() {
  var stubPath = this.config.stub || path.join(__dirname, 'stub', this.config.extension + '.stub');
  return Promise.promisify(fs.readFile, fs)(stubPath).then(function(stub) {
    return _.template(stub.toString(), null, {variable: 'd'});
  });
}

// Write a new seed to disk, using the config and generated filename,
// passing any `variables` given in the config to the template.
function writeNewSeed(name) {
  var config = this.config;
  var dir = this._absoluteConfigDir();
  return function(tmpl) {
    if (name[0] === '-') name = name.slice(1);
    var filename  = name + '.' + config.extension;
    return Promise.promisify(fs.writeFile, fs)(
      path.join(dir, filename),
      tmpl(config.variables || {})
    ).return(path.join(dir, filename));
  };
}

// Runs a batch of seed files.
function waterfallBatch(seeds) {
  var knex      = this.knex;
  var seedDirectory = this._absoluteConfigDir();
  var current   = Promise.bind({failed: false, failedOn: 0});
  var log       = [];
  _.each(seeds, function(seed) {
    var name  = path.join(seedDirectory, seed);
    seed = require(name);

    // Run each seed file.
    current = current.then(function() {
      return seed.seed(knex, Promise);
    }).then(function() {
      log.push(name);
    });
  });

  return current.thenReturn([log]);
}

function absoluteConfigDir() {
  return path.resolve(process.cwd(), this.config.directory);
}

function setConfig(config) {
  return _.extend({
    extension: 'js',
    directory: './seeds'
  }, this.config || {}, config);
}
