var gulp = require('gulp'),
  nodemon = require('gulp-nodemon'),
  livereload = require('gulp-livereload');

gulp.task('develop', function () {
  livereload.listen({
    port: 5086
  });
  nodemon({
    script: 'apiServer.js',
    ext: 'js',
  }).on('restart', function () {
    setTimeout(function () {
      livereload.changed();
    }, 500);
  });
});

gulp.task('default', [
  'develop'
]);
