var gulp         = require( 'gulp' ),
	md5          = require( 'gulp-md5-plus' ), //  文件名加md5
	del          = require( 'del' ), //  删除文件
	autoprefixer = require('gulp-autoprefixer'), //  css自动补齐兼容前缀
	cssmin       = require( 'gulp-clean-css' ), //  压缩css
	uglify       = require( "gulp-uglify" ),
	minifyHtml   = require( "gulp-minify-html" ), //  压缩html
	concat       = require( "gulp-concat" ), //  合并文件
	replace      = require( 'gulp-replace' ), //  字符串替换
	babel        = require( "gulp-babel" ), //  es6转译
	base64       = require('gulp-base64'); //  img转base64

//  每次执行先删除旧的dist 然后再生成一个新的dist
gulp.task( 'default', [ 'clean' ], function() {
	gulp.start( 'img' );
} )

//  开发环境的index输出到发布包中
gulp.task( 'html', function() {
	return gulp .src( './src/*.html' )
				.pipe( minifyHtml() )
				.pipe( gulp.dest( './dist/' ) )
} )

//	对css文件加md5控制版本
gulp.task( 'css', [ 'html' ], function() {
	return gulp .src( [ './src/css/settings/*.css', './src/css/base/*.css', './src/css/components/*.css', './src/css/pages/*.css' ] )
				.pipe( concat( 'app.css' ) )
				.pipe( autoprefixer( {
					browsers: ['last 2 versions', 'Android >= 4.0', 'ie 9', 'ie 10'],
					cascade: false, //是否美化属性值
					remove: true //是否去掉不必要的前缀
				} ) )
				.pipe( cssmin() ) //  压缩css
				.pipe( md5( 10, './dist/*.html', {
					mappingFile: 'manifest.json' //  将对应关系写到mainfest.json中
				} ) )
				.pipe( replace( /..\/..\//g, '../' ) ) //  替换图片路径
				.pipe( gulp.dest( "./dist/css/" ) );
} )

//	对js文件加md5控制版本
gulp.task( 'js', [ 'css' ], function() {
	return gulp .src( "./src/js/*.js" )
				.pipe( babel() )
				.pipe( uglify() )
				.pipe( md5( 10, './dist/*.html', {
					mappingFile: 'manifest.json' //  将对应关系写到mainfest.json中
				} ) )
				.pipe( gulp.dest( "./dist/js/" ) );
} )

//  输出字体文件到dist
gulp.task( 'font', [ 'js' ], function() {
	return gulp .src( "./src/font/**" )
				.pipe( gulp.dest( "./dist/font" ) );
} )

//	输出图片到dist
gulp.task( 'img', [ 'font' ], function() {
	return gulp .src( "./src/images/**" )
			    .pipe( gulp.dest( "./dist/images/" ) );
} )

//  删除发布包和mainfest.json
gulp.task( 'clean', function() {
	return del( [ './dist', './manifest.json' ] );
} );

gulp.watch( './src/**', [ 'default' ] );
