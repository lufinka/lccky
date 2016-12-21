var gulp = require('gulp'); // 基础库
var uglify = require('gulp-uglify'); // js压缩
var imagemin = require('gulp-imagemin'); // 图片压缩
var pngquant = require('imagemin-pngquant'); // 深度压缩
var rename = require('gulp-rename'); //文件更名
var minifyCss = require('gulp-minify-css'); // CSS压缩
var autoprefixer = require('gulp-autoprefixer'); // 自动添加CSS3浏览器前缀
var minifyHTML = require('gulp-htmlmin'); //压缩html
// 引入gulp插件
var webserver = require('gulp-webserver'); // 本地服务器
var concat = require('gulp-concat'); //- 多个文件合并为一个；
var rev = require('gulp-rev'); //- 对文件名加MD5后缀
var revCollector = require('gulp-rev-collector'); //- 路径替换

// 注册任务
gulp.task('webserver', function () {
    gulp.src('dist') // 服务器目录（./代表根目录）
        .pipe(webserver({ // 运行gulp-webserver
            open: true // 服务器启动时自动打开网页
        }));
});

gulp.task('script', function () {
    return gulp.src('src/js/*.js') // 指明源文件路径、并进行文件匹配
        .pipe(uglify({
            preserveComments: 'some'
        })) // 使用uglify进行压缩，并保留部分注释
        .pipe(rev())
        .pipe(gulp.dest('dist/js')) // 输出路径
        .pipe(rev.manifest()) //- 生成一个rev-manifest.json
        .pipe(gulp.dest('rev/js')); //- 将 rev-manifest.json 保存到 rev 目录内
});

gulp.task('images', function () {
    return gulp.src('src/images/**/*.{png,jpg,gif,svg}') // 指明源文件路径、并进行文件匹配
        .pipe(imagemin({
            progressive: true, // 无损压缩JPG图片
            svgoPlugins: [{
                removeViewBox: false
            }], // 不移除svg的viewbox属性
            use: [pngquant()] // 使用pngquant插件进行深度压缩
        }))
        .pipe(rev())
        .pipe(gulp.dest('dist/images')) // 输出路径
        .pipe(rev.manifest()) //- 生成一个rev-manifest.json
        .pipe(gulp.dest('rev/images')); //- 将 rev-manifest.json 保存到 rev 目录内
});

gulp.task('minify-css', function () {
    return gulp.src('src/css/*.css')
        .pipe(autoprefixer({
            browsers: ['last 2 versions'], // 主流浏览器的最新两个版本
            cascade: false // 是否美化属性值
        }))
        .pipe(minifyCss())
        .pipe(rev())
        .pipe(gulp.dest('dist/css'))
        .pipe(rev.manifest()) //- 生成一个rev-manifest.json
        .pipe(gulp.dest('rev/css')); //- 将 rev-manifest.json 保存到 rev 目录内
});

gulp.task('minifyHTML', function () {
    var options = {
        removeComments: true, //清除HTML注释
        collapseWhitespace: true, //压缩HTML
        collapseBooleanAttributes: true, //省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true, //删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true, //删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true, //删除<style>和<link>的type="text/css"
        minifyJS: true, //压缩页面JS
        minifyCSS: true //压缩页面CSS
    };
    gulp.src('src/*.html')
        .pipe(minifyHTML(options))
        .pipe(rev())
        .pipe(gulp.dest('dist'))
        .pipe(rev.manifest()) //- 生成一个rev-manifest.json
        .pipe(gulp.dest('rev/html')); //- 将 rev-manifest.json 保存到 rev 目录内
});

gulp.task('rev', function () {
    return gulp.src(['rev/**/*.json', 'dist/*.html'])
        .pipe(revCollector({
            replaceReved: true
        }))
        .pipe(minifyHTML({
            empty: true,
            spare: true
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('go', ['webserver', 'script', 'images', 'minify-css', 'minifyHTML', 'rev']);