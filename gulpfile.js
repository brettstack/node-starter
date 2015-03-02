var gulp = require('gulp'),
  nodemon = require('gulp-nodemon');

gulp.task('develop', function () {
  nodemon({
    script: 'apiServer.js',
    ext: 'js',
    ignore: 'primus.js'
  });
});

gulp.task('default', [
  'develop'
]);
