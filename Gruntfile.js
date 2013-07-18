/**
 * Gruntfile.js
 */

module.exports = function( grunt ) {
	'use strict';

	var gzip = require('gzip-js');

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		build: {
			dist: {
				dest: 'dist/minLight.js',
				src: 'minLight.js'
			},
			bower: {
				src: 'bower.json'
			},
			jquery: {
				src: 'minlight.jquery.json'
			}
		},
		compare_size: {
			files: [
				'dist/minLight.js',
				'dist/minLight.min.js'
			],
			options: {
				cache: 'dist/.sizecache.json',
				compress: {
					gz: function( contents ) {
						return gzip.zip( contents, {} ).length;
					}
				}
			}
		},
		jsonlint: {
			pkg: {
				src: 'package.json'
			},
			bower: {
				src: 'bower.json'
			},
			jquery: {
				src: 'minlight.jquery.json'
			}
		},
		jshint: {
			all: [
				'Gruntfile.js',
				'minLight.js',
				'test/unit/*.js'
			],
			options: {
				jshintrc: '.jshintrc'
			}
		},
		uglify: {
			'dist/minLight.min.js': [
				'dist/minLight.js'
			],
			options: {
				preserveComments: 'some'
			}
		},
		qunit: {
			all: {
				src: [ 'test/index.html' ],
			}
		},
		watch: {
			files: [
				'<%= jshint.all %>',
				'package.json',
				'test/index.html'
			],
			tasks: 'test'
		}
	});

	// Load necessary tasks from NPM packages
	grunt.loadNpmTasks('grunt-compare-size');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-qunit');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-jsonlint');

	grunt.registerMultiTask(
		'build',
		'Build minLight to the dist directory',
		function() {
			var data = this.data;
			var src = data.src;
			// Dest is src if not specified
			var dest = data.dest || src;
			var version = grunt.config('pkg.version');
			var compiled = grunt.file.read( src );

			// Append commit id to version
			if ( process.env.COMMIT ) {
				version += ' ' + process.env.COMMIT;
			}

			// Replace version and date
			compiled = compiled
				// Replace version in JSON files
				.replace( /("version":\s*")[^"]+/, '$1' + version )
				// Replace version tag
				.replace( /@VERSION/g, version )
				.replace( '@DATE', (new Date).toDateString() );

			// Write source to file
			grunt.file.write( dest, compiled );

			grunt.log.ok( 'File written to ' + dest );
		}
	);

	grunt.registerTask( 'test', [ 'jsonlint', 'jshint', 'build', 'uglify', 'qunit', 'compare_size' ]);

	// Default grunt
	grunt.registerTask( 'default', [ 'test' ]);
};
