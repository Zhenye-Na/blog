---
layout: article
title: "What you don't know about AWS API Gateway"
date: 2022-03-13
modify_date: 2022-03-13
excerpt: "Secure your microservices with AWS API Gateway for your Public-facing APIs"
tags: [AWS, API Gateway]
mathjax: false
mathjax_autoNumber: false
key: what-you-dont-know-about-aws-api-gateway
---

## Access Control on API Gateway

By default, API Gateway will accept all requests to your services. This means there will be a lot of malicious requests/attacks to your service and API Gateway is the role to "filter out" those and secure your infrastructure.

> Zero Trust Model
>
> Zero Trust Model means that all edge services does not trust/approve incoming requests, until it can prove/establish trust in the backend system

API Gateway supports Zero Trust Model by using "Authorizers". They are considered as an "Interceptor" which check each request's identification. API Gateway applies "Facade Design Pattern" to the authorization implementation so that the authorization logic can be abstracted away.

> Not familiar wiht Facade Pattern? Check what I wrote before: [Design Patterns: Facade Pattern](https://zhenye-na.github.io/blog/2021/12/09/design-patterns-the-facade-pattern.html)

[![](https://mermaid.ink/img/pako:eNqNkTFPwzAQhf_KyVMqtUit1CUDUlIKqsSACmxejH1tLBI7OGdCqPrfuSQtRZ3wYvvpfe98voPQ3qBIxa70rS5UIHjcSicd8Gri2z6ouoB7pZXBUeyXsQE1We8gf7moeSJF9rSBh4ywVZ2ULotUBP9tMcAWPyI2BBtHGDTW5AMbkjF5IsXkkmPnfZDW2DSgvaPgSyj93moGbFWXWKEjNZSfMwizm9kt5H_4xb_5xTWPzpy7z5K1M_DaYGALO8anDsdVMvSphj6BbbW3jia_JEf2KkSGoVWOGiAP1n36dwQqEHq8r7oagdN3U1ci5LwH9s1aa6hIF_XX9CQY1fCAgupSWMJSTEWFoVLW8PQOfYIUHF2hFCkfDe5ULEkK6Y5sjbXh166N5X8XKYWIU6Ei-efO6fN99NxZxUOvRvH4A_6_rjY)](https://mermaid.live/edit#pako:eNqNkTFPwzAQhf_KyVMqtUit1CUDUlIKqsSACmxejH1tLBI7OGdCqPrfuSQtRZ3wYvvpfe98voPQ3qBIxa70rS5UIHjcSicd8Gri2z6ouoB7pZXBUeyXsQE1We8gf7moeSJF9rSBh4ywVZ2ULotUBP9tMcAWPyI2BBtHGDTW5AMbkjF5IsXkkmPnfZDW2DSgvaPgSyj93moGbFWXWKEjNZSfMwizm9kt5H_4xb_5xTWPzpy7z5K1M_DaYGALO8anDsdVMvSphj6BbbW3jia_JEf2KkSGoVWOGiAP1n36dwQqEHq8r7oagdN3U1ci5LwH9s1aa6hIF_XX9CQY1fCAgupSWMJSTEWFoVLW8PQOfYIUHF2hFCkfDe5ULEkK6Y5sjbXh166N5X8XKYWIU6Ei-efO6fN99NxZxUOvRvH4A_6_rjY)

There are three type of autorization methods

### IAM Autorizer

The most intuitive way to authorize the request, by signing your request using SigV4 of your AWS credentials. API Gateway will go to IAm and verify the request identity and decide if let the request pass in or not.

![](https://raw.githubusercontent.com/Zhenye-Na/img-hosting-picgo/master/img/api-gateway-iam-authorizer.png)

### AWS Cognito

In order to use Cognito for authorization, you must create a cognito user pool. Then you can use the `Authorizer` tab in API Gateway Console to select `Cognito` as the authorization method

- AWS Cognito return a JWT (JSON Web Token)
- User makes request to API Gateway with the JWT


### Customed Lambda Authorizer

If you or your oganization already has the implementation of the Authorization, you can leverage Lambda (AWS Serverless Function) as the authorization implementation of your APi Gateway.

Lambda authorizer requires identity information coming from request, so

- JWT that passed along in the request
- Request header or request body contains the identity information

## Infrastructure Security on API Gateway


### Rate Limitimg


> What is rate limiting and why we need it?
> 
> What Rate Limiting means on Wiki, [here](https://www.wikiwand.com/en/Rate_limiting)
> 
> In my opinion, it is a term that means that we "limit" the rate that this service can be accessed within a time unit.

Since API Gateway could serve as publicly facing, we should be aware of that our service could be suffered from a wider DDoS attack, which means a lot of traffic comes into your service and then if your server is not able to handle such many traffic, then it will "down".

In order to prevent this to happen, API Gateway gives us the ability to "limit" the access to your service to two important parameters:

1. Sustained request rate: average rate number which your application gets request over a time unit
2. Burst request rate: same meaning as itself, this is a buffer which helps your application in case there is a large amount of requests comes in (request spikes), over a time unit


Token Bucket Algorithm is used by API Gateway team under the hood, to read more, [here](https://www.wikiwand.com/en/Token_bucket)


If you want your Rate Limiting to be more fine-grained, there is also a stage-level or method-level rate limiting that API Gateway supports

### Mutual TLS

> This topic will be covered in more details in the upcoming post.

TLS helps validate the server uysing a standardized handshake and digital certificates signed by trusted certificate authorities for each domain.

mTLS asks each client to authenticate every request they sent in to increase the security level

> mTLS is commonly used for B2B applications

## References

- [Security and Microservice Architecture on AWS](https://www.oreilly.com/library/view/security-and-microservice/9781098101459/)
- [Throttle API requests for better throughput](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-request-throttling.html)
- [Token Bucket Rate Limiting](http://intronetworks.cs.luc.edu/current/html/tokenbucket.html)
