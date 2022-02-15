# vnode

```js
var VNode = function VNode(
    tag,
    data,
    children,
    text,
    elm,
    context,
    componentOptions,
    asyncFactory
  ) {
    this.tag = tag; // 标签 字符串
    this.data = data; // 数据对象
    this.children = children; // vnode子数组
    this.text = text; // 文本节点内容
    this.elm = elm; // 和当前vnode绑定的标签
    this.ns = undefined; // namespace
    this.context = context; // 当前的vue组件
    this.fnContext = undefined; 
    this.fnOptions = undefined;
    this.fnScopeId = undefined;
    this.key = data && data.key; // vnode的key属性
    this.componentOptions = componentOptions; // 组件的options属性
    this.componentInstance = undefined; // 组件的实例
    this.parent = undefined; // 当前vnode的父级
    this.raw = false; // 文本
    this.isStatic = false; // 是否是静态的节点，静态节点只会渲染第一次，之后不会响应数据的变化
    this.isRootInsert = true;  // 是否是根部节点插入
    this.isComment = false; // 是否是注释节点
    this.isCloned = false; // 是否是克隆的节点
    this.isOnce = false; // 是否只渲染一次
    this.asyncFactory = asyncFactory; // 是否是异步组件对应的vnode
    this.asyncMeta = undefined;
    this.isAsyncPlaceholder = false; // 是否是异步组件的预置及诶单
  };
  var prototypeAccessors = { child: { configurable: true } };

  // DEPRECATED: alias for componentInstance for backwards compat.
  /* istanbul ignore next */
  // get child 访问当前vnode的组件实例
  prototypeAccessors.child.get = function () {
    return this.componentInstance;
  };

  Object.defineProperties(VNode.prototype, prototypeAccessors);
```
## 数据对象
```js
interface VNodeData {
  key?: string | number; // vnode key
  slot?: string; // 插槽
  scopedSlots?: { [key: string]: ScopedSlot | undefined }; // 作用域插槽
  ref?: string; // ref
  refInFor?: boolean; // 是否是for中的ref引用
  tag?: string; // tag
  staticClass?: string; //
  class?: any; // v-bind:class 
  staticStyle?: { [key: string]: any };
  style?: string | object[] | object; // v-bind:style
  props?: { [key: string]: any }; // 实例属性
  attrs?: { [key: string]: any }; // 普通的html属性
  domProps?: { [key: string]: any }; // dom 对象的属性
  hook?: { [key: string]: Function }; 
  on?: { [key: string]: Function | Function[] }; // 自定义事件
  nativeOn?: { [key: string]: Function | Function[] }; // 原生的事件
  transition?: object; // 过度
  show?: boolean; // 是否展示
  inlineTemplate?: {
    render: Function;
    staticRenderFns: Function[];
  };
  directives?: VNodeDirective[]; // 指令
  keepAlive?: boolean; // keepalive
} 

```
