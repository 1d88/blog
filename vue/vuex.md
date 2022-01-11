# vuex

> vuex 版本号 v3.6.2，使用于 vue 2 版本

作为一个 vue 的插件需要提供一个`install`方法，`vuex`也是一样，因此一切一切的开始源自于`install`:

```js
function install(_Vue) {
  if (Vue && _Vue === Vue) {
    if (process.env.NODE_ENV !== "production") {
      console.error(
        "[vuex] already installed. Vue.use(Vuex) should be called only once."
      );
    }
    return;
  }
  Vue = _Vue;
  applyMixin(Vue);
}
```

这个方法是所有插件开发都必须注册的方法。如果当前内部缓存的 Vue 和传入的 Vue 是一个对象，那么在开发模式下会报错。

如果并没有重复的初始化`vuex`然后初始化，缓存 Vue 构造函数，调用`applyMixin`，开始我们`vuex`旅程。

## 1、`applyMixin`

```js
function applyMixin(Vue) {
  var version = Number(Vue.version.split(".")[0]);

  if (version >= 2) {
    Vue.mixin({ beforeCreate: vuexInit });
  } else {
    // override init and inject vuex init procedure
    // for 1.x backwards compatibility.
    var _init = Vue.prototype._init;
    Vue.prototype._init = function(options) {
      if (options === void 0) options = {};

      options.init = options.init ? [vuexInit].concat(options.init) : vuexInit;
      _init.call(this, options);
    };
  }
}
```

首先作为一个插件，第一件事是获取当前的 Vue 版本号，判断版本号来通过不同的方式来初始化`vuex`：

- 对于 Vue 2 的版本，使用 mixin 混入
  混入的原来我们都知道，是直接给当前 Vue 构造函数的 options 添加对应的选项，通过合并策略来实现对所以实例的拓展。
- 对于其它的版本，重写其\_init 圆形方法
  缓存现有的\_init 方法，合并到生命周期 init 中，这个生命周期在 vue1 的代码中存在，vue2 就不存在这个生命周期了。

综上来看，我们主要研究 Vue2 的版本，混入了`beforeCreate`的生命周期中，接下来会做哪些事情呢，让我看`vuexInit`函数

### 1.1、`vuexInit`

```js
/**
 * Vuex init hook, injected into each instances init hooks list.
 */

function vuexInit() {
  var options = this.$options;
  // store injection
  if (options.store) {
    this.$store =
      typeof options.store === "function" ? options.store() : options.store;
  } else if (options.parent && options.parent.$store) {
    this.$store = options.parent.$store;
  }
}
```

获取了当前的`$options`属性，我们都知道，这个属性是调用`mergeOptions`合并之后的实例属性，其“继承”了`Vue.options`。
这里判断`options`是否具有`store`属性，如果存在：

- 是一个函数，直接盗用
- 是一个对象，直接返回

从而实现`this.$store`的初始化。

反之，如果不存在，使用父级的`$store`指向自己的`$store`，Vue 的实例是从父到子，意味着所有的 `this.$store` 实际上都是指向了最原始设置的那个`store`。

## 2、utils

### 2.1、assertRawModule

```js
var assertTypes = {
  getters: functionAssert,
  mutations: functionAssert,
  actions: objectAssert,
};
function assertRawModule(path, rawModule) {
  Object.keys(assertTypes).forEach(function(key) {
    if (!rawModule[key]) {
      return;
    }

    var assertOptions = assertTypes[key];

    forEachValue(rawModule[key], function(value, type) {
      assert(
        assertOptions.assert(value),
        makeAssertionMessage(path, key, type, value, assertOptions.expected)
      );
    });
  });
}
```

枚举 getters、mutations、actions，看是否使用了 module，如果没有使用直接返回，否则，遍历内部所有的 module,调用 assert 来做警告，这个方法主要是判断传入的方法是否符合规则，如果不符合规则，提示。比如：

- getters 和 mutations 期望提供一个函数
- actions 期望提供一个对象

