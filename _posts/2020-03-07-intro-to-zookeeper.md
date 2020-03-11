---
layout: article
title: "大数据之 Zookeeper - 学习笔记"
date: 2020-03-07
modify_date: 2020-03-07
excerpt: "Introduction to Zookeeper Basics - Learning Notes"
tags: [Zookeeper]
mathjax: false
mathjax_autoNumber: false
key: intro-to-zookeeper
---



# Zookeeper

<div align="center">
  <img src="https://dbdb.io/media/logos/apache-zookeeper.png" width="30%">
</div>





> Zookeeper 主要应用于大数据开发中的，统一命名服务、统一配置管理、统一集群管理、服务器节点动态上下线、软负载均衡等场景。该框架相当于大数据框架中的润滑剂。是大数据大数据开发工程师必须会的框架之一。本套课程讲解了，Zookeeper 的集群安装、选举机制、监听器原理、写数据流程、Shell命令行操作、客户端API操作、服务器节点动态上下线综合案例以及企业真实面试题。



## 1. Zookeeper 入门



### 1.1. Zookeeper 概述

Zookeeper 是一个开源的分布式的，为分布式应用提供**协调服务**的 Apache 项目。

Zookeeper 从设计模式角度来理解：是一个基于**<u>观察者模式</u>**设计的分布式服务管理框架， 它负责**存储和管理**大家都关心的数据，然后**接受观察者的注册**，<u>一旦这些数据的状态发生变化，Zookeeper 就将负责通知已经在 Zookeeper 上注册的那些观察者做出相应的反应</u>，从而实现集群中类似 Master/Slave 管理模式

**<u>Zookeeper = 文件系统 + 通知机制</u>**



### 1.2. Zookeeper 特点



<div align="center">
  <img src="https://data-flair.training/blogs/wp-content/uploads/sites/2/2018/07/Architecture-of-Zookeeper-3.png">
</div>



1. Zookeeper: 一个领导者 (Leader)，多个跟随者 (Follower) 组成的集群。
2. Leader 负责进行投票的发起和决议，更新系统状态
3. Follower 用于接收客户请求并向客户端返回结果，在选举 Leader 过程中参与投票
4. 集群中只要有**<u>半数以上</u>**节点存活，Zookeeper 集群就能正常服务。
5. 全局数据一致: 每个 Server 保存一份相同的数据副本，Client 无论连接到哪个 Server，数据都是一致的。
6. 更新请求顺序进行，来自**同一个 Client** 的更新请求**按其发送顺序依次执行**。
7. 数据更新**原子性**，一次数据更新**要么成功，要么失败**。
8. <u>实时性</u>，在一定时间范围内，Client 能读到最新数据。



### 1.3. Zookeeper 的数据结构



<div align="center">
  <img src="https://data-flair.training/blogs/wp-content/uploads/sites/2/2018/07/Data-Model-and-The-Hierarchical-Namespace-of-Zookeeper.png">
</div>



ZooKeeper 数据模型的结构与 Unix 文件系统很类似，整体上可以看作是一棵树，每个节点称做一个 `ZNode`。

很显然 Zookeeper 集群自身维护了一套数据结构。这个存储结构是一个树形结构，其上的每一个节点，我们称之为"znode"，每一个 znode 默认能够存储 **1MB** 的数据，每个 ZNode 都可以通过其**路径唯一标识**



### 1.4. Zookeeper 的应用场景



Zookeeper 提供的服务有:

- 统一命名服务管理
- 统一配置服务管理
- 统一集群管理
- 服务器节点动态上下限
- 软负载均衡
- 分布式消息同步和协调机制



#### 1.4.1. 统一命名服务

在分布式环境下, 经常需要对应用 / 服务进行统一命名, 便于识别



1. 在分布式环境下, 配置文件同步是十分常见的
   1. 一般要求同一个集群中, 所有节点的配置信息是一致的, 比如一个 Kafka 集群
   2. 对配置文件修改后, 希望能够快速同步到各个节点上
