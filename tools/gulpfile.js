/*
 * Gulp4通用配置
 * Author: Kinice
 * Time: 2018-12-26
 */
const gulp = require('gulp')
const path = require('path')
const less = require('gulp-less')
const browserSync = require('browser-sync').create()
const reload = browserSync.reload
const cleancss = require('gulp-cssnano')
const autoprefixer = require('gulp-autoprefixer')
const pump = require('pump')
const uglify = require('gulp-uglify')
const sourcemaps = require('gulp-sourcemaps')
const babel = require('gulp-babel')
const nodemon = require('gulp-nodemon')
const changed = require('gulp-changed')
const config = require('./config')
const port = process.env.PORT || config.port

// 将所需的资源path放到一起便于管理
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

// 处理less的task
function style(callback) {
  // pump提供了中断pipe的callback
  return pump([
    gulp.src(path.join(__dirname, paths.style.src)),
    // 开启sourcemap以方便调试
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

// 处理js的task
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

// 监测文件修改并调用相应task之后刷新页面
function watch() {
  gulp.watch(path.join(__dirname, paths.style.src), style)
  gulp.watch(path.join(__dirname, paths.script.src), script)

  gulp.watch(path.join(__dirname, `${paths.style.dest}*.css`)).on('change', reload)
  gulp.watch(path.join(__dirname, `${paths.script.dest}*.js`)).on('change', reload)
  gulp.watch(path.join(__dirname, `${paths.view.dest}*.njk`)).on('change', reload)
}

// 使用nodemon启动node server，如果不含node就去掉
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

// 顺序执行script和style
let build = gulp.series(script, style)

// 先build，再同步启动node server和开启文件监测
gulp.task('default', gulp.series(build, gulp.parallel(server, watch)))
