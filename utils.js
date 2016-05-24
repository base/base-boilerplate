'use strict';

var utils = require('lazy-cache')(require);
var fn = require;
require = utils;

/**
 * Lazily required module dependencies
 */

require('async-each-series', 'eachSeries');
require('base-pipeline', 'pipeline');
require('base-plugins', 'plugins');
require('base-scaffold', 'scaffold');
require('is-boilerplate');
require('is-registered');
require('is-valid-instance');
require('merge-stream', 'ms');
require = fn;

/**
 * Utils
 */

utils.isValid = function(app, prop) {
  if (!utils.isValidInstance(app)) {
    return false;
  }
  if (utils.isRegistered(app, 'base-boilerplate')) {
    return false;
  }
  return true;
};

/**
 * Expose `utils` modules
 */

module.exports = utils;
