---
layout: article
title: "Microservice Communication Patterns"
date: 2022-03-05
modify_date: 2022-03-05
excerpt: "Different patterns for microservices to communicate"
tags: [Microservice]
mathjax: false
mathjax_autoNumber: false
key: microservice-communication-patterns
---

![](https://raw.githubusercontent.com/Zhenye-Na/img-hosting-picgo/master/img/service-mesh-illustration.png)

> Image source: https://us.nttdata.com/en/blog/tech-blog/service-mesh-use-cases

In the image above, we can see

- API Gateway: external to internal microservices
- Service Mesh: inter-internal microservices

Today, we are focusing on different patterns/style of communication on "Service Mesh" level

There are several ways for inter-microservice communication.

- Synchronous Blocking
  - serviceA calls serviceB and blocks upcoming operation and waits for the results
- Asynchronous Non-blocking
  - Request-response: serviceA sends a request to serviceB and wait for the response
  - Event-driven: serviceA emits out a "event" with context, but serviceA is unaware of which service will pick up the event and processing
  - Common data: communicate with a shared data, like a shared database

It is hard to select the best one for your business logic, sometimes you might even mix and match. Next, let's dive deep for each pattern and let's see the pros and cons of each pattern.

## Synchronous Blocking

A microservice send an API call/request to downstream service and blocks until the call has complete processing.

**Pros**

1. easy to understand, like reading codes from top to bottom
2. monolithic way

**Cons**

1. if the downstream service is temporarily unreachable, the API call will fail
   1. same idea, if the upstream service is unable to receive the response
2. latency issue when invocation chain is long (serviceA -> serviceB -> serviceC -> serviceD)

***

## Asychronous Non-blocking

### Request-response Pattern

By term of request-response you might think this is similar to the synchronous blocking pattern. I would not deny since theoratically there is some similarity, but when you try to implement, you will find out the difference dramatically.

With this pattern, microservice sends a request to the downtream service to process something, and expects to receive a response that contains the processing results, in a async way, like message broker or message queue

**Pros**

1. If serviceA need several downstream services to finish this task, we can parallelized all the requests if there is no dependency for each downstream service
2. good for retry


**Cons**

1. We need a better way to define the "expiration time" or time-out handling, to avoid issues that the system is blocked and may never get back to the original caller


***

### Event-Driven Pattern

> When it comes to event-driven the first thing I think about is Node.js

With Event-Driven pattern, the microservice emits an event and it may or may not be received by downstream service. Also, the event emitter is unaware of which service will pick up the event, it just emitted the event. In this way, the coupling is greatly reduced since we want "High cohesion and low coupling".


#### What should be in the event ?

It should be a fully detailed events contains all the information that downstream service need to know, otherwise, the downstream service have to make an API call to the event emitter to request some context data, then what is the point of this pattern ?

For example, from `Order` service to `Shipping` service, what kind of information should we include in the event? just a orderId and customerId? of course not, we should include something like, shipping address, what is the ETA for delievery (shipping priority) etc. So that `Shipping` can continue processing the order.

***

### Common Data Pattern

This is pattern is called common data pattern, basically you will see this pattern when using data lake or data warehouse. In both case, the same record can be retrieved and updated in two or more microservices.

**Pros**

1. very easy to understand and implement


**Cons**

1. latency: the polling mechanism is the problem
2. common data store become part of the comupling, one the structure is defined, cannot be changed easily
3. we need a rule on which service can alter what kind of data


## References

[1]. [Building Microservices, 2nd Edition](https://www.oreilly.com/library/view/building-microservices-2nd/9781492034018/)
