'use strict';

var App = require('base-app');
var Boilerplate = require('boilerplate');
var boilerplate = require('./');
var app = new App();
app.use(boilerplate());

var h5bp = new Boilerplate({
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

app.boilerplateStream(h5bp)
  .on('end', function() {
    console.log('done');
  });

// app.boilerplate(h5bp, function(err) {
//   if (err) return console.error(err);
//   console.log('done');
// });
