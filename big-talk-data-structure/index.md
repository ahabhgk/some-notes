# 程序设计 = 数据结构 + 算法

* 数据：是描述客观事物的符号，是计算机中可以操作的对象，是能被计算机识别，并输入给计算机处理的符号集合。数据不仅仅包括整型、实型等数值类型，还包括字符及声音、图像、视频等非数值类型。

* 数据元素：是组成数据的、有一定意义的基本单位，在计算机中通常作为整体处理。也被称为记录。

* 数据项：一个数据元素可以由若干个数据项组成。数据项是数据不可分割的最小单位

* 数据对象：是性质相同的数据元素的集合，是数据的子集。

![data](./images/data.png)

* 数据结构：是相互之间存在一种或多种特定关系的数据元素的集合。

    * 逻辑结构：是指数据对象中数据元素之间的相互关系

        * 集合结构

        * 线性结构

        * 树形结构

        * 图形结构

    * 物理结构：数据的逻辑结构在计算机中的存储形式

        * 顺序存储

        * 链式存储

![structure](./images/structure.png)

* 数据类型：是指一组性质相同的值的集合及定义在此集合上的一些操作的总称

* 抽象数据类型（Abstract Data Type，ADT）：是指一个数学模型及定义在该模型上的一组操作

* 算法：算法是解决特定问题求解步骤的描述，在计算机中表现为指令的有限序列，并且每条指令表示一个或多个操作

    * 输入输出：入参返回

    * 有穷性：会结束

    * 确定性：每个步骤被精确定义而无歧义

    * 可行性：

* 算法设计要求：正确性、可读性、健壮性、高效率、低存储量

![time](./images/time.png)

# 线性表

零个或多个数据元素的有限序列

## 顺序存储

* 优点：

    * 无需储存元素之间的逻辑关系（指针）

    * 可快速存取表中任意位置元素

* 缺点：

    * 插入删除需大量移动元素

    * 难以确定储存空间容量

    * 储存空间碎片

## 链式存储

存储下一个元素的位置（储存元素之间的逻辑关系）

`[_, *next] -> [a1, *next] -> [a2, *next] -> [a3, null]`

* 头节点：可有可无，方便操作统一而设立

* 头指针：必须存在，指向链表中第一个节点，有头节点则是头节点

![compareArrList](./images/compareArrList.png)

### 静态链表

用数组描述的链表

一个数组元素存 `{data, cur}`

![staticList](./images/staticList.png)

```cpp
template <class T>
class StaticLinkList {
public:
  StaticLinkList() {
    for (int i = 0; i < MAXSIZE - 1; i++) {
      arr[i].cur = i + 1;
    }
    arr[MAXSIZE] = 0;
  }

  int molloc() {
    int i = arr[0].cur
    arr[0].cur = arr[i].cur
    return i
  }

  void free(i) {
    arr[i].cur = arr[0].cur
    arr[0].cur = i
  }

private:
  T arr[100];
}
```

静态链表其实是为了给没有指针的高级语言设计的一种实现单链表能力的方法

### 动态

go 的 slice、cpp 的 vector

超出时再开新数组进行复制并扩展

### 循环链表

从当中一个结点出发，访问到链表的全部结点

### 双向链表

克服单向性

# 栈

先进后出

## 两栈共享

![two-stack](./images/twoStack.png)

`top1 !== top2` 则不满

## 链栈

![linkStack](./images/linkStack.png)

注意单向链表的单向性

## 最小栈

实现一个栈，带有出栈（pop），入栈（push），取最小元素（getMin）三个方法。并且这三个方法的时间复杂度都是 O(1)

1. 多用一个辅助栈，借用一个辅助栈 min_stack，用于存获取 stack 中最小值：

    * push：push 时，如果小于等于 min_stack 栈顶值，则一起 push 到 min_stack，即更新了栈顶最小值

    * pop：判断 pop 出去的元素值是否是 min_stack 栈顶元素值（即最小值），如果是则将 min_stack 栈顶元素一起 pop，这样可以保证 min_stack 栈顶元素始终是 stack 中的最小值

    * getMin：返回 min_stack 栈顶即可

    * t: O(1) s: O(N)

2. 多一个 min，在 push 时对比，比他小则更新并把原来的 min 存起来，在 pop 时对比，比他大则更新并把原来的 min 放出来

    * push：如果小于 min，则把 oldmin 在 min 之前入栈，再更新 min（入栈两个元素 [oldmin, min]）

    * pop：[..., oldmin, min] min 如果 pop 值等于 min，则出两个 [oldmin, min] 并更新 min = oldmin

3. 链表存 [value, min, next]

# 队列

先进先出

## 循环队列

解决“单向移动性”，充分利用数组空间

如果 front === rear 为满，则 front === rear 也为空，怎么区分？

1. 加个 flag，记录上一次操作是增是减，增则为满，减则为空

2. 留一个空间放 front 或 rear，`(rear + 1) % QueueSize === front` 为满

## 链队列

![linkQueue](./images/linkQueue.png)

注意单向链表的单向性

## 最小队列

实现一个队列，带有出队（deQueue），入队（enQueue），取最小元素（getMin）三个方法。要保证这三个方法的时间复杂度都尽可能小

实现类似最小栈

# 串

// TODO

# 树

度：结点拥有的子树数称为结点的度（De-gree）

* 叶节点：度为 0

* 分枝节点

树的度：树内各结点的度的最大值

双亲表示法

孩子表示法

孩子兄弟表示法：`[data, *child, *rightSib]` -> 复杂的树变为二叉树

## 二叉树

满二叉树：所有分枝结点都有左子树和右子树，所有叶子都在同一层

完全二叉树：不满的，各个节点的位置与满二叉树相同

### 性质

* 第 i 层上最多有 2 ^ (i - 1) 个节点

* 深度为 k 的二叉树至多有 2 ^ k - 1 个结点

* 叶节点数 n0，度为 2 的节点数 n2，n0 = n2 + 1

    n0 + n1 + n2 = n0 * 0 + n1 * 1 + n2 * 2 + 1 = n1 + n2 * 2 + 1

    n0 = n2 + 1

* 具有 n 个结点的完全二叉树深度为 logn / 1 + 1

    logn / 1：去掉最底部一层得到的满二叉树的层数

* 完全二叉树的结点的编号为 i，则其左孩子（如果有）编号为 2i，右孩子（如果有）编号为 2i + 1

### 存储结构

