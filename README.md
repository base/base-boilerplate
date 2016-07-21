# base-boilerplate [![NPM version](https://img.shields.io/npm/v/base-boilerplate.svg?style=flat)](https://www.npmjs.com/package/base-boilerplate) [![NPM downloads](https://img.shields.io/npm/dm/base-boilerplate.svg?style=flat)](https://npmjs.org/package/base-boilerplate) [![Build Status](https://img.shields.io/travis/node-base/base-boilerplate.svg?style=flat)](https://travis-ci.org/node-base/base-boilerplate)

Plugin that adds support for generating project files from a declarative boilerplate configuration.

## Install

Install with [npm](https://www.npmjs.com/):

```sh
$ npm install --save base-boilerplate
```

## Usage

```js
var boilerplate = require('base-boilerplate');
var App = require('base-app');
var app = new App();
app.use(boilerplate());
```

## Example

**Download h5bp**

To run the example, first you'll need to git clone [html5-boilerplate](https://github.com/h5bp/html5-boilerplate) with the following command:

```js
$ git clone https://github.com/h5bp/html5-boilerplate.git vendor/h5bp
```

**Configuration**

The following examples returns a normalized configuration object that includes every file in the [html5-boilerplate](https://github.com/h5bp/html5-boilerplate) project, organized exactly the way the project itself is organized.

```js
var Boilerplate = require('boilerplate');
var boilerplate = new Boilerplate({
  options: {
    cwd: 'vendor/h5bp/dist',
    destBase: 'src'
  },
  site: {
    root: {src: ['{.*,*.*}'],   dest: 'root'},
    css:  {src: ['css/*.css'],  dest: 'assets/css'},
    js:   {src: ['js/**/*.js'], dest: 'assets/js'},
    doc:  {src: ['doc/*.md'],   dest: 'docs'}
  },
});
```

**Generate**

Pass the configuration to the `.boilerplate` or `.boilerplateStream` method to "build" the boilerplate. In this example we're not doing any additional processing, so the source files will simply be copied to the specified destination directories.

```js
// stream
app.boilerplateStream(boilerplate)
  .on('end', function() {
    console.log('done');
  });

// async callback
app.boilerplate(boilerplate, function(err) {
  if (err) return console.error(err);
  console.log('done');
});
```

## API

### [.boilerplate](index.js#L64)

Get boilerplate `name` from `app.boilerplates`, or set boilerplate `name` with the given `config`.

**Params**

* `name` **{String|Object|Function}**
* `config` **{Object|Fucntion}**
* `returns` **{Object}**: Returns the app instance when setting a boilerplate, or the boilerplate instance when getting a boilerplate.

**Example**

```js
app.boilerplate('foo', {
  docs: {
    options: {},
    files: {
      src: ['*'],
      dest: 'foo'
    }
  }
});

// or
var boilerplate = app.boilerplate('foo');
```

**Params**

* `name` **{String}**
* `config` **{Object|Function}**

**Example**

```js
app.addBoilerplate('foo', {
  docs: {
    options: {},
    files: {
      src: ['*'],
      dest: 'foo'
    }
  }
});
```

**Params**

* `name` **{String}**
* `options` **{Object}**

**Example**

```js
var boilerplate = app.getBoilerplate('foo');

// or create an instance of `Boilerplate` using the given object
var boilerplate = app.getBoilerplate({
  docs: {
    options: {},
    files: {
      src: ['*'],
      dest: 'foo'
    }
  }
});
```

### [`.isBoilerplate](index.js#L217)

Returns true if the given value is a valid [Boilerplate](https://github.com/jonschlinkert/boilerplate).

**Params**

* `val` **{any}**
* `returns` **{Boolean}**

**Example**

```js
isBoilerplate('a');
//=> false
isBoilerplate({});
//=> false
isBoilerplate({ files: [] })
//=> false
isBoilerplate(new Boilerplate({ src: ['*.js'] }))
//=> true
```

### [Boilerplate](index.js#L234)

Get or set the `Boilerplate` constructor. Exposed as a getter/setter to allow it to be customized before or after instantiation.

**Example**

```js
// set
app.Boilerplate = function MyBoilerplateCtor() {};

// get
var scaffold = new app.Boilerplate();
```

## About

### Related projects

* [base-generators](https://www.npmjs.com/package/base-generators): Adds project-generator support to your `base` application. | [homepage](https://github.com/node-base/base-generators "Adds project-generator support to your `base` application.")
* [base-scaffold](https://www.npmjs.com/package/base-scaffold): Base plugin that adds support for generating files from a declarative scaffold configuration. | [homepage](https://github.com/node-base/base-scaffold "Base plugin that adds support for generating files from a declarative scaffold configuration.")
* [base-task](https://www.npmjs.com/package/base-task): base plugin that provides a very thin wrapper around [https://github.com/doowb/composer](https://github.com/doowb/composer) for adding task methods to… [more](https://github.com/node-base/base-task) | [homepage](https://github.com/node-base/base-task "base plugin that provides a very thin wrapper around <https://github.com/doowb/composer> for adding task methods to your application.")
* [base](https://www.npmjs.com/package/base): base is the foundation for creating modular, unit testable and highly pluggable node.js applications, starting… [more](https://github.com/node-base/base) | [homepage](https://github.com/node-base/base "base is the foundation for creating modular, unit testable and highly pluggable node.js applications, starting with a handful of common methods, like `set`, `get`, `del` and `use`.")

### Contributing

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](../../issues/new).

### Building docs

_(This document was generated by [verb-generate-readme](https://github.com/verbose/verb-generate-readme) (a [verb](https://github.com/verbose/verb) generator), please don't edit the readme directly. Any changes to the readme must be made in [.verb.md](.verb.md).)_

To generate the readme and API documentation with [verb](https://github.com/verbose/verb):

```sh
$ npm install -g verb verb-generate-readme && verb
```

### Running tests

Install dev dependencies:

```sh
$ npm install -d && npm test
```

### Author

**Jon Schlinkert**

* [github/jonschlinkert](https://github.com/jonschlinkert)
* [twitter/jonschlinkert](http://twitter.com/jonschlinkert)

### License

Copyright © 2016, [Jon Schlinkert](https://github.com/jonschlinkert).
Released under the [MIT license](https://github.com/node-base/base-boilerplate/blob/master/LICENSE).

***

_This file was generated by [verb](https://github.com/verbose/verb), v0.9.0, on July 21, 2016._