2. 配置管理可以交给 Zookeeper 实现
   1. 将配置信息写入 Zookeeper 的一个 Znode 上
   2. 各个客户端服务器监听这个 Znode (监听变化)
   3. 一旦 Znode 中的数据被修改, Zookeeper 将通知给各个客户端服务器



#### 1.4.2. 统一集群管理服务



1. 分布式环境中, 需要实时掌握每个节点的状态
   1. 可以根据节点实时状态做出一些调整
2. Zookeeper 可以实现实时监控节点状态变化
   1. 可以将节点信息写入 Zookeeper 上的一个 Znode
   2. 监听这个 Znode 可以获取它的实时状态变化



#### 1.4.3. 服务器节点动态上下线



1. 服务端启动时去注册信息 (创建的是临时节点)
2. 客户端获取到在线服务器列表, 并且注册监听
3. 某个服务器下线
4. 客户端获取到服务器节点上下线通知
5. 重新获取在线的服务端列表信息



#### 1.4.4. 软负载均衡



![Screen Shot 2020-03-10 at 00.17.10](/Users/macbookpro/Desktop/assets/Screen Shot 2020-03-10 at 00.17.10.png)



- Register 负责域名的注册， 服务启动后将域名信息通 过 Register 注册到 Zookeeper 相对应的域名服务下。
- Dispatcher 负责域名的解析。 可以实现软负载均衡。
- Scanner 通过定时监测服务状态， 动态更新节点地址 信息。
- Monitor 负责收集服务信息与状态监控。
- Controller 提供后台 Console， 提供配置管理功能。



可以用来做一个十分简易的 Load-Balancer:

在 Zookeeper 中记录每一台服务器的访问数, 让**访问数最少**的服务器去处理最新的客户端请求



#### 1.4.5. 数据发布与订阅

集中式配置中心 (Push + Pull)



- 应用启动时主动到 Zookeeper 上获取配置信息， 并注册 Watcher 监听。
- 配置管理员变更 Zookeeper 配置节点的内容。 
- Zookeeper 推送变更到应用， 触发 Watcher 回调函数。 
- 应用根据逻辑， 主动获取新的配置信息， 更改自身逻辑。



## 2. Zookeeper 安装配置



### 2.1. Zookeeper 配置参数解读



Zookeeper 的配置文件是 `zoo.cfg`, 文件中的一些常用参数的含义如下



1. `tickTime`: 通信心跳数，Zookeeper 服务器心跳 (HearBeat) 时间，单位毫秒
   1. Zookeeper 使用的基本时间，服务器之间或客户端与服务器之间维持心跳的时间间隔， 也就是每个`tickTime` 时间就会发送一个心跳，时间单位为毫秒。
   2. 它用于**心跳机制**，并且**设置最小的 session 超时时间为两倍心跳时间**。(session 的最小超时时间是`2 * tickTime`)
2. `initLimit`：LF 初始通信时限
   1. 集群中的 Follower 跟随者服务器 (F) 与 Leader 领导者服务器 (L) 之间初始连接时**能容忍的最多心跳数**（`tickTime` 的数量），用它来限定集群中的 Zookeeper 服务器连接到 Leader 的时限。
   2. 投票选举新 Leader 的初始化时间
   3. Follower 在启动过程中，会从 Leader 同步所有最新数据，然后确定自己能够对外服务的起始状态。
   4. Leader 允许 F 在 `initLimit` 时间内完成这个工作。
3. `syncLimit`：LF 同步通信时限
   1. 集群中 Leader 与 Follower 之间的**最大响应时间单位**，假如响应超过 `syncLimit * tickTime`，Leader 认为 Follwer 死掉，从服务器列表中删除 Follwer 。
   2. 在运行过程中，Leader 负责与 ZK 集群中所有机器进行通信，例如通过一些心跳检测机 制，来检测机器的存活状态。
   3. 如果 L 发出心跳包在 syncLimit 之后，还没有从 F 那收到响应，那么就认为这个 F 已经不在线了。
