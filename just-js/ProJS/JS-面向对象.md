---
title: JS 面向对象
date: 2019-01-29 12:39:04
tags:
- 笔记
categories:
- 技术
---

JS 高程中面向对象的笔记

<!-- more -->

# 理解对象

## 属性类型

### 数据属性

4 个特性

Configurable 默认 true

Enumerable 默认 true

Writable 默认 true

Value 默认 undefined

Object.defineProperty() 修改属性默认的特性

### 访问器属性

包含一对 getter 和 setter 函数（都不是必须的）

4 个特性

Configurable 默认 true

Enumerable 默认 true

Get 默认 undefined

Set 默认 undefined

访问器属性不能直接定义，必须使用  Object.defineProperty() 来定义

## 定义多个属性

Object.defineProperties()

```javascript
var book = {}

Object.defineProperties(book, {
    _year: {
        value: 2004
    },

    edition: {
        value: 1
    },

    year: {
        get: function() {
            return this._year
        }

        set: function(newValue) {
            if (newValue > 2004) {
                this._year = newValue
                this.edition += newValue - 2004
            }
        }
    }
})
```

## 读取属性的特性

Object.getOwnPropertyDexcriptor() 接收两个参数：属性所在的对象和要读取其描述符的属性名称，返回一个对象：若果是访问器属性，该对象的属性有  configuable、enumerable、get、set 如果是数据属性，该对象的属性有 configurable、enumerable、writable、value

```javascript
var book = {}

Object.defineProperties(book, {
    _year: {
        value: 2004
    },

    edition: {
        value: 1
    },

    year: {
        get: function() {
            return this._year
        }

        set: function(newValue) {
            if (newValue > 2004) {
                this._year = newValue
                this.edition += newValue - 2004
            }
        }
    }
})

var descriptor = Object.getOwnPropertyDescriptor(book, "_year")
console.log(descriptor.value) // 2004
console.log(descriptor.configurable) // fales
console.log(typeof descriptor.get) // "undefined"

var descriptor = Object.getOwnPropertyDescriptor(book, "year")
console.log(descriptor.value) // undefined
console.log(descriptor.enumerable) // false
console.log(typeof descriptor.get) // "function"
// get 是一个指向 getter 函数的指针
```

# 创建对象

## 工厂模式

用函数来封装以特定接口创建对象的细节

```javascript
function createPerson(name, age, job) {
    var o = new Object()
    o.name = name
    o.age = age
    o.job = job
    o.sayName = function() {
        console.log(this.name)
    }
    return o
}

var person1 = createPerson("Jack", 22, "CEO")
```

解决了创建多个相似对象的问题，但没有解决对象识别的问题（即怎样知道一个对象的类型）

## 构造函数模式

构造函数可以用来创建特定类型的对象，像 Object 和 Array 这样的原生构造函数

```javascript
function Person(name, age, job) {
    this.name = name
    this.age = age
    this.job = job
    this.sayName = function() {
        console.log(this.name)
    }
}

var person1 = new Person("jack", 22, "CEO")
var person2 = new Person("tom", 33, "worker")
```

> new 操作符具体步骤
>
> 1 创建一个新对象
>
> 2 将对象的原型指向 Person.prototype
>
> 3 然后 Person.apply(obj, [args])
>
> 4 返回新对象
>
> ```javascript
> var person1 = {}
> person1.__proto__ = Person.prototype
> Person.apply(person1, ["jack", 22, "CEO"])
> ```

person1 和 person2 分别保存着 Person 的一个不同的实例，这两个对象都有一个 constructor （构造函数）属性，该属性指向 Person

```javascript
console.log(person1.constructor == person) // true
console.log(person2.constructor == person) // true
console.log(person1 instanceof Object) // true
console.log(person1 instanceof Person) // true
console.log(person2 instanceof Object) // true
console.log(person2 instanceof Person) // true
```

person1 和 person2 同时也是Object 的实例，因为所有对象均继承自 Object

构造函数模式可将他的实例表示为一种特定的实例，这正是胜过工厂模式的地方

### 将构造函数当作函数

不通过 new 操作符来调用

```javascript
Person("greg", 27, "Doc") // 添加到 window
window.sayName() // "greg"

var o = {}
Person.call(o, "kris", 25, "rapper") // 另一个对象的作用于中调用
o.sayName() // "kris"
```

### 缺点

每个方法都要在每一个实例上重新创建一遍，不同实例上的同名函数是不相等的

