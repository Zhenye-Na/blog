---
layout: article
title: "面向 API 编程: Structured Streaming"
date: 2021-01-18
modify_date: 2021-01-20
excerpt: "面向 API 编程 - Structured Streaming (API Oriented Programming with Spark)"
tags: [Spark, Python, Scala]
mathjax: false
mathjax_autoNumber: false
key: api-oriented-programming-with-spark-5
---

## Structured Streaming

### Structured Streaming 概述

Structured Streaming 的关键思想是将实时数据流视为一张正在不断添加数据的表. 可以把流计算等同于在一个静态表上的批处理查询, Spark 会在不断添加数据的无界输入表上运行计算, 并进行增量查询

无界表上对输入的查询将生成结果表, 系统每隔一定的周期会触发对无界表的计算并更新结果表


#### 两种处理模型

**微批处理**

Structured Streaming 默认使用微批处理执行模型, 这意味着 Spark流计算引擎会定期检查流数据源, 并对自上一批次结束后到达的新数据执行批量查询

数据到达和得到处理并输出结果之间的延时超过 100 毫秒


**持续处理**

- Spark 从 2.3.0 版本开始引入了持续处理的试验性功能, 可以实现流计算的毫秒级延迟
- 在持续处理模式下, Spark 不再根据触发器来周期性启动任务, 而是启动一系列的连续读取, 处理和写入结果的长时间运行的任务


#### Structured Streaming 和 Spark SQL, Spark Streaming 关系

- Structured Streaming 可以对 DataFrame/Dataset 应用前面章节提到的各种操作, 包括 select, where, groupBy, map, filter, flatMap 等. 
- Spark Streaming 只能实现**秒级**的实时响应, 而 StructuredStreaming 由于采用了全新的设计方式, 采用微批处理模型时可以实现**100 毫秒**级别的实时响应, 采用持续处理模型时可以支持**毫秒**级的实时响应. 



### Structured Streaming 程序编写

实例任务: 一个包含很多行英文语句的数据流源源不断到达, Structured Streaming 程序对每行英文语句进行拆分, 并统计每个单词出现的频率


```python
# 由于程序中需要用到拆分字符串和展开数组内的所有单词的功能
# 所以引用了来自 `pyspark.sql.functions` 里面的 split 和 explode 函数
from pyspark.sql import SparkSession
from pyspark.sql.functions import split, explode


# 创建 SparkSession 对象
if __name__ == "__main__":
    spark = SparkSession \
        .builder \
        .appName("StructuredNetworkWordCount") \
        .getOrCreate()
    spark.sparkContext.setLogLevel('WARN')

    # 创建输入数据源
    lines = spark \
        .readStream \
        .format("socket") \
        .option("host", "localhost") \
        .option("port", 9999) \
        .load()

    # 定义流计算过程
    words = lines.select(
      explode(
          split(lines.value, " ")
      ).alias("word")
    )
    wordCounts = words.groupBy("word").count()


    # 启动流计算并输出结果
    query = wordCounts \
        .writeStream \
        .outputMode("complete") \
        .format("console") \
        .trigger(processingTime="8 seconds") \
        .start()
    query.awaitTermination()
```


### 输入源

#### File 源

File 源 (或称为"文件源") 以文件流的形式读取某个目录中的文件, 支持的文件格式为 csv, json, orc, parquet, text 等. 

需要注意的是, 文件放置到给定目录的操作应当是原子性的, 即不能长时间在给定目录内打开文件写入内容, 而是应当采取大部分操作系统都支持的, 通过写入到临时文件后移动文件到给定目录的方式来完成. 

```python
#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# 导入需要用到的模块
import os
import shutil
from pprint import pprint
from pyspark.sql import SparkSession
from pyspark.sql.functions import window, asc
from pyspark.sql.types import StructType, StructField
from pyspark.sql.types import TimestampType, StringType

# 定义 JSON 文件的路径常量
TEST_DATA_DIR_SPARK = 'file:///tmp/testdata/'

if __name__ == "__main__":
    # 定义模式, 为时间戳类型的 eventTime, 字符串类型的操作和省份组成
    schema = StructType([
        StructField("eventTime", TimestampType(), True),
        StructField("action", StringType(), True),
        StructField("district", StringType(), True)])
    spark = SparkSession \
        .builder \
        .appName("StructuredEMallPurchaseCount") \
        .getOrCreate()
 
    spark.sparkContext.setLogLevel('WARN')

    lines = spark \
        .readStream \
        .format("json") \
        .schema(schema) \
        .option("maxFilesPerTrigger", 100) \
        .load(TEST_DATA_DIR_SPARK)

    # 定义窗口
    windowDuration = '1 minutes'
    windowedCounts = lines \
        .filter("action = 'purchase'") \
        .groupBy('district', window('eventTime', windowDuration)) \
        .count() \
        .sort(asc('window'))

    # 启动流计算
    query = windowedCounts \
        .writeStream \
        .outputMode("complete") \
        .format("console") \
        .option('truncate', 'false') \
        .trigger(processingTime="10 seconds") \
        .start()
    query.awaitTermination()
```

