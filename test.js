'use strict';

require('mocha');
var assert = require('assert');
var boilerplate = require('./');

describe('base-boilerplate', function() {
  it('should export a function', function() {
    assert.equal(typeof boilerplate, 'function');
  });

  it('should export an object', function() {
    assert(boilerplate);
    assert.equal(typeof boilerplate, 'object');
  });

  it('should throw an error when invalid args are passed', function(cb) {
    try {
      boilerplate();
      cb(new Error('expected an error'));
    } catch (err) {
      assert(err);
      assert.equal(err.message, 'expected first argument to be a string');
      assert.equal(err.message, 'expected callback to be a function');
      cb();
    }
  });
});
