# `Scheduler`

`Watcher.prototype.update`中`queueWatcher`函数，也是线上环境自定义`watcher`必须调用的分支：如果不是`lazy watcher`、不需要同步执行`watcher`，那么`watcher`将进入一个队列函数`queueWatcher`：

```js
var MAX_UPDATE_COUNT = 100;

var queue = [];
var activatedChildren = [];
var has = {};
var circular = {};
var waiting = false;
var flushing = false;
var index = 0;
function queueWatcher(watcher) {
  var id = watcher.id;
  if (has[id] == null) {
    has[id] = true;
    if (!flushing) {
      queue.push(watcher);
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      var i = queue.length - 1;
      while (i > index && queue[i].id > watcher.id) {
        i--;
      }
      queue.splice(i + 1, 0, watcher);
    }
    // queue the flush
    if (!waiting) {
      waiting = true;

      if (!config.async) {
        flushSchedulerQueue();
        return;
      }
      nextTick(flushSchedulerQueue);
    }
  }
}
```

判断`has`是否存在这个 ID，如果不存在，添加这个 ID 到 `has` 缓存对象中。如果`flushing`是 false，表示没有在冲洗中，那么将当前的`watcher`放入队列数组中去；如果正在处于冲洗过程中，那么将当前的`watcher`放入队列的合适位置；如果不需要等待执行`flushSchedulerQueue`函数，这里如果配置了`config.async = false`,表示开启同步的方法更新`watcher`。否则在下一个时间片执行`flushSchedulerQueue`

```js
function flushSchedulerQueue() {
  currentFlushTimestamp = getNow();
  flushing = true;
  var watcher, id;

  // Sort queue before flush.
  // This ensures that:
  // 1. Components are updated from parent to child. (because parent is always
  //    created before the child)
  // 2. A component's user watchers are run before its render watcher (because
  //    user watchers are created before the render watcher)
  // 3. If a component is destroyed during a parent component's watcher run,
  //    its watchers can be skipped.
  queue.sort(function(a, b) {
    return a.id - b.id;
  });

  // do not cache length because more watchers might be pushed
  // as we run existing watchers
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index];
    if (watcher.before) {
      watcher.before();
    }
    id = watcher.id;
    has[id] = null;
    watcher.run();
    // in dev build, check and stop circular updates.
    if (has[id] != null) {
      circular[id] = (circular[id] || 0) + 1;
      if (circular[id] > MAX_UPDATE_COUNT) {
        warn(
          "You may have an infinite update loop " +
            (watcher.user
              ? 'in watcher with expression "' + watcher.expression + '"'
              : "in a component render function."),
          watcher.vm
        );
        break;
      }
    }
  }

  // keep copies of post queues before resetting state
  var activatedQueue = activatedChildren.slice();
  var updatedQueue = queue.slice();

  resetSchedulerState();

  // call component updated and activated hooks
  callActivatedHooks(activatedQueue);
  callUpdatedHooks(updatedQueue);

  // devtool hook
  /* istanbul ignore if */
  if (devtools && config.devtools) {
    devtools.emit("flush");
  }
}
```

`flushSchedulerQueue`冲洗调度队列。

1. 设置开始冲洗队列`flushing = true`。首先要做的是依据`watcher.id`排序整个`watcher`，`watcher.id`是自增的，排序的目的是：

   - 组件的更新是从父组件到子组件，因为父组件要先于子组件创建。
   - 一个组件的自定义`watcher`要先于渲染`watcher`，因为自定义`watcher`的创建在`initState`，渲染`watcher`在`Vue.prototype.$mount`创建。
   - 父组件的`watcher.run`中，如果一个组件被销毁，这个`watcher`会被跳过。

2. 遍历`watcher`队列，如果当前存在`watcher.before`，执行这个`watcher.before`；
3. 执行`watcher.run`，计算`value`并且执行`cb`回调。
4. `has`是用来判断当前`watcher`是否在调度队列中，`circular`判断循环调用次数，当一个`watcher.run`的次数超过`MAX_UPDATE_COUNT`，将会发出警告“是否存在 watcher 的循环调用”。
5. 获取`activatedChildren`，获取`updatedQueue`，调用`resetSchedulerState`重置调度任务状态：

```js
function resetSchedulerState() {
  index = queue.length = activatedChildren.length = 0;
  has = {};
  {
    circular = {};
  }
  waiting = flushing = false;
}
```

`queue.length = activatedChildren.length = 0`，可以通过设置数组长度为`0`，来达到清空数组的目的。`index = 0`，`has = {}`，`circular = {}`，`waiting = flushing = false`

6. 调用 hook:`callActivatedHooks`和`callUpdatedHooks`

```js
function callActivatedHooks(queue) {
  for (var i = 0; i < queue.length; i++) {
    queue[i]._inactive = true;
    activateChildComponent(queue[i], true /* true */);
  }
}
function activateChildComponent(vm, direct) {
  if (direct) {
    vm._directInactive = false;
    if (isInInactiveTree(vm)) {
      return;
    }
  } else if (vm._directInactive) {
    return;
  }
  if (vm._inactive || vm._inactive === null) {
    vm._inactive = false;
    for (var i = 0; i < vm.$children.length; i++) {
      activateChildComponent(vm.$children[i]);
    }
    callHook(vm, "activated");
  }
}
function callUpdatedHooks(queue) {
  var i = queue.length;
  while (i--) {
    var watcher = queue[i];
    var vm = watcher.vm;
    if (vm._watcher === watcher && vm._isMounted && !vm._isDestroyed) {
      callHook(vm, "updated");
    }
  }
}
```

`callActivatedHooks`遍历设置`vm._directInactive = true`，调用`activateChildComponent`激活子组件的状态。
`callUpdatedHooks`遍历调用`hook:updated`

7. 通知`devtool`。
