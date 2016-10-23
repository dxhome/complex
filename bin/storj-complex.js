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

      // regular report contact
    }

    // add seed prior to joining
    //renter.addSeedList(seedContact);
    actors.push(renter);
  }
}

for (let j = 0; j < actors.length; j++) {
  actors[j].pipe(process.stdout);

  if (actors[j] instanceof complex.createRenter) {
    actors[j].on('ready', function () {
      setInterval(listContacts.bind(actors[j].network), 10000);
    });
  }

  actors[j].start(function(err) {
    if (err) {
      throw err;
    }
  });
}

function listContacts() {
  var self = this;

  if (typeof this === 'undefined') {
    console.log('network is not ready yet, skip it...');
    return
  }

  console.log('List current contacts...');

  console.log('found self contact %s/%s', self.contact.toString(), self.contact.nodeID);

  for (var k in self.router._buckets) {
    let contactlist = self.router._buckets[k].getContactList();
    if (! contactlist) {
      console.log('no contacts found');
    } else {
      contactlist.forEach(function (c) {
        console.log('found other contact %s/%s', c.toString(), c.nodeID);
      });
    }
  }
}

