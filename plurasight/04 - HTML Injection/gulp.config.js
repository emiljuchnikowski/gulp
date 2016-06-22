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

        bower: {
            json: require('./bower.json'),
            directory: './bower_components/',
            ignorePath: '../..'
        }
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