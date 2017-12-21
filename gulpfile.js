const gulp = require('gulp');
const eslint = require('gulp-eslint');
const minify = require('gulp-minify');
const concat = require('gulp-concat');
const del = require('del');

gulp.task('lint', function () {
  return gulp.src('./lib/**/*.js')
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
})

gulp.task('default', ['lint'])