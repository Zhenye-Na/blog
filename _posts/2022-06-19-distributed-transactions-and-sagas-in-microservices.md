---
layout: article
title: "Distributed Transactions and Sagas in Microservices"
date: 2022-06-19
modify_date: 2022-06-19
excerpt: "How to implement workflows for chaining multiple microservices"
tags: [Microservice, Workflow, Distributed Transaction, Saga, AWS]
mathjax: false
mathjax_autoNumber: false
key: distributed-transactions-and-sagas
---

> In this article, I will explain the what is Distributed Transaction, what is Saga and how can we implement the Saga Pattern with AWS Services/Tools
> 
> But before we start, here are some books I would like to recommend you to read if you are interested and understand in more detailed way:
> 
> - [O'Reilly - Building Microservices, 2nd Edition (Chapter 6: Workflow)](https://www.oreilly.com/library/view/building-microservices-2nd/9781492034018/)
> - [Manning Publication - Microservices Patterns With examples in Java (Chapter 4: Managing Transactions with Sagas)](https://www.oreilly.com/library/view/building-microservices-2nd/9781492034018/)


## Introduction

Generally speaking, it is very common to see that multiple microservices are needed together to implement some business logic. For example, the image below inllustrates an example that how an online shopping application implements the "Order Fullfillment workflow" with multiple microservices. As you may know, each step depends on the success execution of previous step.

<div align="center">
  <img src="https://raw.githubusercontent.com/Zhenye-Na/img-hosting-picgo/master/img/order-fullfillment-workflow-example.png">
</div>

Now, the question comes to what do we do if one thing goes wrong in this entire workflow and how can we mitigate the impact of the workflow failure? You might heard of a concept in Software Engineering called "Transactions".

Transactions in this context has the meaning or implies that, serveral actions or requests are binded together to be treated as one single unit. Each action in this overall unit executes successfully, then the "single unit" is treated as running successfully. However, if any step failed, then the whole unit is marked as failed. Since it failed then we might need to clean up some stale resources - Compensation, which we will cover later.

We can utilize database transactions to ensure that the series of changes could be made successfully. Let's start with what is ACID Transactions and Transactions involved multiple tables.


***

## ACID Transactions

ACID is a commonly used acronym for a property that database transactions, which represents


| Property    	| Explanation                                                                                                                                                                                                                                                                                                               	|
|-------------	|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------	|
| Atomicity   	| Each statement in a transaction (to read, write, update or delete data) is treated as a single unit. Either the entire statement is executed, or none of it is executed. This property prevents data loss and corruption from occurring if, for example, if your streaming data source fails mid-stream.                  	|
| Consistency 	| Ensures that transactions only make changes to tables in predefined, predictable ways. Transactional consistency ensures that corruption or errors in your data do not create unintended consequences for the integrity of your table.                                                                                    	|
| Isolation   	| When multiple users are reading and writing from the same table all at once, isolation of their transactions ensures that the concurrent transactions don’t interfere with or affect one another. Each request can occur as though they were occurring one by one, even though they're actually occurring simultaneously. 	|
| Durability  	| Ensures that changes to your data made by successfully executed transactions will be saved, even in the event of system failure.                                                                                                                                                                                          	|

With the above restrictions, things work pretty well with a single database or single table, collection, etc.. But what about there are two tables that are involved in the action?


### ACID without Atomicity


Take the following image as an example: when the customer of `customerId=123` has been verified, then the corresponding row in `Customer` table will update the `Status` column from `PENDING` to `VERIFIED`. Meanwhile `customerId=123` in `PendingEnrollments` table should be removed since the customer is already verified.

![](https://raw.githubusercontent.com/Zhenye-Na/img-hosting-picgo/master/img/transaction-boundary.png)

When this operation is done in one "boundary" which is a single database, it is easily achievable. However, when it comes to the case that responsibilities are seperated. It actually becomes to a tricky question.

![](https://raw.githubusercontent.com/Zhenye-Na/img-hosting-picgo/master/img/single-transcation-boundary.png)

1. What if we already updated in `Customer` table but the request to delete record in `Enrollment` table failed ?
2. What if we already removed the record in `Enrollment` table but the update request to `Customer` timed out because of some database issues ?


***

## Distributed Transactions

As we mentioned above, Distributed Transactions may leave us inconsistent data, so let's see one of the most common algorithms for implementing distributed transactions

### Two-Phase Commit (2PC)

![](https://raw.githubusercontent.com/Zhenye-Na/img-hosting-picgo/master/img/distributed-transactions-2pc.png)

This article, [Distributed Transactions & Two-phase Commit](https://medium.com/geekculture/distributed-transactions-two-phase-commit-c82752d69324) explains what is Two-Phase Commit pretty well. In summary, 2PC is broken down into two phases:

1. Voting Phase
    1. Coordinator contacts all the workers to ask if any workers will be included in the transactions and get the confirmation
2. Commit Phase
    1. A rollback message will be sent if any worker does not vote for the commit, so anything left could be cleaned up

Another good point mentioned in the book: [O'Reilly - Building Microservices, 2nd Edition (Chapter 6: Workflow)](https://www.oreilly.com/library/view/building-microservices-2nd/9781492034018/) regarding the communication of Coordinator and Worker is that:

If the latency between Cordinator and participated workers increases, the worker will process the request more slowly. Then we will observe the intermediate state during the transaction with some probability. This violates the "Isolation" property from ACID.

So the main take away for learning the 2PC algorithm is that:

1. 2PC will inject a large amount of latency to your system, since each worker will have to apply a Lock to your database table to perform any operations
2. The longer the operation takes, the higher probabilty you will see intermediate state

So, genrally, dont use this algorithm

***

## Sagas

TODO


***

### Orchestrated Saga

TODO


In summary:

- Centralized corordination and tracking
- Follow original solution space





***

### Choreography Saga

TODO

Event-based

In summary

- Avoid centralized coordination
- Loosely coupled model
- Complicated progress tracking




***

## Implement Saga Pattern using AWS Step Functions

TODO

![](https://raw.githubusercontent.com/Zhenye-Na/img-hosting-picgo/master/img/step-functions-sage-pattern.png)


***

## References

1. [Microservice Architecture - Pattern: Saga](https://microservices.io/patterns/data/saga.html)
2. [Saga distributed transactions pattern](https://docs.microsoft.com/en-us/azure/architecture/reference-architectures/saga/saga)
3. [Example: Saga transaction with compensation](https://workflow-core.readthedocs.io/en/latest/sagas/)
4. [Saga pattern in AWS](https://docs.aws.amazon.com/prescriptive-guidance/latest/modernization-data-persistence/saga-pattern.html)
5. [Implement the serverless saga pattern by using AWS Step Functions](https://docs.aws.amazon.com/prescriptive-guidance/latest/patterns/implement-the-serverless-saga-pattern-by-using-aws-step-functions.html)
6. [Building a serverless distributed application using a saga orchestration pattern](https://aws.amazon.com/blogs/compute/building-a-serverless-distributed-application-using-a-saga-orchestration-pattern/)
7. [Saga Pattern: Misconceptions and Serverless Solution on AWS](https://aws.plainenglish.io/saga-pattern-misconceptions-and-serverless-solution-on-aws-3bee0c96212f)
