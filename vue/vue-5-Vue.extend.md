# Vue.extend

```js
function initExtend(Vue) {
  /**
   * Each instance constructor, including Vue, has a unique
   * cid. This enables us to create wrapped "child
   * constructors" for prototypal inheritance and cache them.
   */
  Vue.cid = 0;
  var cid = 1;

  /**
   * Class inheritance
   */
  Vue.extend = function(extendOptions) {
    // 设置参数的默认值 {}
    extendOptions = extendOptions || {};
    // 定义Super = this，当前的 this 指向 Vue
    var Super = this;
    var SuperId = Super.cid;
    // 给当前的extendOptions设置_Ctor属性，使用Super的cid来缓存当前的子类构造器VueComponent
    var cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});
    // 如果存在，那么直接返回
    if (cachedCtors[SuperId]) {
      return cachedCtors[SuperId];
    }
    // 获取name属性并且校验
    var name = extendOptions.name || Super.options.name;
    if (name) {
      validateComponentName(name);
    }
    // 开始构造一个子类VueComponent
    var Sub = function VueComponent(options) {
      this._init(options);
    };
    // 子类原型指Vue的实例对象
    Sub.prototype = Object.create(Super.prototype);
    // 纠正constructor指向当前的子类构造函数
    Sub.prototype.constructor = Sub;
    // 添加cid，在标记构造函数和缓存有很大的用处
    Sub.cid = cid++;
    // 合并参数，入参为父构造函数Vue和当前传入的选项对象
    Sub.options = mergeOptions(Super.options, extendOptions);
    // 将当前构造函数的super指向父构造函数
    Sub["super"] = Super;

    // For props and computed properties, we define the proxy getters on
    // the Vue instances at extension time, on the extended prototype. This
    // avoids Object.defineProperty calls for each instance created.
    // 初始化属性
    if (Sub.options.props) {
      initProps$1(Sub);
    }
    // 初始化计算属性
    if (Sub.options.computed) {
      initComputed$1(Sub);
    }

    // allow further extension/mixin/plugin usage
    // 复制相关函数引用
    Sub.extend = Super.extend;
    Sub.mixin = Super.mixin;
    Sub.use = Super.use;

    // create asset registers, so extended classes
    // can have their private assets too.
    // 复制相关的 组件、指令、过滤器
    ASSET_TYPES.forEach(function(type) {
      Sub[type] = Super[type];
    });
    // enable recursive self-lookup
    // 维护组件name,指向自己
    if (name) {
      Sub.options.components[name] = Sub;
    }

    // keep a reference to the super options at extension time.
    // later at instantiation we can check if Super's options have
    // been updated.
    // 缓存父级的选项
    Sub.superOptions = Super.options;
    // 缓存当前初始化传入的 extendOptions
    Sub.extendOptions = extendOptions;
    // 缓存当前 VueComponent.options
    Sub.sealedOptions = extend({}, Sub.options);

    // cache constructor
    // 缓存构造函数
    cachedCtors[SuperId] = Sub;
    return Sub;
  };
}
```

## 1、Vue.extend 缓存了**相同 options** 子类的构建

```js
Vue.extend = function(extendOptions) {
  extendOptions = extendOptions || {};
  var Super = this;
  var SuperId = Super.cid;
  var cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});
  if (cachedCtors[SuperId]) {
    return cachedCtors[SuperId];
  }
  // 中间省略构造 Sub 的过程 .......
  // cache constructor
  cachedCtors[SuperId] = Sub;
  return Sub;
};
```

<img src="./images/Vue.extend的options.jpg" width="600">

生成的子类构造器会缓存在入参 options 上，通过`_Ctor`可以访问；缓存使用了父级构造函数的 `cid` 做为键值，意味着这个子类由 `cid` 对应的父类构造函数生成。

## 2、子类的构建过程

经典的组合式继承：`VueComponet`的原型指向了`Vue`的一个实例，拥有`Vue`的所有原型方法；通过调用`_init`方法，`VueComponet`实例拥有和`Vue`实例相同的属性字段。

初始化`props`和`computed`，如下代码：

```js
// noop表示一个空函数
function noop() {}
var sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop,
};
// 将 target[sourceKey][key]的数据直接代理在target[key]
function proxy(target, sourceKey, key) {
  sharedPropertyDefinition.get = function proxyGetter() {
    return this[sourceKey][key];
  };
  sharedPropertyDefinition.set = function proxySetter(val) {
    this[sourceKey][key] = val;
  };
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

// Comp.prototype._props[key]代理为Comp.prototype[key]
function initProps$1(Comp) {
  var props = Comp.options.props;
  for (var key in props) {
    proxy(Comp.prototype, "_props", key);
  }
}

function defineComputed(target, key, userDef) {
  // 如果不是ssr的时候需要缓存
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

// 重新定义get 和 set
function initComputed$1(Comp) {
  var computed = Comp.options.computed;
  for (var key in computed) {
    defineComputed(Comp.prototype, key, computed[key]);
  }
}
```

目的？//todo

拓展 `extend`、`mixin`、`use`、`component`、`directive`、`filter`等静态方法

```js
Sub.extend = Super.extend;
Sub.mixin = Super.mixin;
Sub.use = Super.use;

// create asset registers, so extended classes
// can have their private assets too.
ASSET_TYPES.forEach(function(type) {
  Sub[type] = Super[type];
});
```

最后缓存`superOptions`、`extendOptions`、`sealedOptions`，在 mergeOptions 时会用到。三个属性用于检测父选项发生变更新，同步子选项的数据。

```js
Sub.superOptions = Super.options;
Sub.extendOptions = extendOptions;
Sub.sealedOptions = extend({}, Sub.options);
```

最后返回这个构造函数`VueComponent`