* 顺序结构

    由于二叉树的严格定义（优越性），顺序结构也可以存（性质 5）

* 二叉链表

    `[data, *lchild, *rchild]`

### 遍历

* 前序

* 中序

* 后序

* 层序

已知中序和前序或后序，都可以推导出唯一一颗二叉树

二叉树的建立也是一次遍历

时间复杂度：O(n) 空间复杂度：O(h)（递归几层）

## 线索二叉树

利用二叉树的空指针域，记录前驱和后继，节省遍历的时间和空间

由于不能区分左右节点存的是子节点还是线索信息，所以引入布尔值 ltag 和 rtag 记录 `[*lchild, ltag, data, rtag, *rchild]`，区分 child 是子节点还是线索信息

线索化：以某种次序遍历使其成为线索二叉树的过程

中序的线索化：

```cpp
BiThrTree pre; // 保存 pre

void inThreading(BiThrTree p) {
  if (p) {
    inThreading(p->lchild);

    if (!p->lchild) { // p 无左孩子
      p->ltag = false;
      p->lchild = pre;
    }

    if (!pre->rchild) { // pre 无右孩子
      pre->rtag = false;
      pre->rchild = p;
    }

    pre = p; // 更新 pre

    inThreading(p->rchild);
  }
}
```

## 树、二叉树、森林之间的转换

相应逆操作省略

### 树转 => 二叉树

1. 加线

2. 去线

3. 层次调整

### 森林 => 二叉树

1. 树 => 二叉树

2. 后一颗二叉树的原根节点作为前一颗二叉树的原根节点的右孩子

## 哈夫曼树（最优二叉树）

压缩编码方式——哈夫曼编码

路径长度：两节点之间分枝数之和

树的路径长度：每个节点到根节点的路径长度之和

**带权路径长度最小的二叉树（最优二叉树）**

> 建立最优二叉树：对最小的两个结点求和，作为其父节点的值，递归直至得到根节点

得到最优二叉树后进行编码，比如左为 1 右为 0（哈夫曼编码）

## 并查集

一堆集合，每个集合没有交集

![uf](./images/uf.png)

![ufimg](./images/ufimg.png)

```cpp
class UF {
public:
  int find(int x) {
    return x == parent[x] ? x : find(parent[x])
  }

  void unionSet(int p, int q) {
    int pRoot = fint(p);
    int qRoot = find(q);

    if (pRoot != qRoot) {
      parent[pRoot] = qRoot;
    }
  }
  ...

private:
  int parent[CAP];
  ...
}
```

# 图

G(V, E)

V(Vertex)：点的集合

E(Edge)：边的集合

无向图：G(V, E); V = {A, B, C, D}; E = {(A, B), (B, C), (C, D), (D, A), (A, C)};

有向图：G(V, E); V = {A, B, C, D}; E = {<A, D>, <B, A>, <C, A>, <B, C>}

简单图：不存在顶点到其自身的边，切同一条边不重复出现

无向完全图：任意两顶点都有边

有向完全图：任意两顶点都有方向相反的两条边

度、出度、入度

连通：两顶点存在路径

连通图：任意两顶点都连通

强连通图：有向连通图

连通分量：极大连通（能连通的都算上）子图

## 存储结构

多重链表由于度有时相差很大（类似树），导致空间浪费

### 邻接矩阵

Vertex 与 Edge 分开存，Vertex 不分主次大小所以用一维数组，Edge 需要表示顶点间关系所以用二维数组

![uGraph](./images/uGraph.png)

```
Vertex = [v0, v1, v2, v3]

Edge = [
  [0, 1, 1, 1],
  [1, 0, 1, 0],
  [1, 1, 0, 1],
  [1, 0, 1, 0],
]
```

![dGraph](./images/dGraph.png)

```
Vertex = [v0, v1, v2, v3]

Edge = [
  [0, 0, 0, 1],
  [1, 0, 1, 0],
  [1, 1, 0, 0],
  [0, 0, 0, 0],
]
```

vi, vj 是否连通或存在弧，判断 Edge[i][j] 是否等于 1

![net](./images/net.png)

```
Vertex = [v0, v1, v2, v3, v4]

Edge = [
  [ 0 , INF, INF, INF,  6 ],
  [ 9 ,  0 ,  3 , INF, INF],
  [ 2 , INF,  0 ,  5 , INF],
  [INF, INF, INF,  0 ,  1 ],
  [INF, INF, INF, INF,  0 ],
]
```

无向网（无向带权图）类似

```cpp
// 创建无向网
template <typename T>
struct MGraph {
  T vexs[VEXNUM];
  int arc[VEXNUM][VEXNUM];
  int vertexsNum;
  int edgesNum;
}

void createMGraph(MGraph* g) {
  cout << "输入顶点数和边数：" << endl;
  cin >> g->vertexsNum >> g->edgesNum;

  cout << "输入顶点信息" << endl;
  for (int i = 0; i < g->vertexsNum; i++) {
    cin >> g->vexs[i];
  }

  // 初始化边
  for (int i = 0; i < g->vertexsNum; i++) {
    for (int j = 0; j < g->vertexsNum; j++) {
      g->arc[i][j] = INF;
    }
  }

  cout << "输入边信息" << endl;
  for (int n = 0; n < g->edgesNum; n++) {
    cout << "输入 (vi, vj) 的下标 i，下标 j，权 w：" << endl;
    int i, j, w;
    cin >> i >> j >> w;

    g->arc[i][j] = w;
    g->arc[j][i] = w; // 无向图，矩阵对称
  }
}
```

vertexsNum 个顶点，edgesNum 个边，时间复杂度：O(vertexsNum + vertexsNum ^ 2 + edgesNum) == O(n ^ 2)

### 邻接表

邻接矩阵存稀疏图时有极大浪费

![adjList](./images/adjList.png)

![ALAdjList](./images/ALAdjList.png)

> 对于有向图，邻接表可以轻松获取出度的信息，而入度的信息需要遍历整个邻接表才行；逆邻接表则相反

* 顶点用一维数组存（也可以用链表，不过数组方便读取信息）`[[data, *firstEdge], ...]`

* 由于顶点的邻接点个数不定，所以边用链表存 `[adjvex, *next]`

![ALNetAdjList](./images/ALNetAdjList.png)

