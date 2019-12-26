---
title: JS 离线应用与客户端存储
date: 2019-02-11 13:08:04
tags:
- 笔记
categories:
- 技术
---

JS 高程第23章离线应用与客户端存储的笔记

<!-- more -->

# 离线检测

navigator.onLine 检测设备是否联网

# 应用缓存 application cache

专门为开发离线 web 应用而设计

appcache 就是从浏览器的缓存中分出来的一块缓存区

# 数据存储

## HTTP cookie

### 限制

都在同一域名下（遵循跨域原则）

每个域的 cookie 总数有限

大小一般为 4K 以下

### 构成

1 名称：确定 cookie，不区分大小写

2 值：储存在 cookie 中的字符串值

3 域：那个域有效

4 路径：指定域中那个路径应该向服务器 **发送** cookie

5 失效日期：cookie 何时被删除的时间戳，默认浏览器会话结束时删除所有 cookie，可自己设置 GMT 格式（Mon, 22-Jan-07 07:10:24 GMT）日期

6 安全标志

cookie 的每一段信息都作为 HTTP 请求 Set-Cookie 头的一部分，使用分号加空格分隔每一段

> Set-Cookie: name=value; expires=Mon, 22-Jan-07 07:10:24 GMT; domain=.wrox.com

### js 中的 cookie

document.cookie 返回但前页面所有 cookie 的字符串，一系列由 **分号和空格** 分开的 **名值对**，名与值都经过 URL 编码（‘=’没有），所以需使用 decodeURLComponent() 来解码

cookie 的 读取、写入、删除操作，CookieUtil 对象表示：

```js
var CookieUtil = {
    get: function(name) {
        var cookieArr = document.cookie.split('; ').map((item) => {
            return item.split('=')
        })
        var cookieName = encodeURIComponent(name)
        var cookieValue
        cookieArr.forEach((item) => {
            if (item[0] === cookieName) cookieValue = decodeURIComponent(item[1])
        })
        return cookieValue
    },

    set: function(name, value, expires, path, domain, secure) {
        var cookieText = encodeURiComponent(name) + '=' + encodeURIComponent(value)
        if (expires instanceof Date) {
            cookieText += '; expires' + expires.toGMTString()
        }
        if (path) {
            cookieText += '; path=' + path
        }
        if (domain) {
            cookieText += ': domain=' + domain
        }
        if(secure) {
            cookieText += '; secure'
        }
        document.cookie = cookieText
    },

    unset: function(name, path, domain, secure) {
        this.set(name, '', new Date(0), path, domain, secure)
    } // new Date(0) 返回 Thu Jan 01 1970 08:00:00 GMT+0800 (中国标准时间)
}
```

调用示例：

```js
var expires = new Date()
expires.setDate(expires.getDate() + 7) // 设置过期时间为 7 天
CookieUtil.set('name', 'jack', expires)
CookieUtil.unset('name')

CookieUtil.set('user', 'tom', '/books/projs', 'www.wrox.com', new Date('2020-10'))
CookieUtil.unset('user', '/book/projs', 'www.wrox.com')
```

### 子 cookie

## Web 储存机制

Web Storage 的目的是克服由 cookie 带来的一些限制

### sessionStorage 对象

存储特定于某个会话的数据，浏览器关闭后消失，sessionStorage 中的数据可以跨越页面刷新而存在。

```js
sessionStorage.setItem('name', 'jack') // setItem 方法存储数据
sessionStorage.book = 'projs' // 属性存储数据

var name = sessionStorage.getItem('name')
var book = sessionStorage.book

// for-in 遍历
for (var key in sessionStorage) {
    console.log(key + '=' + sessionStorage.key(key)) // key() 方法
}

sessionStorage.removeItem('book') // 删除数据
```

### localStorage 对象

遵循跨域原则：要访问同一个 localStorage 对象，页面必须来自同一个域名（子域名无效），使用同一个协议，在同一个端口号

setItem()、getItem() 存读，属性存读

数据保留到 js 删除或用户清理浏览器缓存

大小一般为 2.5MB

### IndexedDB

indexed database

操作是完全异步的，因此大多数操作都是以请求的方式进行，但这些操作会在后期执行，如果成功返回结果，失败返回错误，几乎每次都需要注册 onsuccess 或 onerror 事件处理结果

#### 数据库

使用对象保存数据

一个 indexedDB 就是一组位于相同命名空间下的对象的集合

indexedDB.open('数据库名', 版本号（整数） = 1) 打开或创建数据库，返回一个 IDBOpenRequest 对象，在这个对象上可添加 onerror 和 onsuccess 事件处理程序

```js
var request, database
request = indexedDB.open('admin')
request.onerror = function(event) {
    console.log('something bad happened while trying to open' + event.target.errorCode)
}
// errorCode 返回错误码
request.onsuccess = function(event) {
    database = event.target.result
}
// result 返回一个数据库实例对象（IDBDatebase）保存在 database 变量中
```

event.target 都指向 request（IDBOpenRequest） 对象

