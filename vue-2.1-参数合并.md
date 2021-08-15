# 参数合并

> 合并父级参数

```js
if (options && options._isComponent) {
  initInternalComponent(vm, options);
} else {
  // 实例的挂载会走进这个语句块中
  // $options 合并了来自于父级的options
  vm.$options = mergeOptions(
    resolveConstructorOptions(vm.constructor),
    options || {},
    vm
  );
}
```

几个重要的函数

- mergeOptions
  - resolveConstructorOptions
    - resolveModifiedOptions
  - normalizeProps
  - normalizeInject
  - normalizeDirectives

由于在 `mergeOptions` 函数首先调用 `resolveConstructorOptions`，所以先来分析 `resolveConstructorOptions`

## 1、resolveConstructorOptions

> resolveConstructorOptions(Ctor: Vue | VueComponent): VueOptions

```js
resolveConstructorOptions(vm.constructor);
```

```js
function resolveConstructorOptions(Ctor) {
  // 查看入参类型
  console.log("resolveConstructorOptions", Ctor.name, Ctor === Vue);
  var options = Ctor.options;
  // 如果存在super，针对于VueComponent，查找Vue的options
  if (Ctor.super) {
    // 获取父级属性
    var superOptions = resolveConstructorOptions(Ctor.super);
    var cachedSuperOptions = Ctor.superOptions;
    // 构造函数上缓存的选项 和 父级构造函数的选项是否一致，如果不一致，更新为新的父级的属性，这里是校验的引用
    if (superOptions !== cachedSuperOptions) {
      // super option changed,
      // need to resolve new options.
      Ctor.superOptions = superOptions;
      // check if there are any late-modified/attached options (#4976)
      // 找出变更的选项，针对于VueComponent
      var modifiedOptions = resolveModifiedOptions(Ctor);
      // update base extend options
      // 如果发现存在变更的选项，那么进行更新
      if (modifiedOptions) {
        extend(Ctor.extendOptions, modifiedOptions);
      }
      // 重新merge选项
      options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions);
      // 如果存在 name 属性
      if (options.name) {
        options.components[options.name] = Ctor;
      }
    }
  }
  return options;
}
```

### 1.1、入参的类型：

`resolveConstructorOptions`传入参数为实例构造函数 `Vue` 或者 `VueComponent`，`vm.constructor`访问当前实例的 `constructor`，会查找原型链的`constructor`，所以指向了 Vue 或者 VueComponent；因此实例挂载时`resolveConstructorOptions`的入参为`Vue`，加载子组件时参数合并的入参是`VueComponent`。

初始化一个只有一个组件的 Vue 实例：

```js
function resolveConstructorOptions(Ctor) {
  // 查看入参类型
  console.log("resolveConstructorOptions", Ctor.name, Ctor === Vue);
}
// resolveConstructorOptions Vue true
// resolveConstructorOptions VueComponent false
// resolveConstructorOptions Vue true
```

第一个打印是 `new Vue` 的参数合并，第二次打印是子组件 `Vue.extend`触发的参数合并，
`Vue.extend`会构造一个特殊的`VueComponent`构造函数返回，并且会维护`VueComponent`的`super`属性；特殊性表现在多次传入相同的 options 只会复用一套构造函数；因此并不是 Vue；第三次打印的是`resolveConstructorOptions`函数中，子组件构造函数的 super 属性走进了条件判断，去获取 super 的属性再次调用 `resolveConstructorOptions`。入参为`vue`

### 1.2、`Ctor.options`

实例初始化时，`Vue.options`的维护在于`initGlobalAPI`函数 和 其他几条语句：

- 添加组件，指令，过滤器集合
- 添加内建组件 `KeepAlive`
- 添加过渡组件 `Transition`，`TransitionGroup`
- 添加指令 `model`，`show`
- 添加了\_base 属性指向 Vue

```js
var builtInComponents = {
  KeepAlive: KeepAlive,
};
var ASSET_TYPES = ["component", "directive", "filter"];
function initGlobalAPI(Vue) {
  // ...
  Vue.options = Object.create(null);
  ASSET_TYPES.forEach(function(type) {
    Vue.options[type + "s"] = Object.create(null);
  });
  Vue.options._base = Vue;
  extend(Vue.options.components, builtInComponents);
  // ...
}
var platformComponents = {
  Transition: Transition,
  TransitionGroup: TransitionGroup,
};
var platformDirectives = {
  model: directive,
  show: show,
};
// install platform runtime directives & components
extend(Vue.options.directives, platformDirectives);
extend(Vue.options.components, platformComponents);
```

### 1.3、superOptions !== cachedSuperOptions 的场景

测试 case

