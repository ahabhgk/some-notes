# Prolog

逻辑编程语言，不是通过算法来解决逻辑问题

基本构造单元：事实、规则、查询

常量小写开头，变量大写开头

```prolog
/* 事实 */
likes(tom, jack).
likes(teacherma, pony).
likes(jerry, pony).
likes(jerry, teacherma).

/* 规则 */
/* \+ 取反 \+(X = Y) 表示 X 不等于 Y，, 逗号分割子目标，都是真才真 */
friend(X, Y) :- \+(X = Y), likes(X, Z), likes(Y, Z).
```

```shell
-? friend(teacherma, jerry)
true.

-? likes(jerry, Who).
Who = pony ;
Who = teacherma.
```

例：地图着色

```prolog
color(red).
color(green).
color(blue).

colorify(A,B,C,D,E) :-
    color(A), color(B), color(C), color(D), color(E),
    \+ A=B, \+ A=C, \+ A=D, \+ A=E,
    \+ B=C, \+ C=D, \+ D=E.
```

```shell
?- colorify(A,B,C,D,E).
A = red,
B = D, D = green,
C = E, E = blue;
A = red,
B = D, D = blue,
C = E, E = green ;
A = green,
B = D, D = red,
C = E, E = blue ;
A = green,
B = D, D = blue,
C = E, E = red ;
A = blue,
B = D, D = red,
C = E, E = green ;
A = blue,
B = D, D = green,
C = E, E = red ;
```

递归

```prolog
father(a, b).
father(b, c).
father(c, d).
father(d, e).

ancestor(X, Y) :- father(X, Y).
ancestor(X, Y) :- father(X, Z), ancestor(Z, Y).
```

```shell
?- ancestor(a, Who).
Who = b ;
Who = c ;
Who = d ;
Who = e ;
false.
```

列表长度可变 `[1, 2, 3]`，元组长度不可变 `(1, 2, 3)`

```shell
?- (1, 2, 3) = (1, 2, 3)
true
?- [1, 2, 3] = [1, 2, 3]
true
?- (A, 2, C) = (1, B, 3)
A = 1
B = 2
C = 3
?- [A, 2, C] = [1, B, 3]
A = 1
B = 2
C = 3
?- [a, b, c, d, e] = [_, _| [Head | Tail]]
Head = c
Tail = [d, e]
```

