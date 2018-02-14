"use strict";

var gulp = require('gulp');
var connect = require('gulp-connect'); // runs local dev server
var open = require('gulp-open'); // open URL in browser
var browserify = require('browserify'); // bundle JS
var reactify = require('reactify');  // transform React JSX to JS
var source = require('vinyl-source-stream'); // use conventional text streams with Gulp
var concat = require('gulp-concat'); // concat files
var lint = require('gulp-eslint'); //Lint JS files, including JSX

/* high-level of what's happening: 
Gulp cp html from src to dist
Gulp start dev server
Gulp connects to dev server */

var config = {
	port: 9007,
	devBaseUrl: 'http://localhost',
	paths: {
        html: './src/*.html',
        js: './src/**/*.js',
        css: [
			'node_modules/bootstrap/dist/css/bootstrap.min.css',
			'node_modules/bootstrap/dist/css/bootstrap-theme.min.css'
	  	],
        dist: './dist',
        mainJs: './src/main.js'
	}
}

// start dev server
gulp.task('connect', function() {
	connect.server({
		root: ['dist'],
		port: config.port,
		base: config.devBaseUrl,
		livereload: true
	});
});

gulp.task('open', ['connect'], function() { // run 'connect' first
	gulp.src('dist/index.html')
		.pipe(open({ uri: config.devBaseUrl + ':' + config.port + '/'}));
});

gulp.task('html', function() {
	gulp.src(config.paths.html) // get html
		.pipe(gulp.dest(config.paths.dist)) // cp
		.pipe(connect.reload()); // use dev server to connect again
});

gulp.task('js', function() {
	browserify(config.paths.mainJs) // find JS
		.transform(reactify) // use plugin to bundle bc it's JSX not valid JS
		.bundle() // actually bundle
		.on('error', console.error.bind(console))
		.pipe(source('bundle.js')) // name of bundle
		.pipe(gulp.dest(config.paths.dist + '/scripts')) // create 'dist/scripts' and put inside
		.pipe(connect.reload()); // when this task is run, reload browser hooked to Gulp dev server
});

gulp.task('css', function() {
	gulp.src(config.paths.css)
		.pipe(concat('bundle.css')) // what is being concat?
		.pipe(gulp.dest(config.paths.dist + '/css'));
});

gulp.task('lint', function() {
	return gulp.src(config.paths.js)
		.pipe(lint({config: 'eslint.config.json'}))
		.pipe(lint.format());
});

gulp.task('watch', function() {
    // first arg path to watch, second arg task to run on change
    gulp.watch(config.paths.html, ['html']);
    gulp.watch(config.paths.js, ['js', 'lint']);
});

gulp.task('default', ['html', 'js', 'css', 'lint', 'open', 'watch']);
