/*
 * Created by Chen Kuo on 2019\11\16
 * 使用 gulp-cli@2.x.x & gulp@4.0.0
 * 新增同步任务 gulp.series 异步任务 gulp.parallel
 * 任务变为 function 控制
 * */
'use strict';

const gulp = require('gulp');
const del = require('del'); //  删除文件
const concat = require('gulp-concat'); //  合并文件
const sass = require('gulp-sass'); //  处理sass
const autoPreFixer = require('gulp-autoprefixer'); //  自动补全css
const liveReload = require('gulp-livereload'); //  实时刷新

sass.compiler = require('node-sass'); //  sass配置


function taskClean() {
	return del(
		[
			'./manifest.json',
			'./dist/css',
			'./dist/pages',
			'./dist/images'
		],
		{
			force: true
		}
	)
}

function taskCss() {
	return gulp
		.src(
			[
				'./scss/**',
				'!./scss/pages/**'
			]
		)
		.pipe(concat('app.css'))
		.pipe(gulp.src('./scss/pages/**'))
		.pipe(sass().on('error', sass.logError))
		.pipe(autoPreFixer({
			cascade: true, //  是否美化属性值
			remove: true, //  是否去掉不必要的前缀
		}))
		.pipe(gulp.dest('./dist/css/'))
}

function taskHtml() {
	return gulp
		.src(
			[
				'./pages/**'
			]
		)
		.pipe(gulp.dest('./dist/pages/'))
}

function taskImage() {
	return gulp
		.src(
			[
				'./images/**'
			]
		)
		.pipe(gulp.dest('./dist/images/'))
}

function taskLiberty() {
	return gulp
		.src(
			[
				'./liberties/**'
			]
		)
		.pipe(gulp.dest('./dist/liberties/'))
}

const TASK_HTML = gulp.series(taskClean, taskCss, taskHtml, taskImage);

function taskWatch() {
	liveReload.listen(); //  监听livereload服务
	gulp.watch(['./images/**', './scss/**', './pages/**'], gulp.series(TASK_HTML)) //  监听gulp文件实时打包
}


exports.default = gulp.series(TASK_HTML, liberty, watch);
