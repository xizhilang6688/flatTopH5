module.exports = function(grunt) {
	'use strict';
  
  var path = require('path'),
      fs = require('fs'),
      nfIndex = 0,
      nflagMap = ['','a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
   
	// Project configuration.
	grunt.initConfig({

		// Task configuration.
		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			gruntfile: {
				src: 'Gruntfile.js'
			},
			build: {
				src: 'js/*.js'
			}
		},

		concat: {
			css: {
				src: [
					'css/bear.css',
					'css/valley.css',
					'css/seed.css',
					'css/snake.css',
					'css/thunder.css',
					'css/boating.css',
					'css/chef.css',
					'css/lowPhone.css',
					'css/result.css'
				],
				dest: 'dest/main.css'
			},
			bootcss: {
				src: [
					'css/style.css',
					'css/loading.css'
				],
				dest: 'dest/boot.css'
			},
			libjs : {
				options: {
					separator: ';'
				},
				src: [
					'../lib/zepto/1.1.6/zepto.js',
					'../lib/zepto/1.1.6/event.js',
					'../lib/zepto/1.1.6/ajax.js',
					'../lib/zepto/1.1.6/detect.js',
					'../lib/zepto/1.1.6/data.js',
					'../lib/zepto/1.1.6/touch.js',
					'../lib/txtpl/1.1/txtpl.js'
				],
				dest: 'dest/lib.js'
			},
			mainjs: {
				options: {
					separator: ';'
				},
				src: [
					'js/answer.js',
					'js/result.js'
				],
				dest: 'dest/main.js'
			}
		},

		cssmin: {
			options: {
				keepSpecialComments: 0
			},
			compress: {
				files: {
					'dest/main.min.css': 'dest/main.css',
					'dest/boot.min.css': 'dest/boot.css'
				}
			}
		},

		uglify: {
			js: {
				files: {
					'dest/lib.min.js': 'dest/lib.js',
					'dest/main.min.js': 'dest/main.js',
					'dest/style.min.js': 'dest/style.js',
					'dest/loader.min.js': '../lib/loader/loader.js'
				}
			}
		},

		clean: {
			temporary: ['dest/main.css', 'dest/main.min.css', 'dest/boot.css'],
			release: ['dest/style.min_*.js', 'dest/lib.min_*.js', 'dest/main.min_*.js']
		},

    http: {
      upload: {
        options: {
          headers: {
            'Cookie':'PAS_COOKIE_TICKET=b5b534b20929a503; PAS_COOKIE_USER=dazhao; PAS_COOKIE_PROJECT_AUTO=%u5185%u5BB9%u7BA1%u7406%u7CFB%u7EDF-%u817E%u8BAF%u89C6%u9891%7Chttp%3A//wizard2.webdev.com/tcms/%7Cv; PAS_COOKIE_PROJECT_GROUP=|fansbar_admin::|TCMS:v:|utopia_admin::|; sitename=v; PAS_COOKIE_SITENAME=v'
          },
          url: 'http://wizard2.webdev.com/cgi-bin/material/material_add',
          //url: 'http://127.0.0.1/nodetest/uptest.php',
          method: 'POST',
          form: function (form) {
            var upfile = grunt.config('upfile'),
                filename = grunt.config('filename'),
                dir = grunt.config('dir'),
                newname = grunt.config('newname') || ''

            form.append('upfile', fs.createReadStream(path.join(__dirname, upfile)));

            form.append('filename',filename)
            form.append('newname', newname)
            form.append('addmat', '1')
            form.append('overwrite', '1')//1不覆盖 0覆盖
            form.append('watermark', '0')
            form.append('defaultwater', '0')
            form.append('path',dir)
            form.append('url', 'http://wizard2.webdev.com/cgi-bin/material/material_list?dir='+dir)
          },
          callback:function(err,res,body){
            var str = body,
                filename = grunt.config('filename'),
                newname = grunt.config('newname'),
                dir = grunt.config('dir')
                
            if(str.indexOf('displayInfoByKey(0)') != -1) { // displayInfoByKey(0) 获取文件失败
              grunt.log.writeln('[上传失败] 获取文件失败!');
            }else if(str.indexOf('displayInfoByKey(1)') != -1) {
              grunt.log.writeln('[上传失败] 不能在根目录下传文件!');
            }else if(str.indexOf('displayInfoByKey(2)') != -1) { // displayInfoByKey(2) 存在同名文件
              //console.log('  [上传失败] 存在同名文件!');
              nfIndex++
              if(nfIndex >= nflagMap.length ){
                grunt.log.writeln('重命名太多次了，手动上传吧')
              }else{
                 grunt.task.run('rename:'+filename)
                 grunt.task.run('http:upload')
              }
            }else if(str.indexOf('displayInfoByKey(3)') != -1) {
              grunt.log.writeln('[上传失败] 上传文件失败，保存文件失败!')
            }else if(str.indexOf('displayInfoByKey(4)') != -1) {
              grunt.log.writeln('[上传失败] 上传文件到远端服务器失败!')
            }else if(str.indexOf('displayInfoByKey(5)') != -1) {
              grunt.log.writeln('[上传失败] 文件大于5M,请使用ftp上传!')
            }else if(str.indexOf('displaySucc') != -1 ){
                grunt.log.writeln('[上传成功] 使用以下地址引用:')
                grunt.log.writeln('http://mat1.gtimg.com/v/'+dir+newname)
            }else {
                grunt.log.writeln('未知情况')
            }
          }
        }
      }
    }
		
	})

	grunt.task.registerTask('cssToJs', 'cssToJs stuff.', function() {

		var cssStr = grunt.file.read('dest/main.min.css').replace(/\\/g, '\\\\').replace(/"/g, '\\"')
		var styleJsStr = 'loader.renderCss("' + cssStr + '")'
		grunt.file.write('dest/style.js', styleJsStr)
	});

	grunt.task.registerTask('jsToDefine', 'jsToDefine stuff.', function() {

		var jsStr = 'define("lib",function(){(function(){' + grunt.file.read('dest/lib.js')  + '})()})'
		grunt.file.write('dest/lib.js', jsStr)
		grunt.log.writeln('dest/lib.js add `define("lib",function(){})`')

		jsStr = 'define("main",function(){(function(){' + grunt.file.read('dest/main.js')  + '})()})'
		grunt.file.write('dest/main.js', jsStr)
		grunt.log.writeln('dest/main.js add `define("main",function(){})`')

		jsStr = 'define("style",function(){(function(){' + grunt.file.read('dest/style.js')  + '})()})'
		grunt.file.write('dest/style.js', jsStr)
		grunt.log.writeln('dest/style.js add `define("style",function(){})`')
	});

	grunt.task.registerTask('jsWithVersion', 'jsWithVersion ', function() {
		var data = new Date(),
			y = data.getFullYear().toString().slice(-2),
			m = (data.getMonth() + 1).toString(),
			d = data.getDate().toString(),
			version

			m = m.length === 2 ? m : '0' + m
			d = d.length === 2 ? d : '0' + d
			version = y + m + d

			grunt.file.copy('dest/lib.min.js', 'dest/lib.min_' + version + '.js')
			grunt.log.writeln('dest/lib.min_' + version + '.js created')

			grunt.file.copy('dest/main.min.js', 'dest/main.min_' + version + '.js')
			grunt.log.writeln('dest/main.min_' + version + '.js created')

			grunt.file.copy('dest/style.min.js', 'dest/style.min_' + version + '.js')
			grunt.log.writeln('dest/style.min_' + version + '.js created')			
	});
  
                
  grunt.task.registerTask('rename', 'rename task', function(fname) {
    var ext = path.extname(fname),
        basename = path.basename(fname, ext),
        nameFlag,
        newname = '',
        date = new Date(),
        y = date.getFullYear().toString().slice(-2),
        m = (date.getMonth() + 1).toString(),
        d = date.getDate().toString(),
        version

    m = m.length === 2 ? m : '0' + m
    d = d.length === 2 ? d : '0' + d
    version = y + m + d
     
    nameFlag = nflagMap[nfIndex]
    newname = basename+'_'+version+nameFlag+ext;    
    grunt.config('newname',newname)
  });
  
  /**
    * 关于上传
    * 使用前提:
    * 必须安装grunt-http插件才能使用,
    * 插件版本号已提交package.json,
    * 若外网无法安装可在外网装好再把grunt-http模块拷到node_modules下
    *
    * 使用命令(grunt命令之后使用，能自动重命名)：
    * 上传css: grunt upstyle
    * 上传main.js：grunt upmain
    * 上传lib.js: grunt uplib
    */
  grunt.task.registerTask('upstyle', 'upload css file task.', function() {
    
    grunt.config('upfile','dest/style.min.js')
    grunt.config('filename','style.min.js')
    grunt.config('dir','h5/webapp/flatTop/dest/')
    
    nfIndex = 0
    grunt.task.run('rename:style.min.js')
    grunt.task.run('http:upload')
	});
  
  grunt.task.registerTask('upmain', 'upload js file task.', function() {
    grunt.config('upfile','dest/main.min.js')
    grunt.config('filename','main.min.js')
    grunt.config('dir','h5/webapp/flatTop/dest/')
    
    nfIndex = 0
    grunt.task.run('rename:main.min.js')
    grunt.task.run('http:upload')
	});
  
  grunt.task.registerTask('uplib', 'upload libjs file task.', function() {
    grunt.config('upfile','dest/lib.min.js')
    grunt.config('filename','lib.min.js')
    grunt.config('dir','h5/webapp/flatTop/dest/')
    
    nfIndex = 0
    grunt.task.run('rename:lib.min.js')
    grunt.task.run('http:upload')
	});
  
	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-concat')
	grunt.loadNpmTasks('grunt-contrib-jshint')
	grunt.loadNpmTasks('grunt-contrib-uglify')
	grunt.loadNpmTasks('grunt-contrib-cssmin')
	grunt.loadNpmTasks('grunt-contrib-clean')
  grunt.loadNpmTasks('grunt-http')


	// Default task.
	grunt.registerTask(
		'default', 
		[
		'clean:release',
		'jshint', 
		'concat:css',
		'concat:bootcss',
		'cssmin', 
		'cssToJs', 
		'concat:libjs',
		'concat:mainjs',
		'jsToDefine',
		'uglify',
		'jsWithVersion',
		'clean:temporary'
	])

	// Clean release file task.
	grunt.registerTask('cleanrelease', ['clean:release'])

	// // Test task.
	grunt.registerTask('test', ['jshint'])
	//grunt.task.run('log')



}
