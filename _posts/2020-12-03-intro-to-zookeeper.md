---
layout: article
title: "理解 Zookeeper 原理以及源码分析"
date: 2020-12-03
modify_date: 2020-12-03
excerpt: "Introduction to Zookeeper"
tags: [Zookeeper, Big Data]
mathjax: false
mathjax_autoNumber: false
key: intro-to-zookeeper
---



# 理解 Zookeeper 原理以及源码分析

<div align="center">
  <img src="https://upload.wikimedia.org/wikipedia/en/thumb/8/81/Apache_ZooKeeper_Logo.svg/1200px-Apache_ZooKeeper_Logo.svg.png" width="40%">
</div>



> Zookeeper 主要应用于大数据开发中的, 统一命名服务、统一配置管理、统一集群管理、服务器节点动态上下线、软负载均衡等场景。该框架相当于大数据框架中的润滑剂。是大数据大数据开发工程师必须会的框架之一。本套课程讲解了, Zookeeper 的集群安装、选举机制、监听器原理、写数据流程、Shell命令行操作、客户端API操作、服务器节点动态上下线综合案例以及企业真实面试题。



## 1. Zookeeper 入门



### 1.1. Zookeeper 概述

Zookeeper 是一个开源的分布式的, 为分布式应用提供**协调服务**的 Apache 项目。

Zookeeper 从设计模式角度来理解：是一个基于**<u>观察者模式</u>**设计的分布式服务管理框架,  它负责**存储和管理**大家都关心的数据, 然后**接受观察者的注册**, <u>一旦这些数据的状态发生变化, Zookeeper 就将负责通知已经在 Zookeeper 上注册的那些观察者做出相应的反应</u>, 从而实现集群中类似 Master/Slave 管理模式



<strong><u>Zookeeper = "文件系统 + 通知机制"</u></strong>



### 1.2. Zookeeper 特点



<div align="center">
  <img src="https://data-flair.training/blogs/wp-content/uploads/sites/2/2018/07/Architecture-of-Zookeeper-3.png">
</div>



1. Zookeeper: 一个领导者 (Leader), 多个跟随者 (Follower) 组成的集群。
2. Leader: 负责进行投票的发起和决议, 更新系统状态
3. Follower: 用于接收客户请求并向客户端返回结果, 在选举 Leader 过程中参与投票
4. 集群中只要有**<u>半数以上</u>**节点存活, Zookeeper 集群就能正常服务。
5. 全局数据一致: 每个 Server 保存一份相同的数据副本, Client 无论连接到哪个 Server, 数据都是一致的。
6. 更新请求顺序进行, 来自**同一个 Client** 的更新请求**按其发送顺序依次执行**。
7. 数据更新**原子性**, 一次数据更新**要么成功, 要么失败**。(transaction)
8. <u>实时性</u>, 在一定时间范围内, Client 能读到最新数据。(复制很快, 数据量不大)



### 1.3. Zookeeper 的数据结构



<div align="center">
  <img src="https://data-flair.training/blogs/wp-content/uploads/sites/2/2018/07/Data-Model-and-The-Hierarchical-Namespace-of-Zookeeper.png">
</div>



ZooKeeper 数据模型的结构与 Unix 文件系统很类似, 整体上可以看作是一棵树, 每个节点称做一个 `ZNode`。

很显然 Zookeeper 集群自身维护了一套数据结构。这个存储结构是一个树形结构, 其上的每一个节点, 我们称之为"znode", 每一个 Znode 默认能够存储 **1MB** 的数据, 每个 ZNode 都可以通过其**路径被唯一标识** (`/app1/p_2`)



### 1.4. Zookeeper 的应用场景



Zookeeper 提供的服务有:

- 统一命名 / 配置服务管理
- 统一集群管理
- 服务器节点动态上下线
- 软负载均衡
- 分布式消息同步和协调机制



#### 1.4.1. 统一命名 / 配置服务

在分布式环境下, 经常需要对应用 / 服务进行统一命名, 便于识别



