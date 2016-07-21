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
  return function fn(app) {
    if (!utils.isValid(app, 'base-boilerplate')) return;
    debug('initializing base-boilerplate from <%s>', __filename);

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
        debug('setBoilerplate', name);
        if (typeof name !== 'string') {
          throw new TypeError('expected the first argument to be a string');
        }
        if (utils.isObject(config)) {
          config.name = name;
        }

        this.boilerplates[name] = config;
        this.emit('boilerplate.set', name, config);
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
        debug('getBoilerplate', name);
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
          config = config(utils.merge({}, this.options, options));
        }

        if (!utils.isObject(config)) {
          throw new TypeError('expected config to be an object');
        }

        // if `config` is not an instance of Boilerplate, make it one
        if (!this.isBoilerplate(config)) {
          var Boilerplate = this.get('Boilerplate');
          var boilerplate = new Boilerplate();
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
        } else {
          // otherwise, ensure options are merged onto the boilerplate,
          // and all targets are emitted
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
       * Returns true if the given value is a valid [Boilerplate][].
       *
       * ```js
       * isBoilerplate('a');
       * //=> false
       * isBoilerplate({});
       * //=> false
       * isBoilerplate({ files: [] })
       * //=> false
       * isBoilerplate(new Boilerplate({ src: ['*.js'] }))
       * //=> true
       * ```
       * @name `.isBoilerplate
       * @param {any} `val`
       * @return {Boolean}
       * @api public
       */

      isBoilerplate: utils.isBoilerplate,

      /**
       * Get or set the `Boilerplate` constructor. Exposed as a getter/setter to allow it to be
       * customized before or after instantiation.
       *
       * ```js
       * // set
       * app.Boilerplate = function MyBoilerplateCtor() {};
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
    return fn;
  };
};
