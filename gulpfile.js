/* global process, __dirname */
'use strict';
var gulp = require('gulp');
var execAnon = require('./');

gulp.task('exec-anon', function() {
  gulp.src("./script/*")
    .pipe(execAnon({
      username: process.env.SF_USERNAME,
      password: process.env.SF_PASSWORD,
      loginUrl: process.env.SF_SERVERURL
    }));
});