1. 在分布式环境下, 配置文件同步是十分常见的
   1. 一般要求同一个集群中, 所有节点的配置信息是一致的, 比如一个 Kafka 集群
   2. 对配置文件修改后, 希望能够快速同步到各个节点上
      1. 举个例子, 网站 domain name 和 ip 的对应关系, ip 地址放在Znode, client 去监听
2. 配置管理也可以交给 Zookeeper 实现
   1. 将配置信息写入 Zookeeper 的一个 Znode 上
   2. 各个客户端服务器监听这个 Znode (监听变化)
   3. 一旦 Znode 中的数据被修改, Zookeeper 将通知给各个客户端服务器



<div align="center">
  <img src="https://raw.githubusercontent.com/Zhenye-Na/img-hosting-picgo/master/img/zookeeper-1.png" width="80%">
</div>





#### 1.4.2. 统一集群管理服务



1. 分布式环境中, 需要实时掌握每个节点的状态
   1. 可以根据节点实时状态做出一些调整
2. Zookeeper 可以实现实时监控节点状态变化
   1. 可以将某一个节点信息写入 Zookeeper 上的一个 Znode
   2. 其他节点监听这个 Znode 就可以获取该节点的实时状态变化



<div align="center">
  <img src="https://raw.githubusercontent.com/Zhenye-Na/img-hosting-picgo/master/img/zookeeper-2.png" width="80%">
</div>





#### 1.4.3. 服务器节点动态上下线

> 客户端能够实时洞察到服务器上下线的变化

1. 服务端启动时去注册信息 (创建的是**临时节点**)
2. 客户端获取到在线服务器列表, 并且注册监听
3. 如果某个服务器下线
4. 客户端获取到服务器节点上下线通知
5. 重新获取在线的服务端列表信息



<div align="center">
  <img src="https://raw.githubusercontent.com/Zhenye-Na/img-hosting-picgo/master/img/zookeeper-3.png" width="80%">
</div>



#### 1.4.4. 软负载均衡

可以用来做一个十分**简易**的 Load-Balancer:

在 Zookeeper 中记录每一台服务器的访问数, 让**访问数最少**的服务器去处理最新的客户端请求



<div align="center">
  <img src="https://raw.githubusercontent.com/Zhenye-Na/img-hosting-picgo/master/img/zookeeper-4.png" width="80%">
</div>



- Register 负责域名的注册,  服务启动后将域名信息通 过 Register 注册到 Zookeeper 相对应的域名服务下。
- Dispatcher 负责域名的解析。 可以实现软负载均衡。
- Scanner 通过定时监测服务状态,  动态更新节点地址 信息。
- Monitor 负责收集服务信息与状态监控。
- Controller 提供后台 Console,  提供配置管理功能。



#### 1.4.5. 数据发布与订阅

集中式配置中心 (Push + Pull)



- 应用启动时主动到 Zookeeper 上获取配置信息,  并注册 Watcher 监听。
- 配置管理员变更 Zookeeper 配置节点的内容。 
- Zookeeper 推送变更到应用,  触发 Watcher 回调函数。 
- 应用根据逻辑,  主动获取新的配置信息,  更改自身逻辑。



## 2. Zookeeper 安装配置

### 2.1. Zookeeper 配置参数解读



Zookeeper 的配置文件是 `/opt/zookeeper/conf/zoo.cfg`, 文件中的一些常用参数的含义如下



1. `tickTime`: 通信心跳数, Zookeeper 服务器心跳 (HearBeat) 时间, 单位毫秒
   1. Zookeeper 使用的基本时间, 服务器之间或客户端与服务器之间维持心跳的时间间隔,  也就是每个`tickTime` 时间就会发送一个心跳, 时间单位为毫秒。
   2. 它用于**心跳机制**, 并且**设置最小的 session 超时时间为两倍心跳时间**。(session 的最小超时时间是`2 * tickTime`)