```cpp
// 建立有向网邻接表
struct EdgeNode {
  int adjvex; // 对应下标
  int weight;
  EdgeNode* next;
}

template <typename T>
struct VertexNode {
  T data; // 值
  EdgeNode* firstEdge;
}

template <typename T>
struct ALGraph {
  VertexNode<T> adjList[VEXNUM];
  int VertexsNum;
  int EdgesNum;
}

void createALGraph(ALGraph* g) {
  cout << "输入顶点数和边数：" << endl;
  cin >> g->vertexsNum >> g->edgesNum;

  // 读顶点信息，建立顶点数组，初始化边链表
  for (int i = 0; i < g->vertexsNum; i++) {
    cin >> g->adjList[i].data;
    g->adjList[i].firstEdge = NULL;
  }

  // 建立边链表
  for (int n = 0; n < g->edgesNum; n++) {
    cout << "输入 (vi, vj) 的下标 i，下标 j，权 w："
    int i, j, w;
    cin >> i >> j >> w;

    EdgeNode* e = new EdgeNode;
    // 头插法
    e->adjvex = j; // 弧 (vi, vj) 从 i 指向 j，j 指向（赋值）为 e
    e->next = g->adjList[i].firstEdge; // firstEdge 指向 i
    e->weight = w;
    g->adjList[i].firstEdge = e; // 更新 firstEdge，为下一个插入边
  }
}
```

### 十字链表

解决有向图邻接表入度信息需遍历整个邻接表获取的问题

整合邻接表和逆邻接表

* 顶点的一维数组 `[data, firstIn, firstOut]`

* 边链表 `[tailVex, headVex, *tailLink, *headLink]`

![tenLinkList](./images/tenLinkList.png)

### 邻接多重表

如果无向图的邻接表在操作时注重顶点而不注重边，则邻接表没什么问题

如果注重边，由于无向图是没有方向的，其邻接矩阵是对称的，一个边会有两个边节点表示，这时使用邻接表对于边的操作就不方便

* 边：`[iVex, *iLink, jVex, *jLink]`

将一个边用两个顶点表示，v0 结点有三个边：(v0, v1)、(v3, v0)、(v0, v2)，各个边之间通过 v0 的 link 连接

把顶点的边还原成邻接表看，最后一个指针还是 NULL，添加时只需要构建一个边，最后的指针指向这个边的相应 vex，对应 link 为 NULL

删除则把指向 vex 的指针和 link 合并成一个，然后把边删除就行

![multiyAdj](./images/multiyAdj.png)

### 边集数组

`[begin, end, weight]`

边集数组关注的是边的集合，要查找一个顶点的度需要遍历整个边集，效率不高，更适合对边进行处理，不适合对顶点操作

## 遍历

使用邻接矩阵

```cpp
template <typename T>
struct MGraph {
  T vexs[VEXNUM];
  int arc[VEXNUM][VEXNUM];
  int vertexsNum;
  int edgesNum;
};

bool visited[VEXNUM];

// Depth-First-Search
void DFS(MGraph g, int i) {
  visited[i] = true;
  cout << g.vexs[i] << endl;

  // 访问邻接矩阵的行中的元素，如果有 i 顶点与 j 顶点间有边且未被访问，则递归遍历
  for (int j = 0; j < g->vertexsNum; j++) {
    if (g.arc[i][j] == 1 && !visited[j]) {
      DFS(g, j);
    }
  }
}

void DFSTraverse(MGraph g) {
  // 初始化 visited
  for (int i = 0; i < g.vertexsNum; i++) {
    visited[i] = false;
  }

  // 对未访问的进行遍历
  for (int i = 0; i < g.vertexsNum; i++) {
    if (!visited[i]) {
      DFS(g, i);
    }
  }
}

// Breadth-First-Search
void BFSTraverse(MGraph g) {
  Queue q;
  for (int i = 0; i < g.vertexsNum; i++) {
    visited[i] = false;
  }

  for (int i = 0; i < g.vertexsNum; i++) {
    if (!visited[i]) {
      // BFS
      visited[i] = true;
      cout << g.vexs[i] << endl; // 先操作或先入队都可以
      q.enQueue(i);

      // 出队，如果顶点 i、j 间有边且顶点 j 未被访问过，则访问并入队
      while (!q.empty()) {
        int i = q.deQueue();
        for (int j = 0; j < g.vertexsNum; j++) {
          if (g.vexs[i][j] == 1 && !visited[j]) {
            visited[j] = true;
            cout << g.vexs[i][j] << endl;
            q.enQueue(j);
          }
        }
      }
    }
  }
}
```

## 最小生成树

连通图：任意两顶点都连通

构造连通图最小代价的生成树

### Prim

以某点为起点，逐渐找到已构建的生成树的顶点上权值最小的边，并将顶点加入生成树，直至所有顶点都加入后得到最小生成树（贪心）

```cpp
template <typename T>
struct MGraph {
  T vexs[VEXNUM];
  int arc[VEXNUM][VEXNUM];
  int vertexsNum;
  int edgesNum;
};

void prim(MGraph g) {
  int adjvex[VEXNUM];
  int lowcost[VEXNUM];

  for (int i = 0; i < g.vertexsNum; i++) {
    lowcost[i] = g.arc[0][i];
    adjvex[i] = 0;
  }

  for (int i = 1; i < g.vertexsNum; i++) {
    int min = INF;
    int k = 0;

    for (int j = 0; j < g.vertexsNum; j++) {
      if (lowcost[j] != 0 && lowcost[j] < min) {
        min = lowcost[j];
        k = j;
      }
    }

    lowcost[k] = 0;

    for (int j = 0; j < g.vertexsNum; j++) {
      if (lowcost[j] != 0 && g.arc[k][j] < lowcost[j]) {
        lowcost[j] = g.arc[k][j];
        adjvex[j] = k;
      }
    }
  }
}

// 返回最小生成树的顶点数组，对应 vexs 的下标
void prim(MGraph g) {
  int adjvex[VEXNUM]; // 当前的生成树
  int lowcost[VEXNUM]; // 生成树边的权值，下标是顶点，0 则表示该点在当前的生成树中，INF 则表示两点不连通

  int k = 0; // 从 v0 开始
  for (int i = 0; i < g.vertexsNum; i++) {
    // 在原生成树对应 lowcost 的基础上更新 vk 点的对应的 lowcost
    for (int j = 0; j < g.vertexsNum; j++) {
      if (lowcost[j] != 0 && g.arc[k][j] < lowcost[j]) {
        lowcost[j] = g.arc[k][j];
        adjvex[j] = k;
      }
    }

    // 遍历 lowcost 找出权值最小的边，min 记录权值，k 记录该顶点
    int min = INF;
    for (int j = 0; j < g.vertexsNum; j++) {
      if (lowcost[j] != 0 && lowcost[j] < min) {
        min = lowcost[j];
        k = j;
      }
    }

    // 把 vk 放入当前生成树（0 则表示该点在当前的生成树中）
    lowcost[k] = 0;
    // 输出
    cout << "(vi, vj): " << adjvex[k] << k
      << "weight: " << min << endl;
  }
}
```

