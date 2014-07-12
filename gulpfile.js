var gulp = require('gulp');
var source     = require('vinyl-source-stream');
var jade = require('gulp-jade');
var browserify = require('browserify');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var watchify = require('watchify');
var exec = require('child_process').exec;


function gulpExec(command) {
	exec(command,
		function (error, stdout, stderr) {
			console.log('stdout: ' + stdout);
			console.log('stderr: ' + stderr);
			if (error !== null) {
				console.log('exec error: ' + error);
			}
		});

	}



	var glob = {
		jade_page:'www/page/*.jade',
		jade_test:'test/*.jade',
		sass:'www/static/css/*.scss'
	}

	gulp.task('jade_page',function(){
		return gulp.src(glob.jade_page)
		.pipe(jade())
		.pipe(gulp.dest('www/page/'))
	})

	gulp.task('jade_test',function(){
		return gulp.src(glob.jade_test)
		.pipe(jade())
		.pipe(gulp.dest('test/'))
	})


	gulp.task('sass', function () {
		var ret = gulp.src(glob.sass)
		.pipe(sass())
		.pipe(concat('browser.css'))
		.pipe(gulp.dest('www/static/css/'));

		return ret;
	});


	gulp.task('b', function() {
		var bundler = watchify('./src/entry.js');
		bundler.on('update', rebundle);

		function rebundle () {
			var t = Date.now();
			var ret =  bundler.bundle()
			.pipe(source('dist/popscript.js'))
			.pipe(gulp.dest(''));
			return ret;
		}
		return rebundle()
	})

	gulp.task('demopopscript', function(){
		gulpExec('cd etc; python build_demopage.py; python build_indexpage.py; python build_doc_core.py');
	})

	gulp.task('docs', function(){
		gulpExec('cd www/docs; make clean && make html');
	})

	gulp.task('minify', function(){
		gulp.src('dist/popscript.js')
		.pipe(uglify())
		.pipe(gulp.dest('dist'));
	});

	gulp.task('unittest', function(){
		gulpExec('cd test; make test');
	});

	gulp.task('watch', function(){
		gulp.watch(glob.jade_page, ['jade_page']);
		gulp.watch(glob.jade_test, ['jade_test']);
		gulp.watch(glob.sass, ['sass']);
		gulp.watch(['etc/*','www/static/js/index.js', 'dist/popscript-boilerplate.js'], ['demopopscript']);
		gulp.watch(['www/docs/_templates/layout.html', 'www/docs/*.rst'], ['docs']);
		gulp.watch('dist/popscript.js', ['minify', 'unittest']);
		gulp.watch('test/unittest.js', ['unittest']);

		gulp.start('jade_page');
		gulp.start('jade_test');
		gulp.start('sass');
		gulp.start('demopopscript');
		gulp.start('docs');

		gulp.start('b');
	})
