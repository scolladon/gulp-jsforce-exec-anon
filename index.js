'use strict';
const gutil = require('gulp-util');
const through = require('through2');
const jsforce = require('jsforce');
const path = require('path');

const PLUGIN_NAME = 'gulp-jsforce-exec-anon';

module.exports = connection =>{
  return through.obj((file, enc, callback) => {
    connection.tooling.executeAnonymous(file.contents, (err, res) => {
      if (err) { return cb(new gutil.PluginError(PLUGIN_NAME,err)); }
      else if (!res.success) { return cb(new gutil.PluginError(PLUGIN_NAME,res.compileProblem)); }
      gutil.log(PLUGIN_NAME, path.basename(file.path) + ' successfuly executed anonymously ', gutil.colors.green(':)'))
      return cb(null,file);
    });
  });
};