# 深入浅出 nodejs 读书笔记

## 特点以及应用场景

## 非阻塞 IO 的实现原理

## event loop 各阶段任务划分

## 内存

- 内存的限制
  - 默认情况下 32 位机子 700MB，64 位机子 1.4GB；运行 node 时，可以通过配置 `--max-old-space-size=`单位位 MB，通过`--max-new-space-size=`单位为 KB,来设置内存的大小。
- 垃圾回收机制
  - V8 的内存分代：新生代（存活时间较短的对象）和老生代（存活时间脚长或者常驻的对象）；`--max-old-space-size=`设置老生代内存空间最大值，`--max-new-space-size=`设置新生代内存最大值，不支持自动扩充；
  - 新生代使用 Scavenge 算法。分为 from 和 to 空间，在 from 分配对象，回收时复制 from 空间的活动对象到 to 空间，释放非活动对象占用的空间。最后对换 from 和 to 空间。当一个对象多次复制仍然存活，将被认为生命周期较长的对象，被移动到老生代中，这种移动的过程成为晋升
  - 晋升的条件：1、是否经历过 Scavenge 回收；2、To 空间的内存占比超过 25%
  - 老生代使用 Mark-Sweep & Mark-Compact 相结合的方式。Mark-sweep 分为标记和清楚两个阶段。Mark-sweep 遍历堆中所有的对象，并标记活着的对象；在随后的清楚阶段，只清除没有标记的对象。
  - Mark-sweep 清除的是老生代中的死对象，死对象在老生代只占较小部分；scavenge 复制的是新生代中的活动的对象，这是两种方式高效的原因
  - Mark-sweep 最大的问题是标记清楚之后，内存不连续的问题
  - 解决 Mark-sweep 碎片化的问题，提出了 Mark-Compact(标记整理)；相对于 Mark-sweep，在清理死对象时，会将活动的对象向前移动（整理内存）；V8 主要使用 Mark-sweep，在空间不足时对新晋升过来的对象分配使用 Mark-Compact
  - 3 种垃圾回收算法简单对比
    |回收算法|Mark-Sweep|Mark-Compact|Scavenge|
    --|:--:|:--:|--:
    速度|中等|最慢|最快
    空间开销|少（有碎片）|少（无碎片）|双倍空间（无碎片）
    是否移动对象|否|是|是
  - 以上三种垃圾回收的机制都需要应用逻辑暂停下来，等待执行完垃圾回收后再恢复执行应用逻辑，这种行为称为『全停顿』，新生代空间较少，一次垃圾回收影响不大；但对于老生代空间较大，全堆垃圾回收的标记、清理、整理造成的停顿比较可怕。
  - 使用 Incremental Marking，优化全堆回收带来的停顿时间；增量标记、延迟清理、增量整理
- 查看垃圾回收日志
  - 启动时添加--trace_gc
  - v8 提供了 linux-tick-processor 工具用于同记日志信息
- 高效的使用内存
  - 作用域：局部变量分配在函数作用上，函数执行结束后，随着作用域的销毁而销毁。
    - 与作用域相关的就是标识符的查找
    - 变量的主动释放，如果是存在全局变量上，只有退出进程时才会释放；可以通过 delete 操作删除引用关系，或者将变量重新赋值，让就对象脱离引用关系
  - 闭包：实现外部作用域访问内部作用域中的变量的方法叫做闭包，中间函数或者变量的应用得不到释放而常驻于内存之中
- 内存指标：查看内存的使用情况`process.memoryUsage()`、os 模块中的`totalmem()`、os 模块中的`freemen()`
  - rss 是进程的常驻内存部分，进程的内存一部分在 rss,其它部分在交换区(swap)或者文件系统(filesystem)中
  - heapTotal 是堆中总共申请的内存量
  - heapUsed 是目前堆中使用的内存量
  - `totalmem()`和`freemen()`两个方法查看操作系统中内存使用的情况，返回系统的闲置内存和总内存
  - 堆外内存：不是 v8 分配的内存，Buffer 对象不经过 v8 的内存分配机制，也不会有堆大小限制
- 内存泄露：应当被回收的对象没有被回收，晋升成了老生代中的对象
  - 几个原因：缓存、队列消费不及时、作用域未释放
  - 甚将内存当缓存，使用对象键值对来缓存数据，但并非真正意义上的缓存，因为没有完善的过期策略
  - 关注队列状态，业务场景如果消费者媛媛大约生产的速度，内存泄露不易产生，一旦消费速度低于生产速度，将会形成堆积,关注生产者和消费者队列的平衡
  - 大量的闭包使用造成作用域无法得到释放
