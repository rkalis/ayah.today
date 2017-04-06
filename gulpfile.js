var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var header = require('gulp-header');
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');
var browserify = require('gulp-browserify');
var pkg = require('./package.json');

/* Code banner */
var banner = ['/*!\n',
    ' * <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)\n',
    ' * Copyright 2017-' + (new Date()).getFullYear(), ' <%= pkg.author %>\n',
    ' * Licensed under <%= pkg.license.type %> (<%= pkg.license.url %>)\n',
    ' */\n',
    ''
].join('');

/* Watches src/scss, compiles it, minifies it, and pipes it to build/css */
gulp.task('build-css', function() {
    return gulp.src('src/scss/main.scss')
        .pipe(sass())
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(header(banner, { pkg: pkg }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('www/css'))
        .pipe(browserSync.reload({
            stream: true
        }))
});


/* Watches src/js, browserifies it, minifies it, and pipes it to build/js */
gulp.task('build-js', function() {
    gulp.src('src/js/main.js')
        .pipe(browserify({
          insertGlobals : true,
          debug : !gulp.env.production
        }))
        .pipe(uglify())
        .pipe(header(banner, { pkg: pkg }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('www/js'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

/* Pipes html to build */
gulp.task('build-html', function() {
    return gulp.src('src/*.html')
        .pipe(gulp.dest('www'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

/* Build everything */
gulp.task('default', ['build-html', 'build-css', 'build-js']);

/* BrowserSync */
gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: 'www'
        },
    })
})

/* Gulp dev - reload with BrowserSync */
gulp.task('dev', ['browserSync', 'build-html', 'build-css', 'build-js'], function() {
    gulp.watch('src/*.html', ['build-html']);
    gulp.watch('src/scss/*.scss', ['build-css']);
    gulp.watch('src/js/*.js', ['build-js']);

    /* Reloads the browser when js or html changes */
    gulp.watch('www/*.html', browserSync.reload);
    gulp.watch('www/js/**/*.js', browserSync.reload);
});
