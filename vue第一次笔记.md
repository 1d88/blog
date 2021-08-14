# vue 第一次笔记

## 构造器

- 1、创建一个根 Vue 实例，通过 Vue 的构造函数；
- 2、组件构造器，通过拓展 Vue 的构造器；
- 3、所有的 Vue 组件都是拓展的 Vue 实例。

## 属性

- 1、每个 Vue 实例代理其 data 里面的属性，也就是通过 Vue 的实例可以访问到其 data 里面的属性；
- 2、这些被代理的属性是响应的，但是之后添加上的数据是不响应的，后者也不会触发视图的更新；
- 3、Vue 的实例对象还会暴露一些方法和属性，这些都是以\$开头的，避免和代理的 data 属性区分；
- 4、不要在实例属性或者或者回调函数里面，使用箭头函数，因为箭头函数绑定父上下文。this 预想是要指向 Vue 实例的。

## 插值

### 文本

- 1、mustache 语法：{{message};
- 2、v-once 指令：一次性插入，以后不会变化，影响该节点上所有的数据绑定;
- 3、v-html 指令：输出纯 HTML，数据绑定会被忽略。

### 属性

- 1、v-bind：HTML 属性不可以用 mustache，使用 v-bind;
- 2、缩写：‘:’

### 使用 JS 表达式

- 1、mustache 语法，作用域 Vue 实例下，只能是表达式，定义语句无效；
- 2、不要在表达式里面访问自定义的全局变量。

## 指令

- 1、v- 为前缀；
- 2、参数：一个指令只能接受一个参数，通过:指明；
- 3、修饰符：通过半角.来指明，例如:.prevent 是相当于 event.preventDefault()

## 过滤器

- 1、过滤器的目的是为了文本的转换；
- 2、过滤器应该是是插在 mustache 尾部；
- 3、过滤器可以叠加使用；

## 缩写

- 1、v-bind : : ；
- 2、v-on : @

## 计算属性：computed

- 1、处理复杂的逻辑们应该使用计算属性；
- 2、计算属性有缓存：响应式依赖（data 里面的数据）更新时，计算属性会执行。没有更新时访问，直接返回缓存值，不会再次执行；

## 观察

- 1、执行异步操作和开销较大的操作。

## class 与 style 绑定

- 1、v-bind:class="{a:isa,b:isb}";
- 2、v-bind:class="[a,b]";
- 3、v-bind:style="{ color: activeColor, fontSize: fontSize + 'px' }";
- 4、使用 v-bind:style 时，Vue.js 会给 css3 自动添加前缀。

## 条件渲染

- 1、只能使用在标签里面；
- 2、v-if 指令：<a v-if='ok'></a>；
- 3、v-else <a v-else></a>；
- 4、可以使用`<template>`做包装。最终渲染不会包含 `<template>`;
- 5、v-else-if,语义上，相当于 else if;
- 6、v-show 相当于 jQuery 的 toggle。

## 列表

- 1、v-for：item in items 例子：<v-for='item in items'>；
- 2、index ;<v-for='(item, index)in items'>；
- 3、对父作用域属性有完全的访问权限。
- 4、可以迭代对象 <div v-for="(value, key, index) in object">

## 事件

- 1、v-on:
- 2、修饰符
  _ .stop 阻止事件冒泡
  _ .prevent 阻止默认的事件
  _ .capture 添加事件侦听器时使用事件捕获模式
  _ .self 只当事件在该元素本身（而不是子元素）触发时触发回调
  _ .once 只触发一次
  _ .native 修饰是浏览器原生的事件
- 3、按键修饰符
  _ .enter 回车
  _ .tab
  _ .delete
  _ .up
  _ .left
  _ .down
  _ .right
  _ .esc \* .space
- 4、自定义修饰符 \* Vue.config.keyCodes.f1 = 112

## 表单控件

- 1、v-model 创建双重绑定，监测用户输入以更新数据。
- 2、修饰符：
  _ lazy:v-model 会监测 input 事件，使用 lazy 可以将它 change 事件
  _ trim:去除首尾空格； \* number：将用户输入的值转化成 number 类型。

## 组件

- 1、注册全局的组件 Vue.component(tagName, options)；
- 2、自定义标签使用小写字母 ➕‘-’；
- 3、实例化组件之后，便可以在父组件中使用`<my-component></my-component>`；
- 4、需要在初始胡`根实例`之前注册组件；
- 5、局部注册。

      	```javascript
      		var Child = {
      		  template: '<div>A custom component!</div>'
      		}
      	```

      	```javascript
      		new Vue({
      		  // ...
      		  components: {
      		    // <my-component> 将只在父模板可用
      		    'my-component': Child
      		  }
      		})
      	```

- 6、DOM 模板解析说明， Vue 只有在浏览器解析和`标准化HTML`之后，才可以获取到模板的内容，比如：ol ul table。
  `<table> <tr is="my-row"></tr> </table>`
- 7、使用组件时，data 必须是函数，如果不是，会在 Vue 控制台触发一个警告。使用函数 return 一个 data，为了保证每个实例都有自己的 data。
- 8、父子组件之间的信息传递是 props down, event up,父级通过 prop 向子级传递信息，自己通过事件想父级传递信息。
- 9、props：组件的实例作用域都是独立了，我们不应该从子级的模板内直接去访问父级的数据。应该使用 props 向子组件传递参数。

      	```javascript
      		//显示声明要访问的props属性
      		Vue.component('child', {
      		  // 声明 props
      		  props: ['myMessage'],//camelCase 非字符串模板使用
      		  // 就像 data 一样，prop 可以用在模板内
      		  // 同样也可以在 vm 实例中像 “this.message” 这样使用
      		  template: '<span>{{ message }}</span>'
      		});

      		//kebab-case 非字符串模板使用，字符串模板没有这个限制
      		<child my-message="hello!"></child>
      	```

- 10、动态 prop，一个例子：

      	```html
      		<div>
      		  <input v-model="parentMsg">
      		  <br>
      		  <child v-bind:my-message="parentMsg"></child>
      		</div>

      		Vue.component(child,{
      			props:['myMessage'],
      			template:'<span>{{parentMsg}}</span>'
      		});
      	```

- 11、使用字面量语法传递数值带来的问题：

      	```
      		<!-- 传递了一个字符串"1" -->
      		<comp some-prop="1"></comp>

      		<!-- 传递实际的数字 -->
      		<comp v-bind:some-prop="1"></comp>

      		注：如果要传入一个number,应该使用动态prop传值
      	```

- 12、单向数据流```
  _ prop 的传递是`单向的`，父组件的值变化时会传递给子组件，但是不会反过来，避免子组件无意修改父组件的值。
  _ 不要试图直接修改子组件里面的值，Vue 会给出警告。
  _ 两种可以改变 prop 的情况：一个是在 data 属性里应用 prop 的值 👇
  `javascript { props: ['initialCounter'], data: function () { return { counter: this.initialCounter } }`
  _ 在 computed，利用 prop 初始值 去计算其他的值。
  `javascript { props: ['size'], computed: { normalizedSize: function () { return this.size.trim().toLowerCase() } }` \* javacript 里面的对象和数组都是引用类型，如果在子组件里面改变它，会影响父组件的状态。

* 13、prop 验证 \* 组件可以为 prop 添加验证，如果没有指定验证规则，会发出警告。


    	```
    	//类型可以是 		String,Function,Boolean,Object,Array
    	{
    		type:Number,//接收类型
    		required:true,//是否必传
    		default:'DEMO'//默认
    		validator（value）{//自验证函数
    		}
    	}
    	```

- 14、自定义事件
  _ 子组件把数据传回去；
  _ 使用‘v-on’绑定自定义函数；每个 Vue 实例都实现了事件接口；
  _ 监听一个事件 = `$on(eventName)`；
  _ 触发一个事件 = `$emit(eventName)`；
- 15、非父子之间的信息传递：使用自定义事件，Vue 对象作为中央事件总栈。

      	```
      		var myVue = new Vue();

      		// 触发组件 A 中的事件
      		myVue.$emit('id-selected', 1);
      		// 在组件 B 创建的钩子中监听事件
      		myVue.$on('id-selected', function (id) {
      		  // ...
      		})
      	```

- 16、内容分发 slot(没看)
- 17、动态组件
  \_ 多个组件使用一个挂载点，使用保留的`<component>`标签和 is 属性
  ```javascript
  var vm = new Vue({
  el: '#example',
  data: {
  currentView: 'home'
  },
  components: {
  home: { /_ ... _/ },
  posts: { /_ ... _/ },
  archive: { /_ ... _/ }
  }
  })
  ``html
  <component v-bind:is="currentView">
  <!-- 组件在 vm.currentview 变化时改变！ -->
  </component>
  ```
  \_ keep-alive：切换出去的组件常住在内容中
  `<keep-alive> <component :is="currentView"> <!-- 非活动组件将被缓存！ --> </component> </keep-alive>`
- 18、额外的内容
  _ Vue 组件的 API 包括三个部分：
  |名称|内容|
  |-----|:---------------:|
  |props| 外部数据 传递给 组件|
  |Events|组件数据 传递给 父类组件|
  |slot|允许外部环境将额外的内容组合在组件中|
  _ 子组件索引
  `html <input ref='demo'>`
  `javascript var parent = new Vue({ el: '#parent' }) //$refs 只在组件渲染完成后才填充，并且它是非响应式的。它仅仅作为一个直接访问子组件的应急方案——应当避免在模版或计算属性中使用 $refs var child = parent.$refs.demo` \* 异步组件 将组件定义成一个工厂函数，如

      		```javascript
      			Vue.component('demo',function(resolve,reject){
      				setTimeout(function(){
      					resolve({
      						template:'<div></div>'
      					});
      				},5000);
      				//或者
      				 require(['./my-async-component'], resolve)
      			});
      		```
      	* 组件命名约定：个人约定 html使用kebab-case

      	* 递归组件：我不使用。
      	* 内联模板：

      		```html
      			<my-component inline-template>
      			<!--这里面的内容会被编译成组件的template-->
      			  	<div>
      				    <p>These are compiled as the component's own template.</p>
      				    <p>Not parent's transclusion content.</p>
      			</div>
      			</my-component>
      		```
      	* x-template:

      		```html
      			<script type="text/x-template" id="hello-world-template">
      			  <p>Hello hello hello</p>
      			</script>
      		```
      		```javascript
      			Vue.component('hello-world', {
      			  template: '#hello-world-template'
      			})
      		```
      	* 尽管在 Vue 中渲染 HTML 很快，不过当组件中包含大量静态内容时，可以考虑使用 v-once 将渲染结果缓存起来

##响应式原理

- 1、怎么理解 API 中这句话‘Object.defineProperty 是仅 ES5 支持，且无法 shim 的特性’？ \* shim: 是将不同 api 封装成一种，比如 jQuery 的 \$.ajax 封装了 XMLHttpRequest 和 IE 用 ActiveXObject 方式创建 xhr 对象；shim 的 api 不是遵循标准的，而是自己去设计的。这句话的样式我的理解是：Object.defineProperty 无法用自己的设计去封装。
- 2、Vue 会将传给 data 的对象，使用 Object.defineProperty 把这个对象的属性设置为 getter 和 setter；Vue 支持 IE8 以上。
- 3、每个组件都有 watcher 实例对象，组件渲染过程中会将属性记录成依赖，当调用属性的 setter 发法时，会触发 watcher 重新计算。
- 4、Vue 不可以监测属性的添加和删除，所以前面提到的当组件初始化结束后，添加的 data 属性是不是响应的。因为这时候添加或者删除的属性不会被转化成 setter 和 getter，进而不会触发 watcher。
- 5、Vue 不可以在已经实例化的 Vue 对象上添加一个新的响应式的根属性 ，但是可以将响应属性添加到嵌套对象上，就是添加到已经存在的属性上。

      	```javascript
      		Vue.set(vm.someObject, 'b', 2)
      	```

- 6、异步更新队列：意思就是说当 data 发生改变的时候，Vue 针对于 DOM 不会立即就去执行，会开启一个队列去缓存同一个事件循环中发生的所有的数据更新。然后去重队列里面重复的 watcher 回调，然后在下一次事件循环 tick 中,Vue 刷新队列并执行工作。
  _ 使用 Vue.nextTick(callback)方法，会在 DOM 更新之后立即执行。
  _ 不需要绑定全局的 Vue，实例化 Vue 就可以调到他。

##过渡

- 暂不学习

##Render

- 1、Vue 推荐使用 template 的方式来构架你的 HTML。（template html）,但是根据有些场景需要使用 render 函数。
- 2、createElement 参数：

```
	createElement(
	  // {String | Object | Function}
	  // 一个 HTML 标签，组件选项，或一个函数
	  // 必须 Return 上述其中一个
	  'div',
	  // {Object}
	  // 一个对应属性的数据对象
	  // 您可以在 template 中使用.可选项.
	  {
		  // 和`v-bind:class`一样的 API
		  'class': {
		    foo: true,
		    bar: false
		  },
		  // 和`v-bind:style`一样的 API
		  style: {
		    color: 'red',
		    fontSize: '14px'
		  },
		  // 正常的 HTML 特性
		  attrs: {
		    id: 'foo'
		  },
		  // 组件 props
		  props: {
		    myProp: 'bar'
		  },
		  // DOM 属性
		  domProps: {
		    innerHTML: 'baz'
		  },
		  // 事件监听器基于 "on"
		  // 所以不再支持如 v-on:keyup.enter 修饰器
		  // 需要手动匹配 keyCode。
		  on: {
		    click: this.clickHandler
		  },
		  // 仅对于组件，用于监听原生事件，而不是组件使用 vm.$emit 触发的事件。
		  nativeOn: {
		    click: this.nativeClickHandler
		  },
		  // 自定义指令. 注意事项：不能对绑定的旧值设值
		  // Vue 会为您持续追踨
		  directives: [
		    {
		      name: 'my-custom-directive',
		      value: '2'
		      expression: '1 + 1',
		      arg: 'foo',
		      modifiers: {
		        bar: true
		      }
		    }
		  ],
		  // Scoped slots in the form of
		  // { name: props => VNode | Array<VNode> }
		  scopedSlots: {
		    default: props => h('span', props.text)
		  },
		  // 如果子组件有定义 slot 的名称
		  slot: 'name-of-slot'
		  // 其他特殊顶层属性
		  key: 'myKey',
		  ref: 'myRef'
	  },

	  // {String | Array}
	  // 子节点(VNodes). 可选项.
	  [
		    createElement('h1', 'hello world'),
		    createElement(MyComponent, {
		      props: {
		        someProp: 'foo'
		      }
		    }),
		    'bar'
	  ]);
```

##自定义指令

- 1、注册一个全局指令

      	```
      		// 注册一个全局自定义指令 v-focus
      		Vue.directive('focus', {
      		  // 当绑定元素插入到 DOM 中。
      		  inserted: function (el) {
      		    // 聚焦元素
      		    el.focus()
      		  }
      		})

      	```

- 2、注册局部指令,组件接受一个 directives 的函数
  `directives: { focus: { // 指令的定义--- } }`
- 3、钩子函数
  `directives:{ focus:{ bind(){},//只调用一次，第一次绑定到元素上时调用 insert(){},//被插入到父节点时，无视在不在document上 update(){},//绑定的元素更新时调用，？？？ componentUpdate(){},//被绑定元素所在模板完成一次更新周期时调用 unbind(){}//解绑时，调用 } } /** 参数： el:绑定的元素，可以直接使用，原生 binding:{ name:'',//指令名,只读 value:'',//指令的绑定值,只读 oldValue:'',//指令绑定的前一个值,只读 expresion:''//绑定值得字符串形式,只读 arg:''//传给指令的参数,只读 modifiers:'',只读 } ,vNode:,,只读 oldVnode:,只读 */`
- 4、字面量：如果指令需要多个值可以传入一个 javascript 字面量。

##路由

- 1、基础
  _ html
  `<router-link to="/path"></router-link> <router-view></router-view>`
  _ js
  `javascript //我们肯定是模块化开发 Vue.use(VueRouter); const Home ={template:''} const routes = [ { path:'/path:id',//路由参数用冒号开始，可以使用 this.$route.params进行访问 component:xxx } ] const router = new VueRouter({ routes }); new Vue({ el:'#app', routes })` \* $route api
	
	|方法名|类型|说明|
	|:-----|:----|---|
	|$route.path|string|对应当前路由的路径，总是解析为绝对路径，如 "/foo/bar"。
  |$route.params|object|获取所有参数，key:value，没有为空对象|
	|$route.query|object|返回所有的参数，跟上面差不多，这个用来判断 参数的值|
  |$route.hash|string|获取hash值，不带‘#’，没有为空字符串|
	|$route.fullPath|string|完成解析后的 URL，包含查询参数和 hash 的完整路径。|
  |$route.matchd|array|当前路由的所有嵌套路径片段的 路由记录 |
	|$route.name|string|当前路由的名称，如果有的话。|