- 内存泄露的排查：一些工具可以检查内存的泄露：v8-profiler、node-heapdump、node-memwatch 等
- 大内存应用：操作大文件的场景，stream 模块。
  - 由于 v8 的内存限制，我们无法使用`fs.readFile`或者`fs.writeFile`直接进行大文件的操作，改使用`fs.createReadStream`和`fs.createWriteStream`的方式通过流的方式实现对大文件的操作

## Buffer

- Buffer 结构：像 `Array`对象，主要用来操作字节
  - 模块结构：性能使用 C++实现、非性能使用 js 实现。属于堆外内存，使用 buffer 不需要 require，直接挂载在全局对象上
  - Buffer 不同编码的字符串占用的元素个数是不同的
  - Buffer 内存分配，buffer 的内存不在 v8 的堆内存中，而是 node 在 c++层面实现内存申请的。使用 slab 内存管理机制
    - slab 三种状态：full 完全分配状态，partial 部分分配状态，empty 没有被分配状态
    - 以 8kb 来区分 buffer 是大对象还是小对象。小对象方式主要使用一个局部变量 pool 作为中间处理对象，处于分配状态的 slab 单元都指向它,多次新建 buffer 对象都会指向这个 8kb 的 slab 单元，如果超过 8kb，那么会新建一个新的 slab 单元
    - 分配大的对象：如果超过 8KB，分配一个 SlowBuffer 对象作为 slab 单元
- Buffer 的转换:目前支持的字符集 ASCII、UTF8、UTF16、Base64、Binary、Hex
  - 字符串转 Buffer`new Buffer(str,[encoding])`
  - Buffer 转字符串`buf.toString([encoding],[start],[end])`
  - Buffer 不支持的编码类型：isEncoding()函数来判断编码是否支持转换；中国常用的 GBK、GB2312 都不支持，可以使用第三方库来实现转码。
- Buffer 的拼接：使用场景中，往往是一段一段传输的。

```js
var fs = require("fs");
var rs = fs.createReadStream("test.md");
var data = "";
rs.on("data", function(chunk) {
  data += chunk;
});
rs.on("end", function() {
  console.log(data);
});
```

`data+=chunk`隐藏了`toString()`操作

- 乱码是如何产生的？� 文件可读流在读取时会诸葛读取 buffer,如果`var rs = fs.createReadStream('test.md', {highWaterMark: 11});`限定了 Buffer 对象的长度为 11,因此需要读取多次才能完成完整的读取，中文字在 UTF8 占 3 个字节，所以字节不满足于字符的输出，所以第 4 个字段将展示为乱码。宽字节字符串都有被截断的情况，只不过 Buffer 长度越大概率越低。
- setEncoding() 和 string_decoder()
  - 可读流有一个设置编码的方法 setEncoding。作用为让`data`事件中的传递的不再是一个 Buffer 对象，而是编码后的字符串
  - setEncoding 会在`data`事件调用`decoder`对`Buffer`对象向`string`进行解码，不在接收原始的 Buffer 对象。`decoder`对象来自于`string_decoder`模块的`StringDecoder`对象实例
- 正确拼接 Buffer：使用数组来储存所有的`data`事件返回的数据片，调用`Buffer.concat()`方法生成一个合并的`Buffer`对象
- Buffer 与性能：在文件 I/O 和网络 I/O 运用广泛。通过预先转换静态内容为`Buffer`对象，可以减少 CPU 的重复使用，节省服务器资源。
  - Buffer 的使用与字符串的转换有性能损耗
  - 文件读取时，`highWaterMark`设置会对性能产生影响；`createReadStream()`工作方式会在内存准备一段 buffer,`read()`读取时逐步从磁盘将字节复制到 buffer 中。完成一次读取，就从这个 buffer 中通过`slice()`方法取出部分数据作为小的 buffer 对象通过`data`事件传递给回调。理想状态下，每次读取的长度为`highWaterMark`。`highWaterMark`设置过小，可能导致系统调用次数过多。该值越大读取速度越快，`highWaterMark`越大，越占用内存。

## 网络编程

