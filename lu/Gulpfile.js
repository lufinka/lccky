// 引入gulp
var gulp = require('gulp'); // 基础库
var uglify = require('gulp-uglify'); // js压缩
var imagemin = require('gulp-imagemin'); // 图片压缩
var pngquant = require('imagemin-pngquant'); // 深度压缩
var htmlmin = require('gulp-htmlmin'); //压缩html
var concat = require('gulp-concat'); //- 多个文件合并为一个；
var minifyCss = require('gulp-minify-css'); //- 压缩CSS为一行；
var rev = require('gulp-rev'); //- 对文件名加MD5后缀
var revCollector = require('gulp-rev-collector'); //- 路径替换
var uglify = require('gulp-uglify'); //压缩js


// 引入gulp插件
var livereload = require('gulp-livereload'), // 网页自动刷新（服务器控制客户端同步刷新）
    webserver = require('gulp-webserver'); // 本地服务器

// 注册任务
gulp.task('webserver', function () {
    gulp.src('./detail') // 服务器目录（./代表根目录）
        .pipe(webserver({ // 运行gulp-webserver
            livereload: true, // 启用LiveReload
            open: true // 服务器启动时自动打开网页
        }));
});

// 监听任务
gulp.task('watch', function () {
    gulp.watch('*.html', ['html']) // 监听根目录下所有.html文件
});

// 默认任务
gulp.task('default', ['webserver', 'watch']);

gulp.task('script', function () {
    return gulp.src('*.js') // 指明源文件路径、并进行文件匹配
        .pipe(uglify({
            preserveComments: 'some'
        })) // 使用uglify进行压缩，并保留部分注释
        .pipe(gulp.dest('dist')); // 输出路径
});


gulp.task('images', function () {
    return gulp.src('detail/images/*.{png,jpg,gif,svg}') // 指明源文件路径、并进行文件匹配
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
        .pipe(gulp.dest('rev/img')); //- 将 rev-manifest.json 保存到 rev 目录内
});

gulp.task('htmlmin', function () {
    var options = {
        collapseWhitespace: true,
        collapseBooleanAttributes: true,
        removeComments: true,
        removeEmptyAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        minifyJS: true,
        minifyCSS: true
    };
    gulp.src('detail/*.html')
    .pipe(rev())
        .pipe(htmlmin(options))
        .pipe(gulp.dest('dist'))
    .pipe(rev.manifest()) //- 生成一个rev-manifest.json
        .pipe(gulp.dest('rev/html')); //- 将 rev-manifest.json 保存到 rev 目录内
});

gulp.task('concat', function () { //- 创建一个名为 concat 的 task   gulp.src(['./src/css/*.css'])                            
    //- 需要处理的css文件，放到一个字符串数组里
    //.pipe(concat('wrap.min.css'))   
    //- 合并后的文件名
    return gulp.src(['dist/css/*.css'])
        .pipe(minifyCss()) //- 压缩处理成一行
        .pipe(rev()) //- 文件名加MD5后缀
        .pipe(gulp.dest('dist/css')) //- 输出文件本地
        .pipe(rev.manifest()) //- 生成一个rev-manifest.json
        .pipe(gulp.dest('rev/css')); //- 将 rev-manifest.json 保存到 rev 目录内
});

//压缩，合并 js
gulp.task('minifyjs', function () {
   return gulp.src('dist/js/*.js') // 要压缩的js文件
    .pipe(rev()) //- 文件名加MD5后缀
    .pipe(uglify())  //使用uglify进行压缩,更多配置请参考：
    .pipe(gulp.dest('dist/js')) //压缩后的路径
    .pipe(rev.manifest()) //- 生成一个rev-manifest.json
    .pipe(gulp.dest('rev/js')); //- 将 rev-manifest.json 保存到 rev 目录内
});

gulp.task('rev', function () {
    return gulp.src(['rev/**/*.json','dist/**/*.css'])
        .pipe( revCollector({
            replaceReved: true
        }) )
        .pipe( htmlmin({
                empty:true,
                spare:true
            }) )
        .pipe( gulp.dest('./dist') );
});

gulp.task('default', ['concat', 'rev']);