const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const browserSync = require('browser-sync').create();
const del = require('del');
const runSequence = require('run-sequence');

const $ = gulpLoadPlugins();
// const refresh = $.refresh;

gulp.task('styles', () => {
  return gulp.src('public/styles/*.scss')
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
  return gulp.src('public/scripts/**/*.js')
    .pipe($.plumber())
    .pipe($.babel({presets: ['es2015']}))
    .pipe(gulp.dest('.tmp/scripts'));
    // .pipe(refresh());
});

gulp.task('html', ['styles', 'scripts'], () => {
  return gulp.src('public/*.html')
    .pipe($.useref({searchPath: ['.tmp', 'public', '.']}))
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
    .pipe(gulp.dest('dist'));
});

gulp.task('images', () => {
  return gulp.src('public/images/**/*')
    .pipe($.imagemin())
    .pipe(gulp.dest('dist/images'));
});

gulp.task('clean', del.bind(null, ['.tmp', 'dist']));

gulp.task('serve', () => {
  runSequence(['clean'], ['styles', 'scripts'], () => {
    // refresh.listen();

    gulp.watch([
      'public/*.html',
      'public/images/**/*'
      ]); //.on('change', refresh);

    gulp.watch('public/styles/**/*.scss', ['styles']);
    gulp.watch('public/scripts/**/*.js', ['scripts']);
  });
});

gulp.task('serve:dist', ['default'], () => {
  refresh.listen();
});

gulp.task('build', ['html', 'images'], () => {
  return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}))
});

gulp.task('default', function() {
  return new Promise(resolve => {
    runSequence(['clean'], 'build', resolve);
  });
});
