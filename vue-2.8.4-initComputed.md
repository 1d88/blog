# initComputed

```js
function initState(vm) {
  vm._watchers = [];
  var opts = vm.$options;
  if (opts.computed) {
    initComputed(vm, opts.computed);
  }
}
var computedWatcherOptions = { lazy: true };

function initComputed(vm, computed) {
  var watchers = (vm._computedWatchers = Object.create(null));
  var isSSR = isServerRendering();

  for (var key in computed) {
    var userDef = computed[key];
    var getter = typeof userDef === "function" ? userDef : userDef.get;
    if (getter == null) {
      warn('Getter is missing for computed property "' + key + '".', vm);
    }

    if (!isSSR) {
      // create internal watcher for the computed property.
      watchers[key] = new Watcher(
        vm,
        getter || noop,
        noop,
        computedWatcherOptions
      );
    }

    // component-defined computed properties are already defined on the
    // component prototype. We only need to define computed properties defined
    // at instantiation here.
    if (!(key in vm)) {
      defineComputed(vm, key, userDef);
    } else {
      if (key in vm.$data) {
        warn(
          'The computed property "' + key + '" is already defined in data.',
          vm
        );
      } else if (vm.$options.props && key in vm.$options.props) {
        warn(
          'The computed property "' + key + '" is already defined as a prop.',
          vm
        );
      }
    }
  }
}
```

初始化计算属性的大体流程：

1. 生成一个空对象`vm._computedWatchers`；
2. 枚举`vm.$options.computed`，如果`computed[key]`是一个函数，这个函数就是当前计算属性的`getter`函数，否则，获取`computed[key].get`当做`getter`函数；
3. 如果获得的这个`getter`函数是`null`，会抛出一个警告；
4. 在浏览器端，使用`Watcher`构建计算属性；
5. 如果当前属性不存在于`vm`，使用`defineComputed`函数挂载计算属性到`vm`；
6. 否则校验`data`或`props`有冲突。

综上，首先兼容的获取 get 函数，使用`Watcher`构建计算属性，最终挂载到`vm`上。

`defineComputed`函数

```js
function defineComputed(target, key, userDef) {
  var shouldCache = !isServerRendering();
  if (typeof userDef === "function") {
    sharedPropertyDefinition.get = shouldCache
      ? createComputedGetter(key)
      : createGetterInvoker(userDef);
    sharedPropertyDefinition.set = noop;
  } else {
    sharedPropertyDefinition.get = userDef.get
      ? shouldCache && userDef.cache !== false
        ? createComputedGetter(key)
        : createGetterInvoker(userDef.get)
      : noop;
    sharedPropertyDefinition.set = userDef.set || noop;
  }
  if (sharedPropertyDefinition.set === noop) {
    sharedPropertyDefinition.set = function() {
      warn(
        'Computed property "' + key + '" was assigned to but it has no setter.',
        this
      );
    };
  }
  Object.defineProperty(target, key, sharedPropertyDefinition);
}
```

计算属性的思路是获取其`key`对应的对象或者`get`函数，重新使用`Object.defineProperty`定义这个属性的读写操作功能。

如果传入的是一个函数，那么表示开发者只使用了`get`函数，将一个`noop`空函数赋值给它的`set`函数。如果传入是一个对象，也就意味着同时定义了`get`和`set`函数。最终使用`Object.defineProperty`挂载到当前的`vm`上。
细节有两处：

1. 在浏览器端开启缓存，在 ssr 不开启缓存。
2. 浏览器端`createComputedGetter` 和 ssr 的`createGetterInvoker`

`createComputedGetter`函数

```js
function createComputedGetter(key) {
  return function computedGetter() {
    var watcher = this._computedWatchers && this._computedWatchers[key];
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate();
      }
      if (Dep.target) {
        watcher.depend();
      }
      return watcher.value;
    }
  };
}
```

一个高阶函数，返回`computedGetter`，这个函数访问了当前的`watcher`(`this._computedWatchers && this._computedWatchers[key]`)，如果当前的`watcher`的依赖有变更，那么会触发`watcher.evaluate()`重新计算当前`watcher.value`，重新搜集依赖，返回当前计算结果；如果没有依赖变更，直接返回之前的计算结果；具体细节在响应式介绍。

`createGetterInvoker`函数

```js
function createGetterInvoker(fn) {
  return function computedGetter() {
    return fn.call(this, this);
  };
}
```

直接重新调用返回结果。
