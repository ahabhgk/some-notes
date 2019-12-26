---
title: JS 引用类型
date: 2019-01-28 09:36:03
tags:
- 笔记
categories:
- 技术
---

JS 高程第五章引用类型的笔记

<!-- more -->

# 函数传参

所有函数的参数都是按值传递的：

1 先为参数分配空间

2 传参（形参 = 实参），赋值操作

3 执行方法体（执行调用方法里的语句）

# Object 类型

字面量表示

[] 带有参数的访问

. 不带参数的访问

# Array 类型

## 1 join()

join() 方法默认参数（不传入任何值）或传入 undefined 为 join(',')（[1,2,3].toString()）

## 2 push() pop() shift() unshift()

栈（LIFO Last-In-First-out）方法：push() pop()

队列（FIFO First-In-First-Out）方法：shift() unshift()

```javascript
// shift() 取得第一项
var colors = ['red', 'blue', 'green']
var firstColor = colors.shift()
// unshift() 与 push() 类似，从前面推入
```

## 3 sort()

sort() 方法比较每个数组项（toString() 方法）的字符串

```javascript
[0, 1, 5, 10, 15].sort() // [0, 1, 10, 15, 5]
sort() 方法接受一个比较函数做参数
function compare(value1, value2) {
    if (value1 < value2) {
        return -1 升序为 -1，降序为 1
    } else if (value1 > value2) {
        return 1 升序为 1，降序为 -1
    } else {
        return 0
    }
}

var values = [0, 1, 5, 10, 15]
values.sort(compare) // 0, 1, 5, 10, 15

// compare 函数改进
function compare(value1, value2) {
    return value1 - value2
}
reverse() 反转数组顺序
[3, 2, 1].reverse() //[1, 2, 3]
```

## 4 concat()

concat() 方法可以基于当前数组中的所有项创建一个新数组

slice() 方法可以基于当前数组中的一个或多个项创建一个新数组，如果 slice() 方法的参数中有一个是负数，则用数组长度加上该数组来确定相应的位置

splice(起始位置，要删除的项数，要插入的项) 根据传入的参数实现 删除 插入 替换 的操作，splice() 方   法始终都会返回一个数组，该数组中包括从原数组中删除的项（如果没有删除任何项，则返回一个空数组），splice() 方法主要用途是向数组中部插入项

## 5 indexOf()

indexOf() lastIndexOf() 方法都接受两个参数：要查找的项和表示起点位置的索引（可选）。indexOf()从开头向后找，lastIndexOf() 从末尾向前找。这两个方法都返回要查找的项在数组中的位置，没有则返回 -1，比较每一项中使用全等操作符（===）

## 6 迭代方法

五个迭代方法，都接受两个参数：要在每一项上运行的函数和运行该函数的作用于对象（影响 this 的值，可选）。传入的函数（第一个参数）接受三个参数：数组项的项、该项在数组中的位置、数组对象本身。

every()：对数组中的每一项运行给定函数，如果该函数对每一项都返回 true，则返回 true

filter()：对数组中的每一项运行给定函数，返回该函数会返回 true 的项组成的数组

forEach()：对数组中的每一项运行给定函数。这个方法没有返回值

map()：对数组中的每一项运行给定函数，返回每次函数调用的结果组成的数组

some()：对数组中的每一项运行给定函数，如果还函数对任一项返回 true，则返回 true

以上方法都不会修改数组中的包括的值

## 7 归并方法

归并方法：reduce() reduceRight()，接收四个参数：前一个值、当前值、索引值、数组对象。返回的任何值都会当作 **第一个参数** 传给下一项

```javascript
var values = [1, 2, 3, 4, 5]
var sum = values.reduce(function(pre, cur, index, array) {
    return pre + cur
})
console.log(sum) //15
```

reduceRight() 方向相反

# Date 类型

```javascript
var now = new Date()
//不传入参数返回当前时间
//返回特定时间，需传入毫秒数，Date.parse() 和 Date.UTC() 简化这一过程
```

## 1 Date.parse()

传入表示时间的字符串，返回相应毫秒数