### 输出操作

#### 启动流计算

DataFrame/Dataset 的 `.writeStream()` 方法将会返回 DataStreamWriter 接口, 接口通过 `.start()` 真正启动流计算, 并将 DataFrame/Dataset 写入到外部的输出接收器, DataStreamWriter 接口有以下几个主要函数


1. `format`: 接收器类型. 
2. `outputMode`: 输出模式, 指定写入接收器的内容, 可以是 `Append` 模式, `Complete` 模式或 `Update` 模式. 
3. `queryName`: 查询的名称, 可选, 用于标识查询的唯一名称. 
4. `trigger`: 触发间隔, 可选, 设定触发间隔, 如果未指定, 则系统将在上一次处理完成后立即检查新数据的可用性. 如果由于先前的处理尚未完成导致超过触发间隔, 则系统将在处理完成后立即触发新的查询


#### 输出模式

输出模式用于指定写入接收器的内容, 主要有以下几种:

- Append 模式:只有结果表中自上次触发间隔后增加的新行, 才会被写入外部存储器. 这种模式一般适用于"不希望更改结果表中现有行的内容"的使用场景. 
- Complete 模式:已更新的完整的结果表可被写入外部存储器. 
- Update 模式:只有自上次触发间隔后结果表中发生更新的行, 才会被写入外部存储器. 这种模式与 Complete 模式相比, 输出较少, 如果结果表的部分行没有更新, 则不会输出任何内容. 当查询不包括聚合时, 这个模式等同于 Append 模式. 


#### 输出接收器

系统内置的输出接收器包括 File 接收器, Kafka 接收器, Foreach 接
收器, Console 接收器, Memory 接收器等, 其中, Console 接收器
和 Memory 接收器仅用于调试用途. 有些接收器由于无法保证输出
的持久性, 导致其不是容错的. 
以 File 接收器为例, 这里把 7.2 节的实例修改为使用 File 接收器, 
修改后的代码文件为 StructuredNetworkWordCountFileSink.py


```python
#!/usr/bin/env python3
from pyspark.sql import SparkSession
from pyspark.sql.functions import split
from pyspark.sql.functions import explode
from pyspark.sql.functions import length


if __name__ == "__main__":
    spark = SparkSession \
        .builder \
        .appName("StructuredNetworkWordCountFileSink") \
        .getOrCreate()

    spark.sparkContext.setLogLevel('WARN')

    lines = spark \
        .readStream \
        .format("socket") \
        .option("host", "localhost") \
        .option("port", 9999) \
        .load()


    words = lines.select(
        explode(
            split(lines.value, " ")
            ).alias("word")
        )
    all_length_5_words = words.filter(length("word") == 5)
    query = all_length_5_words \
        .writeStream \
        .outputMode("append") \
        .format("parquet") \
        .option("path", "file:///tmp/filesink") \
        .option("checkpointLocation", "file:///tmp/file-sink-cp") \
        .trigger(processingTime="8 seconds") \
        .start()
    query.awaitTermination()
```

由于程序执行后不会在终端输出信息, 这时可新建一个终端, 执行如下命令查看 File 接收器保存的位置:

```shs
$ cd /tmp/filesink
$ ls
```

可以看到以 parquet 格式保存的类似如下的文件列表:

```sh
part-00000-2bd184d2-e9b0-4110-9018-a7f2d14602a9-c000.snappy.parquet
part-00000-36eed4ab-b8c4-4421-adc6-76560699f6f5-c000.snappy.parquet
part-00000-dde601ad-1b49-4b78-a658-865e54d28fb7-c000.snappy.parquet
part-00001-eedddae2-fb96-4ce9-9000-566456cd5e8e-c000.snappy.parquet
_spark_metadata
```

可以使用 `strings` 命令查看文件内的字符串, 具体如下:

```sh
$ strings part-00003-89584d0a-db83-467b-84d8-53d43baa4755-c000.snappy.parquet
```


## References

- [厦门大学 - 林子雨 - Spark 编程基础 (Python 版)](https://study.163.com/course/introduction/1209408816.htm)
- [厦门大学 - 林子雨 - Spark 编程基础 (Python 版) - 课件 ](http://dblab.xmu.edu.cn/post/12157/#kejianxiazai)

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
