# notes

## 事件系统

React 基于 Virtual DOM 实现了一个 SyntheticEvent (合成事件)层，我们所定义的事件 处理器会接收到一个 SyntheticEvent 对象的实例，它完全符合 W3C 标准，不会存在任何 IE 标 准的兼容性问题。并且与原生的浏览器事件一样拥有同样的接口，同样支持事件的冒泡机制，我们可以使用 stopPropagation() 和 preventDefault() 来中断它

所有事件都自动绑定到最外层上。如果需要访问原生事件对象，可以使用 nativeEvent 属性

### 事件委派

不会把事件处理函数直接绑定到真实的节点上，而是把所有事件绑定到结构的最外层，使用一个统一的事件监听器，这个事件监听器上维持了一个映射来保存所有组件内部的事件监听和处理函数。当组件挂载或卸载时，只是在这个统一的事件监听器上插入或删除一些对象；当事件发生时，首先被这个统一的事件监听器处理，然后在映射里找到真正的事件处理函数并调用。这样做简化了事件处理和回收机制，效率也有很大提升。

### this 绑定

绑定到组件的实例上

```jsx
class App extends React.Component {
  handleClick() {
    console.log('Clicked!')
  }

  render() {
    return <button onClick={this.handleClick.bind(this)}>Click Me</button>
  }
}
```

```jsx
class App extends React.Component {
  constructor() {
    super()

    this.handleClick = this.handleClick.bind(this)
  }

  handleClick() {
    console.log('Clicked!')
  }

  render() {
    return <button onClick={this.handleClick}>Click Me</button>
  }
}
```

在 onClick 上 `this.handleClick.bind(this)` 相比于在 constructor 中 `this.handleClick = this.handleClick.bind(this)`，由于每次调用事件监听器时都会执行绑定操作，而在构造器中只执行一次，所以性能不如第二种好

> 双冒号提案：如果方法只绑定，不传参，可以用 `onClick={::this.handleClick}` 代替，可使用 babel 支持

## 原生事件

通过 ref 使用

在 React 中使用 DOM 原生事件时，一定要在组件卸载时手动移除，否则很可能出现内存泄漏的问题。而使用合成事件系统时则不需要，因为 React 内部已经帮你妥善地处理了

当实现点击一个按钮，出现二维码，而点击二维码之外的地方，二维码消失时，以前原生可以用事件委托实现，现在 React 中如果也用事件委托实现就需要给 document 对象添加原生事件了

```jsx
class Popup extends React.Component {
  state = { show: false }

  componentDidMount() {
    document.body.addEventListener('click', this.hideQrcode)
  }

  componentWillUnmount() {
    document.body.removeEventListener('click', this.hideQrcode)
  }

  showQrcode = () => {
    this.setState({ show: true })
  }

  hideQrcode = () => {
    this.setState({ show: false })
  }

  render() {
    return (
      <div>
        <img src={qrcode} style={{ display: this.state.show ? 'block' : 'none' }} />
        <button onClick={this.showQrcode}>show qr-code</button>
      </div>
    )
  }
}
```

现在大体实现了，但点击二维码时也会隐藏二维码

按照以前的写法，我们可以在二维码上点击时阻止冒泡：

```jsx
handleClickQrcode = e => {
  e.stopPropagation()
}

render() {
  return (
    <div>
      <img
        src={qrcode}
        onClick={handleClickQrcode}
        style={{ display: this.state.show ? 'block' : 'none' }}
      />
      <button onClick={this.showQrcode}>show qr-code</button>
    </div>
  )
}
```

但是并不行，因为 handleClickQrcode 的事件是 React 的合成事件，只是在最外层的容器进行了绑定，并依赖事件的冒泡机制完成了委派。也就是说，事件没有直接绑定上 img 元素上，所以使用 e.stopPropagation 并没有用

```jsx
componentDidMount() {
  document.body.addEventListener('click', this.hideQrcode)
  document.querySelector('img').addEventListener('click', this.stopPropagation)
}

componentWillUnmount() {
  document.body.removeEventListener('click', this.hideQrcode)
  document.querySelector('img').addEventListener('click', this.stopPropagation)
}

stopPropagation = e => e.stopPropagation()
```

通过原生事件阻止冒泡，当然这样很麻烦，而且事件委托时我们一般用 e.target 判断

```jsx
hideQrcode = () => {
  if (e.target && e.target.matches('img')) return
  this.setState({ show: false })
}
```

> 其他方案：把二维码视为一个弹窗，二维码之外的部分是一个透明的层，整体盖住整个屏幕，点击它透明层整体消失

所以应避免合成事件和原生事件混用，阻止合成事件的冒泡只能只能阻止合成事件，无法阻止原生事件的冒泡，反之，在原生事件中阻止冒泡却可以阻止合成事件的传播

实际上，React 的合成事件系统只是原生 DOM 事件系统的一个子集。它仅仅实现了 DOM Level 3 的事件接口，并且统一了浏览器间的兼容问题。有些事件 React 并没有实现，或者受某些 限制没办法去实现，比如 window 的 resize 事件

