# react
> development版本，版本号v17.0.2
## Component

声明一个类组件，继承于`Component`:

```js
import {Component} from 'react'
export default class Demo extends Component{

}
```
### 构造函数
```js
 function Component(props, context, updater) {
    this.props = props;
    this.context = context; 
    // If a component has string refs, we will assign a different object later.
    this.refs = emptyObject; 
    // We initialize the default updater but the real one gets injected by the
    // renderer.
    this.updater = updater || ReactNoopUpdateQueue;
  }
```
第一个参数是props属性，第二个参数执行上下文，第三个函数是`updater`对象。
props是来自于父组件的属性
context是当前的组件执行上下文
refs一种访问DOM或者react元素的方法
updater默认设置为`ReactNoopUpdateQueue`，是一个“未实现”的更新对象。

### Component.prototype.isReactComponent = {}

### Component.prototype.setState
```js
 Component.prototype.setState = function (partialState, callback) {
    if (
      !(
        typeof partialState === "object" ||
        typeof partialState === "function" ||
        partialState == null
      )
    ) {
      {
        throw Error(
          "setState(...): takes an object of state variables to update or a function which returns an object of state variables."
        );
      }
    }

    this.updater.enqueueSetState(this, partialState, callback, "setState");
  };
```
传入两个参数，一个是要设置的对象或者函数，另一个是回调函数。`partialState`参数必须是一个对象，或者返回对象的函数。调用`this.updater.enqueueSetState`的方法。

### Component.prototype.forceUpdate
```js
  Component.prototype.forceUpdate = function (callback) {
    this.updater.enqueueForceUpdate(this, callback, "forceUpdate");
  };

```
强制执行组件的update，调用`this.updater.enqueueForceUpdate`。


