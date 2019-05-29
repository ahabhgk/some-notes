class Observer {
  constructor(data) {
    this.observe(data)
  }

  observe(data) {
    // 将对象所有的属性改为 set 和 get 的形式
    if (!data || typeof data !== 'object') {
      return
    }

    Object.keys(data).forEach(key => {
      this.defineReactive(data, key, data[key])

      this.observe(data[key]) // 递归深度劫持数据
    })
  }

  defineReactive(obj, key, value) {
    const that = this // vm.$data.message.a = { name: 'ahab' } 此时 this 是 vm.$data.message
    const dep = new Dep() // 每一个变化的数据对一个 dep
    Object.defineProperty(obj, key, {
      get() {
        Dep.target && dep.addSub(Dep.target)
        return value
      },

      set(newValue) {
        if (newValue !== value) {
          that.observe(newValue)
          value = newValue
          dep.notify()
        }
      },
    })
  }
}


class Dep {
  constructor() {
    this.subs = []
  }

  addSub(watcher) {
    this.subs.push(watcher)
  }

  notify() {
    this.subs.forEach(watcher => watcher.update())
  }
}