```js
const option = {
  template: "<div>a</div>",
};
const a = Vue.extend(option);
Vue.filter("my-filter", function(value) {
  return value;
});
const b = Vue.extend(option);
const app = new Vue({
  components: {
    "my-a": a,
    "my-b": b,
  },
  template: "<main><my-a></my-a><my-b></my-b></main>",
  mounted() {},
}).$mount("#app");
```

```js
if (Ctor.super) {
  // 获取父级属性
  var superOptions = resolveConstructorOptions(Ctor.super);
  var cachedSuperOptions = Ctor.superOptions;
  console.log(
    "my-filter" in superOptions.filters,
    "my-filter" in cachedSuperOptions
  );
  console.log(superOptions === cachedSuperOptions);
}
// output: true false
// output: true
```

首先使用`Vue.extend`创建`Vue`子类，此时 Vue.options.filters 里面并不存在`my-filter`，但 `superOptions` 和 `cachedSuperOptions` 指向的还是同一个引用地址。正常使用的情况下，想不到有什么操作会使 Vue.options 改变指针。

resolveModifiedOptions 函数

```js
function resolveModifiedOptions(Ctor) {
  var modified;
  var latest = Ctor.options;
  var sealed = Ctor.sealedOptions;
  for (var key in latest) {
    if (latest[key] !== sealed[key]) {
      if (!modified) {
        modified = {};
      }
      modified[key] = latest[key];
    }
  }
  return modified;
}
```

`sealedOptions`在`Vue.extend`中维护

```js
Vue.extend = function(extendOptions) {
  var Sub = function VueComponent(options) {
    this._init(options);
  };
  var Super = this;
  Sub.options = mergeOptions(Super.options, extendOptions);
  Sub.sealedOptions = extend({}, Sub.options);
};
```

`resolveModifiedOptions`函数意图找出变更的选项

```js
if (modifiedOptions) {
  extend(Ctor.extendOptions, modifiedOptions);
}
// 重新merge选项
options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions);
```

如果存在变更的选项，那么更新当前的属性到 `VueComponent.extendOptions`
再次调用 `mergeOptions` 合并参数。如果参数存在 `name` 属性，维护到 options 的`components`中

```js
// 如果存在 name 属性
if (options.name) {
  options.components[options.name] = Ctor;
}
```

```
{components: {…}, directives: {…}, filters: {…}, name: "a", _base: ƒ, …}
components: {a: ƒ VueComponent(options)}
directives: {}
filters: {}
name: "a"
template: "<div>a</div>"
_Ctor: {0: ƒ}
_base: ƒ Vue(options)
```

## 2 mergeOptions

```js
function mergeOptions(parent, child, vm) {
  {
    checkComponents(child);
  }
  // 如果是一个方法，应该是传入的VueComponent
  if (typeof child === "function") {
    child = child.options;
  }

  normalizeProps(child, vm);
  normalizeInject(child, vm);
  normalizeDirectives(child);
  // Apply extends and mixins on the child options,
  // but only if it is a raw options object that isn't
  // the result of another mergeOptions call.
  // Only merged options has the _base property.
  if (!child._base) {
    if (child.extends) {
      parent = mergeOptions(parent, child.extends, vm);
    }
    if (child.mixins) {
      for (var i = 0, l = child.mixins.length; i < l; i++) {
        parent = mergeOptions(parent, child.mixins[i], vm);
      }
    }
  }

  var options = {};
  var key;
  for (key in parent) {
    mergeField(key);
  }
  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key);
    }
  }
  function mergeField(key) {
    var strat = strats[key] || defaultStrat;
    options[key] = strat(parent[key], child[key], vm, key);
  }
  return options;
}
```

parent 输入为 Vue 或者 VueComponent 的 options，child 为本次实例化的选项

### 2.1、checkComponent 函数

```js
function checkComponents(options) {
  for (var key in options.components) {
    validateComponentName(key);
  }
}
function validateComponentName(name) {
  if (
    !new RegExp("^[a-zA-Z][\\-\\.0-9_" + unicodeRegExp.source + "]*$").test(
      name
    )
  ) {
    warn(
      'Invalid component name: "' +
        name +
        '". Component names ' +
        "should conform to valid custom element name in html5 specification."
    );
  }
  if (isBuiltInTag(name) || config.isReservedTag(name)) {
    warn(
      "Do not use built-in or reserved HTML elements as component " +
        "id: " +
        name
    );
  }
}
```

校验组件的名称是否符合规范，并且组件的名称不能和内建组件、保留的标签名称一致

### 2.2、normalizeProps 函数

