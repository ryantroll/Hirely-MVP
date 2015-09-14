var gulp = require('gulp');
var gutil = require('gulp-util');
var inject = require('gulp-inject');
var useref = require('gulp-useref');
var config = require('./gulp.config')();
var del = require('del');
var watch = require('gulp-watch');
var $ = require('gulp-load-plugins')({lazy: true});

var paths = {
  sass: ['./client/scss/**/*.scss']
};


gulp.task('default', ['sass']);

gulp.task('sass', function(done) {
  gulp.src('./client/scss/ionic.app.scss')
    .pipe(sass({
      errLogToConsole: true
    }))
    .pipe(gulp.dest('./client/www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./client/www/css/'))
    .on('end', done);
});


gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
});

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

gulp.task('styles', function() {
    log('Compiling Less --> CSS');

    return gulp
        .src(config.less)
        .pipe($.plumber())
        .pipe($.less())
        .pipe($.autoprefixer({browsers: ['last 2 version', '> 5%']}))
        .pipe(gulp.dest(config.cssFolder));
});

gulp.task('clean-styles', function(done) {
    var files = config.cssFolder  + 'style.css';
    clean(files, done);
});

gulp.task('less-watcher', function() {
    watch([config.less], ['styles']);
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

gulp.task('default', ['templates-watcher']);

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

gulp.task('optimize', ['inject','images', 'fonts'], function() {
    log('Optimizing the javascript, css, html');

    var assets = useref.assets();

    return gulp
        .src(config.index)
        .pipe($.plumber())
        .pipe(assets)
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(gulp.dest(config.build));
});

gulp.task('serve-build', ['optimize'], function() {
    serve(false /* isDev */);
});

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