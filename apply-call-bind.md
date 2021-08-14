# apply、call、bind

## apply

### 语法

> func.apply(thisArg,[argsArray])

- thisArg：目标函数的 this 指向；非严格模式下：

  - null 和 undefined 自动替换为指向全局对象
  - 原生类型会被包装

    ```js
    (function() {
      console.log(this); // Number {3}
    }.apply(3));

    (function() {
      console.log(this); // String {"1"}
    }.apply("1"));

    (function() {
      console.log(this); // Boolean {true}
    }.apply(true));

    (function() {
      console.log(this); // Window {...}
    }.apply(null));

    (function() {
      console.log(this); // Window {...}
    }.apply(undefined));
    ```

- argsArray 函数的参数，数组或者类数组；注意：

  - 拥有将数组、类数组展开的功能
  - 如果是 null 或 undefined，表示不需要传入任何参数
  - ES5 开始支持类数组对象比如
    ```js
    {
      length:2,
      0:1,
      1:2
    }
    (function(){
      console.log(arguments)
      // output Arguments(2) [1, 2, callee: ƒ, Symbol(Symbol.iterator): ƒ]
    }).apply(null,{
      length:2,
      0:1,
      1:2
    })
    // 类似于vue的一个例子
    Array.apply(null,{length:20})
    // [undefined, ... ]
    ```

- 返回值：调用有指定 this 值和参数的函数的结果。

### 示例

- 接受可变参数的方法，将数组展开传入

  ```js
  Array.prototype.push.apply([], [1, 2, 3, 4]);
  // 4  push返回数组的长度
  Math.max.apply(null, [1, 2, 3]);
  // 3
  ```

- 注意： jscore 引擎硬编码限制，传入参数上线为 `65535`个。超出限制一些引擎抛出异常，有的会截断参数

---

## call

### 语法

> function.call(thisArg, arg1, arg2, ...)

- thisArg 目标函数的 this 指向；注意：和 apply 一致
- arg1, arg2, ... 参数列表
- 返回值：调用有指定 this 值和参数的函数的结果。

---

## bind

### 语法

> function.bind(thisArg[, arg1[, arg2[, ...]]])

- thisArg 目标函数的 this 指向；注意：

  - new 当前目标函数，则忽略该值，也就是改变指针不会失效

  ```js
  var A = function() {
    console.log(this.name);
  };
  var b = { name: 123 };
  A(); // window.name
  new A(); // undefined
  var ab = A.bind(b);
  ab(); // 123
  new A(); // undefined
  ```

  - 在 setTimeout 绑定回调函数时，传入任何原始值都变为对象，普通情况下也如此

  ```js
  setTimeout(
    function() {
      console.log(this); // Number {123}
    }.bind(123)
  );
  (function() {
    console.log(this); // Number {123}
  }.bind(123)());
  ```

  - 不传递参数、 thisArg 为 null 或者 undefined，目标函数的 this 被视为`新函数`的 this，即全局对象

  ```js
  // 示例1
  var a = function() {
    console.log(this);
  };
  a.bind()();
  // Window {}
  // 示例2
  var b = {
    name: "tom",
    sayName() {
      conosle.log(this);
    },
  };
  b.sayName.bind()();
  // Window {}
  // 示例3
  var b = {
    name: "tom",
    sayName: function() {
      conosle.log(this);
    }.bind(),
  };
  b.sayName();
  // Window {}
  ```

- arg1,arg2,...初始化参数，会预置到新函数中

  ```js
  var a = function() {
    console.log(this);
    console.log(arguments);
  };
  var b = { name: 123 };
  a.bind(b, 1, 2, 3)(4, 5) // Arguments(5) [1, 2, 3, 4, 5, callee: ƒ, Symbol(Symbol.iterator): ƒ] // { name : 123 }
  ``;
  ```

- 返回值：一个原函数的拷贝，并且绑定了 this 和初始化参数

### 示例

1. `返回一个新的函数`，函数 this 指向绑定的对象，call， bind 和 apply 无法再变更这个新函数的 this 指向

```js
// 绑定一个原始类型，自动转换为其包装对象作为this
(function() {
  console.log(this); // Number {123}
}.bind(1)());

// 绑定一个原始类型，通过 call 和 apply 去改变它的 this
var p = function() {
  console.log(this);
}.bind(1);
p(); // Number {123}

// 尝试改变 p 函数的指针 为 Boolean {true}；失败
p.call(true); // Number {123}
// 尝试改变 p 函数的指针 为 Window {...}；失败
p.call(); //  Number {123}
// 综上，call 和 apply 是无法改变 p 函数 this 指向
// 使用 bind 重新绑定 true,同样失败
p = p.bind(true);
p();
// Number {1}
```

2. 函数的参数预设

```js
var a = function() {
  console.log(this);
  console.log(arguments);
};
var b = { name: 123 };
a.bind(null, 1, 2, 3)(4, 5); // Window{}
//Arguments(5) [1, 2, 3, 4, 5, callee: ƒ, Symbol(Symbol.iterator): ƒ]
```

3. setTimeout 的使用

```js
var a = {
  name: "tom",
  sayName() {
    console.log(this.name);
  },
  waitSay() {
    window.setTimeout(this.sayName.bind(this), 1000);
  },
};
a.waitSay();
```

4. react 中事件绑定的使用

```jsx
export default class Demo extends React.Component {
  onClick() {
    console.log(this);
  }
  render() {
    // 这样保证onClick中可以正确的访问到 this
    return <div onClick={this.onClick.bind(this)}></div>;
  }
}
```

5. bind 的 polyfill

```js
// 最简单的实现，没有考虑 new 的情况
Function.prototype.bind =
  Function.prototype.bind ||
  function() {
    var slice = Array.prototype.slice;
    var context = arguments[0];
    var args = slice.call(arguments, 1);
    var self = this;
    return function() {
      return self.apply(context, args.concat(slice.call(arguments)));
    };
  };
```
