module.exports = function(grunt) {

	grunt.initConfig({
		watch:{
			jade:{
				files:['views/**'],
				options:{
					livereload:true
				}
			},
			js:{
				files:['public/js/**','models/**/*.js','schemas/**/*.js'],
				//tasks:['jshint'],
				options:{
					livereload:true
				}
			}
		},

		nodemon:{
			dev:{
				options:{
					file:'app.js',
					args:[],
					ignoredFiles:['README.md','node_modules/**','.DS_Store'],
					watchedExtensions:['js'],
					watchedFolders:['./'],
					debug:true,
					delayTime:1,
					env:{
						PORT:3000
					},
					cwd:__dirname	
				}
			}
		},

		mochaTest:{
			options:{
				reporter:'spec'
			},
			src:['test/**/*.js']
		},

		concurrent:{
			tasks:['nodemon','watch'],
			options:{
				logConcurrentOutput:true
			}
		},
	})

	grunt.loadNpmTasks('grunt-contrib-watch') 	//文件添加、修改、删除会重新执行添加的任务
	grunt.loadNpmTasks('grunt-nodemon')			//实时监听app.js,改动后会自动重启app.js
	grunt.loadNpmTasks('grunt-concurrent')		//"慢任务-sass/less/coffee的编辑"优化构建时间,可以跑多个阻塞的任务
	grunt.loadNpmTasks('grunt-mocha-test')		

	grunt.option('force',true)		//防止因为grunt的错误而终止grunt的整个服务
	grunt.registerTask('default',['concurrent'])

	grunt.registerTask('test',['mochaTest'])
}