assert 函数如下：

```js
function assert(condition, msg) {
  if (!condition) {
    throw new Error("[vuex] " + msg);
  }
}
```

### 2.2、forEachValue

```js
function forEachValue(obj, fn) {
  Object.keys(obj).forEach(function(key) {
    return fn(obj[key], key);
  });
}
```

传入一个对象，枚举这个对象的 value，并且使用传入的 fn 执行它

## 3、Module

> 如果没有模块的概念，那么所有的状态都维护到一个对象，当应用非常负责的时候，那个对象有可能会变得非常的大，这个对象就是解决这个问题而设计的模块，提供一个命名空间的概念，每块业务都使用一个 module 来划分分割：

```js
var Module = function Module(rawModule, runtime) {
  this.runtime = runtime;
  // Store some children item
  this._children = Object.create(null);
  // Store the origin module object which passed by programmer
  this._rawModule = rawModule;
  var rawState = rawModule.state;

  // Store the origin module's state
  this.state = (typeof rawState === "function" ? rawState() : rawState) || {};
};
```

参数 rawModule 是初始化 vuex 时的模块
初始化`runtime`，`_children`, `_rawModule`，`state`的值

### 3.1、原型的方法：crud

```js
Module.prototype.addChild = function addChild(key, module) {
  this._children[key] = module;
};

Module.prototype.removeChild = function removeChild(key) {
  delete this._children[key];
};

Module.prototype.getChild = function getChild(key) {
  return this._children[key];
};

Module.prototype.hasChild = function hasChild(key) {
  return key in this._children;
};
```

- addChild：添加一个子类模块
- removeChild：删除一个子类模块
- getChild：获取一个子类模块
- hasChild：查看一个子类模块是否存在

```js
Module.prototype.update = function update(rawModule) {
  this._rawModule.namespaced = rawModule.namespaced;
  if (rawModule.actions) {
    this._rawModule.actions = rawModule.actions;
  }
  if (rawModule.mutations) {
    this._rawModule.mutations = rawModule.mutations;
  }
  if (rawModule.getters) {
    this._rawModule.getters = rawModule.getters;
  }
};
```

获取设置当前的命名空间，更新

- actions
- mutations
- getters

### 3.2、原型的方法:遍历的方法

```js
Module.prototype.forEachChild = function forEachChild(fn) {
  forEachValue(this._children, fn);
};

Module.prototype.forEachGetter = function forEachGetter(fn) {
  if (this._rawModule.getters) {
    forEachValue(this._rawModule.getters, fn);
  }
};

Module.prototype.forEachAction = function forEachAction(fn) {
  if (this._rawModule.actions) {
    forEachValue(this._rawModule.actions, fn);
  }
};

Module.prototype.forEachMutation = function forEachMutation(fn) {
  if (this._rawModule.mutations) {
    forEachValue(this._rawModule.mutations, fn);
  }
};
```

遍历的方法：

- forEachChild:遍子类模块
- forEachGetter：遍历当前模块的所有`getters`
- forEachAction：遍历当前模块的所有`actions`
- forEachMutation：遍历当前模块的所有`mutations`

## 4、`ModuleCollection`

```js
var ModuleCollection = function ModuleCollection(rawRootModule) {
  // register root module (Vuex.Store options)
  this.register([], rawRootModule, false);
};
```

### 4.1、使用 `register`注册

```js
ModuleCollection.prototype.register = function register(
  path,
  rawModule,
  runtime
) {
  var this$1 = this;
  if (runtime === void 0) runtime = true;

  {
    assertRawModule(path, rawModule);
  }

  var newModule = new Module(rawModule, runtime);
  if (path.length === 0) {
    this.root = newModule;
  } else {
    var parent = this.get(path.slice(0, -1));
    parent.addChild(path[path.length - 1], newModule);
  }

  // register nested modules
  if (rawModule.modules) {
    forEachValue(rawModule.modules, function(rawChildModule, key) {
      this$1.register(path.concat(key), rawChildModule, runtime);
    });
  }
};
```

