// const gulp = require('gulp'),
//     autoprefixer = require('gulp-autoprefixer'),
//     imagemin = require('gulp-imagemin'),
//     sourcemaps = require('gulp-sourcemaps'),
//     browserSync = require('browser-sync').create(),
//     clean = require('gulp-clean'),
//     ghPages = require('gulp-gh-pages');

const {src, dest, series, watch} = require('gulp')
const sass = require('gulp-sass');
const csso = require('gulp-csso');
const include = require('gulp-file-include');
const htmlmin = require('gulp-htmlmin');
const imagemin = require('gulp-imagemin');
const del = require('del');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const sync = require('browser-sync').create();


function html() {
    return src('src/**.html')
        .pipe(include({
            prefix: '@@'
        }))
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true
        }))
        .pipe(dest('build'))
}

function scss() {
    return src('src/sass/**.sass')
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
        }))
        .pipe(csso())
        .pipe(concat('style.css'))
        .pipe(dest('build'))
}

function img ()  {
    return src('src/img/*')
        .pipe(imagemin())
        .pipe(dest('build/img'))
}

function clear() {
    return del('build')
}

function serve() {
    sync.init({
        server: './build'
    })

    watch('src/**.html', series(html)).on('change', sync.reload)
    watch('src/sass/**.sass', series(scss)).on('change', sync.reload)
}

exports.build = series(clear, scss, html, img)
exports.serve = series(clear, scss, html, img, serve)
exports.clear = clear


// gulp.task('deploy', function() {
//     return gulp.src('./build/**/*')
//         .pipe(ghPages());
// });
