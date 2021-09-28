# initProps

```js
function initProps(vm, propsOptions) {
  var propsData = vm.$options.propsData || {};
  var props = (vm._props = {});
  // cache prop keys so that future props updates can iterate using Array
  // instead of dynamic object key enumeration.
  var keys = (vm.$options._propKeys = []);
  var isRoot = !vm.$parent;
  // root instance props should be converted
  if (!isRoot) {
    toggleObserving(false);
  }
  var loop = function(key) {
    keys.push(key);
    var value = validateProp(key, propsOptions, propsData, vm);
    /* istanbul ignore else */
    {
      var hyphenatedKey = hyphenate(key);
      if (
        isReservedAttribute(hyphenatedKey) ||
        config.isReservedAttr(hyphenatedKey)
      ) {
        warn(
          '"' +
            hyphenatedKey +
            '" is a reserved attribute and cannot be used as component prop.',
          vm
        );
      }
      defineReactive$$1(props, key, value, function() {
        if (!isRoot && !isUpdatingChildComponent) {
          warn(
            "Avoid mutating a prop directly since the value will be " +
              "overwritten whenever the parent component re-renders. " +
              "Instead, use a data or computed property based on the prop's " +
              'value. Prop being mutated: "' +
              key +
              '"',
            vm
          );
        }
      });
    }
    // static props are already proxied on the component's prototype
    // during Vue.extend(). We only need to proxy props defined at
    // instantiation here.
    if (!(key in vm)) {
      proxy(vm, "_props", key);
    }
  };

  for (var key in propsOptions) loop(key);
  toggleObserving(true);
}
```

`vm.$options.propsData`，官方文档**创建实例时传递 props。主要作用是方便测试。**只用于`new`创建的实例中。但通过例子可以看出这个值是父类通过属性向子类传递的值。

定义实例内部属性`vm._props`，定义属性缓存数组`vm.$options._propKeys`，使用数组迭代代替对象属性的枚举来更新属性。根节点的属性需要被转换，也就是根部节点的`props`会被转换为响应式。

`propsOptions`是当前子类选项中的`props`，传入的值为`vm.$options.props`，`props`在 `vm.$options`的原型链上。如下：

```js
function initInternalComponent(vm, options) {
  var opts = (vm.$options = Object.create(vm.constructor.options));
  // ...
}
```

枚举`propsOptions`，`loop`每一个`key`：向`vm.$options._propKeys`添加`key`。调用`validateProp`验证`key`的有效性，调用`defineReactive$$1`给每个`key`添加响应式。最终将`key`代理到`vm._props`。

## 1、`validateProp`函数

首先我们看下官方的属性验证 https://cn.vuejs.org/v2/guide/components-props.html#Prop-%E9%AA%8C%E8%AF%81
props 的多种形态

```js
Vue.component("my-component", {
  props: {
    // 基础的类型检查 (`null` 和 `undefined` 会通过任何类型验证)
    propA: Number,
    // 多个可能的类型
    propB: [String, Number],
    // 必填的字符串
    propC: {
      type: String,
      required: true,
    },
    // 带有默认值的数字
    propD: {
      type: Number,
      default: 100,
    },
    // 带有默认值的对象
    propE: {
      type: Object,
      // 对象或数组默认值必须从一个工厂函数获取
      default: function() {
        return { message: "hello" };
      },
    },
    // 自定义验证函数
    propF: {
      validator: function(value) {
        // 这个值必须匹配下列字符串中的一个
        return ["success", "warning", "danger"].indexOf(value) !== -1;
      },
    },
  },
});
```

将这个函数分三个部分来看，第一部分：

```js
function validateProp(key, propOptions, propsData, vm) {
  var prop = propOptions[key];
  var absent = !hasOwn(propsData, key);
  var value = propsData[key];
  // boolean casting
  var booleanIndex = getTypeIndex(Boolean, prop.type);
  // ...
}
```

`validateProp`的参数说明：

- `key`: `props` 的 `key`
- `propOptions`:`vm.$options.props`（选项里面的`props`）
- `propsData`:`vm.$options.propsData`
- `vm`:当前的 vue 实例

