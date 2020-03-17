# ES6

原则：

1. 尽量不讲 APIs，APIs 看看有个印象就行，用到再查

2. 尽量扩展，所以涉及很多现在不需要的知识，会提到很多以后可能用到的库，看看就好（希望以后对于库能关注其实现原理）

大部分都是语法糖，但是语法糖很重要，因为语法糖可以提升 DX（更开心的写代码）

> 语法糖：旨在使内容更易阅读，但不引入任何新内容的语法

## 一堆扩展

### let 和 const 命令

#### 暂时性死区

temporal dead zone，简称 TDZ

```ts
if (true) {
  // TDZ开始
  tmp = 'abc'; // ReferenceError
  console.log(tmp); // ReferenceError

  let tmp; // TDZ结束
  console.log(tmp); // undefined

  tmp = 123;
  console.log(tmp); // 123
}
```

暂时性死区的本质就是，只要一进入当前作用域，所要使用的变量就已经存在了，但是不可获取，只有等到声明变量的那一行代码出现，才可以获取和使用该变量

#### 块级作用域

for 的圆括号也有作用域，大括号产生的作用域是圆括号产生的作用域的子作用域

```ts
for (let i = 0; i < 3; i++) {
  let i = 1 // ok
  console.log(i)
}
```

```cpp
for (int i = 0; i < 3; i++) {
  int i = 1 // error
  cout << i << endl;
}
```

{} 产生作用域

```ts
let i = 0
if (true) let i = 1 // error

if (true) {
  let i = 1 // ok
}

{
  let i = 1 // ok
}
```

#### const

const 实际上保证的，并不是变量的值不得改动，而是变量指向的那个内存地址所保存的数据不得改动。对于简单类型的数据（数值、字符串、布尔值），值就保存在变量指向的那个内存地址，因此等同于常量。但对于复合类型的数据（主要是对象和数组），变量指向的内存地址，保存的只是一个指向实际数据的指针，const 只能保证这个指针是固定的（即总是指向另一个固定的地址），至于它指向的数据结构是不是可变的，就完全不能控制了

#### globalThis

ES2020