![prim](./images/prim.png)

1. v0 初始化
    adjvex[] = v0; lowcost[i] = g.arc[v0][i]
    ```
    adjvex  { v0: v0 , v1: v0 , v2: v0 , v3: v0 , v4: v0 , v5: v0 , v6: v0 , v7: v0 , v8: v0  }
    lowcost { v0:  0 , v1: 10 , v2: INF, v3: INF, v4: INF, v5: 11 , v6: INF, v7: INF, v8: INF }
    ```
    找到 lowcost 中不在当前生成树中（!= 0）且最小的边的顶点 k = v1，权为 min
    v1 放入当前生成树中（lowcost[v1] = 0）
    操作（输出）k、min

2. v1
    因为 lowcost[v0, v1] == 0（已在当前生成树中），所以不更新 v0, v1
    因为 18 < INF 所以更新 lowcost[v2] = 18; adjvex[v2] = v1
    因为 12 < INF 所以更新 lowcost[v8] = 12; adjvex[v8] = v1
    因为 16 < INF 所以更新 lowcost[v6] = 16; adjvex[v6] = v1
    其他的因为当前生成树到其距离 >= 原来的距离，所以不更新
    ```
    adjvex  { v0: v0 , v1: v0 , v2: v1 , v3: v0 , v4: v0 , v5: v0 , v6: v1 , v7: v0 , v8: v1  }
    lowcost { v0:  0 , v1:  0 , v2: 18 , v3: INF, v4: INF, v5: 11 , v6: 16 , v7: INF, v8: 12  }
    ```
    找到 lowcost 中不在当前生成树中（!= 0）且最小的边的顶点 k = v5，权为 min
    v5 放入当前生成树中（lowcost[v5] = 0）
    操作（输出）k、min

3. v5
    因为 lowcost[v0, v1, v5] == 0（已在当前生成树中），所以不更新 v0, v1, v5
    因为 26 < INF 所以更新 lowcost[v4] = 26; adjvex[v4] = v5
    其他的因为当前生成树到其距离 >= 原来的距离，所以不更新
    ```
    adjvex  { v0: v0 , v1: v0 , v2: v1 , v3: v0 , v4: v5 , v5: v0 , v6: v1 , v7: v0 , v8: v1  }
    lowcost { v0:  0 , v1:  0 , v2: 18 , v3: INF, v4: 26 , v5:  0 , v6: 16 , v7: INF, v8: 12  }
    ```
    找到 lowcost 中不在当前生成树中（!= 0）且最小的边的顶点 k = v8，权为 min
    v8 放入当前生成树中（lowcost[v8] = 0）
    操作（输出）k、min

4. v8
    因为 lowcost[v0, v1, v5, v8] == 0（已在当前生成树中），所以不更新 v0, v1, v5, v8
    因为 21 < INF 所以更新 lowcost[v3] = 21; adjvex[v3] = v8
    因为 8 < 12 所以更新 lowcost[v2] = 8; adjvex[v2] = v8
    其他的因为当前生成树到其距离 >= 原来的距离，所以不更新
    ```
    adjvex  { v0: v0 , v1: v0 , v2: v8 , v3: v8 , v4: v5 , v5: v0 , v6: v1 , v7: v0 , v8: v1  }
    lowcost { v0:  0 , v1:  0 , v2:  8 , v3: 21 , v4: 26 , v5:  0 , v6: 16 , v7: INF, v8:  0  }
    ```
    找到 lowcost 中不在当前生成树中（!= 0）且最小的边的顶点 k = v2，权为 min
    v2 放入当前生成树中（lowcost[v2] = 0）
    操作（输出）k、min

5. v2
    因为 lowcost[v0, v1, v5, v8, v2] == 0（已在当前生成树中），所以不更新 v0, v1, v5, v8, v2
    其他的因为当前生成树到其距离 >= 原来的距离，所以不更新
    ```
    adjvex  { v0: v0 , v1: v0 , v2: v8 , v3: v8 , v4: v5 , v5: v0 , v6: v1 , v7: v0 , v8: v1  }
    lowcost { v0:  0 , v1:  0 , v2:  0 , v3: 21 , v4: 26 , v5:  0 , v6: 16 , v7: INF, v8:  0  }
    ```
    找到 lowcost 中不在当前生成树中（!= 0）且最小的边的顶点 k = v6，权为 min
    v6 放入当前生成树中（lowcost[v6] = 0）
    操作（输出）k、min

6. v6
    因为 lowcost[v0, v1, v5, v8, v2, v6] == 0（已在当前生成树中），所以不更新 v0, v1, v5, v8, v2, v6
    因为 19 < INF 所以更新 lowcost[v7] = 19; adjvex[v7] = v6
    其他的因为当前生成树到其距离 >= 原来的距离，所以不更新
    ```
    adjvex  { v0: v0 , v1: v0 , v2: v8 , v3: v8 , v4: v5 , v5: v0 , v6: v1 , v7: v6 , v8: v1  }
    lowcost { v0:  0 , v1:  0 , v2:  0 , v3: 21 , v4: 26 , v5:  0 , v6:  0 , v7: 19 , v8:  0  }
    ```
    找到 lowcost 中不在当前生成树中（!= 0）且最小的边的顶点 k = v7，权为 min
    v7 放入当前生成树中（lowcost[v7] = 0）
    操作（输出）k、min

7. v7
    因为 lowcost[v0, v1, v5, v8, v2, v6, v7] == 0（已在当前生成树中），所以不更新 v0, v1, v5, v8, v2, v6, v7
    因为 7 < 26 所以更新 lowcost[v4] = 7; adjvex[v4] = v7
    因为 16 < 21 所以更新 lowcost[v3] = 16; adjvex[v3] = v7
    其他的因为当前生成树到其距离 >= 原来的距离，所以不更新
    ```
    adjvex  { v0: v0 , v1: v0 , v2: v8 , v3: v8 , v4: v7 , v5: v0 , v6: v1 , v7: v6 , v8: v1  }
    lowcost { v0:  0 , v1:  0 , v2:  0 , v3: 21 , v4:  7 , v5:  0 , v6:  0 , v7:  0 , v8:  0  }
    ```
    找到 lowcost 中不在当前生成树中（!= 0）且最小的边的顶点 k = v3，权为 min
    v3 放入当前生成树中（lowcost[v3] = 0）
    操作（输出）k、min

