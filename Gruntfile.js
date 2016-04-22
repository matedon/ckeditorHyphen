assetResources = {
    js: {
        general: [
            'bower_components/jquery/dist/jquery.min.js',
            'bower_components/bootstrap-css/js/bootstrap.min.js',
            'bower_components/jquery.serializeJSON/jquery.serializejson.js',
            'bower_components/moment/min/moment-with-locales.min.js',
            'public/customize/ckeditorPrepare.js',
            'bower_components/ckeditor/ckeditor.js',
            'bower_components/ckeditor/adapters/jquery.js',
            'bower_components/Hyphenator/Hyphenator.js',
            'bower_components/Hyphenator/patterns/hu.js',
            'bower_components/Hyphenator/patterns/en.js',
            'bower_components/Hyphenator/patterns/de.js',
            'assets/main.js'
        ]
    },
    style: {
        general: [
            'bower_components/bootstrap-css/css/bootstrap.min.css',
            'bower_components/bootstrap-css/css/bootstrap-theme.min.css'
        ],
        fonts: [
            'assets/fonts/geoxe3/styles.css',
            'assets/fonts/geoxe3bold/styles.css',
            'assets/fonts/CubanoForMalibu-Filling/styles.css'
        ],
        less: [
            'assets/main.less'
        ]
    }
};

$uglifyOptions = {
    beautify: true,
    compress: false,
    mangle: false
};

$cssminOptions = {
    keepSpecialComments: 1,
    shorthandCompacting: false,
    roundingPrecision: -1,
    rebase: false
};

module.exports = function (grunt) {
    var gruntConfig = {};

    gruntConfig.less = {
        main: {
            options: {
                paths: [],
                map: true,
                compress: false,
                rebase: true,
                strictMath: true
            },
            files: {
                'public/_build/less.css': assetResources.style.less
            }
        }
    };
    
    gruntConfig.uglify = {
        general: {
            options: $uglifyOptions,
            files: {
                'public/_build/general.js': assetResources.js.general
            }
        }
    };
    
    gruntConfig.cssmin = {
        css: {
            options: $cssminOptions,
            files: {
                'public/_build/css.css': [
                    assetResources.style.general,
                    assetResources.style.fonts
                ]
            }
        },
        fonts: {
            options: $cssminOptions,
            files: {
                'public/_build/fonts/fonts.css': [
                    assetResources.style.fonts
                ]
            }
        }
    };
    
    gruntConfig.copy = {
        files: {
            expand: true,
            flatten: true,
            cwd: '.',
            src: [
                'bower_components/bootstrap/fonts/*',
                'bower_components/components-font-awesome/fonts/*'
            ],
            dest: 'public/_build/fonts/',
            filter: 'isFile'
        },
        ckeditor: {
            filter: 'isFile',
            files: [
                {
                    expand: true,
                    cwd: 'bower_components/ckeditor/',
                    src: 'contents.css',
                    dest: 'public/_build/ckeditor/'
                }, {
                    expand: true,
                    cwd: 'bower_components/ckeditor/skins/moono/',
                    src: '**',
                    dest: 'public/_build/ckeditor/skins/moono/'
                }, {
                    expand: true,
                    cwd: 'bower_components/ckeditor/lang/',
                    src: 'hu.js',
                    dest: 'public/_build/ckeditor/lang/'
                }, {
                    expand: true,
                    cwd: 'bower_components/ckeditor/plugins/',
                    src: '**',
                    dest: 'public/_build/ckeditor/plugins/'
                }, {
                    expand: true,
                    cwd: 'assets/ckeditor/plugins/',
                    src: '**',
                    dest: 'public/_build/ckeditor/plugins/'
                }
            ]
        }
    };

    assetResources.style.fonts.forEach(function(name) {
        var folder = name.replace(/\\/g, '/').replace(/\/[^\/]*\/?$/, ''),
            extList = ['eot', 'otf', 'svg', 'ttf', 'woff'];
        extList.forEach(function (ext) {
            gruntConfig.copy.files.src.push(folder + '/*.' + ext);
        });
    });

    gruntConfig.clean = {
        build: [
            'public/_build/*'
        ]
    };

    gruntConfig.shell = {
        gitadd: {
            command: 'git add public/_build/*'
        }
    };

    gruntConfig.watch = {
        gruntConfig: {
            files: 'Gruntfile.js',
            tasks: ['default'],
            options: {
                interval: 1200
            }
        },
        general_js: {
            files: ([].concat(assetResources.js.general, [
                'assets/ckeditor/**'
            ])),
            tasks: ['uglify:general', 'copy:ckeditor', 'task:gitadd'],
            options: {
                interval: 500
            }
        },
        style_css: {
            files: ([].concat(assetResources.style.general, assetResources.style.fonts)),
            tasks: ['task:css', 'task:gitadd'],
            options: {
                interval: 500
            }
        },
        less: {
            files: assetResources.style.less,
            tasks: ['task:less', 'task:gitadd'],
            options: {
                interval: 500
            }
        }
    };

    [
        'grunt-shell',
        'grunt-contrib-clean',
        'grunt-contrib-copy',
        'grunt-contrib-uglify',
        'grunt-contrib-cssmin',
        'grunt-contrib-less',
        'grunt-contrib-watch'
    ].forEach(function(name) {
        grunt.loadNpmTasks(name);
    });

    [
        ['task:gitadd', ['shell:gitadd']],
        ['task:clean:build', ['clean:build']],
        ['task:copy', ['copy']],
        ['task:watch', ['watch']],
        ['task:uglify', ['uglify']],
        ['task:css', ['cssmin:css']],
        ['task:fonts', ['cssmin:fonts']],
        ['task:copy', ['copy']],
        ['task:less', ['less:main']],
        ['basic', [
            'task:clean:build',
            'task:copy',
            'task:uglify',
            'task:less',
            'task:css',
            'task:fonts',
            'task:gitadd'
        ]],
        ['default', [
            'basic',
            'task:watch'
        ]]
    ].forEach(function(input) {
        grunt.registerTask(input[0], input[1]);
    });

    grunt.initConfig(gruntConfig);

};
