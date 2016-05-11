/*!
 * base-boilerplate (https://github.com/node-base/base-boilerplate)
 *
 * Copyright (c) 2016, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var debug = require('debug')('base-boilerplate');

module.exports = function(config) {
  return function(app) {
    if (this.isRegistered('base-boilerplate')) return;
    debug('initializing "%s", from "%s"', __filename, module.parent.id);

    this.define('boilerplate', function() {
      debug('running boilerplate');
      
    });
  };
};
