'use strict';
var gutil = require('gulp-util');
var through = require('through2');
var jsforce = require('jsforce');

var PULGIN_NAME = 'gulp-jsforce-exec-anon';

module.exports = function(options) {
  return through.obj(function(file, enc, callback) {
    if (file.isNull()) {
      return callback(null, file);
    }
    if (file.isStream()) {
      return callback(new gutil.PluginError(PULGIN_NAME, 'Stream input is not supported'));
    }
    
    var conn = new jsforce.Connection({
      loginUrl : options.loginUrl
    });


    conn.login(options.username, options.password, function(error, userInfo){
      if (error) { return callback(new gutil.PluginError(PULGIN_NAME,error)); }
      conn.tooling.executeAnonymous(file.contents, function(err, res) {
        if (err) { return callback(new gutil.PluginError(PULGIN_NAME,err)); }
        else if (!res.success) { return callback(new gutil.PluginError(PULGIN_NAME,res.compileProblem)); }
        gutil.log(PULGIN_NAME, 'Execute Anonymous successful', gutil.colors.green(':)'))
        return callback(null,file);
      });
    });
  });
};