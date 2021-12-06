---
layout: article
title: "Design Patterns: Singleton Pattern"
date: 2021-12-05
modify_date: 2021-12-05
excerpt: "One instance, global acess, that is Singleton Pattern"
tags: [Design Patterns, Singleton Pattern, Object-Oriented Design]
mathjax: false
mathjax_autoNumber: false
key: design-patterns-singleton-pattern
---


## Intent

Ensure a class only has **one instance**, and provide a **global point of access** to it

Singleton Pattern is to address the above two problem

1. one instance - there must be exactly one instance of a class
2. global access - the instance must be accessible to clients from a well-known access point

> For example, you have an album and you wanna use it for uploading all kinds of pictures you take, from any kind of device, cell phone, digital camera, drone, etc. Also, you wanna have access to it anywhere.

So the applicability of this pattern is:

1. There must be exactly one instance of a class, and it must be accessible to clients from a well-known access point.
   1. question: how could you restrict creating an instance from a class?
2. When the sole instance should be extensible by subclassing, and clients should be able to use an extended instance without modifying their code.


## Solution

To implement a object class in a Singleton Pattern, there are two common steps to fulfill the requirements

1. Private constructor method
   1. This step answers the question that "how could you restrict creating instance from a class?", By making the constructor of the target class `private`, there is no public entry to create an instance of the target class.
2. Static method `getInstance()` to retrieve the instance that already exists
   1. The first step is to make the target class no more instances can be created from outside, but this method fulfills that only the instance that already exists will return. This means after creating the first instance, we record it with a "marker", when the next time, `getInstance()` is invoked, we can directly return the instance if we already created it.


![](https://raw.githubusercontent.com/Zhenye-Na/img-hosting-picgo/master/img/Singleton_pattern_uml.png)


Let's check a simplified implementation of the Singleton Pattern in Java.

```java
public class SingletonObject {

    private static SingletonObject instance;

    private SingletonObject() {
    }

    public static getSingletonInstance() {
        if (instance == null) {
            instance = new SingletonObject();
        }

        return instances;
    }

    // other business logic for this class
}
```

## Pros & Cons


| Pros                                                                                                                                          | Cons                                                                                      |
|---------------------------------------------------------------------------------------------------------------------------------------------  |------------------------------------------------------------------------------------------ |
| **Control access to sole instance**. it encapsulates its sole instance                                                                        | **Single Responsibility Principle**. it solves two problems at a time                      |
| **Reduce namespace**. it avoids polluting namespace with global variables                                                                     | **Multithreaded environment**. need extra care when using Singleton in multithreaded env  |
| **Permit refinement of operations and representation**. you can configure the application with an instance of the class you need at run-time   |                                                                                           |
| **Permit a variable number of instances**.                                                                                                    |                                                                                           |
| **More flexible than class operation**.                                                                                                       |                                                                                           |


## Real-world usage

### Dagger 2 with Lombok

> Dagger is a dependency injection for Java
>
> Lombok is a java library that helps create commonly used code chunk with a simple annotation

`CoffeeMaker.java`
```java
interface CoffeeMaker {
}
```


`CoffeeMakerModule.java`
```java
@Module
public class CoffeeMakerModule {

    @Singleton
    @Provides
    public CoffeeMaker getDefaultCoffeeMaker() {
        return new StarbucksCoffeeMaker();
    }
}
```

`StarbuzzCafe.java`

```java
@RequiredArgsConstructor(onConstructor = @__(@Inject))
public class StarbuzzCafe {

    private final CoffeeMaker coffeeMaker;
}
```

Explanation:

1. In the `CoffeeMakerModule.java` class
   1. We add `@Module` annotation to `CoffeeMakerModule` to mark this class as a Dagger module
   2. @Singleton and @Provides are the dark magic Dagger made to satisfy the dependency who will use the `CoffeeMaker` class instance
      1. if `CoffeeMaker` is a class, you can use `@Inject` but since this is an interface, we should use `@Provides`
2. In `StarbuzzCafe.java` class
   1. We use Lombok `@RequiredArgsConstructor` annotation on the `StarbuzzCafe` class, this annotation will include all the `final` fields in the constructor
   2. `(onConstructor = @__(@Inject))` with the help of this annotation, Lombok will generate `@Inject` annotation for the constructor, inject the dependency into the `StarbuzzCafe` class
      1. If you are interested: [What is the difference between @RequiredArgsConstructor(onConstructor = @__(@Inject)) and @RequiredArgsConstructor?](https://stackoverflow.com/a/57822939)



### Java Bean

By default, the scope of a bean is Singleton

The `Message` class is a *Spring bean* managed by the *Spring container*.

```java
@Component
@Scope("singleton")
@PropertySource("classpath:default.properties")
public class Message {

    @Value("${chat.recipient}")
    private String recipient;

    @Value("${chat.sender}")
    private String sender;

    public String getMessage() {
        return String.format("Message sent from %s to %s", sender, recipient);
    }
}
```

Explanation

- The `@Scope("singleton")` annotation is not necessary; the default scope is singleton if not specified.
- With the `@PropertySource` annotation we specify the properties file. The properties are later read with `@Value`.
- `@Value` annotation (which has similar functionality to Dagger `@Named`)is to read the value from the specified properties file, normally this can be used for configuration for the application


## References

- [refactoring.guru - singleton](https://refactoring.guru/design-patterns/singleton)
- [Design Patterns: Elements of Reusable Object-Oriented Software](https://www.amazon.com/Design-Patterns-Elements-Reusable-Object-Oriented/dp/0201633612)
- [Head First Design Patterns](https://www.amazon.com/Head-First-Design-Patterns-Object-Oriented/dp/149207800X/ref=pd_lpo_1?pd_rd_i=149207800X&psc=1)
- [Dagger 2 - what is the purpose of a @Singleton annotation class](https://stackoverflow.com/a/31182600)
- [Dependency injection with Dagger 2 - Custom scopes](http://frogermcs.github.io/dependency-injection-with-dagger-2-custom-scopes/)
- [Spring Singleton scope bean](https://zetcode.com/spring/singletonscope/)