- 构建 TCP 服务
  - TCP，传输控制协议。面向链接的协议，显著特征是传输之前需要 3 次握手形成会话，会话形成之后，服务器和客户点之间才能相互发送数据，创建会话中，服务端和客户端分别提供一个套接字，通过套接字实现链接操作。
  - OSI 模型：应用层、表示层、会话层、传输层、网络层、链路层、物理层
  - 创建 TCP 服务器
    ```js
    var net = require("net");
    var server = net.createServer(function(socket) {
      socket.on("data", function(data) {
        socket.write("hello");
      });
      socket.on("end", function() {
        socket.write("disconnect");
      });
      socket.write("hello world");
    });
    server.listen(8124, function() {
      console.log("server bound");
    });
    ```
  - TCP 服务的事件
    - 服务器事件，通过 net.createServer()创建的服务器而言，是 EventEmitter 的实例
      - listening,调用`server.listen()`时触发
      - connection,每个客户端链接到服务器端时触发
      - close,当服务器关闭时触发
      - error,当服务器发生异常时触发，比如监听一个使用中的接口。
    - 连接事件，服务器可以和多个客户端保持链接，每个连接都是可读写的 stream 对象，Stream 对象可以用户服务器和客户端之间的通信。
      - data,当一端调用`write()`发送数据时，另一端会触发`data`事件
      - end,当一段发送 FIN 数据时，表示数据发送完毕
      - connect,该事件用于客户端，和服务端链接成功时。
      - drain,当任意一方调用 write()发送数据时
      - error:发生异常时
      - close：套接字完全关闭时
      - timeout：一定时间后不再活跃，该事件触发
    - 优化网络默认使用 nagle 算法，使用`socket.setNoDelay(true)`去掉 Nagle 算法
- 构建 UDP 服务:用户数据包协议
- 构建 HTTP 服务
  - 创建 http 服务器
  ```js
  var http = require("http");
  http
    .createServer(function(req, res) {
      res.writeHead(200, { "Content-type": "text/plain" });
      res.end("hello world");
    })
    .listen(1337, "127.0.0.1");
  ```
  - http 协议
    - 超文本传输协议，两端分别是浏览器端和服务器端
    - 请求基于响应式，一问一答的方式实现服务
  - http 模块
    - http 服务继承于 TCP 服务器(net 模块),能够和多个客户端保持链接，事件驱动的形式并不为每个链接创建额外的线程或者进程，因此，保持很低的内存占用，能够实现高并发。
    - HTTP 服务和 TCP 服务服务模型有区别的地方是：在开启了 keeplive 后，一个 TCP 回话可以用于多次请求和响应。TCP 服务以 connection 为单位进行服务，HTTP 服务以 request 为单位服务。http 模块时将 connection 到 request 的过程进行了封装。
    - HTTP 抽象了链接时所用的套接字`ServerRequest`和`ServerResponse`对象，分别对应请求和响应的操作
    - HTTP 请求：对于 TCP 链接的读操作，HTTP 模块将其封装为`ServerRequest`对象
      - req.method:请求的方法
      - req.url：请求的 url
      - req.httpVersion：http 的版本
    - HTTP 响应：封装了底层连接的写操作，可以将其看成一个可写的流对象，它影响响应报文头部信息的 api 为`res.setHeader()`和`res.writeHead()`
      - `res.setHeader()`可以多次设置，但只有调用`res.writeHead()`报头才会写入连接中
      - `res.write()`,`֖res.end()`设置响应正文，一旦响应正文开始发送，`res.setHeader()`和`res.writeHead()`将不再生效
      - 无论服务端处理逻辑是否发生异常，均要使用`res.end()`结束请求，否则客户端将一直处于等待的状态
    - HTTP 服务的事件
      - connection:TCP 链接建立时，服务器触发一次 connection 事件
      - request：建立 TCP 链接之后，当请求数据发送到服务器端，在解析出 HTTP 请求头后，将触发此事件。
      - close:当已有的链接都断开时，触发该事件
      - checkContinue:某些客户端发送较大的数据时，并不会把数据直接发送，而是发送一个头带 Expect:100-Continue 的请求到服务器，服务器将会触发`checkContinue`事件；
      - connect:当客户端发起 connect 请求时触发，而发起 connect 请求通常在 HTTP 代理时出现，如果不监听该事件，发起该请求的链接将会关闭
      - upgrade：当客户端要求升级连接的协议时，需要和服务器端协商，客户端会在请求头带上 Upgrade 字段，服务器接到字段后触发 upgrade 事件
      - clientError:连接的客户端触发 error 事件时，这个错误会传递到服务器端，此时触发此事件
    - HTTP 客户端 `http.request(options,connect)`用于构建 HTTP 客户端
      - options 参数军定了 HTTP 请求头的内容
        - host:服务器的域名或 IP 地址，默认 localhost
        - hostname:服务器名称
        - port: 服务器端口，默认 80
        - localAddress：建立网络连接的本地网卡
        - socketPath:Domain 套接字路径
        - method:HTTP 请求方法，默认为 GET
        - path:请求路径，默认为/
        - headers: 请求头对象
        - auth:basic 认证，这个值将被计算成请求头中的 Authorization 部分
      - HTTP 响应
        - HTTP 客户端的响应对象与服务器端较为相似，在 ClientRequest 对象中，事件叫做 response,ClientRquest 在解析响应报文时，一解析完响应头就触发 response 事件，同时传递一个响应对象以供操作 ClientResponse。
      - HTTP 代理
        - HTTP 提供的 ClientRequest 对象也是基于 TCP 层实现的，在 keepalive 的情况下，一个底层会话连接可以多次用于请求，为了重用 TCP 连接，HTTP 模块包含一个默认的客户端代理对象 http.globalAgent。对于每个服务器端创建的连接进行了管理，默认情况下，通过 ClientRequest 对象对同一个服务器端发起的 HTTP 请求最多可以创建`5`个连接，它的实质是一个连接池。（调用 HTTP 客户端同时对一个服务器发起 10 次 HTTP 请求时，实质只有 5 个请求处于并发的状态，后续的请求需要等待某个请求完成服务后才真正发出）
        - 如果在服务端通过 ClientRequest 对象调用网络中的其他 HTTP 服务时，代理对象对网络请求有限制，可能会影响到服务性能；可以通过 agent 进行修改,如果设置为 false,那么请求不受并发限制。
        ```js
        var agent = new http.Agent({
          maxSockets: 10,
        });
        var options = {
          hostname: "127.0.0.1",
          port: 1334,
          path: "/",
          method: "GET",
          agent: agent,
        };
        ```
      - HTTP 客户端事件
        - response：请求发出在服务器响应时，触发该事件
        - socket:连接池中建立的链接分配给当前请求对象时，触发该事件
        - connect: 客户端向服务器发起 connect 请求时，如果服务器响应了 200，客户端触发该事件
        - upgrade：服务端响应了 101 Switching Protocols 状态，客户端触发该事件
        - continue:客户端向服务端发起 Expect：100-continue 头信息，以试图发送较大数据量，如果服务端响应 100 Continue 状态，客户端将触发该事件。

