var gulp = require('gulp'),
	stylus = require('gulp-stylus'),
	del = require('del'),
	plumber = require('gulp-plumber'),
	autoprefixer = require('gulp-autoprefixer'),
	minifyCss = require('gulp-minify-css'),
	rigger = require('gulp-rigger');

var webpack = require("webpack"),
	webpackGulp = require("webpack-stream");
	CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin,
	UglifyJsPlugin = webpack.optimize.UglifyJsPlugin,
	DedupePlugin = webpack.optimize.DedupePlugin,
	ExtractTextPlugin = require("extract-text-webpack-plugin");



gulp.task('build:html', function(){

	return gulp.src('./source/pages/*.html')
		.pipe(rigger())
		.pipe(gulp.dest('./public/'));
});

gulp.task('build:fonts', function(){

	return gulp.src('./source/fonts/**/*')
		.pipe(gulp.dest('./public/assets/fonts/'));
});


gulp.task('build:css', function(){

	return gulp.src('./source/styles/*.styl')
		.pipe(plumber())
		.pipe(stylus())
		.pipe(gulp.dest('./public/assets/styles/'));
});

gulp.task('build:css:o', function(){

	return gulp.src('./source/styles/*.styl')
		.pipe(plumber())
		.pipe(stylus())
		.pipe(autoprefixer({
			browsers: ['last 6 versions'],
			cascade: false
		}))
		.pipe(minifyCss({compatibility: 'ie9'}))
		.pipe(gulp.dest('./public/assets/styles/'));
});


gulp.task('build:image', function(){

	return gulp.src('./source/image/*')
		.pipe(gulp.dest('./public/assets/image/'));
});


gulp.task('build:img', ['build:image'], function(){

	return gulp.src('./source/img/*')
		.pipe(gulp.dest('./public/assets/img/'));
});

gulp.task('build:js:w', function(){

	return gulp.src('')
		.pipe(webpackGulp({
			watch: true,
			entry: {
				'landing.bundle': './source/js/landing.bundle.js',
				'order.bundle': './source/js/order.bundle.js'
			},
			output: {
				filename: './js/[name].js'
			},
			module: {
				loaders: [
					// { test: /\.styl$/, loader: ExtractTextPlugin.extract('css!stylus') }
				]
			},
			plugins: [
				// new CommonsChunkPlugin('./app/scripts/common.js', ['admin', 'user'])
				// new uglifyJsPlugin({compress: {warnings: false}})
				// new ExtractTextPlugin('./styles/[name].css')
			]
		}))
		.pipe(gulp.dest('./public/assets/'));
});


gulp.task('build:js', function(){

	return gulp.src('')
		.pipe(webpackGulp({
			// watch: true,
			entry: {
				'landing.bundle': './source/js/landing.bundle.js',
				'order.bundle': './source/js/order.bundle.js'
			},
			output: {
				filename: './js/[name].js'
			},
			module: {
				loaders: [
					// { test: /\.styl$/, loader: ExtractTextPlugin.extract('css!stylus') }
				]
			},
			plugins: [
				// new CommonsChunkPlugin('./app/scripts/common.js', ['admin', 'user'])
				// new DedupePlugin(),
				new UglifyJsPlugin({compress: {warnings: false}})				
				// new ExtractTextPlugin('./styles/[name].css')
			]
		}))
		.pipe(gulp.dest('./public/assets/'));
});




gulp.task('build',
	[
		'build:html',
		'build:css',
		'build:img',
		'build:js',
		'build:fonts'
	]);

gulp.task('clean', function(){
	return del(['./public']);
});


gulp.task('stream', function(){

	gulp.watch('./source/pages/**/*.html', ['build:html']);
	gulp.watch('./source/styles/**/*.styl', ['build:css']);
	gulp.watch('./source/image/**/*', ['build:image']);
	gulp.watch('./source/img/**/*', ['build:img']);
});