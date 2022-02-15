# 缓存
缓存是一种保存资源副本并在下次请求直接返回的技术。当web缓存发现了请求的资源已经被缓存，他会拦截请求，并且直接返回资源的副本。

## 使用缓存的优点：
1. 减少网络流量
2. 减少延迟
   
## 缓存的种类：
### 1.浏览器缓存（私有缓存）
私有缓存只能应用于个人用户，比如浏览器的缓存
### 2.代理缓存（共享缓存）
共享缓存可以被多个用户使用，比如所在的公司会给你构建一个web代理作为本地网络基础的一部分提供给用户使用。这样热门的资源就会被缓存下来，减少网络的资源拥堵。

## Pragma
是`HTTP/1.0`标注中定义的一个header属性。请求中带有pragma属性的效果跟`Cache-Control:no-cache`相同，但是HTTP 响应头没有明确定义这个属性。所以不能代替`HTTP/1.1`中`Cache-Control`字段。它被用作向后兼容来使用的。

## Cache-Control
### 1.可缓存性
name|描述 
-|-
no-store|不使用缓存，每次请求都去服务端获取完整的响应体
no-cache|使用缓存版本之前，强制去请求服务端验证缓存新鲜度(协商缓存)
public|共享资源缓存，响应可以被任何节点缓存
private|该资源只可以被个人缓存，中间节点不可以缓存，代理服务器不可缓存，终端浏览器可以缓存

### 2.过期
name|描述 
-|-
max-age=seconds|设置缓存的最大储存周期，超过这个时间认定为过期，单位s，是一个相对的时间
s-maxage=seconds|设置共享缓存的最大储存周期，私有缓存无效
max-stale=seconds|表示客户端愿意接收一个已经过期的资源。响应不能已经过时超过该给定的时间
min-fresh=seconds|表示客户端希望获取一个指定的描述内保持其最新状态的响应

#### max-age vs max-stale?
`max-age`请求指令表示客户端不愿意接受age大于指定描述的响应，除非`max-stale`也存在。

`max-stale`请求指令表示客户端愿意接收超过指定新鲜度的响应。但不能超过`max-stale`指定的秒数。

### 3.重新验证和重新加载
name|描述 
-|-
must-revalidate|一旦资源过期（比如超过了max-age指定的时间），在请求服务器验证之前，缓存是不可用的
proxy-revalidate|作用与 must-revalidate相同，仅适用于共享缓存

### Cache-Control请求和响应字段对比
name|请求头|响应头
-|:-:|:-:
no-cache| √ | √
no-store| √ | √
max-age| √ | √
max-stale| √ | x
min-fresh| √ | x
s-maxage| x | √
public| x | √
private| x | √
must-revalidate|x|√



## 参考文档：
https://docs.microsoft.com/en-us/dotnet/framework/network-programming/cache-policy-interaction-maximum-age-and-maximum-staleness?redirectedfrom=MSDN