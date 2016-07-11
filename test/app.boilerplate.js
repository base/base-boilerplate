'use strict';

require('mocha');
var assert = require('assert');
var App = require('base-app');
var Boilerplate = require('boilerplate');
var boilerplate = require('..');
var config;
var app;

describe('boilerplates', function() {
  beforeEach(function() {
    app = new App();
    app.use(boilerplate());
  });

  it('should create a new boilerplate', function() {
    config = app.boilerplate({
      docs: {
        src: 'b.txt',
        dest: 'actual',
        cwd: process.cwd()
      }
    });
    assert(config instanceof Boilerplate);
  });

  it('should add a boilerplate to app.boilerplates', function() {
    app.boilerplate('foo', {
      docs: {
        src: 'b.txt',
        dest: 'actual',
        cwd: process.cwd()
      }
    });
    assert(app.boilerplates.hasOwnProperty('foo'));
  });

  it('should get a boilerplate from app.boilerplates', function() {
    app.boilerplate('foo', {
      docs: {
        src: 'b.txt',
        dest: 'actual',
        cwd: process.cwd()
      }
    });
    var bp = app.getBoilerplate('foo');
    assert(bp instanceof Boilerplate);
  });

  it('should add scaffolds to boilerplate.scaffolds', function() {
    app.boilerplate('foo', {
      docs: {
        src: 'b.txt',
        dest: 'actual',
        cwd: process.cwd()
      }
    });
    var bp = app.getBoilerplate('foo');
    assert(bp instanceof Boilerplate);
  });
});

