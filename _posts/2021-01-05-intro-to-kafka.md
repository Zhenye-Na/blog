---
layout: article
title: "Kafka 从入门到放弃"
date: 2021-01-05
modify_date: 2021-01-05
excerpt: "Kafka 从入门到放弃"
tags: [Kafka]
mathjax: false
mathjax_autoNumber: false
key: intro-to-kafka
---

## Kafka 概述

### Kafka 定义

Kafka 是一个**分布式**的基于**发布/订阅模式**的消息队列 (Message Queue), 可应用于大数据实时处理 (异步处理)

使用消息队列带来的好处:

1. **解耦**
   1. 可以独立的扩展或修改两边的处理过程, 只要确保他们遵守同样的接口
2. 可恢复性
   1. 消息队列降低耦合度, 所以如果一个系统挂掉, 那么在消息队列里的消息时仍然可以继续处理的
3. 缓冲
   1. 解决生产者和消费者处理速度不一致的情况 (大部分是生产 >> 消费)
4. 峰值处理 (**削峰**)
   1. 突发流量 QPS, 秒杀系统 (?)
5. 异步通信
   1. 队列中的消息可以不需要立即处理



### 消息队列的两种模式



#### 点对点模式 (一对一)

消费者主动拉取数据消息, 消息拉取后, queue 中不再存储.

支持存在多个消费者, 但是<u>一个消息只能有一个消费者可以消费</u>



#### 发布/订阅模式 (Pub/Sub)

消费者拉取数据后不会清除信息, 但是保留是有期限的

消息生产者 (发布) 将消息发布到 Topic 中, 同时有<u>多个消费者</u>订阅消息. 发布到 Topic 的消息会被所有订阅者消费



推送消息速度 (能力) 是由队列决定的 : (消息发送速率是由 broker 决定的)
{:.warning}



发布/订阅模式的队列又分为

1. 消费者主动 pull (Kafka)
2. broker 主动 push



### Kafka 架构基础

