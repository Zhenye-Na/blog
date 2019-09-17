---
layout: article
title: "系统设计 - 一致性哈希算法与短网址系统"
date: 2019-09-09
modify_date: 2019-09-09
excerpt: "System Design - Consistent Hashing and Design Tiny Url"
tags: [System Design, Consistent Hashing, Design Tiny Url]
key: system-design-consistent-hashing-and-design-tiny-url
---

# 一致性哈希算法与短网址系统

**目录**

- Consistent Hashing
    - 简单的 Consistent Hashing 方法的回顾及缺陷分析
    - 一个更优的 Consistent Hashing 方法
- Replica
    - SQL 通常如何进行备份
    - NoSQL 通常如何进行备份？
- 设计一个短网址系统 Design Tiny Url
    - 4S 分析法
    - No Hire / Weak Hire / Hire / Strong Hire

## 一致性哈希算法

我们先来说说为什么要做 “一致性”Hash

- `% n` 的方法是一种最简单的 Hash 算法
- 但是这种方法在 `n` 变成 `n+1` 的时候，每个 `key % n` 和 `% (n+1)` 结果基本上都不一样
- 所以这个 Hash 算法可以称之为：不一致 hash

### 一种简单的一致性哈希算法

- 将 `key` 模一个很大的数，比如 `360`
- 将 `360` 分配给 `n` 台机器，每个机器负责一段区间
- 区间分配信息记录为一张表存在 Web Server 上
- 新加一台机器的时候，在表中选择一个位置插入，匀走相邻两台机器的一部分数据


**有什么缺点**

1. 数据分布不均匀, 比如从 3 台变成 4 台, 数据的分布不均匀
2. 老数据库迁移压力比较大, 因为新加进来的数据库的数据只能从老数据库拿到


### 更实用的 Consistent Hashing 算法

- 将整个 Hash 区间看做环
- 这个环的大小从 $0 \sim 359$ 变为 $0 \sim 2^{64} -1$
- 将机器和数据都看做环上的点
- 引入 Micro shards / Virtual nodes 的概念
    - 一台实体机器对应 1000 个 Micro shards / Virtual nodes
- 每个 virtual node 对应 Hash 环上的一个点
- 每新加入一台机器，就在环上随机撒 1000 个点作为 virtual nodes
- 需要计算某个 key 所在服务器时
- 计算该 key 的 hash 值 —— 得到 $0 \sim 2^{64} -1$ 的一个数，对应环上一个点
- **顺时针**找到第一个 virtual node
- 该 virtual node 所在机器就是该 key 所在的数据库服务器
- 新加入一台机器做数据迁移时
    - 1000 个 virtual nodes **各自向顺时针的一个** virtual node 要数据
    - 例子：http://www.jiuzhang.com/qa/2067/

用到的数据结构: **TreeMap** (Logn 时间取出比x大的最小的值)

## 数据库 Backup 和 Replica

### Backup 和 Replica 区别

**Backup**

- 一般是_周期性_的，比如每天晚上进行一次备份
- 当数据丢失的时候，通常_只能恢复到之前的某个时间点_
- Backup _不用作在线的数据服务_，不分摊读操作

**Replica**

- 是_实时_的， 在数据写入的时候，就会以复制品的形式存为多份
- 当数据丢失的时候，可以马上通过其他的复制品恢复
- Replica _用作在线的数据服务_，分摊读操作


### MySQL 中的 Replica

MySQL (SQL 型数据库) 一般自带 Master-Slave 模式的 replica 服务

(主从复制, 读写分离)

- Master 负责写操作, Slave 负责读操作
- Slave 去跟 Master 保持数据一致

#### Master - Slave

原理 **Write Ahead Log**

- SQL 数据库的任何操作，都会以 Log 的形式做一份记录
- 比如数据 A 在 B 时刻从 C 改到了 D
- Slave 被激活后，告诉 Master 我在了

Master

- Master 每次有任何操作就通知 slave 来读 log
- 因此 Slave 上的数据是有"延迟"的
- Master 挂了怎么办？
    - 将一台 Slave 升级 (promote) 为 Master，接受读+写
    - 可能会造成一定程度的数据丢失和不一致


### NoSQL 中的 Replica

以 Cassandra 为代表的 NoSQL 数据库 通常将数据"顺时针"存储在 Consistent hashing 环上的三个 virtual nodes 中


### 小总结

SQL

- "自带" 的 Replica 方式是 Master Slave
- "手动" 的 Replica 方式也可以在 Consistent Hashing 环上顺时针存三份

NoSQL

- "自带" 的 Replica 方式就是 Consistent Hashing 环上顺时针存三份
- "手动" 的 Replica 方式：就不需要手动了，NoSQL就是在 Sharding 和 Replica 上帮你偷懒用的！



## 短网址系统 (Tiny Url)

以下几个是误区

- 系统一定巨大无比 (?)
- 必须用NoSQL (?)
- 必须是分布式 (?)