```javascript
var someDate = new Date(Date.parse("6/13/2004"))//Thu May 13 2004 00:00:00 GMT+0800 (中国标准时间)
var sD2 = new Date("May 25, 2004")//Tue May 25 2004 00:00:00 GMT+0800 (中国标准时间)
//后台自动调用 Date.parse()
```

## 2 Date.UTC()

传入年份、基于 0 的月份（0 - 11）、月中的天数（1 - 31）、小时数（0 - 23）、分钟、秒、毫秒，只有前两个必须，其他默认参数为 0 或 1

```javascript
var y2k = new Date(Date.UTC(2000, 0))
var allFives = new Date(Date.UTC(2005, 4, 5, 17, 55, 55))

var y2k2 = new Date(2000, 0)
var allFives2 = new Date(2005, 4, 5, 17, 55, 55)
//后台自动调用 Date.UTC()
```

## 3 Date.now()

```javascript
var start = Date.now()
//doSomething()
var stop = Date.now()
var result = stop - start

var start1 = new Date()
//doSomething
var stop1 = new Date()
var result1 = stop1 - start1
```

## 日期格式化方法

```javascript
var a = new Date("May 25, 2018")
a.toDateString() //"Fre May 25 2018"
//格式显示星期、月、日、年
var b = new Date(2018, 4, 5, 17, 55, 55)
b.toTimeString() //"17:55:55 GMT+0800 (中国标准时间)"
//格式显示时、分、秒
b.UTCString() //"Sat, 05 May 2018 09:55:55 GMT"
//显示格式完整的 UTC 日期
```

## 日期/时间组件方法

# RegExp 类型

正则表达式

```javascript
var exp = / pattern / flags
```

匹配模式支持下列 3 个 flags：

g: 表示全局，应用于所有字符串，而非发现第一个匹配的就停止

i: 表示不区分大小写

m: 表示多行模式，到达一行文本末尾时还会继续查找下一行中是否存在匹配的项

[abc] 查找方括号之间的任何字符

[^abc] 查找任何不在方括号之间的字符

[a-z] 查找任何从小写 a 到小写 z 的字符

[A-z] 查找任何从大写 A 到小写 z 的字符

[0-9] 查找任何从 0 至 9 的数字

(x|y|z) 查找任何指定的选项

元字符：

\d 查找数字

\D 查找非数字字符

\s 查找空白字符

\S 查找非空白字符

\b 匹配单词边界

\w 查找单词字符

\W 查找非单词字符

\n 查找换行符

量词：

n+ 匹配任何包含至少一个 n 的字符

n* 匹配任何包含零个或多个 n 的字符

n? 匹配任何包含零个或一个 n 的字符串

n{X} 匹配包含 X 个 n 的序列的字符串

n{X,} 匹配至少包含 X 个 n 的序列字符串

n{X,Y} 匹配至少包含 X 个 n 至多包含 Y 个 n 的序列字符串

n$ 匹配任何结尾为 n 的字符串

^n 匹配任何开头为 n 的字符串

?=n 匹配任何其后紧接指定字符串 n 的字符串

?!n 匹配任何其后没有紧接指定字符串 n 的字符串

```javascript
var exp = /at/g //匹配字符串中所有的"at"实例
var exp1 = /[bc]at/i //匹配第一个"bat"或"cat"，不区分大小写
var exp2 = /.at/gi //匹配所有以"at"结尾的 3 个字符的组合，不区分大小写

//元字符需要转义：
// ( ) [ ] { } ^ $ | ? * + . \
var exp3 = /\[bc\]at/i //匹配第一个"[bc]at"，不区分大小写
```

构造函数定义：

```javascript
var exp = new RegExp("[bc]at", "i")
//var exp = /[bc]at/i

//参数是字符串，有的字符需要双重转义：
//所有元字符、\n、\\
//🌰 /\w\\hello\\123/ 等价于 "\\w\\\\hello\\\\123"
```

## RegExp 实例属性

