---
title: JS 函数表达式
date: 2019-02-03 21:12:48
tags:
- 笔记
categories:
- 技术
---

JS 高程中函数表达式的笔记

<!-- more -->

1 浏览器非标准 name 属性

2 函数提升与比变量提升

```js
foo() // 'Hi'
function foo() {
    console.log('Hi')
}
```

```js
foo() // undefined
var foo = function() {
    console.log('Hi')
}
```

```js
if (condition) {
    function foo() {
        console.log('Hi')
    }
} else {
    function foo() {
        console.log('Yo')
    }
}
```

```js
if (condition) {
    var bar = function() {
        console.log('Hi')
    }
} else {
    var bar = function() {
        console.log('Yo')
    }
}

// 如果把 var 换成 let 呢？
// 再换成 const 呢？
```

# 递归

```js
function foo() {
    // some code
    foo()
}
var bar = foo
foo = null
bar() // 报错
```

bar 指向堆中“foo 的那个函数”，foo = null，此时 bar() 中调用 foo()，就出错了

arguments.callee 是一个指向正在执行的函数的指针，可以解决函数的执行与函数名高耦合的问题

但他在严格模式下不能访问，会出错

# 闭包

闭包的作用：

1 使（外部）函数有权访问另一个（内部）函数作用域中的变量

2 使该（外部）函数中的变量的值保存在内存中，不被 GC 清掉

> ## js 的作用域
>
> 1 全局作用域
>
> 2 函数作用域
>
> 3 块级作用域（ES6）

> ## js 的垃圾回收（GC）机制
>
> 标记清除算法

```js
function foo() {
    var a = 0
    return function bar(x) {
        a +=x
        return a
    }
}
var f = foo()
console.log(f(1)) // 1
console.log(f(2)) // 3
// bar 可以访问到 foo 中的变量（废话）
// a 始终储存在内存中，因为 f = foo() 的标记，使 a 不会被 GC 清掉
```

## 闭包与变量

```js
function foo() {
    var result = []
    for (var i = 0; i < 10; i++) {
        result[i] = function() {
            return i
        }
    }
    return result
}
var bar = foo()
for (var i = 0; i < 10; i++) {
    console.log(bar[i]())
}
```

<details>
<summary>answer</summary>

10 个 **10**

return 的 i 变量，i 的值**最终**为 10

</details>

解决方案：

1 利用函数的值传递

```js
function foo() {
    var result = []
    for (var i = 0; i < 10; i++) {
        result[i] = (function(num) {
            return function() {
                return num
            }
        })(i)
    }
    return result
}
var bar = foo()
for (var i = 0; i < 10; i++) {
    console.log(bar[i]())
}
// 0 1 2 3 4 5 6 7 8 9
```

2 let（ES6）

```js
function foo() {
    var result = []
    for (let i = 0; i < 10; i++) {
        result[i] = function() {
            return i
        }
    }
    return result
}
var bar = foo()
for (var i = 0; i < 10; i++) {
    console.log(bar[i]())
}
// 0 1 2 3 4 5 6 7 8 9
```

送一个经典例子：

```js
for (var i = 0; i < 10; i++) {
    setTimeout(function() {
        console.log(i)
    }, 0)
}
```

## 闭包中的 this

```js
var name = 'window'

var obj = {
    name: 'obj',
    getName: function() {
        return function() {
            return this.name
        } // 这个闭包在实践中根本没有意义，但可以用来理解闭包
    }
}
console.log(obj.getName()())
```

<details>
<summary>answer</summary>

'window'

```js
obj.getName()()
// 相当于：
var f = obj.getName() // 在全局中定义 f
f()
f = null
```

</details>

解决方案

1 利用 that = this 传递 this

```js
var name = 'window'

var obj = {
    name: 'obj',
    getName: function() {
        var that = this
        return function() {
            return that.name
        }
    }
}
console.log(obj.getName()())
```

2 箭头函数（ES6）的 this 指向他的静态作用域的 this

```js
var name = 'window'

var obj = {
    name: 'obj',
    getName: function() {
        return () => {
            return this.name
        }
    }
}
console.log(obj.getName()())
```

## 内存泄漏

```js
function foo() {
    var ele = document.querySelector('#ele')
    // var id = ele.id
    ele.onclick = function() {
        console.log(ele.id)
    }
    // ele = null
}
```

只要该匿名函数存在，ele 所占内存就不会被 GC 回收

# 在 ES5 中模仿块级作用域

```js
(function() {
    // 块级作用域
})()

function foobar() {
    // 块级作用域
}
foobar()
```

# ES6 箭头函数

() => {}

与 function() {} 区别：

1 没有 arguments 对象

```js
const foo = (...arg) => {
    console.log(arg)
}
```

2 箭头函数没有prototype属性，没有constructor，即不能用作与构造函数（不能用new关键字调用），所以也没有 super

3 箭头函数（ES6）的 this 指向他的静态作用域的 this

（但也可以靠 call、apply、bind 动态修改）

因此有的文章说指向上层上下文的 this，可是：

```js
var name = 'window'

var obj = {
    name: 'obj',
    getName: () => {
        return () => {
            return this.name
        }
    }
}
console.log(obj.getName()()) // 'window'
// 所以也不是太准确，理解下就好
```

> An arrow function expression has a shorter syntax than a function expression and does not have its own this, arguments, super, or new.target. These function expressions are best suited for non-method functions, and they cannot be used as constructors.

# 函数柯里化

```js
const curry = (fn, arity = fn.length, ...args)
    => arity <= args.length
    ? fn(...args)
    : curry.bind(null, fn, arity, ...args)
```