**分析过程**

提问：分析功能/需求/QPS/存储容量——Scenario
画图：根据分析结果设计“可行解”—— Service + Storage
进化：研究可能遇到的问题，优化系统 —— Scale


### Scenario 场景

#### 需要设计什么

- 根据 Long URL 生成一个 Short URL
- 根据 Short URL 还原 Long URL，并跳转

#### QPS + Storage

- 1. 询问面试官微博日活跃用户
    - 约100M
- 2. 推算产生一条Tiny URL的QPS
    - 假设每个用户平均每天发 0.1 条带 URL 的微博
    - Average Write QPS = 100M * 0.1 / 86400 ~ 100
    - Peak Write QPS = 100 * 2 = 200
    - **2k QPS 一台 SSD支持 的MySQL完全可以搞定**
- 3. 推算点击一条Tiny URL的QPS
    - 假设每个用户平均点 1 个Tiny URL
    - Average Read QPS = 100M * 1 / 86400 ~ 1k
    - Peak Read QPS = 2k
- 4. 推算每天产生的新的 URL 所占存储
    - 100M * 0.1 ~ 10M 条
    - 每一条 URL 长度平均 100 算，一共1G
    - 1T 的硬盘可以用 3 年


### Service 服务

只需要一个服务 `UrlService`


- 函数设计
    - `UrlService.encode(long_url)`
    - `UrlService.decode(short_url)`
