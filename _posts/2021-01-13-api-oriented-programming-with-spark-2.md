---
layout: article
title: "面向 API 编程: RDD 编程"
date: 2021-01-13
modify_date: 2021-01-14
excerpt: "面向 API 编程 - RDD 编程 (API Oriented Programming with Spark)"
tags: [Spark, Python, Scala]
mathjax: false
mathjax_autoNumber: false
key: api-oriented-programming-with-spark-2
---

<div align="center">
  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Apache_Spark_logo.svg/1200px-Apache_Spark_logo.svg.png" width="30%">
</div>

## RDD 编程基础

### RDD 创建

1. 从文件系统中加载数据
2. 通过并行集合 (数组)

**从文件系统中加载数据**

Spark 的 `SparkContext` 通过 `.textFile()` 读取数据生成内存中的 RDD

其中 `.textFile()` 支持

- 本地文件系统
- HDFS
- S3 等

```python
# 如果是本地文件, 一定要 "file:///"
>>> lines = sc.textFiles("file:///usr/local/sparl/example.txt")

# 下面三条语句是完全等价的
>>> lines = sc.textFiles("hdfs://localhost:9000/user/hadoop/example.txt")
>>> lines = sc.textFiles("/user/hadoop/example.txt")
>>> lines = sc.textFiles("example.txt")

>>> lines.foreach(print)

```


**通过并行集合 (数组)**


`SparkContext` 对象通过 `sc.parallelize()` 并行集合

```python
>>> array = [1, 2, 3, 4, 5]
>>> rdd = sc.parallelize(array)
>>> rdd.foreach(print)
1
2
3
...
```


### RDD 操作

#### Transformation

filter, map, flatMap, groupByKey, reduceByKey ...