```javascript
var exp1 = /\[bc\]at/i
var exp2 = new RegExp("\\[bc\\]at", "i")
exp1.global //false
exp1.ignoreCase //true
exp1.multiline //false
exp1.lastIndex //0
//表示开始搜索下一个匹配项的字符位置，从 0 算起
exp1.source //"\[bc\]at"
exp2.source //"\[bc\]at"
//source 属性保存的是规范形式的字符串，即字面量形式所用的字符串
```

## RegExp 实例方法

### exec()

专门为捕获组而设计，接受要应用模式的字符串，返回一个包含两个额外属性：index 和 input 的数组，或在没有匹配项返回 null

index 表示匹配项在字符串中的位置，input 表示应用正则的字符串

该数组中，第一项是与整个模式匹配的字符串，其他项是与模式中的捕获组匹配的字符串（如果没有捕获组，则只包含第一项）

```javascript
var text = "mom and dad and baby"
var exp = /mom( and dad( and baby)?)?/gi

var matches = exp.exec(text)
matches.index //0
matches.input //"mom and dad and baby"
matches[0] //"mom and dad and baby"
matches[1] //" and dad and baby"
matches[2] //" and baby"
```

对于 exec() 而言，每次只返回一个匹配项。在不设置 g 标志情况下，始终返回第一个匹配项的信息，设置 g 后， 每次调用都会在字符串中继续查找新的匹配项

```javascript
var text = "cat, bat, sat, fat"
var exp = /.at/
var matches = exp.exec(text)

matches.index //0
matches[0] //cat

matches = exp.exec(text)

matches.index //0
matches[0] //cat

var exp1 = /.at/g
var matches = exp.exec(text)

matches.index //0
matches[0] //cat

matches = exp.exec(text)

matches.index //5
matches[0] //bat
```

### test()

接受一个字符串参数，匹配时返回 true，否则返回 false

```javascript
var text = "000-00-0000"
var exp = /\d{3}-\d{2}-\d{4}/

if (exp.test(text)) {
    console.log("matched")
}
```

## 构造函数属性

## 模式的局限性

# Function 类型

## 没有重载

## 函数声明与表达式

```javascript
console.log(sum(10, 10)) //20
function sum(num1, num2) {
    return num1 + num2
}
//函数提升

console.log(sum1(10, 10)) //报错，
var sum1 = function(num1, num2) {
    return num1 + num2
}
//变量提升
```

## 作为值的函数

闭包

## 函数内部的属性

### arguments

类数组对象，保存函数的参数。有一个 callee 的属性，是一个指针，指向拥有 arguments 对象的函数

```javascript
function factorial(num) {
    if (num <= 1) {
        return 1
    } else {
        reurn num * factorial(num - 1)
    }
}
//递归，该函数的执行与函数名 factorial 耦合在一起

function factorial(num) {
    if (num <= 1) {
        return 1
    } else {
        return num * arguments.callee(num - 1)
    }
}
//利用 callee 消除耦合，可用于匿名函数
```

### this

this 引用的是函数执行的函数对象

```javascript
var color = "red"
var o = {color: "blue"}

function sayColor() {
    console.log(this.color)
}

sayColor() //"red"

o.sayColor = sayColor
o.sayColor() //"blue"

o.sayColor = () => {
    console.log(this.color)
}
//箭头函数的 this 指向外层的对象
o.sayColor() //"red"
```

## 函数属性和方法

length 属性表示函数 **希望** 接受的命名参数的个数

```javascript
function foo(a, b) {
    //
}
foo.length //2

(() => {
    //
}).length //0
```

对 ECMAScript 中所有引用类型而言，prototype 保存他们所有实例方法的真正所在，🌰 toString()、valueOf() 等方法实际上都保存在 prototype 下，只不过通过各自对象的实例访问罢了

非继承而来的两个方法：apply()、call()

apple(调用的对象, 一个参数数组)

call(调用对象, 参数 1, 参数 2……)

扩充函数赖以运行的作用域

bind() 创建一个函数的实例，其 this 值会被绑定到 bind() 函数的值

