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

条件和循环

```io
i := 1
while(i <= 3, i println; i = i + 1); "end" println // ; 会把两个消息连接执行
// 1
// 2
// 3
// end

for(i, 1, 11, 2, i println)
// 1
// 3
// 5
// 7
// 9
// 11
// => 11

loop("dead loop" println) // ...

if(true, "it's true", "it's false") // "it's true"
```

运算符

```io
OperatorTable
// ==> OperatorTable_0x7facc5448ee0:
// Operators
//   0   ? @ @@
//   1   **
//   2   % * /
//   3   + -
//   4   << >>
//   5   < <= > >=
//   6   != ==
//   7   &
//   8   ^
//   9   |
//   10  && and
//   11  or ||
//   12  ..
//   13  %= &= *= += -= /= <<= >>= ^= |=
//   14  return

// Assign Operators
//   ::= newSlot
//   :=  setSlot
//   =   updateSlot

// To add a new operator: OperatorTable addOperator("+", 4) and implement the + message.
// To add a new assign operator: OperatorTable addAssignOperator("=", "updateSlot") and implement the updateSlot message.
```

消息：由 sender target arguments 组成

```io
// call 可以访问消息的元信息
a myTargets := method(call target)
a mySender := method(call sender)
a myMessageName := method(call message name)
a myMessageArgs := method(call message arguments)

a myTargets // => a
a mySender // => Object proto
a myMessageName // => myMessageName
a myMessageArgs(1, 2) // => list(1, 2)
```

```io
myif := method(
  (call sender doMessage(call message argAt(0))) ifTrue(
  call sender doMessage(call message argAt(1))) ifFalse(
  call sender doMessage(call message argAt(2)))
)

myif(foo == bar, write("true\n"), write("false\n"))
```

## DSL

🤣做 XOR

```io
OperatorTable addOperator("🤣", 11)
OperatorTable println
true 🤣 := method(bool, if(bool, false, true))
false 🤣 := method(bool, if(bool, true, false))

true 🤣 true print // => false
true 🤣 false print // => true
```

解析 JSON

```io
// Make the : an operator so we can parse JSON kv-pairs
OperatorTable addAssignOperator(":", "atPutNumber")

// Because atPut already stringifies the key, we string the extra quotes
Map atPutNumber := method(
  self atPut(
    call evalArgAt(0) asMutable removePrefix("\"") removeSuffix("\""),
    call evalArgAt(1)
  )
)

// Fires whenever the parser encounters curly brackets
curlyBrackets := method (
  writeln("Parsing curly brackets")
  r := Map clone
  call message arguments foreach(arg,
    writeln("An arg: ", arg)
    r doMessage(arg)
  )
  r
)

s := File with("phonebook.json") openForReading contents
// doString evaluates text as Io source code
phoneNumbers := doString(s)

phoneNumbers keys println // => list("Bob Smith", "Mary Walsh")
phoneNumbers values println // => list("5195551212", "4162223434")
```

method_missing：编写简易 HTML

Io 中的 method_missing 是类的 forward

```io
Builder := Object clone
Builder forward := method(
  writeln("<", call message name, ">")
  call message arguments foreach(
    arg,
    content := self doMessage(arg);
    if(content != nil, if(content type == "Sequence", writeln(content)))
  )
  writeln("</", call message name, ">")
)

Builder ul(
  li("Io")
)
// <ul>
// <li>
// Io
// </li>
// </ul>
```

JavaScript 中通过模版字符串实现类似功能

## 并发

[Io 并发](https://iolanguage.org/guide/guide.html#Concurrency)

异步消息：@ 前缀的消息返回 future，@@ 前缀的消息返回 nil 并在自身上下文中触发消息

协程：“轻量级线程”

可以想象成带有多个入口和出口的函数，每次 yield 都会保存当前上下文，并把控制权交给另一上下文当中

```io
// coroutine.io
odd := Object clone
odd numbers := method(
  1 println
  yield
  3 println
  yield
)

even := Object clone
even numbers := method(
  yield
  2 println
  yield
  4 println
)

odd @@numbers
even @@numbers

Coroutine currentCoroutine pause

// $ io coroutine.io
// 1
// 2
// 3
// 4
// Scheduler: nothing left to resume so we are exiting
```

actor：能接收消息并基于其执行运算，也可以发送消息给其他 Actor。Actors 之间相互隔离，它们之间并不共享内存

一个 actor 只能改变自身的状态，并通过严格的队列接触其他 actor，而线程可以不受限制的改变彼此状态，有竞争条件的并发问题

Io 中发送异步消息的对象就是 actor

```io
slower := Object clone
faster := Object clone
slower start := method(wait(2); writeln("slowly"))
faster start := method(wait(1); writeln("fastly"))

slower start; faster start
// 2s => "slowly"
// 3s => "fastly"

slower @@start; faster @@start; wait(3) // slower actor 接收 start 消息到队列，执行；faster actor 接收 start 消息到队列，执行
// 1s => "fastly"
// 2s => "slowly"
```

future：@ 调用消息时返回，一段时间后会变成结果值，如果未产生结果是使用 future 就会阻塞直到产生结果

类似于 JavaScript 中的 async/await（async/await 通过 Promise 实现，但写法上 future 更像 async/await）

## think

占用空间小，容易安装

对象与消息，简单强大

简洁的语法，Lisp + OOP

很自由，DSL 能力强大

先进的并发模型

性能不行

社区太太太太小