针对于`props`的`type`，是可以指定多个类型可选，`[Boolean,String]`既可以指定布尔类型，也可以使用字符串类型。当传入的可选类型包含了布尔和字符串类型，这里有一个优先级策略的逻辑：

`getTypeIndex`函数获取当前类型在`props.type`可选类型中的数组下标`index`，如果`props.type`是一个值，那么数组下标为`0`，如果是传入了多个值`props.type`是一个数组，那么查找数组中这个类型的位置`index`:

```js
function getTypeIndex(type, expectedTypes) {
  if (!Array.isArray(expectedTypes)) {
    return isSameType(expectedTypes, type) ? 0 : -1;
  }
  for (var i = 0, len = expectedTypes.length; i < len; i++) {
    if (isSameType(expectedTypes[i], type)) {
      return i;
    }
  }
  return -1;
}
```

- `type`：要查找的类型，比如包装对象`Boolean`或者引用对象`Array`
- `expectedTypes` `vm.$options.props[key].type`，期望的可选类型

`isSameType`和 `getType`的实现

```js
function isSameType(a, b) {
  return getType(a) === getType(b);
}
function getType(fn) {
  var match = fn && fn.toString().match(/^\s*function (\w+)/);
  return match ? match[1] : "";
}
```

`getType`的打印
<img src="./images/get_type_function.jpg" width="500">

通过上面的例子可以看出，`getType`的功能是通过构造函数名，获取当前的类型。`isSameType`判断是否是两个相同的类型。
例如传入`Boolean`和`Boolean`，返回 `0`

`validateProp`的第二部分:

```js
// ...
var booleanIndex = getTypeIndex(Boolean, prop.type);
if (booleanIndex > -1) {
  if (absent && !hasOwn(prop, "default")) {
    value = false;
  } else if (value === "" || value === hyphenate(key)) {
    // only cast empty string / same name to boolean if
    // boolean has higher priority
    var stringIndex = getTypeIndex(String, prop.type);
    if (stringIndex < 0 || booleanIndex < stringIndex) {
      value = true;
    }
  }
}
// ...
```

这里针对于 Boolean 的这种类型，有一个优先策略：
如果 prop.type（`vm.$options.props[key].type`）配置了`Boolean`类型才会走入下面两种情况（**先决条件**）

1. 父组件中未提供这个值（`!hasOwn(propsData, key)`）并且没有给这个属性提供默认值（`!hasOwn(prop, "default")`），那么 `value` 为 false。这情况针对于父组件**没有**传入值并且**没有默认值**的情况。符合常规好理解。

2. 如果父组件提供的`propsData[key]`是一个空字符串`""`或者`propsData[key]` 和 `key`一致：（**先决条件 2**）
   - prop.type（`vm.$options.props[key].type`）没有配置 String 这种类型，`value` 为 true
   - 布尔值的优先级大于字符串的优先级，`value` 为 true

情况 2 是针对于 dom 的 property 的场景：

```js
props: {
  a: {
    type: [Boolean, String];
  }
}
// <button disabled=""></button>
// 子组件中 this.a 为 true
// 或者
props: {
  a: {
    type: [Boolean, String];
  }
}
//<button disabled="disabled"></button>
// 子组件中 this.disabled 为 true
```

在浏览器中，`<button>`都会识别设置为 `disabled`。

3. 如果在**先决条件 2**中，如果 String 的优先级比较大，那么 value 等于父组件传入的值（该情况下空字符或者 key 的值）

```js
props: {
  a: {
    type: [String, Boolean];
  }
}
//<button disabled="disabled"></button>
// 子组件中 this.disabled 为 disabled
```

综上，我们处理完了 prop.type（`vm.$options.props[key].type`） 存在 `Boolean` 的情况，接下来看`validateProp`的第三部分:

```js
// check default value
if (value === undefined) {
  value = getPropDefaultValue(vm, prop, key);
  // since the default value is a fresh copy,
  // make sure to observe it.
  var prevShouldObserve = shouldObserve;
  toggleObserving(true);
  observe(value);
  toggleObserving(prevShouldObserve);
}
{
  assertProp(prop, key, value, vm, absent);
}
return value;
```

