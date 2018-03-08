var gulp = require('gulp');
var babel = require('gulp-babel');
var copy = require('gulp-copy');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var zip    = require('gulp-zip');


gulp.task('build:equation_editor', function() {
  gulp.src(['./src/equation_editor/events.js',
            './src/equation_editor/view.js',
            './src/equation_editor/collapsible_view.js',
            './src/equation_editor/button_views.js',
            './src/equation_editor/button_group_view.js',
            './src/equation_editor/button_view_factory.js',
            './src/equation_editor/button_group_view_factory.js',
            './src/equation_editor/equation_editor_view.js'
    ])
    .pipe(babel({
            presets: ['env']
        }))
    .pipe(uglify())
    .pipe(concat('equation_editor.js'))
    .pipe(gulp.dest('./build/js/'))
});

gulp.task('build:plugin', function() {
  gulp.src('./src/plugin.js')
    .pipe(babel({
            presets: ['env']
        }))
    .pipe(uglify())
    .pipe(concat('plugin.min.js')) // include "min" in the filename to please TinyMCE
    .pipe(gulp.dest('./build/js/'))
});

gulp.task('build:copy_config', function() {
  gulp.src('./src/equation_editor/config.json')
    .pipe(gulp.dest('./build/'))
});

gulp.task('build:copy_mathquill', function() {
  gulp.src('./mathquill/build/mathquill.min.js')
    .pipe(gulp.dest('./build/js/'))
  gulp.src('./mathquill/build/mathquill.css')
    .pipe(gulp.dest('./build/'))
  gulp.src(['./mathquill/build/fonts/.*'])
      .pipe(copy('./build/fonts/'));
});

gulp.task('build:zip', function() {
  gulp.src(['./build/fonts/*',
            './build/js/equation_editor.js',
            './build/js/mathquill.min.js',
            './build/js/plugin.min.js',
            './build/equation_editor.css',
            './build/equation_editor.html',
            './build/mathquill.css',
            './src/equation_editor/config.json'
    ])
    .pipe(zip('tinymce_equation_editor.zip'))
    .pipe(gulp.dest('./build/'))
});

gulp.task('debug:equation_editor', function() {
  gulp.src(['./src/equation_editor/events.js',
            './src/equation_editor/view.js',
            './src/equation_editor/collapsible_view.js',
            './src/equation_editor/button_views.js',
            './src/equation_editor/button_group_view.js',
            './src/equation_editor/button_view_factory.js',
            './src/equation_editor/button_group_view_factory.js',
            './src/equation_editor/equation_editor_view.js'
    ])
    .pipe(concat('equation_editor.js'))
    .pipe(gulp.dest('./build/js/'))
});

gulp.task('debug:plugin', function() {
  gulp.src('./src/plugin.js')
    .pipe(concat('plugin.min.js')) // include "min" in the filename to please TinyMCE
    .pipe(gulp.dest('./build/js/'))
});

gulp.task('debug:copy_mathquill', function() {
  gulp.src('./mathquill/build/mathquill.js')
    .pipe(concat('mathquill.min.js'))
    .pipe(gulp.dest('./build/js/'))
  gulp.src('./mathquill/build/mathquill.css')
    .pipe(gulp.dest('./build/'))
  gulp.src(['./mathquill/build/fonts/.*'])
      .pipe(copy('./build/fonts/'));
});

gulp.task('watch', ['debug:plugin', 'debug:equation_editor'], function () {
    gulp.watch(['src/equation_editor/'+'*.js', 'src/'+'*js'], ['debug:plugin', 'debug:equation_editor']);
});

gulp.task('build', ['build:equation_editor', 'build:plugin', 'build:copy_config', 'build:copy_mathquill', 'build:zip']);
gulp.task('debug', ['debug:equation_editor', 'debug:plugin', 'build:copy_config', 'debug:copy_mathquill']);
