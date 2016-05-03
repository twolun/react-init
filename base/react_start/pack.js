var exec = require('child_process').exec;

var readline = require('readline');
var fs = require('fs');
var path = require("path");
var stat = fs.stat;

//命令行
var rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

var hostArr = ['dist', 'stage', 'prod', 'b5m'];
// rl.question("What is your project name ~~~ ", function(project) {
rl.question("ios or and ~~~ ", function(os) {

	if (os == 'wap' || os == 'Wap') {
		os = 'Wap';
		type = 'Static';
	} else if (os == 'ios' || os == 'Ios') {
		os = 'Ios';
		type = 'Zip';
	} else if (os == 'and' || os == 'And') {
		os = 'And';
		type = 'Zip';
	} else {
		console.log('invalid os');
		return;
	}
	console.log('exec start');
	//打包4个环境的包
	if (os == 'Wap') {
		exec('fis3 release to' + os + type, function(error, stdout, stderr) {
			console.log(error);
			console.log(stdout);
			console.log(stderr);
		})
	} else {
		for (var i = 0; i < hostArr.length; i++) {
			exec('fis3 release to' + os + type + hostArr[i], function(error, stdout, stderr) {
				console.log(error);
				console.log(stdout);
				console.log(stderr);
			})
		}
	}
	rl.close();
});
// rl.close();
// });
