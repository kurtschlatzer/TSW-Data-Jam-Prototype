'use strict';

var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({
  port: LIVERELOAD_PORT
});

var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};

module.exports = function (grunt) {
  // show elapsed time at the end
  require('time-grunt')(grunt);
  // load all grunt tasks
  require('load-grunt-tasks')(grunt);

  // configurable paths
  var yeomanConfig = {
    app: 'app',
    dist: 'dist'
  };

  grunt.initConfig({
    yeoman: yeomanConfig,
    // TODO: Make this conditional
    watch: {
      coffee: {
        files: ['<%= yeoman.app %>/assets/scripts/{,*/}*.coffee'],
        tasks: ['coffee:dist']
      },
      coffeeTest: {
        files: ['test/spec/{,*/}*.coffee'],
        tasks: ['coffee:test']
      },
      compass: {
        files: ['<%= yeoman.app %>/assets/styles/{,*/}*.{scss,sass}'],
        tasks: ['compass:server']
      },
      livereload: {
        options: {
          livereload: LIVERELOAD_PORT
        },
        files: [
          '<%= yeoman.app %>/*.html',
          '{.tmp,<%= yeoman.app %>}/assets/styles/{,*/}*.css',
          '{.tmp,<%= yeoman.app %>}/assets/scripts/{,*/}*.js',
          '<%= yeoman.app %>/assets/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },
    autoshot: {
      dist: {
        options: {
          path: '/screenshots/',
          remote: {
            files: [{
              src: 'http://localhost:<%= connect.options.port %>',
              dest: 'app.jpg'
            }]
          },
          viewport: ['320x480', '480x320', '384x640', '640x384', '602x963', '963x602', '600x960', '960x600', '800x1280', '1280x800', '768x1024', '1024x768']
        }
      }
    },

    responsive_images: {
      dev: {
        options: {
          sizes: [{
            width: 320,
          }, {
            width: 640
          }, {
            width: 1024
          }]
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/assets/images',
          src: '{,*/}*.{png,jpg,jpeg}',
          dest: '<%= yeoman.dist %>/assets/images'
        }]
      }
    },
    connect: {
      options: {
        port: 9000,
        // change this to '0.0.0.0' to access the server from outside
        hostname: 'localhost'
      },
      livereload: {
        options: {
          middleware: function (connect) {
            return [
              lrSnippet,
              mountFolder(connect, '.tmp'),
              mountFolder(connect, yeomanConfig.app)
            ];
          }
        }
      },
      test: {
        options: {
          middleware: function (connect) {
            return [
              mountFolder(connect, '.tmp'),
              mountFolder(connect, 'test')
            ];
          }
        }
      },
      dist: {
        options: {
          middleware: function (connect) {
            return [
              mountFolder(connect, yeomanConfig.dist)
            ];
          }
        }
      }
    },
    open: {
      server: {
        path: 'http://localhost:<%= connect.options.port %>'
      }

    },
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.dist %>/*',
            '!<%= yeoman.dist %>/.git*'
          ]
        }]
      },
      server: '.tmp'
    },
    browser_sync: {
      dev: {
        bsFiles: {
          src: '<%= yeoman.app %>/assets/styles/style.css'
        },
        options: {
          watchTask: false,
          debugInfo: true,
          // Change to 0.0.0.0 to access externally
          host: 'http://localhost:<%= connect.options.port %>',
          server: {
            baseDir: '<%= yeoman.app %>'
          },
          ghostMode: {
            clicks: true,
            scroll: true,
            links: true,
            forms: true
          }
        }
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        '<%= yeoman.app %>/assets/scripts/{,*/}*.js',
        '!<%= yeoman.app %>/assets/vendor/*',
        'test/spec/{,*/}*.js'
      ]
    },
    mocha: {
      all: {
        options: {
          run: true,
          urls: ['http://localhost:<%= connect.options.port %>/index.html']
        }
      }
    },
    coffee: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/assets/scripts',
          src: '{,*/}*.coffee',
          dest: '.tmp/assets/scripts',
          ext: '.js'
        }]
      },
      test: {
        files: [{
          expand: true,
          cwd: 'test/spec',
          src: '{,*/}*.coffee',
          dest: '.tmp/assets/spec',
          ext: '.js'
        }]
      }
    },
    compass: {
      options: {
        sassDir: '<%= yeoman.app %>/assets/styles',
        cssDir: '.tmp/assets/styles',
        generatedImagesDir: '.tmp/assets/images/generated',
        imagesDir: '<%= yeoman.app %>/assets/images',
        javascriptsDir: '<%= yeoman.app %>/scripts',
        /*fontsDir: '<%= yeoman.app %>/styles/fonts',*/
        importPath: '<%= yeoman.app %>/assets/vendor',
        httpImagesPath: '/assets/images',
        httpGeneratedImagesPath: '/assets/images/generated',
        httpFontsPath: '/assets/styles/fonts',
        relativeAssets: false
      },
      dist: {},
      server: {
        options: {
          debugInfo: true
        }
      }
    },
    // not used since Uglify task does concat,
    // but still available if needed
    /*concat: {
            dist: {}
          },*/
    requirejs: {
      dist: {
        // Options: https://github.com/jrburke/r.js/blob/master/build/example.build.js
        options: {
          // `name` and `out` is set by grunt-usemin
          baseUrl: '<%= yeoman.app %>/assets/scripts',
          optimize: 'none',
          // TODO: Figure out how to make sourcemaps work with grunt-usemin
          // https://github.com/yeoman/grunt-usemin/issues/30
          //generateSourceMaps: true,
          // required to support SourceMaps
          // http://requirejs.org/docs/errors.html#sourcemapcomments
          preserveLicenseComments: false,
          useStrict: true,
          wrap: true
          //uglify2: {} // https://github.com/mishoo/UglifyJS2
        }
      }
    },
    rev: {
      dist: {
        files: {
          src: [
            '<%= yeoman.dist %>/assets/scripts/{,*/}*.js',
            '<%= yeoman.dist %>/assets/styles/{,*/}*.css',
            '<%= yeoman.dist %>/assets/images/{,*/}*.{png,jpg,jpeg,gif,webp}',
            '<%= yeoman.dist %>/assets/styles/fonts/*'
          ]
        }
      }
    },


    modernizr: {

      // Path to the build you're using for development.
      "devFile": "<%= yeoman.app %>/assets/vendor/modernizr/modernizr.js",

      // Path to save out the built file.
      "outputFile": "<%= yeoman.dist %>/assets/scripts/modernizr.js",

      // Based on default settings on http://modernizr.com/download/
      "extra": {
        "shiv": true,
        "printshiv": false,
        "load": true,
        "mq": false,
        "cssclasses": true
      },

      // Based on default settings on http://modernizr.com/download/
      "extensibility": {
        "addtest": false,
        "prefixed": false,
        "teststyles": false,
        "testprops": false,
        "testallprops": false,
        "hasevents": false,
        "prefixes": false,
        "domprefixes": false
      },

      // By default, source is uglified before saving
      "uglify": true,

      // Define any tests you want to impliticly include.
      "tests": [],

      // By default, this task will crawl your project for references to Modernizr tests.
      // Set to false to disable.
      "parseFiles": true,

      // When parseFiles = true, this task will crawl all *.js, *.css, *.scss files, except files that are in node_modules/.
      // You can override this by defining a "files" array below.
      // "files" : [],

      // When parseFiles = true, matchCommunityTests = true will attempt to
      // match user-contributed tests.
      "matchCommunityTests": false,

      // Have custom Modernizr tests? Add paths to their location here.
      "customTests": []
    },

    useminPrepare: {
      options: {
        dest: '<%= yeoman.dist %>'
      },
      html: '<%= yeoman.app %>/index.html'
    },
    usemin: {
      options: {
        dirs: ['<%= yeoman.dist %>']
      },
      html: ['<%= yeoman.dist %>/{,*/}*.html'],
      css: ['<%= yeoman.dist %>/assets/styles/{,*/}*.css']
    },
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/assets/images',
          src: '{,*/}*.{png,jpg,jpeg}',
          dest: '<%= yeoman.dist %>/assets/images'
        }]
      }
    },
    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/assets/images',
          src: '{,*/}*.svg',
          dest: '<%= yeoman.dist %>/assets/images'
        }]
      }
    },
    cssmin: {
      dist: {
        files: {
          '<%= yeoman.dist %>/assets/styles/main.css': [
            '.tmp/assets/styles/{,*/}*.css',
            '<%= yeoman.app %>/assets/styles/{,*/}*.css'
          ]
        }
      }
    },
    htmlmin: {
      dist: {
        options: {
          /*removeCommentsFromCDATA: true,
          // https://github.com/yeoman/grunt-usemin/issues/44
          collapseWhitespace: true,
          collapseBooleanAttributes: true,
          removeAttributeQuotes: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeOptionalTags: true */
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>',
          src: '*.html',
          dest: '<%= yeoman.dist %>'
        }]
      }
    },
    // Put files not handled in other tasks here
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.dist %>',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            'assets/images/{,*/}*.{webp,gif}',
            'assets/styles/fonts/*'
          ]
        }, {
          expand: true,
          cwd: '.tmp/assets/images',
          dest: '<%= yeoman.dist %>/assets/images',
          src: [
            'generated/*'
          ]
        }]
      }
    },
    concurrent: {
      server: [
        'coffee:dist',
        'compass:server'
      ],
      test: [
        'coffee',
        'compass'
      ],
      dist: [
        'coffee',
        'compass:dist',
        'imagemin',
        'svgmin',
        'htmlmin'
      ]
    },
    bower: {
      options: {
        exclude: ['modernizr']
      },
      all: {
        rjsConfig: '<%= yeoman.app %>/assets/scripts/main.js'
      }
    }
  });

  grunt.registerTask('server', function (target) {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve:' + target]);
  });

  grunt.registerTask('serve', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'open', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'concurrent:server',
      'connect:livereload',
      'open:server',
      'watch'
    ]);
  });

  grunt.registerTask('test', [
    'clean:server',
    'concurrent:test',
    'connect:test',
    'mocha'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'useminPrepare',
    'concurrent:dist',
    'requirejs',
    'cssmin',
    'responsive_images:dev',
    'concat',
    'uglify',
    'copy',
    'rev',
    'usemin'
  ]);

  grunt.registerTask('jshint', [
    'jshint'
  ]);

  grunt.registerTask('default', [
    'test',
    'build'
  ]);

  grunt.registerTask('screenshots', [
    'clean:server',
    'concurrent:server',
    'connect:livereload',
    'autoshot'
  ]);

};