参数：path、rawModule、runtime
首先、设置 runtime 的默认值，调用 assertRawModule 来验证传入的数据是否符合所期望的值。通过`new newModule`来创建一个新的模块，如果没有开启 modules，那么当前的 root 模块就是刚刚创建的 newModule.

## 2、`Store`

> `vuex`的核心

### 2.1、构造函数

```js
var Store = function Store(options) {
  var this$1 = this;
  if (options === void 0) options = {};

  // Auto install if it is not done yet and `window` has `Vue`.
  // To allow users to avoid auto-installation in some cases,
  // this code should be placed here. See #731
  if (!Vue && typeof window !== "undefined" && window.Vue) {
    install(window.Vue);
  }

  if (process.env.NODE_ENV !== "production") {
    assert(Vue, "must call Vue.use(Vuex) before creating a store instance.");
    assert(
      typeof Promise !== "undefined",
      "vuex requires a Promise polyfill in this browser."
    );
    assert(
      this instanceof Store,
      "store must be called with the new operator."
    );
  }
```

上面的代码主要做了 3 件事：

1. 判断兼容 options 不能是 undefined，默认是一个空的对象
2. 如果没有传入一个 Vue 或者 存在一个`Vue`属性在 Window 上面，那么尝试调用上面介绍的`install`函数去安装当前的组件到这个 Vue 对象
3. 在开发模式下会提示：
   - 必须在构建 store 实例前，注册 vuex 插件
   - 必须支持 Promise
   - Store 构造函数必须使用 New 关键字操作

```js
var plugins = options.plugins;
if (plugins === void 0) plugins = [];
var strict = options.strict;
if (strict === void 0) strict = false;
```

确保 plugins 是一个数组，如果没有传入 strict，确保是一个 false

- plugins 这个选项暴露出每次 mutation 的钩子，可以再次做一些事情
- strict 是否使用严格模式，严格模式下，只能使用 mutation 进行提交，否则在开发环境中抛出错误

```js
// store internal state
this._committing = false;
this._actions = Object.create(null);
this._actionSubscribers = [];
this._mutations = Object.create(null);
this._wrappedGetters = Object.create(null);
this._modules = new ModuleCollection(options);
this._modulesNamespaceMap = Object.create(null);
this._subscribers = [];
this._watcherVM = new Vue();
this._makeLocalGettersCache = Object.create(null);
```

初始化众多的参数

- `_committing`：是否在提交
- `_actions`：动作
- `_actionSubscribers`：动作订阅者数组
- `_mutations`：提交
- `_wrappedGetters`：
- `_modules`：模块
- `_modulesNamespaceMap`：
- `_subscribers`：订阅者
- `_watcherVM`：观察者实例
- `_makeLocalGettersCache`：

```js
// bind commit and dispatch to self
var store = this;
var ref = this;
var dispatch = ref.dispatch;
var commit = ref.commit;
this.dispatch = function boundDispatch(type, payload) {
  return dispatch.call(store, type, payload);
};
this.commit = function boundCommit(type, payload, options) {
  return commit.call(store, type, payload, options);
};
// strict mode
this.strict = strict;
var state = this._modules.root.state;
```

dispatch 和 commit 方法，这样的绑定可以使`dispatch`和`commit`的`this`指向`store`？？？

设置是否是严格模式
获取当前 state

```js

// init root module.
// this also recursively registers all sub-modules
// and collects all module getters inside this._wrappedGetters
installModule(this, state, [], this._modules.root);

// initialize the store vm, which is responsible for the reactivity
// (also registers _wrappedGetters as computed properties)
resetStoreVM(this, state);

// apply plugins
plugins.forEach(function(plugin) {
  return plugin(this$1);
});

var useDevtools =
  options.devtools !== undefined ? options.devtools : Vue.config.devtools;
if (useDevtools) {
  devtoolPlugin(this);
}
};
```
