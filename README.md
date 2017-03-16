# gulp-jsforce-exec-anon

A gulp plugin for executing anonymous script, using JSforce.
As it is implemented purely in Node.js.

## Setup

```
$ npm init
$ npm install gulp gulp-jsforce-exec-anon --save-dev
```

## Example 

### Project Directory

```
├── gulpfile.js
├── package.json
└── script
    ├── script1
    └── script2
```

### gulpfile.js

```javascript
var gulp = require('gulp');
var execAnon = require('gulp-jsforce-exec-anon');

gulp.task('exec-anon', function() {
  gulp.src('./script/*')
    .pipe(execAnon({
      username: process.env.SF_USERNAME,
      password: process.env.SF_PASSWORD,
      loginUrl: process.env.SF_SERVERURL
    }));
});
```

### Execute anonymous

```
$ SF_USERNAME=username@example.com SF_PASSWORD=yourpassword SF_SERVERURL=https://test.salesforce.com  gulp exec-anon
```