# vue observer

> 数据响应式核心

Dep、Watcher、Observer 调用图 ⏬
<img src="./images/vue源码调用图.png" width="1000px">

包括以下内容：

- Dep
- Watcher
- Observer
- Scheduler

首先讨论下 Dep

## 1、Dep

```js
var uid = 0;
var Dep = function Dep() {
  this.id = uid++;
  this.subs = [];
};

Dep.prototype.addSub = function addSub(sub) {
  this.subs.push(sub);
};

Dep.prototype.removeSub = function removeSub(sub) {
  remove(this.subs, sub);
};

Dep.prototype.depend = function depend() {
  if (Dep.target) {
    Dep.target.addDep(this);
  }
};

Dep.prototype.notify = function notify() {
  // stabilize the subscriber list first
  var subs = this.subs.slice();
  if (!config.async) {
    subs.sort(function(a, b) {
      return a.id - b.id;
    });
  }
  for (var i = 0, l = subs.length; i < l; i++) {
    subs[i].update();
  }
};
```

`Dep`类主要是维护了依赖，是操作`Watcher`工具集合。主要包含下面的属性和方法：

- `uid`：当前`dep`的 uid，自增，主要标识一个`Dep`实例的唯一性，在`Watcher`内部方便查找。
- `subs`：当前依赖的`watcher`的集合；
- `Dep.prototype.addSub`，向`subs`添加一个`watcher`；
- `Dep.prototype.removeSub`，查找`subs`删除这个`watcher`；
- `Dep.prototype.depend`，调用当前`watcher`的`addDep` 方法，添加当前`dep`到`watcher`；添加当前`watcher`到`dep`。
- `Dep.prototype.notify`：
  - `config.async`：异步执行更新。如果为了供 Vue Test Utils 使用设置为 `false`，将导致性能问题；在这里如果设置为`false`，会重新排序当前`subs`里面的所有`watcher`。因为同步模式调度不会重新排序 subs。为了确保它的执行顺序，需要在这里排序。
  - 遍历执行`subs`中的`watcher`的`update`方法。

### 1.1、`pushTarget`和`popTarget`

调用`pushTarget`之后，使用的`watcher`就是`Dep.target`的引用，所有依赖的观察者都指向这个`watcher`。所以说一个时间点只有一个`watcher`在执行。

```js
Dep.target = null;
var targetStack = [];

function pushTarget(target) {
  targetStack.push(target);
  Dep.target = target;
}

function popTarget() {
  targetStack.pop();
  Dep.target = targetStack[targetStack.length - 1];
}
```

使用`Dep.target`有几处判断的逻辑：

1. `defineReactive`函数中的`reactiveGetter`函数中，如果存在`Dep.target`，才会进行依赖的收集；
2. 创建计算属性的`createComputedGetter`函数中，如果存在`Dep.target`，才会进行依赖的收集；
3. `dep.depend`的函数，如果存在`Dep.target`，才会进行依赖的收集；

综上可以看出，主要是使用`Dep.target`来断定存在一个有效的`watcher`，避免无效的依赖收集。
