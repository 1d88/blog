# beforeCreate 之前

> 我们已经获得了合并之后的选项，接下来我们要`initProxy`，`initEvents`，`initRender`，然后出发 hook`beforeCreate`

## 1、initProxy

```js
var initProxy;

{
  // 内置的属性，内置的对象，内置的方法，包装对象
  var allowedGlobals = makeMap(
    "Infinity,undefined,NaN,isFinite,isNaN," +
      "parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent," +
      "Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl," +
      "require" // for Webpack/Browserify
  );
  // 提示render存在没有响应式的引用
  var warnNonPresent = function(target, key) {
    warn(
      'Property or method "' +
        key +
        '" is not defined on the instance but ' +
        "referenced during render. Make sure that this property is reactive, " +
        "either in the data option, or for class-based components, by " +
        "initializing the property. " +
        "See: https://vuejs.org/v2/guide/reactivity.html#Declaring-Reactive-Properties.",
      target
    );
  };

  //以 _ 或 $ 开头的 property 不会被 Vue 实例代理，因为它们可能和 Vue 内置的 property、API 方法冲突。你可以使用例如 vm.$data._property 的方式访问这些 property。
  var warnReservedPrefix = function(target, key) {
    warn(
      'Property "' +
        key +
        '" must be accessed with "$data.' +
        key +
        '" because ' +
        'properties starting with "$" or "_" are not proxied in the Vue instance to ' +
        "prevent conflicts with Vue internals. " +
        "See: https://vuejs.org/v2/api/#data",
      target
    );
  };
  // 是否原生支持代理 Proxy
  var hasProxy = typeof Proxy !== "undefined" && isNative(Proxy);
  // 如果支持原生的 Proxy,为keyCodes做了一层劫持
  // 当设置keyCode时，如果和内置的keycode冲突，那么设置失败，否则设置成功
  if (hasProxy) {
    var isBuiltInModifier = makeMap(
      "stop,prevent,self,ctrl,shift,alt,meta,exact"
    );
    config.keyCodes = new Proxy(config.keyCodes, {
      set: function set(target, key, value) {
        if (isBuiltInModifier(key)) {
          warn(
            "Avoid overwriting built-in modifier in config.keyCodes: ." + key
          );
          return false;
        } else {
          target[key] = value;
          return true;
        }
      },
    });
  }
  // 如果当前key in target，那么就返回true
  // allowedGlobals(key) 表示是否和内置对象或内置属性重名
  // (typeof key === "string" && key.charAt(0) === "_" && !(key in target.$data)); 表示以 _ 开头的 key 并且不存在 target.$data中
  // 'NaN' in target  false
  // 'a' in target true
  // '_a' in target
  var hasHandler = {
    has: function has(target, key) {
      var has = key in target;
      var isAllowed =
        // allowedGlobals('NaN') = true
        allowedGlobals(key) ||
        (typeof key === "string" &&
          key.charAt(0) === "_" &&
          !(key in target.$data));

      if (!has && !isAllowed) {
        if (key in target.$data) {
          warnReservedPrefix(target, key);
        } else {
          warnNonPresent(target, key);
        }
      }
      return has || !isAllowed;
    },
  };

  var getHandler = {
    get: function get(target, key) {
      if (typeof key === "string" && !(key in target)) {
        // 如果在$data上，因为避免冲突而没有被代理
        if (key in target.$data) {
          warnReservedPrefix(target, key);
        } else {
          warnNonPresent(target, key);
        }
      }
      return target[key];
    },
  };

  initProxy = function initProxy(vm) {
    // 如果支持 Proxy，那么开启异常警告；使用Proxy重新定义getter和has函数。
    if (hasProxy) {
      // determine which proxy handler to use
      var options = vm.$options;
      var handlers =
        options.render && options.render._withStripped
          ? getHandler
          : hasHandler;
      vm._renderProxy = new Proxy(vm, handlers);
    } else {
      vm._renderProxy = vm;
    }
  };
}
```

## 2、`initProxy`的目的

`initProxy`的目的有两个：通过使用 ES6 的`Proxy`实现`vm`的元编程操作，代理了对于`vm`上属性的访问（getter）和`in`操作符的判断。首先`vm._renderProxy`决定了`render.call(vm._renderProxy, vm.$createElement)`的 this 指向。render 函数返回的是虚拟 DOM， `vnode` 的生成离不开 this 的访问。

访问被代理的`vm`（`vm._renderProxy`）时，如果一个 key 存在于`vm.$data`但不存在于`vm`，那么会提示警告，来自于官网的陈述**以 \_ 或 $ 开头的 property 不会被 Vue 实例代理，因为它们可能和 Vue 内置的 property、API 方法冲突。你可以使用例如 vm.$data.\_property 的方式访问这些 property。**（https://cn.vuejs.org/v2/api/#data）； 如果`vm.$data`上也不存在，则说明这个 key 根本不存在，只是在模板上写了表达式，在实例内部不存在这个响应式 key。

## 3、get or in

到底是代理`get`行为还是`in`行为取决于`vm.$options.render`和`vm.$options.render._withStripped`。`_withStripped`的设置并非可以在`Vue`的源码里找到。
`vue-loader`处理 SFC 单文件组件中`<template>...</template>`生成`vm.$options.render`，`options.render._withStripped`在开发模式下会被设置为 true（`vue-loader`是借助于`component-compiler-utils`来实现解析），此番意图在于开发模式下可以更好的检测代码运行时的状态，并提示给开发人员。
（相关代码：https://github.com/vuejs/component-compiler-utils/blob/8b0da745c5a4c7a07b3b88560a1d1cb3c00a9d32/lib/compileTemplate.ts#L170）

如果是生产模式，此时不再会有访问`vm`属性异常而抛出的警告，取而代之的是使用`in`操作符去判断一个属性的时候，会抛出警告。

## 总结

`initProxy`主要的工作做错误的提示工作。在开发模式下，会捕捉错误属性的访问并且提示；在生产模式下使用`in`会触发和在开发模式下`get`相同的效果。是否开启代理错误检验，和浏览器的支持情况相关，即使浏览器不支持代理特性，也不会影响正常的功能。