2. `initLimit`：L&F **初始**通信时限
   1. 集群中的 Follower 跟随者服务器 (F) 与 Leader 领导者服务器 (L) 之间**初始连接**时**能容忍的最多心跳数**（`tickTime` 的数量）, 用它来限定集群中的 Zookeeper 服务器连接到 Leader 的时限。
      1. 例如, `initLimit = 10, tickTime = 2`, 那么就是 `10 * 2 = 20` 秒的时间
   2. 投票选举新 Leader 的初始化时间
   3. Follower 在启动过程中, 会从 Leader 同步所有最新数据, 然后确定自己能够对外服务的起始状态。
   4. Leader 允许 F 在 `initLimit` 时间内完成这个工作。
3. `syncLimit`：L&F 同步通信时限 (集群运行中)
   1. 集群中 Leader 与 Follower 之间的**最大响应时间单位**, 假如响应超过 `syncLimit * tickTime`, Leader 认为 Follwer 挂了, 从服务器列表中删除 Follwer 。
   2. 在运行过程中, Leader 负责与 ZK 集群中所有机器进行通信, 例如通过一些心跳检测机 制, 来检测机器的存活状态。
   3. 如果 L 发出心跳包在 `syncLimit` 之后, 还没有从 F 那收到响应, 那么就认为这个 F 已经不在线了。
4. `dataDir`：数据文件目录 + 数据<u>持久化路径</u>
   1. 保存**内存数据库快照信息**的位置, 如果没有其他说明, 更新的事务日志也保存到数据库。
5. `clientPort`：客户端连接端口
   1. 监听客户端连接的端口





## 3. Zookeeper 内部原理



### 3.1. Zookeeper 内部选举机制 ★★★

1. 半数机制（Paxos 协议）：**集群中半数以上机器存活, 集群可用**。所以 zookeeper 适合装在**奇数**台机器
2. Zookeeper 虽然在配置文件中并没有指定 main 和 secondary。但是, zookeeper 工作时, 是有一个节点为 leader, 其他则为 follower, Leader 是通过内部的选举机制临时产生的



以一个简单的例子来说明整个选举的过程。

假设有五台服务器组成的 zookeeper 集群, 它们的 id 从 `1-5`, 同时它们都是新启动的,  也就是没有历史数据, 在存放数据量这一点上, 都是一样的。假设这些服务器**依序启动**, 来看看会发生什么。



<div align="center">
  <img src="https://raw.githubusercontent.com/Zhenye-Na/img-hosting-picgo/master/img/zookeeper-5.png">
</div>



- 服务器 1 启动, 此时只有它一台服务器启动了, 它发出去的报没有任何响应, 所 以它的选举状态一直是 LOOKING 状态。
- 服务器 2 启动, 它与最开始启动的服务器 1 进行通信, 互相交换自己的选举结果,  由于两者都没有历史数据, 所以 id 值较大的服务器 2 胜出, 但是由于没有达到超过半数以上的服务器都同意选举它 ( 这个例子中的半数以上是 3) , 所以服务器 1, 2 还是继续保持 LOOKING 状态。
- 服务器 3 启动, 根据前面的理论分析, 服务器 3 成为服务器 1, 2, 3 中的老大,  而与上面不同的是, 此时有三台服务器选举了它, 所以它成为了这次选举的 leader。
- 服务器 4 启动, 根据前面的分析, 理论上服务器 4 应该是服务器 1, 2, 3, 4 中最大的, 但是由于前面已经有半数以上的服务器选举了服务器 3, 所以它只能接收当小弟的命 了。
- 服务器 5 启动, 同 4 一样当小弟。



### 3.2. Zookeeper 节点类型



Znode 有两种类型:

- 短暂 (ephemeral): 客户端和服务器端断开连接后, 创建的**节点自动删除**
- 持久 (persistent): 客户端和服务器端断开连接后, **创建的节点不删除**



Znode 有四种形式的目录节点（默认是 persistent ）

1. 持久化目录节点 (**`PERSISTENT`**)
   1. 客户端与 zookeeper 断开连接后, 该节点依旧存在
2. 持久化顺序编号目录节点 (**`PERSISTENT_SEQUENTIAL`**)
   1. 客户端与 zookeeper 断开连接后, 该节点依旧存在, 只是 Zookeeper 给该节点名称进行**顺序编号**