8. v3
    因为 lowcost[v0, v1, v5, v8, v2, v6, v7, v3] == 0（已在当前生成树中），所以不更新 v0, v1, v5, v8, v2, v6, v7, v3
    其他的因为当前生成树到其距离 >= 原来的距离，所以不更新
    ```
    adjvex  { v0: v0 , v1: v0 , v2: v8 , v3: v7 , v4: v7 , v5: v0 , v6: v1 , v7: v6 , v8: v1  }
    lowcost { v0:  0 , v1:  0 , v2:  0 , v3:  0 , v4:  7 , v5:  0 , v6:  0 , v7:  0 , v8:  0  }
    ```
    找到 lowcost 中不在当前生成树中（!= 0）且最小的边的顶点 k = v4，权为 min
    v4 放入当前生成树中（lowcost[v4] = 0）
    操作（输出）k、min

9. 循环完，得到：
    ```
    adjvex  { v0: v0 , v1: v0 , v2: v8 , v3: v7 , v4: v7 , v5: v0 , v6: v1 , v7: v6 , v8: v1  }
    lowcost { v0:  0 , v1:  0 , v2:  0 , v3:  0 , v4:  0 , v5:  0 , v6:  0 , v7:  0 , v8:  0  }
    ```

根据

```
adjvex[v0] = v0 得 v0 为最小生成树的根节点

adjvex[v1, v5] = v0

adjvex[v6, v8] = v1

adjvex[v7] = v6

adjvex[v2] = v8

adjvex[v3, v4] = v7
```

得最小生成树：

```
v0--v5
|
v1--v6--v7--v4
|       |
v8      v3
|
v2
```

时间复杂度：O(n ^ 2) // 可优化（算法导论 23.2）

### Kruskal

找最小权值的边来构建，同时避免形成环路（贪心）

```cpp
// 使用边集数组
struct Edge {
  int begin;
  int end;
  int weight;
}

// 找根
int find(int* parent, int x) {
  while (parent[x] != x) {
    x = parent[x];
  }

  return x;
}

void kruskal(MGraph g) {
  Edge edges[EDGENUM] = matrix2edgesSet(g);
  int parent[EDGENUM];

  // 初始化并查集
  // 各个边形成的集合 
  // 1. 不能形成环路：没有交集
  // 2. 求并后包含所有边
  for (int i = 0; i < g.edgesNum; i++) {
    parent[i] = i;
  }

  for (int i = 0; i < g.edgesNum; i++) {
    int n = find(parent, edges[i].begin);
    int m = find(parent, edges[i].end);

    // 是否在同一个集（是否会形成环）
    if (n != m) {
      // 不会则加入集，并操作
      parent[n] = m;

      cout << "(vi, vj): " << edges[i].begin << edges[i].end
        << "weight: " << edges[i].weight << endl;
    }
  }
}
```

遍历 e 条边，每个边进行 find，find 的时间复杂度为 O(loge)（树），所以总时间复杂度：O(eloge)

## 最短路径

两顶点之间边上权值之和最小的路径

### Dijkstra

从源点出发，每次选择离源点最近的一个顶点前进，然后以该顶点为中心进行扩展，最终得到源点到其余所有点的最短路径（贪心）

```cpp
void dijkstra(MGraph g) {
  int distance[], path[], found[];

  for (int i = 0; i < g.vertexsNum; i++) {
    found[i] = 0; // 初始化 found[i]
    distance[i] = g->arc[v0][i]; // 根据 g->arc[原点][i] 初始化 distance[i]
    path[i] = 0; // 初始化 path[i] = 原点
  }
  distance[0] = 0; found[0] = 1; // 处理原点 distance[原点] found[原点]

  for (int i = 1; i < g.vertexsNum; i++) {
    int min = INF; // 声明最小的权
    int k; // 声明最小的权对应的点

    // 找到最小的权的点，并记录最小的权
    for (int j = 0; j < g.vertexsNum; j++) {
      if (!found[j] && distance[j] < min) {
        min = distance[j];
        k = j;
      }
    }
    found[k] = 1; // 已经访问过了

    for (int j = 0; j < g.vertexsNum; j++) {
      // 如果最小的权加之前路径的长度比原来原点到最小权的点的距离小
      // 则更新 distance[最小权的点] 和 path[最小权的点]
      if (!found[j] && min + g.arc[k][j] < distance[j]) {
        distance[j] = min + g.arc[k][j];
        path[j] = k;
      }
    }
  }
}
```

D 到 A

![dijkstra](./images/dijkstra.png)

distance { 点: 该点到原点的最短距离 } // 记录各个点到原点的最短距离

path { 点: 最短路径上点的前驱点 } // 记录最短路径

found { 点: 是否已找到原点到该点的最短距离 } // 0: false, 1: true

1. 初始化
    根据 g->arc[D] 初始化 distance，原点距离自己为 0，distance[D] = 0
    path 初始化为全是原点
    found 原点不用找，found[D] = 1，其他为 0
    ```
    distance { D:  0 , C:  3 , E:  4 , F: INF, B: INF, G: INF, A: INF }
    path     { D:  D , C:  D , E:  D , F:  D , B:  D , G:  D , A:  D  }
    found    { D:  1 , C:  0 , E:  0 , F:  0 , B:  0 , G:  0 , A:  0  }
    ```

2. 根据边的权值最小且没有走过找到 C，走到 C，found[C] = 1
    因为 found[D, C] = 1 所以不更新 D, C
    因为 3 + 6 < INF 所以更新 distance[F] = 9; path[F] = C
    因为 3 + 10 < INF 所以更新 distance[B] = 13; path[B] = C
    其他的因为 C 到其距离 >= 原来的距离，所以不更新
    走完 C
    ```
    distance { D:  0 , C:  3 , E:  4 , F:  9 , B: 13 , G: INF, A: INF }
    path     { D:  D , C:  D , E:  D , F:  C , B:  C , G:  D , A:  D  }
    found    { D:  1 , C:  1 , E:  0 , F:  0 , B:  0 , G:  0 , A:  0  }
    ```

