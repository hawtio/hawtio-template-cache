var gulp = require('gulp');
var templateCache = require('gulp-angular-templatecache');
var concat = require('gulp-concat');
var connect = require('gulp-connect');
var del = require('del');

var config = {
  src: 'plugins/**/*.js',
  templates: 'plugins/**/*.html',
  js: 'hawtio-template-cache.js',
  template: 'hawtio-template-cache-template.js',
  templateModule: 'hawtio-template-cache-template'
};

gulp.task('templates', function() {
  return gulp.src(config.templates)
    .pipe(templateCache({
      filename: 'templates.js',
      root: 'plugins/',
      standalone: true,
      module: config.templateModule,
      templateFooter: '}]); hawtioPluginLoader.addModule("' + config.templateModule + '");'
    }))
    .pipe(gulp.dest('.'));
});

gulp.task('concat', ['templates'], function() {
  return gulp.src([config.src, './templates.js'])
    .pipe(concat(config.js))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('clean', ['concat'], function() {
  return del('./templates.js');
});

gulp.task('connect', function() {
  gulp.watch([config.src, config.templates], ['build']);
  gulp.watch(['dist/' + config.js], ['reload']);
  connect.server({
    root: '.',
    livereload: true,
    port: 2772,
    fallback: 'index.html'
  });
});

gulp.task('reload', function() {
  gulp.src('.')
    .pipe(connect.reload());
});

gulp.task('build', ['templates', 'concat', 'clean']);
gulp.task('default', ['build', 'connect']);
