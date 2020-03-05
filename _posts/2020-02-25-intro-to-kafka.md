---
layout: article
title: "大数据之 Kafka - 学习笔记"
date: 2020-02-25
modify_date: 2020-03-04
excerpt: "Introduction to Kafka Basics - Learning Notes"
tags: [Kafka]
mathjax: false
mathjax_autoNumber: false
key: intro-to-kafka
---



# 大数据之 Kafka - 学习笔记



> Kafka 是高吞吐量的分布式发布订阅消息系统，它可以处理消费者规模的网站中的所有动作流数据。你将学到 Kafka 架构原理, 安装配置使用, 详细的 Kafka 写入数据和处理数据以及写出数据的流程, 新旧版本对比及运用、分区副本机制的详解, 内部存储策略, 高阶 API 直接消费数据, 低阶 API 自行管理 Offset 消费数据, Kafka 拦截器以及 Kafka Stream 流式处理。



[TOC]

## 1. Kafka 概述



### 1.1. Kafka 是什么

在流式计算中，Kafka 一般用来**缓存数据**，Storm 通过消费 Kafka 的数据进行计算。

1. Apache Kafka 是一个开源**消息系统**，由 Scala 写成。是由 Apache 软件基金会开发的 一个开源消息系统项目。
2. Kafka 最初是由 LinkedIn 公司开发，并于 2011 年初开源。2012 年 10 月从 Apache Incubator 毕业。该项目的目标是为处理实时数据提供一个统一、高通量、低等待的平台。
3. Kafka 是**一个分布式消息队列**。Kafka 对消息保存时根据 Topic 进行归类，发送消息者称为 **Producer**，消息接受者称为 **Consumer**，此外 kafka 集群有多个 kafka 实例组成，每个实例 (server) 称为 **broker**。
4. 无论是 kafka 集群，还是 producer 和 consumer 都依赖于 **zookeeper** 集群保存一些 meta 信息，来保证系统可用性。



> Kafka 是一个**分布式**的基于**发布/订阅模式**的**消息队列** (Message Queue), 主要用于<u>大数据实时处理</u>领域



### 1.2. 消息队列



![](/Users/macbookpro/Desktop/website/_posts/assets/mq-scenarios.png)



#### 1.2.1. 使用消息队列的好处



1. 解耦
   1. 允许你独立的扩展或修改两边的处理过程，只要确保它们遵守同样的接口约束。
2. 可恢复性
   1. 系统的一部分组件失效时，不会影响到整个系统。消息队列降低了进程间的耦合度，所以即使一个处理消息的进程挂掉，加入队列中的消息仍然可以在系统恢复后被处理。
3. 缓冲
   1. 有助于控制和优化数据流经过系统的速度，解决生产消息和消费消息的处理速度不一致的情况。
4. 灵活性 & 峰值处理能力
   1. 在访问量剧增的情况下，应用仍然需要继续发挥作用，但是这样的突发流量并不常见。 如果为以能处理这类峰值访问为标准来投入资源随时待命无疑是巨大的浪费。使用消息队列能够使关键组件顶住突发的访问压力，而不会因为突发的超负荷的请求而完全崩溃。
5. 异步通信
   1. 很多时候，用户不想也不需要立即处理消息。消息队列提供了异步处理机制，允许用户把一个消息放入队列，但并不立即处理它。想向队列中放入多少消息就放多少，然后在需要 的时候再去处理它们。



#### 1.2.2. 消息队列的两种模式

**点对点模式（一对一，消费者主动拉取数据，消息收到后消息清除）**

消息生产者生产消息发送到 Queue 中，然后消息消费者从 Queue 中取出并且消费消息。

消息被消费以后，queue 中不再有存储，所以消息消费者不可能消费到已经被消费的消息。 Queue 支持存在多个消费者， 但是对一个消息而言， 只会有一个消费者可以消费。

![](/Users/macbookpro/Desktop/website/_posts/assets/mq-type-1.png)



**发布/订阅模式（一对多，消费者消费数据之后不会清除消息）**

消息生产者（发布）将消息发布到 topic 中，同时有多个消息消费者（订阅）消费该消 息。和点对点方式不同，发布到 topic 的消息会被所有订阅者消费。

细分的话发布/订阅模式其实可以分成两个不同的类型

- 消费者主动拉取
- 消息队列主动推送



![](/Users/macbookpro/Desktop/website/_posts/assets/mq-type-2.png)



### 1.3. Kafka 基础架构

![](/Users/macbookpro/Desktop/website/_posts/assets/kafka-architecture.png)



**名词解释**

1. Producer ：消息生产者，就是向 kafka broker 发消息的客户端；
2. Consumer ：消息消费者，向 kafka broker 取消息的客户端；
3. Consumer Group （CG）：消费者组，由多个 consumer 组成。**消费者组内每个消费者负责消费不同分区的数据，一个分区只能由一个组内消费者消费**；消费者组之间**互不影响**。所有的消费者都属于某个消费者组，即**消费者组是逻辑上的一个订阅者**。
4. Broker ：<u>一台 kafka 服务器就是一个 broker</u>。**一个集群由多个 broker 组成**。**一个 broker 可以容纳多个 topic**。
5. Topic ：可以理解为一个**队列**，生产者和消费者面向的都是一个 topic；
6. Partition：为了实现扩展性，一个非常大的 topic 可以分布到多个 broker（即服务器）上， 一个 topic 可以分为多个 partition，**每个 partition 是一个有序的队列**；
7. Replica：副本，为保证集群中的某个节点发生故障时，该节点上的 partition 数据不丢失，且 kafka 仍然能够继续工作，kafka 提供了副本机制，**一个 topic 的每个分区都有若干个副本， 一个 leader 和若干个 follower**。
8. Leader：每个分区多个副本的“主”，生产者发送数据的对象，以及消费者消费数据的对 象都是 leader。
9. Follower：每个分区多个副本中的“从”，<u>实时从 Leader 中同步数据</u>，保持和 Leader 数据 的同步。*leader 发生故障时，某个 follower 会成为新的 leader*。
10. Offset：kafka 的存储文件都是按照 `offset.kafka` 来命名，用 `offset` 做名字的好处是方便查找。例如你想找位于 `2049` 的位置，只要找到 `2048.kafka` 的文件即可。当然 the first offset 就是 `00000000000.kafka`。





































## References

- https://www.bilibili.com/video/av65544753
- 

