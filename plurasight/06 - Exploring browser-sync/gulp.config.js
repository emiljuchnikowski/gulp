module.exports = function() {

    var config = {
        temp: './.tmp',
        alljs: [
            './*.js'
        ],
        
        less: [ './styles/styles.less' ],
        index: 'index.html',
        css: 'styles.css',
        js: [
            '**/*.module.js',
            '!**/*.spec.js' // exclude
        ],
        client: '',
        server: './src',
        build: './build/',
        fonts: '.bower_components/fonts',
        images: 'images/**/*.*',
        bower: {
            json: require('./bower.json'),
            directory: './bower_components/',
            ignorePath: '../..'
        },
        browserReloadDelay: 1000,
        defaultPOrt: 7203,
        nodeServer: './src/app.js'
    };

    config.getWiredepDefaultOptions = function () {
        var options = {
            bowerJson: config.bower.json,
            directory: config.bower.directory,
            ignorePath: config.bower.ignorePath
        };

        return options;
    }
    
    return config;
}