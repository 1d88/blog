# webpack问题

>使用中遇到的问题

### 命令行报错：

```
    ERROR ： Usage：‘XXX/XXX/XXXX/webpack.js’ branch releaseVersion
```

* 1、开始猜测是nodejs的版本问题，重装之后无效；
* 2、后来认为是webpack的版本问题，因为有个报错，fsevent nosupport所以重新安装了webpack，其实这个err在window下没有关系，fsevent是应用在mac机子上；
* 3、进行百度，谷歌丝毫查找不到线索，开始怀疑是不是自己代码的问题；
* 4、开始怀疑是不是自己的webpack.config.js有问题，果然，出问题的是我引用了jquery里面的资源，习惯性的引用dist里面release版本，其实这个不是，造成的错误。


### 关于babel的使用
* 1、使用babel，如果只是解析es6的话，安装的插件为babel-core，babel-loader，babel-preset-es2015,少安装的话会报babel的错误。
* 2、query 参数配置 es2015