# Vue 实例挂载

> 从`new Vue({...})`开始，进入 App 的挂载。

## 1、生命周期

<img src="https://cn.vuejs.org/images/lifecycle.png" width="500">

## 2、根实例初始化

`!(this instanceof Vue)`来判断当前是否是通过`new`关键字来调用 Vue，同样也可以通过 es6 新引入的`new.target === Vue`来判断。

```js
function Vue(options) {
  if (!(this instanceof Vue)) {
    warn("Vue is a constructor and should be called with the `new` keyword");
  }
  this._init(options);
}
```

`Vue`的构造函数调用了原型上的`_init`方法；`options._isComponent`标识着是一个组件调用`_init`方法。`new Vue`并不会走进`initInternalComponent`方法，而是进行参数合并`mergeOptions`。依次执行：

- 初始化`vm`属性访问的代理
- 初始化生命周期
- 初始化自定义事件
- 初始化渲染相关属性
- 调用`beforeCreate`钩子函数
- 初始化注入
- 初始化状态
- 初始化`Provide`
- 调用`created`钩子函数

```js
function initMixin(Vue) {
  Vue.prototype._init = function(options) {
    var vm = this;
    // 当前组件的uid，升序自增；当使用 devlopment的performance，使用uid来mark;在transtion.js中也有应用
    vm._uid = uid$3++;
    // 这里会有一个 init 的 性能监控 starttag
    // 运行_init会将当前字段标记为true,通过此属性来避免vm的响应式观察当前对象，比如在set 函数里面传入一个 vm
    vm._isVue = true;
    // merge options
    if (options && options._isComponent) {
      initInternalComponent(vm, options);
    } else {
      // 实例的挂载会走进这个语句块中
      // $options 合并了来自于父级的options
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      );
    }
    // 初始化代理
    initProxy(vm);
    // expose real self
    vm._self = vm;
    // 初始化生命周期
    initLifecycle(vm);
    // 初始化事件
    initEvents(vm);
    // 初始化渲染
    initRender(vm);
    // 触发 hook beforeCreate
    callHook(vm, "beforeCreate");
    // 1.注入
    initInjections(vm); // resolve injections before data/props
    // 2.初始化prop、data、methods、computed、watch
    initState(vm);
    // 3.提供者
    initProvide(vm); // resolve provide after data/props
    // 触发 hook created
    callHook(vm, "created");
    // 这里会有一个 init 的 性能监控 endtag
    // 如果提供el那么挂载
    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  };
}
```

`initInternalComponent` 初始化内部组件，

```js
function initInternalComponent(vm, options) {
  // 获取当前options
  var opts = (vm.$options = Object.create(vm.constructor.options));
  // doing this because it's faster than dynamic enumeration.
  // 获取当前父级虚拟dom节点
  var parentVnode = options._parentVnode;
  // 获取当前父组件
  opts.parent = options.parent;
  // 获取当前父级虚拟dom节点
  opts._parentVnode = parentVnode;

  // 获取当前组件的选项，并且初始化并赋值propsData，赋值_parentListeners、_renderChildren、_componentTag
  var vnodeComponentOptions = parentVnode.componentOptions;
  opts.propsData = vnodeComponentOptions.propsData;
  opts._parentListeners = vnodeComponentOptions.listeners;
  opts._renderChildren = vnodeComponentOptions.children;
  opts._componentTag = vnodeComponentOptions.tag;

  // 如果选项存在render函数，那么赋值render 和 staticRenderFns
  if (options.render) {
    opts.render = options.render;
    opts.staticRenderFns = options.staticRenderFns;
  }
}
```
