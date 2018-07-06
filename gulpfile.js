/* global process, __dirname */
'use strict';
const gulp = require('gulp');
const execAnon = require('./');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const jsforce = require('jsforce');
const request = require('request');

try{
const privateKey = fs.readFileSync('./'+process.env.SF_PRIVATEKEY_PATH, 'utf8');
} catch(){}
let conn;
if(typeof process.env.SF_USERNAME != 'undefined' && typeof process.env.SF_PASSWORD != 'undefined') {
  conn = new jsforce.Connection({
    loginUrl : process.env.SF_SERVERURL
  });
  conn.login(process.env.SF_USERNAME, process.env.SF_PASSWORD, (error, userInfo) => {
    if (error) { return new PluginError(err) }
  });
} else if (typeof process.env.SF_CLIENTID != 'undefined' && typeof privateKey != 'undefined') {
  let token = jwt.sign({}, privateKey, {
    issuer: clientId,
    audience: process.env.SF_SERVERURL,
    expiresInMinutes: 5,
    algorithm:'RS256'
  });
  request({
      uri: process.env.SF_SERVERURL'/services/oauth2/token',
      form: {
        'grant_type': 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        'assertion':  token
      },
      method: 'post'
    }, function(err, res, body) {
    if (error || res.statusCode != 200) { return new PluginError(err||res) }
    conn = new jsforce.Connection();
    conn.initialize({
      instanceUrl: result.instance_url,
      accessToken: result.access_token
    });
  });
}


gulp.task('exec-anon', function() {
  gulp.src("./script/*")
    .pipe(execAnon(conn));
});