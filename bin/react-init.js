#!/usr/bin/env node
var fs = require('fs');
var path = require('path');
var process = require('process');


function walk(path, handleFile) {  
    fs.readdir(path, function(err, files) {  
        if (err) {  
            console.log('read dir error');  
        } else {  
            files.forEach(function(item) {  
                var tmpPath = path + '/' + item;  
                fs.stat(tmpPath, function(err1, stats) {  
                    if (err1) {  
                        console.log('stat error');  
                    } else {  
                        if (stats.isDirectory()) {  
                        	// var tempDistDir = tmpPath.replace('base/react_start', 'public/' + process.argv[2]);
                        	var tempDistDir = tmpPath.replace(/base\/react_start/, 'public\/' + process.argv[2] );
                        	fs.mkdirSync(tempDistDir);

                            walk(tmpPath, handleFile);  
                        } else {  
                            handleFile(tmpPath);  
                        }  
                    }  
                })  
            });  
  
        }  
    });  
}

function handleFile(file){
	//读取文件，并写入到新创建的目录
	var distFile = file.replace(/base\/react_start/, 'public\/' + process.argv[2]);
	fs.readFile(file, function(err, data){
		if(err) throw err;

		//读取成功，进行写操作
		fs.writeFile(distFile, data, function(err){
			if(err) throw err;

		})
	});
}

var distDir = path.join(process.cwd(), '/public');
//定位到目标文件夹目录
var srcDir = path.join(process.cwd(), './base/react_start');

//如果要创建的目录不存在，则创建，否则退出进程
if(!process.argv[2]){
	console.log('Input your project name, please!');
	process.exit(1);
}
fs.exists(distDir, function(exists){
	if(!exists){
		//如果不存在，则继续执行
		fs.mkdirSync(distDir);
	}
	var tempDir = path.join(distDir, '/', process.argv[2]);
	fs.exists(tempDir, function(exists){
		if(exists){
			console.log(tempDir+ ' has exists!');
			process.exit(1);
		}
		fs.mkdir(path.join(tempDir));

		//这里递归读取文件夹
		walk(srcDir, handleFile);
	})

});




