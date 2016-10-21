#!/usr/bin/env node

'use strict';

var assert = require('assert');
var complex = require('..');
var program = require('commander');

program.version(require('../package').version);
program.option('-c, --config <path_to_config_file>', 'path to the config file');
program.parse(process.argv);
assert(program.config, 'You must supply a config file!');

var config = complex.createConfig(program.config);
var actors = [];

if (!Array.isArray(config)) {
  config = [config];
}

for (var i = 0; i < config.length; i++) {
  if (config[i] instanceof complex.createConfig.LandlordConfig) {
    actors.push(complex.createLandlord(config[i]));
  }
  if (config[i] instanceof complex.createConfig.RenterConfig) {
    let renter = complex.createRenter(config[i]);
    if (!seedContact)
    {
      // create a seed for others to connect to
      var seedContact = renter.getContact();
    }

    // add seed prior to joining
    renter.addSeedList(seedContact);
    actors.push(renter);
  }
}

for (var j = 0; j < actors.length; j++) {
  actors[j].pipe(process.stdout);
  actors[j].start(function(err) {
    if (err) {
      throw err;
    }
  });
}
