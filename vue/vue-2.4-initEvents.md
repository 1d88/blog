# 实例的事件机制

> eventsMixin 定义了原型上自定义事件的方法；initEvents 定义了具体实例上的事件集合

## 1、eventsMixin

```js
function eventsMixin(Vue) {
  // vm.$on('hook:beforeDestroy',() => {})
  var hookRE = /^hook:/;
  // event 类型：{string | Array<string>}
  // vm.$on([a,b],fn)
  Vue.prototype.$on = function(event, fn) {};

  Vue.prototype.$once = function(event, fn) {};

  Vue.prototype.$off = function(event, fn) {};

  Vue.prototype.$emit = function(event) {};
}
```

eventsMixin 主要定义了原型上`$on`，`$once`，`$off`，`$emit`这四个方法：`$on`向事件集合添加事件，`$once`添加只执行一次的事件，具体实现在执行回调中调用了`$off`来卸载这个事件。`$emit`触发事件。这是一个发布订阅的模式，用来实现子级向父级的数据交互。父级通过订阅这个事件，接受来自子级事件的发布信息，从而执行对应的事件句柄。组件内部也可以订阅相应的事件，或者 hook 事件，从而实现逻辑上解耦。

### 1.1、Vue.protorype.\$on

```js
Vue.prototype.$on = function(event, fn) {
  var vm = this;
  // 递归 扁平化数组
  if (Array.isArray(event)) {
    for (var i = 0, l = event.length; i < l; i++) {
      vm.$on(event[i], fn);
    }
  } else {
    // 是否存在vm._events[event]，在 vm._init => vm.initEvents 中初始化并赋值 vm._events = {};
    (vm._events[event] || (vm._events[event] = [])).push(fn);
    // optimize hook:event cost by using a boolean flag marked at registration
    // instead of a hash lookup
    // 给与标识，存在 hook 事件
    if (hookRE.test(event)) {
      vm._hasHookEvent = true;
    }
  }
  return vm;
};
```

这个方法最终会维护一个`vm._events = {event: [invoker, invoker],};`这样的结构。当传入的`event`为一个数组时，会展开数组，给数组中每个事件名注册 fn。如果`vm`存在 hook 事件，那么`vm._hasHookEvent`设置为`true`，在`callHook`函数中，会`$emit`所有的`hook`事件，只有通过`$on('hook:xxxx')`才会触发，没有订阅就不会触发。

```js
function callHook(vm, hook) {
  //...
  if (vm._hasHookEvent) {
    vm.$emit("hook:" + hook);
    console.log("hook:" + hook);
  }
  //...
}
```

### 1.2、Vue.prototype.\$once

```js
Vue.prototype.$once = function(event, fn) {
  var vm = this;
  function on() {
    vm.$off(event, on);
    fn.apply(vm, arguments);
  }
  // 通过fn 可以访问到原始的方法
  on.fn = fn;
  vm.$on(event, on);
  return vm;
};
```

`Vue.prototype.$once`会在回调句柄执行之前，`$off`掉之前绑定的事件；所以回调只会执行一次。

### 1.3、Vue.prototype.\$off

```js
Vue.prototype.$off = function(event, fn) {
  var vm = this;
  // all
  // vm.$off()，删除所有的事件
  if (!arguments.length) {
    vm._events = Object.create(null);
    return vm;
  }
  // array of events
  // 展开数组，解除事件的绑定
  if (Array.isArray(event)) {
    for (var i$1 = 0, l = event.length; i$1 < l; i$1++) {
      vm.$off(event[i$1], fn);
    }
    return vm;
  }
  // specific event
  // 如果需要解绑的回调数组不存在，直接返回vm
  var cbs = vm._events[event];
  if (!cbs) {
    return vm;
  }
  // 如没有指定对应的回调函数，会删除当前vm._events[event]对应的回调数组
  if (!fn) {
    vm._events[event] = null;
    return vm;
  }
  // specific handler
  // 查找当前fn，并删除
  var cb;
  var i = cbs.length;
  while (i--) {
    cb = cbs[i];
    if (cb === fn || cb.fn === fn) {
      cbs.splice(i, 1);
      break;
    }
  }
  return vm;
};
```

分为几种情况：

- 没有传递任何参数，则移除所有的事件监听器；
- 提供事件名数组，遍历删除对应事件
- 只提供了事件名，但 invoker 或者 fn 无效，直接返回
- 只提供了事件名，没有提供回调引用，删除当前事件名对应的所有回调
- 提供了事件与回调，则只移除这个回调的监听器。

### 1.4、Vue.prototype.\$emit