![kafka-architecture](https://raw.githubusercontent.com/Zhenye-Na/img-hosting-picgo/master/img/kafka-architecture.png)


名词解释

- Producer: 消息生产者, 向 Broker 发送消息
- Consumer: 消息消费者, 从 Broker 中拉取消息
- Consumer Group (CG): 消费者组, 由多个 Consumer 组成. 
  - 消费者组内每个消费者负责消费不同分区的数据, **一个分区只能由同一个组内的某一个消费者消费**. 不同组之间互不影响
  - 所有的消费者都属于某一个消费者组 (消费者组才是逻辑上的一个订阅者)
- Broker: 一台 Kafka 服务器就是一个 Broker, 一个集群由多个 Broker 组成. 一个 Broker 包括多个 Topic
- Topic: 生产者/消费者面向的都是一个 Topic
  - 详细一点可以认为点赞, 评论, 关注都是不同的 Topic
- Partition: 一个非常大的 Topic 可以分到多个 Broker 上, 一个 Topic 可以分成多个 Partition, 每个 Partition 都是一个队列
- Replica: 保证节点数据在发生故障时不丢失, 并且 Kafka 可以继续正常工作
  - 每一个 Topic 分区都有若干个副本 (Leader + Follower)
- Leader: 不管是生产者还是消费者都只找 Leader
- Follower: Follower 仅仅作为 Replication 的作用
  - 若 Leader 挂掉, Follower 会成为新的 Leader



## Kafka 架构深入

### Kafka 工作流程及文件存储机制

![](https://sookocheff.com/post/kafka/kafka-in-a-nutshell/log-anatomy.png)

> 分区内有序, 但不能保证全局有序

Kafka 中消息是以 topic 进行分类的, 生产者生产消息, 消费者消费消息, 都是面向 topic 的. 

topic 是逻辑上的概念, 而 partition 是物理上的概念, 每个 partition 对应于一个 log 文件, 该 log 文件中存储的就是 producer 生产的数据.

> 这个 log 文件和我们平时理解的 log 文件不一样, Kafka 的 log 文件, 就是 Producer 发出的数据 (消息).

Producer 生产的数据会被不断追加到该 log 文件末端, 且每条数据都有自己的 `offset`. 消费者组中的每个消费者, 都会实时记录自己 消费到了哪个 `offset`, 以便出错恢复时, 从上次的位置继续消费. 

![kafka-file-system](https://raw.githubusercontent.com/Zhenye-Na/img-hosting-picgo/master/img/kafka-file-system.png)


由于生产者生产的消息会不断追加到 log 文件末尾, 为防止 log 文件过大导致数据定位 效率低下, Kafka 采取了分片和索引机制, 将每个 partition 分为多个 `segment`. 每个 `segment` 对应两个文件 - `".index"` 文件和 `".log"` 文件. 这些文件位于一个文件夹下, 该文件夹的命名 规则为: `topic 名称 + 分区序号`. 例如, first 这个 topic 有三个分区, 则其对应的文件夹为 `first0, first-1, first-2`


index 和 log 文件以当前 segment 的第一条消息的 `offset` 命名. 下图为 `index` 文件和 `log` 文件的结构示意图

![kafka-index-and-log](https://raw.githubusercontent.com/Zhenye-Na/img-hosting-picgo/master/img/kafka-index-and-log.png)



`".index"` 文件存储大量的索引信息, `".log"` 文件存储大量的数据, 索引文件中的元 数据指向对应数据文件中 message 的物理偏移地址
{:.info}



### Kafka 生产者

#### 分区策略

**分区原因**

1. 方便在集群中扩展, 每个 Partition 可以通过调整以适应它所在的机器, 而一个 topic 又可以有多个 Partition 组成, 因此整个集群就可以适应任意大小的数据了
2. 可以提高并发, 因为可以以 Partition 为单位读写了


**分区原则**

我们需要将 producer 发送的数据封装成一个 `ProducerRecord` 对象

1. 指明 partition 的情况下, 直接将指明的值直接作为 partiton 值
2. 没有指明 partition 值但有 `key` 的情况下, 将 key 的 hash 值与 topic 的 partition 数进行取余得到 partition 值
3. 既没有 partition 值又没有 `key` 值的情况下, 第一次调用时随机生成一个整数 (后面每次调用在这个整数上自增) , 将这个值与 topic 可用的 partition 总数取余得到 partition 值, 也就是常说的 `round-robin` 算法. 

![kafka-producer-partition-rules](https://raw.githubusercontent.com/Zhenye-Na/img-hosting-picgo/master/img/kafka-producer-partition-rules.png)


### 数据可靠性

为保证 producer 发送的数据, 能可靠的发送到指定的 topic, topic 的每个 partition 收到 producer 发送的数据后, 都需要向 producer 发送 ack (acknowledgement 确认收到), 如果 producer 收到 ack, 就会进行下一轮的发送, 否则重新发送数据. 

![kafka-data-xfr](https://raw.githubusercontent.com/Zhenye-Na/img-hosting-picgo/master/img/kafka-data-xfr.png)


#### 副本数据同步策略


| 方案                        | 优点                                                      | 缺点                                                      |
|-----------------------------|-----------------------------------------------------------|-----------------------------------------------------------|
| 半数以上完成同步, 就发送 ack | 延迟低                                                    | 选举新的 leader 时, 容忍 n 台节点的故障, 需要 2n+1 个副本 |
| 全部完成同步, 才发送 ack    | 选举新的 leader 时, 容忍 n 台节点的故障, 需要 n+1 个副 本 | 延迟高                                                    |
|                             |                                                           |                                                           |


Kafka 选择了第二种方案, 但是又引入了一个新的知识点, 就是 `ISR`

#### ISR (In-Sync Replica Set)

采用第二种方案之后, 设想以下情景: leader 收到数据, 所有 follower 都开始同步数据,  但有一个 follower, 因为某种故障, 迟迟不能与 leader 进行同步, 那 leader 就要一直等下去,  直到它完成同步, 才能发送 ack. 这个问题怎么解决呢？

Leader 维护了一个动态的 in-sync replica set (ISR), 意为和 leader 保持同步的 follower 集合. 当 ISR 中的 follower 完成数据的同步之后, leader 就会给 follower 发送 ack. 如果 follower 长时间未向 leader 同步数据 ,  则该 follower 将被踢出 ISR ,  该时间阈值由 `replica.lag.time.max.ms` 参数设定. Leader 发生故障之后, 就会从 ISR 中选举新的 leader 


> `replica.lag.time.max.ms`
> 
> If a follower hasn't sent any fetch requests or hasn't consumed up to the leaders log end offset for at least this time, the leader will remove the follower from isr. default = 30000 (30s)
> 
> Configuration parameter `replica.lag.time.max.ms` now refers not just to the time passed since last fetch request from replica, but also to time since the replica last caught up. Replicas that are still fetching messages from leaders but <u>did not catch up to the latest messages</u> in `replica.lag.time.max.ms` will be considered out of sync.


#### 应对数据丢失重复 - ack 应答机制

对于某些不太重要的数据, 对数据的可靠性要求不是很高, 能够容忍数据的少量丢失,  所以没必要等 ISR 中的 follower 全部接收成功. 

所以 Kafka 为用户提供了三种可靠性级别, 用户根据对可靠性和延迟的要求进行权衡,  选择以下的配置. 

acks 参数配置: 

- `0`: producer 不等待 broker 的 ack, 这一操作提供了一个最低的延迟, broker 还没有接收到写入磁盘 ack 就已经返回, 当 broker 故障时有可能丢失数据
- `1`: producer 等待 broker 的 ack, partition 的 leader 落盘成功后返回 ack, 如果在 follower 同步成功之前 leader 故障, 那么将会发生**数据丢失**
- `-1`(all): producer 等待 broker 的 ack, partition 的 leader 和 follower 全部落盘成功后才返回 ack. 但是如果在 follower 同步完成后, broker 发送 ack 之前, leader 发生故障, 那么会造成**数据重复**



> 关于 Kafka 中的选举机制, 可以参考这篇文章: [kafka leader 选举 ](https://aidodoo.com/post/kafka/kafka-leader%E9%80%89%E4%B8%BE/)



#### 保证数据一致性 (HW 和 LEO)


所以 Kafka 引入了两个新的概念: HW 和 LEO

- `LEO`: 指的是每个副本最大的 offset；
- `HW`: 指的是消费者能见到的最大的 offset, ISR 队列中最小的 LEO


`HW` 之前的数据才对 Consumer 可见, 也就是 Consumer 可见的 `Offset` 最大值
{:.info}

![kafka-hw-and-leo](https://raw.githubusercontent.com/Zhenye-Na/img-hosting-picgo/master/img/kafka-hw-and-leo.png)



1. follower 故障
   1. follower 发生故障后会被临时踢出 ISR, 待该 follower 恢复后, follower 会读取本地磁盘记录的上次的 HW, 并将 log 文件**高于 HW 的部分截取掉**, 从 HW 开始向 leader 进行同步.  等该 follower 的 LEO 大于等于该 Partition 的 HW, 即 follower 追上 leader 之后, 就可以重新加入 ISR 了. 
2. leader 故障
   1. leader 发生故障之后, 会从 ISR 中选出一个新的 leader, 之后, 为保证多个副本之间的数据一致性, 其余的 follower 会先将各自的 log 文件**高于 HW 的部分截掉**, 然后从新的 leader 同步数据. 



注意: 这只能保证副本之间的数据一致性, 并不能保证数据不丢失或者不重复
{:.warning}


![kafka-hw-and-leo-2](https://raw.githubusercontent.com/Zhenye-Na/img-hosting-picgo/master/img/kafka-hw-and-leo-2.png)


#### Exactly Once 幂等性

将服务器的 ACK 级别设置为 `-1`, 可以保证 Producer 到 Server 之间不会丢失数据, 即 **`At Least Once`** 语义. 相对的, 将服务器 ACK 级别设置为 `0`, 可以保证生产者每条消息只会被发送一次, 即 **`At Most Once`** 语义.

At Least Once 可以保证数据不丢失, 但是不能保证数据不重复; 相对的, At Least Once 可以保证数据不重复, 但是不能保证数据不丢失

**但是, 对于一些非常重要的信息, 比如说交易数据, 下游数据消费者要求数据既不重复也不丢失, 即 `Exactly Once` 语义**

0.11 版本的 Kafka, 引入了一项重大特性: **幂等性**. 所谓的幂等性就是指 Producer 不论向 Server 发送多少次重复数据, Server 端都只会持久化一条. 幂等性结合 At Least Once 语 义, 就构成了 Kafka 的 Exactly Once 语义. 即：

**At Least Once + 幂等性 = Exactly Once**



要启用幂等性, 只需要将 Producer 的参数中 `enable.idompotence` 设置为 `true` 即可. Kafka 的幂等性实现其实就是将原来下游需要做的去重放在了数据上游. 开启幂等性的 Producer 在 初始化的时候会被分配一个 `PID`, 发往同一 Partition 的消息会附带 `Sequence Number`. 而 Broker 端会对 `<PID, Partition, SeqNumber>` 做缓存, 当具有相同主键的消息提交时, Broker 只会持久化一条. 

**但是 PID 重启就会变化**, 同时不同的 Partition 也具有不同主键, 所以幂等性无法保证**跨分区跨会话**的 Exactly Once. 



### Kafka 消费者

#### 消费方式 - 消费者如何拉取数据?

consumer 采用 pull 模式从 broker 中读取数据. 

push 模式很难适应消费速率不同的消费者, 因为消息发送速率是由 broker 决定的.  它的目标是尽可能以最快速度传递消息, 但是这样很容易造成 consumer 来不及处理消息, 典型的表现就是拒绝服务以及网络拥塞. 而 pull 模式则可以根据 consumer 的消费能力以适 当的速率消费消息. 

pull 模式不足之处是, 如果 kafka 没有数据, 消费者可能会陷入循环中, 一直返回空数据. 针对这一点, Kafka 的消费者在消费数据时会传入一个时长参数 `timeout`, 如果当前没有数据可供消费, consumer 会等待一段时间之后再返回, 这段时长即为 `timeout`. 




#### partition 分配策略


一个 consumer group 中有多个 consumer, 一个 topic 有多个 partition, 所以必然会涉及到 partition 的分配问题, 即确定那个 partition 由哪个 consumer 来消费. 

分区分配策略指路: [Kafka消费者组三种分区分配策略 roundrobin, range, StickyAssignor](https://www.cnblogs.com/chenxiaoge/p/13335416.html)



#### Offset 维护

consumer 默认将 `offset` 保存在 Zookeeper 中, 从 0.9 版本开始,  consumer 默认将 offset 保存在 Kafka 一个内置的 topic 中, 该 topic 为 `__consumer_offsets`


### Kafka 是如何读写数据的?

1) 顺序写磁盘

Kafka 的 producer 生产数据, 要写入到 log 文件中, 写的过程是一直追加到文件末端,  为顺序写. 官网有数据表明, 同样的磁盘, 顺序写能到 600M/s, 而随机写只有 100K/s. 这与磁盘的机械机构有关, 顺序写之所以快, 是因为其省去了大量磁头寻址的时间. 

2) 零复制技术

![kafka-zero-copy](https://raw.githubusercontent.com/Zhenye-Na/img-hosting-picgo/master/img/kafka-zero-copy.png)


### Zookeeper 在 Kafka 中的作用

Kafka 集群中有一个 broker 会被选举为 Controller, 负责管理集群 broker 的上下线, 所 有 topic 的分区副本分配和 leader 选举等工作. 

Controller 的管理工作都是依赖于 Zookeeper 的


### Kafka 事务

Kafka 从 0.11 版本开始引入了事务支持. 事务可以保证 Kafka 在 Exactly Once 语义的基

础上, 生产和消费可以跨分区和会话, 要么全部成功, 要么全部失败. 

#### Producer 事务

为了实现<u>跨分区跨会话</u>的事务, 需要引入一个全局唯一的 Transaction ID, 并将 Producer 获得的 PID 和 Transaction ID 绑定. 这样当 Producer 重启后就可以通过正在进行的 Transaction ID 获得原来的 PID. 

为了管理 Transaction, Kafka 引入了一个新的组件 Transaction Coordinator. Producer 就是通过和 Transaction Coordinator 交互获得 Transaction ID 对应的任务状态.  Transaction Coordinator 还负责将事务所有写入 Kafka 的一个内部 Topic, 这样即使整个服务重启, 由于事务状态得到保存, 进行中的事务状态可以得到恢复, 从而继续进行. 

#### Consumer 事务

上述事务机制主要是从 Producer 方面考虑, 对于 Consumer 而言, 事务的保证就会相对较弱, 尤其是无法保证 Commit 的信息被精确消费. 这是由于 Consumer 可以通过 offset 访问任意信息, 而且不同的 Segment File 生命周期不同, 同一事务的消息可能会出现重启后被删除的情况. 

## References

- [kafka leader 选举 ](https://aidodoo.com/post/kafka/kafka-leader%E9%80%89%E4%B8%BE/)
- [Kafka 消费者组三种分区分配策略 roundrobin, range, StickyAssignor](https://www.cnblogs.com/chenxiaoge/p/13335416.html)
