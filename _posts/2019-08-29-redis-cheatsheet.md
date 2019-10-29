---
layout: article
title: "Redis Cheatsheet - Redis 知识点笔记整理"
date: 2019-08-29
modify_date: 2019-10-29
excerpt: "Redis Cheatsheet"
tags: [Redis, NoSQL]
key: redis-cheatsheet
---


# Redis Cheatsheet - Redis 知识点笔记整理


<div align="center">
  <img src="https://upload.wikimedia.org/wikipedia/en/thumb/6/6b/Redis_Logo.svg/1200px-Redis_Logo.svg.png" width="45%">
</div>


> Redis 脑图下载地址: [here](https://drive.google.com/drive/folders/1hIXhJMMCK2d6N6DYsz-Qi1YQpq34gBPX?usp=sharing).


## NoSQL 入门

1. 易扩展
   1. 种类多, 共同特征是 "去掉 RDBMS 中的 关系型特征"
   2. 数据间无关, 易扩展
2. 大数据量高性能
   1. 细粒度 Cache, 性能高于 RDBMS
3. 多样灵活的数据模型
   1. 增删字段非常麻烦



键值对存储, 列存储, 文档存储, 图形数据库



### 3V + 3高

- 3 V
  - Volume 海量
  - Variety 多样
  - Velocity 实时
- 3 高
  - 高并发
  - 高可扩
  - 高性能



### NoSQL 数据模型简介

#### 聚合模型

- KV 键值
- BSON
- 列族
- 图形



### NoSQL 数据库四大分类

#### KV 键值

- Redis
- Oracle BDB



#### 文档型数据库 (BSON)

- CouchDB
- MongoDB
  - 分布式文件存储数据库, C++
  - 介于 关系和非关系之间



#### 列存储数据库

- Cassandra
- HBase
- 分布式文件系统



#### 图关系数据库

- Neo4J
- InfoGrid

社交网络, 推荐系统 构建关系图谱


<div align="center">
  <img src="https://github.com/Zhenye-Na/Zhenye-Na.github.io/blob/master/assets/images/posts-img/redis-cheatsheet/nosql.png?raw=true" width="80%">
</div>




## 分布式数据库中的 CAP + BASE

### 传统的 ACID

#### A (Atomicity) 原子性

原子性整个事务中的所有操作，要么全部完成，要么全部不完成，不可能停滞在中间某个环节。事务在执行过程中发生错误，会被回滚（Rollback）到事务开始前的状态，就像这个事务从来没有执行过一样。

#### C (Consistency) 一致性

在事务开始之前和事务结束以后，数据库的完整性约束没有被破坏。

#### I (Isolation) 隔离性

两个事务的执行是互不干扰的，一个事务不可能看到其他事务运行时，中间某一时刻的数据。

#### D (Durability) 持久性

在事务完成以后，该事务所对数据库所作的更改便持久的保存在数据库之中，并不会被回滚。



### CAP

- Consistency 一致性
- Availability 可用性
- Partition tolerance 分区容错性



CAP 最多只能同时较好地满足两个: 满足 CA 原则 **或** 满足 CP 原则 **或** 满足 AP 原则



- CA: 单点集群, 满足一致性, 可用性的系统, 通常在可扩展性上不太强大
- CP: 满足一致性, 分区容忍性, 通常性能不是很高
- AP: 满足可用性, 分区容忍性, 通常可能对一致性要求低一些



<div align="center">
  <img src="https://www.researchgate.net/profile/David_Lee297/publication/323309389/figure/fig2/AS:596430729261057@1519211575897/CAP-theorem-concept-5-II-WHY-YOU-NEED-NOSQL-The-first-reason-to-use-NoSQL-is-because.png" width="80%">
</div>



**分区容错性是必须要实现的**

所以只能在<u>一致性</u>和<u>可用性</u>间进行权衡, 没有 NoSQL 能同时保证 3 点



- CA: 传统 Oracle, RDBMS...
- CP: Redis, MongoDB



### BASE

- Basically Available
- Soft state
- Eventually consistent



> 牺牲 C 换取 AP



### 分布式与集群 (简介)

- 分布式: 不同的多台服务器部署<u>不同</u>的服务模块
- 集群: 不同的多台服务器上面部署<u>相同</u>的服务模块



## Redis

Redis: **Re**mote **Di**ctionary **S**erver

三个特点:

- Redis 支持数据持久化. 可以将内存中的数据保持在磁盘中, 重启后可再次使用
- Redis 支持 `key-val`, `list`, `set`, `zset`, `hash` 等数据结构存储
- Redis 支持数据备份, master-slave 模式数据备份



**零碎基础知识**

1. 单进程 (*) 单进程处理客户端的请求, 对读写事件响应是通过 `epoll` 函数而包装来操作. Redis 实际处理速度完全依靠<u>主进程</u>执行效率
2. 默认 `16` 个数据库, 类似数组下标从 `0` 开始, 初始默认使用 `0` 号库
3. `select` 切换数据库
4. `dbsize` 查看当前数据库的 `key` 的数量
5. `flushdb` 清空当前数据库
6. `flushall` 删全部库
7. 统一密码管理, `16` 个库同一个密码
8. Redis 索引是从 `0` 开始
9. 默认端口 `6379`



## Redis 数据类型

### 五大数据类型

1. String (字符串)
2. Hash (哈希, 类似 Java HashMap)
3. List (列表)
4. Set (集合)
5. Zset (Sorted Set: 有序集合)



**String (字符串)**

1. 一个 `key` 对应一个 `value`
2. 二进制安全. 可以包含任何数据, 包括图片或者序列化对象
3. `value` 最多可以是 512M



**Hash**

1. string 类型的 `field` 和 `value` 的映射表



**List (列表)**

1. 底层是一个**链表**
2. 按照插入顺序排序, 可以在头部或者尾部插入数据



**Set**

1. string 类型的无序集合, 是通过 HashTable 实现的



**Zset (Sorted Set)**

1. string 类型的集合
2. 与 Set 不同的是: 每个元素都会关联一个 double 类型的分数
3. Redis 通过分数来为集合中的成员进行从小到大排序
4. zset 成员唯一, 但是分数 (score) 可以重复!



### Redis 键 (key)

```
key *

# 判断某个 key 是否存在
exists key

# 将 key 移动到另一个库
move key db

# 给 key 设置过期时间
expire key

# 查看还有多长时间 key 过期, -1 表示永不过期, -2 表示已经过期
ttl key

# 查看 key 是什么类型
type key

get k1

# 有对应的键值, 覆盖 value
set k1 v1

# 删除 key
del key
```



### Redis 字符串 (String)

单值单value

```
set / get / del / append / strlen
incr / decr / incrby / decrby

# 获取指定区间范围的值
getrange key 0 -1

# 范围内设置值 (结果 key 对应的 value 以 'xxx'开头)
setrange key 0 xxx

# 设置过期时间
setex

# set if not exist
setnx

# 设置 / 获取 多个键值对
mset / mget / msetnx
```



### Redis 列表 (List)

单值多 value

```
lpush / rpush / lrange

lpop / rpop

# 按照索引下标获得元素 (从上到下)
lindex

llen

# 删除 n 个 val
lrem key n val

# 截取指定范围的值然后再赋值给 key
ltrim key index1 index 2

# 源列表 -> 目标列表
rpoplpush list1 list2

lset key index value

linsert key before/after val1 val2
```

性能总结

1. 是一个字符串链表, left, right 都可以插入添加
2. 如果键不存在, 创建新的链表
3. 如果键已存在, 新增内容
4. 如果值完全移除, 对应的键也就消失了
5. 链表操作头尾效率很高, 中间元素效率不高



### Redis 集合 (Set)

单值多 value

```
sadd / smembers / sismembers

# 获取集合里元素个数
scard

# 删除集合中元素
srem key value

srandmember key 某个整数

# 随机 pop 元素
spop key

# 将 key1 里的某个值赋值给 key2
smove set01 set02 5

# 差集 / 交集 / 并集
sdiff / sinter / sunion
```



### Redis 哈希 (Hash)

KV 模式不变, 但 V 是一个键值对

```
hset / hget / hmset / hmget / hgetall / hdel

hlen

# 在 key 里面的某个值的 key
hexists key

hkeys / hvals

hincrby / hincrbyfloat

hsetnx
```



### Redis 有序集合 (Zset)

```
zadd / zrange (withscores)

# 开始 score1 结束 score2
zrangebyscore key score1 score2
	withscore
	'(' 不包含
	limit 开始下标步, 多少步

# 删除元素
zrem key 某 score 下对应的 value

zcard / zcount key <score_range> / zrank key values
```



## Redis 持久化 (Persistence)

之前我们提到过 Redis 是一个 key-value 的内存 NoSQL 数据库, 所有的数据都保存在数据库里

对于只把 `Redis` 当缓存来用的项目来说，数据消失或许问题不大，重新从数据源把数据加载进来就可以了，但如果直接把用户提交的业务数据存储在 `Redis` 当中，把`Redis`作为数据库来使用，在其放存储重要业务数据，那么`Redis`的内存数据丢失所造成的影响也许是毁灭性。

为了避免内存中数据丢失，`Redis`提供了对持久化的支持，我们可以选择不同的方式将数据从内存中保存到硬盘当中，使数据可以持久化保存。




### RDB (Redis Database)

#### 简介

1. 在指定的时间间隔内将内存中的数据集快照写入磁盘, 也就是 Snapshot 快照, 恢复时将快照文件直接读到内存中

2. Redis 会单独创建 (fork) 一个子进程来进行持久化, 会将数据写入到一个**临时文件**中, 待持久化过程结束, **再用这个临时文件替换上次持久化好的文件**.

3. 整个过程, 主进程没有 IO 操作

4. 如果需要进行大规模数据恢复, 且对于数据恢复的完整性不敏感. RDB > AOF. 但是 RDB 缺点是<u>最后一次持久化后的数据可能会丢失</u>



#### Fork

**复制一个与当前进程一样的进程**, 新进程所有数值和原进程一致



#### DB File

- RDB 保存的是 `dump.rdb` 文件

- `save <seconds> <changes>` xx 秒内 key 有xx次更改, 就保存 DB 到 Disk

- 如果 `SHUTDOWN` 也会立即生成一个 `dump.rdb` 

- 冷拷贝方便使用

- 停止保存 `save ""`



#### Snapshot 快照

1. `SAVE`: save 只管保存, 其他的不管, 全部阻塞
2. `BGSAVE`: Redis 会在后台**异步**进行快照操作, 快照同时还可以响应客户端请求, 可以通过 lastsave 命令获取最后一次成功执行快照的时间
3. 执行 `FLUSHALL` 也会生成 `dump.rdb` 但是是空的



#### 优势

- 适合大规模的数据恢复
- 对数据完整性和一致性要求不高
- 与 AOF 方式相比，通过 RDB 文件恢复数据比较快。
- RDB 文件非常紧凑，适合于数据备份。
- 通过 RDB 进行数据备，由于使用**子进程**生成，所以对 Redis 服务器性能影响较小



#### 劣势

- 在一定时间间隔做一次备份, 如果 Redis 意外 Shutdown, 就会丢失最后一次快照后的所有修改
- Fork 的时候, 内存中的数据克隆了一份, 2倍膨胀性
- 使用 `save` 命令会造成服务器阻塞，直接数据同步完成才能接收后续请求。
- 使用 `bgsave` 命令在 forks子进程时，如果数据量太大，forks 的过程也会发生阻塞，另外，forks 子进程会耗费内存


<div align="center">
  <img src="https://github.com/Zhenye-Na/Zhenye-Na.github.io/blob/master/assets/images/posts-img/redis-cheatsheet/rdb.png?raw=true" width="80%">
</div>



### AOF (Append Only File)

#### 简介

**以日志的形式来记录每个写操作**, 将 Redis 执行过的所有写指令记录下来 (读操作不记录) 只许追加文件但不可以改写文件, Redis 启动之初会读取改文件重新创建数据.



#### 保存文件

- `appendfilename = appendonly.aof`
- `APPEND ONLY MODE` - good enough
- 如果既有 `dump.rdb` 又有 `appendonly.aof`, 可以和平共存, 先加载 `appendonly.aof` (with better durability guarantees)
- `Appendfsync` : `default` 是 `Everysec`异步操作, 每秒记录, `Always` 同步持久化



#### Rewrite 重写机制

##### 简介

AOF 采用文件追加方式, 文件会越拉越大为避免出现此种情况, 新增**重写机制**, 当 AOF 文件大小超过设定的阈值, Redis 就会情动 AOF 文件内容压缩, 只保留可以恢复数据的最小指令集, 可以使用命令 `bgrewriteaof`



##### 重写原理

AOF 文件大小增长而过大时, 会 fork 出一条**新进程**来将文件重写, 也是先写临时文件然后 `rename`, 遍历新进程的内存中的数据. AOF 重写方式也是**异步**操作



##### 触发机制

Redis 会记录上次重写时的 AOF 大小, 默认配置是当 AOF 文件大小是**上次 rewrite 后大小的一倍**<u>并且</u>**文件大于 64MB** 触发



#### 优势

1. AOF 只是追加日志文件，因此对<u>服务器性能影响较小，速度比 RDB 要快，消耗的内存较少</u>
2. 每秒同步: `appendfsync always` 同步持久化, 每次发生数据变更会被立即记录到磁盘 性能较差但是完整性好
3. 每修改同步: `appendfsync everysec` 异步操作, 每秒记录, 如果一秒内宕机, 有数据丢失
4. 不同步: `appendfsync no`



#### 劣势

1. 相同数据集的数据而言 aof 文件要大于 rdb 文件, 恢复速度慢于 rdb
2. aof 运行效率慢于 rdb, 同步策略效率较好, 不同步效率和 rdb 相同


<div align="center">
  <img src="https://github.com/Zhenye-Na/Zhenye-Na.github.io/blob/master/assets/images/posts-img/redis-cheatsheet/aof.png?raw=true" width="80%">
</div>




### 总结

1. RDB 持久化方式能够在<u>指定的时间间隔</u>能付InIDE数据进行快照存储
2. AOF 持久化方式记录每次对服务器写的操作, 当服务器重启的时候会重新执行这些命令来恢复原始的数据, AOF 命令以 Redis 协议追加保存每次写的操作到文件末尾
3. Redis 还能对 AOF 文件进行后台重写, 使得文件体积不至于过大
4. <u>只做缓存</u>: 如果只希望你的数据在服务器运行的时候存在, 可以<u>不</u>使用持久化方式
5. 同时开启两种持久化方式
   1. Redis 重启的时候会**优先载入 AOF 文件**来回复原始的数据, 因为通常情况下, AOF 保存的数据更完整
   2. RDB 数据不实, 同时使用两者时服务器重启也只会找 AOF 文件. 



通过上面的介绍，我们了解了RDB与AOF各自的优点与缺点，到底要如何选择呢？

通过下面的表示，我们可以从几个方面对比一下RDB与AOF,在应用时，要根本自己的实际需求，选择RDB或者AOF，其实，如果想要数据足够安全，可以两种方式都开启，但两种持久化方式同时进行IO操作，会严重影响服务器性能，因此有时候不得不做出选择。



<div align="center">
  <img src="" width="80%">
  <p>图片转载自: https://juejin.im/post/5d09a9ff51882577eb133aa9#heading-21</p>
</div>



当 RDB 与 AOF 两种方式都开启时，Redis会优先使用AOF日志来恢复数据，因为AOF保存的文件比RDB文件更完整。



## Redis 事务

**可以一次执行多个命令**, 本质是<u>一组命令的集合</u>, 一个事务中的所有命令都会序列化, 按顺序的串行化执行而不会被其他的命令插入 (不许加塞)



一个队列中, 一次性, 顺序性, 排他性的执行一系列命令



1. 正常执行
2. 放弃事务
3. "全体连坐"
4. "冤头债主"
5. watch 监控
   1. 悲观锁: 并发性差, 一致性很好. 锁住整张表
   2. 乐观锁: 并发性可以. 每一行会有一个 `version` 值
   3. 先开启监控 `WATCH` 再开启 `MULTI` , 保证两笔金额变动在同一个事务内



`WATCH` 指令, 类似于乐观锁, 事务提交时, 如果 Key 已经被其他的客户端改变, 整个事务队列不会执行

通过 `WATCH` 命令在事务执行之前监控了多个 Keys, 倘若在`WATCH` 之后有任何 Key 的值发生了变化, `EXEC` 命令执行的事物都将被放弃, 同时返回 `Nullmulti-bulk` 应答以通知调用者事务执行失败



### 三个阶段

1. 开启: 以 `MULTI` 开始一个事务
2. 入队: 将多个命令入队到事务中, 接到这些命令并不会立即执行, 而是放到等待执行的事务队列里面
3. 执行: 由 `EXEC` 命令触发事务



### 特性

1. **单独的隔离操作**: 事务中的所有命令都会序列化, 按顺序的执行. 事务在执行的过程中, 不会被其他客户端发送来的命令请求所打断
2. **没有隔离级别的概念**: 队列中的命令没有提交之前都不会实际的执行, 因为事务提交之前任何指令都不会被实际执行, 也就不存在"事务内的查询要看到事务里的更新, 在事务外查询不能看到"的问题
3. **不保证原子性**: Redis 同一个事务中如果有一条命令执行失败, 其后的命令仍然会被执行, 没有回滚



## Redis 的发布订阅机制

### 简介

进程间的一种消息通信模式: 发送者 (Pub) 发送消息, 订阅者 (Sub) 接收消息

<div align="center">
  <img src="https://images2015.cnblogs.com/blog/1150339/201706/1150339-20170603142940305-1275821767.png" width="70%">
</div>



先订阅后发布才能收到消息

1. 可以一次性订阅多个, `SUBSCRIBE c1 c2 c3`
2. 消息发布, `PUBLISH c2 hello-redis`
3. 订阅多个, 通配符 `*` , `PSUBSCRIBE news*`
4. 收取消息, `PUBLISH new1 redis2019`



## Redis 主从复制 (Master / Slave)

### 简介

主机数据更新后根据配置和策略, 自动同步到备份机的 master / slave 机制. Master 以写为主, Slave 以读为主



1. 读写分离
2. 容灾恢复



### 如何使用

1. 配置从库, 不配置主库
2. 从库配置: slaveof 主库 IP 主库端口, e.g. `SLAVEOF 127.0.0.1 6379`
   1. <u>每次与 Master 断开后, 都需要重新连接</u>, 除非你配置进 `redis.conf` 文件
   2. `info replication`
3. 修改配置文件细节操作
   1. 拷贝多份 `redis.conf` 文件
   2. 开启 `daemonize yes`
   3. Pid 文件名
   4. 指定端口
   5. Log 文件名
   6. `dump.rdb` 文件名
4. 常用
   1. "一主二仆"
      1. 一个 Master, 两个 Slave
   2. "薪火相传"
      1. De-centralized
      2. 一台机器既是 master 又是 slave
   3. "反客为主"
      1. `SLAVEOF no one` 使当前数据库停止与其他数据库的同步, 转成数据库



### 复制原理

1. Slave 启动成功连接到 Master 后会发送一个 Sync 命令
2. Master 接到命令启动后台的存盘进程, 同时收集所有接收到的用于修改数据的命令
3. **全量复制**: Slave 服务在接收到数据库文件数据后, 将其存盘并加载到内存中
4. **增量复制**: Master 继续将新的所有收集到的修改命令依次传给 Slave 完成同步. 但是只要是重新连接 Master, 一次完全同步 (全量复制) 将被自动执行 



### 哨兵模式 (Sentinel)

#### 简介

Redis-Sentinel 是官方推荐的高可用解决方案，当 redis 在做 master-slave 的高可用方案时，假如 master 宕机了，redis 本身（以及其很多客户端）都没有实现自动进行主备切换，而redis-sentinel本身也是独立运行的进程，可以部署在其他与redis集群可通讯的机器中监控 redis 集群。

#### 它的主要功能有一下几点

1. 不时地监控redis是否按照预期良好地运行;
2. 如果发现某个redis节点运行出现状况，能够通知另外一个进程(例如它的客户端);
3. 能够进行自动切换。当一个master节点不可用时，能够选举出master的多个slave(如果有超过一个slave的话)中的一个来作为新的master,其它的slave节点会将它所追随的master的地址改为被提升为master的slave的新地址。
4. 哨兵为客户端提供服务发现，客户端链接哨兵，哨兵提供当前master的地址然后提供服务，如果出现切换，也就是master挂了，哨兵会提供客户端一个新地址。



#### 哨兵（sentinel）本身也是支持集群的

很显然，单个哨兵会存在自己挂掉而无法监控整个集群的问题，所以哨兵也是支持集群的，我们通常用三台哨兵机器来监控一组redis集群。



## 面试题目

**Redis有哪些数据结构？**

字符串String、字典Hash、列表List、集合Set、有序集合SortedSet。

如果你是Redis中高级用户，还需要加上下面几种数据结构HyperLogLog、Geo、Pub/Sub。

如果你说还玩过Redis Module，像BloomFilter，RedisSearch，Redis-ML，面试官得眼睛就开始发亮了。

**使用过Redis分布式锁么，它是什么回事？**

先拿setnx来争抢锁，抢到之后，再用expire给锁加一个过期时间防止锁忘记了释放。

这时候对方会告诉你说你回答得不错，然后接着问如果在setnx之后执行expire之前进程意外crash或者要重启维护了，那会怎么样？

这时候你要给予惊讶的反馈：唉，是喔，这个锁就永远得不到释放了。

紧接着你需要抓一抓自己得脑袋，故作思考片刻，好像接下来的结果是你主动思考出来的

然后回答：我记得set指令有非常复杂的参数，这个应该是可以同时把setnx和expire合成一条指令来用的！

对方这时会显露笑容，心里开始默念：摁，这小子还不错。

**假如Redis里面有1亿个key，其中有10w个key是以某个固定的已知的前缀开头的，如果将它们全部找出来？**

使用keys指令可以扫出指定模式的key列表。

对方接着追问：如果这个redis正在给线上的业务提供服务，那使用keys指令会有什么问题？

这个时候你要回答redis关键的一个特性：redis的单线程的。keys指令会导致线程阻塞一段时间，线上服务会停顿，直到指令执行完毕，服务才能恢复。

这个时候可以使用scan指令，scan指令可以无阻塞的提取出指定模式的key列表，但是会有一定的重复概率，在客户端做一次去重就可以了，但是整体所花费的时间会比直接用keys指令长。

**使用过Redis做异步队列么，你是怎么用的？**

一般使用list结构作为队列，rpush生产消息，lpop消费消息。当lpop没有消息的时候，要适当sleep一会再重试。

如果对方追问可不可以不用sleep呢？list还有个指令叫blpop，在没有消息的时候，它会阻塞住直到消息到来。

如果对方追问能不能生产一次消费多次呢？使用pub/sub主题订阅者模式，可以实现1:N的消息队列。

如果对方追问pub/sub有什么缺点？在消费者下线的情况下，生产的消息会丢失，得使用专业的消息队列如rabbitmq等。

如果对方追问redis如何实现延时队列？我估计现在你很想把面试官一棒打死如果你手上有一根棒球棍的话，怎么问的这么详细。

但是你很克制，然后神态自若的回答道：使用sortedset，拿时间戳作为score，消息内容作为key调用zadd来生产消息，消费者用zrangebyscore指令获取N秒之前的数据轮询进行处理。

到这里，面试官暗地里已经对你竖起了大拇指。但是他不知道的是此刻你却竖起了中指，在椅子背后。

**如果有大量的key需要设置同一时间过期，一般需要注意什么？**

如果大量的key过期时间设置的过于集中，到过期的那个时间点，redis可能会出现短暂的卡顿现象。一般需要在时间上加一个随机值，使得过期时间分散一些。

**Redis如何做持久化的？**

bgsave做镜像全量持久化，aof做增量持久化。

因为bgsave会耗费较长时间，不够实时，在停机的时候会导致大量丢失数据，所以需要aof来配合使用。

在redis实例重启时，会使用bgsave持久化文件重新构建内存，再使用aof重放近期的操作指令来实现完整恢复重启之前的状态。

对方追问那如果突然机器掉电会怎样？取决于aof日志sync属性的配置，如果不要求性能，在每条写指令时都sync一下磁盘，就不会丢失数据。

但是在高性能的要求下每次都sync是不现实的，一般都使用定时sync，比如1s1次，这个时候最多就会丢失1s的数据。

对方追问bgsave的原理是什么？你给出两个词汇就可以了，fork和cow。

fork是指redis通过创建子进程来进行bgsave操作，cow指的是copy on write，子进程创建后，父子进程共享数据段，父进程继续提供读写服务，写脏的页面数据会逐渐和子进程分离开来。

**Pipeline有什么好处，为什么要用pipeline？**

可以将多次IO往返的时间缩减为一次，前提是pipeline执行的指令之间没有因果相关性。

使用redis-benchmark进行压测的时候可以发现影响redis的QPS峰值的一个重要因素是pipeline批次指令的数目。

**Redis的同步机制了解么？**

Redis可以使用主从同步，从从同步。

第一次同步时，主节点做一次bgsave，并同时将后续修改操作记录到内存buffer，待完成后将rdb文件全量同步到复制节点，复制节点接受完成后将rdb镜像加载到内存。

加载完成后，再通知主节点将期间修改的操作记录同步到复制节点进行重放就完成了同步过程。

**是否使用过Redis集群，集群的原理是什么？**

Redis Sentinal着眼于高可用，在master宕机时会自动将slave提升为master，继续提供服务。

Redis Cluster着眼于扩展性，在单个redis内存不足时，使用Cluster进行分片存储。



## References

1. [张君鸿](https://juejin.im/user/5c6665476fb9a049a81fd8e9), [10 分钟彻底理解 Redis 的持久化机制: RDB 和 AOF](https://juejin.im/post/5d09a9ff51882577eb133aa9)
2. 尚硅谷 Redis 教程
3. 



