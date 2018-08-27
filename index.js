'use strict';
const gutil = require('gulp-util')
     ,through = require('through2')
     ,jsforce = require('jsforce')
     ,path = require('path')
     ,fs = require('fs')
     ,jwt = require('salesforce-jwt-bearer-token-flow')
     ,authentDelegate = require('sfdc-authent-delegate');

const PLUGIN_NAME = 'gulp-jsforce-exec-anon';

let conn = null;

module.exports = options =>{
  return through.obj((file, enc, cb) => {  
    authentDelegate.getSession(options)
    .then(sfConn=> {return new Promise((resolve,reject)=>{
      sfConn.tooling.executeAnonymous(file.contents, (err, res) => {
        if(err)return reject(err)
        else if(!res.success)return reject(res.compileProblem)
        else{
          gutil.log(PLUGIN_NAME, path.basename(file.path) + ' successfuly executed anonymously ', gutil.colors.green(':)'))
          resolve();
        }
      });
    })})
    .catch((err)=>{
      return cb(new gutil.PluginError(PLUGIN_NAME,err))
    })
    .then(()=> {return cb(null,file)});
  });
};