```javascript
console.log(person1.sayName == person2.sayName) // false
```

如果把 sayName() 定义到外部，而在构造函数内部，将 sayName 属性设置成等于全局的 sayName()，这样污染全局，没有封装性可言

## 原型模式

我们创建的每个函数都有一个 prototype（原型）属性，这个属性是一个指针，指向一个对象（原型对象），这个对象的用途是包含可以由特定类型的所有实例共享的属性和方法

```javascript
function Person() {}
Person.prototype.name = "jack"
Person.prototype.age = 22
Person.prototype.job = "CEO"
Person.prototype.sayName = function() {
    console.log(this.name)
}

var person1 = new Person()
person1.sayName() // "jack"
var person2 = new Person()
console.log(person1.sayName == person2.sayName) // true
```

### 理解原型对象

![](https://kuangjiajia.github.io/six/proto.png)

```javascript
function Person() {}
Person.prototype.name = "jack"
Person.prototype.age = 22
Person.prototype.job = "CEO"
Person.prototype.sayName = function() {
    console.log(this.name)
}

var person1 = new Person()
var person2 = new Person()
person1.name = "greg"
console.log(person1.name) // "greg"
// 来自实例
console.log(person2.name) // "jack"
// 来自原型

console.log(person1.hasOwnProperty("name")) // true
// hasOwnProperty() 检测一个属性是否存在于实例中，该方法是从 Object 继承而来

delete person1.name // delete 操作符删除实例上的属性
console.log(person1.name) // "jack"
// 来自原型
```

在访问 person1.name 时，会在实例上搜索 name 属性，这个属性存在，于是返回他而不必再搜索原型

在访问 person2.name 时，实例上的 name 属性不存在，于是搜索原型上的 name 属性并返回

若原型上仍没有 name 属性，则按 __proto__ （原型链）向上搜索，直到找到并返回，如果都没有则返回 undefined

### 原型与 in 操作符

```js
function Person() {}
Person.prototype.name = "jack"
Person.prototype.age = 22
Person.prototype.job = "CEO"
Person.prototype.sayName = function() {
    console.log(this.name)
}

var person1 = new Person()
console.log("name" in person1) // true
person1.name = "greg"
console.log("name" in person1) // true
```

for in 遍历对象

```js
var P = {
    name: "jack",
    age: 22,
    job: "CEO",
    sayName: () => {
        console.log(this.name)
    }
}
for (let prop in P) {
    console.log(prop, P[prop])
}
// naem jack
// age 22
// job CEO
/*
sayName () => {
    console.log(this.name)
}
*/
```

Object.keys()

```js
console.log(Object.keys(P)) // ["name", "age", "job", "sayName"]
```

### 更简单的原型语法

```js
function Person() {}
Person.prototype = {
    name: "jack",
    age: "22",
    job: "CEO",
    sayName: function() {
        console.log(this.name)
    }
}
var person1 = new Person()
console.log(person1.constructor) // f Object() { [native code] }
```

之前说过，每创建一个函数，就会同时创建他的 prototype 对象，这个对象也会自动获得 constructor 属性，而在这里本质上是完全重写了默认的 prototype 对象，因此 constructor 属性就变成了新对象的 constructor 属性（指向 Object 构造函数），不在指向 Person 函数

```js
function Person() {}
Person.prototype = {
    constructor: Person, // 特意指定，但会导致他的 [[Enumerable]] 特性被设置为 true，原生的 constructor 属性默认是不可枚举的
    name: "jack",
    age: "22",
    job: "CEO",
    sayName: function() {
        console.log(this.name)
    }
}
```

### 原型的动态性

**实例与原型之间的联系是一个指针**

```js
function Person() {}
Person.prototype = {
    constructor: Person,
    name: "jack",
    age: "22",
    job: "CEO",
    sayName: function() {
        console.log(this.name)
    }
}
var person = new Person()
Person.prototype.sayName = function() {
    console.log(this.name + " says Hi")
}
person.sayName() // "jack says Hi"
```

### 原生对象的原型

添加或重写原生对象的方法（不推荐）

### 原生对象的问题

1 没有为构造函数传递初始化参数这一环节

2 通过在实例上添加一个同名属性时，可行，但对于包含引用类型的属性来说：

```js
function Person() {}
Person.prototype = {
    constructor: Person,
    name: "jack",
    age: 22,
    job: "CEO",
    friends: ["tom", "tony"]
}

var person1 = new Person()
var person2 = new Person()

person1.friends.push("van")
console.log(person2.friends) // ["tom", "tony", "van"]

person1.friends = ["alone"]
console.log(person1.friends) // ["alone"]
console.log(person2.friends) // ["tom", "tony", "van"]
```

## 组合使用构造函数模式和原型模式

构造函数模式定义属性，原型模式定义方法

```js
function Person(name, age, job) {
    this.name = name
    this.age = age
    this.job = job
    this.friends = ["tom", "tony"]
}
Person.prototype = {
    constructor: Person,
    sayName: function() {
        console.log(this.name)
    }
}
```

使用最广泛、认同度最高的一种创建自定义类型的方法

## 动态原型模式

```js
function Person(name) {
    this.name = name
    if (typeof this.getName != "function") {
        Person.prototype.getName = function () {
            console.log(this.name)
        }
    }
}

var person1 = new Person("jack")
```

使用动态原型模式时，不能用对象字面量重写原型

## 寄生构造函数模式

```js
function Person(name) {

    var o = new Object();
    o.name = name;
    o.getName = function () {
        console.log(this.name);
    };

    return o;

}

var person1 = new Person('kevin');
console.log(person1 instanceof Person) // false
console.log(person1 instanceof Object)  // true
```

建议可以使用其他模式的情况下，不要使用这种模式

这种方法一般在特殊情况下使用。比如我们想创建一个具有额外方法的特殊数组，但是又不想直接修改Array构造函数，我们可以这样写：

```js
function SpecialArray() {
    var values = new Array();

    for (var i = 0, len = arguments.length; i < len; i++) {
        values.push(arguments[i]);
    }
    // 或者 values.push.apply(values, arguments)

    values.toPipedString = function () {
        return this.join("|");
    };
    return values;
}

var colors = new SpecialArray('red', 'blue', 'green');
var colors2 = SpecialArray('red2', 'blue2', 'green2');


console.log(colors);
console.log(colors.toPipedString()); // red|blue|green

console.log(colors2);
console.log(colors2.toPipedString()); // red2|blue2|green2
```

你会发现，其实所谓的寄生构造函数模式就是比工厂模式在创建对象的时候，多使用了一个new，实际上两者的结果是一样的。

## 稳妥构造函数模式

```js
function person(name){
    var o = new Object();

    // 可以在这里定义私有变量和函数

    // 添加方法
    o.sayName = function(){
        console.log(name);
    };

    // 返回对象
    return o;
}

var person1 = person('kevin');

person1.sayName(); // kevin

person1.name = "daisy";

person1.sayName(); // kevin

console.log(person1.name); // daisy
```

所谓稳妥对象，指的是没有公共属性，而且其方法也不引用 this 的对象。

只能调用 sayName() 访问 name

稳妥对象最适合在一些安全的环境中。

稳妥构造函数模式也跟工厂模式一样，无法识别对象所属类型。

## ES6 的 class 创建对象

语法糖

可理解为：

类：prototype（Person.prototype）、constructor（Person）

对象：new 出来的（person1、person2）

类必须使用 new 调用，否则会报错，这是它跟普通构造函数的一个主要区别，后者不用 new 也可以执行

### 实例属性、实例方法

ES6:

```js
class Person {
    constructor(name, friends) {
        this.name = name
        this.friends = friends
    } // 实例属性

    sayHello() {
        return `hello! ${this.friends.toString()}, I am ${this.name}`
    } // 实例方法
}

var jack = new Person('jack', ['tom', 'tony'])
jack.sayHello() // "hello! tom,tony, I am jack"
```

ES5:

```js
function Person(name, friends) {
    this.name = name
    this.friends = friends
}

Person.prototype.sayHello = function() {
    return 'hello! ' + this.friends.toString() + ', I am ' + this.name
}

var jack = new Person('jack', ['tom', 'tony'])
jack.sayHello() // "hello! tom,tony, I am jack"
```

### 静态属性、静态方法

ES6:

```js
class Person {}
Person.name = 'jack'
Person.sayHi = () => {
    console.log('Hi')
}

let person1 = new Person()
console.log(Person.name) // 'jack'
console.log(person1.name) // undefined

Person.sayHi() // 'Hi'
person1.sayHi() // Uncaught TypeError: person1.say is not a function
```

ES5:

```js
function Person() {}
Person.name = 'jack'
Person.sayHi = function() {
    console.log('Hi')
}

var person1 = new Person()
console.log(Person.name) // 'jack'
console.log(person1.name) // undefined

Person.sayHi() // 'Hi'
person1.sayHi() // Uncaught TypeError: person1.say is not a function
```

新写法（提案，Bable 已支持）：

```js
class Person {
    static name = 'jack' // Uncaught SyntaxError: Unexpected token =
    // 定义静态属性，☹️???
    static sayHello() {
        return 'hello'
    } // 目前只能定义静态方法
}
```

### getter 和 setter

与 ES5 一样，在“类”的内部可以使用 get 和 set 关键字，对某个属性设置存值函数和取值函数，拦截该属性的存取行为。

ES6:

```js
class Person {
    get name() {
        return 'kevin'
    }
    set name(newName) {
        console.log(`my new name is ${newName}`)
    }
}

let person = new Person()

person.name = 'daisy' // my new name is daisy
console.log(person.name) // kevin
```

ES5:

```js
function Person(name) {}

Person.prototype = {
    get name() {
        return 'kevin'
    },
    set name(newName) {
        console.log('my new name is ' + newName)
    }
}

let person = new Person()

person.name = 'daisy' // new name is daisy
console.log(person.name) // kevin
```

# 继承

## 原型链

![](https://kuangjiajia.github.io/six/proto.png)

```js
function SuperType() {
    this.property = true
}
SuperType.prototype.getSuperValue = function() {
    return this.property
}

function SubType() {
    this.subproperty = false
}
// 继承 SuperType，原型换为 SuperType 的实例
SubType.prototype = new SuperType()

SubType.prototype.getSubValue = function() {
    return this.subproperty
}

var instance = new SubType()
console.log(instance.getSuperValue()) // true

// 伪代码
instance
    subproperty: false
    __proto__: SubTpye.prototype
```

![](https://kuangjiajia.github.io/six/proto.png)

### 确定原型和实例的方法

instanceof 操作符：查找 constructor

isPrototypeOf()

```js
console.log(instance instanceof Object) // true
console.log(instance instanceof SuperType) // true
console.log(instance instanceof SubType) // true

console.log(Object.prototype.isPrototypeOf(instance)) // true
console.log(SuperType.prototype.isPrototypeOf(instance)) // true
console.log(SubType.prototype.isPrototypeOf(instance)) // true
```

### 重写超类方法

```js
SubType.prototype.getSuperValue = function() {
    return 666
}
// 如果通过 SuperType 的实例调用 getSuperValue() 方法呢？
// 还是原来的方法，返回 true
```

> **不能**通过对象字面量的方式创建原型方法，因为这样会重写（破坏）原型链

### 缺点

引用类型值的原型属性会被实例共享，这也是为什么要在构造函数中，而不是在原型对象中定义属性的原因

再通过原型来实现继承时，原先超类的实例属性成为了子类的原型属性

```js
function SuperType() {
    this.colors = ['red', 'blue']
}

function SubType() {}

SubType.prototype = new SuperType()

var instance1 = new SubType()
var instance2 = new SubType()
instance1.colors.push('green')
console.log(instance2.colors) // ["red", "blue", "green"]
```

## 借用构造函数

在子类构造函数的内部调用超类构造函数

```js
function SuperType(name) {
    this.name = name
    this.colors = ['red', 'bule']
}
function SubType() {
    SuperType.call(this, 'jack')
    // 传参
}

var instance1 = new SubType()
var instance2 = new SubType()
instance1.colors.push('green')
console.log(instance2.colors) // ["red", "bule"]
console.log(instance1.name) // 'jack'
```

## 组合继承

```js
function SuperType (name) {
    this.name = name
    this.colors = ['red', 'blue']
}
SuperType.prototype.sayName = function () {
    console.log(this.name)
}

function SubType (name, age) {

    SuperType.call(this, name) // 第二次

    this.age = age

}

SubType.prototype = new SuperType() // 第一次
SubType.prototype.constructor = SubType
SubType.prototype.sayAge = function() {
    console.log(this.age)
}

var instance1 = new SubType('kevin', '18')

instance1.colors.push('green')
console.log(instance1.colors) // ["red", "blue", "green"]

instance1.sayName() // 'kevin'
instance1.sayAge() // 18

var instance2 = new SubType('daisy', '20')
console.log(instance2.colors) // ["red", "blue"]
```

最常用的继承模式

缺点：调用两次超类构造函数，一次在创建原型的时候，另一次在子类型构造函数内部

### 继承多个类

Object.assign()

```js
const object1 = {a: 'a'}
const object2 = {b: 'b'}

const object233 = Object.assign({c: 'c', d: 'd'},object1,object2)

console.log(object233.a, object233.b, object233.c, object233.d) // a b c d
```

```js
function MyClass() {
     SuperClass.call(this);
     OtherSuperClass.call(this);
}

// 继承一个类
MyClass.prototype = Object.create(SuperClass.prototype);
// 混合其它
Object.assign(MyClass.prototype, OtherSuperClass.prototype);
// 重新指定constructor
MyClass.prototype.constructor = MyClass;

MyClass.prototype.myMethod = function() {
     // do a thing
};
```

## 原型式继承

```js
function creatObj(o) {
    function F() {}
    F.prototype = o
    return new F()
}
// Object.create() 的模拟实现
```

Object.create(proto, propertiesObject)

proto：新创建对象的原型

propertiesObject：可选，默认 undefined

```js
o = Object.create(Object.prototype, {
  // foo会成为所创建对象的数据属性
  foo: {
    writable:true,
    configurable:true,
    value: "hello"
  },
  // bar会成为所创建对象的访问器属性
  bar: {
    configurable: false,
    get: function() { return 10 },
    set: function(value) {
      console.log("Setting `o.bar` to", value);
    }
  }
});
```

new、o = {}、Object.create() 区别

```js
var o;

// 创建一个原型为null的空对象
o = Object.create(null);

o = new Object
o = {};
// 以 new 或字面量方式创建的空对象就相当于:
o = Object.create(Object.prototype);
```

原型式继承代码

```js
var person = {
    name: 'jack'
    friends: ['tom', 'tony']
}

var anotherPerson = Object.create(person)
anotherPerson.name = 'greg'
anotherPerson.friends.push('bob')
console.log(person.friends) // ['tom', 'tony', 'bob']
```

## 寄生式继承

```js
function createObj (o) {
    var clone = Object.create(o);
    clone.sayName = function () {
        console.log('hi');
    }
    return clone;
}
```

使用寄生式继承来为对象添加函数，不能做到函数复用，效率低，与构造函数模式类似

## 寄生组合式继承

```js
function object(o) {
    function F() {}
    F.prototype = o;
    return new F();
}

function prototype(child, parent) {
    var prototype = object(parent.prototype);
    prototype.constructor = child;
    child.prototype = prototype;
}

// 当我们使用的时候：
prototype(Child, Parent);
```

![](https://user-gold-cdn.xitu.io/2018/11/7/166ee8739bc48abb?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

这种方式的高效率体现它只调用了一次 Parent 构造函数，并且因此避免了在 Parent.prototype 上面创建不必要的、多余的属性。与此同时，原型链还能保持不变；因此，还能够正常使用 instanceof 和 isPrototypeOf。开发人员普遍认为寄生组合式继承是引用类型最理想的继承范式。

## ES6 的 class 继承

还是语法糖

寄生组合式继承对应 ES6

```js
class Parent {
    constructor(name) {
        this.name = name
    }
}

class Child extends Parent {
    constructor(name, age) {
        super(name) // 调用超类的 constructor(name)
        this.age = age
    }
}

var parent1 = new Parent('jack')
var child1 = new Childe('tom', 18)
console.log(parent1) // {name: 'jack'}
console.log(child1) // {name: 'tom', age: 18}
```

super() 表示超类的构造函数，相当于 Parent.call(this)

### 子类的 __proto__

在 ES6 中，父类的静态方法，可以被子类继承

```js
class Foo {
  static classMethod() {
    return 'hello';
  }
}

class Bar extends Foo {
}

Bar.classMethod(); // 'hello'
```

这是因为 class 作为构造函数的语法糖，同时有 prototype 属性和 \_\_proto__ 属性，因此同时存在两条继承链。

（1）子类的 \_\_proto__ 属性，表示构造函数的继承，总是指向父类。

（2）子类 prototype 属性的 \_\_proto__ 属性，表示方法的继承，总是指向父类的 prototype 属性。

```js
class Parent {
}

class Child extends Parent {
}

console.log(Child.__proto__ === Parent); // true
console.log(Child.prototype.__proto__ === Parent.prototype); // true
```

![](https://user-gold-cdn.xitu.io/2018/11/7/166ee8739bd08cc6?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)
