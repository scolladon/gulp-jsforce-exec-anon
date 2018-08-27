/* global process, __dirname */
'use strict';
const gulp = require('gulp');
const execAnon = require('./');

gulp.task('exec-anon', () => {
  gulp.src("./script/*")
    .pipe(execAnon({
      username: process.env.SF_USERNAME,
      password: process.env.SF_PASSWORD,
      consumerKey: process.env.SF_CONSUMERKEY,
      loginUrl: process.env.SF_SERVERURL,
      privateKeyPath: process.env.PRIVATE_KEY_PATH
    })
  );
});