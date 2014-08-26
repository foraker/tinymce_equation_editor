var gulp = require('gulp');
var coffee = require('gulp-coffee');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var zip    = require('gulp-zip');

gulp.task('build:equation_editor', function() {
  gulp.src(['./src/equation_editor/events.coffee',
            './src/equation_editor/view.coffee',
            './src/equation_editor/collapsible_view.coffee',
            './src/equation_editor/button_views.coffee',
            './src/equation_editor/button_group_view.coffee',
            './src/equation_editor/button_view_factory.coffee',
            './src/equation_editor/button_group_view_factory.coffee',
            './src/equation_editor/equation_editor_view.coffee'
    ])
    .pipe(coffee({bare: true}))
    .pipe(concat('equation_editor.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./build/js/'))
});

gulp.task('build:plugin', function() {
  gulp.src('./src/plugin.coffee')
    .pipe(coffee({bare: true}))
    .pipe(concat('plugin.min.js')) // include "min" in the filename to please TinyMCE
    .pipe(uglify())
    .pipe(gulp.dest('./build/js/'))
});

gulp.task('build:zip', function() {
  gulp.src(['./build/fonts/*',
            './build/js/equation_editor.js',
            './build/js/mathquill.min.js',
            './build/js/plugin.min.js',
            './build/equation_editor.css',
            './build/equation_editor.html',
            './build/mathquill.css',
    ])
    .pipe(zip('tinymce_equation_editor.zip'))
    .pipe(gulp.dest('./build/'))
})

gulp.task('build', ['build:equation_editor', 'build:plugin', 'build:zip']);
