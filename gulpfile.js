/* define cli flags */
var argv = require('yargs').argv
  , production = !!(argv.production)

/* load all plugins*/
var gulp = require('gulp')
  , gutil = require('gulp-util')
  , usemin = require('gulp-usemin')
  , uglify = require('gulp-uglify')
  , minifyCss = require('gulp-minify-css')
  , minifyHtml = require('gulp-minify-html')
  , rev = require('gulp-rev')
  , sass = require('gulp-sass')
  , sourcemaps = require('gulp-sourcemaps')
  , runSequence = require('run-sequence')
  , connect = require('gulp-connect')
  , watch = require('gulp-watch')
  , prefix = require('gulp-autoprefixer')
  , del = require('del')
  , nodemon = require('gulp-nodemon')


/* define some sugar syntax */
var log = gutil.log
  , noop = gutil.noop

var source = 'app/'
  , dist   = 'www/'
  , paths = {
    index : source + 'index.html',
    css   : source + 'css/**/*.css',
    fonts : source + 'fonts/**',
    js    : source + 'js/**',
    require: source + 'js/require.js',
    cordova: source + 'js/cordova.js',
    images: source + 'img/**'
  }

gulp.task('clean', function (cb) {  
  del([
    '!'+dist+'.gitkeep',
    dist + '**/*'
  ], cb)
})

gulp.task('sass', function () {
    gulp.src('./app/scss/*.scss')
      // .pipe(sourcemaps.init())
      .pipe(sass())
      // .pipe(sourcemaps.write())
      .pipe(prefix())
      .pipe(gulp.dest('./app/css'))
})

gulp.task('usemin', function(){
  return gulp.src(paths.index)
    .pipe(usemin({
      css: [minifyCss(), rev()],
      html: [minifyHtml({empty: true})],
      js: [uglify()]
    }))
    .pipe(gulp.dest(dist))
})

gulp.task('useapp', function(){
  return gulp.src([
      paths.index, 
      paths.css, 
      paths.fonts,
      paths.js], {base: source})
    .pipe(gulp.dest(dist))
})

gulp.task('copyProd', function(){
  return gulp.src([paths.require, paths.fonts], {base: source})
    .pipe(gulp.dest(dist))
})

gulp.task('images', function(){
  return gulp.src(paths.images, {base: source})
    .pipe(gulp.dest(dist))
})

gulp.task('watch', function() {
  gulp.watch('app/scss/*.scss', ['sass'])
})

gulp.task('nodemon', function () {
  nodemon({ script: 'app.js'})
    .on('restart', function () {
      console.log('restart!')
    })
})


gulp.task('build', function(){
    log('building for ' + (production ? 'production' : 'development'))
    if (production)
      runSequence('clean', 'usemin', 'copyProd', 'images')
    else
      runSequence('clean', 'useapp', 'images')
})

gulp.task('livereload', function() {
  gulp.src(['app/css/*.css', 'app/js/*.js'])
    .pipe(watch(['app/**/*.css', 'app/**/*.js', 'app/**/*.jade', 'app/index.html']))
    .pipe(connect.reload())
})

gulp.task('serve', function() {
  connect.server({
    livereload: true
  })
})

gulp.task('default', ['nodemon', 'sass', 'livereload', 'serve', 'watch'],function(){
  log('available tasks:')
  log('  gulp serve (serve content locally for development)')
  log('  gulp build (build for developement)')
  log('  gulp build --production (build for production)')
})