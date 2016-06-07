var gulp = require('gulp');
var args = require('yargs').argv;
var config = require('./gulp.config')();

var $ = require('gulp-load-plugins')({ lazy: true });

// var jshint = require('gulp-jshint');
// var jscs = require('gulp-jscs');
// var util = require('gulp-util');
// var gulpprint = require('gulp-print');
// var gulpif = require('gulp-if');

gulp.task('vet', function () {
    log("Test log.");
    
    return gulp
        .src(config.alljs)
        .pipe($.gulpif(args.verbose, $.gulpprint()))
        .pipe($.jscs())
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish', {verbose: true}))
        .pipe($.jshint.reporter('fail'));
});

gulp.task('styles', [ 'clean-styles' ], function () {
    log('less');
    
    return gulp
        .src(config.less)
        .pipe($.plumber())
        .pipe($.less())
        //.on('error', errorLogger)
        .pipe($.autoprefixer({ browsers: [ 'last 2 version', '> 5%' ] }))
        .pipe(gulp.dest(config.temp));
});

gulp.task('clean-styles', function (done) {
   var files = config.tmp + '**/*.css';
   clean(files, done);
});

gulp.task('less-watch', function () {
    gulp.watch([config.less], ['styles']);
});

gulp.task('wiredep', function () {
    var options = config.getWiredepDefaultOptions();
    var wiredep = require('wiredep').stream;

    return gulp
        .src(config.index)
        .pipe(wiredep(options))
        .pipe($.inject(gulp.src(config.js)))
        .pipe(gulp.dest(config.licent));
});

gulp.task('inject', ['wiredep', 'styles'], function () {
    var options = config.getWiredepDefaultOptions();
    var wiredep = require('wiredep').stream;

    return gulp
        .src(config.index)
        .pipe($.inject(gulp.src(config.css)))
        .pipe(gulp.dest(config.licent));
});

function errorLogger(error) {
    log('*** Start of Error ***');
    log(error);
    log('*** End of Error ***');
    this.emit('end');
}   

function clean(path, done) {
    log('Cleaning: ' + $.util.colors.blue(path));
    del(path, done);
}

function log(msg) {
    if (typeof(msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                $.util.log($.util.colors.blue(msg[item]));
            }
        }
    } else {
        $.util.log($.util.colors.blue(msg));
    }
}