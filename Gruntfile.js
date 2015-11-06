module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      'public/theWholeLib.js': [
        'public/lib/underscore.js',
        'public/lib/jquery.js',
        'public/lib/backbone.js',
        'public/lib/handlebars.js'
      ],
      'public/theWholeClient.js':['public/client/app.js',
        'public/client/router.js',
        'public/client/link.js',
        'public/client/links.js',
        'public/client/linkView.js',
        'public/client/linksView.js',
        'public/client/createLinkView.js'
      ]
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },
    nodemon: {
      dev: {
        script: 'server.js'
      }
    },
    shell: {
      mongo: {
        command: 'mongod'
      }
    },
    uglify: {
      my_target: {
        files: {
          'public/dist/theWholeLib.min.js': 'public/theWholeLib.js',
          'public/dist/theWholeClient.min.js': 'public/theWholeClient.js',
        }
      }
    },

    jshint: {
      files: [
      'server.js',
      'server-config.js',
      'app/*.js',
      'app/**/*.js'
      ],
      options: {
        force: 'true',
        jshintrc: '.jshintrc',
        ignores: [
          'public/lib/**/*.js',
          'public/dist/**/*.js'
        ]
      }
    },
    cssmin: {
      target: {
        files: [{
          expand: true,
          cwd: 'public',
          src: ['*.css', '!*.min.css'],
          dest: 'public/dist',
          ext: '.min.css'
        }]
      }
    },

    watch: {
      scripts: {
        files: [
          'public/client/**/*.js',
          'public/lib/**/*.js',
        ],
        tasks: [
          'concat',
          'uglify'
        ]
      },
      css: {
        files: 'public/*.css',
        tasks: ['cssmin']
      }
    },

    gitadd: {
      task: {
        options: {
          verbose: true,
          all: true
        }
      }
    },
    gitcommit: {
      task: {
        options: {
          message: grunt.option('message')
        }
      }
    },
    gitpush: {
      task: {
        options: {
          verbose: true,
          remote: 'azure'
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-git');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('server-dev', function (target) {
    // Running nodejs in a different process and displaying output on the main console
    var nodemon = grunt.util.spawn({
         cmd: 'grunt',
         grunt: true,
         args: 'nodemon'
    });
    nodemon.stdout.pipe(process.stdout);
    nodemon.stderr.pipe(process.stderr);
  
    grunt.task.run([ 'watch' ]);
  });

  grunt.registerTask('mongo-dev', function (target) {
    // Running mongodb in a different process and displaying output on the main console
    var mongodb = grunt.util.spawn({
         cmd: 'grunt',
         grunt: true,
         args: 'shell:mongo'
    });
    mongodb.stdout.pipe(process.stdout);
    mongodb.stderr.pipe(process.stderr);

    grunt.task.run([
      'server-dev'
    ]);
  });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('test', [
    'mochaTest'
  ]);

  grunt.registerTask('git', [
    'gitadd',
    'gitcommit',
    'gitpush'
  ]);

  grunt.registerTask('build-dev', [
    'jshint',
    'test',
    //'concat',
    //'uglify',
    //'cssmin',
    'upload'
  ]);

  grunt.registerTask('build', [
    //'jshint',
    //'test',
    'concat',
    'uglify',
    'cssmin',
    //'upload'
  ]);

  grunt.registerTask('upload', function(n) {
    if(grunt.option('prod')) {
      grunt.task.run([ 'git' ]);
    } else {
      grunt.task.run([ 
        'mongo-dev',
      ]);
    }
  });

  grunt.registerTask('deploy', [
    'build-dev'
  ]);


};
