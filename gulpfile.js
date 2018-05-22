"use strict";

let gulp = require("gulp"); //gulp
let htmlmin = require("gulp-htmlmin"); //html压缩
let less = require("gulp-less"); //less
let cssmin = require("gulp-cssmin"); //css压缩
let jsmin = require("gulp-jsmin"); //js压缩
let babel = require("gulp-babel"); //bable
let rename = require("gulp-rename"); //重命名
let plumber = require("gulp-plumber"); //错误处理
let watch = require("gulp-watch"); //监听
let gulpSequence = require("gulp-sequence"); //同步执行gulp任务
let imagemin = require("gulp-imagemin"); //压缩图片
let clean = require('gulp-clean'); //清理
let browserSync = require("browser-sync"); //多浏览器同步刷新
let reload = browserSync.reload; //重新加载
let autoprefixer = require("gulp-autoprefixer"); //样式前缀补齐
let sourcemaps = require("gulp-sourcemaps"); //sourcemaps定位
let fileinclude  = require('gulp-file-include');
let modifyCssUrls=require('gulp-modify-css-urls');
// let spriter=require('gulp-css-spriter');

//处理html
gulp.task("html", function () {
    // return gulp.src("./src/html/*/*.html")
    // .pipe(htmlmin({collapseWhitespace: true}))
    gulp.src(['./src/html/**/*.html', '!./src/html/include/**.html'])
        .pipe(fileinclude({
            prefix: '@',
            basepath: '@file'
        }))
        .pipe(gulp.dest("./dist/html/"));
})

//处理css
gulp.task("less", function () {
    return gulp.src(["./src/less/*.less", "!./src/common/*.less"])
        .pipe(sourcemaps.init())
        .pipe(less())
        // .pipe(cssmin())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        // .pipe(sourcemaps.write())
        .pipe(modifyCssUrls({
            modify: (url, filePath) => {
                if (url.indexOf("../../" != -1)) {
                    return url.slice(3);
                }
            }
        }))
        // .pipe(spriter({
        //     "spriteSheet": "dist/images/spritesheet.png",
        //     'pathToSpriteSheetFromCSS': '../images/spritesheet.png'

        // }))
        .pipe(gulp.dest("./dist/css"))
        .pipe(reload({
            stream: true
        }));
})

//处理js
gulp.task("script", function () {
    return gulp.src("./src/js/*.js")
        .pipe(plumber())
        // .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ["es2015"],
            compact: false
        }))
        .pipe(rename({
            extname: ".js"
        }))
        .pipe(jsmin())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("./dist/js"));
})

//压缩images
gulp.task('imagemin', function () {
    return gulp.src('src/images/*')
        .pipe(imagemin())
        .pipe(gulp.dest('./dist/images'));
});

//监听watch
gulp.task("serve", function () {

    var files = [
        './dist/html/**/*.html',
        './dist/css/*.css',
        './dist/js/*.js',
        './dist/images'
    ];
    browserSync.init(files, {
        // open: false,
        server: "./dist"
    });
    gulp.watch('src/html/**/*.html', ['html'], reload);
    gulp.watch(['src/less/*.less', "./src/less/common/*.less"], ['less'], reload);
    gulp.watch('src/js/*.js', ['script'], reload);
    gulp.watch('src/images/*', ['imagemin'], reload);
})

//清理clean
gulp.task("clean", function () {
    return gulp.src('./dist', {
            read: false
        })
        .pipe(clean());
})

//启动任务
gulp.task("default", gulpSequence(
    ["clean"], ['html', 'less', 'script', 'imagemin'],
    "serve"
))