* 构建 WebSocket 服务

  - WebSocket 实现了客户端和服务器之间的长链接，Node 事件驱动擅长和大量的客户端保持链接
  - 使用 ws ,客户端和服务端只建立一个 TCP 链接；服务端可以推送到客户端，比 HTTP 更加灵活；有更轻量的协议头，减少数据传输量。

  ```js
  var socket = new WebSocket("ws://127.0.0.1:12100/updates");
  socket.onopen = function() {
    serInterval(() => {
      if (socket.bufferedAmount === 0) {
        socket.send();
      }
    }, 50);
  };
  socket.onmessage = function() {};
  ```

  - ws 握手，客户端建立链接时，使用 HTTP 发起请求报文，协议头中包含
    ```
      Upgrade: webSocket
      Connection: Upgrade
    ```
    表示客户端请求服务器升级协议。其中`Sec-WebSocket-Key`用户安全校验；`Sec-WebSocket-Key`随机生成的 base64 编码的字符串；
  - ws 数据传输
    - 在握手顺利完成之后，当前连接将不再进行 HTTP 交互，而是开始 websocket 的数据帧协议，实现客户端和服务器端的数据交换
    - 处于安全考虑，客户端发送的数据会进行掩码处理，一旦中间遭到破坏，就会断开连接。而服务器发送到客户端的数据帧则无须进行掩码处理，同样，如果客户端接收到掩码处理的数据帧，连接将关闭。