[polyfill](https://github.com/ungap/global-this)

### 变量的结构赋值

只要某种数据结构具有 Iterator 接口，都可以采用数组形式的解构赋值

#### 默认值

```ts
let [a = 1, b = 2] = []

function move({x = 0, y = 0} = {}) { // 常用
  return [x, y];
}
move({x: 3, y: 8}); // [3, 8]
move({x: 3}); // [3, 0]
move({}); // [0, 0]
move(); // [0, 0]

function move({x, y} = { x: 0, y: 0 }) {
  return [x, y];
}
move({x: 3, y: 8}); // [3, 8]
move({x: 3}); // [3, undefined]
move({}); // [undefined, undefined]
move(); // [0, 0]
```

### 数值的扩展

#### parseInt parseFloat

全局方法 parseInt 和 parseFloat，移植到Number对象上面，这样做的目的，是逐步减少全局性方法，使得语言逐步模块化

#### Number.EPSILON

Number.EPSILON 实际上是 JavaScript 能够表示的最小精度。误差如果小于这个值，就可以认为已经没有意义了，即不存在误差了

```ts
// 比如，误差范围设为 2 的-50 次方（即Number.EPSILON * Math.pow(2, 2)）
function withinErrorMargin (left, right) {
  return Math.abs(left - right) < Number.EPSILON * Math.pow(2, 2);
}

0.1 + 0.2 === 0.3 // false
withinErrorMargin(0.1 + 0.2, 0.3) // true

1.1 + 1.3 === 2.4 // false
withinErrorMargin(1.1 + 1.3, 2.4) // true
```

#### BigInt

JavaScript 所有数字都保存成 64 位浮点数，这给数值的表示带来了两大限制。一是数值的精度只能到 53 个二进制位（相当于 16 个十进制位），大于这个范围的整数，JavaScript 是无法精确表示的，这使得 JavaScript 不适合进行科学和金融方面的精确计算。二是大于或等于2的1024次方的数值，JavaScript 无法表示，会返回Infinity。ES2020 引入了一种新的数据类型 BigInt（大整数），来解决这个问题。BigInt 只用来表示整数，没有位数的限制，任何位数的整数都可以精确表示

```ts
1234 // 普通整数
1234n // BigInt

// BigInt 的运算
1n + 2n // 3n
42n === 42 // false
typeof 123n // 'bigint'

new BigInt() // TypeError
BigInt(undefined) //TypeError
BigInt(null) // TypeError
BigInt('123n') // SyntaxError
BigInt('abc') // SyntaxError
BigInt(1.5) // RangeError
BigInt('1.5') // SyntaxError
```

### 函数的扩展

#### .length

指定了默认值和 ... 后，length属性将失真

```ts
(function(a, ...args) {}).length // 1
(function (a, b = 1, c) {}).length // 1
```

#### 作用域

() 和 {} 是同一个作用域

```ts
var x = 1

function f(x, y = x) {
  let y = 0 // error
  console.log(y)
}
```

#### 箭头函数

没有 prototype，所以 this 是静态的

#### 尾递归优化

尾递归优化只在严格模式下生效，目前只有 Safari 浏览器支持尾调用优化，Chrome 和 Firefox 都不支持

标准是标准，浏览器实现不一定听话

### 数组的扩展

#### 扩展运算符

```ts
fn.apple(null, arr)
fn(...arr)
```

任何定义了遍历器（Iterator）接口的对象，都可以用扩展运算符转为真正的数组

```ts
Number.prototype[Symbol.iterator] = function* () {
  let i = 0
  let num = this.valueOf()
  while (i < num) {
    yield i++
  }
}
console.log([...5]) // [0, 1, 2, 3, 4]

let arrayLike = {
  '0': 'a',
  '1': 'b',
  '2': 'c',
  length: 3,
}
// TypeError: Cannot spread non-iterable object.
let arr = [...arrayLike]
```

```ts
const go = function* () {
  yield 1
  yield 2
  yield 3
}
[...go()] // [1, 2, 3]
```

#### from

Array.from方法用于将两类对象转为真正的数组：类似数组的对象（array-like object）和可遍历（iterable）的对象（包括 ES6 新增的数据结构 Set 和 Map）

所谓类似数组的对象，本质特征只有一点，即必须有length属性

```ts
let arrayLike = {
  '0': 'a',
  '1': 'b',
  '2': 'c',
  length: 3
}
// ES5的写法
var arr1 = [].slice.call(arrayLike); // ['a', 'b', 'c']
// ES6的写法
let arr2 = Array.from(arrayLike); // ['a', 'b', 'c']
```

```ts
const toArray = (() =>
  Array.from ? Array.from : obj => [].slice.call(obj)
)();
```

#### of flatMap

方便 functor monad

> 简单理解就是 functor 是有实现 map 方法的对象，monad 是有实现 flatMap 方法的对象，比如 Promise 是个 functor 也是 monad，then 相当于 map 也相当于 flatMap

```ts
const { of } = Array
of(1).flatMap(e => [e * 2]) // of(2) 就有 fp 那味了
```

### 对象的扩展

对象的解构赋值用于从一个对象取值，相当于将目标对象自身的所有**可遍历的（enumerable）**、但尚未被读取的属性，分配到指定的对象上面

### 对象的新增方法

\_\_proto\_\_ 写入 es6 规范的**附录**，要求实现，但双下划线表示内部 API，仍不推荐直接使用

### Set 和 Map 数据结构

#### Set

集合

Set函数可以接受一个数组（或者具有 iterable 接口的其他数据结构）作为参数，用来初始化

```ts
Number.prototype[Symbol.iterator] = function* () {
  let i = 0
  let num = this.valueOf()
  while (i < num) {
    yield i++
  }
}
new Set(5) // Set(5) {1, 2, 3, 4, 5}
```

Set 有 [Symbol.iterator] 接口，可以 Array.from 转化成数组

keys()，values()，entries() 返回遍历器对象

```ts
Set.prototype[Symbol.iterator] === Set.prototype.values
// true 默认遍历器生成函数就是它的values方法

let set = new Set(['red', 'green', 'blue']);

for (let x of set.values()) { // for (let x of set)
  console.log(x);
}
// red
// green
// blue
```

#### Map

Object 结构提供了“字符串—值”的对应，Map 结构提供了“值—值”的对应，是一种更完善的 Hash 结构实现。如果你需要“键值对”的数据结构，Map 比 Object 更合适

不仅仅是数组，任何具有 Iterator 接口、且每个成员都是一个双元素的数组的数据结构（详见《Iterator》一章）都可以当作Map构造函数的参数。这就是说，Set和Map都可以用来生成新的 Map

```ts
const items = [
  ['name', '张三'],
  ['title', 'Author']
];

const map = new Map();

const set = new Set([
  ['foo', 1],
  ['bar', 2]
]);
const m1 = new Map(set);
m1.get('foo') // 1
```

keys()，values()，entries() 返回遍历器对象

```ts
map[Symbol.iterator] === map.entries
// true 默认遍历器接口（Symbol.iterator属性），就是entries方法
[...map.entries()]
// [[1,'one'], [2, 'two'], [3, 'three']]

[...map]
// [[1,'one'], [2, 'two'], [3, 'three']]
```

#### WeakSet、WeakMap

WeakMap 是类似于 Map 的集合，它仅允许对象作为键，并且一旦通过其他方式无法访问它们，便会将它们与其关联值一同删除。

WeakSet 是类似于 Set 的集合，它仅存储对象，并且一旦通过其他方式无法访问它们，便会将其删除。

它们都不支持引用所有键或其计数的方法和属性。仅允许单个操作。

WeakMap 和 WeakSet 被用作“主要”对象存储之外的“辅助”数据结构。一旦将对象从主存储器中删除，如果该对象仅被用作 WeakMap 或 WeakSet 的键，那么它将被自动清除

用例：

WeakSet 记录谁访问过我们的网站：

```ts
let visitedSet = new WeakSet();

let john = { name: "John" };
let pete = { name: "Pete" };
let mary = { name: "Mary" };

visitedSet.add(john); // John 访问了我们
visitedSet.add(pete); // 然后是 Pete
visitedSet.add(john); // John 再次访问

// visitedSet 现在有两个用户了

// 检查 John 是否来访过？
alert(visitedSet.has(john)); // true

// 检查 Mary 是否来访过？
alert(visitedSet.has(mary)); // false

john = null;

// visitedSet 将被自动清理
```

WeakMap 保存 DOM 节点相关状态信息：

```ts
let myWeakmap = new WeakMap();

myWeakmap.set(
  document.getElementById('logo'),
  {timesClicked: 0} // 相关信息，一旦这个 DOM 节点删除，该状态就会自动消失，不存在内存泄漏风险
)

document.getElementById('logo').addEventListener('click', function() {
  let logoData = myWeakmap.get(document.getElementById('logo'));
  logoData.timesClicked++;
}, false);
```

WeakMap 做私有属性：

TypeScript 3.8 的 # 私有属性就是通过 WeakMap 保证编译后代码的兼容性

```ts
const privateData = new WeakMap();

class Person {
  constructor(name, age) {
    privateData.set(this, { name: name, age: age });
  }

  getName() {
    return privateData.get(this).name;
  }

  getAge() {
    return privateData.get(this).age;
  }
}

export default Person
```

## 迭代器（Iterator）和生成器（Generator）

### Iterator 和 for...of 循环

遍历器（Iterator）是一种接口，为各种不同的数据结构提供统一的访问机制。任何数据结构只要部署 Iterator 接口，就可以完成遍历操作（即依次处理该数据结构的所有成员）

只要有 next 方法，并且 next 方法返回对象包含 value 和 done 就是 Iterator（鸭子模型），return 和 throw 方法可选

> 当看到一只鸟走起来像鸭子、游泳起来像鸭子、叫起来也像鸭子，那么这只鸟就可以被称为鸭子

```ts
let arr = ['a', 'b', 'c']

// 直接拿数组的 iterator 接口
let iter = arr[Symbol.iterator]()
iter.next() // { value: 'a', done: false }
iter.next() // { value: 'b', done: false }
iter.next() // { value: 'c', done: false }
iter.next() // { value: undefined, done: true }

// for of 自动消费 iterator 接口
for (const value of arr) {
  console.log(value)
}
```

原生具备 Iterator 接口的数据结构如下：

* Array

* Map

* Set

* String

* TypedArray

* 函数的 arguments 对象

* NodeList 对象

> Object 没有，所以 Object 不能用 for of 遍历
> for in 与 for of 区别：for in 根据对象的可枚举的属性，拿到属性（字符串）进行遍历，数组也是个对象，所以数组可以用 for in 遍历，同时 for in 会遍历出 prototype 上的属性，所以对象使用 for in 时可能有意想不到的东西遍历出来，而且某些情况下 for in 遍历是任意顺序的，更推荐 Object.keys Object.values Object.entries 进行遍历。for of 通过 iterator 接口进行遍历，没有 iterator 接口的对象可以通过添加实现

调用 Iterator 接口的场合：

* 对**数组**和 **Set** 结构进行解构赋值

* ... 扩展运算符

* yield* 后面跟的是一个可遍历的结构，它会调用该结构的遍历器接口

* 接受数组作为参数的场合：for...of、Array.from()、Map()、Set()、WeakMap()、WeakSet()、Promise.all()、Promise.race()

例子：单向链表

```ts
function Node(value) {
  this.value = value
  this.next = null
}
Node.prototype[Symbol.iterator] = function () {
  let current = this
  return {
    next() {
      if (current) {
        const value = current.value
        current = current.next
        return { done: false, value }
      } else {
        return { done: true, value: undefined }
      }
    }
  }
}

let head = new Node(1)
head.next = new Node(2)
head.next.next = new Node(3)
for (const i of head) console.log(i)
```

Generator 部署 Iterator 接口更方便：

```ts
let obj = {
  * [Symbol.iterator]() {
    yield 'hello';
    yield 'world';
  }
}
for (let x of obj) {
  console.log(x);
}
// "hello"
// "world"
```

### Generator 函数的语法

> 如何判断一个函数是 generator 函数：[is-generator-function](https://github.com/ljharb/is-generator-function/)
>
> 1. 通过正则匹配 toString 后的 *
>
> 2. 通过 Symbol.toStringTag 判断
>
> 3. 通过 getPrototypeOf 判断函数的 \_\_proto\_\_ 和 (function * () {}).\_\_proto\_\_ 是否 ===

Generator 返回一个 Iterator（有 next、return、throw 三个方法）

这三个方法都可以传入参数：它们的作用都是让 Generator 函数恢复执行，并且使用不同的语句替换 yield 表达式

#### next return throw 和方法的参数

next 是将 yield 表达式替换成一个值

```ts
const g = function* (x, y) {
  let result = yield x + y;
  return result;
};

const gen = g(1, 2);
gen.next(); // Object {value: 3, done: false}

gen.next(1); // Object {value: 1, done: true}
// 相当于将 let result = yield x + y
// 替换成 let result = 1;
```

throw 是将 yield 表达式替换成一个 throw 语句

```ts
gen.throw(new Error('出错了')); // Uncaught Error: 出错了
// 相当于将 let result = yield x + y
// 替换成 let result = throw(new Error('出错了'));
// 用于 generator 内部
```

return 是将 yield 表达式替换成一个 return 语句

```ts
gen.return(2); // Object {value: 2, done: true}
// 相当于将 let result = yield x + y
// 替换成 let result = return 2;
```

#### yield* 表达式

如果在 Generator 函数内部，调用另一个 Generator 函数。需要在前者的函数体内部，自己手动完成遍历，就非常麻烦

yield* 就是解决这个问题：

```ts
function* concat(iter1, iter2) {
  yield* iter1;
  yield* iter2;
}
// 等同于
function* concat(iter1, iter2) {
  for (var value of iter1) {
    yield value;
  }
  for (var value of iter2) {
    yield value;
  }
}
```

任何数据结构只要有 Iterator 接口，就可以被 yield* 遍历

#### 含义

（强烈推荐读原文）

协程

ES6 中的 Generator 是“半协程”，意思是只有 Generator 函数的调用者，才能将程序的执行权还给 Generator 函数。如果是完全执行的协程，任何函数都可以让暂停的协程继续执行

## 异步编程

后面学姐细讲

### Promise

如果 then 返回一个 thenable 对象（鸭子模型）那么下一个 then 接收到的是这个 thenable 对象转化成 promise 后所 resolve 的值。如果返回是一个 promise，那下一个 then 接收到的是

```ts
new Promise(resolve => {
  resolve(1)
})
  .then((v) => ({
    then(resolve) {
      resolve(3)
    }
  }))
  .then(console.log) // 3

new Promise(resolve => {
  resolve(1)
})
  .then((v) => Promise.resolve(3))
  .then(console.log) // 3
```

> then 相当于 flatMap and map，所以是个 monad

### co

Generator 一大应用就是异步与流程控制 [tj/co](https://github.com/tj/co/)，Generator 函数将 JavaScript 异步编程带入了一个全新的阶段

```ts
var gen = function * () {
  var f1 = yield readFile('/etc/fstab'); // 管理流程时需要 yield 出 promise 或 thunk 函数
  var f2 = yield readFile('/etc/shells');
  console.log(f1.toString());
  console.log(f2.toString());
};
co(gen);
```

### async

Generator 函数的执行必须靠执行器，所以才有了 co 模块，而 async 函数自带执行器

async 函数的 await 命令后面，可以是 Promise 对象和原始类型的值（数值、字符串和布尔值，但这时会自动转成立即 resolved 的 Promise 对象）

async 函数的返回值是 Promise 对象，进一步说，async函数完全可以看作多个异步操作，包装成的一个 Promise 对象，而await命令就是内部then命令的语法糖

### async iterator

* `function () {}`

* `() => {}`

* `async function () {}`

* `async () => {}`

* `function* () {}`

* `async function* () {}` 返回 Iterator，但是调用 next 后返回一个 Promise

```ts
async function* run() {
  await new Promise(resolve => setTimeout(resolve, 100));
  yield 'Hello';
  console.log('World');
}

// `run()` returns an async iterator.
const asyncIterator = run();

// The function doesn't start running until you call `next()`
asyncIterator.next().
  then(obj => console.log(obj.value)). // Prints "Hello"
  then(() => asyncIterator.next());  // Prints "World"
```

## 元编程与 DSL

元编程是针对程序本身的行为进行操作的编程。换句话说，它是为你程序的编程而进行的编程

DSL (domain-specific languages) 领域特定语言

元编程的一大作用就是实现 DSL，

### 标签模版的 DSL

模版标签其实是在字符串扩展那一节，但是元编程的一大作用就是实现 DSL，比如 Io 的 forward、Ruby 的 method_missing，但这里不是元编程实现，而是用模版字符串实现类似的功能，只是觉得两个概念比较配，就放这里了

```ts
function SaferHTML(templateData) {
  let s = templateData[0];
  for (let i = 1; i < arguments.length; i++) {
    let arg = String(arguments[i]);

    // Escape special characters in the substitution.
    s += arg.replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");

    // Don't escape special characters in the template.
    s += templateData[i];
  }
  return s;
}
let sender = '<script>alert("abc")</script>'; // 恶意代码
let message = SaferHTML`<p>${sender} has sent you a message.</p>`;

message
// <p>&lt;script&gt;alert("abc")&lt;/script&gt; has sent you a message.</p>
```

[style-component](https://github.com/styled-components/styled-components)（CSS-in-JSX）

[lit-html](https://github.com/Polymer/lit-html)、民间 [jsx](https://gist.github.com/lygaret/a68220defa69174bdec5)（HTMl-in-JS）

GLSL、C-in-JS、Lisp-in-JS …… 只要你敢写，要什么有什么

使字符串写 DSL 更**方便**，原来的字符串也可以写，但解析字符串就很麻烦，比如：[精读《手写 JSON Parser》](https://zhuanlan.zhihu.com/p/107344979)

JS 原本就有别的方法，比如通过函数的 React JSX，Vue，Angular，通过数组的[表单验证的方案](http://byatool.com/ui/javascript-dsl-because-im-tired-of-writing-if-if-if/)，甚至 JQuery 也是一种

### Symbal

ES5 的对象属性名都是字符串，这容易造成属性名的冲突。比如，你使用了一个他人提供的对象，但又想为这个对象添加新的方法（mixin 模式），新方法的名字就有可能与现有方法产生冲突。如果有一种机制，保证每个属性的名字都是独一无二的就好了，这样就从根本上防止属性名的冲突。这就是 ES6 引入Symbol的原因

表示独一无二的值

```ts
const a = {
  b: 'lal',
  [Symbal('hah')]() {
    console.log('hah')
  }
}

Object.getOwnPropertyNames(a) // ['b']
Object.getOwnPropertySymbols(a) // [Symbol('hah')]
Reflect.ownKeys(a) // ['b', Symbal('hah')]
```

比如某状态管理工具：

我们这样使用：

```ts
// 定义初始状态
let initialState = 0

// 定于一个 reducer
function counterReducer(action, state = initialState) {
  switch (action.type) {
    case 'INC':
      return state + 1
    case 'DEC':
      return state - 1
    default:
      return state
  }
}

// 通过 reducer 和 initialState 获取 store
let store = redux(counterReducer, initialState)

// store.getState 用来获取当前 state
store.getState() // 0
// store.dispatch 通过一个带有 type 属性的对象来根据之前定义的 reducer 对 state 进行更改
store.dispatch({ type: 'INC' })
// 获取新的 state
store.getState() // 1
```

就是这样，由于第一次的 state 要有，就需要 redux 函数内部调用一次 reducer，同时为了不对第一次的 state 做出改变（第一次的 state 是 initialState），这次 type 跟我们的可能用到的 type 都不一样，也就是说 redux 函数内部并不能知道我们可能用到的 type 是什么，必须是一个独一无二的值，这时就可以用 Symbol：

```ts
function redux(reducer, initialState) {
  let currentState = reducer({ type: Symbol('STATE_INIT') }, initialState)
  return {
    getState() {
      return currentState
    },
    dispatch(action) {
      currentState = reducer(action, currentState)
    }
  }
}
```

#### 内置 Symbol 值

除了定义自己使用的 Symbol 值以外，ES6 还提供了 11 个内置的 Symbol 值，指向语言内部使用的方法

hasInstance、isConcatSpreadable、species、match、replace、search、split、iterator、toPrimitive、toStringTag、unscopables

可以通过添加或修改内置 Symbol 值 `[Symbol.xxx]` 来添加或修改对象一些场景的行为

比如上面出现的添加 `Number.prototype[Symbol.iterator]` 实现 `[...5]`、`new Set(5)` 的操作

还有修改 toPrimitive 实现：让 `a == 1 && a == 2 && a == 3` 返回 true

```ts
// == 两侧类型不同会有隐式类型转换，toPrimitive 就是定义对象被转为原始类型的值时调用的方法
const a = {
  value: [3, 2, 1],
  [Symbol.toPrimitive]() {
    return this.value.pop()
  },
}
```

赋予 JS 某些场景下的元编程的能力

### Proxy、Reflect

Proxy 可以代理对象的某些行为，一共 13 种

Proxy 代理之后，对象原来的行为就没了，所以需要有东西存原来的行为，就是 Reflect

Reflect 可以拿到语言本身的行为，它的方法与 Proxy 一一对应，也是 13 种

**get**、**set**、has、apply、construct、defineProperty、deleteProperty、ownKeys、isExtensible、preventExtensions、getOwnPropertyDescriptor、getPrototypeOf、setPrototypeOf

> Proxy 的 this 指向调用它的对象，target 调用就指向 target，proxy 调用就指向 proxy
>
> ```ts
> let target = {
>   foo() {
>     console.log(this)
>   }
> }
> let handler = {}
> let proxy = new Proxy(target, handler)
>
> target.foo() // target
> proxy.foo() // proxy
> ```

IE11 不兼容

> Proxies require support on the **engine level** and it is not possible to polyfill Proxy.
> [GoogleChrome/proxy-polyfill](https://github.com/GoogleChrome/proxy-polyfill) 只支持 get、set、apply、construct

### Decorator

Decorator 提案经过了大幅修改，现在还没有定下来，随便看看就好

装饰器是一个函数，传入类或类的方法，并对其进行修改，增强类本身的行为

比如 Mobx5 中使用装饰器和 Proxy 实现响应式数据、Nest 和 Angular 使用装饰器实现 IoC（控制反转）DI（依赖注入）

### 元编程

元编程是针对程序本身的行为进行操作的编程

* Symbol：通过修改内置的 Symbol 值，重写对象的某些方法

* Proxy：通过代理来拦截对象的行为

* Reflect：存有对象行为信息，一般配合 Proxy 使用

ES6 增强了这些能力，而且有本质上的增强，从 Proxy 的 polyfill 只能实现部分功能就可以看出。现在 Proxy 的应用有 Vue3、Mobx 的响应式、[Immer.js](https://github.com/immerjs/immer) 使用 mutable 写法写 immutable 数据

ES6 之前也是有元编程的能力的：

* defineProperty 在 Vue2 中实现拦截 get set

* \_\_defineGetter\_\_、\_\_defineSetter\_\_ 在 Koa 中用来实现代理一些属性但，这两个不是标准尽量不要用

* eval 和 new Function 也是，但性能不好尽量不要用，可用闭包和高阶函数替代

其他语言中比如 C++、Ruby 重载运算符，Ruby、Io 重写 method_missing 方法……

```ts
// Proxy 通过实现 method_missing
let handler = {
  get: function(target, name) {
    if (!Reflect.has(target, name)) {
      return 'method_missing XvX you can do some hacking functions at here...'
    }
    return Reflect.get(target, name)
  }
}

let { proxy, revoke } = Proxy.revocable({ a: 1 }, handler)
proxy.b // 'method_missing XvX you can do some hacking functions at here...'
proxy.a // 1

revoke() // 撤销代理
proxy.a // TypeError: Revoke
```

## class？语法糖？模版？

JS 的 OOP 是基于原型的，不同于工业常用的基于类的，虽然 ES6 添加了一些 class 的东西，但本质还是原型

~~Io~~ JS 没有类，只需要与对象打交道，必要时把对象复制（~~Object clone~~ Object.create）一下就行，这些被复制的对象叫原型，原型语言中，每个对象都不是类的复制品，而是一个实实在在的对象

```ts
let Vehicle = Object.create(Object.prototype) // {}，等价于 let Vehicle = {}
Vehicle.drive = 'gogogo'
let Car = Object.create(Vehicle) // Car.__proto__ === Object.getPrototypeOf(Car) === Vehicle
Car.drive = 'dididi'
let aodi = Object.create(Car)
aodi.sayAodi = function () {
  console.log('AODI!!!')
}
aodi.drive // 'dididi'
```

我们实现的就是一个 Vehicle，Car 继承 Vehicle，aodi 是 Car 的一个实例（注意我们自定的规范：小写是实例）

![aodi](./images/aodi.png)

再以一种~~扯~~常见一点的写法（“经典”组合式创建和寄生组合式继承）：

```ts
function Vehicle() {}
Vehicle.prototype.drive = 'gogogo'

function Car(...args) {
  Vehicle.apply(this, args) // 调用父类构造函数
}
Car.prototype = Object.create(Vehicle.prototype) // 继承，链接原型链
Car.prototype.constructor = Car // 修正 constructor

Car.prototype.drive = 'dididi'

let aodi = new Car()
aodi.sayAodi = function () {
  console.log('AODO!!!')
}
```

![aodiConstructor](./images/aodiConstructor.png)

做了与之前同样的事，只不过用了构造函数，来看看 class 写法：

```ts
class Vehicle {
  drive() { // 由于不能直接给原型添加属性，所以用方法代替
    console.log('gogogo')
  }
}

class Car extends Vehicle {
  dirve() {
    console.log('dididi')
  }
}

let aodi = new Car()
aodi.sayAodi = function () { // 为了不影响其他 Car 实例，所以直接在这里添加
  console.log('AODI!!!')
}
```

![aodiClass](./images/aodiClass.png)

原型链的本质：一个单向链表，没有的方法和属性沿着这条单向链表寻找，直到找到或遇到 null 为止

对比第一种和第二种，第二种是对于基于类的一种模拟，第一种才是基于原型语言中常用的写法，至于为什么更常用于第一种，大概是 JS 的历史问题吧（同 JS 为什么叫 JavaScript）

对比第二种和第三种，明显感觉第三种更为清晰，可读性更好，像是以一种基于类的模版写基于原型的 OOP，但同是也可以感受到少了一些灵活性，所以语法糖并不一定能提升语言的表达力，而主要是为了开发者的便利而设计的

但是 class 和 class extends 虽是“组合式创建”和“寄生组合式继承”的语法糖，但有些表现也是不同的，寄生组合式继承子类的 this 是自己的，然后调用父类构造函数在 this 上，而 class extends 中子类的 this 是父类传给子类的，所以[寄生组合式不能继承原生对象，而 class extends 可以](https://segmentfault.com/a/1190000012841509)

### 语法

```ts
class Vehicle {
  isVehicle = true

  constructor() { // 构造函数
    if (new.target === Vehicle) { // new.target 指向 new 的那个类（new Car 的话就指向 Car），可以用来实现抽象类
      throw new Error('本类不能实例化')
    }
  }

  static isVehicle(vehicle) { // 静态方法，相当于 Car.isCar，在构造函数上，所以不能访问 this
    return vehicle.isVehicle
  }

  drive() { // 方法，相当于 Car.prototype.drive
    console.log('gogogo')
  }
}

class Car extends Vehicle {
  isCar = true // 属性，相当于 this.isCar
  #price = 0 // 私有属性

  constructor(name) {
    super() // 相当于父类构造函数，对应 Vehicle.apple(this)，但实际上是拿到父类的 this
    this.name = name
  }

  set price(value) { // setter
    this.#price = value
  }

  get price() { // getter
    return this.#price
  }

  static isCar(car) {
    return super.isVehicle(car) && car.isCar // super 只有在 static 中才相当于父类构造函数，Vehicle.isVehicle
  }

  drive() {
    super.drive() // 这里 super 相当于父类的原型，Vehicle.prototype
    console.log('dididi')
  }
}
```

## 模块化

* CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用

* CommonJS 模块是运行时加载，ES6 模块是编译时输出接口

ES6 的模块自动采用严格模式

常用就两种：

```ts
// xxx.js
const a = 1
export default a

// main.js
import a from './xxx.js'
```

```ts
// xxx.js
export const a = 1

// main.js
import { a } from './xxx.js'
```

## 编码风格

推荐 airbnb 的[编码风格规范](https://github.com/airbnb/javascript)

使用 Lint 工具：ESLint、VSCode ESLint 插件

```shell
npm install -g eslint
# 进入你的项目的文件夹中
eslint --init
# 根据你的需要选择就好
```

## 作业

* Level 1：

## ref

[ES6 入门教程](https://es6.ruanyifeng.com/)

[TypeScript 版图解 Functor, Applicative 和 Monad](https://juejin.im/post/5d6298c75188255625591ae6)

[ES6 系列之 WeakMap](https://juejin.im/post/5b594512f265da0f6263840f)

[从类型理解 rxjs 与async generator (一）](https://zhuanlan.zhihu.com/p/98745778)

[Async Generator Functions in JavaScript](http://thecodebarbarian.com/async-generator-functions-in-javascript.html)

[ES6 系列之 defineProperty 与 proxy](https://juejin.im/post/5be4f7cfe51d453339084530)

[MDN Proxy](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy)

[JavaScript DSL 元编程](https://www.phodal.com/blog/javascript-dsl-metaprogramming/)

[JavaScript DSL示例](https://www.phodal.com/blog/javascript-dsl-example/)

[JavaScript 元编程之ES6 Proxy](https://www.phodal.com/blog/javascript-dsl-meta-programming-use-proxy/)

[immer.js 简介及源码简析](https://zhuanlan.zhihu.com/p/33507866)

[七周七语言](https://book.douban.com/subject/10555435/)

[进阶必读：深入理解 JavaScript 原型](https://zhuanlan.zhihu.com/p/87667349)
