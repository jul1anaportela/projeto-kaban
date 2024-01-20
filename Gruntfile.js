module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        // configuração do plugin Less
        less: {
            development: { //ambiente de desenvolvimento
                files: {
                    //'destino': 'origem'
                    'dev/styles/main.css': 'src/styles/main.less'
                }
            },
            production: { //ambiente de produção
                options: {
                    compress: true,
                },
                files: {
                    //'destino' : 'origem'
                    'dist/styles/main.min.css': 'src/styles/main.less'
                }
            }
        },

        //configuração do plugin Watch
        watch: {
            less: {
                // dois asteriscos significa qualquer pasta dentro de styles
                // um asterisco significa qualquer arquivo e depois coloca a extensão ou não
                files: ['src/styles/**/*.less'],
                tasks: ['less:development']
            },
            html: {
                files: ['src/index.html'],
                tasks: ['replace:dev']
            }
        },

        //configuração do plugin Replace (ambiente de desenvolvimento)
        replace: {
            dev: {
                options: {
                    patterns: [
                        {
                            match: 'ENDERECO_DO_CSS',
                            replacement: './styles/main.css'
                        },
                        {
                            match: 'ENDERECO_DO_JS',
                            replacement: '../src/scripts/main.js'
                        }
                    ]
                }, 
                files: [
                    {
                        expand: true,
                        flatten: true,
                        src: ['src/index.html'],
                        dest: 'dev/'
                    }
                ]
            },
            dist: {
                options: {
                    patterns: [
                        {
                            match: 'ENDERECO_DO_CSS',
                            replacement: './styles/main.min.css'
                        },
                        {
                            match: 'ENDERECO_DO_JS',
                            replacement: './scripts/main.min.js'
                        }
                    ]
                }, 
                files: [
                    {
                        expand: true,
                        flatten: true,
                        src: ['prebuild/index.html'],
                        dest: 'dist/'
                    }
                ]
            }
        },

        //configuração do plugin htmlmin (ambiente de produção)
        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {
                    //'destino': 'origem'
                    'prebuild/index.html': 'src/index.html'
                }
            }
        },

        //configuração do plugin clean
        clean: ['prebuild'],

        //configuração do plugin uglify
        uglify: {
            target: {
                files: {
                    //'destino': 'origem'
                    'dist/scripts/main.min.js': 'src/scripts/main.js'
                }
            }
        }
    })

    //carregamento do plugin Less
    grunt.loadNpmTasks('grunt-contrib-less');
    //carregamento do plugin watch
    grunt.loadNpmTasks('grunt-contrib-watch');
    //carregamento do plugin Replace
    grunt.loadNpmTasks('grunt-replace');
    //carregamento do plugin HTMLmin
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    //carregamento do plugin clean
    grunt.loadNpmTasks('grunt-contrib-clean');
    //carregamento do plugin uglify
    grunt.loadNpmTasks('grunt-contrib-uglify');


    grunt.registerTask('default', ['watch']);
    grunt.registerTask('build', ['less:production', 'htmlmin:dist', 'replace:dist', 'clean', 'uglify']);
}