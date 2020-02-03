---
layout: article
title: "了解非关系型数据库 NoSQL - MongoDB | 安装使用以及CRUD 操作"
date: 2020-01-27
modify_date: 2020-01-28
excerpt: "Introduction to MongoDB, installation and CRUD operations with mongoose"
tags: [MongoDB, NoSQL]
mathjax: false
mathjax_autoNumber: false
key: intor-to-mongodb
---


# 了解非关系型数据库 NoSQL - MongoDB | 安装使用以及CRUD 操作

[TOC]

## MongoDB 数据库 CRUD 操作

![](https://i.ytimg.com/vi/nigPkP6QeTk/maxresdefault.jpg)


MongoDB 数据模型是面向<u>文档</u>的，所谓文档就是一种类似于 JSON 的结构，简单理解 MongoDB 这个数据库中存在的是各种各样的 JSON（BSON）



- 数据库 (database)
  - 数据库是一个仓库，存储集合 (collection)
- 集合 (collection)
  - 类似于数组，在集合中存放文档
- 文档 (document)
  - 文档型数据库的最小单位，通常情况，我们存储和操作的内容都是文档



在 MongoDB 中，数据库和集合都不需要手动创建，当我们创建文档时，如果文档所在的集合或者数据库不存在，**则会自动创建数据库或者集合**



### 数据库 (databases) 管理语法

| 操作                                            | 语法                             |
| ----------------------------------------------- | -------------------------------- |
| 查看所有数据库                                  | `show dbs;` 或 `show databases;` |
| 查看当前数据库                                  | `db;`                            |
| 切换到某数据库 (**若数据库不存在则创建数据库**) | `use <db_name>;`                 |
| 删除当前数据库                                  | `db.dropDatabase();`             |



### 集合 (collection) 管理语法

| 操作         | 语法                                        |
| ------------ | ------------------------------------------- |
| 查看所有集合 | `show collections;`                         |
| 创建集合     | `db.createCollection("<collection_name>");` |
| 删除集合     | `db.<collection_name>.drop()`               |



### MongoDB 的 CRUD 增删改查

> https://docs.mongodb.com/manual/crud/


#### 创建 Create

> Create or insert operations add new [documents](https://docs.mongodb.com/manual/core/document/#bson-document-format) to a [collection](https://docs.mongodb.com/manual/core/databases-and-collections/#collections). If the collection does **not** currently exist, insert operations will create the collection.



- 使用 `db.<collection_name>.insertOne()` 向集合中添加*一个文档*, 参数一个 json 格式的文档
- 使用 `db.<collection_name>.insertMany()` 向集合中添加*多个文档*, 参数为 json 文档数组


![](https://docs.mongodb.com/manual/_images/crud-annotated-mongodb-insertOne.bakedsvg.svg)



```javascript
// 向集合中添加一个文档
db.collection.insertOne(
   { item: "canvas", qty: 100, tags: ["cotton"], size: { h: 28, w: 35.5, uom: "cm" } }
)
// 向集合中添加多个文档
db.collection.insertMany([
   { item: "journal", qty: 25, tags: ["blank", "red"], size: { h: 14, w: 21, uom: "cm" } },
   { item: "mat", qty: 85, tags: ["gray"], size: { h: 27.9, w: 35.5, uom: "cm" } },
   { item: "mousepad", qty: 25, tags: ["gel", "blue"], size: { h: 19, w: 22.85, uom: "cm" } }
])
```



注：当我们向 collection 中插入 document 文档时，如果没有给文档指定 `_id` 属性，那么数据库会为文档自动添加 `_id` field, 并且值类型是 `ObjectId(blablabla)`, 就是文档的唯一标识



#### 查询 Read



- 使用 `db.<collection_name>.find()` 方法对集合进行查询, 接受一个 json 格式的查询条件. 返回的是一个数组
- `db.<collection_name>.findOne()` 查询集合中符合条件的<u>第一个</u>文档，返回的是一个对象



![](https://docs.mongodb.com/manual/_images/crud-annotated-mongodb-find.bakedsvg.svg)



可以使用 `$in` 操作符表示*范围查询*

```javascript
db.inventory.find( { status: { $in: [ "A", "D" ] } } )
```



多个查询条件用逗号分隔, 表示 `AND` 的关系

```javascript
db.inventory.find( { status: "A", qty: { $lt: 30 } } )
```



等价于下面 sql 语句

```mysql
SELECT * FROM inventory WHERE status = "A" AND qty < 30
```



使用 `$or` 操作符表示后边数组中的条件是OR的关系

```javascript
db.inventory.find( { $or: [ { status: "A" }, { qty: { $lt: 30 } } ] } )
```



等价于下面 sql 语句

```mysql
SELECT * FROM inventory WHERE status = "A" OR qty < 30
```



联合使用 `AND` 和 `OR` 的查询语句

```javascript
db.inventory.find( {
     status: "A",
     $or: [ { qty: { $lt: 30 } }, { item: /^p/ } ]
} )
```



#### 更新 Update

- 使用 `db.<collection_name>.updateOne(<filter>, <update>, <options>)` 方法修改一个匹配 `<filter>` 条件的文档
- 使用 `db.<collection_name>.updateMany(<filter>, <update>, <options>)` 方法修改所有匹配 `<filter>` 条件的文档
- 使用 `db.<collection_name>.replaceOne(<filter>, <update>, <options>)` 方法替换一个匹配 `<filter>` 条件的文档
- `db.<collection_name>.update(查询对象, 新对象)` 默认情况下会使用新对象替换旧对象



其中 `<filter>` 参数与查询方法中的条件参数用法一致.



如果需要修改指定的属性，而不是替换需要用“修改操作符”来进行修改

- `$set` 修改文档中的制定属性



其中最常用的修改操作符即为`$set`和`$unset`,分别表示赋值和取消赋值.

```javascript
db.inventory.updateOne(
    { item: "paper" },
    {
        $set: { "size.uom": "cm", status: "P" },
        $currentDate: { lastModified: true }
    }
)
db.inventory.updateMany(
    { qty: { $lt: 50 } },
    {
        $set: { "size.uom": "in", status: "P" },
        $currentDate: { lastModified: true }
    }
)
```

> - uses the [`$set`](https://docs.mongodb.com/manual/reference/operator/update/set/#up._S_set) operator to update the value of the `size.uom` field to `"cm"` and the value of the `status` field to `"P"`,
> - uses the [`$currentDate`](https://docs.mongodb.com/manual/reference/operator/update/currentDate/#up._S_currentDate) operator to update the value of the `lastModified` field to the current date. If `lastModified` field does not exist, [`$currentDate`](https://docs.mongodb.com/manual/reference/operator/update/currentDate/#up._S_currentDate) will create the field. See [`$currentDate`](https://docs.mongodb.com/manual/reference/operator/update/currentDate/#up._S_currentDate) for details.



`db.<collection_name>.replaceOne()` 方法替换除 `_id` 属性外的所有属性,其`<update>`参数应为一个全新的文档.

```
db.inventory.replaceOne(
    { item: "paper" },
    { item: "paper", instock: [ { warehouse: "A", qty: 60 }, { warehouse: "B", qty: 40 } ] }
)
```



##### 修改操作符

| Name                                                         | Description                                                  |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| [`$currentDate`](https://docs.mongodb.com/manual/reference/operator/update/currentDate/#up._S_currentDate) | Sets the value of a field to current date, either as a Date or a Timestamp. |
| [`$inc`](https://docs.mongodb.com/manual/reference/operator/update/inc/#up._S_inc) | Increments the value of the field by the specified amount.   |
| [`$min`](https://docs.mongodb.com/manual/reference/operator/update/min/#up._S_min) | Only updates the field if the specified value is less than the existing field value. |
| [`$max`](https://docs.mongodb.com/manual/reference/operator/update/max/#up._S_max) | Only updates the field if the specified value is greater than the existing field value. |
| [`$mul`](https://docs.mongodb.com/manual/reference/operator/update/mul/#up._S_mul) | Multiplies the value of the field by the specified amount.   |
| [`$rename`](https://docs.mongodb.com/manual/reference/operator/update/rename/#up._S_rename) | Renames a field.                                             |
| [`$set`](https://docs.mongodb.com/manual/reference/operator/update/set/#up._S_set) | Sets the value of a field in a document.                     |
| [`$setOnInsert`](https://docs.mongodb.com/manual/reference/operator/update/setOnInsert/#up._S_setOnInsert) | Sets the value of a field if an update results in an insert of a document. Has no effect on update operations that modify existing documents. |
| [`$unset`](https://docs.mongodb.com/manual/reference/operator/update/unset/#up._S_unset) | Removes the specified field from a document.                 |



#### 删除 Delete

- 使用 `db.collection.deleteMany()` 方法删除所有匹配的文档.
- 使用 `db.collection.deleteOne()` 方法删除单个匹配的文档.
- `db.collection.drop()`
- `db.dropDatabase()`



```
db.inventory.deleteMany( { qty : { $lt : 50 } } )
```



> Delete operations **do not drop indexes**, even if deleting all documents from a collection.



一般数据库中的数据都不会真正意义上的删除，会添加一个字段，用来表示这个数据是否被删除



### 文档排序和投影 (sort & projection)

#### 排序

在查询文档内容的时候，默认是按照 `_id` 进行排序

我们可以用 `$sort` 更改文档排序规则

```
{ $sort: { <field1>: <sort order>, <field2>: <sort order> ... } }
```

For the field or fields to sort by, set the sort order to `1` or `-1` to specify an ascending or descending sort respectively, as in the following example:

```javascript
db.users.aggregate(
   [
     { $sort : { age : -1, posts: 1 } }
   ]
)
```



#### `$sort` Operator and Memory

##### `$sort` + `$limit` Memory Optimization

When a [`$sort`](https://docs.mongodb.com/manual/reference/operator/aggregation/sort/index.html#pipe._S_sort) precedes a [`$limit`](https://docs.mongodb.com/manual/reference/operator/aggregation/limit/#pipe._S_limit) and there are no intervening stages that modify the number of documents, the optimizer can coalesce the [`$limit`](https://docs.mongodb.com/manual/reference/operator/aggregation/limit/#pipe._S_limit) into the [`$sort`](https://docs.mongodb.com/manual/reference/operator/aggregation/sort/index.html#pipe._S_sort). This allows the [`$sort`](https://docs.mongodb.com/manual/reference/operator/aggregation/sort/index.html#pipe._S_sort) operation to **only maintain the top `n` results as it progresses**, where `n` is the specified limit, and ensures that MongoDB only needs to store `n` items in memory. This optimization still applies when `allowDiskUse` is `true` and the `n` items exceed the [aggregation memory limit](https://docs.mongodb.com/manual/core/aggregation-pipeline-limits/#agg-memory-restrictions).

Optimizations are subject to change between releases.

> 有点类似于用 heap 做 topK 这种问题，只维护 k 个大小的 heap，会加速 process



#### 投影

有些情况，我们对文档进行查询并不是需要所有的字段，比如只需要 id 或者 用户名，我们可以对文档进行“投影”

- `1` - display
- `0` - dont display

```javascript
db.users.find( {}, {username: 1} )

db.users.find( {}, {age: 1, _id: 0} )
```



## 文档间的对应关系

- 一对一 (One To One)
- 一对多 (One To Many)
- 多对多 (Many To Many)



举个例子，比如“用户-订单”这个一对多的关系中，我们想查询某一个用户的所有或者某个订单，我们可以

```javascript
var user_id = db.users.findOne( {username: "username_here"} )._id
db.orders.find( {user_id: user_id} )
```



## 在 Nodejs 中使用 MongoDB - mongoose

mongoose 是一个对象文档模型（ODM）库

> https://mongoosejs.com/

- 可以为文档创建一个模式结构（Schema）
- 可以对模型中的对象/文档进行验证
- 数据可以通过类型转换转换为<u>对象</u>模型
- 可以使用中间件应用业务逻辑



### mongoose 提供的新对象类型

- Schema
  - 定义约束了数据库中的文档结构
  - 个人感觉类似于 SQL 中建表时事先规定表结构
- Model
  - 集合中的所有文档的表示，相当于 MongoDB 数据库中的 collection
- Document
  - 表示集合中的具体文档，相当于集合中的一个具体的文档



### 简单使用 Mongoose

> https://mongoosejs.com/docs/guide.html



```javascript
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true});

const Cat = mongoose.model('Cat', { name: String });

const kitty = new Cat({ name: 'Zildjian' });
kitty.save().then(() => console.log('meow'));
```



**监听 MongoDB 数据库的连接状态**

在 mongoose 对象中，有一个属性叫做 `connection`，该对象就表示数据库连接。通过监视该对象的状态，可以来监听数据库的连接和端口

```javascript
mongoose.connection.once("open", function() {

});

mongoose.connection.once("close", function() {

});
```



### Mongoose 的 CRUD

首先定义一个 Schema

```javascript
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var blogSchema = new Schema({
    title:  String, // String is shorthand for {type: String}
    author: String,
    body:   String,
    comments: [{ body: String, date: Date }],
    date: { type: Date, default: Date.now },
    hidden: Boolean,
    meta: {
        votes: Number,
        favs:  Number
    }
});
```



然后在 Schema 基础上创建 Model

```javascript
var Blog = mongoose.model('Blog', blogSchema);
// ready to go!
```



像数据库中插入文档数据

```javascript
Blog.create({
  title: "title"
  ...
}, function (err){
  if (!err) {
    console.log("successful")
  }
});
```



查询

```javascript
// named john and at least 18
MyModel.find({ name: 'john', age: { $gte: 18 }});
```



## References

- https://mongoosejs.com/docs/guides.html
- https://www.bilibili.com/video/av59604756