不符合**先决条件 1**（不存于 `Boolean` 类型的可能性），如果 `value` 是个`undefined`，也就是在父组件的 propsData 中并没有提供这个值,首先使用`getPropDefaultValue(vm, prop, key);`，获取当前的值：

```js
function getPropDefaultValue(vm, prop, key) {
  // no default, return undefined
  if (!hasOwn(prop, "default")) {
    return undefined;
  }
  var def = prop.default;
  // warn against non-factory defaults for Object & Array
  if (isObject(def)) {
    warn(
      'Invalid default value for prop "' +
        key +
        '": ' +
        "Props with type Object/Array must use a factory function " +
        "to return the default value.",
      vm
    );
  }
  // the raw prop value was also undefined from previous render,
  // return previous default value to avoid unnecessary watcher trigger
  if (
    vm &&
    vm.$options.propsData &&
    vm.$options.propsData[key] === undefined &&
    vm._props[key] !== undefined
  ) {
    return vm._props[key];
  }
  // call factory function for non-Function types
  // a value is Function if its prototype is function even across different execution context
  return typeof def === "function" && getType(prop.type) !== "Function"
    ? def.call(vm)
    : def;
}
```

该函数有三种情况，并且返回不同的结果，指定了 prop.default(`vm.$options.props[key].default`)的值，为**先决条件 1**，prop.default 的值如果是引用类型，必须使用工厂函数返回一个新的引用对象，否则发出警告。

1. 不满足**先决条件 1**，直接返回一个`undefined`；
2. 满足**先决条件 1**，`vm.$options.propsData[key] === undefined`&&`vm._props[key] !== undefined`，那么返回`vm._props[key]`；否则执行 3；
3. 满足**先决条件 1**，如果是函数，执行其工厂函数返回对应值。否则返回这个默认值。

使用`getPropDefaultValue`，返回一个新的值，使用`observe(value);`将其变为响应式。

接下来执行`assertProp`函数

```js
function assertProp(prop, name, value, vm, absent) {
  if (prop.required && absent) {
    warn('Missing required prop: "' + name + '"', vm);
    return;
  }
  if (value == null && !prop.required) {
    return;
  }
  var type = prop.type;
  var valid = !type || type === true;
  var expectedTypes = [];
  if (type) {
    if (!Array.isArray(type)) {
      type = [type];
    }
    for (var i = 0; i < type.length && !valid; i++) {
      var assertedType = assertType(value, type[i]);
      expectedTypes.push(assertedType.expectedType || "");
      valid = assertedType.valid;
    }
  }

  if (!valid) {
    warn(getInvalidTypeMessage(name, value, expectedTypes), vm);
    return;
  }
  var validator = prop.validator;
  if (validator) {
    if (!validator(value)) {
      warn(
        'Invalid prop: custom validator check failed for prop "' + name + '".',
        vm
      );
    }
  }
}
}
```

1. 校验 prop.required（`vm.$options.props[key].required`）,如果`propsData[key]`没有给定值，那么警告提示。
2. 获取 type，校验 type 和 value 的类型是否一致。对于未通过的校验，给与警告。
3. 针对于提供了`prop.validator`方法的，如果`prop.validator`返回了 false，那么发出警告。

至此整个`validateProp`函数结束

## 2、总结：

`initProps`根据传入的`propsOptions`和`vm.$options.propsData`（父组件的传值），对`vm._props`进行了校验、响应式处理。并最终代理到自身`vm`上。

`propsOptions`是初始化时选项的`props`属性，也可以通过`vm.$options.props`访问，`vm.$options`继承了`vm.constructor.options`；`vm.$options.propsData`是父组件传递给子组件的值

`validateProp`函数是`initProps`的核心，简单来看，`validateProp`主要做了四个事情：

1. 获取`var value = propsData[key];`；
2. 处理 prop.type 是布尔值的情况，干预 value 的取值；
3. 如果 `value` 父组件没有提供，那么计算默认值，并且为其添加响应式；
4. 以上都是取值操作，最后通过`assertProp`校验并发出警告。返回这个`value`。

最终为这个`value`添加响应式处理
