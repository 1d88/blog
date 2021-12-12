# patch

> 通过前面的讨论，我们已经完成了`Vue`初始化，在`vm.$mount`之后，我们调用`vm._render`，最终执行的是`vm.__patch__`。

## createPatchFunction

```js
var patch = createPatchFunction({ nodeOps: nodeOps, modules: modules });
Vue.prototype.__patch__ = inBrowser ? patch : noop;
```

通过上面的代码我们可以得知，在浏览器端`vm.__patch__`通过上面的方法构建

```js
var hooks = ["create", "activate", "update", "remove", "destroy"];

function createPatchFunction(backend) {
  var i, j;
  var cbs = {};

  var modules = backend.modules;
  var nodeOps = backend.nodeOps;

  for (i = 0; i < hooks.length; ++i) {
    cbs[hooks[i]] = [];
    for (j = 0; j < modules.length; ++j) {
      if (isDef(modules[j][hooks[i]])) {
        cbs[hooks[i]].push(modules[j][hooks[i]]);
      }
    }
  }
  // ...很多代码
  return function patch(oldVnode, vnode, hydrating, removeOnly) {};
}
```

维护 vdom 的 hook 数组，在必要的 hook 时期调用。

## patch(oldVnode, vnode, hydrating, removeOnly)

```js
function patch(oldVnode, vnode, hydrating, removeOnly) {
  if (isUndef(vnode)) {
    if (isDef(oldVnode)) {
      invokeDestroyHook(oldVnode);
    }
    return;
  }
  var isInitialPatch = false;
  var insertedVnodeQueue = [];
}
```

如果新的节点不存在，旧的节点存在，那么说明是一个删除的过程，调用销毁的 hook:`invokeDestroyHook`

```js
if (isUndef(oldVnode)) {
  // empty mount (likely as component), create new root element
  isInitialPatch = true;
  createElm(vnode, insertedVnodeQueue);
}
```

如果新的节点存在，旧的节点不存在，那么是一个新建的过程：调用`createElm`，旧的节点不存在的场景是没有提供挂载参数

还有最后一种情况，新旧节点都存在时：

```js
var isRealElement = isDef(oldVnode.nodeType);
if (!isRealElement && sameVnode(oldVnode, vnode)) {
  patchVnode(oldVnode, vnode, insertedVnodeQueue, null, null, removeOnly);
} else {
  // do something
}
```

当旧的节点类型不是真实的 dom 对象，并且通过`sameVnode`函数比较新旧节点一致，那么进入 diff 算法。反之，进入新建节点和激活的过程。首先来看下`sameVnode`的算法，也就是什么情况会被判断为一个相同的节点

```js
function sameVnode(a, b) {
  return (
    a.key === b.key &&
    ((a.tag === b.tag &&
      a.isComment === b.isComment &&
      isDef(a.data) === isDef(b.data) &&
      sameInputType(a, b)) ||
      (isTrue(a.isAsyncPlaceholder) &&
        a.asyncFactory === b.asyncFactory &&
        isUndef(b.asyncFactory.error)))
  );
}
```

以下两个条件必须符合：

- 具有相同的 key 值，**并且**
- 下面两个条件之一
  1. 相同的 tag 类型，都是或不是注释节点，都有 data 属性，如果是 tag 是 input 类型，他们 type 属性一致，**或**
  2. 异步组件并且指向相同的异步工厂函数，也就是同一个异步组件

总而言之，具有相同的 key 值，tag 类型一致，或者是同一个异步组件。

我们跳过 diff 算法，先看真实 dom 新建的过程：如果当前 oldValue 是一个真实的元素类型 dom 节点，那么进入激活的过程，所谓激活的过程指的是 ssr 之后，服务器端已经生成了真的 dom 字符串在应用中，在客户端接收到 document 文档之后，不再重新生成 dom 而是激活这些 dom，和内部的应用建立绑定的关系。

```js
var SSR_ATTR = "data-server-rendered";
if (isRealElement) {
  // mounting to a real element
  // check if this is server-rendered content and if we can perform
  // a successful hydration.
  if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
    oldVnode.removeAttribute(SSR_ATTR);
    hydrating = true;
  }
  if (isTrue(hydrating)) {
    if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
      invokeInsertHook(vnode, insertedVnodeQueue, true);
      return oldVnode;
    } else {
      warn(
        "The client-side rendered virtual DOM tree is not matching " +
          "server-rendered content. This is likely caused by incorrect " +
          "HTML markup, for example nesting block-level elements inside " +
          "<p>, or missing <tbody>. Bailing hydration and performing " +
          "full client-side render."
      );
    }
  }
  // either not server-rendered, or hydration failed.
  // create an empty node and replace it
  oldVnode = emptyNodeAt(oldVnode);
}
```

