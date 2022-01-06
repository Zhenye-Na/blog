---
layout: article
title: "Design Patterns: Proxy Pattern"
date: 2022-01-06
modify_date: 2022-01-06
excerpt: "With you as my proxy, I will be able to triple the amount of lunch money I can extract from friends!"
tags: [Design Patterns, Proxy Pattern, Object-Oriented Design]
mathjax: false
mathjax_autoNumber: false
key: design-patterns-proxy-pattern
---


## Intent

Proxy pattern provides a surrogate or placeholder for another object to control access to it. This help control the access to the real object. You can think of proxy to real object as puppet to the person who is in real power.

## Motivation

Suppose you have a small file to read, ~100 lines, the naive approach to read the file and process may look similar to the following Pseudocode:

```
for line in readFile("filename.ext"):
    process(line)
```

Since the file is not large, this solution may work fine.

However, if the requirements changed:

1. The file is pretty large. ~ 1M lines
2. The processing may last for the entire file or a few lines and then stops

Will the above solution still on the table? I personally doubt.

There is a better concept for this, which is called [`iterator`](https://www.baeldung.com/java-iterator). Behind the scenes, it introduces another concept which is similar to the meaning, lazy loading, where this may be more popular in Front-end development.


Lazy loading is the practice of delaying load or initialization of resources or objects until they're actually needed to improve performance and save system resources.
{:.info}

Similarly, we can apply this "idea" when we do for object creation, and only forward the request to the real object when client's code wanna retrieve or alter something.


***

Another good example is in the Gang of Four - Design Patterns book:

When you are developing a text editor, like Microsoft Word or Markdown editor. You can upload and change the image during the editor. But you dont wanna create all the objects that refer to the image creation, updates, etc.

What you can do is that use an `ImageProxy` which pretends to be a real image, but not, and forward a `display` request or `crop` request to the real image when these methods are invoked.

For a pretty expensive object, during creation, we can do the creation *on demand* - *lazy initialization*.
{:.info}

This "expensive object"could also be a third-party library or tools, like a local DynamoDB container. (?)


## Applicability

There are four different types of Proxy pattern:

1. Remote proxy
   1. provides a local representative of an object in a different address space.
      1. one example which gives the feeling similar to this proxy pattern is the [local version of AWS DynamoDB](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.html). though this may not the perfect example
2. Virtual Proxy
   1. creates expensive objects on demand
      1. delays the time creating the object, only create when you need communicate with the real object
3. Protection Proxy
   1. controls access to the real object
      1. no detailed example on code level. However, I think AWS Bastion Host has some similarity to this type of Proxy pattern. => to communicate with the production server, you need to pass the Bastion Host "proxy". though this may not the perfect example
4. Smart reference
   1. checking the reference to the real object so that it could be freed automatically when no references to it =? smart pointers
   2. loading a persistent object into memory when it is first referenced => Caching Proxy


## References

- [Proxy Pattern - Refactoring.Guru](https://refactoring.guru/design-patterns/proxy)
- [Design Patterns: Elements of Reusable Object-Oriented Software](https://www.amazon.com/Design-Patterns-Elements-Reusable-Object-Oriented/dp/0201633612)
- [Head First Design Patterns](https://www.amazon.com/Head-First-Design-Patterns-Object-Oriented/dp/149207800X/ref=pd_lpo_1?pd_rd_i=149207800X&psc=1)
