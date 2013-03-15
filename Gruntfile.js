/**
 * Gruntfile.js
 */

module.exports = function( grunt ) {

	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		build: {
			all: {
				dest: "dist/minLight.js",
				src: "minLight.js"
			}
		},
		compare_size: {
			files: [
				"minLight.js",
				"minLight.min.js"
			]
		},
		jshint: {
			all: [
				"Gruntfile.js",
				"minLight.js",
				"test/unit/*.js"
			],
			options: {
				jshintrc: ".jshintrc"
			}
		},
		uglify: {
			"dist/minLight.min.js": [
				"dist/minLight.js"
			],
			options: {
				preserveComments: "some"
			}
		},
		qunit: {
			// runs all html files in phantomjs
			all: {
				src: [ "test/index.html" ],
			}
		},
		watch: {
			files: [
				"<%= jshint.all %>",
				"test/index.html"
			],
			tasks: "test"
		}
	});

	// Load necessary tasks from NPM packages
	grunt.loadNpmTasks("grunt-compare-size");
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-qunit");
	grunt.loadNpmTasks("grunt-contrib-watch");

	grunt.registerMultiTask(
		"build",
		"Build minLight to the dist directory",
		function() {
			var data = this.data;
			var dest = data.dest;
			var src = data.src;
			var version = grunt.config("pkg.version");
			var compiled = grunt.file.read( src );

			// Append commit id to version
			if ( process.env.COMMIT ) {
				version += " " + process.env.COMMIT;
			}

			// Replace version and date
			compiled = compiled
				.replace( /@VERSION/g, version )
				.replace( "@DATE", new Date() );

			// Write source to file
			grunt.file.write( dest, compiled );

			grunt.log.ok( "File written to " + dest );
		}
	);

	grunt.registerTask( "test", [ "jshint", "build", "uglify", "qunit", "compare_size" ]);

	// Default grunt
	grunt.registerTask( "default", [ "test" ]);
};
