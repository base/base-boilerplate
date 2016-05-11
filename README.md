# base-boilerplate [![NPM version](https://img.shields.io/npm/v/base-boilerplate.svg?style=flat)](https://www.npmjs.com/package/base-boilerplate) [![NPM downloads](https://img.shields.io/npm/dm/base-boilerplate.svg?style=flat)](https://npmjs.org/package/base-boilerplate) [![Build Status](https://img.shields.io/travis/node-base/base-boilerplate.svg?style=flat)](https://travis-ci.org/node-base/base-boilerplate)

Plugin that adds support for generating project files from a declarative boilerplate configuration.

## Install

Install with [npm](https://www.npmjs.com/):

```sh
$ npm install base-boilerplate --save
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

### [.boilerplate](index.js#L56)

Generate files from a declarative [boilerplate](http://boilerplates.io) configuration and return a stream.

**Params**

* `boilerplate` **{Object}**: Scaffold configuration object.
* `cb` **{Function}**: Optional callback function. If not passed, `.boilerplateStream` will be called and a stream will be returned.

**Example**

```js
var Scaffold = require('boilerplate');
var boilerplate = new Scaffold({
  options: {cwd: 'source'},
  posts: {
    src: ['content/*.md']
  },
  pages: {
    src: ['templates/*.hbs']
  }
});

app.boilerplate(boilerplate, function(err) {
  if (err) console.log(err);
});
```

### [.boilerplateStream](index.js#L117)

Generate files from a declarative [boilerplate](http://boilerplates.io) configuration.

**Params**

* `boilerplate` **{Object}**: [boilerplate](http://boilerplates.io) configuration object.
* `returns` **{Stream}**: returns a stream with all processed files.

**Example**

```js
var Scaffold = require('boilerplate');
var boilerplate = new Scaffold({
  options: {cwd: 'source'},
  posts: {
    src: ['content/*.md']
  },
  pages: {
    src: ['templates/*.hbs']
  }
});

app.boilerplateStream(boilerplate)
  .on('error', console.error)
  .on('end', function() {
    console.log('done!');
  });
```

## Related projects

You might also be interested in these projects:

* [base-generators](https://www.npmjs.com/package/base-generators): Adds project-generator support to your `base` application. | [homepage](https://github.com/node-base/base-generators)
* [base-scaffold](https://www.npmjs.com/package/base-scaffold): Base plugin that adds support for generating files from a declarative scaffold configuration. | [homepage](https://github.com/node-base/base-scaffold)
* [base-task](https://www.npmjs.com/package/base-task): base plugin that provides a very thin wrapper around [https://github.com/doowb/composer](https://github.com/doowb/composer) for adding task methods to… [more](https://www.npmjs.com/package/base-task) | [homepage](https://github.com/node-base/base-task)
* [base](https://www.npmjs.com/package/base): base is the foundation for creating modular, unit testable and highly pluggable node.js applications, starting… [more](https://www.npmjs.com/package/base) | [homepage](https://github.com/node-base/base)

## Contributing

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/node-base/base-boilerplate/issues/new).

## Building docs

Generate readme and API documentation with [verb](https://github.com/verbose/verb):

```sh
$ npm install verb && npm run docs
```

Or, if [verb](https://github.com/verbose/verb) is installed globally:

```sh
$ verb
```

## Running tests

Install dev dependencies:

```sh
$ npm install -d && npm test
```

## Author

**Jon Schlinkert**

* [github/jonschlinkert](https://github.com/jonschlinkert)
* [twitter/jonschlinkert](http://twitter.com/jonschlinkert)

## License

Copyright © 2016, [Jon Schlinkert](https://github.com/jonschlinkert).
Released under the [MIT license](https://github.com/node-base/base-boilerplate/blob/master/LICENSE).

***

_This file was generated by [verb](https://github.com/verbose/verb), v0.9.0, on May 11, 2016._