3. 根据边的权值最小且没有走过找到 E，走到 E，found[E] = 1
    因为 found[D, C, E] = 1 所以不更新 D, C, E
    因为 4 + 2 < 9 所以更新 distance[F] = 6; path[F] = E
    因为 4 + 8 < INF 所以更新 distance[G] = 12; path[G] = E
    其他的因为 E 到其距离 >= 原来的距离，所以不更新
    走完 E
    ```
    distance { D:  0 , C:  3 , E:  4 , F:  6 , B: 13 , G: 12 , A: INF }
    path     { D:  D , C:  D , E:  D , F:  E , B:  C , G:  E , A:  D  }
    found    { D:  1 , C:  1 , E:  1 , F:  0 , B:  0 , G:  0 , A:  0  }
    ```

4. 根据边的权值最小且没有走过找到 F，走到 F，found[F] = 1
    因为 found[D, C, E, F] = 1 所以不更新 D, C, E, F
    因为 6 + 12 < INF 所以更新 distance[A] = 18; path[A] = F
    其他的因为 F 到其距离 >= 原来的距离，所以不更新
    走完 F
    ```
    distance { D:  0 , C:  3 , E:  4 , F:  6 , B: 13 , G: 12 , A: 18  }
    path     { D:  D , C:  D , E:  D , F:  E , B:  C , G:  E , A:  F  }
    found    { D:  1 , C:  1 , E:  1 , F:  1 , B:  0 , G:  0 , A:  0  }
    ```

5. 根据边的权值最小且没有走过找到 B，走到 B，found[B] = 1
    因为 found[D, C, E, F, B] = 1 所以不更新 D, C, E, F, B
    其他的因为 B 到其距离 >= 原来的距离，所以不更新
    走完 B
    ```
    distance { D:  0 , C:  3 , E:  4 , F:  6 , B: 13 , G: 12 , A: 18  }
    path     { D:  D , C:  D , E:  D , F:  E , B:  C , G:  E , A:  F  }
    found    { D:  1 , C:  1 , E:  1 , F:  1 , B:  1 , G:  0 , A:  0  }
    ```

6. 根据边的权值最小且没有走过找到 A，走到 A，found[A] = 1
    因为 found[D, C, E, F, B, A] = 1 所以不更新 D, C, E, F, B, A
    其他的因为 A 到其距离 >= 原来的距离，所以不更新
    走完 B
    ```
    distance { D:  0 , C:  3 , E:  4 , F:  6 , B: 13 , G: 12 , A: 18  }
    path     { D:  D , C:  D , E:  D , F:  E , B:  C , G:  E , A:  F  }
    found    { D:  1 , C:  1 , E:  1 , F:  1 , B:  1 , G:  0 , A:  1  }
    ```

7. 根据边的权值最小且没有走过找到 G，走到 G，found[A] = 1
    因为 found[D, C, E, F, B, A, G] = 1 所以不更新 D, C, E, F, B, A, G
    走完 B
    ```
    distance { D:  0 , C:  3 , E:  4 , F:  6 , B: 13 , G: 12 , A: 18  }
    path     { D:  D , C:  D , E:  D , F:  E , B:  C , G:  E , A:  F  }
    found    { D:  1 , C:  1 , E:  1 , F:  1 , B:  1 , G:  1 , A:  1  }
    ```

根据 path[A] = F, path[\F] = E, path[\E] = D, path[\D] = D 得最短路径：D -> E -> F -> A

> 权不能是负数

时间复杂度：O(n ^ 2)

### Floyd

在两个顶点之间插入一个或一个以上的中转点，比较经过与不经过中转点的距离哪个更短（动态规划）

```cpp
void floyd(MGraph g) {
  int path[][], distance[][];

  for (int i = 0; i < g.vertexsNum; i++) {
    for (int j = 0; j < g.vertexsNum; j++) {
      distance[i][j] = g.arc[i][j];
      path[i][j] = j;
    }
  }

  for (int k = 0; k < g.vertexsNum; k++) {
    for (int i = 0; i < g.vertexsNum; i++) {
      for (int j = 0; j < g.vertexsNum; j++) {
        if (distance[i][j] > distance[i][k] + distance[k][j]) {
          distance[i][j] = distance[i][k] + distance[k][j];
          path[i][j] = path[i][k];
        }
      }
    }
  }
}
```

![floyd](./images/floyd.png)

1. 初始化
    ```
    distance     0   1   2   3
              0  0   3   9  INF
              1  3   0   4  13
              2  9   4   0   5
              3 INF 13   5   0
    ---------------------------
    path         0   1   2   3
              0  0   1   2   3
              1  0   1   2   3
              2  0   1   2   3
              3  0   1   2   3
    ```

2. k = 0
    ```
    distance     0   1   2   3
              0  0   3   9  INF
              1  3   0   4  13
              2  9   4   0   5
              3 INF 13   5   0
    ---------------------------
    path         0   1   2   3
              0  0   1   2   3
              1  0   1   2   3
              2  0   1   2   3
              3  0   1   2   3
    ```

3. k = 1
    distance[0][1] + distance[1][2] == 3 + 4 < 9 更新：
    
    distance[0][2] = distance[2][0] = 7;
    
    path[0][2] = path[0][1] = 1; path[2][0] = path[2][1] = 1;
    
    distance[0][1] + distance[1][3] == 3 + 13 < INF 更新：
    
    distance[0][3] = distance[3][0] = 16;
    
    path[0][3] = path[0][1] = 1; path[3][0] = path[3][1] = 1;
    ```
    distance     0   1   2   3
              0  0   3  \7  \16
              1  3   0   4  13
              2 \7   4   0   5
              3 \16 13   5   0
    ---------------------------
    path         0   1   2   3
              0  0   1  \1  \1
              1  0   1   2   3
              2 \1   1   2   3
              3 \1   1   2   3
    ```

4. k = 2
    distance[0][2] + distance[2][3] == 7 + 5 == 12 < 16 更新：
    
    distance[0][3] = distance[3][0] = 12;
    
    path[0][3] = path[0][2] = 1; path[3][0] = path[3][2] = 2;
    
    distance[1][2] + distance[2][3] == 4 + 5 == 9 < 13 更新：
    
    distance[1][3] = distance[3][1] = 9;
    
    path[1][3] = path[1][2] = 2; path[3][1] = path[3][2] = 2
    ```
    distance     0   1   2   3
              0  0   3   7  \12
              1  3   0   4  \9
              2  7   4   0   5
              3 \12 \9   5   0
    ---------------------------
    path         0   1   2   3
              0  0   1   1  \1
              1  0   1   2  \2
              2  1   1   2   3
              3 \2  \2   2   3
    ```

