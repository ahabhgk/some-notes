/* eslint-disable */

"use strict";

var _createClass = (function () {
  // parma1：目标对象 parma2：属性数组
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      // 可枚举，for in 能循环出来
      descriptor.enumerable = descriptor.enumerable || false;
      // 可配置，可通过 delete 删除此属性
      descriptor.configurable = true;
      // 可修改值
      if ("value" in descriptor) descriptor.writable = true;
      // 向 目标对象 上添加属性
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  // param1：构造函数 parma2：原型上的属性 parma3：静态属性（类上的属性）
  return function (Constructor, protoProps, staticProps) {
    // 在 对象原型 上添加 param2 原型上的属性
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    // 在 对象 上添加 param3 静态属性
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
})();

// 类的调用检查 param1：类的实例 param2：类的构造函数
function _classCallCheck(instance, Constructor) {
  // 如果这个实例不是构造函数的实例的话，就报错：
  // Cannot call a class as a function
  // 不能把类当作函数使用，类的构造函数只能通过 new 调用
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var Parent = (function () {
  function Parent(name) {
    // 保证只能用 new 调用
    _classCallCheck(this, Parent);

    this.name = name;
  }

  _createClass(
    Parent,
    [
      {
        key: "getName",
        value: function getName() {
          console.log(this.name);
        }
      }
    ],
    [
      {
        key: "getAge",
        value: function getAge() {
          console.log("no age, haha");
        }
      }
    ]
  );

  return Parent;
})();
