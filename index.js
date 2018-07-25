'use strict';
const gutil = require('gulp-util')
     ,through = require('through2')
     ,jsforce = require('jsforce')
     ,path = require('path')
     ,fs = require('fs')
     ,jwt = require("salesforce-jwt-bearer-token-flow")

const PLUGIN_NAME = 'gulp-jsforce-exec-anon';

let conn = null;

module.exports = options =>{
  if(conn === null) {
    // authent
  }

  return through.obj((file, enc, cb) => {
    
    jwt.getToken({
        iss: options.consumerKey,
        sub: options.username,
        aud: options.loginUrl,
        privateKey: fs.readFileSync(options.privateKeyPath).toString('utf8')
    },(error,token) => {
      if(error){ return cb(new gutil.PluginError(PLUGIN_NAME,error)); }
      conn = new jsforce.Connection({
        instanceUrl : token.instance_url,
        accessToken : token.access_token
      });
      conn.tooling.executeAnonymous(file.contents, (err, res) => {
        if (err){ return cb(new gutil.PluginError(PLUGIN_NAME,err)); }
        else if (!res.success) { return cb(new gutil.PluginError(PLUGIN_NAME,res.compileProblem)); }
        gutil.log(PLUGIN_NAME, path.basename(file.path) + ' successfuly executed anonymously ', gutil.colors.green(':)'))
        return cb(null,file);
      });
    });
  });
};