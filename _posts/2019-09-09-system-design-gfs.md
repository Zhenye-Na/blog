---
layout: article
title: "系统设计 - 以 GFS 为例探索分布式文件系统"
date: 2019-09-09
modify_date: 2019-09-09
excerpt: "System Design - Google File System"
tags: [System Design, News Feed System]
key: system-design-gfs
---


# 系统设计 - 以 GFS 为例探索分布式文件系统

> 什么是分布式文件系统?
>
> 用多台机器解决一台机器不能解决的问题。比如存储不够？QPS太大？



**谷歌三剑客**

- 分布式文件系统
  - 怎么有效存储数据？
  - NoSQL底层需要一个文件系统
- Map Reduce
  - 怎么快速处理系统？
- Big table: No-SQL Database
  - 怎么连接底层存储和上层数据



本节课内容：

- Master Slave Pattern
- How to check and handle system failure and error
- How to design Distributed File System



## 1. 4S 分析法

- Scenario 场景分析
- Service 服务
- Storage 存储
- Scale 升级优化



### 1.1. 场景分析

Chrome 连着 Webserver, Webserver 连 DB，DB 会直接跟 GFS 连接

![img](/Users/macbookpro/Desktop/zhenye-na.github.io /_posts/assets/2018-03-08-21-14-10.png)



**功能设计**

- 需求1: <u>读写</u>
  - 用户读写文件
  - 支持多大的文件？比如 > 1000T
- 需求2: <u>存储</u>
  - 多台机器存储这些文件



### 1.2. 服务

Client + Server

> Client 是什么? 
>
> 一般是 DB 或者 Web Server 但是一般是相对的, user 相对 browser 就是 client, 但是 browser 相对 web server 就是 client



但是一般考虑要多台 Server 联动, 有两种 Server 之间相互沟通的方式

1. peer to peer

   1. 多台 Server 相互连接
   2. ![peer-to-peer](/Users/macbookpro/Desktop/zhenye-na.github.io /_posts/assets/peer-to-peer.png)
   3. 优点：如果一个挂了，其它的没事
   4. 缺点：数据同步问题很麻烦！他是通过<u>一致哈希算法</u>实现的。要不停地相互同步，很麻烦的。

   不是课程重点，考察较少（例BitComet, Cassandra）

2. master slave

   1. 一台主机, 多台附属机
   2. master: 存储数据, 管理层
   3. slave: 备份, 存储实际文件, partition 关系
   4. 优点：同步问题全部交给master，数据容易保持一致；比较好设计
   5. 缺点：万一一个挂了，就gg
   6. ![master-slave](/Users/macbookpro/Desktop/zhenye-na.github.io /_posts/assets/master-slave.png)



### 1.3. 存储

大文件存储在 - 文件系统

Metadata - 元数据 - 描述"其他数据"而存储的信息

Metadata 的访问往往多于 内容的访问



![img](/Users/macbookpro/Desktop/zhenye-na.github.io /_posts/assets/2018-03-08-21-48-47-20190910003810884.png)





**metadata和文件内容应该存在一起还是分开存？**

其实应该分开存。这样在看目录的时候，就不用每次都把硬盘里的东西读出来了。只需要把metadata的内容放到内存里面以供显示。



**文件是分成小块存储还是存成一大片？**

Windows连续，Linux分开存

连续存储带来的问题在于，存储空间会非常分散。这样的话就需要定期进行磁盘碎片整理。

分开存储就不会带来这么多碎片。但是还需要维护每一小块存在哪里。





**问题又来了，一台机器存不下？**

Master-slave模式

Master管理metaDta，Slave管理数据



**每个chunk的Offset偏移量可不可以不存在master上面？**

