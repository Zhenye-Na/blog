---
layout: article
title: "Implementing Microservice Communication"
date: 2022-04-03
modify_date: 2022-04-03
excerpt: "Implementing Microservice Communication effectively"
tags: [Microservice]
mathjax: false
mathjax_autoNumber: false
key: implementing-microservice-communication
---

> This article is a follow-up from my previous post: [Microservice Communication Patterns](https://zhenye-na.github.io/blog/2022/03/05/microservice-communication-patterns.html) Feel free to check that out first then come back to read the article.

## Technology Choices

From the previous article, we know that there are two typical patterns for inter-microservices communication:

- Synchronous blocking
- Asynchronous unblocking

In order to implement, there are several commonly used technology choices to select:

1. **Remote Procedure Calls (RPC)**
   1. Local method invocation to a remote process/service.
   2. Common options: [gRPC](https://grpc.io/), [Smithy](https://awslabs.github.io/smithy/)
2. **REST**
   1. RESTful API with Http verbs
3. **GraphQL**
   1. Define custom queries that can fetch information from multiple downstream services and aggregate/filter out the needed information
      1. Github is utilizing GraphQL, see [ref](https://docs.github.com/en/graphql)
4. **Message brokers**
   1. Message queue/middleware
      1. This could be open source tool like Kafka, RabbitMQ, or AWS provided tools like SNS Topic and SQS Queue

### Remote Procedure Calls


### REST


### GraphQL


### Message brokers