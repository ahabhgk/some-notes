class Compile {
  constructor(el, vm) {
    this.el = this.isElementNode(el) ? el : document.querySelector(el)
    this.vm = vm

    if (this.el) { // 能获取到才进行编译
      // 1. 把 DOM 存到内存 fragment 中
      const fragment = this.node2fragment(this.el)
      // 2. 编译
      this.compile(fragment)
      // 3. fragment 塞回页面
      this.el.appendChild(fragment)
    }
  }

  // Util
  isElementNode(node) {
    return node.nodeType === 1
  }

  // Core
  node2fragment(el) {
    let fragment = document.createDocumentFragment()

    while (el.firstChild) {
      fragment.appendChild(el.firstChild)
    }

    return fragment
  }

  isDirective(attrName) { // 判断属性是否为指令
    return attrName.includes('v-')
  }

  compileElement(node) {
    const attrs = node.attributes // 取出当前节点属性

    Array.from(attrs).forEach(attr => {
      if (this.isDirective(attr.name)) {
        const exp = attr.value
        const [, type] = attr.name.split('-')

        CompileUtil[type](node, this.vm, exp)
      }
    })
  }

  compileText(node) {
    const exp = node.textContent
    const regex = /\{\{([^}]+)\}\}/g
    if (regex.test(exp)) {
      CompileUtil.text(node, this.vm, exp)
    }
  }

  compile(fragment) {
    const childNodes = fragment.childNodes
    Array.from(childNodes).forEach(node => {
      if (this.isElementNode(node)) {
        // 编译元素
        this.compileElement(node)

        this.compile(node) // 递归深入编译元素节点
      } else {
        // 编译文本
        this.compileText(node)
      }
    })
  }
}

CompileUtil = {
  updater: {
    textUpdater(node, value) {
      node.textContent = value
    },

    modelUpdater(node, value) {
      node.value = value
    },
  },

  getVal(vm, exp) {
    exp = exp.split('.')
    return exp.reduce((prev, next) => { // 取上一个值作用
      return prev[next]
    }, vm.$data)
  },

  getTextVal(vm, exp) {
    return exp.replace(/\{\{([^}]+)\}\}/g, (...args) => {
      return this.getVal(vm, args[1].trim())
    })
  },

  setVal(vm, exp, newValue) {
    exp = exp.split('.')
    return exp.reduce((prev, next, currentIndex) => {
      if (currentIndex === exp.length - 1) {
        return prev[next] = newValue
      }
      return prev[next]
    }, vm.$data)
  },

  text(node, vm, exp) {
    const updateFn = this.updater['textUpdater']
    const value = this.getTextVal(vm, exp)
    // exp: {{ message.a }} - {{ message.b }}
    exp.replace(/\{\{([^}]+)\}\}/g, (...args) => {
      new Watcher(vm, args[1].trim(), (newValue) => {
        // 如果数据变化了，文本节点重新获取相应的属性值更新内容
        // cb 存到 subs 中了，不能用 value
        // console.log(newValue, this.getTextVal(vm, exp)) #text 是一个节点，newValue 是 text 一半的值
        updateFn && updateFn(node, this.getTextVal(vm, exp))
      })
    })
    updateFn && updateFn(node, value)
  },

  model(node, vm, exp) {
    const updateFn = this.updater['modelUpdater']
    const value = this.getVal(vm, exp)
    // 加监控，数据改变调用 cb
    new Watcher(vm, exp, (newValue) => {
      updateFn && updateFn(node, newValue)
    })

    node.addEventListener('input', e => {
      const newValue = e.target.value
      this.setVal(vm, exp, newValue)
    })
    updateFn && updateFn(node, value)
  },
}
