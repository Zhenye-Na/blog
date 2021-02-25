---
layout: article
title: "Flume 框架快速入门"
date: 2021-01-29
modify_date: 2021-02-04
excerpt: "Flume 框架快速入门"
tags: [Flume]
mathjax: false
mathjax_autoNumber: false
key: intro-to-flume
---



<div align="center">
  <img src="https://flume.apache.org/_static/flume-logo.png" width="20%">
</div>



## 1. Flume 概述

### 1.1. Flume 定义

Flume is a distributed, reliable, and available service for efficiently collecting, aggregating, and moving large amounts of <u>log</u> data. It has a simple and flexible architecture based on streaming data flows. {:.info}

最主要的作用就是: 实时读取服务器本地磁盘的数据, 将数据写入到 HDFS



It uses a simple extensible data model that allows for online analytic application. 适用于 OLAP



### 1.2. Flume 基础架构

<div align="center">
  <img src="https://flume.apache.org/_images/DevGuide_image00.png" width="60%">
  <p>Flume 基础架构</p>
</div>



Flume Event 是数据流的基本单元

它由一个装载数据的字节数组(byte payload)和一系列可选的字符串属性来组成(可选头部)



Flume 分布式系统中最核心的角色是 Agent (一个 JVM 进程), Flume 采集系统就是由一个个 Agent所连接起来形成

Agent 是 Flume 最小的独立运行单位, 它包括三个组件

- Source
- Channel
- Sink



#### 1.2.1. Flume Source

Flume source 消耗从类似于 web 服务器这样的外部源传来的 events.

外部数据源以一种 Flume source 能够认识的格式发送 event 给 Flume source.

Flume source 组件可以处理各种类型, 各种格式的日志数据

![](http://lizhenchao.oss-cn-shenzhen.aliyuncs.com/1544936105.png)



#### 1.2.2. Flume Channel

当 Flume source 接受到一个 event 的时, Flume source 会把这个 event 存储在**一个或多个** channel 中.

Channel 是连接 Source 和 Sink 的组件, 是位于 Source 和 Sink 之间的**数据缓冲区** {:.info}



Flume channel 使用**被动存储机制**. 它存储的数据的写入是靠 Flume source 来完成的, 数据的读取是靠后面的组件 Flume sink 来完成的.

Channel 是**线程安全**的，可以同时处理几个 Source 的写入操作和几个 Sink 的读取操作



Flume Channel 包括两种常用类型:

- Memory Based Channel
- File Based Channel



当然也可以自定义新的 Channel 类型

![](http://lizhenchao.oss-cn-shenzhen.aliyuncs.com/1544936250.png)



#### 1.2.3. Flume Sink

Sink 不断地轮询 Channel 中的事件且批量地<u>移除</u>它们，并将这些事件批量写入到存储或索引系统, 或者发送到另一个 Flume Agent

Sink 是完全事务性的 {:.info}

在从 Channel 批量删除数据之前, 每个 Sink 用 Channel 启动一个事务. 批量事件一旦成功写出到存储系统或下一个Flume Agent, Sink 就利用 Channel 提交事务. 事务一旦被提交, 该 Channel 从自己的内部缓冲区删除事件

![](http://lizhenchao.oss-cn-shenzhen.aliyuncs.com/1544936332.png)



## 2. Flume 进阶

### 2.1. Flume 事务

![](https://www.fatalerrors.org/images/blog/da4d044d77d85c5c637659c4ba0df7a7.jpg)



#### 2.1.1. Put 事务

Source 端向 Channel 传输的数据是以事务的形式存储的

Source 端生产数据速度远大于 Sink 端消费数据的速度时, 大量数据就会积压在 Channel 中, 当 Channel 存满数据后, Source 端无法再存入新的数据.

所以这里介绍一下 Put 事务的几个 API

- `doPut`: 将数据先写入临时缓冲区 `putList`
- `doCommit`: 检查 Channel 内存队列是否足够合并
- `doRollback`: Channel 内存队列空间不足, 数据回滚

当 Source 端执行 `doCommit` 发现无法存储数据之后 (原因可能有多种, 不一定就是 Channel 队列存满了), 会执行 `doRollback` 回滚数据至 `putList`



#### 2.1.2. Take 事务

Take 事务是发生在 Sink 端, Sink 拉取数据失败

Take 事务 API

- `doTake`: 将数据从 Channel 拉取到临时缓冲区 `takeList`, 并将数据发送到 HDFS 或者其他存储方式
- `doCommit`: 数据全部发送成功后, 清空临时缓冲区 `takeList`
- `doRollback`: 数据发送过程中发生异常, 将临时缓冲区 `takeList` 中的数据返回到 Channel 队列 (这是发生在 Channel 中)



### 2.2. Flume Agent 内部原理



![](http://lizhenchao.oss-cn-shenzhen.aliyuncs.com/1541487365.png)



### 2.3. Flume Inceptor

当我们需要对数据进行过滤时，我们除了在 Source、, Channel 和 Sink 进行代码修改之外， Flume 为我们提供了拦截器 (Inceptor)，拦截器也是 chain 形式的

拦截器的位置在 Source 和 Channel 之间, 当我们为 Source 指定拦截器后, 我们在拦截器中会得到 Event, 根据需求我们可以对 Event 进行保留还是抛弃, 抛弃的数据不会进入 Channel 中


