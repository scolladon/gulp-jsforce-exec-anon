'use strict';
const gutil = require('gulp-util');
const through = require('through2');
const jsforce = require('jsforce');
const path = require('path');

const PLUGIN_NAME = 'gulp-jsforce-exec-anon';

module.exports = options =>{
  return through.obj((file, enc, callback) => {
    
    const conn = new jsforce.Connection({
      loginUrl : options.loginUrl
    });


    conn.login(options.username, options.password, (error, userInfo) => {
      if (error) { return callback(new gutil.PluginError(PLUGIN_NAME,error)); }
      conn.tooling.executeAnonymous(file.contents, (err, res) => {
        if (err) { return callback(new gutil.PluginError(PLUGIN_NAME,err)); }
        else if (!res.success) { return callback(new gutil.PluginError(PLUGIN_NAME,res.compileProblem)); }
        gutil.log(PLUGIN_NAME, path.basename(file.path) + ' successfuly executed anonymously ', gutil.colors.green(':)'))
        return callback(null,file);
      });
    });
  });
};