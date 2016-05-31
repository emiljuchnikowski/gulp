gulp.task('lint-watcher', function () {
    gulp.watch('./src/**/*.less', function (event) {
        console.log('watcher event ' + event.type + ' for ' + event.path);
    });
});