如果节点是一个元素的节点，并且存在`data-server-rendered`属性，说明是需要进行客户端激活的，详细的内容在https://ssr.vuejs.org/zh/guide/hydration.html。如果存在这个属性，在真实的dom删除这个属性，并且标记`hydrating = true`，之后会通过这个标识来判断是否激活客户端。

通过`hydrate(oldVnode, vnode, insertedVnodeQueue)`这个函数来判断是否需要去激活，如果返回`true`,调用`invokeInsertHook`实现激活，并且返回整个旧节点，完成整个的`patch`过程。否则会有一个警告，告诉开发者激活失败，一般造成这个问题的原因，除了上面说到的标签标准化的问题，还有可能存在不通用的、带有副作用的代码。比如一个参与渲染的随机函数造成 dom 不一致。

如果并没有激活成功，那么 oldValue 会作为 `elm` 会被挂载在一个空的 vnode 上。

```js
if (isRealElement) {
  // ...
  oldVnode = emptyNodeAt(oldVnode);
}

// replacing existing element
var oldElm = oldVnode.elm;
var parentElm = nodeOps.parentNode(oldElm);

// create new node
createElm(
  vnode,
  insertedVnodeQueue,
  // extremely rare edge case: do not insert if old element is in a
  // leaving transition. Only happens when combining transition +
  // keep-alive + HOCs. (#4590)
  oldElm._leaveCb ? null : parentElm,
  nodeOps.nextSibling(oldElm)
);
```

app 初始化的场景时，`oldElm`是当前`div#app`应用的根节点，parentElm 是`div#app`的父级，比如像`body`节点。接下来调用`createElm`创建了当前组件的真实的 dom 节点，并将结果保存在了`vnode.elm`中；更新父组件中的预置节点，前提的条件是父组件存在。

```js
var emptyNode = new VNode("", {}, []);
// 是否可以打补丁
function isPatchable(vnode) {
  // vnode.componentInstance指向当前vnode绑定的组件实例
  // 如果当前节点存在 组件实例，
  while (vnode.componentInstance) {
    vnode = vnode.componentInstance._vnode;
  }
  return isDef(vnode.tag);
}
if (isDef(vnode.parent)) {
  var ancestor = vnode.parent;
  var patchable = isPatchable(vnode);
  while (ancestor) {
    for (var i = 0; i < cbs.destroy.length; ++i) {
      cbs.destroy[i](ancestor);
    }
    ancestor.elm = vnode.elm;
    if (patchable) {
      for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
        cbs.create[i$1](emptyNode, ancestor);
      }
      // #6513
      // invoke insert hooks that may have been merged by create hooks.
      // e.g. for directives that uses the "inserted" hook.
      var insert = ancestor.data.hook.insert;
      if (insert.merged) {
        // start at index 1 to avoid re-invoking component mounted hook
        for (var i$2 = 1; i$2 < insert.fns.length; i$2++) {
          insert.fns[i$2]();
        }
      }
    } else {
      registerRef(ancestor);
    }
    ancestor = ancestor.parent;
  }
}
```

一个 vnode 是否可以打补丁呢？通过判断`vnode.componentInstance._vnode`的 tag 是否存在，`vnode.componentInstance`指向当前的 vm 实例，`vm._vnode`指的是当前根节点。

上面代码触发的场景是：组件的根节点发生变化的时候，并且`sameVnode`返回 false，组件 vnode 的`parent`即不为空，这是一个递归逻辑，查找 vnode 的父级，调用`destroy hook`。销毁 vnode 父级的节点；这个递归的`destroy`为了销毁之前祖先节点，释放内存。然后通过`create`新建一个祖先。如果可以打补丁，调用`create hook`，调用`ancestor`的`insert cb`；如果不需要打补丁，调用`registerRef`函数。
最终如果 parentElm 存在，使用`removeVnodes`函数移除 oldVnode，或者 oldVnode.tag 存在，使用`invokeDestroyHook`销毁 oldVnode。

```js
// destroy old node
if (isDef(parentElm)) {
  removeVnodes([oldVnode], 0, 0);
} else if (isDef(oldVnode.tag)) {
  invokeDestroyHook(oldVnode);
}
```

最终调用`invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch); `激活 vnode 并返回 vnode.elm。

## invokeDestroyHook

## createElm

## registerRef

对于同步的子组件的构建触发点 在于 createPatchFunction 的 createComponent 函数（在 patch 阶段）， vnode 的 hook 里面，init 钩子会去触发构建 vnode 的 vm 实例，并且挂载；

对于异步的子组件的构建出发点 在于\_createElemnet 的 createComponent 函数（在 render 阶段声明的微任务）， 调用了 resolveAsyncComponent 函数，微任务中执行渲染 watcher 的强制更新，实现异步组件替换注释节点，实现挂载