![spark-transformations-api](https://raw.githubusercontent.com/Zhenye-Na/img-hosting-picgo/master/img/spark-transformations-api.png)


`filter(func)`

筛选出满足函数 func 的元素, 并返回一个新的数据集

```python
>>> lines = sc.textFile("file:///usr/local/spark/mycode/rdd/word.txt")
>>> linesWithSpark = lines.filter(lambda line: "Spark" in line)
>>> linesWithSpark.foreach(print)
Spark is better
Spark is fast
```

![spark-filter-api](https://raw.githubusercontent.com/Zhenye-Na/img-hosting-picgo/master/img/spark-filter-api.png)

***

`map(func)`

```python
>>> lines = sc.textFile("file:///usr/local/spark/mycode/rdd/word.txt")
>>> words = lines.map(lambda line:line.split(" "))
>>> words.foreach(print)
['Hadoop', 'is', 'good']
['Spark', 'is', 'fast']
['Spark', 'is', 'better']
```

![spark-map-api](https://raw.githubusercontent.com/Zhenye-Na/img-hosting-picgo/master/img/spark-map-api.png)

***

`flatMap(func)`

```python
>>> lines = sc.textFile("file:///usr/local/spark/mycode/rdd/word.txt")
>>> words = lines.flatMap(lambda line:line.split(" "))
```

![spark-flatMap-api](https://raw.githubusercontent.com/Zhenye-Na/img-hosting-picgo/master/img/spark-flatMap-api.png)

***

`groupByKey()`

`groupByKey()` 应用于 `(K,V)` 键值对的数据集时, 返回一个新的 `(K, Iterable)` 形式的数据集

```python
>>> words = sc.parallelize([("Hadoop",1),("is",1),("good",1), \
... ("Spark",1),("is",1),("fast",1),("Spark",1),("is",1),("better",1)])
>>> words1 = words.groupByKey()
>>> words1.foreach(print)
('Hadoop', <pyspark.resultiterable.ResultIterable object at 0x7fb210552c88>)
('better', <pyspark.resultiterable.ResultIterable object at 0x7fb210552e80>)
('fast', <pyspark.resultiterable.ResultIterable object at 0x7fb210552c88>)
('good', <pyspark.resultiterable.ResultIterable object at 0x7fb210552c88>)
('Spark', <pyspark.resultiterable.ResultIterable object at 0x7fb210552f98>)
('is', <pyspark.resultiterable.ResultIterable object at 0x7fb210552e10>)
```

value 这个列表是被封装进 `pyspark.resultiterable.ResultIterable` 类中

![spark-groupByKey-api](https://raw.githubusercontent.com/Zhenye-Na/img-hosting-picgo/master/img/spark-groupByKey-api.png)

***

`reduceByKey(func)`

`reduceByKey(func)` 应用于 `(K,V)` 键值对的数据集时, 返回一个新的 `(K, V)` 形式的数据集, 其中的每个值是将每个 `key` 传递到函数 `func` 中进行聚合后得到的结果

```python
>>> words = sc.parallelize([("Hadoop",1),("is",1),("good",1),("Spark",1), \
... ("is",1),("fast",1),("Spark",1),("is",1),("better",1)])
>>> words1 = words.reduceByKey(lambda a,b:a+b)
>>> words1.foreach(print)
('good', 1)
('Hadoop', 1)
('better', 1)
('Spark', 2)
('fast', 1)
('is', 3)
```
![spark-reduceByKey2](https://raw.githubusercontent.com/Zhenye-Na/img-hosting-picgo/master/img/spark-reduceByKey2.png)


![spark-reduceByKey-api](https://raw.githubusercontent.com/Zhenye-Na/img-hosting-picgo/master/img/spark-reduceByKey-api.png)


#### Action

行动操作是真正触发计算的地方. Spark 程序执行到行动操作时, 才会执行真正的计算, 从文件中加载数据, 完成一次又一次转换操作, 最终, 完成行动操作得到结果

![spark-action-api](https://raw.githubusercontent.com/Zhenye-Na/img-hosting-picgo/master/img/spark-action-api.png)

```python
>>> rdd = sc.parallelize([1,2,3,4,5])
>>> rdd.count()
5
>>> rdd.first()
1
>>> rdd.take(3)
[1, 2, 3]
>>> rdd.reduce(lambda a,b:a+b)
15
>>> rdd.collect()
[1, 2, 3, 4, 5]
>>> rdd.foreach(lambda elem:print(elem))
1
2
3
4
5
```

#### 惰性机制

所谓的"惰性机制"是指, 整个转换过程只是记录了转换的轨迹, 并不会发生真正的计算, 只有遇到行动操作时, 才会触发"从头到尾"的真正的计算, 这里给出一段简单的语句来解释 Spark 的惰性机制

```python
>>> lines = sc.textFile("file:///usr/local/spark/mycode/rdd/word.txt")
>>> lineLengths = lines.map(lambda s:len(s))
>>> totalLength = lineLengths.reduce(lambda a,b:a+b) # 程序真正执行
>>> print(totalLength)
```


### 持久化

在Spark中, RDD 采用惰性求值的机制, 每次遇到行动操作, 都会从头开始执行计算. 每次调用行动操作, 都会触发一次从头开始的计算. 这对于迭代计算而言, 代价是很大的, 迭代计算经常需要多次重复使用同一组数据

```python
>>> list = ["Hadoop","Spark","Hive"]
>>> rdd = sc.parallelize(list)
>>> print(rdd.count()) # Action, 触发一次真正从头到尾的计算
3
>>> print(','.join(rdd.collect())) # Action, 触发一次真正从头到尾的计算
Hadoop,Spark,Hive
```

所以可以通过持久化 (缓存) 机制避免这种重复计算的开销, 可以使用 `persist()` 方法对一个 RDD 标记为持久化

- 之所以说"标记为持久化", 是因为出现 `persist()` 语句的地方, 并不会马上计算生成 RDD 并把它持久化, 而是要等到遇到**第一个行动操作触发真正计算以后, 才会把计算结果进行持久化**
- 持久化后的 RDD 将会被保留在计算节点的内存中被后面的行动操作重复使用

#### `persist()`

- `persist(MEMORY_ONLY)`: 表示将 RDD 作为反序列化的对象存储于 JVM 中, 如果内存不足, 就要按照 LRU 原则替换缓存中的内容. `rdd.cache()` 调用的就是这个 API
- `persist(MEMORY_AND_DISK)`: 表示将 RDD 作为反序列化的对象存储在 JVM 中, 如果内存不足, 超出的分区将会被存放在硬盘上

一般而言, 使用 `.cache()` 方法时, 会调用 `persist(MEMORY_ONLY)`

可以使用 `.unpersist()` 方法手动地把持久化的 RDD 从缓存中移除

```python
>>> list = ["Hadoop","Spark","Hive"]
>>> rdd = sc.parallelize(list)
>>> rdd.cache() # 会调用 persist(MEMORY_ONLY), 但是, 语句执行到这里, 并不会缓存rdd, 因为这时rdd还没有被计算生成
>>> print(rdd.count()) # 第一次行动操作, 触发一次真正从头到尾的计算, 这时上面的 rdd.cache() 才会被执行, 把这个rdd放到缓存中
3
>>> print(','.join(rdd.collect())) # 第二次行动操作, 不需要触发从头到尾的计算, 只需要重复使用上面缓存中的rdd
Hadoop,Spark,Hive
```

### 分区

RDD是弹性分布式数据集，通常RDD很大，会被分成很多个分区，分别保存在不同的节点上

**分区的作用**

**1. 增加并行度**

![spark-partition-1](https://raw.githubusercontent.com/Zhenye-Na/img-hosting-picgo/master/img/spark-partition-1.png)

**2. 减少通信开销**


#### RDD 分区原则

RDD 分区的一个原则是**使得分区的个数尽量等于集群中的CPU核心 (core) 数目**

对于不同的 Spark 部署模式而言 (本地模式, Standalone模式, YARN模式, Mesos模式), 都可以通过设置 `spark.default.parallelism` 这个参数的值, 来配置默认的分区数目, 一般而言:

- 本地模式: 默认为本地机器的 CPU 数目, 若设置了 `local[N]`, 则默认为 `N`
- Apache Mesos: 默认的分区数为 `8`
- Standalone 或 YARN: 在"**集群中所有CPU核心数目总和**"和"2"二者中取较大值作为默认值

***

**设置分区的个数**

**1. 创建RDD时手动指定分区个数**

在调用 `.textFile()` 和 `.parallelize()` 方法的时候手动指定分区个数即可, 语法格式如下:

```python
sc.textFile(path, partitionNum)
```

其中, `path` 参数用于指定要加载的文件的地址, `partitionNum` 参数用于指定分区个数。

```python
>>> list = [1,2,3,4,5]
>>> rdd = sc.parallelize(list,2) # 设置两个分区
```

**2. 使用reparititon方法重新设置分区个数**

通过转换操作得到新 RDD 时, 直接调用 `.repartition()` 方法即可. 例如:

```python
>>> data = sc.parallelize([1,2,3,4,5],2)
>>> len(data.glom().collect()) # 显示data这个RDD的分区数量
2
>>> rdd = data.repartition(1)  # 对data这个RDD进行重新分区
>>> len(rdd.glom().collect())  # 显示rdd这个RDD的分区数量
1
```


### 案例

假设有一个本地文件 `word.txt`, 里面包含了很多行文本, 每行文本由多个单词构成, 单词之间用空格分隔. 可以使用如下语句进行词频统计 (即统计每个单词出现的次数):

```python
>>> lines = sc. \
... textFile("file:///usr/local/spark/mycode/rdd/word.txt")
>>> wordCount = lines.flatMap(lambda line:line.split(" ")). \
... map(lambda word:(word,1)).reduceByKey(lambda a,b:a+b)
>>> print(wordCount.collect())
[('good', 1), ('Spark', 2), ('is', 3), ('better', 1), ('Hadoop', 1), ('fast', 1)]
```

![spark-wordCount-example](https://raw.githubusercontent.com/Zhenye-Na/img-hosting-picgo/master/img/spark-wordCount-example.png))

在实际应用中, 单词文件可能非常大, 会被保存到分布式文件系统 HDFS 中, Spark 和 Hadoop 会统一部署在一个集群上

部署的方式就是 Hadoop 的 DataNode 和 Spark 的 WorkerNode 部署在同一机器上

![hadoop-spark-deployment](https://raw.githubusercontent.com/Zhenye-Na/img-hosting-picgo/master/img/hadoop-spark-deployment.png))

在集群中执行词频统计过程示意图:

![distributed-wordCount-diagram](https://raw.githubusercontent.com/Zhenye-Na/img-hosting-picgo/master/img/distributed-wordCount-diagram.png)



## 键值对 RDD

### 键值对 RDD 的创建

#### 从文件中加载

```python
>>> lines = sc.textFile("file:///usr/local/spark/mycode/pairrdd/word.txt")
>>> pairRDD = lines.flatMap(lambda line:line.split(" ")).map(lambda word:(word,1))
>>> pairRDD.foreach(print)
('I', 1)
('love', 1)
('Hadoop', 1)
...
```


#### 通过并行集合 (列表) 创建 RDD

```python
>>> list = ["Hadoop","Spark","Hive","Spark"]
>>> rdd = sc.parallelize(list)
>>> pairRDD = rdd.map(lambda word:(word,1))
>>> pairRDD.foreach(print)
(Hadoop,1)
(Spark,1)
(Hive,1)
(Spark,1)
```


### 常用的键值对 RDD 转换操作

`reduceByKey(func)`

使用 `func` 函数合并具有相同键的值

```python
>>> pairRDD = sc.parallelize([("Hadoop",1),("Spark",1),("Hive",1),("Spark",1)])
>>> pairRDD.reduceByKey(lambda a,b:a+b).foreach(print)
('Spark', 2)
('Hive', 1)
('Hadoop', 1)
```


`groupByKey(func)`

```python
>>> lst = [("spark",1),("spark",2),("hadoop",3),("hadoop",5)]
>>> pairRDD = sc.parallelize(lst)
>>> pairRDD.groupByKey()
PythonRDD[27] at RDD at PythonRDD.scala:48
>>> pairRDD.groupByKey().foreach(print)
('hadoop', <pyspark.resultiterable.ResultIterable object at 0x7f2c1093ecf8>)
('spark', <pyspark.resultiterable.ResultIterable object at 0x7f2c1093ecf8>)
```

<div class="alert alert-info">
<p><code>reduceByKey</code> 和 <code>groupByKey</code> 的区别</p>
<ul>
<li><code>reduceByKey</code> 用于对每个 <code>key</code> 对应的多个 <code>value</code> 进行 <code>merge</code> 操作, 最重要的是它能够在本地先进行 <code>merge</code> 操作, 并且 <code>merge</code> 操作可以通过函数自定义</li>
<li><code>groupByKey</code> 也是对每个 <code>key</code> 进行操作, 但只生成一个 <code>sequence</code>, <code>groupByKey</code> 本身不能自定义函数, 需要先用 <code>groupByKey</code> 生成 RDD, 然后才能对此 RDD 通过 <code>map</code> 进 行自定义函数操作</li>
</ul>
</div>

```python
>>> words = ["one", "two", "two", "three", "three", "three"]
>>> wordPairsRDD = sc.parallelize(words).map(lambda word:(word, 1))

>>> wordCountsWithReduce = wordPairsRDD.reduceByKey(lambda a,b:a+b)
>>> wordCountsWithReduce.foreach(print)
('one', 1)
('two', 2)
('three', 3)

>>> wordCountsWithGroup = wordPairsRDD.groupByKey().map(lambda t:(t[0],sum(t[1])))
>>> wordCountsWithGroup.foreach(print)
('two', 2)
('three', 3)
('one', 1)
```

***

`keys()`

keys 只会把 Pair RDD中的 key 返回形成一个新的 RDD

```python
>>> lst = [("Hadoop",1),("Spark",1),("Hive",1),("Spark",1)]
>>> pairRDD = sc.parallelize(lst)
>>> pairRDD.keys().foreach(print)
Hadoop
Spark
Hive
Spark
```

***

values

values只会把Pair RDD中的value返回形成一个新的RDD。

```python
>>> lst = [("Hadoop",1),("Spark",1),("Hive",1),("Spark",1)]
>>> pairRDD = sc.parallelize(lst)
>>> pairRDD.values().foreach(print)
1
1
1
1
```

***

sortByKey()

sortByKey()的功能是返回一个根据键排序的RDD

```python
>>> lst = [("Hadoop",1),("Spark",1),("Hive",1),("Spark",1)]
>>> pairRDD = sc.parallelize(lst)
>>> pairRDD.foreach(print)
('Hadoop', 1)
('Spark', 1)
('Hive', 1)
('Spark', 1)
>>> pairRDD.sortByKey().foreach(print) # 默认升序
('Hadoop', 1)
('Hive', 1)
('Spark', 1)
('Spark', 1)
>>> pairRDD.sortByKey(False).foreach(print)
```

`sortByKey()` 和 `sortBy()`

根据 `key` 来排序

```python
>>> d1 = sc.parallelize([("c",8),("b",25),("c",17),("a",42), \
... ("b",4),("d",9),("e",17),("c",2),("f",29),("g",21),("b",9)])
>>> d1.reduceByKey(lambda a,b:a+b).sortByKey(False).collect()
[('g', 21), ('f', 29), ('e', 17), ('d', 9), ('c', 27), ('b', 38), ('a', 42)]
```

根据 `val` 来排序

```python
>>> d1 = sc.parallelize([("c",8),("b",25),("c",17),("a",42), \
... ("b",4),("d",9),("e",17),("c",2),("f",29),("g",21),("b",9)])
>>> d1.reduceByKey(lambda a,b:a+b).sortBy(lambda x:x,False).collect()
[('g', 21), ('f', 29), ('e', 17), ('d', 9), ('c', 27), ('b', 38), ('a', 42)]
>>> d1.reduceByKey(lambda a,b:a+b).sortBy(lambda x:x[0],False).collect()
[('g', 21), ('f', 29), ('e', 17), ('d', 9), ('c', 27), ('b', 38), ('a', 42)]
>>> d1.reduceByKey(lambda a,b:a+b).sortBy(lambda x:x[1],False).collect()
[('a', 42), ('b', 38), ('f', 29), ('c', 27), ('g', 21), ('e', 17), ('d', 9)]
```

***

`mapValues(func)`

对键值对 RDD 中的每个 `value` 都应用一个函数, 但是, `key` 不会发生变化

```python
>>> lst = [("Hadoop",1),("Spark",1),("Hive",1),("Spark",1)]
>>> pairRDD = sc.parallelize(lst)
>>> pairRDD1 = pairRDD.mapValues(lambda x:x+1)
>>> pairRDD1.foreach(print)
('Hadoop', 2)
('Spark', 2)
('Hive', 2)
('Spark', 2)
```

***

`join()`


`join` 就表示内连接. 对于内连接, 对于给定的两个输入数据集 `(K,V1)` 和 `(K,V2)`, 只有在两个数据集中都存在的 `key` 才会被输出, 最终得到一个 `(K,(V1,V2))` 类型的数据集

```python
>>> pairRDD1 = sc.parallelize([("spark",1),("spark",2),("hadoop",3),("hadoop",5)])
>>> pairRDD2 = sc.parallelize([("spark","fast")])
>>> pairRDD3 = pairRDD1.join(pairRDD2)
>>> pairRDD3.foreach(print)
('spark', (1, 'fast'))
('spark', (2, 'fast'))
```


### 一个综合实例

题目:
给定一组键值对 `("spark",2),("hadoop",6),("hadoop",4),("spark",6)`, 键值对的 `key` 表示图书名称, `value`表示某天图书销量, 请计算每个键对应的平均值, 也就是计算每种图书的每天平均销量


```python
>>> rdd = sc.parallelize([("spark",2),("hadoop",6),("hadoop",4),("spark",6)])
>>> rdd.mapValues(lambda x:(x,1)).\
... reduceByKey(lambda x,y:(x[0]+y[0],x[1]+y[1])).\
... mapValues(lambda x:x[0]/x[1]).collect()
[('hadoop', 5.0), ('spark', 4.0)]
```

![spark-action-usecase-example](https://raw.githubusercontent.com/Zhenye-Na/img-hosting-picgo/master/img/spark-action-usecase-example.png)


## 数据读写

### 文件数据读写

#### 本地文件系统的数据读写

从文件中读取数据创建RDD

```python
>>> textFile = sc.\
... textFile("file:///usr/local/spark/mycode/rdd/word.txt")
>>> textFile.first()
'Hadoop is good'
```

> 因为 Spark 采用了惰性机制, 在执行转换操作的时候, 即使输入了错误的语句, spark-shell 也不会马上报错（假设 `word.txt` 不存在）


把 RDD 写入到文本文件中, 传入的是一个目录 `dir/`

```python
>>> textFile = sc.\
... textFile("file:///usr/local/spark/mycode/rdd/word.txt")
>>> textFile.\
... saveAsTextFile("file:///usr/local/spark/mycode/rdd/writeback") # 传入的是一个目录 `dir/`
```



#### 分布式文件系统 HDFS 的数据读写

```python
>>> textFile = sc.textFile("hdfs://localhost:9000/user/hadoop/word.txt")
>>> textFile.first()

# same
>>> textFile = sc.textFile("hdfs://localhost:9000/user/hadoop/word.txt")
>>> textFile = sc.textFile("/user/hadoop/word.txt")
>>> textFile = sc.textFile("word.txt")
```

保存文件

```python
>>> textFile = sc.textFile("word.txt")
>>> textFile.saveAsTextFile("writeback")
```


### 读写 HBase 数据

#### HBase 介绍

![hadoop-ecosystem](https://raw.githubusercontent.com/Zhenye-Na/img-hosting-picgo/master/img/hadoop-ecosystem.png)

- HBase 是一个稀疏, 多维度, 排序的映射表, 这张表的索引是行键, 列族, 列限定符和时间戳
- 每个值是一个未经解释的字符串, 没有数据类型
- 用户在表中存储数据, 每一行都有一个可排序的行键和任意多的列
- 表在水平方向由一个或者多个列族组成, 一个列族中可以包含任意多个列, 同一个列族里面的数据存储在一起
- 列族支持动态扩展, 可以很轻松地添加一个列族或列, 无需预先定义列的数量以及类型, 所有列均以字符串形式存储, 用户需要自行进行数据类型转换
- HBase 中执行更新操作时, 并不会删除数据旧的版本, 而是生成一个新的版本, 旧有的版本仍然保留 (这是和 HDFS 只允许追加不允许修改的特性相关的)

![hbase-intro](https://raw.githubusercontent.com/Zhenye-Na/img-hosting-picgo/master/img/hbase-intro.png)

- 表: HBase 采用表来组织数据, 表由行和列组成, 列划分为若干个列族
- 行: 每个 HBase 表都由若干行组成, 每个行由**行键 (Row Key)** 来标识。
- 列族: 一个 HBase 表被分组成许多**"列族" (Column Family)** 的集合, 它是基本的访问控制单元
- 列限定符: 列族里的数据通过列限定符(或列) 来定位
- 单元格: 在 HBase 表中, 通过行, 列族和列限定符确定一个 "单元格" (cell), 单元格中存储的数据没有数据类型, 总被视为字节数组 `byte[]`
- 时间戳: 每个单元格都保存着同一份数据的多个版本, 这些版本采用**时间戳**进行索引

> HBase 中需要根据行键, 列族, 列限定符和时间戳来确定一个单元格，因此，可以视为一个 "四维坐标", 即 `[行键, 列族, 列限定符, 时间戳]`


#### 读写 HBase 数据

**读**

如果要让 Spark 读取 HBase, 就需要使用 `SparkContext` 提供的 `newAPIHadoopRDD` 这个 API 将表的内容以 RDD 的形式加载到 Spark 中

```python
#!/usr/bin/env python3
from pyspark import SparkConf, SparkContext

conf = SparkConf().setMaster("local").setAppName("ReadHBase")
sc = SparkContext(conf=conf)

host = 'localhost'
table = 'student'
conf = {
    "hbase.zookeeper.quorum": host,
    "hbase.mapreduce.inputtable": table
}
keyConv = "org.apache.spark.examples.pythonconverters.ImmutableBytesWritableToStringConverter"
valueConv = "org.apache.spark.examples.pythonconverters.HBaseResultToStringConverter"

hbase_rdd = sc.newAPIHadoopRDD(
    "org.apache.hadoop.hbase.mapreduce.TableInputFormat",
    "org.apache.hadoop.hbase.io.ImmutableBytesWritable",
    "org.apache.hadoop.hbase.client.Result",
    keyConverter=keyConv,
    valueConverter=valueConv,
    conf=conf
)

count = hbase_rdd.count()
hbase_rdd.cache()
output = hbase_rdd.collect()
for (k, v) in output:
    print(k, v)
```

执行后得到如下结果

```
1 {"qualifier" : "age", "timestamp" : "1545728145163", "columnFamily" : "info", "row" : "1", "type" : "Put", "value" : "23"}
{"qualifier" : "gender", "timestamp" : "1545728114020", "columnFamily" : "info", "row" : "1", "type" : "Put", "value" : "F"}
{"qualifier" : "name", "timestamp" : "1545728100663", "columnFamily" : "info", "row" : "1", "type" : "Put", "value" : "Xueqian"}
2 {"qualifier" : "age", "timestamp" : "1545728184030", "columnFamily" : "info", "row" : "2", "type" : "Put", "value" : "24"}
{"qualifier" : "gender", "timestamp" : "1545728176815", "columnFamily" : "info", "row" : "2", "type" : "Put", "value" : "M"}
{"qualifier" : "name", "timestamp" : "1545728168727", "columnFamily" : "info", "row" : "2", "type" : "Put", "value" : "Weiliang"}
```

**写**

`saveAsNewAPIHadoopDataset()`

```python
#!/usr/bin/env python3
from pyspark import SparkConf, SparkContext

conf = SparkConf().setMaster("local").setAppName("ReadHBase")
sc = SparkContext(conf=conf)

host = 'localhost'
table = 'student'
keyConv = "org.apache.spark.examples.pythonconverters.StringToImmutableBytesWritableConverter"
valueConv = "org.apache.spark.examples.pythonconverters.StringListToPutConverter"
conf = {
    "hbase.zookeeper.quorum": host,
    "hbase.mapred.outputtable": table,
    "mapreduce.outputformat.class": "org.apache.hadoop.hbase.mapreduce.TableOutputFormat",
    "mapreduce.job.output.key.class": "org.apache.hadoop.hbase.io.ImmutableBytesWritable",
    "mapreduce.job.output.value.class": "org.apache.hadoop.io.Writable"
}

rawData = [
    '3,info,name,Rongcheng',
    '3,info,gender,M',
    '3,info,age,26',
    '4,info,name,Guanhua',
    '4,info,gender,M',
    '4,info,age,27'
]

sc.parallelize(rawData) \
    .map(lambda x: (x[0],x.split(','))) \
    .saveAsNewAPIHadoopDataset(
        conf=conf,
        keyConverter=keyConv,
        valueConverter=valueConv
    )
```


## 综合案例

### 案例1: 求 TOP 值

`orderid,userid,payment,productid`, 求 Top N 个 payment 值

input:

```
1,1768,50,155
2,1218, 600,211
3,2239,788,242
4,3101,28,599
5,4899,290,129
6,3110,54,1201
7,4436,259,877
8,2369,7890,27
```

```python
#!/usr/bin/env python3
from pyspark import SparkConf, SparkContext

conf = SparkConf().setMaster("local").setAppName("ReadHBase")
sc = SparkContext(conf=conf)

lines = sc.textFile("file:///usr/local/spark/mycode/rdd/file")

result1 = lines.filter(lambda line:(len(line.strip())>0) and (len(line.split(","))==4))
result2 = result1.map(lambda x:x.split(",")[2])
result3 = result2.map(lambda x:(int(x),""))
result4 = result3.repartition(1)
result5 = result4.sortByKey(False)
result6 = result5.map(lambda x:x[0])
result7 = result6.take(5)

for a in result7:
    print(a)
```


### 案例2: 文件排序

有多个输入文件，每个文件中的每一行内容均为一个整数。要求读取所有文件中的整数，进行排序后，输出到一个新的文件中，输出的内容个数为每行两个整数，第一个整数为第二个整数的排序位次，第二个整数为原待排序的整数

```python
#!/usr/bin/env python3
from pyspark import SparkConf, SparkContext

index = 0

def getindex():
    global index
    index += 1
    return index

def main():
    conf = SparkConf().setMaster("local[1]").setAppName("FileSort")
    sc = SparkContext(conf=conf)

    lines = sc.textFile("file:///usr/local/spark/mycode/rdd/filesort/file*.txt")
    index = 0

    result1 = lines.filter(lambda line:(len(line.strip())>0))
    result2 = result1.map(lambda x:(int(x.strip()),""))
    result3 = result2.repartition(1)
    result4 = result3.sortByKey(True)
    result5 = result4.map(lambda x:x[0])
    result6 = result5.map(lambda x:(getindex(),x))
    result6.foreach(print)
    result6.saveAsTextFile("file:///usr/local/spark/mycode/rdd/filesort/sortresult")

if __name__ == '__main__':
    main()
```

***

if, by any chance, you'd like to bring back to the driver only **n** first tuples, then maybe you could use **takeOrdered(n, [ordering])** where **n** is the number of results to bring back and **ordering** the comparator you'd like to use.

Otherwise, you can use the **zipWithIndex** transformation that will transform you `RDD[(VertexId, Double)]` into a `RDD[((VertexId, Double), Long)]` with the proper index (of course you should do that after your sort).

For example:

```scala
scala> val data = sc.parallelize(List(("A", 1), ("B", 2)))
scala> val sorted = data.sortBy(_._2)
scala> sorted.zipWithIndex.collect()
res1: Array[((String, Int), Long)] = Array(((A,1),0), ((B,2),1))
```


### 案例3: 二次排序

对于一个给定的文件 (数据如 `file1.txt` 所示), 请对数据进行排序, 首先根据第 1 列数据降序排序, 如果第 1 列数据相等, 则根据第 2 列数据降序排序

input

```
5 3
1 6
4 9
8 3
4 7
5 6
3 2
```

![secondary-sort-example](https://raw.githubusercontent.com/Zhenye-Na/img-hosting-picgo/master/img/secondary-sort-example.png)

```python
#!/usr/bin/env python3
from operator import gt
from pyspark import SparkContext, SparkConf

class SecondarySortKey():
    def __init__(self, k):
         self.column1 = k[0]
         self.column2 = k[1]
    def __gt__(self, other):
        if other.column1 == self.column1:
            return gt(self.column2, other.column2)
        else:
            return gt(self.column1, other.column1)


def main():
    conf = SparkConf().setAppName('spark_sort').setMaster('local[1]')
    sc = SparkContext(conf=conf)

    file="file:///usr/local/spark/mycode/rdd/secondarysort/file4.txt"

    rdd1 = sc.textFile(file)
    rdd2 = rdd1.filter(lambda x:(len(x.strip())>0))
    rdd3 = rdd2.map(lambda x:((int(x.split(" ")[0]),int(x.split(" ")[1])),x))
    rdd4 = rdd3.map(lambda x: (SecondarySortKey(x[0]),x[1]))
    rdd5 = rdd4.sortByKey(False)
    rdd6 = rdd5.map(lambda x:x[1])
    rdd6.foreach(print)


if __name__ == '__main__':
    main()
```

## References

- [厦门大学 - 林子雨 - Spark编程基础 (Python版)](https://study.163.com/course/introduction/1209408816.htm)
- [厦门大学 - 林子雨 - Spark编程基础 (Python版) - 课件](http://dblab.xmu.edu.cn/post/12157/#kejianxiazai)
- https://stackoverflow.com/questions/28837426/spark-sort-rdd-and-join-their-rank

<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
<ins class="adsbygoogle"
     style="display:block; text-align:center;"
     data-ad-layout="in-article"
     data-ad-format="fluid"
     data-ad-client="ca-pub-6161588707523400"
     data-ad-slot="2418749784"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>
