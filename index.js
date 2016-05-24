/*!
 * base-boilerplate (https://github.com/node-base/base-boilerplate)
 *
 * Copyright (c) 2016, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var debug = require('debug')('base-boilerplate');
var utils = require('./utils');

module.exports = function(config) {
  return function(app) {
    if (!utils.isValid(app)) return;
    debug('initializing "%s", from "%s"', __filename, module.parent.id);

    /**
     * Register plugins
     */

    this.use(utils.pipeline());
    this.use(utils.scaffold());
    this.use(utils.plugins());

    /**
     * Generate files from a declarative [boilerplate][] configuration and return a stream.
     *
     * ```js
     * var Scaffold = require('boilerplate');
     * var boilerplate = new Scaffold({
     *   options: {cwd: 'source'},
     *   posts: {
     *     src: ['content/*.md']
     *   },
     *   pages: {
     *     src: ['templates/*.hbs']
     *   }
     * });
     *
     * app.boilerplate(boilerplate, function(err) {
     *   if (err) console.log(err);
     * });
     * ```
     * @name .boilerplate
     * @param {Object} `boilerplate` Scaffold configuration object.
     * @param {Function} `cb` Optional callback function. If not passed, `.boilerplateStream` will be called and a stream will be returned.
     * @api public
     */

    this.define('boilerplate', function(boilerplate, options, cb) {
      if (!utils.isBoilerplate(boilerplate)) {
        throw new Error('expected an instance of Boilerplate');
      }

      if (typeof options === 'function') {
        cb = options;
        options = {};
      }

      if (typeof cb !== 'function') {
        return this.boilerplateStream(boilerplate, options);
      }

      this.run(boilerplate);
      var scaffolds = boilerplate.scaffolds;
      var targets = boilerplate.targets;
      var keys = Object.keys(targets);

      utils.eachSeries(keys, function(key, next) {
        var target = targets[key];
        boilerplate.run(target);
        if (!target.files) {
          next();
          return;
        }
        app.each(target, options, next);
      }, function(err) {
        if (err) return cb(err);
        keys = Object.keys(scaffolds);
        utils.eachSeries(keys, function(key, next) {
          var scaffold = scaffolds[key];
          boilerplate.run(scaffold);
          app.scaffold(scaffold, options, next);
        }, cb);
      });
    });

    /**
     * Generate files from a declarative [boilerplate][] configuration.
     *
     * ```js
     * var Scaffold = require('boilerplate');
     * var boilerplate = new Scaffold({
     *   options: {cwd: 'source'},
     *   posts: {
     *     src: ['content/*.md']
     *   },
     *   pages: {
     *     src: ['templates/*.hbs']
     *   }
     * });
     *
     * app.boilerplateStream(boilerplate)
     *   .on('error', console.error)
     *   .on('end', function() {
     *     console.log('done!');
     *   });
     * ```
     * @name .boilerplateStream
     * @param {Object} `boilerplate` [boilerplate][] configuration object.
     * @return {Stream} returns a stream with all processed files.
     * @api public
     */

    this.define('boilerplateStream', function(boilerplate, options) {
      if (!utils.isBoilerplate(boilerplate)) {
        throw new Error('expected an instance of Boilerplate');
      }

      this.run(boilerplate);
      var scaffolds = boilerplate.scaffolds;
      var targets = boilerplate.targets;
      var streams = [];

      for (var name in targets) {
        var target = targets[name];
        boilerplate.run(target);

        if (target.files) {
          streams.push(this.eachStream(target, options));
        }
      }

      for (var prop in scaffolds) {
        var scaffold = scaffolds[prop];
        boilerplate.run(scaffold);
        streams.push(this.scaffoldStream(scaffold, options));
      }

      var stream = utils.ms.apply(utils.ms, streams);
      stream.on('finish', stream.emit.bind(stream, 'end'));
      return stream;
    });
  };
};