5. k = 3
    ```
    distance     0   1   2   3
              0  0   3   7   12
              1  3   0   4   9
              2  7   4   0   5
              3  12  9   5   0
    ---------------------------
    path         0   1   2   3
              0  0   1   1   1
              1  0   1   2   2
              2  1   1   2   3
              3  2   2   2   3
    ```

0 -> 3:

    `distance[0][3] == 12; distance[0][2] == 7; distance[0][1] == 3; distance[0][0] == 0;`

    `path[0][3] == 1; path[\1][3] == 2; path[\2][3] == 3; path[\3][3] == 3;`

时间复杂度：O(n ^ 3) 空间复杂度：O(n ^ 2)

## 拓扑排序

AOV（Activity On Vertex Network）网：在一个表示工程的有向图无环中，用顶点表示活动，用弧表示顶点之间的优先关系

拓扑序列：设 G = (V, E) 是一个具有 n 个顶点的有向图，V 中的顶点序列 v1, v2, …, vn 满足若从顶点 vi 到 vj 有一条路径，则在顶点序列中顶点 vi 必在 vj 之前，则我们称这样的顶点序列为一个拓扑序列

![topological-seq](./images/topological-seq.png)

0, 1, 2, 3 是；0, 2, 1, 3 也是

拓扑排序：对有向图构造拓扑序列的过程

### BFS

根据顶点入度判断是否有依赖关系，每次选取入度为 0 的顶点输出

```
topologicalSort(Graph g) {
  Stack stack // Queue q
  Array result
  
  for (Vertex v in g.vertexs) {
    if (v.inDegree == 0) {
      stack.push(v)
    }
  }

  while (stack.isNotEmpty) {
    Vertex v = stack.pop()
    result.push(v)
    for (Vertex v in v.adjacentVertexs) {
      v.inDegree -= 1
      if (v.inDegree == 0) {
        stack.push(v)
      }
    }
  }

  return result
}
```

没有顺序要求，队列也可以

也称入度表法（贪心）

v 个点 e 条边，for v 之后入度减一的操作有 e 次，所以时间复杂度：O(v + e)

### DFS

深度优先搜索过程中，当到达出度为 0 的顶点时，进行回退，同时记录出度为 0 的顶点，将其入栈，最终出栈的逆序为拓扑序列

```
DFS-t(Vertex v, Map visited, Stack stack) {
  visited[v] = true
  for (Vertex v in v.adjacentVertexs) {
    if (!visited[v]) {
      DFS-t(v, visited, stack)
    }
  }
  stack.push(v)
}

topologicalSort(Graph g) {
  Map visited
  Stack stack

  for (Vertex v in g.vertexs) {
    if (!visited[v]) {
      DFS-t(v, visited, stack)
    }
  }

  return stack.toArray().reverse()
}
```

时间复杂度：O(v + e)

## 关键路径

AOE（Activity On Edge Network）网：在一个表示工程的带权有向图中，用顶点表示事件，用边表示活动，用边上的权值表示活动的持续时间

路径长度：各个活动所持续的时间之和

关键路径：从原点到终点具有最大长度的路径叫关键路径（v1->v2）

关键活动：关键路径上的活动（e1, e2）

相比原来拓扑排序多了找最大路径的一步：

```
topologicalKeyRoad(Graph g) {
  Stack stack // Queue q
  Array result
  Map events

  for (Vertex v in g.vertexs) {
    if (v.inDegree == 0) {
      stack.push(v)
    }

    events[v] = 0
  }

  while (stack.isNotEmpty) {
    Vertex v = stack.pop()
    result.push(v)
    for (Vertex v in v.adjacentVertexs, Edge e in v.edges) {
      v.inDegree -= 1
      if (v.inDegree == 0) {
        stack.push(v)
      }

      if (events[v] + e.weight > events[v]) { // 找出时间最长的事件（最大的边）
        events[v] = events[v] + e.weight
      }
    }
  }

  return { result, events }
}
```

时间复杂度：O(v + e)

# 查找

静态查找表：只做查找

动态查找表：查找是同时插入或删除

## 顺序表查找

遍历一遍

## 有序表查找

### 二分法

`mid = (low + high) / 2 = low + (high - low) / 2`

### 插值查找

根据查找关键字跟查找表中最大最小的关键字进行比较后的查找

`mid = low + (high - low) * (key - a[low]) / (a[high] - a[low])`

相较于二分法不再是每次分一半的查找，认为分布是均匀有序的，根据值分布的位置 `(key - a[low]) / (a[high] - a[low])` 进行查找

### 斐波那契查找

// TODO

## 线性索引查找

索引就是把一个关键字与它对应的内容相关联的过程

索引按结构可分为线性索引、树形索引、多级索引

线性索引：索引项集合组织为线性结构，也称索引表

### 稠密索引

在线性索引中，将数据集中的每个记录对应一个索引项，其索引表中的索引项一定按照关键码有序排列

![dense-index](./images/dense-index.png)

有序后可以使用有序表查找，大大提高查找效率

### 分块索引

把数据集分成若干块，块内无序（不要求有序，会付出大量时间和空间的代价），块间有序

![block-index](./images/block-index.png)

* 最大关键码

* 块长

* 块首指针

先有序表查找，再顺序查找

### 倒排索引

例：两篇文章：

1. Books and friends should be few but good.

2. A good book is a good friend.

|英文单词|文章编号|
|-|-|
|a|2|
|and|1|
|be|1|
|book|1, 2|
|but|1|
|few|1|
|friend|1, 2|
|good|1, 2|
|is|2|
|should|1|

索引项：次关键码（英文单词）、记录号表（文章编号）

记录号表储存具有相同次关键字的所有记录的记录号（指针或主记录号）

由于不是通过记录找属性，而是通过属性找记录，所以叫倒排索引

有时还可以压缩属性（Android => < 3, roid> 或 /\w+roid/）

## 二叉排序树

Binary Sort Tree

或者是一颗空树，或者是具有以下性质的二叉树

* 若左子树不为空，则左子树上的值均小于根节点的值

* 若右子树不为空，则右子树上的值均大于根节点的值

* 左右子树均为二叉树

