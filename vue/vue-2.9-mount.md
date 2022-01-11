# 实例的挂载

> 实例化最后一步，调用`vm.$mount`挂载真实 Dom

```js
// 如果提供 el 那么挂载
if (vm.$options.el) {
  vm.$mount(vm.$options.el);
}
```

如果存在`el`，那么调用`vm.$mount(vm.$options.el)`；挂载时，可以手动调用`vm.$mount("#app")`，也可以在`options`定义`el`的值。相关文档：https://cn.vuejs.org/v2/api/#el 。

## 1、`Vue.prototype.$mount`

在 Vue 源码中包含两处`Vue.prototype.$mount`方法，位置靠前的先被加载到内存中：

```js
Vue.prototype.$mount = function(el, hydrating) {
  el = el && inBrowser ? query(el) : undefined;
  return mountComponent(this, el, hydrating);
};
```

存在`el`，并且运行环境为浏览器，根据`el`获取当前的 dom 节点，如果在 `document` 查询不到这个节点，那么会创建一个`div`节点做为它的`el`，返回`mountComponent`的调用

### 1.1、`mountComponent`函数

```js
vm.$el = el;
if (!vm.$options.render) {
  vm.$options.render = createEmptyVNode;
  {
    /* istanbul ignore if */
    if (
      (vm.$options.template && vm.$options.template.charAt(0) !== "#") ||
      vm.$options.el ||
      el
    ) {
      warn(
        "You are using the runtime-only build of Vue where the template " +
          "compiler is not available. Either pre-compile the templates into " +
          "render functions, or use the compiler-included build.",
        vm
      );
    } else {
      warn(
        "Failed to mount component: template or render function not defined.",
        vm
      );
    }
  }
}
callHook(vm, "beforeMount");
```

设置当前`vm.el`为传入的参数`el`，判断是否提供了`vm.$options.render`，在前面的`createElement`章节，我们总结过`vm.$options.render`函数的生成有三种方式：

1. 通过`webpack`编译`SFC`文件，生成的`render`函数，此外还有 `staticRenderFns`。如下截图：
   <img src="./images/webpack_build_render.jpg" width="600">
