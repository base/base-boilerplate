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
require('boilerplate', 'Boilerplate');
require('is-boilerplate');
require('is-valid-app', 'isValid');
require('kind-of', 'typeOf');
require('mixin-deep', 'merge');
require('merge-stream', 'ms');
require = fn;

utils.isObject = function(val) {
  return utils.typeOf(val) === 'object';
};

/**
 * Expose `utils` modules
 */

module.exports = utils;
