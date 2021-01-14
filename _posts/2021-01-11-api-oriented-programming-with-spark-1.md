---
layout: article
title: "面向 API 编程: Spark 基础"
date: 2021-01-11
modify_date: 2021-01-13
excerpt: "面向 API 编程 - Spark 基础 (API Oriented Programming with Spark)"
tags: [Spark, Python, Scala]
mathjax: false
mathjax_autoNumber: false
key: api-oriented-programming-with-spark-1
---

<div align="center">
  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Apache_Spark_logo.svg/1200px-Apache_Spark_logo.svg.png" width="30%">
</div>

## Spark 的设计与运行原理

### Spark 概述

Spark 运行速度很快

- 内存中做计算, 使用循环数据流 (即上一次 Reduce 的结果作为 input 给下一次 MapReduce 使用) 很少使用 IO 流
  - 能够不落磁盘, 尽量不落, 但不是 100% 不落
- DAG 设计机制 - 流水线优化


### Spark 运行架构

#### Spark 基本概念和架构设计

- RDD: Resillient DIstributed Dataset. 分布式内存数据集 (高度受限的共享内存模型)
- DAG: RDD 之间的依赖关系
- Executor: 运行在工作节点 (Worker Node) 的一个进程, 负责运行 Task
  - 每个进程会派生出很多线程, 每个线程再去执行相关任务
- Application: Spark 编写的程序 
- Task: 运行在 Executor 上的工作单元
- Job: 一个 Job 包含多个 RDD 以及作用于相应 RDD 上的各种操作 (RDD + 操作)
- Stage: 一个 Job 的基本调度单位. 一个 Job 会分为多组 Task. 每组 Task 被称为 Stage, 或者 TaskSet. 代表了一组关联的, 相互没有 Shuffle 依赖关系的任务组成的任务集合

