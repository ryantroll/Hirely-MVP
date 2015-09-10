module.exports = function() {
    var client = './www/';
    var cssFolder = './www/css/';
    var clientApp = client + 'app/';
    var temp = clientApp + 'core';
    var config = {
        /**
         * Files paths
         */
        alljs: [
            './www/**/*.js',
            './*.js'
        ],
        bower: {
            json: require('./bower.json'),
            directory: './lib/',
            ignorePath: '../..'
        },
        build: './dist/',
        client: client,
        cssFolder: cssFolder,
        fonts: './lib//font-awesome/fonts/**/*.*',
        htmltemplates: clientApp + '**/*.html',

        images: client + 'img/**/*.*',
        index: client + 'index.html',
        js: [
            client + 'js/**/*.js',
            clientApp + '**/*.module.js',
            clientApp + '**/*.js'
        ],
        less: client + 'css/style.less',
        templates: clientApp + '**/*.html',
        temp: temp,
        /**
         * template cache
         */
        templateCache: {
            file: 'templates.js',
            options: {
                module: 'hirelyApp',
                standAlone: false,
                root: 'app/'
            }
        },

    };


    config.getWiredepDefaultOptions = function() {
        var options = {
            bowerJson: config.bower.json,
            directory: config.bower.directory,
            ignorePath: config.bower.ignorePath,
            devDependencies: true,
            dependencies: true
        };
        return options;
    };
    return config;
};