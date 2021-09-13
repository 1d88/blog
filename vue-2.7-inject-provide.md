# inject/provide

## 1、inject

```js
function initInjections(vm) {
  var result = resolveInject(vm.$options.inject, vm);
  if (result) {
    toggleObserving(false);
    Object.keys(result).forEach(function(key) {
      /* istanbul ignore else */
      {
        defineReactive$$1(vm, key, result[key], function() {
          warn(
            "Avoid mutating an injected value directly since the changes will be " +
              "overwritten whenever the provided component re-renders. " +
              'injection being mutated: "' +
              key +
              '"',
            vm
          );
        });
      }
    });
    toggleObserving(true);
  }
}

var shouldObserve = true;

function toggleObserving(value) {
  shouldObserve = value;
}
```

这个函数离不开`mergeOptions`的`normalizeInject`提供一个标准化的数据结构。`resolveInject`的作用是返回在“先辈”组件对应的`provide`。如果这个对象是存在的，遍历对象属性并添加到当前实例。下面是`resolveInject`的实现：

```js
function resolveInject(inject, vm) {
  if (inject) {
    // inject is :any because flow is not smart enough to figure out cached
    var result = Object.create(null);
    var keys = hasSymbol ? Reflect.ownKeys(inject) : Object.keys(inject);

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      // #6574 in case the inject object is observed...
      if (key === "__ob__") {
        continue;
      }
      var provideKey = inject[key].from;
      var source = vm;
      while (source) {
        if (source._provided && hasOwn(source._provided, provideKey)) {
          result[key] = source._provided[provideKey];
          break;
        }
        source = source.$parent;
      }
      if (!source) {
        if ("default" in inject[key]) {
          var provideDefault = inject[key].default;
          result[key] =
            typeof provideDefault === "function"
              ? provideDefault.call(vm)
              : provideDefault;
        } else {
          warn('Injection "' + key + '" not found', vm);
        }
      }
    }
    return result;
  }
}
```

传入一个有效的`inject`，才会执行之后的代码；通过`var result = Object.create(null);`和最终返回的`result`，我们知道此函数丰富这个对象，并且返回。

静态方法 `Reflect.ownKeys()`返回一个由目标对象自身的属性键组成的数组。如果不支持改用`Object.keys()`；二者的区别是： `Reflect.ownKeys()`返回等同于`Object.getOwnPropertyNames(target).concat(Object.getOwnPropertySymbols(target))`的集合，也就是所有的属性（可枚举或者不可）和`symbol`属性。
`Object.keys()`返回的是目标对象的可枚举属性。

遍历所有的`inject`属性进行下面的处理，跳过`__ob__`。（https://github.com/vuejs/vue/issues/6574）

获取`inject[key]`对应对象的`from`属性`provideKey`，递归`vm.$parent`，向上查找`provideKey`，找到跳出，或者没找到终止循环。

如果是终止循环的情况，`source`等于`source.$parent`将会是一个`undefined`，这时，如果提供了默认值，那么直接使用默认值，如果没有，将发出一个警告：“Injection \${key} not found”

回到`initInjections`，我们在`result[key] = source._provided[provideKey];`这一步获取到了来自于“先辈”的引用，然后将这些属性，添加到当前`vm`。

`toggleObserving`决定着`shouldObserve`。这个字段会在`observe`方法中用到，当为`true`时，才可以`ob = new Observer(value)`。`toggleObserving(false)`意味着针对于`inject`的属性并不会新建`Observer`

### 1.1、initInjections 的时机问题

在 2.2.1 或者更高版本，可以在`props`和`data`初始化前访问到，比如将`inject`作为`data`中某个字段的初始化值

```js
const Child = {
  inject: ["foo"],
  props: {
    bar: {
      default() {
        return this.foo;
      },
    },
  },
};
//
const Child1 = {
  inject: ["foo"],
  data() {
    return {
      bar: this.foo,
    };
  },
};
```

这些特证的实现无非在于`initInjections`的调用时机

```js
// ...
callHook(vm, "beforeCreate");
initInjections(vm); // resolve injections before data/props
initState(vm);
// ...
```

在 2.5.0+ 的注入可以通过设置默认值使其变成可选项。

## 2、provide

```js
function initProvide(vm) {
  var provide = vm.$options.provide;
  if (provide) {
    vm._provided = typeof provide === "function" ? provide.call(vm) : provide;
  }
}
```

`initProvide`比较简单，就是将`vm.$options.provide`赋值给`vm._provided`，以供`子孙`组件在执行`resolveInject`的时候可以找到。

## 总结

通过 inject/provide，我们可以在子类组件访问跨级父组件；是针对于`this.$parent.$parent.$parent.doThis()`这种代码的解决方案；`provide`传递是一个值或者引用，意味着我们可以调用提供者的任何方法或者属性。

官方文档也明确声明，故意没有设计成响应式：**提示：provide 和 inject 绑定并不是可响应的。这是刻意为之的。然而，如果你传入了一个可监听的对象，那么其对象的 property 还是可响应的。**，其实通过控制`shouldObserve`字段来实现的。