```
searchBST(BiTree t, T key) {
  if (t == null) return null

  if (t.data == key) {
    return t
  } else if (t.data > key) {
    return searchBST(t.lchild, key)
  } else if (t.data < key) {
    return searchBST(t.rchild, key)
  }
}

inseartBST(BiTree t, T key) {
  if (t.data == key) return null

  if (t.data > key) {
    if (t.lchild == null) {
      t.lchild = new BiTree({ data: key, lchild: null, rchild: null })
    } else {
      inseartBST(t.lchild, key)
    }
  } else if (t.data < key) {
    if (t.rchild == null) {
      t.rchild = new BiTreeNode({ data: key, lchild: null, rchild: null })
    } else {
      inseartBST(t.rchild, key)
    }
  }
}

deleteBST(BiTree t, T key) {
  if (t == null) return null

  if (t.data == key) delete(t)
  else if (t.data > key) deleteBST(t.lchild, key)
  else if (t.data < key) deleteBST(t.rchild, key)
}

delete(BiTree t) {
  if (t.rchild == null) t = t.lchild // 若右子树为空则直接接上其左子树
  else if (t.lchild == null) t = t.rchild // 若左子树为空则直接接上其右子树
  else {
    // 找到中序遍历（从小到大）的直接前驱或直接后驱 s 来替换 t
    BiTree s = t.lchild
    while (s.rchild != null) s = s.rchild
    t.data = s.data
    delete(s)
  }
}
```

![deleteBST](./images/deleteBST.png)

时间复杂度与深度有关：O(h)

## 平衡二叉树

AVL 树

当二叉排序树比较平横时，h == logn / 1 + 1 时间复杂度为 O(logn)；当二叉排序树退化成当单链表 h == n，时间复杂度为 O(n)

// TODO

## B 树

// TODO

## 哈希表

存储位置 = f(关键字)

在存储位置与关键字之间建立一个确定的对应关系 f，使每一个关键字对应一个存储位置

散列函数：f，也称哈希（hash）函数

散列表（哈希表）：存记录的存储空间

冲突：key1 != key2，但是 hash(key1) == hash(key2)

同义词：冲突中的 key1、key2

### hash 函数的构造方法

* 计算简单

* 地址分布均匀

1. 直接定址法

    `hash(key) = a * key + b`

    简单、均匀、无冲突，但需要知道关键字的分不情况，适合查找表较小且连续的情况

2. 数字分析法

3. 平方取中法

    去平方抽取中间几位数

4. 折叠法

5. 除留余数法

    散列表长 m `hash(key) == key % p (p <= m)`

6. 随机数法

### 处理冲突的方法

1. 开放定址法

    1. 线性探测法
    
        `fi(key) = (fi(key) + di) % p (di = 1, 2, ..., p - 1)`

        堆积：不是同义词却需要争夺一个地址的情况

    2. 二次探测法

        `fi(key) = (fi(key) + di) % p (di = 1 ^ 2, - (1 ^ 2), ..., q ^ 2, - (q ^ 2)) (q <= m / 2)`

        双向寻找可能的位置，防止关键字都聚集在某一片区域

    3. 随机探测法

        `fi(key) = (fi(key) + di) % p (di = 伪随机数列)`

        查找时通过随机数种子找到

2. 再散列函数法

    `fi(key) = rfi(key) (i = 1, 2, ...)`

    事先准备多个 f

3. 链地址法

    ![chain-address](./images/chain-address.png)

4. 公共益处区法

如果没有冲突，时间复杂度：O(1)

# 排序

稳定性：k1 == k2，若排序之前 k1 在 k2 之前，排序后顺序不变则稳定，顺序改变则不稳定

内排序：整个过程中，待排序的所有记录放在内存中（插入排序、交换排序、选择排序、归并排序）

外排序：由于个数太多，不能全放内存，整个过程需要内外多次交换数据

![sort](./images/sort.jpg)

## 冒泡排序

相邻的两两比较，反序则交换

```
bubbleSort(Array arr) {
  for (int i = 1; i < arr.length; i++) { // length - 1 次循环，length - 1 次两两比较
    for (int j = arr.length - 1; j > i; j--) { // 前一个与后一个比较，大则交换
      if (arr[j - 1] > arr[j]) {
        arr.swap(arr[j - 1], arr[j])
      }
    }
  }
}
```

时间复杂度：

* 最优：已经排好，O(n)

* 最差：逆序，(n - 1) + (n - 2) + ... + 1 = n * (n - 1) / 2 = O(n ^ 2)

* 平均：O(n ^ 2)

## 简单选择排序

找到第 i 小的，放到位置 i 上

```
selectSort(Array arr) {
  for (int i in arr) {
    int minIndex

    for (int j = i + 1; j < arr.length; i++) {
      if (arr[minIndex] > arr[j]) minIndex = j
    }

    arr.swap(i, minIndex)
  }
}
```

时间复杂度：无论最好和最坏都需要比较 (n - 1) + (n - 2) + ... + 1 = n * (n - 1) / 2 = O(n ^ 2)

## 直接插入排序

将元素插入到已排好的有序序列中

```
insertSort(Array arr) {
  for (int i = 1; i < arr.length; i++) {
    if (arr[i] < arr[i - 1]) {
      int index = i - 1
      int data = arr[i]
      while (!(arr[index] < data)) {
        arr[index + 1] = arr[index]
        index -= 1
      }
      arr[index] = data
    }
  }
}
```

时间复杂度：

* 最优：顺序，只比较一遍，没有移动，O(n)

* 最差：逆序，O(n ^ 2)

* 平均：O(n ^ 2)

## 希尔排序

基本有序：小的基本在前面，大的基本在后面，不等于局部有序

通过一个增量，对相隔一个增量的元素组成的子序列进行简单选择排序，得到基本有序，通过逐渐减小增量得到全部有序

```cpp
void shellSort(int * arr, int len) {
  for (int step = len / 2; step > 0; step /= 2) {
    for (int i = 0; i < step; i++) {
      // selectSort
      for (int j = i; j < len; j += step) {
        int minIndex = j;
        for (int k = j + step; k < len; k += step) {
          if (arr[k] < arr[minIndex]) minIndex = k;
        }
        int tmp = arr[j];
        arr[j] = arr[minIndex];
        arr[minIndex] = tmp;
      }
    }
  }
}
```

跳跃式的移动，不稳定

时间复杂度：O(n * log n)

## 堆排序