[![img](/Users/macbookpro/Desktop/zhenye-na.github.io /_posts/assets/2018-03-08-22-06-18.png)](http://jiayi797.oss-cn-beijing.aliyuncs.com/2018-03-08-22-06-18.png)

只需要知道哪个chunk在哪个机器上面即可，然后每个机器根据索引再去查询

这样做的好处是:

<u>master存储量减少；master想修改的时候方便得很</u>



**问题：master的内存存的下10P文件的metadata吗？**

1chunk = 64b

10P = 10X10^6 = 10G ， 完全可以



## 2. A working solution

### 2.1. 写入

**1. 写文件时，是一次写入还是分成多份写入？**

分析：

- 写入过程出错了？
  - 如果是一次写入，就要重新写一次
  - 如果是<u>多份多次写入，就只用重传一份</u>
- 如果多份多次写入，那么每一份的大小？
  - 既然文件按照chunk，那就按照chunk
- 如果多份多次写入，是由master切分呢，还是client切分？
  - 其实是client按照自己的文件大小切分 (理解成切分完事了再上传)
  - 比如 `/gfs/home/dengchao.mp4` `size = 576M`. 那么可以切分问 576M/64M = 9个chunk
  - 每一份 chunk 放在一个 index 里, 分开写入



**每一个 chunk 是如何写入 chunk server**

>  是直接写入chunk server ? 还是需要master沟通，再写入chunk server?
>
> 答案: 直接写入的



![img](/Users/macbookpro/Desktop/zhenye-na.github.io /_posts/assets/2018-03-08-22-37-21-20190910005413448.png)



1. client先告诉master要写入的chunk 和idx
2. master告诉client应该写入几号机器
3. master去写入chunkserver
4. chunkserver告诉master写好了

**要修改Dengchao.mp4怎么办？**
对于/gfs/home/dengchao.mp4，需要解决以下问题：

- 要修改的部分在哪个chunk？
- 修改了过后chunk变大了要怎么处理？
- 修改了过后chunk变小了要怎么处理？

修改假设有以下几种方式：

- 方式1 ： 直接修改
- 方式2：先把这一快读入内存，再写回去
- 方式3：先把这一块读入内存，再写到其它地方

分析：

- 方式1：不行的
- 方式2：修改了过后chunk变大了就放不下了
- 方式3：可以的



### 2.2. 读取

如何读取文件？

**一次读整个文件？还是拆分成多份多次读入？**

[![img](/Users/macbookpro/Desktop/zhenye-na.github.io /_posts/assets/2018-03-08-22-43-48.png)](http://jiayi797.oss-cn-beijing.aliyuncs.com/2018-03-08-22-43-48.png)



> 那么另一个client想读的时候，他怎么知道，`dengchao.mp4` 被切成了多少块
>
> 从 master 得知



[![img](/Users/macbookpro/Desktop/zhenye-na.github.io /_posts/assets/2018-03-08-22-44-38.png)](http://jiayi797.oss-cn-beijing.aliyuncs.com/2018-03-08-22-44-38.png)

1. client 告诉 master 他要读谁
2. master 告诉 client 一个 chunk list
3. master 去 chunk server 读



**Master 的主要任务**

- 存储各个文件数据的 metadata
  - 存储 Map(file name + chunk index -> chunk server)
  - 读取时找到对应的 chunkserver
- 写入时分配空闲的 chunkserver



**为什么不把数据直接给 master 让 master 去写？**

Master bottleneck ，这样对于master来说太累了



In summary

- 存储
  - 普通文件系统 Meta Data，Block
  - 大文件存储： Block-> Chunk
  - 多台机器超大文件: Chunk Server + Master
- 写入
  - Master+Client+ChunkServer 沟通流程
  - Master 维护metadata 和 chunkserver 表
- 读出
  - Master+Client+ChunkServer 沟通流程



## 3. Scale

### 3.1. 单Master

工业界90%的系统都采用单master
Simple is perfect



**单Master挂了怎么办**

- Double Master
  Paper: Apache Hadoop Goes Realtime at Facebook
- Multi Master
  Paper: Paxos Algorithm (Paxos 协议)



### 3.2. 挂了和恢复方法



**How to identify whether a chunk on the disk is broken?, 如何验证 chunk 是不是坏了?** 



`CheckSum` 是由每个二进制异或得到的。这种方式只能检测一位错误

[![img](/Users/macbookpro/Desktop/zhenye-na.github.io /_posts/assets/2018-03-08-22-51-05.png)](http://jiayi797.oss-cn-beijing.aliyuncs.com/2018-03-08-22-51-05.png)

- CheckSum Method (MD5, SHA1, SHA256 and SHA512)
- Read More: https://en.wikipedia.org/wiki/Checksum



一个CheckSum大小为4byte = 32bit

而一个chunk = 64MB, 每一个chunk有一个CheckSum。1P的文件的CheckSum大小大约为1P/64MB*32bit = 62.5M



**什么时候写入CheckSum**

写 chunk 顺便写入 checkSum 的值



**什么时候检查checksum?**

读入这一块数据的时候检查

1. 重新读数据并且计算现在的checksum
2. 比较现在的checksum和之前存的checksum是否一样



**那么如何避免万一坏了之后，数据丢失呢？**

Replica 备份, 一般可以备份3份。如果某个坏了，就去询问master

[![img](/Users/macbookpro/Desktop/zhenye-na.github.io /_posts/assets/2018-03-08-22-58-35.png)](http://jiayi797.oss-cn-beijing.aliyuncs.com/2018-03-08-22-58-35.png)



备份有几种方式：

1. 三个备份都放在一个地方(加州)。 —— 不好。太危险
2. 三个备份放在三个相隔较远的地方（加州，滨州，纽约州）—— 太分散，不好通信
3. <u>两个备份相对比较近，另一个放在较远的地方</u>（2个加州，1个滨州） —— 挺好



> **如何发现一个chunkServer坏了呢？**
>
> HeartBeat, 由 ChunkServer 主动向 Master 发送 HeartBeat, 如果一段时间内 Master 收不到 HeartBeat, 就默认挂了



### 3.3. 如何写多份?



[![img](/Users/macbookpro/Desktop/zhenye-na.github.io /_posts/assets/2018-03-08-23-00-18.png)](http://jiayi797.oss-cn-beijing.aliyuncs.com/2018-03-08-23-00-18.png)



但这种方式对于client来说太慢了，因此优化一下:

选出一个带头的, 上传给他之后, 由他传给其他的 ChunkServer

[![img](/Users/macbookpro/Desktop/zhenye-na.github.io /_posts/assets/2018-03-08-23-00-59.png)](http://jiayi797.oss-cn-beijing.aliyuncs.com/2018-03-08-23-00-59.png)



**选chunk server的时候有什么策略？**

1. 最近写入比较少的。(LRU)
2. 硬盘存储比较低的。



怎么样选队长?

1. 找距离最近的（快）
2. 找现在不干活的（平衡traffic）



**如果一个chunk server挂了怎么办**

[![img](/Users/macbookpro/Desktop/zhenye-na.github.io /_posts/assets/2018-03-08-23-01-56.png)](http://jiayi797.oss-cn-beijing.aliyuncs.com/2018-03-08-23-01-56.png)



## 总结 Summary

- Key Point: Master-Slave

- Storage:
  - Save a file in one machine -> a big file in one machine -> a extra big file in multi-machine

  - Multi-machine

    - How to use the master?

    - How to traffic and storage of master?

- Read:

  - The process of reading a file

- Write:
  - The process of writing a file

- How to reduce master traffic?
  - Client 和 Chunk Server沟通

- How to reduce client traffic?
  - Leader Election

- Failure and Recover (key)
  - Discover the failure a chunk?
    - Check Sum
  - Avoid the failure a chunk?
    - Replica
  - Recover the failure?
    - Ask master
  - Discover the failure of the chunkserver?
    - Heart Beat
  - Solve the failure of writing ChunkServer?
    - Retry