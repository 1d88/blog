# initMethods

```js
function initState(vm) {
  vm._watchers = [];
  var opts = vm.$options;
  if (opts.methods) {
    initMethods(vm, opts.methods);
  }
}
function initMethods(vm, methods) {
  var props = vm.$options.props;
  for (var key in methods) {
    {
      if (typeof methods[key] !== "function") {
        warn(
          'Method "' +
            key +
            '" has type "' +
            typeof methods[key] +
            '" in the component definition. ' +
            "Did you reference the function correctly?",
          vm
        );
      }
      if (props && hasOwn(props, key)) {
        warn('Method "' + key + '" has already been defined as a prop.', vm);
      }
      if (key in vm && isReserved(key)) {
        warn(
          'Method "' +
            key +
            '" conflicts with an existing Vue instance method. ' +
            "Avoid defining component methods that start with _ or $."
        );
      }
    }
    vm[key] =
      typeof methods[key] !== "function" ? noop : bind(methods[key], vm);
  }
}
```

初始化实例的方法比较简单：

1. 如果当前方法不是一个函数，发出警告；
2. 如果方法名和 `prop` 名冲突，发出警告；
3. 如果当前方法名已经在`vm`中，并且以\_或者\$开头，发出警告：冲突、避免使用\_或\$开始；
4. 方法直接挂载在 `vm` 上，兼容处理非函数为`noop`空函数，合法函数强制绑定执行上下文为 `vm`
