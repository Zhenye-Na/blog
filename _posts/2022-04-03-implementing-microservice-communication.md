---
layout: article
title: "Implementing Microservice Communication"
date: 2022-04-03
modify_date: 2022-04-21
excerpt: "Implementing Microservice Communication effectively"
tags: [Microservice]
mathjax: false
mathjax_autoNumber: false
key: implementing-microservice-communication
---

> This article is a follow-up from my previous post: [Microservice Communication Patterns](https://zhenye-na.github.io/blog/2022/03/05/microservice-communication-patterns.html)
> 
> Feel free to check that out first then come back to read the article.

## Technology Choices

From the previous article, we know that there are two typical patterns for inter-microservices communication:

- Synchronous blocking
- Asynchronous unblocking

In order to implement, there are several commonly used technology choices to select:

<div align="center">
  <img src="https://content.altexsoft.com/media/2020/05/word-image-52.png" width="80%" >
  <p>Image source: <a href="https://www.altexsoft.com/blog/soap-vs-rest-vs-graphql-vs-rpc/">https://www.altexsoft.com/blog/soap-vs-rest-vs-graphql-vs-rpc/</a></p>
</div>

1. **Remote Procedure Calls (RPC)**
   1. Local method invocation to a remote process/service.
   2. Common framework options for RPC development: [gRPC](https://grpc.io/), [Smithy](https://awslabs.github.io/smithy/)
2. **REST**
   1. RESTful API with Http verbs
3. **GraphQL**
   1. Define custom queries that can fetch information from multiple downstream services and aggregate/filter out the needed information
      1. Github is utilizing GraphQL, see [ref](https://docs.github.com/en/graphql)
4. **Message brokers**
   1. Message queue/middleware
      1. This could be open source tool like Kafka, RabbitMQ, or AWS provided tools like SNS Topic and SQS Queue

<div align="center">
  <img src="https://content.altexsoft.com/media/2020/05/word-image-53.png" width="80%" >
  <p>Image source: <a href="https://www.altexsoft.com/blog/soap-vs-rest-vs-graphql-vs-rpc/">https://www.altexsoft.com/blog/soap-vs-rest-vs-graphql-vs-rpc/</a></p>
</div>

### Remote Procedure Calls

For protocols that fall into RPC land, most of them require the specific schema. Check the image below

The schema that referred to in the context of RPC is called **Interface Definition Language** (IDL), (with SOAP, it is called Web Service Definition Language (WSDL)). The usage of this schema is that it make easier for developers to generate the client and server stubs for different tech stack. This behavior solves the problem that if you have an exposed RPC Java server, then you can utilize the feature provided by different IDL frameworks to generate a Golang client from the schema you defined. For example, the following is an example from [gRPC](https://grpc.io/)

```go
// The greeting service definition.
service Greeter {
  // Sends a greeting
  rpc SayHello (HelloRequest) returns (HelloReply) {}
}

// The request message containing the user's name.
message HelloRequest {
  string name = 1;
}

// The response message containing the greetings
message HelloReply {
  string message = 1;
}
```

Once you defined the input/output or request/response schema for your API, you can easily generate the cleint stubs based on the tech stack you would like to provide, for people to use.


#### Pros and Cons

- **Pros**
    - Abstraction. It provides the abstraction, since the invocation to your service or your library is just like a "inter-process" call, but acutally it is executed by a different process on difference server
    - Simplification. Client-code generation can be easily done with no extra effort
- **Cons**
    - Remote call is expensive. With RPC, the cost of marshaling and unmarshaling input/output payloads could be very significant
    - Vulnerable. Networks are always not reliable


### REST

REST is all about "resources". You might hear of this multiple times, but what is a resource in REST?

> In my opinion, every object that we can obtain information from, like `entity` in database is a "resource" in REST

```
# create a post
POST /posts

# obtain information of a post
GET /posts/<id>

# obtain tagging information of a post
GET /posts/<id>/tags
```

To know more, you can check [What is REST](https://restfulapi.net/) by Lokesh Gupta.

### GraphQL

GraphQL is a new technology in recent years. It helps user to make a query that avoid the need to make _multiple_ requests to retrieve the _same information_.

For example, suppose `Amazon.com` would like to migrate to use GraphQL, and in the `Orders` page. It will show your recent products you ordered, together with shipping information. Suppose `Amazon.com` adopts the microservice architecture, then:

1. In order to render the view, backend system need to query different component to retrieve the needed information
    1. `Shipping` service to check what is the status of this order
    2. `Payment` service to check if this order is completed, if not we might need a button to resume payment

But with GraphQL, this is perfectly solved because we can use GraphQL to send out a single request that query the needed information, as aggregated query is also supported in GraphQL

### Message brokers

There are two categories of Message brokers:

1. Queues
    1. Queue is `1:1` relationship
    2. A producer puts the `message` into a queue, then the consumer reads the `message` from it
2. Topics
    1. Topic is `1:Many` relationship
    2. A producer puts the `message` into a topic, the consumer group which subsribes to the topic will receive a copy of the `message`

Topics work well in a event-based system while queue work well in a request/response system


### Asynchronous in AWS

AWS offers solutions for almost each communication pattern metioned above:

- Message brokers
    - Topic-based: SNS topics
    - Queue-based: SQS Queue
    - MSK: Amazon Managed Streaming for Apache Kafka
- Event-based
    - EventBridge
- Generally asychronous
    - Async Step Functions workflow
    - Async Lambda invocation