![spark-architecture](https://raw.githubusercontent.com/Zhenye-Na/img-hosting-picgo/master/img/spark-architecture.png){:.rounded}

> Driver Program 任务控制节点

***

> Cluster Manager (集群资源管理器) 就是用来调度集群中 CPU, 内存, 带宽等等这些资源
> 
> 可以用 Spark 自带的作为 Cluster Manager, 同时也可以用 Hadoop Yarn, Mesos 等

Driver Program 向 Cluster Manager 申请资源, 启动 Worker Node 的 Executor. 同时将代码和文件数据发送给 Worker Node, Executor 派生出来的线程就会去执行任务, 然后将执行结果返回给 Driver Program


#### Spark 运行基本流程

![spark-diagram-1](https://raw.githubusercontent.com/Zhenye-Na/img-hosting-picgo/master/img/spark-diagram-1.png){:.rounded}


Spark Context 会根据你的 RDD 依赖关系去生成一个 DAG 关系图. 代码会直接在 DAG 上进行操作. DAG 图会交给 DAG Scehduler 进行处理, 将 DAG 图解析成很多个阶段, 每一个阶段 (Stage) 会包括很多个任务.

Executor 派生出来的线程会向 Task Scheduler 申请运行, 由 Task Scheduler 负责分发

**计算向数据靠拢**

如果机器 A (带有数据), B, C 同时像 Task Scheduler 申请, 那么 Task Scheduler 会分发给谁呢?

答案是 A, Task Scheduler 会 check 如果 A 有数据, 那么就会直接发给 A. 否则还得将数据从 A 发给其他的机器


#### RDD 运行原理

> Hadoop 不适合处理迭代式的任务, 因为 Hadoop 会将中间数据储存在磁盘中, 下一个子任务会从磁盘中重新读取数据. **磁盘 IO 开销**以及**序列化/反序列化开销**都很大
>
> 不同的任务都可以抓换成不同的 RDD 之间的转换, 最终都会变成 DAG 依赖关系

**RDD**: 分布式对象, 本质上是一个**只读**的分区记录集合, 数据特别大的话, 可以分布式的存在不同的机器上, 每一个机器都是数据的一个分区, 所以就可以进行分布式的高效的并行计算

RDD 之所以称为*高度受限的共享内存模型*

- 高度受限: 只读; 不可修改, 一旦生成就不可以更改
- 生成在内存中的数据集合


##### RDD 操作类型

- Action: 动作类型操作
- Transformation: 转换类型操作

这两种操作都是粗粒度的修改, 一次只能对 RDD 全集进行修改转换

> 只能全部修改, 不可以像 SQL 一样针对某一行对某一列进行转换


##### RDD 执行过程

- RDD 读入外部数据源进行创建
- RDD 经过一系列转换 (Transformation) 操作, 每一次都会产生不同的 RDD 提供给下一次操作使用
- 最后一个 RDD 经过 Action 操作进行转换并输出到外部数据源


**RDD 的一些特点**

1. 惰性调用机制

Transformation 操作是不会提供结果的, 只是记录转换的过程/轨迹, 并没有发生计算. 只有出发到 Action 操作, 才会真正的触发计算, 比如 `.count()` 

![spark-rdd-transformation-example](https://raw.githubusercontent.com/Zhenye-Na/img-hosting-picgo/master/img/spark-rdd-transformation-example.png){:.rounded}

2. 天然的容错性

Spark 具有天然的容错性, 主要是在 RDD 的转换过程中存在 Lineage 血缘关系, 即在上面的图中 B 是由 A 转换来的, E 又是由 B 和 D 转换来的.

需要恢复数据的话, 只需要逆过程寻找即可

3. 避免不需要的序列化/反序列化

RDD 的中间结果会被持久化到**内存**, `RDD.cache()` 避免了不必要的磁盘读写开销, 数据在内存中多个 RDD 之间进行传递的操作 `RDD.catch()`


##### RDD 的依赖关系和阶段的划分

> 为什么一个作业 (Job) 要分成多个不同的阶段 (Stage) ?
>
> - 窄依赖: **不**划分阶段, 可以进行 Pipeline 优化
> - 宽依赖: 划分多个阶段, 不能进行 Pipeline 优化

而去区分宽/窄依赖的一个重要的操作就是是否 Shuffle

1. 在网络中大规模的来回进行的数据传输
2. 不同节点之间相互传输数据

**宽依赖 vs 窄依赖**

- 窄依赖: 一个父 RDD 分区对应一个子 RDD 分区或者 多个父 RDD 分区对应一个 子 RDD 分区
- 宽依赖: 一个父 RDD 分区对应多个子 RDD 分区


优化原理: fork/join 机制

> 不发生无意义的等待, 但是只要发生 Shuffle (宽依赖) 一定会写磁盘

![spark-fork-and-join](https://raw.githubusercontent.com/Zhenye-Na/img-hosting-picgo/master/img/spark-fork-and-join.png){:.rounded}


**DAG 图反向解析**

- 窄依赖: 不断加入阶段
- 宽依赖: 生成不同阶段

![spark-stage-division](https://raw.githubusercontent.com/Zhenye-Na/img-hosting-picgo/master/img/spark-stage-division.png){:.rounded}


##### RDD 运行过程

![how-spark-runs-your-application](https://raw.githubusercontent.com/Zhenye-Na/img-hosting-picgo/master/img/how-spark-runs-your-application.png){:.rounded}


## Spark 开发 (略)

### 使用 pyspark (略)

`WordCount` 例子

```python
from pyspark import SparkConf, SparkContext

conf = SparkConf().setMaster("local").setAppName("DemoApp")
sc = SparkContext(conf=conf)

logFile = "hdfs://master:9000/example.txt"
logData = sc.textFile(logFile, 2).cache()

numAs = logData.filter(lambda line: 'a' in line).count()
numBs = logData.filter(lambda line: 'b' in line).count()

print("Line with a: {numAs}, with b: {numBs}".format(numAs=numAs, numBs=numBs))
```


## References

- [厦门大学 - 林子雨 - Spark编程基础 (Python版)](https://study.163.com/course/introduction/1209408816.htm)
- [厦门大学 - 林子雨 - Spark编程基础(Python版) - 课件](http://dblab.xmu.edu.cn/post/12157/#kejianxiazai)

