/**
 * Gruntfile.js
 */

module.exports = function( grunt ) {

	grunt.initConfig({
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
			"minLight.min.js": [
				"minLight.js"
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

	grunt.registerTask( "test", [ "jshint", "uglify", "qunit", "compare_size" ]);

	// Default grunt
	grunt.registerTask( "default", [ "test" ]);
};
