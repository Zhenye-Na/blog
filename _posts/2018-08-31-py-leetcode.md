---
layout: post
title: "Python刷题的奇技淫巧"
date: 2018-08-29
excerpt: "Python刷题的奇技淫巧 - 转载自一亩三分地论坛"
tags: [Algorithms, Backtracking]
---


> 转载自一亩三分地论坛用户[OO0OO](http://www.1point3acres.com/bbs/space-uid-133700.html)的帖子：[[学Python/Perl] Python刷题的一些技巧分享](http://www.1point3acres.com/bbs/thread-207345-1-1.html) 以及楼下相关的跟帖，转载请说明出处，以上。

# Python刷题的奇技淫巧 :trollface:

有的时候

**用Python解题经常可以作弊，Python 处理string非常方便， python内置模块非常多，比如排列组合啥的各种....**

有的时候

**Python大法好，就是偶尔慢**


Python也是可以追求运行速度的，除了算法方面的提升，也有些常见函数之间的区别

还有我刷的 Python2 和 Python3 已经迷茫了，如果有说错的地方敬请指出

***

==**初级技巧**==


-  排序

用 `lst.sort()` 而不是 `nlst = sorted(lst)`

区别在于 `lst.sort()` 是 in-place sort，改变 `lst` , `sorted()` 会创建新list，成本比较高。


- 用 `xrange`

`xrange` 和 `range` 的区别是在于 `range` 会产生 `list` 存在 memory 中，`xrange` 更像是生成器，generate on demand

所以有的时候 `xrange` 会更快

-  三目运算符

python 的三目运算符是这么写的 `x if y else z`

考虑这种 `list of list`: `matrix = [ [1,2,3] , [4,5,6] ]`

```python
row  = len(matrix)
col = len(matrix[0]) if row else 0 
```

这样写通用的原因是， 当 `matrix = [], row = 0, col = 0`

- list 填 0

```python
lst = [0 for i in range(3)] # lst = [0,0,0]

lst  = [[0 for i in range(3)] for j in range(2)]  # lst =  [[0, 0, 0], [0, 0, 0]]
```

下面这种写法**危险**：

```python
lst1 = [ 0, 0, 0 ]
lst2  = [lst1] * 2  # lst2 = [ [0,0,0] , [0,0,0] ]
lst2[0][0] = 1      # lst2 = [ [1,0,0], [1,0,0]]
```

因为 `lst1` 是 `object` ，这样写会踩坑


- `D.get(key, default)`

如果这个 `key` 没有在 `dict` 里面，给它一个默认值：

```python
D = {}
if 1 in D:
    val = D[1]
else :
    val = 0
```

等同于这样写：

```python
val = D.get(1, 0)
```

- reverse list

```python
lst = [1,2,3]

print lst[::-1] #[3,2,1]
```

lst 也有 `reverse()` 函数

这也也适用于 `str`, `str` 可是没有 `reverse` 函数的，`str[::-1]` 可用 √

***

==**进阶一下**==

Python 也是有自己的数据结构的！！！！

- deque
  - 还在用 `list` 来做 `queue` 么？ deque，当求快queue的时候，你值得拥有

- Counter
  - Counter做啥就顾名思义了

- yield
  - 用 `yield` 不用 `return`  （ 我也还在学习阶段


import collections就可以用了，参见  collections — High-performance container datatypes

***

==举个当时我就震惊了的例子==


看到在stackoverflow上看到有人求这样一个数据结构：

[Anyone know this Python data structure?](https://stackoverflow.com/questions/4098179/anyone-know-this-python-data-structure)

- Close to **O(1) performance** for as many of the following four operations.
- Maintaining **sorted order** while inserting an object into the container.
- Ability to **peek at last value** (the largest value) contained in the object.
- Allowing for **pops on both sides** (getting the smallest or largest values).
- Capability of **getting the total size** or number of objects being stored.
- Being a **ready made solution** like the code in Python's standard library.


然后真的可以implement出来

```python
import collections
import bisect

class FastTable:

    def __init__(self):
        self.__deque = collections.deque()

    def __len__(self):
        return len(self.__deque)

    def head(self):
        return self.__deque.popleft()

    def tail(self):
        return self.__deque.pop()

    def peek(self):
        return self.__deque[-1]

    def insert(self, obj):
        index = bisect.bisect_left(self.__deque, obj)
        self.__deque.rotate(-index)
        self.__deque.appendleft(obj)
        self.__deque.rotate(index)
```

对此我只想表示牛，并且我硬生生的用它来解过人家不是要这种思路的题目。


有想到的再补充，也欢迎任何技巧分享