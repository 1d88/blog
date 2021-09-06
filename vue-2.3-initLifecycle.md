# initLifecycle

## 1、lifecycleMixin

内部主要维护了原型上的三个方法：`_update`、`$forceUpdate`、`$destroy`

```js
function lifecycleMixin(Vue) {
  Vue.prototype._update = function(vnode, hydrating) {};
  Vue.prototype.$forceUpdate = function() {};
  Vue.prototype.$destroy = function() {};
}
```

### 1.1、\_update

```js
Vue.prototype._update = function(vnode, hydrating) {
  var vm = this;
  var prevEl = vm.$el;
  var prevVnode = vm._vnode;
  // 设置当前活动vm
  var restoreActiveInstance = setActiveInstance(vm);
  vm._vnode = vnode;
  // Vue.prototype.__patch__ is injected in entry points
  // based on the rendering backend used.
  if (!prevVnode) {
    // initial render
    vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */);
  } else {
    // updates
    vm.$el = vm.__patch__(prevVnode, vnode);
  }
  restoreActiveInstance();
  // update __vue__ reference
  if (prevEl) {
    prevEl.__vue__ = null;
  }
  if (vm.$el) {
    vm.$el.__vue__ = vm;
  }
  // if parent is an HOC, update its $el as well
  if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
    vm.$parent.$el = vm.$el;
  }
  // updated hook is called by the scheduler to ensure that children are
  // updated in a parent's updated hook.
};
```

变量的解释

- `$el`当前 vm 真实的 dom 根节点
- `_vnode` 子树的根节点
- `$parent`当前父组件
- `$vnode` 父树的预置节点

如果当前的`vm`不存在`_vnode`，也就是当前实例上面没有虚拟 dom 对象。那么是一个初始化的构建。
`vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */);`
如果存在，那么是一个更新操作`vm.$el = vm.__patch__(prevVnode, vnode);`;`__patch__`方法涉及虚拟 dom 的算法，之后再做讨论。

接下来更新`__vue__`引用。`__vue__`在源码中搜索之后会让你感觉很疑惑，并没有参与什么功能。实际上，通过这个字段，我们可以从真实的 dom 节点访问当前的实例`vm`，官方的`devtool`也依赖于这个字段(https://github.com/vuejs/vue/issues/5621)。

最终，如果是一个高阶组件，我们需要更新它的`$el`

### 1.2、\$fourceUpdate

```js
Vue.prototype.$forceUpdate = function() {
  var vm = this;
  if (vm._watcher) {
    vm._watcher.update();
  }
};
```

之后我们可以了解到`vm._watcher`储存的是渲染`watcher`，因此这个法是调用了`render watcher`的`update`方法，重新渲染视图。

### 1.3、\$destroy

```js
Vue.prototype.$destroy = function() {
  var vm = this;
  if (vm._isBeingDestroyed) {
    return;
  }
  callHook(vm, "beforeDestroy");
  vm._isBeingDestroyed = true;
  // remove self from parent
  var parent = vm.$parent;
  if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
    remove(parent.$children, vm);
  }
  // teardown watchers
  if (vm._watcher) {
    vm._watcher.teardown();
  }
  var i = vm._watchers.length;
  while (i--) {
    vm._watchers[i].teardown();
  }
  // remove reference from data ob
  // frozen object may not have observer.
  if (vm._data.__ob__) {
    vm._data.__ob__.vmCount--;
  }
  // call the last hook...
  vm._isDestroyed = true;
  // invoke destroy hooks on current rendered tree
  vm.__patch__(vm._vnode, null);
  // fire destroyed hook
  callHook(vm, "destroyed");
  // turn off all instance listeners.
  vm.$off();
  // remove __vue__ reference
  if (vm.$el) {
    vm.$el.__vue__ = null;
  }
  // release circular reference (#6759)
  if (vm.$vnode) {
    vm.$vnode.parent = null;
  }
};
```

`_isBeingDestroyed`销毁标识，是否在销毁阶段；
`_isDestroyed`已经销毁的标识
销毁步骤：

- 调用`beforeDestroy`生命周期钩子；
- 删除父组件中自己的引用；
- 解除当前`渲染watcher`；
- 解除当前`自定义watcher`；
- 删除`vm._data.__ob__`的引用???
- 删除虚拟 dom 节点，删除真实 dom 节点
- 调用`destroyed`生命周期钩子；
- `$off`解除`vm._events`中的所有事件
- 删除真实 dom 上`__vue__`的引用，释放掉`vm`
- 如果存在父级预置节点，删除预置节点的父级引用，释放循环引用

## 2、initLifecycle

初始化生命周期主要是为了很多字段

- 在父类的`$children`字段中添加自己的引用，这个父类不能是一个抽象的组件，不会渲染出来的组件就是抽象组件，比如 `transition` 或者 `keep-alive`；
- 在`$parent`添加父类的引用，这个父类不是抽象组件；
- 在`$root`添加根组件，组件的创建是从父类到子类的，因此从根组件开始，`$root`都会从父类的`$root`开始引用下来；
- 当前的子类集合`$children`；
- 当前引用集合`$refs`
- `_watcher`渲染监听器
- `_inactive`??
- `_directInactive`??
- `_isMounted`挂载标识
- `_isDestroyed`已经被销毁的标识
- `_isBeingDestroyed`正在被销毁的标识

```js
function initLifecycle(vm) {
  var options = vm.$options;
  // locate first non-abstract parent
  var parent = options.parent;
  if (parent && !options.abstract) {
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent;
    }
    parent.$children.push(vm);
  }

  vm.$parent = parent;
  vm.$root = parent ? parent.$root : vm;

  vm.$children = [];
  vm.$refs = {};

  vm._watcher = null;
  vm._inactive = null;
  vm._directInactive = false;
  vm._isMounted = false;
  vm._isDestroyed = false;
  vm._isBeingDestroyed = false;
}
```

## 3、总结

`lifecycleMixin`主要初始化了和生命周期相关的三个原型方法：`_update`、`$forceUpdate`、`$destroy`。

`_update`方法内部调用了 `__patch__`，`__patch__`的注入跟调用的平台有关，在浏览器端使用了参考`snabbdom`
的 diff 算法。`$forceUpdate`内部还是再次调用了渲染监听器的`update`方法来重新计算一次。`$destroy`方法主要还是解除当前实例的相关引用，避免造成内存的泄漏。调用销毁的两个钩子函数，通用业务开发者做一些必要的清理工作。

`initLifecycle`主要初始化了和生命周期相关的各种实例属性，包括`vue`实例内部使用的属性字段。
