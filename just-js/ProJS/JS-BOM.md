---
title: JS 高程 BOM
date: 2019-02-10 19:04:21
tags:
- 笔记
categories:
- 技术
---

JS 高程第八章 BOM 的笔记

<!-- more -->

# window 对象

就是那个浏览器，没错，整个浏览器

1 js 访问浏览器窗口的一个接口

2 ES 中的 Global 对象，因此有权访问parseInt() 等方法

## 全局作用域

## 窗口关系及框架

## 窗口位置

window.screenLeft、window.screenTop 屏幕左边和上边到浏览器左边和上边的距离（css 像素）

window.moveTo(0, 0) 移到屏幕左上角，可能会被浏览器禁用

## 窗口大小

chrome 中，innerWidth、innerHeight、outerWidth、outerHeight 返回视口（viewport）的宽高

标准模式 document.documentElement.clientWidth、document.documentElement.clientHeight（混杂模式 document.body.clientWidth、document.body.clientHeight）获取视口大小

window.resizeTo()、window.resizeBy() 可能会被浏览器禁用

## 导航和打开窗口

window.open()

```js
var win = window.open('http://www.baidu.com', 'winwin', 'height=400,width=400,top=10,left=10,resizable=yes')
win.close()
```

## setTimeout() 与 setInterval()

为 window 对象的方法，可用箭头函数改变 this 指向

第二个参数应理解为在一定时间后加入时间队列，如果事件队列为空则立即执行，否则等时间队列中的任务执行完后再执行（事件循环）

```js
var obj = {
  timer: function() {
    setTimeout(function() {
      console.log(this)
    }, 3000)
  }
}
obj.timer() // window 对象

var obj1 = {
  timer: function() {
    setTimeout(() => {
      console.log(this)
    }, 3000)
  }
}
obj1.timer() // obj1

var obj2 = {
  timer: () => {
    setTimeout(() => {
      console.log(this)
    }, 0)
  }
}
obj2.timer() // window 对象

var obj3 = {
  timer: () => {
    setTimeout(function() {
      console.log(this)
    }, 0)
  }
}
obj3.timer() // window 对象
```

## 系统对话框

alert()、confirm()、prompt()

样式不受 css 控制

js 单线程，弹出对话框时代码会停止执行，关闭后继续执行

# location 对象

他是 window 对象和 document 对象的一个属性，所以 window.location === window.location

> ## location 对象的属性：
>
> hash 返回 url 中的 hash（#hash）
>
> host 返回服务器名称和端口号（如果有）
>
> hostname 返回服务器名称
>
> href 返回完整 url
>
> pathname 返回 url 中目录和（或）文件名
>
> port 返回端口号或空字符串（无端口）
>
> protocol 返回使用协议
>
> search 返回 url 的查询字符串（‘？q=javasciptnb’）

## 位置操作

设置 location.href

设置 location 的各种属性后，产生的位置的改变，都会生成历史记录，而且除了设置 hash 外的操作都会以新的 url 重新加载页面

location.replace(url 字符串) 方法，不产生新历史记录

location.reload() 方法，重新加载页面

> 框架的 router 原理：
>
> 操作 location 对象
>
> 通过 histroy 对象（HTML5 的 API）
>
> [附一篇文章，底部的参考文章也很给力](https://juejin.im/post/5c52da9ee51d45221f242804)

# navigator 对象

访问浏览器及操作系统信息

常用于检测用户的设备（pc、Android、iOS）

## 检测插件 plugins

## 注册处理程序

# screen 对象

# history 对象（扩展 HTML5）

## 属性（不继承任何属性）：

History.length 返回一个整数，表示会话历史中元素的数目，包括当前加载的页面

History.scrollRestoration

History.state 返回一个表示历史堆栈顶部的状态的值。这是一种可以不必等待popstate 事件而查看状态而的方式。

## 方法：

History.back() 相当于浏览器左上角 <- 按钮，等价于 history.go(-1)

History.forward()

History.go()

History.pushState(
    状态对象,
    标题,
    url
) 添加一条路由历史记录，如果设置跨域网址则报错

History.replaceState() 与上类似

```js
// https://developer.mozilla.org/zh-CN/docs/Web/API/History
var stateObj = {foo: 'bar'}
history.pushState(stateObj, 'page2', 'bar.html')
// https://developer.mozilla.org/zh-CN/docs/Web/API/bar.html
```

popstate 事件：

每当处于激活状态的历史记录条目发生变化时,popstate事件就会在对应window对象上触发，调用 history.pushState() 或者 history.replaceState() 不会触发popstate事件

非常 nice 的示例：

```js
window.onpopstate = function(event) {
  alert("location: " + document.location + ", state: " + JSON.stringify(event.state));
};
//绑定事件处理函数.
history.pushState({page: 1}, "title 1", "?page=1");    //添加并激活一个历史记录条目 http://example.com/example.html?page=1,条目索引为1
history.pushState({page: 2}, "title 2", "?page=2");    //添加并激活一个历史记录条目 http://example.com/example.html?page=2,条目索引为2
history.replaceState({page: 3}, "title 3", "?page=3"); //修改当前激活的历史记录条目 http://ex..?page=2 变为 http://ex..?page=3,条目索引为3
history.back(); // 弹出 "location: http://example.com/example.html?page=1, state: {"page":1}"
history.back(); // 弹出 "location: http://example.com/example.html, state: null
history.go(2);  // 弹出 "location: http://example.com/example.html?page=3, state: {"page":3}
```

应用：pjax

pushState + ajax

里面引用的 ajax.js 是结合 promise 封装的 ajax 方法

```html
<!DOCTYPE html>
<html>
<head>
    <title>pjax</title>
</head>
<body>
    <a href="pjax1.html" class="pjax">page1</a>
    <a href="pjax2.html" class="pjax">page2</a>
    <div id="container">index</div>
<script src="ajax.js"></script>
<script>
let pjax = document.querySelectorAll('.pjax')
let container = document.querySelector('#container')
pjax.forEach((item) => {
    item.addEventListener('click', function(ev) {
        ev.preventDefault()
        ajax({
            method: 'GET',
            url: this.href,
            dataType: 'html'
        }).then(res => {
            container.innerHTML = res
        })
        window.history.pushState({url: this.href}, null, this.href)
    })
})
window.addEventListener('popstate', function() {
    ajax({
        method: 'GET',
        url: location.href,
        dataType: 'html'
    }).then(res => {
        container.innerHTML = res
    })
})
</script>
</body>
</html>
```

```html
<!DOCTYPE html>
<html>
<head>
    <title>page1</title>
</head>
<body>
页面1
</body>
</html>
```

```html
<!DOCTYPE html>
<html>
<head>
    <title>page2</title>
</head>
<body>
页面2
</body>
</html>
```