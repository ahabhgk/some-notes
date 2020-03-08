# 掌握时间的 Scheduler

* 数据结构：它知道如何根据优先级或其他条件存储和排队任务

* 执行环境：表示执行任务的位置和时间（例如同步、宏任务、微任务、下一动画帧）

* 虚拟时钟：通过 Scheduler 上的 now 提供“时间”的概念，在特定的任务将仅遵守该时钟指示的时间

```ts
console.log('before schedule')
async.schedule(() => console.log('async')) // 宏任务
asap.schedule(() => console.log('asap')) // 微任务
queue.schedule(() => console.log('queue')) // queue 和 null、undefined 是同步，queue 用于处理大量数据的同步
console.log('after schedule')
```