2. 通过 \$options 属性，手写的`render` 函数 (https://cn.vuejs.org/v2/guide/render-function.html) ；
3. 通过 \$options 属性 template，runtime 时编译：
   - 直接写 html 模板
   - 作为 id 选择器：如果以`#`开头，获取`innerHTML`的内容，常用`<script type="x-template">`包含模板。

如果当前的`render`并不存在（**先决条件 1**），将`vm.$options.render`设置为`createEmptyVNode`函数，调用这个函数返回一个空节点

```js
var createEmptyVNode = function(text) {
  if (text === void 0) text = "";
  var node = new VNode();
  node.text = text;
  node.isComment = true;
  return node;
};
```

在**先决条件 1**下，如果在`devlopment`模式下：

- 如果指定了`vm.$options.template`，但`vm.$options.template`不是 id 选择器的方式
- 上面条件如果不满足，但在选项中指定了`vm.$options.el`
- `vm.$mount`传入了`el`

不满足综上的三个条件，会提醒正在使用运行时的模板编译。否则提示`render`或者`template`没有定义。

调用当前实例的`hook:beforeMount`，所以`beforeMount`的触发时机发生在真实 DOM 节点挂载之前。

```js
callHook(vm, "beforeMount");
```

接下来是针对于`updateComponent`函数的定义：

```js
var updateComponent;
/* istanbul ignore if */
if (config.performance && mark) {
  updateComponent = function() {
    var name = vm._name;
    var id = vm._uid;
    var startTag = "vue-perf-start:" + id;
    var endTag = "vue-perf-end:" + id;

    mark(startTag);
    var vnode = vm._render();
    mark(endTag);
    measure("vue " + name + " render", startTag, endTag);

    mark(startTag);
    vm._update(vnode, hydrating);
    mark(endTag);
    measure("vue " + name + " patch", startTag, endTag);
  };
} else {
  updateComponent = function() {
    vm._update(vm._render(), hydrating);
  };
}
```

这里有个判断，如果开启了性能的监控，那么`updateComponent`函数会使用`performance API`添加一系列的 mark，否则只是单纯的去调用`vm._update(vm._render(), hydrating);`。

接着初始化当前实例的渲染`watcher`：

```js
new Watcher(
  vm,
  updateComponent,
  noop,
  {
    before: function before() {
      if (vm._isMounted && !vm._isDestroyed) {
        callHook(vm, "beforeUpdate");
      }
    },
  },
  true /* isRenderWatcher */
);
```

指定传入当前的`vm`作为`watcher.vm`，当执行`hook:updated`时，需要判断`watcher.vm._watcher === watcher`；使用`updateComponent`函数作为当前的`getter`函数，在渲染`watcher`初始化的时候，就会在构造函数的最后调用`this.value = this.get()`，`get`函数调用`getter`函数获取 value。所以`updateComponent`函数会立即执行。cb 传入`noop`空函数，传入`before`函数，在调度冲洗队列时(`flushSchedulerQueue`函数)，在执行`watcher.run`之前，先调用`before`钩子，触发`hook:beforeUpdate`。最后一个参数`true`标识当前`watcher`是渲染`watcher`。

`hydrating = false;`

```js
if (vm.$vnode == null) {
  vm._isMounted = true;
  callHook(vm, "mounted");
}
return vm;
```

如果预置节点为空，那么调用`hook:mounted`。这个时间点标识真实 DOM 已经挂载完毕。

下面代码重新定了`Vue.prototype.$mount`，缓存了之前定义的`Vue.prototype.$mount`，在新定义的`Vue.prototype.$mount`去调用。

```js
var mount = Vue.prototype.$mount;
Vue.prototype.$mount = function(el, hydrating) {};
```

```js
el = el && query(el);
```

获取当前的如果传入`el`，使用`el`去获取 Dom 元素

```js
if (typeof el === "string") {
  var selected = document.querySelector(el);
  if (!selected) {
    warn("Cannot find element: " + el);
    return document.createElement("div");
  }
  return selected;
} else {
  return el;
}
```

如果是一个字符串，推测是一个`css选择器`，使用`document.querySelector(el)`获取`Dom`，如果并没有查询到任何元素返回了`null`，警告没有找到元素`el`并且返回一个新建的`div`。

如果不是一个字符串直接返回 el。

```js
if (el === document.body || el === document.documentElement) {
  warn(
    "Do not mount Vue to <html> or <body> - mount to normal elements instead."
  );
  return this;
}
```

针对于使用`body`元素和使用`html`元素作为根节点的情况，是禁止的。

`!options.render === ture`是下面代码执行的先决条件

```js
var template = options.template;
if (template) {
  if (typeof template === "string") {
    if (template.charAt(0) === "#") {
      template = idToTemplate(template);
      /* istanbul ignore if */
      if (!template) {
        warn(
          "Template element not found or is empty: " + options.template,
          this
        );
      }
    }
  } else if (template.nodeType) {
    template = template.innerHTML;
  } else {
    {
      warn("invalid template option:" + template, this);
    }
    return this;
  }
} else if (el) {
  template = getOuterHTML(el);
}
```

如果没有提供`options.render`，即没有使用`vue-loader`打包`SFC`，也没有提供手写的`render`函数，下面进入一系列的`template`的判断逻辑。
`template`不是`falsy`：

- 如果是选择器的模式，使用`idToTemplate`来获取模板。
  ```js
  var idToTemplate = cached(function(id) {
    var el = query(id);
    return el && el.innerHTML;
  });
  ```
  获取指定`el`DOM 的`innerHTML`内容。
- 如果`template`是一个`Node`节点，直接使用`innerHTML`获取内容
- 最后提示无效的`template option`

`template`是`falsy`：获取`el`的`outerHTML`。

综上处理的意图是获取到了一个合法的`template`，接下来进行`runtime`模板编译工作

```js
if (template) {
  /* istanbul ignore if */
  if (config.performance && mark) {
    mark("compile");
  }

  var ref = compileToFunctions(
    template,
    {
      outputSourceRange: "development" !== "production",
      shouldDecodeNewlines: shouldDecodeNewlines,
      shouldDecodeNewlinesForHref: shouldDecodeNewlinesForHref,
      delimiters: options.delimiters,
      comments: options.comments,
    },
    this
  );
  var render = ref.render;
  var staticRenderFns = ref.staticRenderFns;
  options.render = render;
  options.staticRenderFns = staticRenderFns;

  /* istanbul ignore if */
  if (config.performance && mark) {
    mark("compile end");
    measure("vue " + this._name + " compile", "compile", "compile end");
  }
}
```

编译性能上的监控：如果开启了`config.performance && mark`，打上了`compile`的标记。不做过多讨论。

调用了`compileToFunctions`函数，传入了`template`和配置获取`ref`，定义`options.render`和`options.staticRenderFns`。

最后返回`mount`的调用。所以`mount`执行时，正常情况下必然是存在`options.render`和`options.staticRenderFns`。

```js
return mount.call(this, el, hydrating);
```
