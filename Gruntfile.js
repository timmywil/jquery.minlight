/**
 * Gruntfile.js
 */

module.exports = function( grunt ) {
	'use strict';

	var gzip = require('gzip-js');

	require('load-grunt-tasks')(grunt);

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		build: {
			dist: {
				dest: 'dist/jquery.minlight.js',
				src: 'minlight.js'
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
				'dist/jquery.minlight.js',
				'dist/jquery.minlight.min.js'
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
			source: {
				options: {
					jshintrc: '.jshintrc'
				},
				src: [
					'Gruntfile.js',
					'minlight.js',
				]
			},
			test: {
				options: {
					jshintrc: 'test/.jshintrc'
				},
				src: [
					'test/unit/*.js'
				]
			}
		},
		uglify: {
			'dist/jquery.minlight.min.js': [
				'dist/jquery.minlight.js'
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
				'<%= jshint.source.src %>',
				'<%= jshint.test.src %>',
				'package.json',
				'test/index.html'
			],
			tasks: 'test'
		}
	});

	grunt.registerMultiTask(
		'build',
		'Build minlight to the dist directory',
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
