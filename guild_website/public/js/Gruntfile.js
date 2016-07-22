module.exports = function (grunt) {
    var transport = require('grunt-cmd-transport');
    var style = transport.style.init(grunt);
    var text = transport.text.init(grunt);
    var script = transport.script.init(grunt);

    grunt.initConfig({
        pkg : grunt.file.readJSON("package.json"),

        transport : {
			options : {
                 paths : ['.'],
				 parsers : {
                    '.js' : [script.jsParser]
                }
            },
      		module : {
                options : {
                    idleading : 'dist/module/'
                },
                files : [
                    {
                        cwd : 'module/',
                        src : '**/*',
                        filter : 'isFile',
                        dest : '.build/module'
                    }
                ]
            },
            app : {
                options : {
                    idleading : '../js/dist/app/'
                },

                files : [
                    {
                        cwd : 'app/',
                        src : '**/*',
                        filter : 'isFile',
                        dest : '.build/app'
                    }
                ]
            },
            appModule : {
                options : {
                    idleading : 'dist/app/'
                },
                files : [
                    {
                        cwd : 'app/',
                        src : '*/module/*',
                        filter : 'isFile',
                        dest : '.build/app'
                    }
                ]
            }
        },
        concat : {
            app : {
                options : {
                    include : 'all'
                },
                files: [
                    {
                        expand: true,
                        cwd: '.build/',
                        src: ['app/**/*.js'],
                        dest: 'dist/',
                        ext: '.js'
                    }
                ]
            }
        },

        uglify : {
            
            app : {
                files: [
                    {
                        expand: true,
                        cwd: 'dist/',
                        src: ['app/**/*.js', '!app/**/*-debug.js'],
                        dest: 'dist/',
                        ext: '.js'
                    }
                ]
            }
        },

        clean : {
            spm : ['.build']
        }
    });

    grunt.loadNpmTasks('grunt-cmd-transport');
    grunt.loadNpmTasks('grunt-cmd-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');

	//grunt.registerTask('build-module', ['transport:module']);
    grunt.registerTask('build-app', ['transport:module','transport:app','transport:appModule', 'concat:app', 'uglify:app', 'clean']);
//    grunt.registerTask('default', ['clean']);
};