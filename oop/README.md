# Classless OOP

**OOP 那套“封装、继承、多态”只是用的人多，是不是最好不一定**

三个代码中还是看注释里的参考文章，自己只是基于其尽量实现封装、继承、多态

## 经过实现和思考，一些感悟：

老道的所说的不需要 this 和 class 的 JavaScript 确实很美好

* JavaScript 的作用域是静态的，但只有 this 的指向是动态的，虽然就 4 种，并不难，但到了很大的项目中还是会被搞得很乱

* JavaScript 本身是基于原型的，new、class 这些关键字和“组合式创建”、“寄生组合式继承”都在模仿基于类的 OOP，而不是发挥基于原型的特征，这的确让人有点不爽

但很多时候还是“真香“

* Classless 有时实现的 OOP 那套“封装、继承、多态”并不如 class 全面、方便（虽然 OOP 那套“封装、继承、多态”只是用的人多，是不是最好不一定）

* 人的习惯，并不是每一个开发者都适应 JavaScript，class 关键字又是可读性好、写起来爽

一年过来一直学习基于原型的 OOP 模仿基于类的 OOP，学的贼溜，思维也有些固化，这回最大的收获就是打破了固化思维吧，认识到 JavaScript 的 OOP 可以更灵活，通过本身的特性可以解决基于类的很多问题，有些设计模式写起来也更方便

## 参考：

[或许我们在 JavaScript 中不需要 this 和 class](https://zhuanlan.zhihu.com/p/59917327)

[classless.md](https://gist.github.com/mpj/17d8d73275bca303e8d2)

[Douglas Crockford: The better parts](https://vimeo.com/97419177)

[Composition over Inheritance](https://medium.com/humans-create-software/composition-over-inheritance-cb6f88070205)
