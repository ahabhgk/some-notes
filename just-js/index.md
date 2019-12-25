# Magic JS

## 类型转换

1. string 转 number

    调用 valueOf 方法

    ```js
    +'123' // 123
    +'ds' // NaN
    +'' // 0
    +null // 0
    +undefined // NaN
    +new Date() // 1571584969942
    +{ valueOf: () => '3' } // 3
    ```

2. object 转 string

    > 《Effective JavaScript》P11：当 +用在连接字符串时，当一个对象既有 toString方法又有 valueOf方法时候，JS通过盲目使用 valueOf方法来解决这种含糊。

    ```js
    '' + { toString: () => 'J', valueOf: () => 'S' } // 'S'
    ```

## 位运算

### 双位运算符、取整

取整（去掉小数），代替正数的 Math.floor 负数的 Math.ceil

```js
Math.floor(4.8) // 4
~~4.8 // 4

Math.ceil(-4.8) // -4
~~-4.8 // -4

4.8 | 0 // 4

-4.8 | 0 // -4
```

## 函数

### 强制参数

```js
const mandatory = () => new Error('Missing parameter!')

const foo = (bar = mandatory()) => {
  // ...
}
```

### 函数体内重写函数

惰性载入函数：

```js
function lazyLoad(imgs) {
  if ('loading' in HTMLImageElement.prototype) {
    lazyLoad = function lazyLoad(imgs) {
      imgs.forEach(/* some codes */)
    }
  } else {
    lazyLoad = function lazyLoad(imgs) {
      // lots of codes
    }
  }

  return lazyLoad(imgs)
}
```

一次性函数：

```js
let foo = () => {
  console.log('hah')

  foo = () => console.log('?')
}
```
