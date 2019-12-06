/*
 * Created by Chen Kuo on 2019\11\16
 * 使用 gulp-cli@2.x.x & gulp@4.0.0
 * 新增同步任务 gulp.series 异步任务 gulp.parallel
 * 任务变为 function 控制
 * 更多工具和教程可以参考 https://github.com/Platform-CUF/use-gulp
 * */
'use strict';

//  common
const gulp = require('gulp');
const del = require('del'); //  删除文件
const liveReload = require('gulp-livereload'); //  实时刷新
const rename = require('gulp-rename'); //  重命名
const replace = require('gulp-replace') //  替换;

//  css
const concat = require('gulp-concat'); //  合并文件
const sass = require('gulp-sass'); //  处理sass
const autoPreFixer = require('gulp-autoprefixer'); //  自动补全css
const cleanCSS = require('gulp-clean-css'); //  压缩css

sass.compiler = require('node-sass'); //  sass配置

//  images
const imageMin = require('gulp-imagemin');

//  js
const parcel = require('gulp-parcel'); //  用parcel来管理处理js的一切

//  pages
const htmlMin = require('gulp-htmlmin');


//  params
const CSS_PATH = './dist/css';
const IMAGE_PATH = './dist/images';
const JS_PATH = './dist/js';
const PAGE_PATH = './dist/view';
const LIBERTY_PATH = '../php/public/static/admin/liberties';


function taskClean() {
	return del(
		[
			'./manifest.json',
			IMAGE_PATH,
			CSS_PATH,
			JS_PATH,
			PAGE_PATH
		],
		{
			force: true
		}
	)
}

function taskImage() {
	return gulp
		.src(
			[
				'./images/**',
			],
		)
		.pipe(imageMin())
		.pipe(gulp.dest(IMAGE_PATH));
}

function taskCss() {
	return gulp
		.src(
			[
				'./scss/**',
				'!./scss/pages/**',
			],
		)
		.pipe(sass().on('error', sass.logError))
		.pipe(concat('app.css'))
		.pipe(gulp.src('./src/scss/pages/**'), { base: './src/scss' })
		.pipe(sass().on('error', sass.logError))
		.pipe(autoPreFixer({
			cascade: true, //  是否美化属性值
			remove: true, //  是否去掉不必要的前缀
		}))
		.pipe(gulp.dest(CSS_PATH))
		.pipe(cleanCSS())
		.pipe(rename({
			extname: '.min.css',
		}))
		.pipe(gulp.dest(CSS_PATH));
}

function taskJS() {
	return gulp
		.src('./js/**', { read: false })
		.pipe(parcel())
		.pipe(gulp.dest(JS_PATH));
		.pipe(rename({
			extname: '.min.js',
		}))
		.pipe(gulp.dest(JS_PATH));
}

function taskHtml() {
	return gulp
		.src('./pages/**')
		.pipe(htmlMin({ collapseWhitespace: true }))
		.pipe(gulp.dest(PAGE_PATH));
		.pipe(liveReload());
}

function taskLiberty() {
	return gulp
		.src('./liberties/**')
		.pipe(gulp.dest(LIBERTY_PATH));
}


const TASK_WATCH = gulp.series(taskCleanHTML, taskImage, taskCss, taskJS, taskHtml);

function taskWatch() {
	liveReload.listen(); //  监听livereload服务
	gulp.watch('**', TASK_HTML); //  监听gulp文件实时打包
}

exports.default = gulp.series(taskLiberty, TASK_WATCH);