* 网络服务与安全

  - SSL 传输层连接加密，应用层透明
  - TSL 安全传输层协议
  - Node 在网络安全提供了三个模块：crypto,tls,https;
  - crypto 主要提供加解密的功能，sha1，md5 等加密算法
  - tls 提供了与 net 模块类似的功能，区别是建立在 tls/ssl 加密 TCP 连接上
  - https 和 http 接口完全一致，区别是建立在安全的连接上
  - TLS/SSL
    - 一个公钥私钥的机构，是一个非对称的结构，每个服务器端和客户端都有自己的公私钥。公钥用来加密要传输的数据，私钥用来解密接收到的数据。公钥私钥是配对的
    - 数字证书 ca
  - TLS 服务
    - 创建服务器端
    ```js
    var tls = require("tls");
    var fs = require("fs");
    var options = {
      key: fs.readFileSync("./keys/server.key"),
      cert: fs.readFileSync("./keys/server.crt"),
      ca: [fs.readFileSync("./keys/ca.crt")],
      requestCert: true,
    };
    var server = tls.createServer(options, function(stream) {
      stream.write("welcome");
      stream.setEncoding("utf8");
      stream.pipe(stream);
    });
    server.listen(8000, function() {
      console.log("server bound");
    });
    ```
  - HTTPS 服务：HTTPS 就是工作在 TLS/SSL 上的 HTTP

    - 创建 HTTPS 服务

    ```js
    var https = require("https");
    https.createServer(
      {
        key: fs.readFileSync("./keys/server.key"),
        cert: fs.readFileSync("./keys/server.crt"),
      },
      function(req, res) {
        res.writeHead(200);
        res.end();
      }
    );
    ```

## 构建 web 应用

- 请求方法 req.method：HEAD，DELETE，PUT，CONNECT
- 路径解析 req.url，需要注意的是 hash 部分将会被舍弃
- 查询字符串 Node 提供了 querystring 模块来处理这部分字符
- Cookie，http 是无状态的，使用 cookie 这种方案来识别和认证用户
  - req.headers.cookie 访问 cookie
  - 在响应中设置 cookie
    ```
    Set-Cookie: name=value; Path=/; Expires=Sun, 23-Apr-23 09:01:35 GMT; Domain=.domain.com;
    ```
  - path 表示这个 cookie 影响到的路径
  - Expires 和 Max-Age 告诉浏览器 cookie 的过期时间，Expires 告诉浏览器什么时间过期，如果服务器时间和客户端时间不一致，可能会出现偏差，Max-Age 是多长时间之后过期。
  - HttpOnly 告知浏览器不允许通过脚本去修改这个 Cookie 值
  - Secure，当 Secure 为 true 时，在 http 中是无效的，在 https 中是有效的
  - 性能影响：一旦服务器设置了 cookie，只要不过期，那么在之后的所有请求中，都会携带 cookie 信息；一旦设置的 cookie 信息过多，将会导致报头较大，所以尽量减小 cookie 大小。
  - cookie 的优化
    - 避免 cookie 设置过大
    - 避免 path 设置为根域名，导致 cdn 的请求也携带 cookie 信息
  - Session
    - cookie 存在的问题是前后端都可以修改，容易被篡改；
    - 基于 cookie 在服务端来实现用户和数据的映射
    - 通过查询字符串来实现浏览器和服务端的数据映射
    - Session 与内存：node 限制内存的使用，Session 维护在内存中，如果用户激增，到达了内存的上限，并且内存中的数据量加大，会导致内存回收机制的频繁扫描，造成性能问题。
    - 上面解决方案使用，Session 集中化，将原本可能散列在多个进程中的数据，统一转移到集中的数据存储中，目前常用的工具是 Redis 等，通过这些高效的缓存，Node 进程无需再内部维护数据对象。并且这些高速缓存的过期策略更加合理和高效。
    - 安全：session 的口令存储在客户端，还是存在被盗用的情况。
  - 缓存
    - 条件请求：在 GET 请求报文中，附带 `If-Modified-Since`字段(本地文件最后的修改时间)，询问服务器有没有版本更新。是一个时间戳，时间戳有一些缺陷：文件的改变，时间戳不一定改变，时间戳只能精确到秒级别，更新频繁的内容无法生效。如果有最后修改时间有变更，服务器会返回`Last-Modified`
    - 配置 Etag：HTTP1.1 中引入了 Etag，全称为 Entity Tag；有服务器生成服务器端可以决定它的生成规则。如果根据文件内容生成散列值，那么条件请求将不会受到时间戳改动造成的带宽浪费。ETag 的请求和响应是 If-None-Match/ETag；`If-None-Match:"83-1359871272000"`
    - Expires HTTP1.0 时，在服务器端设置 Expires 可以告知浏览器要缓存文件内容。
    - Cache-Control `max-age` 能够避免掉服务端和客户端时间不一致的问题。同时支持的 Expires 时，max-age 会覆盖掉 Expires
      - public 响应可以被任何对象缓存（发送请求的客户端，代理服务器等等）
      - private 响应只能被单个用户缓存，不能共享
      - no-cache 每次使用缓存文件前，都请求服务器进行验证
      - no-store 不使用任何缓存
