/**
* Created by yexiang on 2015/6/1.
*/
//此处变量自行填写
var project = 'hybrid-rebate-wap';
var hybrid_project = 'hybrid-rebate';
var module = 'unit-b5m-rebate';
var version = '0.0.1';


var path = require('path');


/****************环境变量*****************/
fis
// 排除指定目录
.set('project.ignore', ['node_modules/**', '.gitignore', '**/**.scss'])
// 把scss映射为css
.set('project.ext', {
	scss : 'css'
})
.set('project',project)
.set('hybrid_project',hybrid_project)
.set('version', version)
.set('module',module)
.set('project_path',path.join('..','..'));

var pad = function(n, c) {
	if ((n = n + "").length < c) {
		return new Array(++c - n.length).join("0") + n;
	} else {
		return n;
	}
};
var now = new Date();
var tArray = [
	now.getFullYear(),
	pad(now.getMonth() + 1, 2),
	pad(now.getDate(), 2),
	pad(now.getHours(), 2),
	pad(now.getMinutes(), 2)
];
fis.set('timestamp', tArray.join(''));

//插件引用写在here
var plugins = {
	//自定义的deployZip插件
	fisDeployZip:require(fis.get('project_path')+'/base/fis/fisDeployZip'),
	//因fis3-deploy-zip无法定制zip内目录，故编写插件对其进行预处理，配合其一起使用
	zipConstructSet:require(fis.get('project_path')+'/base/fis/zipConstructSet')
};
// 有限制使用本地自定义插件~~
var plugin = function(name, options) {
	var localPlugin = plugins[name];
	if (typeof localPlugin === 'function') {
		localPlugin.options = options;
		return localPlugin;
	} else {
		return fis.plugin.apply(fis, arguments);
	}
};

fis
.match('*.{html,scss,map}',{
	useCompile:false
})
.match('*.{css,scss}',{
	release:false
})
.match(/\/js\//i,{
	release:false
})
.match(/\/css\//i,{
	release:false
})
.match(/\/entry\//i,{
	release:false
})
.match(/\/img\//i,{
	release:false
})
.match(/package.json/,{
	release:false
})
.match(/webpack.config.js/,{
	release:false
})
.match(/pack.js/,{
	release:false
});

/****************push to dist or online*****************/
fis.media('dist')
.match('*',{
	deploy: [
		fis.plugin('replace',{
			from : '__host',
			to:'b5m'
		}),
		fis.plugin('local-deliver', {
			to: path.join('..','..','/dist/',project)
		})
	]
});

/****************push to ios project*****************/
fis.media('toIos')
.match('*',{
	deploy:[
		fis.plugin('replace',{
			from : '__host',
			to:'stage'
		}),
		fis.plugin('local-deliver',{
			to: "../../../../ios-workspace/comb5mios/B5M/bang5mai/Resources/hybird/packages/" + module + "/" + version + "/" + module + "/0.0.2",
			subOnly: true
		})
	]
});

/****************push to stage*****************/
fis.media('stage')
.match('*',{
	deploy: [
		fis.plugin('replace',{
			from : '__host',
			to:'stage'
		}),
		fis.plugin('http-push', {
			receiver: 'http://172.16.11.16:8246/receiver.php',
			to: '/opt/cdn-image/upload/static-web/' + project
		})
	]
});

/****************push to stages*****************/
fis.media('stages')
.match('*',{
	deploy: [
		fis.plugin('replace',{
			from : '__host',
			to:'stage'
		}),
		fis.plugin('http-push', {
			receiver: 'http://172.16.111.110:8246/receiver.php',
			to: '/opt/cdn-image/upload/static-web/' + project
		})
	]
});

/****************push to prod*****************/
fis.media('prod')
.match('*',{
	deploy: [
		fis.plugin('replace',{
			from : '__host',
			to:'prod'
		}),
		fis.plugin('http-push', {
			receiver: 'http://10.30.99.122:8246/receiver.php',
			to: '/opt/webroot/static-web/' + project
		})
	]
});

var hostArr = ['dist','stage','prod','b5m'];
/****************push to android zip*****************/
for(var i=0;i<hostArr.length;i++){
	fis.media('toAndZip'+hostArr[i])
	.match('*',{
		deploy:[
			fis.plugin('replace',{
				from : '__host',
				to:hostArr[i]
			}),
			plugin('zipConstructSet',{
				construct:'/'+version + '/' + module + '/0.0.2'
			}),
			fis.plugin('b5m_zip',{
				filename: hybrid_project+'/zip/'+hostArr[i]+'/android/' + version + '.zip',
			}),
			// fis.plugin('local-deliver',{
			// 	to: path.join('..',hybrid_project)
			// }),
		],
	});
}
/****************push to ios zip*****************/
for(var i=0;i<hostArr.length;i++){
	fis.media('toIosZip'+hostArr[i])
	.match('*',{
		deploy:[
			fis.plugin('replace',{
				from : '__host',
				to:hostArr[i]
			}),
			plugin('zipConstructSet',{
				construct:'/'+version + '/' + module + '/0.0.2'
			}),
			fis.plugin('b5m_zip',{
				filename: hybrid_project+'/zip/'+hostArr[i]+'/ios/' + version + '.zip',
			}),
			// fis.plugin('local-deliver',{
			// 	to: path.join('..',hybrid_project)
			// }),
		],
	});
}
/****************push to wap file *****************/
for(var i=0;i<hostArr.length;i++){
	fis.media('toWapStatic')
	.match('*',{
		deploy:[
			fis.plugin('replace',{
				from : '__host',
				to:hostArr[i]
			}),
			// plugin('zipConstructSet',{
			// 	construct:'/'+version + '/' + module + '/0.0.2'
			// }),
			fis.plugin('local-deliver',{
				to: path.join('..',hybrid_project,'wap')
			}),
		],
	});
}

/************* fis2使用，已经遗弃，使用fis3-deploy-zip **************/
// //压缩包并放入zip目录中 ----->for  hibrid
// fis.config.set('modules.deploy', ['default', 'zip'])
// fis.config.set('settings.deploy.zip', {
// 	toAndZip: {
// 		from: '/',
// 		to: version + '/' + module + '/0.0.2/',
// 		file: 'zip/android/' + module + '/' + version + '.zip',
// 		subOnly: true
// 	},
// 	toIosZip: {
// 		from: '/',
// 		to: version + '/' + module + '/0.0.2/',
// 		file: '../' + hybrid_project + '/zip/ios/' + module + '/' + version + '.zip',
// 		subOnly: true
// 	},
// 	debug: {
// 		from: '/' + module + '/' + 'source/',
// 		to: version + '/' + module + '/0.0.2/',
// 		file: '../' + hybrid_project + '/zip/android/' + module + '/' + version + '.zip',
// 		subOnly: true
// 	}
// });