```js
function normalizeProps(options, vm) {
  // props为空直接退出
  var props = options.props;
  if (!props) {
    return;
  }
  var res = {};
  var i, val, name;
  // props: ['','','']
  if (Array.isArray(props)) {
    i = props.length;
    while (i--) {
      val = props[i];
      if (typeof val === "string") {
        name = camelize(val);
        res[name] = { type: null };
      } else {
        warn("props must be strings when using array syntax.");
      }
    }
    // props: {
    a: {
    }
    // }
  } else if (isPlainObject(props)) {
    for (var key in props) {
      val = props[key];
      name = camelize(key);
      res[name] = isPlainObject(val) ? val : { type: val };
    }
  } else {
    warn(
      'Invalid value for option "props": expected an Array or an Object, ' +
        "but got " +
        toRawType(props) +
        ".",
      vm
    );
  }
  options.props = res;
}
```

我们都知道 `options.props` 有两种方式传参，一种是数组，一种是对象，这个函数目的是输出一个标准化格式的 props。当输入的是`string[]`，数据格式化成`{[propName]:{type:null}}`，当输入的是对象，数据格式化为`{[propName]: inputValue }`

```js
// 输入为对象时的case
{
  props:{
    a:{
      type:String,
      default:'a'
    }
  }
}
或
{
  props:{
    a: String
  }
}
```

或者`{[propName]:{ type:inputValue}}。

### 2.3、normalizeInject 函数

```js
function normalizeInject(options, vm) {
  // inject为空直接退出
  var inject = options.inject;
  if (!inject) {
    return;
  }
  var normalized = (options.inject = {});
  // 如果是数组
  if (Array.isArray(inject)) {
    for (var i = 0; i < inject.length; i++) {
      normalized[inject[i]] = { from: inject[i] };
    }
    // 如果是对象
  } else if (isPlainObject(inject)) {
    for (var key in inject) {
      var val = inject[key];
      normalized[key] = isPlainObject(val)
        ? extend({ from: key }, val)
        : { from: val };
    }
  } else {
    warn(
      'Invalid value for option "inject": expected an Array or an Object, ' +
        "but got " +
        toRawType(inject) +
        ".",
      vm
    );
  }
}
```

`options.inject`入参为`Array<string>`或者`{ [key: string]: string | Symbol | Object }`

```js
// inject:['a']
options.inject = {
  a: {
    from: "a",
  },
};
// inject:{ a : 'a'} || {a: {form: 'a' ,default: 'a'}}
options.inject = {
  a: { form: "a", default: "a" },
};
options.inject = {
  a: {
    from: "a",
  },
};
```

返回的对象至少都存在 key `from`，标识着可在注入内容中查找这个 key

### 2.3、normalizeDirectives 函数

```js
var dirs = options.directives;
if (dirs) {
  for (var key in dirs) {
    var def$$1 = dirs[key];
    if (typeof def$$1 === "function") {
      dirs[key] = { bind: def$$1, update: def$$1 };
    }
  }
}
```

指令的处理比较简单，如果传入的是对象，比如我们自己定了`bind`，`update`，`unbind`之类的钩子函数，将不会格式化；如果传入的是函数，那么就将`bind`，`update`都指向这个函数。

### 2.4 在子选项上应用扩展和混合的场景

```js
if (!child._base) {
  if (child.extends) {
    parent = mergeOptions(parent, child.extends, vm);
  }
  if (child.mixins) {
    for (var i = 0, l = child.mixins.length; i < l; i++) {
      parent = mergeOptions(parent, child.mixins[i], vm);
    }
  }
}
```

如何传入的 options 存在 extends 或者 mixins，那么将子选项上的扩展和混合 merge 后再作为新的 parent，parent 里面会包含那个`extends`或者`mixins`

```js
var myMixin = {
  created: function() {
    this.hello();
  },
};
var Component = Vue.extend({
  mixins: [myMixin],
});

var component = new Component(); // => "hello from mixin!"
```

### 2.5、mergeField

```js
var strats = config.optionMergeStrategies;
// 省略 ...
function mergeOptions(parent, child, vm) {
  var options = {};
  var key;
  for (key in parent) {
    mergeField(key);
  }
  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key);
    }
  }
  function mergeField(key) {
    var strat = strats[key] || defaultStrat;
    options[key] = strat(parent[key], child[key], vm, key);
  }
  return options;
}
```

`config.optionMergeStrategies`：vue 提供的自定义合并策略接口，并且其内置了各种 option 的默认的合并策略；上面的代码的意图是使用相关的合并策略方法对不同的`key`也就是`options`的`key`,进行合并父级的 merge 操作：

- 父组件的属性要进行合并
- 子组件中父组件不存在的属性也要进行合并

### 2.6、合并策略

让我们打印下 `config.optionMergeStrategies`
<img src="./images/内置的合并策略.jpg" width="600">
