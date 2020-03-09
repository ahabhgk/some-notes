# Io

> Io 语法只不过把消息全部串联起来，每个消息都返回一个对象，每条消息都也都带有括号内的可选参数
> Io 中，一切皆为消息，且每条消息都会返回另一条接受消息的对象
> Io 没有类，只需要与对象打交道，必要时把对象复制一下就行，这些被复制的对象叫原型，原型语言中，每个对象都不是类的复制品，而是一个实实在在的对象

```shell
brew install io
```

所有事物都是对象，对由于对象交互的都是消息

消息：左边的是对象，右边的是消息，把消息发给对象

```io
"Hello, Io" print // "Hello, Io" 对象接收 print 消息
// => "Hello, Io"
Vehicle := Object clone // Object 是跟对象，发送 clone 消息，返回一个新对象，并赋值给 Vehicle
Vehicle description := "gogogo" // 对象上有槽，:= 没有则创建并赋值，= 只赋值，没有则报错
Vehicle type // => Vehicle，每个对象都有 type 槽
Vehicle slotNames // => list(type, description)
```

原型

```io
Vehicle proto // => Object
Car := Vehicle clone
ferrari := Car clone
ferrari slotNames // => list() type 应该是大写开头
ferrari type // => Car 得到原型

Car drive := method("Vroom" println)
ferrari drive // => "Vroom"
ferrari proto // => Car

Lobby // 主命名空间
```

List

```io
nums := list(1, 2, 3, 4)
nums size // => 4
nums append(5)
nums average // => 3
nums pop
nums prepend
nums isEmpty // => false
```

Map

```io
elvis := Map clone
elvis atPut("home", "Graceland")
elvis at("home") // => "Graceland"
elvis atPut("style", "ror")
elvis asObject // => home = "Graceland" style = "ror"
elvis asList // => list(list("home", "Graceland"), list("style", "ror"))
elvis size // => 2
elvis keys // => list("home", "style")
```

true false nil 都是单例

```io
true proto // => Object
true clone // => true

// 实现单例
Highlander := Object clone
Highlander clone := Highlander
```

