# React v15

![react-src-struct](./react-src-struct.png)

reconciler 协调器，它是最为核心的部分，包含 React 中自定义组件的实现 (ReactCompositeComponent)、组件生命周期机制、setState 机制(ReactUpdates、ReactUpdateQueue)、DOM diff 算法（ReactMultiChild）等重要的特性方法

## Virtaul DOM

构建一套简易 Virtual DOM 模型并不复杂，它只需要具备一个 DOM 标签所需的基本元素即可：

```js
const virtaulDOM = {
  // 标签名
  tagName: 'div',

  // 属性
  properties: {
    // 样式、属性、事件等
    style: {},
  },

  // 子节点
  children: [],

  // 唯一标识
  key: 1,
}
```

![react-element](./react-element.png)

### 创建 ReactElement

```js
// Create and return a new ReactElement of the given type.
export function createElement(type, config, children) {
  let propName;

  // Reserved names are extracted
  const props = {};

  let key = null;
  let ref = null;
  let self = null;
  let source = null;

  if (config != null) {
    if (hasValidRef(config)) {
      ref = config.ref;
    }
    if (hasValidKey(config)) {
      key = '' + config.key;
    }

    self = config.__self === undefined ? null : config.__self;
    source = config.__source === undefined ? null : config.__source;
    // Remaining properties are added to a new props object
    for (propName in config) {
      if (
        hasOwnProperty.call(config, propName) &&
        !RESERVED_PROPS.hasOwnProperty(propName)
      ) {
        props[propName] = config[propName];
      }
    }
  }

  // Children can be more than one argument, and those are transferred onto
  // the newly allocated props object.
  const childrenLength = arguments.length - 2;
  if (childrenLength === 1) {
    props.children = children;
  } else if (childrenLength > 1) {
    const childArray = Array(childrenLength);
    for (let i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2];
    }
    props.children = childArray;
  }

  // Resolve default props
  if (type && type.defaultProps) {
    const defaultProps = type.defaultProps;
    for (propName in defaultProps) {
      if (props[propName] === undefined) {
        props[propName] = defaultProps[propName];
      }
    }
  }
  return ReactElement(
    type,
    key,
    ref,
    self,
    source,
    ReactCurrentOwner.current,
    props,
  );
}
```

### 初始化组件入口

调用 instantiateReactComponent 判断 node 类型来区分不同入口

* node 为空时，说明 node 不存在，则初始化空组件 ReactEmptyComponent.create(instantiateReactComponent)

* node 为对象，说明 node 是 DOM 或自定义组件

    * element 为字符串，则是 DOM，则 ReactNativeComponent.createInternalComponent(element)

    * 否则是自定义组件（class、function），初始化自定义组件 ReactCompositeComponentWrapper()

* node 为字符串或数字时，初始化文本组件 ReactNativeComponent.createInstanceForText(node)

![init-react-component](./init-react-component.png)

### 文本组件

![react-text-component](./react-text-component.png)

### DOM 标签组件

1. 属性更新

    当执行 mountComponent 方法时，ReactDOMComponent 首先会生成标记和标签，通过 this.createOpenTagMarkupAndPutListeners(transaction) 来处理 DOM 节点的属性和事件。

    * 如果存在事件，则针对当前的节点添加事件代理，即调用 enqueuePutListener(this, propKey, propValue, transaction)

    * 如果存在样式，首先会对样式进行合并操作 Object.assign({}, props.style)，然后通过 CSSPropertyOperations.createMarkupForStyles(propValue, this) 创建样式

    * 通过 DOMPropertyOperations.createMarkupForProperty(propKey, propValue) 创建属性

    * 通过 DOMPropertyOperations.createMarkupForID(this._domID) 创建唯一标识

    当执行 receiveComponent 方法时，ReactDOMComponent 会通过 this.updateComponent(transaction, prevElement, nextElement, context) 来更新 DOM 节点属性

    1. 删除不需要的旧属性

    2. 更新新属性

2. 子节点更新

    获取节点内容 props.dangerouslySetInnerHTML。如果存在子节点，则通过 this.mountChildren(childrenToUse, transaction, context) 对子节点进行初始化渲染

    当执行 receiveComponent 方法时，ReactDOMComponent 会通过 this._updateDOMChildren(lastProps, nextProps, transaction, context) 来更新 DOM 内容和子节点

    1. 删除不需要的子节点和内容

    2. 更新子节点和内容

![react-dom-component](./react-dom-component.png)

### 自定义组件

![react-composite-component](./react-composite-component.png)

## 生命周期

组件，其实就是有限状态机 (FSM)，通过状态渲染对应的界面，且每个组件都有自己的生命周期，它规定了组件的状态和方法需要在哪个阶段改变和执行

有限状态机，表示有限个状态以及在这些状态之间的转移和动作等行为的模型。一般通过状态、事件、转换和动作来描述有限状态机

React 正是利用这一概念，通过管理状态来实现对组件的管理。例如，某个组件有显示和隐 藏两个状态，通常会设计两个方法 show() 和 hide() 来实现切换，而 React 只需要设置状态 setState({ showed: true/false }) 即可实

## setStaet

setState 通过一个队列机制实现 state 更新。当执行 setState 时，会将需要更新的 state 合并 后放入状态队列，而不会立刻更新 this.state，队列机制可以高效地批量更新 state

## diff

## patch
