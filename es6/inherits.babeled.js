/* eslint-disable */

"use strict";

var _createClass = (function() {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  return function(Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
})();

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError(
      "this hasn't been initialised - super() hasn't been called"
    );
  }
  return call && (typeof call === "object" || typeof call === "function")
    ? call
    : self;
}

function _inherits(subClass, superClass) {
  // 如果父类不是函数，也不是 null
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError(
      "Super expression must either be null or a function, not " +
        typeof superClass
    );
  }
  // 给子类的构造函数重写原型 prototype，让子类的 prototype 等于父类的一个实例，并纠正 constructor
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    // 重写 subClass 的 constructor，防止其指向 superClass 的构造函数
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass)
    // 兼容处理
    Object.setPrototypeOf // es6 的方法
      // 让子类的 __proto__ 等于父类，让子类继承父类的静态属性
      ? Object.setPrototypeOf(subClass, superClass)
      : (subClass.__proto__ = superClass);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var Parent = (function() {
  function Parent(name) {
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

var Child = (function(_Parent) {
  _inherits(Child, _Parent);

  function Child(name, age) {
    _classCallCheck(this, Child);

    var _this = _possibleConstructorReturn(
      this,
      (Child.__proto__ || Object.getPrototypeOf(Child)).call(this, name)
    );

    _this.age = age;
    return _this;
  }

  _createClass(Child, [
    {
      key: "getAge",
      value: function getAge() {
        console.log(this.age);
      }
    }
  ]);

  return Child;
})(Parent);
