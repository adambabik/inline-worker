module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concat: {
			options: {
				separator: ';'
			},
			dist: {
				src: ['src/**/*.js'],
				dest: 'dist/<%= pkg.name %>.js'
			}
		},
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %>-<%= pkg.version %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
			},
			dist: {
				files: {
					'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
				}
			}
		},
		jshint: {
			files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
			options: grunt.file.readJSON('.jshintrc'),
		},
		buster: {
			test: {
				config: 'test/buster.js'
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-concat');

	grunt.registerTask('default', ['jshint', 'concat', 'uglify']);

	grunt.registerTask('test', function () {
		console.log('To run tests use buster.js');
		console.log('1. Start server:               buster server');
		console.log('2. Run all tests:              buster test --environment browser');
		console.log('3. Run devel tests:            buster test --environment browser -g "InlineWorkerDev Tests"');
		console.log('4. Run distribution tests:     buster test --environment browser -g "InlineWorkerDist Tests"');
	});

};