/* global process, __dirname */
'use strict';
var fs = require('fs');
var gulp = require('gulp');
var zip = require('gulp-zip');
var execAnon = require('./');

gulp.task('execanon', function() {
  gulp.src("./script/*")
    .pipe(execAnon({
      username: process.env.SF_USERNAME,
      password: process.env.SF_PASSWORD,
      loginUrl: process.env.SF_SERVERURL
    }));
});
