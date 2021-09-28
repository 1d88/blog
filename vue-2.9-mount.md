# mount

> 实例化最后一步，只是 dom 的挂载。

```js
// 如果提供 el 那么挂载
if (vm.$options.el) {
  vm.$mount(vm.$options.el);
}
```

如果存在`el`，那么调用`vm.$mount(vm.$options.el)`；`el`的来源：

- 在初始化 Vue 根实例，手动调用`vm.$mount("#app")`；
- 在`options`定义`el`的值。

相关文档：https://cn.vuejs.org/v2/api/#el

`$mount`

```js
Vue.prototype.$mount = function(el, hydrating) {
  el = el && inBrowser ? query(el) : undefined;
  return mountComponent(this, el, hydrating);
};
```

存在`el`，并且运行环境为浏览器，获取当前的 dom 节点，如果在 `document` 查询不到这个节点，那么会创建一个`div`节点做为它的`el`，返回`mountComponent`的调用

`mountComponent`函数传入`vm`，dom 挂载节点

```js
function mountComponent(vm, el, hydrating) {
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

  // we set this to vm._watcher inside the watcher's constructor
  // since the watcher's initial patch may call $forceUpdate (e.g. inside child
  // component's mounted hook), which relies on vm._watcher being already defined
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
  hydrating = false;

  // manually mounted instance, call mounted on self
  // mounted is called for render-created child components in its inserted hook
  if (vm.$vnode == null) {
    vm._isMounted = true;
    callHook(vm, "mounted");
  }
  return vm;
}
```

代码很多但是逻辑不多:

1. 设置`vm.$el`的值为 el；
2. 如果`vm.$options.render`不存在，返回一个空节点；
3. 调用`callHook(vm, "beforeMount")`；
4. 构架渲染`Watcher`，回调函数为`vm._update(vm._render(), hydrating)`，生成虚拟 dom，调用`vm._update` 打补丁。
5. 调用`callHook(vm, "mounted")`，dom 被挂载。

注：开发模式有虚拟 dom 生成和 diff 的性能监控。
