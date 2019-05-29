class Watcher {
  constructor(vm, exp, cb) {
    this.vm = vm
    this.exp = exp
    this.cb = cb

    // 先去原值
    this.value = this.get()
  }

  getVal(vm, exp) {
    exp = exp.split('.')
    return exp.reduce((prev, next) => { // 取上一个值作用
      return prev[next]
    }, vm.$data)
  }

  get() {
    Dep.target = this
    const value = this.getVal(this.vm, this.exp)
    Dep.target = null
    return value
  }

  update() {
    const newValue = this.getVal(this.vm, this.exp)
    const oldValue = this.value
    if (newValue !== oldValue) {
      this.cb(newValue) // 调用 cb
    }
  }
}

// 原值与新值对比，不一样则调用更新方法
