/* define cli flags */
var argv = require('yargs').argv
  , native = !!(argv.native)
  , prod = !!(argv.prod)

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
  , watch = require('gulp-watch')
  , prefix = require('gulp-autoprefixer')
  , del = require('del')
  , nodemon = require('gulp-nodemon')
  , livereload = require('gulp-livereload')


/* define some sugar syntax */
var log = gutil.log
  , noop = gutil.noop

var source, dist, paths = {}

gulp.task('setPath', function () {

  source = prod ? 'awww/' : 'native/'
  dist   = 'awww/'
  paths = {
    index : source + 'index.html',
    css   : source + 'css/**/*.css',
    fonts : source + 'fonts/**',
    js    : source + 'js/**',
    require: source + 'js/require.js',
    cordova: source + 'js/cordova.js',
    images: source + 'img/**',
    scss: source + 'scss/*.scss',
    jade: source + 'js/templates/*.jade'
  }
})

gulp.task('clean', function (cb) {  
  del([
    '!'+dist+'.gitkeep',
    dist + '**/*'
  ], cb)
})

gulp.task('sass', function () {
    gulp.src(paths.scss)
      // .pipe(sourcemaps.init())
      .pipe(sass())
      // .pipe(sourcemaps.write())
      .pipe(prefix())
      .pipe(gulp.dest(source + '/css'))
})

gulp.task('usemin', function(){
  return gulp.src(paths.index)
    .pipe(usemin({
      css: [minifyCss(), rev()],
      html: [minifyHtml({empty: true})]
    }))
    .pipe(gulp.dest(dist))
})

gulp.task('copyProd', function(){
  if (native) {
    gulp.src('native/index.html')
      .pipe(gulp.dest(dist))
  }
  var sources = [paths.require, paths.fonts]
  return gulp.src(sources, {base: source})
    .pipe(gulp.dest(dist))
})

gulp.task('images', function(){
  return gulp.src(paths.images, {base: source})
    .pipe(gulp.dest(dist))
})

gulp.task('watch', function() {

  livereload.listen()

  gulp.watch([paths.js, paths.css, paths.index, paths.jade])
    .on('change', livereload.changed)
  gulp.watch(paths.scss, ['sass'])

})

gulp.task('nodemon', function () {
  nodemon({ script: 'app.js',
      ignore: [source + '**']
    })
    .on('restart', function () {
      console.log('restart!')
    })
})


gulp.task('build', function(){
  runSequence('setPath', 'clean', 'usemin', 'copyProd', 'images')
})


gulp.task('default', ['setPath', 'nodemon', 'sass', 'watch'],function(){

})