- 访问端口设计
    - `GET /<short_url>`
        - return a Http **redirect** response
    - `POST /data/shorten/`
        - Data = {url: http://xxxx }
        - Return short_url


这里补充一下 Http Status Code 302

```
# Client request:
GET /index.html HTTP/1.1
Host: www.example.com


# Server response:
HTTP/1.1 302 Found
Location: http://www.iana.org/domains/example/
```


### Storage 数据存取

数据如何存储与访问

- 选择存储结构
- 细化数据表


#### 选择存储结构

##### SQL vs NoSQL

**大体分析**

- 是否需要支持 Transaction（事务）？
    - NoSQL **不支持** Transaction
- 是否需要丰富的 SQL Query？
    - NoSQL 的 SQL Query 不是太丰富
    - 也有一些 NoSQL 的数据库提供简单的 SQL Query 支持
- 是否想偷懒？
    - 大多数 Web Framework 与 SQL 数据库兼容得很好
    - 用 SQL 比用 NoSQL 少写很多代码
- 是否需要 Sequential ID？
    - SQL 为你提供了 auto-increment 的 Sequential ID。也就是1,2,3,4,5 …
    - NoSQL 的 ID 并不是 Sequential 的
- 对QPS的要求有多高？
    - NoSQL 的性能更高
- 对Scalability的要求有多高？
    - SQL 需要码农自己写代码来 Scale
    - 还记得Db那节课中怎么做 Sharding，Replica 的么？
        - NoSQL 这些都帮你做了

**如何选择**

- 是否需要支持 Transaction？——不需要。NoSQL +1
- 是否需要丰富的 SQL Query？——不需要。NoSQL +1
- 是否想偷懒？——Tiny URL 需要写的代码并不复杂。NoSQL+1
- 对QPS的要求有多高？—— 经计算，2k QPS并不高，而且2k读可以用 Cache，写很少。SQL +1
- 对Scalability的要求有多高？—— 存储和 QPS 要求都不高，单机都可以搞定。SQL+1
- 是否需要Sequential ID？—— 取决于算用的 url 转换的算法



#### 将 Long URL 转化为 Short URL 的算法实现

##### 算法1 使用哈希函数 Hash Function（不可行）

比如取 Long Url 的 MD5 的最后 6 位——这个方法肯定是有问题的

- 优点：快
- 缺点：难以设计一个没有冲突的哈希算法

##### 算法2：随机生成 + 数据库去重

随机一个 6 位的 ShortURL，如果没有被用过，就绑定到该 LongURL

- 优点：实现简单
- 缺点：生成短网址的速度随着短网址越来越多变得越来越慢

伪代码如下:

```java
public String longToShort(url) {
    while (true) {
        String shortUrl = randomShortUrl();
        if (!database.filter(shortUrl=shortUrl).exists()) {
            database.create(shortUrl=shortUrl, longUrl=url);
            return shortUrl;
        }
    }
}
```

##### 算法3 进制转换 Base62 (*)

将6位的short url看成一个62进制的数 `(0-9,a-z,A-Z)`, 那么每一个 shortUrl 都对应着一个整数, 这个整数就恰好可以是我们数据库里的自增 ID

- 优点：效率高
- 缺点：依赖于全局的自增ID


#### 随机生成 shortUrl

使用 SQL 数据库, 那么表结构就是这样的

```
+----------+------------------+
| shortUrl |      longUrl     |
+----------+------------------+
|   23fyu  |  www.google.com  |
+----------+------------------+
|   7gdr5  | www.facebook.com |
+----------+------------------+
```

并且需要对 shortKey 和 longURL 分别建立索引 (index)

> 下一篇文章会对 数据库 Index 进行总结


#### 进制转换

因为我们需要 自增ID 所以只能选择 SQL

表单结构如下，**shortURL 可以不存储在表单里，因为可以根据 id 来进行换算**


```
+----+------------------+
| id |  longUrl(Index)  |
+----+------------------+
|  1 |  www.google.com  |
+----+------------------+
|  2 | www.facebook.com |
+----+------------------+
```


### Scale 优化

> **Interviewer: How to reduce response time? 如何提高响应速度？**

#### 如何提速

##### 1. 加缓存

- 利用缓存提速（Cache Aside）
- 缓存里需要存两类数据：
    - long to short（生成新 short url 时需要）
    - short to long（查询 short url 时需要）


##### 2. 利用地理位置信息加速

- 优化服务器速度: 不同地区，使用不同 Web 服务器
    - 通过 DNS 解析不同地区的用户到不同的服务器
- 优化数据访问速度
    - 使用 Centralized MySQL + Distributed Memcached
    - 一个MySQL配多个Memcached, Memcached跨地区分布

##### 两点总结

- 提高Web服务器与数据服务器之间的访问效率：**利用缓存提高读请求的效率**
- 提高用户与服务器之间的访问效率：**解决了中国用户访问美国服务器慢的问题**

> **Interviewer: How to scale? 假如我们一开始估算错了，一台MySQL搞不定了**

#### 如何扩展

##### 1. 多台服务器

- Cache资源不够
- **写**操作越来越多 (黑客攻击)
- 请求太多，无法通过 Cache 满足

增加多台数据库可以优化什么？

- 解决存不下的问题——Storage角度（TinyURL一般遇不到这种问题）
- 解决忙不过来的问题—— QPS角度
- TinyURL主要是什么问题？？—— 忙不过来的问题


##### 2. 数据库拆分

- 纵向切分?
    - 并不适用
- 横向拆分? 一个表放多个机器？
    - 就将不同的short key放到不同的机器上，能解决short 2 long问题。但此时如果要解决long 2 short问题，就不好搞了。可能需要遍历每一个机器。但是回过来问，long 2 short这个问题的意义是什么。没有必要根据long查询short哇。**一个long可以对应多个short，因此没必要一个long对应一个short。**
- 如果最开始shortkey为6位，那就*增加一位前置位*：
    - AB1234 –> **0**AB1234（该前置位由 `hash(long_url)%62` 得到（可以用consistent hash 算法），因此是唯一的。这个前置位可以作为机器的ID等）
- 另一种做法，把第一位单独留出来做sharding key，总共还是6位


**Sharding Key 的选择**

1. 用 Long URL 做 shard key
    - 查询的时候，只能广播给N台数据库查询
    - 并不解决降低每台机器QPS的问题

2. 用 ID 做 shard key
    - 按照 ID % N（N为数据服务器个数），来分配存储
        - Short url to long url
        - 将 short url 转换为 ID
        - 根据 ID 找到数据库
        - 在该数据库中查询到 long url
        - Long url to short url
    - 先查询：广播给 N 台数据库，查询是否存在
    - 看起来有点耗，不过也是可行的，因为数据库服务器不会太多
    - 再插入：如果不存在的话，获得下一个自增 ID 的值，插入对应数据库

**难点: **如何获得在N台服务器中全局共享的一个自增ID是一个难点

- 一种解决办法是，专门用一台数据库来做自增ID服务
    - 该数据库不存储真实数据，也不负责其他查询
    - 为了避免单点失效（Single Point Failure) 可能需要多台数据库
- 另外一种解决办法是用 Zookeeper



解决流量继续增大一台数据库服务器无法满足的问题：**将数据分配到多台服务器**

> **Interviewer: 还有可以优化的么?**

#### 继续优化

网站服务器 (Web Server) 与 数据库服务器 (Database) 之间的通信问题。

中心化的服务器集群（Centralized DB set）与 跨地域的 Web Server 之间通信较慢。比如中国的服务器需要访问美国的数据库那么何不让中国的服务器访问中国的数据库？

如果数据是重复写到中国的数据库，那么如何解决一致性问题？——很难解决

中国的用户访问时，会被DNS分配中国的服务器，这非常的慢。

而中国的用户访问的网站一般都是中国的网站，所以我们可以**按照网站的地域信息进行 Sharding**。（如何获得网站的地域信息？只需要将用户比较常访问的网站弄一张表就好了）

中国的用户访问美国的网站怎么办？那就让中国的服务器访问美国的数据好了，反正也不会慢多少。中国访问中国是主流需求，优化系统就是要优化主要的需求


## References

- [1]. Srinath's Blog, [Generating a Distributed Sequence Number](http://srinathsview.blogspot.com/2012/04/generating-distributed-sequence-number.html)

