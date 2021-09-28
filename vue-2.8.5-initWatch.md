# initWatch

```js
function initState(vm) {
  vm._watchers = [];
  var opts = vm.$options;
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch);
  }
}
var nativeWatch = {}.watch;
function initWatch(vm, watch) {
  for (var key in watch) {
    var handler = watch[key];
    if (Array.isArray(handler)) {
      for (var i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i]);
      }
    } else {
      createWatcher(vm, key, handler);
    }
  }
}

function createWatcher(vm, expOrFn, handler, options) {
  if (isPlainObject(handler)) {
    options = handler;
    handler = handler.handler;
  }
  if (typeof handler === "string") {
    handler = vm[handler];
  }
  return vm.$watch(expOrFn, handler, options);
}
```

`nativeWatch`:火狐浏览器拥有 `Object.prototype.watch` 方法，排除掉这种情况。枚举`vm.$options.watch`，使用`createWatcher`来构建一个自定义`Watcher`；`createWatcher`函数内部还是调用了`vm.$watcher`。详细原理在响应式讨论。

到这里为止，`initState`函数就讨论完了。在执行完`initProvide`之后（在 inject、provide 已经讨论完了），就会调用`callHook(vm, "created");`，实例的状态也基本初始化完成。接下来准备挂载 dom 实例。

```js
// 如果提供el那么挂载
if (vm.$options.el) {
  vm.$mount(vm.$options.el);
}
```

总结：
`initState`函数，初始化了实例的`props`、`method`、`data`、`computed`、`watch`。通过初始化的顺序，我们了解到在`data`函数里面可以使用`props`来初始化实例局部的变量，也可以在`data`函数中访问`method`，当然如果`method`如果需要`data`的值，那么这个值是`undefiend`，掌握了这个顺序我们就可以放心大胆的做一些事情。

几个初始化的工作，在`initProps`是最复杂的，不仅需要校验它的类型，可能还要获取默认值，要兼容一些`Boolean`的场景，抛出一些友好的警告；计算属性是`lazy watcher`，被标记为`dirty = true`的`watcher`，才会重新计算一次结果。

`props`、`data`、`computed`都需要处理成响应式，而响应式的实现底层还是使用了`Watcher`，这个我们会在之后的响应式中讨论。