4. `dataDir`：数据文件目录 + 数据<u>持久化路径</u>
   1. 保存**内存数据库快照信息**的位置，如果没有其他说明，更新的事务日志也保存到数据库。
5. `clientPort`：客户端连接端口
   1. 监听客户端连接的端口





## 3. Zookeeper 内部原理



### 3.1. Zookeeper 内部选举机制

1. 半数机制（Paxos 协议）：集群中半数以上机器存活，集群可用。所以 zookeeper 适合装在奇数台机器
2. Zookeeper 虽然在配置文件中并没有指定 master 和 slave。但是，zookeeper 工作时，是有一个节点为 leader，其他则为 follower，Leader 是通过内部的选举机制临时产生的



以一个简单的例子来说明整个选举的过程。

假设有五台服务器组成的 zookeeper 集群，它们的 id 从 `1-5`，同时它们都是最新启动的， 也就是没有历史数据，在存放数据量这一点上，都是一样的。假设这些服务器**依序启动**，来看看会发生什么。



![Screen Shot 2020-03-10 at 22.13.32](/Users/macbookpro/Desktop/assets/Screen Shot 2020-03-10 at 22.13.32.png)



- 服务器 1 启动，此时只有它一台服务器启动了，它发出去的报没有任何响应，所 以它的选举状态一直是 LOOKING 状态。
- 服务器 2 启动，它与最开始启动的服务器 1 进行通信，互相交换自己的选举结果， 由于两者都没有历史数据，所以 id 值较大的服务器 2 胜出，但是由于没有达到超过半数以上的服务器都同意选举它 ( 这个例子中的半数以上是 3) ，所以服务器 1、2 还是继续保持 LOOKING 状态。
- 服务器 3 启动，根据前面的理论分析，服务器 3 成为服务器 1、2、3 中的老大， 而与上面不同的是，此时有三台服务器选举了它，所以它成为了这次选举的 leader。
- 服务器 4 启动，根据前面的分析，理论上服务器 4 应该是服务器 1、2、3、4 中最大的，但是由于前面已经有半数以上的服务器选举了服务器 3，所以它只能接收当小弟的命 了。
- 服务器 5 启动，同 4 一样当小弟。











### 3.2. Zookeeper 节点类型



Znode 有两种类型:

- 短暂 (ephemeral): 客户端和服务器端断开连接后，创建的**节点自动删除**
- 持久 (persistent): 客户端和服务器端断开连接后，**创建的节点不删除**



Znode 有四种形式的目录节点（默认是 persistent ）

1. 持久化目录节点 (**`PERSISTENT`**)
   1. 客户端与 zookeeper 断开连接后，该节点依旧存在
2. 持久化顺序编号目录节点 (**`PERSISTENT_SEQUENTIAL`**)
   1. 客户端与 zookeeper 断开连接后，该节点依旧存在，只是 Zookeeper 给该节点名称进行**顺序编号**
3. 临时目录节点 (**`EPHEMERAL`**)
   1. 客户端与 zookeeper 断开连接后，该节点被删除
4. 临时顺序编号目录节点 (**`EPHEMERAL_SEQUENTIAL`**)
   1. 客户端与 zookeeper 断开连接后，该节点被删除，只是 Zookeeper 给该节点名称进行顺序编号



创建 znode 时设置顺序标识，znode 名称后会附加一个值，顺序号是一个单调递增的计数器，由父节点维护



在分布式系统中，**顺序号可以被用于为所有的事件进行全局排序**，这样客户端可以通过顺序号推断事件的顺序



![Screen Shot 2020-03-10 at 22.25.51](/Users/macbookpro/Desktop/assets/Screen Shot 2020-03-10 at 22.25.51.png)









### 3.3. stat 结构体









### 3.4. Zookeeper 监听器原理









### 3.5. Zookeeper 写数据的流程





















