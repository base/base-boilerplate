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
    if (!utils.isValid(app, 'base-boilerplate')) return;

    /**
     * Boilerplate cache
     */

    this.boilerplates = this.boilerplates || {};
    var Boilerplate;

    /**
     * Register plugins
     */

    this.use(utils.pipeline());
    this.use(utils.scaffold());
    this.use(utils.plugins());

    /**
     * Add methods to the API
     */

    this.define({

      /**
       * Returns true if the given value is a valid `Boilerplate`.
       *
       * ```js
       * app.isBoilerplate('foo');
       * //=> false
       *
       * var Boilerplate = require('boilerplate');
       * var boilerplate = new Boilerplate();
       * app.isBoilerplate(boilerplate);
       * //=> true
       * ```
       * @name .isBoilerplate
       * @param {any} `val`
       * @return {Boolean}
       * @api public
       */

      isBoilerplate: utils.isBoilerplate,

      /**
       * Get boilerplate `name` from `app.boilerplates`, or set boilerplate `name` with the given
       * `config`.
       *
       * ```js
       * app.boilerplate('foo', {
       *   docs: {
       *     options: {},
       *     files: {
       *       src: ['*'],
       *       dest: 'foo'
       *     }
       *   }
       * });
       *
       * // or
       * var boilerplate = app.boilerplate('foo');
       * ```
       * @name .boilerplate
       * @param {String|Object|Function} `name`
       * @param {Object|Fucntion} `config`
       * @return {Object} Returns the app instance when setting a boilerplate, or the boilerplate instance when getting a boilerplate.
       * @api public
       */

      boilerplate: function(name, config) {
        if (utils.isObject(name)) {
          return this.getBoilerplate(name);
        }

        if (!config && typeof name === 'string' || utils.isObject(name)) {
          return this.getBoilerplate(name);
        }

        this.setBoilerplate.apply(this, arguments);
        if (typeof name === 'string') {
          return this.getBoilerplate(name);
        }
        return this;
      },

      /**
       * Add boilerplate `name` to `app.boilerplates`.
       *
       * ```js
       * app.addBoilerplate('foo', {
       *   docs: {
       *     options: {},
       *     files: {
       *       src: ['*'],
       *       dest: 'foo'
       *     }
       *   }
       * });
       * ```
       * @param {String} `name`
       * @param {Object|Function} `config`
       * @api public
       */

      setBoilerplate: function(name, config) {
        if (typeof name !== 'string') {
          throw new TypeError('expected the first argument to be a string');
        }
        if (utils.isObject(config)) {
          config.name = name;
        }
        this.emit('boilerplate.set', name, config);
        this.boilerplates[name] = config;
        return this;
      },

      /**
       * Get boilerplate `name` from `app.boilerplates`, or return a normalized
       * instance of `Boilerplate` if an object or function is passed.
       *
       * ```js
       * var boilerplate = app.getBoilerplate('foo');
       *
       * // or create an instance of `Boilerplate` using the given object
       * var boilerplate = app.getBoilerplate({
       *   docs: {
       *     options: {},
       *     files: {
       *       src: ['*'],
       *       dest: 'foo'
       *     }
       *   }
       * });
       * ```
       * @param {String} `name`
       * @param {Object} `options`
       * @api public
       */

      getBoilerplate: function(name, options) {
        var opts = utils.merge({}, this.options);
        var config;

        switch (utils.typeOf(name)) {
          case 'function':
            config = name;
            break;
          case 'object':
            config = name;
            name = config.name;
            break;
          case 'string':
          default: {
            opts.name = name;
            config = this.boilerplates[name];
            if (typeof config === 'undefined') {
              throw new Error(`boilerplate "${name}" is not registered`);
            }
            break;
          }
        }

        if (typeof config === 'function') {
          config = config(opts);
        }

        if (!utils.isObject(config)) {
          throw new TypeError('expected config to be an object');
        }

        // if `config` is not an instance of Boilerplate, make it one
        if (!this.isBoilerplate(config)) {
          var Boilerplate = this.get('Boilerplate');
          var boilerplate = new Boilerplate(opts);
          boilerplate.options = utils.merge({}, this.options, boilerplate.options, options);
          if (typeof name === 'string') {
            boilerplate.name = name;
          }
          if (typeof this.run === 'function') {
            this.run(boilerplate);
          }
          this.emit('boilerplate', boilerplate);
          boilerplate.on('scaffold', this.emit.bind(this, 'scaffold'));
          config = boilerplate.expand(config);
        }

        // otherwise, ensure options are merged onto the boilerplate,
        // and all targets are emitted
        else {
          config.options = utils.merge({}, this.options, config.options, options);
          if (typeof name === 'string') {
            config.name = name;
          }
          if (typeof this.run === 'function') {
            this.run(config);
          }
          for (var key in config.targets) {
            if (config.targets.hasOwnProperty(key)) {
              this.emit('target', config.targets[key]);
            }
          }
          config.on('target', this.emit.bind(this, 'target'));
          this.emit('boilerplate', config);
        }
        return config;
      },

      /**
       * Asynchronously generate files from a declarative [boilerplate][] configuration.
       *
       * ```js
       * var Boilerplate = require('boilerplate');
       * var boilerplate = new Boilerplate({
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
       * @param {Object} `boilerplate` Boilerplate configuration object.
       * @param {Function} `cb` Optional callback function. If not passed, `.boilerplateStream` is called and a stream is returned.
       * @api public
       */

      boilerplateSeries: function(boilerplate, options, cb) {
        debug('boilerplateSeries', boilerplate);

        if (typeof options === 'function') {
          cb = options;
          options = {};
        }

        if (typeof cb !== 'function') {
          return this.boilerplateStream(boilerplate, options);
        }

        if (!utils.isBoilerplate(boilerplate)) {
          throw new Error('expected an instance of Boilerplate');
        }

        this.run(boilerplate);
        var scaffolds = boilerplate.scaffolds;
        var targets = boilerplate.targets;

        utils.eachSeries(Object.keys(scaffolds), function(key, next) {
          var scaffold = scaffolds[key];
          boilerplate.run(scaffold);
          app.scaffold(scaffold, options, next);
        }, function(err) {
          if (err) {
            cb(err);
            return;
          }

          utils.eachSeries(Object.keys(targets), function(key, next) {
            var target = targets[key];
            boilerplate.run(target);

            if (!target.files) {
              next();
              return;
            }
            app.each(target, options, next);
          }, cb);
        });
      },

      /**
       * Generate files from a declarative [boilerplate][] configuration and return a stream.
       *
       * ```js
       * var Boilerplate = require('boilerplate');
       * var boilerplate = new Boilerplate({
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

      boilerplateStream: function(boilerplate, options) {
        debug('boilerplateStream', boilerplate);

        if (!utils.isBoilerplate(boilerplate)) {
          throw new Error('expected an instance of Boilerplate');
        }

        this.run(boilerplate);
        var scaffolds = boilerplate.scaffolds;
        var targets = boilerplate.targets;
        var streams = [];

        for (var prop in scaffolds) {
          var scaffold = scaffolds[prop];
          boilerplate.run(scaffold);
          streams.push(this.scaffoldStream(scaffold, options));
        }

        for (var name in targets) {
          var target = targets[name];
          boilerplate.run(target);

          if (target.files) {
            streams.push(this.eachStream(target, options));
          }
        }

        var stream = utils.ms.apply(utils.ms, streams);
        stream.on('finish', stream.emit.bind(stream, 'end'));
        return stream;
      },

      /**
       * Get or set the `Boilerplate` constructor. Exposed as a getter/setter to allow it to be
       * customized before or after instantiation.
       *
       * ```js
       * // set
       * app.Boilerplate = CustomBoilerplateFn;
       *
       * // get
       * var scaffold = new app.Boilerplate();
       * ```
       * @name Boilerplate
       * @api public
       */

      Boilerplate: {
        configurable: true,
        set: function(val) {
          if (typeof val !== 'function') {
            throw new TypeError('expected Boilerplate to be a constructor function');
          }
          Boilerplate = val;
        },
        get: function() {
          return Boilerplate || this.options.Boilerplate || utils.Boilerplate;
        }
      }
    });
  };
};
