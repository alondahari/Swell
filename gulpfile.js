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
  , connect = require('gulp-connect')
  , watch = require('gulp-watch')
  , prefix = require('gulp-autoprefixer')
  , del = require('del')
  , nodemon = require('gulp-nodemon')


/* define some sugar syntax */
var log = gutil.log
  , noop = gutil.noop

var source, dist, paths = {}

gulp.task('setPath', function () {

  source = prod ? 'www/' : 'app/'
  dist   = 'www/'
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
      html: [minifyHtml({empty: true})],
      js: [uglify()]
    }))
    .pipe(gulp.dest(dist))
})

gulp.task('copyProd', function(){
  var sources = [paths.require, paths.fonts]
  if (native) sources.push('native/index.html')
  return gulp.src(sources)
    .pipe(gulp.dest(dist))
})

gulp.task('images', function(){
  return gulp.src(paths.images, {base: source})
    .pipe(gulp.dest(dist))
})

gulp.task('watch', function() {
  gulp.watch(paths.scss, ['sass'])
})

gulp.task('nodemon', function () {
  nodemon({ script: prod ? 'app.js' : 'app-dev.js',
      env: {'NODE_ENV': 'development'},
      ignore: [source + '**']
    })
    .on('restart', function () {
      console.log('restart!')
    })
})


gulp.task('build', function(){
  runSequence('setPath', 'clean', 'usemin', 'copyProd', 'images')
})

gulp.task('livereload', function() {
  gulp.src([paths.css, paths.js])
    .pipe(watch([paths.css, paths.js, paths.jade, paths.index]))
    .pipe(connect.reload())
})

gulp.task('serve', function() {
  connect.server({
    livereload: true
  })
})


gulp.task('default', ['setPath', 'nodemon', 'sass','livereload', 'serve', 'watch'],function(){

})