由于在开发中使用事件捕获的意义并不大，所以 React 没有实现事件捕获，符合“二八原则”

## 表单

每当表单的状态发生变化时，都会被写入到组件的 state 中，这种组件在 React 中被称为受控组件(controlled component)。在受控组件中，组件渲染出的状态与它的 value 或 checked prop 相对应。React 通过这种方式消除了组件的局部状态，使得应用的整个状态更加可控

表单的数据源于组件的 state，并通过 props 传入，实现了单向数据绑定，然后又通过 onChange 将新的数据传回 state，实现了双向数据绑定

非受控组件是一种反模式，他的值不受组件的 state 和 props 控制，通常需要 ref 进行操控，所以并不推荐

## 样式

通过传递 className props 来修改组件的样式，className 也是组件的一个属性

### CSS 模块化遇到了哪些问题？

CSS 模块化是为了解决 CSS 样式的导入与导出问题，灵活按需导入以便复用代码，导出时要能够隐藏内部作用域，以免造成全局污染

Sass、Less、PostCSS 等解决了 CSS 编程能力弱的问题，但没有解决模块的问题

* 全局污染：CSS 使用全局选择器的机制来设置样式，优点是方便重写样式，缺点是所有的样式都全局生效，很容易污染，所以出现了 !important、inline !important、复杂的选择器权重。Web-Components 的 Shadow DOM 能解决这个问题，但是样式彻底局部化，无法外部修改样式，丧失了灵活性

* 依赖管理不彻底：组件应该是独立的，引入 CSS 时，应该只引入他所需要的 CSS 样式，而 Sass、Less 不能实现对每个组件都编译出单独的 CSS，引入所有 CSS 又会浪费。JavaScript 的模块化已经成熟，所以可以通过 Webpack 的 css-loader 使用 JavaScript 来管理 CSS

* 无法共享变量：复杂组件有时需要 JavaScript 和 CSS 共同处理样式，就会造成 JavaScript 和 CSS 中的变量冗余，而 CSS 的预处理语言和 CSS 变量（--var）不能提供跨 JavaScript 和 CSS 变量的能力

* 代码压缩不彻底

所以出现了完全的 CSS-in-JS，相当于完全抛弃 CSS，在 JS 中用 hash 映射来写 CSS。但这样过于激进，比如 styled-components 只能用于与他适配的，不能直接用于原生，所以出现了 CSS Modules

### CSS Modules

:import :export 两个新增的伪类来解决导入导出问题，但实在太繁琐，我们一般结合 webpack 的 css-loader，就可以在 CSS 中定义样式，在 JavaScript 文件中导入

```css
/* components/Button.css */
.normal { /* some styles */ }
.disabled { /* some styles */ }
```

```js
/* components/Button.js */
import styles from './Button.modules.css';
console.log(styles)
// =>
// Object {
//   normal: 'button--normal-abc5436',
//   disabled: 'button--disabled-def884',
// }
buttonElem.outerHTML = `<button class=${styles.normal}>Submit</button>
```

样式默认局部：

```css
.normal {
  color: green;
}
/* 以上与下面等价 */
:local(.normal) {
  color: green;
}
/* 定义全局样式 */
:global(.btn) {
  color: red;
}
/* 定义多个全局样式 */
:global {
  .link {
    color: green;
  }
  .box {
    color: yellow;
  }
}
```

使用 composes 组合样式

```css
.classNameA {
  color: green;
}

.classNameB {
  background: red;
}

.otherClassNameA {
  composes: classNameA classNameB;
  color: yellow;
}
```
生成的 HTML 如下：

```html
<button class="button--base-abc53 button--normal-abc53"> Processing... </button>
```

```css
.otherClassNameB {
  composes: globalClassName from global;
}

.otherClassNameC {
  composes: className from "./style.css";
}
```

> BEM 命名：
> Block：对应模块名，如 Dialog
> Element：对应模块中的节点名 Confirm Button
> Modifier：对应节点相关的状态，如 disabled 和 highlight

BEM 最终得到的 class 名为 dialog__confirm-button--highlight。使用双符号 __ 和 -- 是为 了与区块内单词间的分隔符区分开来。虽然看起来有些奇特，但 BEM 被非常多的大型项目采用。
CSS Modules 中 CSS 文件名恰好对应 Block 名，只需要再考虑 Element 和 Modifier 即可。BEM 对应到 CSS Modules 的做法是：

```css
/* .dialog.css */
.ConfirmButton--disabled {}
```

CSS Modules 是对现有的 CSS 做减法。为了追求简单可控，作者建议遵循如下原则：

* 不使用选择器，只使用 class 名来定义样式（CSS Modules 只转换 CSS 的类名）;

* 不层叠多个 class，只使用一个 class 把所有样式定义好;

* 所有样式通过 composes 组合来实现复用;

* 不嵌套。

### CSS Modules vs styled-components

CSS Modules 支持原生，更通用，更支持 BEM

styled-components 是 JS，编程性更好，结合 React 超爽


