# initRender

```js
function initRender(vm) {
  // 子虚拟dom的根节点
  vm._vnode = null; // the root of the child tree
  vm._staticTrees = null; // v-once cached trees
  var options = vm.$options;
  // 预置的节点
  var parentVnode = (vm.$vnode = options._parentVnode); // the placeholder node in parent tree
  // 渲染上下文
  var renderContext = parentVnode && parentVnode.context;
  // 插槽
  vm.$slots = resolveSlots(options._renderChildren, renderContext);
  // 作用域插槽
  vm.$scopedSlots = emptyObject;
  // bind the createElement fn to this instance
  // so that we get proper render context inside it.
  // args order: tag, data, children, normalizationType, alwaysNormalize
  // internal version is used by render functions compiled from templates
  vm._c = function(a, b, c, d) {
    return createElement(vm, a, b, c, d, false);
  };
  // normalization is always applied for the public version, used in
  // user-written render functions.
  vm.$createElement = function(a, b, c, d) {
    return createElement(vm, a, b, c, d, true);
  };

  // $attrs & $listeners are exposed for easier HOC creation. HOC 高阶组件
  // they need to be reactive so that HOCs using them are always updated
  var parentData = parentVnode && parentVnode.data;

  /* istanbul ignore else */
  {
    defineReactive$$1(
      vm,
      "$attrs",
      (parentData && parentData.attrs) || emptyObject,
      function() {
        !isUpdatingChildComponent && warn("$attrs is readonly.", vm);
      },
      true
    );
    defineReactive$$1(
      vm,
      "$listeners",
      options._parentListeners || emptyObject,
      function() {
        !isUpdatingChildComponent && warn("$listeners is readonly.", vm);
      },
      true
    );
  }
}
/**
 * Runtime helper for resolving raw children VNodes into a slot object.
 */
function resolveSlots(children, context) {
  if (!children || !children.length) {
    return {};
  }
  var slots = {};
  for (var i = 0, l = children.length; i < l; i++) {
    var child = children[i];
    var data = child.data;
    // remove slot attribute if the node is resolved as a Vue slot node
    if (data && data.attrs && data.attrs.slot) {
      delete data.attrs.slot;
    }
    // named slots should only be respected if the vnode was rendered in the
    // same context.
    if (
      (child.context === context || child.fnContext === context) &&
      data &&
      data.slot != null
    ) {
      var name = data.slot;
      var slot = slots[name] || (slots[name] = []);
      if (child.tag === "template") {
        slot.push.apply(slot, child.children || []);
      } else {
        slot.push(child);
      }
    } else {
      (slots.default || (slots.default = [])).push(child);
    }
  }
  // ignore slots that contains only whitespace
  for (var name$1 in slots) {
    if (slots[name$1].every(isWhitespace)) {
      delete slots[name$1];
    }
  }
  return slots;
}
```

## 2.1、`vm._staticTrees`的作用

```js
function renderStatic(index, isInFor) {
  var cached = this._staticTrees || (this._staticTrees = []);
  var tree = cached[index];
  // if has already-rendered static tree and not inside v-for,
  // we can reuse the same tree.
  if (tree && !isInFor) {
    return tree;
  }
  // otherwise, render a fresh tree.
  tree = cached[index] = this.$options.staticRenderFns[index].call(
    this._renderProxy,
    null,
    this // for render fns generated for functional component templates
  );
  markStatic(tree, "__static__" + index, false);
  return tree;
}
```

### 4.2、\_c vs \$createElement

### 4.3、$attrs 和 $listeners 的响应式
