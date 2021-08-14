## fis3 配置

### 项目配置

```
const fis = require('fis3');
//设置命名空间
fis.set('namespace','home');
var DEFAULT_SETTINGS = {
	project:{
		//产出文件的字符集
		charset:'utf8',
		//文件MD5长度
		md5Length:7,
		//MD5和文件的连接符
		md5Connector:'_',
		//项目源码文件过滤器
		files:['**'],
		//忽略文件
		ignore:['node_modules/**','output/**','.git/**','.idea/**','.svn/**','fis-conf.js'],
		//追加文本文件后缀
		fileType:{
			text:'tpl,js,css',
			image:'swf'
		}
	},
}
```

### 文件相应配置

```
//基础属性
fis.match('',{
	//文件的产出路径，默认是文件相对项目根目录的路径
	release:'static/${namespace}/$0',
	//合并文件到这个分支
	packTo:'',
	//控制合并顺序，值越小越前面
	packOrder:-100,
	//指定文件资源定位路径之后的query
	query:'?t=' + new Date(),
	//文件的资源id 默认为namespace + subpath
	id:'XXX',
	//指定文件资源的模块id
	moduleId:'',
	//指定文件的资源定位路径，默认是 release 的值，url可以与发布路径 release 不一致。
	url:'',
	//指定输出文件的字符编码默认是utf8
	charset:'utf8',
	//指定对文件进行html相关语言能力处理
	isHtmlLike:true,
	//指定对文件进行css相关语言能力处理
	isCssLike:false,
	//指定对文件进行js相关语言能力处理
	isJsLike:false,
	//文件是否携带md5
	useHash:true,
	//给文件URL设置domain信息
	domain:'',
	//设置最终文件产出的后缀
	rExt:'',
	//文件信息是否添加到map.json
	useMap:true,
	//是否为组件化文件
	isMod:'',
	//在[静态资源映射表][]中的附加数据，用于扩展[静态资源映射表][]表的功能
	extras:{
		isPage:true
	},
	//默认依赖的资源id表
	requires:['',''],
	//开启同名依赖
	useSameNameRequire:true,
	//文件是否使用编译缓存
	useCache:false
});
```

### 插件配置

```
//插件属性
fis.match('',{
	//启动lint插件进行代码检查
	lint:fis.plugin('js',{}),
	//标准化前处理
	preprocessor:fis.plugin('image-set'),
	//标准化后处理
	postprocessor:fis.plugin('require-async'),
});
//html压缩
fis.match("*.html",{
	/*
	* html 中 增加对 underscore 模板语言的支持
	* <%var menu =1%>
	* <li><a href="1.html" class="<%if(menu==1){%>active<%}%>">数据量级监控</a></li>
	**/
	postprocessor:fis.plugin('template');
    optimizer : fis.plugin("minifier",{
		//是否移除页面注释
		removeComments:true,
		//移出空格、回车、换行符
		collapseWhitespace“:true,
		//压缩页面内嵌的js代码
		minifyJS:true,
		//忽略匹配的内容
		ignoreCustomFragments:[/<?[\s\S]*??>/]
	});
});
//启用parser插件对文件进行处理 less使用fis-parser-less sass使用fis-parser-node-sass
fis.match('*.less',{
	parser:fis.plugin('less'),
	//parser:fis.plugin('node-sass'),
});
//优化处理插件
fis.match('*.css}',{
	optimizer:fis.plugin('clean-css'),
});
//打包处理插件
fis.match('::package',{
	prepackager:fis.plugin('plugin-name'),
	packager: fis.plugin('map'),
	postpackager:fis.plugin('plugin-name'),
	//打包后处理csssprite的插件
    spriter: fis.plugin('csssprites')
});
//deploy
fis.match('**', {
	deploy: fis.plugin('http-push', {
		receiver: 'http://target-host/receiver.php', // 接收端
		to: '/home/work/www' // 将部署到服务器的这个目录下
	})
});
```

ps:

- fis3 默认不指定 js 模块化的类别，所以当使用模块化开发时,使用 fis.hook 方法，如果不指定，直观的展现是你所写的 js 没有被自动包裹，即使你在配置里面已经设置了 isMod:true。
- html 里可以使用 underscore 的方法

```
	 html 中 增加对 underscore 模板语言的支持
	 <%var menu =1%>
	<li><a href="1.html" class="<%if(menu==1){%>active<%}%>"
        >数据量级监控</a></li>
```