- Basic 认证
  - 一个页面需要 basic 认证，会检查请求报文中 Authorization 字段的内容，该字段的值由认证方法和加密值构成。
- 数据上传
  - 请求头会触发`request`事件，请求正文会触发`data`事件。只需要以流的方式来处理即可。
  - 附件的上传：enctype 为 `multipart/form-data`,`boundary=xxx`指定每部分内容的分解符
  - 内存的限制：攻击者每次提交 1Mb 的数据内容，并发一大，内存很容易吃光
    - 限制上传内容的大小，一旦超过限制，停止接受数据，并响应 400
    - 通过流式解析，将数据流导到磁盘中，Node 只保留文件路径等小数据
  - csrf，跨站请求伪造；请求时携带服务器生成的随机值
- 路由解析
  - 文件路径型
    - 静态文件：url 的路径和网站目录的路径一致
    - 动态文件：
  - mvc:
    - 控制器：一组行为的组合
    - 模型：数据相关的操作和封装
    - 视图：视图的渲染
  - RESful：url 的设计规范
- 中间件：如何开发一个高效的中间件：
  - 使用高效的方法
  - 缓存避免重复的计算
  - 避免无用的计算和匹配
- 页面渲染
  - 内容的响应
    ```
      Content-Encoding: gzip
      Content-Length: 21170
      Content-Type: text/javascript; charset=utf-8
    ```
    客户端接收到报文之后，正确的处理过程是通过 gzip 解码报文中内容，用长度校验报文体内容是否正确，然后再以字符集 UTF8 将其解码后插入到文档节点中。
  - MIME 正确是设置 MIME 类型，浏览器根据不同的 MIME 类型，使用不同的方式解析文档
  - 附件的下载 `Content-Dispostion`当为`inline`时，内容只需要即时查看，当为`attachment`时，文件可以存为附件，并且可以指定文件名。
  - 视图的渲染： 约定一个 render 函数作为渲染方法

## 进程

- `child_process` 模块，提供了 child_process.fork()函数供我们实现进程的复制
  - Master-Worker,主从模式；进程分为两种：主进程和工作进程。主进程不负责业务处理，而是负责工作进程的管理和调度。工作进程负责具体的业务处理。
- 创建子进程
  - spawn() 启动一个子进程来执行命令
  - exec() 启动一个子进程来执行命令，与 spawn()不同的是其接口不同，他有一个回调函数获知子进程的状态
  - execFile() 启动一个子进程来执行可执行文件
  - fork() 与 spawn()类似，不同点在于它创建的子进程需要指定要执行的 javascript 文件模块
  - spawn 与 exec,execFile 不同的是后两者创建时可以指定 timeout 属性设置超时时间，一旦超过运行设定的时间就会被 kill
  - exec 与 execFile 不同的是，exec 适合执行任务已有命令，execFile 适合执行文件
  - | 类型       | 回调/异常 | 进行类型 |    执行类型     | 可设置超时 |
    | ---------- | :-------: | :------: | :-------------: | ---------: |
    | spawn()    |   false   |   任意   |      命令       |      false |
    | exec()     |   true    |   任意   |      命令       |       true |
    | execFile() |   true    |   任意   |   可执行文件    |       true |
    | fork()     |   false   |   Node   | javascript 文件 |      false |
  - 这里的可执行文件是指的可以直接执行的文件，如果是 javascript 文件通过 execFile(),它的首行内容是
    ```shell
    #!/usr/bin/env node
    ```
- 进程间通信，在 Master-Worker 模式中，需要主进程和工作进程间的通信。
  - 主线程和工作线程之间通过`onmessage()`和`postMessage()`进行通信，子进程对象通过 send 方法实现主进程向子进程发送数据；message 事件负责实现子进程收听
  - 进程间通信原理 IPC，inter - process - communication,进程间通信
