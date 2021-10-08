# `Observer`

## 1、`Observer`构造函数

```js
var arrayProto = Array.prototype;
var arrayMethods = Object.create(arrayProto);
var arrayKeys = Object.getOwnPropertyNames(arrayMethods);

var Observer = function Observer(value) {
  this.value = value;
  this.dep = new Dep();
  this.vmCount = 0;
  def(value, "__ob__", this);
  if (Array.isArray(value)) {
    if (hasProto) {
      protoAugment(value, arrayMethods);
    } else {
      copyAugment(value, arrayMethods, arrayKeys);
    }
    this.observeArray(value);
  } else {
    this.walk(value);
  }
};
```

每一个`Observer`都会存在一个`Dep`实例，使用`Object.defineProperty`定义一个`__ob__`属性指向`Observer`实例，如果传入的对象是一个数组，调用`this.observeArray`，如果是个对像，调用`this.walk`。

当传入的 value 是一个数组的时候，如果当前的浏览器支持`"__proto__" in {}`，使用`protoAugment`方法，否则使用`copyAugment`。（\***\*proto\*\***有更多的浏览器支持，并且使一个标准，未来有更多浏览器实现它，也可以使用`setPrototypeOf`）

无论通过`protoAugment`还是`copyAugment`，都是向当前 value 增加数组的能力。

```js
/**
 * Augment a target Object or Array by intercepting
 * the prototype chain using __proto__
 */
function protoAugment(target, src) {
  target.__proto__ = src;
}

/**
 * Augment a target Object or Array by defining
 * hidden properties.
 */
/* istanbul ignore next */
function copyAugment(target, src, keys) {
  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i];
    def(target, key, src[key]);
  }
}
```

`protoAugment`修改`__proto__`来改变它的原型调用链，`copyAugment`是利用`Object.defineProperty`重新定义在`target`。

## 1.1、`Observer`原型方法

```js
Observer.prototype.walk = function walk(obj) {};
Observer.prototype.observeArray = function observeArray(items) {};
```

## 1.2、`Observer.prototype.walk`

```js
Observer.prototype.walk = function walk(obj) {
  var keys = Object.keys(obj);
  for (var i = 0; i < keys.length; i++) {
    defineReactive$$1(obj, keys[i]);
  }
};
```

针对于 value 是一个对象，枚举所有的属性，对其进行响应式处理

## 1.3、`Observer.prototype.observeArray`

```js
Observer.prototype.observeArray = function observeArray(items) {
  for (var i = 0, l = items.length; i < l; i++) {
    observe(items[i]);
  }
};
```

针对于 value 是一个数组，遍历数组中的每一项，调用`observe`函数。

## 2、`observe`函数

```js
function observe(value, asRootData) {
  if (!isObject(value) || value instanceof VNode) {
    return;
  }
  var ob;
  if (hasOwn(value, "__ob__") && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else if (
    shouldObserve &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    ob = new Observer(value);
  }
  if (asRootData && ob) {
    ob.vmCount++;
  }
  return ob;
}
```

这个函数主要是判断是否可以给`value`创建一个 `Observer`。如果存在那么返回已经存在的`ob`，否则新建一个新的`ob`。

1. 如果传入的观察对象不是一个 **对象** 或者 是一个**VNode**，直接返回`undefined`；这步确保传入的是可以观察的数据类型
2. 如果已经绑定过`__ob__`，并且`__ob__`是`Observer`的实例，那么`ob = value.__ob__`；这步确保避免多次观察
3. `shouldObserve = true`，并且不是 ssr，是一个纯对象或者数组，可以被拓展，不是 Vue 实例；那么`new Observer(value)`
4. 如果是根数据，`ob.vmCount++`，返回 ob。

## 3、`defineReactive`函数（defineReactive\$\$1）

```js
function defineReactive(obj, key, val, customSetter, shallow) {
  var dep = new Dep();

  var property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) {
    return;
  }

  // cater for pre-defined getter/setters
  var getter = property && property.get;
  var setter = property && property.set;
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key];
  }

  var childOb = !shallow && observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      var value = getter ? getter.call(obj) : val;
      if (Dep.target) {
        dep.depend();
        if (childOb) {
          childOb.dep.depend();
          if (Array.isArray(value)) {
            dependArray(value);
          }
        }
      }
      return value;
    },
    set: function reactiveSetter(newVal) {
      var value = getter ? getter.call(obj) : val;
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return;
      }
      /* eslint-enable no-self-compare */
      if (customSetter) {
        customSetter();
      }
      // #7981: for accessor properties without setter
      if (getter && !setter) {
        return;
      }
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      childOb = !shallow && observe(newVal);
      dep.notify();
    },
  });
}
```

这个函数是 `Vue Observer`的核心，通过这个方法为对象创建响应式。
`obj`：一个对象
`key`：对象的属性名
`val`：对象的值
`customSetter`：自定义`setter`
`shallow`：深层次观察

1. 创建一个`Dep`；
2. 如果当前传入的这个对象不可以配置其元属性，那么直接返回，因为设置读写描述符的操作需要`configurable`不为`false`；
3. 获取其`getter`和`setter`属性并储存起来；
4. 如果`getter`不存在，`setter`存在，并且传入了两个参数，初始化其第三个参数`val = obj[key];`这一步起到参数兼容的作用；
5. 如果深入观察，那么给`val`绑定观察者。
6. `Object.defineProperty(obj, key,{set:...,get:...})`重写`set`和`get`方法。至此结束，数据拥有了响应式。

## 3.1、`reactiveGetter`函数

```js
function reactiveGetter() {
  var value = getter ? getter.call(obj) : val;
  if (Dep.target) {
    dep.depend();
    if (childOb) {
      childOb.dep.depend();
      if (Array.isArray(value)) {
        dependArray(value);
      }
    }
  }
  return value;
}
```

`reactiveGetter`主要进行依赖的收集

1. 如果存在`getter`那么调用`getter`获取`value`的值，否则使用`val`；
2. 确保`Dep.target`已经指向了一个`Watcher`实例，调用`dep.depend`，将访问当前闭包中的`Dep`实例，调用当前`Dep.target.addDep`方法，`Dep.target.addDep`方法中调用了`dep.addSub`，这样在`obj`的`key`属性存在一个`dep`可以获取到
   和它相关的`watcher`
3. 如果深入观察，那么也要调用`childOb.dep.depend()`
4. 如果当前的 value 是一个数组，那么调用`dependArray`。至此收集依赖完成。

## 3.2、`reactiveSetter`函数

```js
function reactiveSetter(newVal) {
  var value = getter ? getter.call(obj) : val;
  /* eslint-disable no-self-compare */
  if (newVal === value || (newVal !== newVal && value !== value)) {
    return;
  }
  /* eslint-enable no-self-compare */
  if (customSetter) {
    customSetter();
  }
  // #7981: for accessor properties without setter
  if (getter && !setter) {
    return;
  }
  if (setter) {
    setter.call(obj, newVal);
  } else {
    val = newVal;
  }
  childOb = !shallow && observe(newVal);
  dep.notify();
}
```

`reactiveSetter`主要进行通知派发

1. 如果存在`getter`那么调用`getter`获取`value`的值，否则使用`val`；
2. 如果设置的值和步骤 1 获取的值一致，那么直接返回
3. 如果存在调用自定义`setter`
4. 如果`getter`存在但是`setter`不存在，直接返回
5. 如果`setter`调用`setter`，否则 val = newVal;
6. 如果深入观察，深入观察内部值得变化
7. 通知`dep`开发派发。