[call、apply、](https://juejin.im/post/5c060585e51d45480061b05f)[bind 的模拟实现](https://juejin.im/post/5c09e6f9e51d456c4c49f4c6)

bind 函数绑定：

```js
var handler = {
    message: 'event handled',
    handleClick: function(event) {
        console.log(this)
    },
}
var btn = document.querySelector('#btn')
btn.addEventListener('click', handler.handleClick) // btn
```

解决方案：

1 闭包

```js
btn.addEventListener('click', function(event) {
    handler.handleClick(event)
})
```

2 **bind()**

先看 bind() 的简单模拟

```js
function bind(fn, context) {
    return function() { // 这层 return 用来传入参数，bind(foo, obj)(param1, param2)
        return fn.apply(context, arguments)
    }
}
btn.addEventListener('click', bind(handler.handleClick, handler))
```

直接调用 bind()

```js
btn.addEventListener('click', handler.handleClick.bind(handler))
```

# 基本包装类型

3个特殊的引用类型：Boolean、Number、String

基本类型不是对象，没有方法，但他们的确有方法，其实有后台处理：

```javascript
var s1 = 'some text'
var s2 = s1.substring(2)
// var s1 = new String('some text')
var s2 = s1.substring(2)
s1 = null
```

> 1 创建对应类型的一个实例
>
> 2 在实例上调用指定的方法
>
> 3 删除这个实例

## Boolean 类型

建议永远不要使用 Boolean 对象

## Number 类型

toString() 方法可传入一个表示基数的参数，告诉他返回几进制数值的字符串

toFixed() 方法返回指定小数位数的字符串

toExponential() 方法返回科学计数法的字符串

## String 类型

length 属性

### 字符方法

charAt() 方法

charCodeAt() 方法

fromCharCode() 方法

### 字符串方法

concat() 讲一个或多个字符串拼接起来，返回得到的新字符串

slice() 方法、substr() 方法、substring() 方法 第一个参数指定字符串的开始位置，第二个参数 slice()、substring() 指定字符串最后一个字符后面的位置，substr() 指定返回字符个数，传入负值都有区别。都不影响原字符串

trim() 方法、match() 方法、search() 方法、replace() 方法、split() 方法

toUpperCase()、toLowerCase()

# 单体内置对象

## Global 对象

“兜底对象”不属于任何其他对象的属性和方法，都是 Global 对象的属性和方法

isNaN()、isFinite()、parseInt()、parseFloat()

### 属性

undefined、NaN、Infinity、Object、Array、Function、Boolean、String、Number、Date、RegExp、Error、EvalError、RangeError、ReferenceError、SyntaxError、TypeError、URIError

### 编码方法

encodeURI() 对整个 URI 进行编码，不会对本身属于 URI 的特殊字符进行编码，例如冒号、正斜杠、问号、井号，decodeURI() 对其进行解码

encodeURIComponent() 主要对 URI 中的某一段进行编码，会对任何非标准字符进行编码，decodeURIComponent() 对其进行解码

一般来说，encodeURIComponent() 使用更多，因为实践中更常见的是对查询字符串参数而不是对基础 URI 进行编码

用特殊 UTF-8编码替换所有无效的字符，让浏览器能够接受和理解

### eval()

接收要执行的 ECMAScript 字符串

通过该方法执行的代码被认为在该执行环境中执行

```javascript
var msg = 'hello world'
eval("alert(msg)") //'hello world'

eval("function sayHi(){console.log('hi')}")
sayHi() //'hi'
```

### window 对象

web 浏览器将这个全局对象作为 window 对象的一部分加以实现

## Math 对象

### 属性

Math.E、Math.LN10、Math.LN2、Math.LOG2E、Math.LOG10E、Math.PI、Math.SQRT1_2、Math.SQRT2

### 方法

min()、max()

找到数组中的 max、min

```javascript
var values = [1, 2, 3, 4]
var max = Math.max.apple(Math, values)
var max = Math.max(...values)
```

floor() 向下舍入

ceil() 向上舍入

round() 四舍五入

random() 返回 [0, 1) 之间的一个随机数，不包括 1

abs()、log()、pow()、sqrt()、acos()、asin()、stan()、cos()、sin()、tan()
