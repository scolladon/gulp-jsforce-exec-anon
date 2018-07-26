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
  return through.obj((file, enc, cb) => {  
    authenticate(options)
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

const authenticate = (options) => {
  return new Promise((resolve,reject) => {
    if(conn !== null) {
      return resolve(conn);
    }
    
    if(!!options.password) {
      conn = new jsforce.Connection({
      loginUrl : options.loginUrl
      });
      conn.login(options.username, options.password, (error, userInfo) => {
        if (error) return reject(error)
        return resolve(conn);
      });
    } else if(!!options.privateKeyPath) {
      jwt.getToken({
        iss: options.consumerKey,
        sub: options.username,
        aud: options.loginUrl,
        privateKey: fs.readFileSync(options.privateKeyPath).toString('utf8')
      },(error,token) => {
        if(error)return reject(error)
        conn = new jsforce.Connection({
          instanceUrl : token.instance_url,
          accessToken : token.access_token
        });
        return resolve(conn);
      });
    } else {
      return reject('Authentication impossible')
    }
  })
}