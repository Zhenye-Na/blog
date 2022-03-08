---
layout: article
title: "AWS DynamoDB Best Practices"
date: 2022-02-13
modify_date: 2022-02-13
excerpt: "Tips for working with AWS DynamoDB"
tags: [AWS, DynamoDB]
mathjax: false
mathjax_autoNumber: false
key: aws-dynamodb-tips
---

## DynamoDB

Just a quick overview, what is DynamoDB ?

DynamoDB is a fully managed **NoSQL database** (key-value pair and document) service provided by AWS that offers fast and predictable performance with seamless scalability
{:.info}


## Item 1: Prefer Query to Scan

First, let's check the definition of scan and query operation in DynamoDB

- `Scan` operation always scans the **entire table or secondary index**. It then filters out values to provide the result you want.
- `Query` operation searches **only primary key attribute values** and supports a subset of comparison operators on key attribute values to refine the search process.

From here, we can easily tell that Scan operation is VERY slow/inefficient and resource consuming (since you need RCU to read all the items in the DDB). So you should design you DDB structure so that query operaion can fit almost all the case of your backend. In case it does not, you can always update your DDB design

What you can do:

- Utilize Partition Key and Sort Key for the most common request pattern
- Add LSI or GSI to accomodate advanced query patterns. BUT only add GSI/LSI when needed, since this consume RCU/WCU


## Item 2: Secondary Indexes

- Rule 1: Keep the number of indexes to a minimum
- Rule 2: If you have to use an Index, choose wisely

There are two types of secondary index in DynamoDB:

- **Global secondary index (GSI)**: An index with a **partition key** and a **sort key** that can be different from those on the base table.
  - A global secondary index is considered "global" because queries on the index can span all of the data in the base table, across all partitions.
- **Local secondary index (LSI)**: An index that has the **same partition key** as the base table, but a **different sort key**.
  - A local secondary index is "local" in the sense that every partition of a local secondary index is scoped to a base table partition that has the same partition key value.

So the basic difference is the "scope" of each index is different. GSI has the global view while LSI has view only those data share the same partition key

When you use these two types of indexes, there is also a difference when you try to retrieve data back

1. LSI supports Strongly Consistency and Eventual Consistency
   1. which will always return the latest version of records if you can enable this by changing the `ConsistentRead` property when sending out a query
2. GSI supports Eventual Consistency
   1. which might return a stale version of records, and you dont have the option to enable strong consistency

So, how can I choose the correct DDB index? I found this flow chart very helpful:

![](https://user-images.githubusercontent.com/6509926/72526710-a66b7c80-382c-11ea-8923-dbb9c9589881.png)

> Image source: https://www.dynamodbguide.com/local-or-global-choosing-a-secondary-index-type-in-dynamo-db/#the-too-long-didnt-read-version-of-choosing-an-index


## Item 3: `SaveBehavior` Configuration

When you use DynamoDB for CRUD operations, you will find out that DynamoDB does not have the actual "Update" concept. However, there is a `SaveBehavior` configuration which serves as the missed role in DynamoDB. Let's take a look.

```java
DynamoDBMapper mapper = new DynamoDBMapper(dynamoDBClient);

// SaveBehavior.UPDATE is the default value
mapper.save(something, new DynamoDBMapperConfig(SaveBehavior.UPDATE));
```

There are four different configurations for `SaveBehavior`

- `UPDATE` (default)
- `UPDATE_SKIP_NULL_ATTRIBUTE`
- `CLOBBER`
- `APPEND_SET`

Given this existing record and DynamoDB schema

| AttributeName 	| key    	| modeled_scalar 	| modeled_set 	| unmodeled 	|
|---------------	|--------	|----------------	|-------------	|-----------	|
| KeyType       	| Hash   	| Non-key        	| Non-key     	| Non-key   	|
| AttributeType 	| Number 	| String         	| String set  	| String    	|

```json
{
    "key" : "99",
    "modeled_scalar" : "foo", 
    "modeled_set" : [
        "foo0", 
        "foo1"
    ], 
    "unmodeled" : "bar" 
}
```

together with this POJO class object

```java
TestTableItem obj = new TestTableItem();
obj.setKey(99);
obj.setModeledScalar(null);
obj.setModeledSet(Collections.singleton("foo2");
```

***

**`SaveBehavior.UPDATE`**

`UPDATE` will not affect unmodeled attributes on a save operation, and a `null` value for the modeled attribute will **remove** it from that item in DynamoDB.

so basically after onvoking `mapper.save()`, the record in DDB will be as follows

```json
{
  "key" : "99",
  "modeled_set" : [
    "foo2"
  ], 
  "unmodeled" : "bar" 
}
```

You can see that `modeled_set` has been updated, but since `modeled_scalar` is passed in using a `null` value, so it is removed from DDB.

In this case. if you wanna use `SaveBehavior.UPDATE` to update something, you have to include all the fields with proper value in your DynamoDB POJO class. Otherwise, it will be removed from DDB table instead of keep them as is.

***

**`SaveBehavior.UPDATE_SKIP_NULL_ATTRIBUTES`**

`UPDATE_SKIP_NULL_ATTRIBUTES` is similar to `UPDATE`, except that it ignores any `null` value attribute(s) and will **NOT** remove them from that item in DynamoDB.

```json
{
  "key" : "99",
  "modeled_scalar" : "foo",
  "modeled_set" : [
    "foo2"
  ], 
  "unmodeled" : "bar" 
}
```

As you can find out, even though we set `modeled_scalar` to be `null`, this field is still persisted in DDB. So with this configuration, when you trying to update something with only specifying the hashKey and the field you wanna alter, it will properly update the field and keep the others the same without deleting.

***

**`SaveBehavior.CLOBBER`**

CLOBBER will _clear and replace all attributes_, including unmodeled ones

> (delete and recreate) on save.

```json
{
  "key" : "99", 
  "modeled_set" : [
    "foo2"
  ]
}
```

This is already self-explained. delete the record with same hashKey and re-create a new one with the specified fields.

***

**`SaveBehavior.APPEND_SET`**

`APPEND_SET` treats scalar attributes (String, Number, Binary) the same as UPDATE_SKIP_NULL_ATTRIBUTES does.

However, for **set attributes, it will append to the existing attribute value**, instead of overriding it.


```json
{
  "key" : "99",
  "modeled_scalar" : "foo",
  "modeled_set" : [
    "foo0", 
    "foo1", 
    "foo2"
  ], 
  "unmodeled" : "bar" 
}
```

Scalar attributes are kept, but set attributes are appended.

***

| SaveBehavior                	| On unmodeled attribute 	| On null-value attribute 	| On set attribute 	|
|-----------------------------	|------------------------	|-------------------------	|------------------	|
| UPDATE                      	| keep                   	| remove                  	| override         	|
| UPDATE_SKIP_NULL_ATTRIBUTES 	| keep                   	| keep                    	| override         	|
| CLOBBER                     	| remove                 	| remove                  	| override         	|
| APPEND_SET                  	| keep                   	| keep                    	| append           	|


## References

- [Best Practices for Querying and Scanning Data](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/bp-query-scan.html)
- [Local or global: Choosing a secondary index type in DynamoDB](https://www.dynamodbguide.com/local-or-global-choosing-a-secondary-index-type-in-dynamo-db/#the-too-long-didnt-read-version-of-choosing-an-index)
- [Using the SaveBehavior Configuration for the DynamoDBMapper](https://aws.amazon.com/blogs/developer/using-the-savebehavior-configuration-for-the-dynamodbmapper/)
