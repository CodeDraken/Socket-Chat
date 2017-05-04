const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const browserSync = require('browser-sync');
const del = require('del');
const runSequence = require('run-sequence');

const $ = gulpLoadPlugins();
// const refresh = $.refresh;

gulp.task('styles', () => {
  return gulp.src('src/styles/*.scss')
    .pipe($.plumber())
    .pipe($.sass.sync({
      outputStyle: 'expanded',
      precision: 10,
      includePaths: ['.']
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer({browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']}))
    .pipe(gulp.dest('.tmp/styles'));
    // .pipe(refresh());
});

gulp.task('scripts', () => {
  return gulp.src('src/scripts/**/*.js')
    .pipe($.plumber())
    .pipe($.babel({presets: ['es2015']}))
    .pipe(gulp.dest('.tmp/scripts'));
    // .pipe(refresh());
});

gulp.task('html', ['styles', 'scripts', 'mustache'], () => {
  return gulp.src('.tmp/*.html')
    .pipe($.useref({searchPath: ['.tmp', 'src', '.']}))
    .pipe($.if(/\.js$/, $.uglify()))
    .pipe($.if(/\.css$/, $.cssnano({safe: true, autoprefixer: false})))
    .pipe($.if(/\.html$/, $.htmlmin({
      collapseWhitespace: true,
      minifyCSS: true,
      minifyJS: true,
      processConditionalComments: true,
      removeComments: true,
      removeEmptyAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true
    })))
    .pipe(gulp.dest('public'));
});

gulp.task('images', () => {
  return gulp.src('src/images/**/*')
    .pipe($.imagemin())
    .pipe(gulp.dest('public/images'));
});

gulp.task('clean', del.bind(null, ['.tmp', 'public']));

gulp.task('browser-sync', () => {
  browserSync.init({
    proxy: 'localhost:3000',
    files: ['.tmp/**/*.*'],
    browser: 'google chrome'
  });
});

gulp.task('mustache', () => {
  gulp.src('src/mustache/**/*.mustache')
    .pipe($.plumber())
    .pipe($.mustache('src/mustache/data.json', {extension: '.html'}, {
      // partials
    }))
    .pipe(gulp.dest('.tmp'));
});

gulp.task('serve', () => {
  runSequence(['clean'], ['mustache','styles', 'scripts'], ['browser-sync'], () => {
    // refresh.listen();

    gulp.watch([
      'src/images/**/*'
    ]).on('change', browserSync.reload);

    gulp.watch('src/mustache/**/*.mustache', ['mustache']);
    gulp.watch('src/styles/**/*.scss', ['styles']);
    gulp.watch('src/scripts/**/*.js', ['scripts']);
  });
});

gulp.task('serve:public', ['default'], () => {
  // refresh.listen();
});

gulp.task('build', ['html', 'images'], () => {
  return gulp.src('public/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('default', function() {
  return new Promise(resolve => {
    runSequence(['clean'], 'build', resolve);
  });
});
