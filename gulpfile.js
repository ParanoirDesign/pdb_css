/**
 * Available tasks
 *
 * gulp serve (browsersync)
 * gulp img   (build all img)
 * gulp css   (build all css)
 * gulp js    (build all js)
 */


/* Configuration */

var url = 'http://localhost/pdb_css/', /* 'http://localhost/le nom de mon site' */
	
	files = {
		
		// IMG files
		
		img: [
			{
				src:  [
					'./img/**/*.gif',
					'./img/**/*.jpg',
					'./img/**/*.png'
				],
				dest: './img/'
			}
		],
		
		// CSS files
		
		css: [
			{
				src:  [
					'./less/style.less'
				],
				dest: './',
				name: 'style.css'
			}
		],
		
		// JS files
		
		js: [
			{
				src:  [
					'./js/main.js',
				],
				dest: './js/',
				name: 'all.js'
			}
		]
		
	};


/* Tasks */

var gulp        = require('gulp'),
    plugins     = require('gulp-load-plugins')(),
	browsersync = require('browser-sync').create(),
	streams     = require('merge-stream'),
	reduce_src  = function(a, b) { return a.concat(b.src); };

// Serve all

gulp.task('serve', function()
{
	var reload = function() { browsersync.reload(); };
	
	browsersync.init({
		proxy: url
	});
	
	gulp.task('serve-img', ['img'], reload);
	gulp.task('serve-css', ['css'], reload);
	gulp.task('serve-js', ['js'], reload);
	
	gulp.watch(files.img.reduce(reduce_src, []), ['serve-img']);
	gulp.watch(files.css.reduce(reduce_src, []), ['serve-css']);
	gulp.watch(files.js.reduce(reduce_src, []), ['serve-js']);
});

// Build all

gulp.task('build', ['img', 'css', 'js']);

// Build IMG

gulp.task('img', function()
{
	var strms = streams(),
		strm, i;
	
	for(i in files.img) {
		strm = gulp.src(files.img[i].src)
			.pipe(plugins.imagemin({
				interlaced: true,
				multipass: true,
				progressive: true
			}))
			.pipe(gulp.dest(files.img[i].dest));
		strms.add(strm);
	}
	
	return strms.isEmpty() ? null : strms;
});

// Build CSS

gulp.task('css', function()
{
	var strms = streams(),
		i, strm;
	
	for(i in files.css) {
		strm = gulp.src(files.css[i].src)
			.pipe(plugins.less({
				relativeUrls: true
			}));
		if(files.css[i].name) {
			strm = strm.pipe(plugins.concat(files.css[i].name));
		}
		strm.pipe(plugins.autoprefixer())
			.pipe(plugins.combineMq({
				beautify: false
			}))
			.pipe(gulp.dest(files.css[i].dest));
		strms.add(strm);
	}
	
	return strms.isEmpty() ? null : strms;
});

// Build JS

gulp.task('js', function()
{
	var strms = streams(),
		i, strm;
	
	for(i in files.js) {
		strm = gulp.src(files.js[i].src);
		if(files.js[i].name) {
			strm = strm.pipe(plugins.concat(files.js[i].name));
		}
		strm.pipe(plugins.uglify())
			.pipe(gulp.dest(files.js[i].dest));
		strms.add(strm);
	}
	
	return strms.isEmpty() ? null : strms;
});

// Tâche par défaut
gulp.task('default', ['serve']);
