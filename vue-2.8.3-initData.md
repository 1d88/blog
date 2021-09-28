# initData

```js
function initState(vm) {
  vm._watchers = [];
  var opts = vm.$options;
  if (opts.data) {
    initData(vm);
  } else {
    observe((vm._data = {}), true /* asRootData */);
  }
}
function initData(vm) {
  var data = vm.$options.data;
  data = vm._data = typeof data === "function" ? getData(data, vm) : data || {};
  if (!isPlainObject(data)) {
    data = {};
    warn(
      "data functions should return an object:\n" +
        "https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function",
      vm
    );
  }
  // proxy data on instance
  var keys = Object.keys(data);
  var props = vm.$options.props;
  var methods = vm.$options.methods;
  var i = keys.length;
  while (i--) {
    var key = keys[i];
    {
      if (methods && hasOwn(methods, key)) {
        warn(
          'Method "' + key + '" has already been defined as a data property.',
          vm
        );
      }
    }
    if (props && hasOwn(props, key)) {
      warn(
        'The data property "' +
          key +
          '" is already declared as a prop. ' +
          "Use prop default value instead.",
        vm
      );
    } else if (!isReserved(key)) {
      proxy(vm, "_data", key);
    }
  }
  // observe data
  observe(data, true /* asRootData */);
}
```

`vm.$options.data`如果是个函数，调用`getData`函数获取当前的`vm._data`：

```js
function getData(data, vm) {
  // #7573 disable dep collection when invoking data getters
  pushTarget();
  try {
    return data.call(vm, vm);
  } catch (e) {
    handleError(e, vm, "data()");
    return {};
  } finally {
    popTarget();
  }
}
```

`pushTarget`、`popTarget`是 `Dep` 文件中维护的方式，在深入响应式的会讲解；调用 `data` 函数，返回函数的执行结果。获取`data`的 key 集合，迭代判断是否与`props`、`methods`有冲突，如果存在会警告提示；如果不存在冲突，并且不以`_`或者`$`开头，代理当前 key 到`vm._data`，最后添加响应式处理。
