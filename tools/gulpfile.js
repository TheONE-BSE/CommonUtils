/*
 * Gulp4通用配置
 * Author: Kinice
 * Time: 2018-12-26
 */
const gulp = require('gulp')
const path = require('path')
const less = require('gulp-less')
const browserSync = require('browser-sync').create()
const cleancss = require('gulp-cssnano')
const reload = browserSync.reload
const autoprefixer = require('gulp-autoprefixer')
const pump = require('pump')
const uglify = require('gulp-uglify')
const sourcemaps = require('gulp-sourcemaps')
const babel = require('gulp-babel')
const nodemon = require('gulp-nodemon')
const changed = require('gulp-changed')
const config = require('./config')
const port = process.env.PORT || config.port

const paths = {
  style: {
    src: 'src/less/**/*.less',
    dest: 'public/css/'
  },
  script: {
    src: 'src/js/**/*.js',
    dest: 'public/js/'
  },
  view: {
    src: 'views/**/*.njk',
    dest: 'views/'
  }
}

function style(callback) {
  return pump([
    gulp.src(path.join(__dirname, paths.style.src)),
    sourcemaps.init(),
    less(),
    autoprefixer({
      browsers: [
        '>1%',
        'last 10 version',
        'iOS >= 8'
      ]
    }),
    cleancss(),
    sourcemaps.write('maps'),
    gulp.dest(path.join(__dirname, paths.style.dest)),
    reload({
      stream: true
    })
  ], callback)
}

function script(callback) {
  return pump([
    gulp.src(path.join(__dirname, paths.script.src)),
    sourcemaps.init(),
    babel(),
    uglify(),
    sourcemaps.write('maps'),
    gulp.dest(path.join(__dirname, paths.script.dest))
  ], callback)
}

function watch() {
  gulp.watch(path.join(__dirname, paths.style.src), style)
  gulp.watch(path.join(__dirname, paths.script.src), script)

  gulp.watch(path.join(__dirname, `${paths.style.dest}*.css`)).on('change', reload)
  gulp.watch(path.join(__dirname, `${paths.script.dest}*.js`)).on('change', reload)
  gulp.watch(path.join(__dirname, `${paths.view.dest}*.njk`)).on('change', reload)
}

function server() {
  nodemon({
    script: 'app.js'
  })
  browserSync.init({
    proxy: `http://localhost:${port}`
  })
}

exports.style = style
exports.script = script
exports.watch = watch

let build = gulp.series(script, style)

gulp.task('default', gulp.series(build, gulp.parallel(server, watch)))