```js
Vue.prototype.$emit = function(event) {
  var vm = this;
  {
    // 事件的名称规范提醒，事件名称不会转换成中划线的形势
    var lowerCaseEvent = event.toLowerCase();
    if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
      tip(
        'Event "' +
          lowerCaseEvent +
          '" is emitted in component ' +
          formatComponentName(vm) +
          ' but the handler is registered for "' +
          event +
          '". ' +
          "Note that HTML attributes are case-insensitive and you cannot use " +
          "v-on to listen to camelCase events when using in-DOM templates. " +
          'You should probably use "' +
          hyphenate(event) +
          '" instead of "' +
          event +
          '".'
      );
    }
  }
  var cbs = vm._events[event];
  if (cbs) {
    cbs = cbs.length > 1 ? toArray(cbs) : cbs;
    var args = toArray(arguments, 1);
    var info = 'event handler for "' + event + '"';
    for (var i = 0, l = cbs.length; i < l; i++) {
      // 执行事件，如果事件执行抛出错误，会在控制台警告
      invokeWithErrorHandling(cbs[i], vm, args, vm, info);
    }
  }
  return vm;
};
```

`Vue.prototype.$emit`触发当前实例上的事件。附加参数都会传给监听器回调。会忽略掉没有订阅的无效发布。比如：`callHook`函数中的`$emit('hook:'+hook)`，调用`callHook`时都会触发`$emit('hook:'+hook)`，但是只有`\$on('hook:xx')`订阅过的才会触发。此外事件回调的执行是有错误处理的，这是`invokeWithErrorHandling`提供的能力，使用`try{...}catch(e){...}`捕获同步的异常，如果事件句柄执行返回了一个`Promise`，使用`Promise.prototype.catch`来捕获错误。

## 2、initEvents

初始化当前组件的事件机制，绑定当前事件，维护事件集合。

```js
function initEvents(vm) {
  vm._events = Object.create(null);
  vm._hasHookEvent = false;
  // init parent attached events
  var listeners = vm.$options._parentListeners;
  // new Vue的初始化并不会走进这个方法，因为根组件是不存在父监听器的，至少我们不会这么做。只有子组件并且存在事件的监听（也就是存在事件订阅，使用了v-on 或者 @）才会走进这个判断。
  if (listeners) {
    updateComponentListeners(vm, listeners);
  }
}
```

`_parentListeners`来自于父级的事件对象，`vm.$options._parentListeners`赋值初始化来自于`initInternalComponent`函数的`opts._parentListeners = vnodeComponentOptions.listeners;`也就是`options._parentVnode.componentOptions`（`_parentVnode`父级中的预置节点），`componentOptions`类型为：

```js
{
  Ctor: Ctor,
  propsData: propsData,
  listeners: listeners,
  tag: tag,
  children: children,
}
```

我们都知道子组件向父组件传递信息的方式是通过`$emit`一个事件，父组件中的预置节点的事件对象`listeners`会传递到子组件的根节点并且绑定，这样在父组件中订阅，在子组件中触发，实质上都维护在子组件实例的`_events`中。触发时，调用父组件中的回调方法。

### 2.1、updateListeners 函数

```js
var target;
function add(event, fn) {
  target.$on(event, fn);
}

function remove$1(event, fn) {
  target.$off(event, fn);
}

function updateComponentListeners(vm, listeners, oldListeners) {
  target = vm;
  updateListeners(
    listeners,
    oldListeners || {},
    add,
    remove$1,
    createOnceHandler,
    vm
  );
  target = undefined;
}
function updateListeners(on, oldOn, add, remove$$1, createOnceHandler, vm) {
  var name, def$$1, cur, old, event; /////////////   cur  old  是invoker
  // 遍历on中的事件
  for (name in on) {
    def$$1 = cur = on[name];
    old = oldOn[name];
    event = normalizeEvent(name);
    // 当前invoker没有定义，提醒
    if (isUndef(cur)) {
      warn(
        'Invalid handler for event "' + event.name + '": got ' + String(cur),
        vm
      );
    } else if (isUndef(old)) {
      // 如果 on[name] 不存在 fns 属性，构建一个执行会提示错误的回调
      if (isUndef(cur.fns)) {
        cur = on[name] = createFnInvoker(cur, vm);
      }
      // 是否只执行一次，如果是 追加 处理
      if (isTrue(event.once)) {
        cur = on[name] = createOnceHandler(event.name, cur, event.capture);
      }
      // 绑定新的事件
      add(event.name, cur, event.capture, event.passive, event.params);
      // 新invoker和旧invoker不一致时
    } else if (cur !== old) {
      old.fns = cur;
      on[name] = old;
    }
  }
  // 移除旧invoker
  for (name in oldOn) {
    if (isUndef(on[name])) {
      event = normalizeEvent(name);
      remove$$1(event.name, oldOn[name], event.capture);
    }
  }
}
```

