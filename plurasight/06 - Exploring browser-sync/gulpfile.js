var gulp = require('gulp');
var args = require('yargs').argv;
var browserSync = require('browser-sync');
var config = require('./gulp.config')();

var $ = require('gulp-load-plugins')({ lazy: true });
var port = process.env.PORT || config.defaultPort;

// var jshint = require('gulp-jshint');
// var jscs = require('gulp-jscs');
// var util = require('gulp-util');
// var gulpprint = require('gulp-print');
// var gulpif = require('gulp-if');

gulp.task('help', $.taskListing);

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

gulp.task('fonts', [ 'clean-fonts' ], function () {
    return gulp
        .src(config.images)
        .pipe($.imagemin({optimalizationLevel: 4}))
        .pipe(gulp.dest(config.build + 'images'));
});

gulp.task('clean-fonts', function (done) {
   var files = config.build + 'images';
   clean(files, done);
});

gulp.task('images', [ 'clean-images' ], function () {
    return gulp
        .src(config.fonts)
        .pipe(gulp.dest(config.build + 'fonts'));
});

gulp.task('clean-images', function (done) {
   var files = config.build + 'fonts';
   clean(files, done);
});

gulp.task('clean-styles', function (done) {
   var files = config.tmp + '**/*.css';
   clean(files, done);
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

gulp.task('serve-dev', ['inject'], function () {
    var isDev = true;
    
    var nodeOptions = {
        script: config.nodeServer,
        delayTime: 1,
        env: {
            'PORT': port,
            'NOE_ENV': isDev ? 'dev' : 'buid'
        },
        watch: [ config.server ]
    };

    return  $.nodemon(nodeOptions)
        .on('restart', ['vet'], function() {
            setTimeout(function() {
                browserSync.notify('reloading now ...');
                browserSync.reload({ stream: false });
            }, config.browserReloadDelay);
        })
        .on('start', function() {
            startBrowserSync();
        })
        .on('crash', function() {})
        .on('exit', function() {});
});

function changeEvent(event) {
    var srcPattern = new RegExp('/.*(?=/' + config.source + ')/');
    log('File ' + event.path.replace(srcPatter, '') + ' ' + event.type); 
}

function startBrowserSync() {
    if(args.nosync || browserSync.active) {
        return;
    }

    gulp.watch([config.less], ['styles'])
        .on('change', function (event){
            changeEvent(event);
        });

    var options = {
        proxy: "localhost:" + port,
        port: 3000,
        files: [ 
            confilg.client + '**/*.*',
            '!' + config.less,
            config.tempo + '**/*.css' 
        ],
        ghostMode: {
            clicks: true,
            location: false,
            forms: true,
            scroll: true
        },
        injectChanges: true,
        logFilesChanges: true,
        logLevel: 'debug',
        logPrefix: 'gulp-patterns',
        notify: true,
        reloadDelay: 1000
    };

    browserSync(options);
}

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