3. 临时目录节点 (**`EPHEMERAL`**)
   1. 客户端与 zookeeper 断开连接后, 该节点被删除
4. 临时顺序编号目录节点 (**`EPHEMERAL_SEQUENTIAL`**)
   1. 客户端与 zookeeper 断开连接后, 该节点被删除, 只是 Zookeeper 给该节点名称进行顺序编号



创建 znode 时设置顺序标识, znode 名称后会附加一个值, 顺序号是一个单调递增的计数器, 由父节点维护



在分布式系统中, **顺序号可以被用于为所有的事件进行全局排序**, 这样客户端可以通过顺序号推断事件的顺序







### 3.3. stat 结构体



1. `czxid`
   1. 引起这个 znode 创建的 `zxid`, 创建节点的事务的 `zxid`. 每次修改 ZooKeeper 状态都会收到一个 `zxid` 形式的时间戳, 也就是 ZooKeeper **事务 ID**。
   2. 事务 ID 是 ZooKeeper 中**所有修改总的次序**。每个修改都有唯一的 `zxid`, 如果 zxid1 小
2. `ctime` - znode 被创建的毫秒数 (从 1970 年开始, lol)
3. `mzxid` - znode 最后更新的 zxid
4. `mtime` - znode 最后修改的毫秒数(从 1970 年开始)
5. `pZxid` - znode 最后更新的子节点 zxid
6. `cversion` - znode 子节点变化号, znode 子节点修改次数
7. `dataversion` - znode 数据变化号
8. `aclVersion` - znode 访问控制列表的变化号
9. `ephemeralOwner` - 如果是临时节点, 这个是 znode 拥有者的 session id。如果不是临时节 点则是 0。
10. `dataLength` - znode 的数据长度
11. `numChildren` - znode 子节点数量





### 3.4. Zookeeper 监听器原理 ★★★







1. 监听原理详解

   1. 首先要有一个 `main()` 线程
   2. 在 main 线程中创建 Zookeeper 客户端, 这时就会创建两个线程, 一个负责网络连接 通信（connet）, 一个负责监听（listener）。
   3. 通过 connect 线程将注册的监听事件发送给 Zookeeper。
   4. 在 Zookeeper 的注册监听器列表中将注册的监听事件添加到列表中。
   5. Zookeeper 监听到有数据或路径变化, 就会将这个消息发送给 listener 线程。
   6. listener 线程内部调用了 `process()` 方法。

2. 常见的监听

   1. 监听节点数据的变化：

      `get path [watch]`

   2. 监听子节点增减的变化

      `ls path [watch]`







### 3.5. Zookeeper 写数据的流程



ZooKeeper 的写数据流程主要分为以下几步：

1. 比如 Client 向 ZooKeeper 的 Server1 上写数据, 发送一个写请求。
2. 如果 Server1 不是 Leader, 那么 Server1 会把接受到的请求进一步转发给 Leader, 因 为每个 ZooKeeper 的 Server 里面有一个是 Leader 。这个 Leader 会将写请求广播给各个 Server, 比如 Server1 和 Server2,  各个 Server 写成功后就会通知 Leader。
3. 当 Leader 收到大多数 Server 数据写成功了, 那么就说明数据写成功了。如果这里 三个节点的话, 只要有两个节点数据写成功了, 那么就认为数据写成功了。写成功之后,  Leader 会告诉 Server1 数据写成功了。
4. Server1 会进一步通知 Client 数据写成功了, 这时就认为整个写操作成功。ZooKeeper 整个写数据流程就是这样的。









## References

[1] [用ZooKeeper来做：统一配置管理、统一命名服务、分布式锁、集群管理](https://blog.csdn.net/redfivehit/article/details/97831337)  

[2] [How To Install and Configure an Apache ZooKeeper Cluster on Ubuntu 18.04](https://www.digitalocean.com/community/tutorials/how-to-install-and-configure-an-apache-zookeeper-cluster-on-ubuntu-18-04)  

[3] 