`updateListeners` 函数主要目的：更新 vm.\_events 中的事件

- 新增时，构建一个 invoker 包装 fns，意图是可以获的更好的异常捕捉
- 更新时，更新 invoker 上面的 fns，fns 是 事件句柄
- 移除时，删除掉 vm.\_events 对应 event 的 事件句柄

```js
function createOnceHandler(event, fn) {
  var _target = target;
  return function onceHandler() {
    // 调用之后直接移除，apply传入null在非严格模式，为Window {}
    var res = fn.apply(null, arguments);
    if (res !== null) {
      _target.$off(event, onceHandler);
    }
  };
}
```

`createOnceHandler`返回一个函数，如果 fn 执行后返回的结果不是 null，那么解除事件的绑定。

### 2.2、createFnInvoker
```js
function createFnInvoker(fns, vm) {
  function invoker() {
    var arguments$1 = arguments;
    // fns 挂载到 当前的 函数上
    var fns = invoker.fns;
    // 如果是一个数组
    if (Array.isArray(fns)) {
      // 数组浅拷贝
      var cloned = fns.slice();
      for (var i = 0; i < cloned.length; i++) {
        // 错误提醒
        invokeWithErrorHandling(
          cloned[i],
          null,
          arguments$1,
          vm,
          "v-on handler"
        );
      }
    } else {
      // return handler return value for single handlers
      return invokeWithErrorHandling(fns, null, arguments, vm, "v-on handler");
    }
  }
  invoker.fns = fns;
  return invoker;
}
```
`updateListeners`的特点在于利用`createFnInvoker`高阶函数包装了事件句柄`fns`，返回了一个函数`invoker`，可以通过`invoker.fns`访问到原始的事件句柄，同时也方便`invoker`更新自身的`fns`（当 old 和 cur 都存在，但 invoker 不同的 case），`invoker`的执行本质上是调用`fns`，只不过又使用了一个函数`invokeWithErrorHandling`包装它。

### 2.3、invokeWithErrorHandling
```js
// 这个函数是为了捕捉 事件回调 运行中的错误信息
function invokeWithErrorHandling(handler, context, args, vm, info) {
  var res;
  try {
    // 执行函数并保存结果
    res = args ? handler.apply(context, args) : handler.call(context);
    // 如果是一个promise，捕捉其异常
    if (res && !res._isVue && isPromise(res) && !res._handled) {
      res.catch(function(e) {
        return handleError(e, vm, info + " (Promise/async)");
      });
      // issue #9511
      // avoid catch triggering multiple times when nested calls
      res._handled = true;
    }
  } catch (e) {
    handleError(e, vm, info);
  }
  return res;
}

// 函数的意图是格式化name，获取里面的修饰符和标准的事件名称，返回一个标注的配置对象，
// 不同于其他的事件修饰符，这些事件修饰符在调用 addEventListener 时就必须被传递
var normalizeEvent = cached(function(name) {
  // https://cn.vuejs.org/v2/guide/render-function.html#%E4%BA%8B%E4%BB%B6-amp-%E6%8C%89%E9%94%AE%E4%BF%AE%E9%A5%B0%E7%AC%A6
  var passive = name.charAt(0) === "&";
  name = passive ? name.slice(1) : name;
  var once$$1 = name.charAt(0) === "~"; // Prefixed last, checked first
  name = once$$1 ? name.slice(1) : name;
  var capture = name.charAt(0) === "!";
  name = capture ? name.slice(1) : name;
  return {
    name: name,
    once: once$$1,
    capture: capture,
    passive: passive,
  };
});
// 会缓存name对应的事件对象，相同的name会直接返回
function cached(fn) {
  var cache = Object.create(null);
  return function cachedFn(str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
}
```
`invokeWithErrorHandling`包含了 `try ... catch ...`代码块，来捕捉**同步**fn 执行抛出的异常，同时如果 fn 返回一个`Promise`实例(存在异步代码)，使用`Promise.prototype.catch`来捕捉 fn 运行中的异常。
## 3、总结

`eventsMixin`函数初始化了`Vue`的四个原型方法：`$on`、`$off`、`$once`、`$emit`，使用了典型的发布订阅模式，`initEvents`初始化了当前实例上的`_events`集合，绑定了来自于父组件预置节点的事件对象，同时你也可以自己订阅一个事件。
