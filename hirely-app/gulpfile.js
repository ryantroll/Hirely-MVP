var gulp = require('gulp');
var gutil = require('gulp-util');
var inject = require('gulp-inject');
var useref = require('gulp-useref');
var config = require('./gulp.config')();
var del = require('del');
var watch = require('gulp-watch');
var $ = require('gulp-load-plugins')({lazy: true});
var port = process.env.PORT || config.defaultPort;
var args = require('yargs').argv;
var browserSync = require('browser-sync');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');

var livereload = require('gulp-livereload');
var lr = require('tiny-lr');
var server = lr();


// Sass task:
// source: hirely.scss inside css folder
// output: single css file on 'hirely.out.css'
// other properties: sourcemaps, autoprefixer, rename
gulp.task('sass', function() {
    gulp.src(['./client/www/css/hirely.scss'])
      .pipe($.plumber())
      .pipe(sourcemaps.init())
      .pipe(sass(sass().on('error', sass.logError)))
      .pipe(autoprefixer({
          browsers: ['last 10 versions'],
          cascade: false
      }))
      //.pipe(minifyCss())
      .pipe(sourcemaps.write())
      //.pipe(rename('hirely.min.css'))
      .pipe(rename('hirely.out.css'))
      .pipe(gulp.dest('client/www/dist/css'))
      .pipe(livereload(server));
});

gulp.task('js', function() {
    gulp.src('client/www/app/**/*.js')
      .pipe( concat('app.js'))
      .pipe( gulp.dest('client/www/dist/js'))
      .pipe( livereload( server ));
});

gulp.task('watch', function() {

    //server.listen(35729, function (err) {
    //    if (err) {
    //        return console.log(err);
    //    }
    //    gulp.watch(['client/www/app/**/*.js'], ['js']);
    //    gulp.watch(config.sass, ['sass']);
    //    });

    gulp.watch(['client/www/app/**/*.js'], ['js']);
    gulp.watch(config.sass, ['sass']);
});


gulp.task('default', ['js', 'sass', 'watch']);



gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});


gulp.task('clean-styles', function(done) {
    var files = config.cssFolder  + 'style.css';
    clean(files, done);
});

gulp.task('fonts', ['clean-fonts'], function() {
    log('Copying fonts');

    return gulp
        .src(config.fonts)
        .pipe(gulp.dest(config.build + 'fonts'));
});

gulp.task('images', ['clean-images'], function() {
    log('Copying and compressing the images');

    return gulp
        .src(config.images)
        .pipe($.imagemin({optimizationLevel: 4}))
        .pipe(gulp.dest(config.build + 'img'));
});


gulp.task('clean-fonts', function(done) {
    clean(config.build + 'fonts/**/*.*', done);
});

gulp.task('clean-images', function(done) {
    clean(config.build + 'img/**/*.*', done);
});

gulp.task('clean-styles', function(done) {
    clean(config.temp + '**/*.css', done);
})


gulp.task('clean-code', function(done) {
    var files = [].concat(
        config.temp + '**/*.js',
        config.build + '**/*.html',
        config.build + 'js/**/*.js'
    );
    clean(files, done);
});

gulp.task('template-cache', [], function() {
    log('Creating AngularJS $templateCache');

    return gulp
        .src(config.htmltemplates)
        .pipe($.minifyHtml({empty: true}))
        .pipe($.angularTemplatecache(
            config.templateCache.file,
            config.templateCache.options
        ))
        .pipe(gulp.dest(config.temp));
});


gulp.task('templates-watcher', function() {
    gulp.watch(config.templates, ['template-cache']);
});

gulp.task('wiredep', function() {
    log('Wire up the bower css js and our app js into the html');
    var options = config.getWiredepDefaultOptions();
    var wiredep = require('wiredep').stream;

    return gulp
        .src(config.index)
        .pipe(wiredep(options))
        .pipe(inject(gulp.src(config.js, {read: false}), {relative: true}))
        .pipe(gulp.dest('./client/www'));
});

gulp.task('inject', ['wiredep', 'styles', 'fonts', 'images'], function() {
    log('Wire up the app css into the html, and call wiredep ');

    return gulp
        .src(config.index)
        .pipe(inject(gulp.src(config.cssFolder, {read: false}), {relative: true}))
        .pipe(gulp.dest('./client/www'));
});

gulp.task('optimize', ['inject','images', 'fonts', 'template-cache'], function() {
    log('Optimizing the javascript, css, html');

    var assets = useref.assets();
    var templateCache = config.temp + config.templateCache.file;

    return gulp
        .src(config.index)
        .pipe($.plumber())
        .pipe($.inject(gulp.src(templateCache, {read: false}), {
            relative: true,
            starttag: '<!-- inject:templates:js -->'
        }))
        .pipe(assets)
        .pipe(assets.restore())
            .pipe(useref())
            .pipe(gulp.dest(config.build));
});
gulp.task('serve-build', ['optimize'], function() {
    serve(false /* isDev */);
});

gulp.task('serve-dev', ['inject'], function() {
    serve(true /* isDev */);
});

////////////

function serve(isDev) {
    var nodeOptions = {
        script: config.nodeServer,
        delayTime: 1,
        env: {
            'PORT': port,
            'NODE_ENV': isDev ? 'dev' : 'build'
        },
        watch: [config.server]
    };

    return $.nodemon(nodeOptions)
        .on('restart', function(ev) {
            log('*** nodemon restarted');
            log('files changed on restart:\n' + ev);
            setTimeout(function() {
                browserSync.notify('reloading now ...');
                browserSync.reload({stream: false});
            }, config.browserReloadDelay);
        })
        .on('start', function() {
            log('*** nodemon started');
            startBrowserSync(isDev);
        })
        .on('crash', function() {
            log('*** nodemon crashed: script crashed for some reason');
        })
        .on('exit', function() {
            log('*** nodemon exited cleanly');
        });
}

function changeEvent(event) {
    var srcPattern = new RegExp('/.*(?=/' + config.source + ')/');
    log('File ' + event.path.replace(srcPattern, '') + ' ' + event.type);
}

function startBrowserSync() {
    if (args.nosync || browserSync.active) {
        return;
    }

    log('Starting browser-sync on port ' + port);

    gulp.watch([config.less], ['styles'])
        .on('change', function(event) { changeEvent(event); });

    var options = {
        proxy: 'localhost:' + port,
        port: 3000,
        files: [
            config.client + '**/*.*',
            '!' + config.less,
            config.temp + '**/*.css'
        ],
        ghostMode: {
            clicks: true,
            location: false,
            forms: true,
            scroll: true
        },
        injectChanges: true,
        logFileChanges: true,
        logLevel: 'debug',
        logPrefix: 'gulp-patterns',
        notify: true,
        reloadDelay: 0 //1000
    };

    browserSync(options);
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