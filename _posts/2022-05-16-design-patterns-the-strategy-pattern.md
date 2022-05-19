---
layout: article
title: "Design Patterns: Strategy Pattern"
date: 2022-05-16
modify_date: 2022-05-18
excerpt: ""
tags: [Design Patterns, Strategy Pattern, Object-Oriented Design]
mathjax: false
mathjax_autoNumber: false
key: design-patterns-strategy-pattern
---


## Intent

There are common situations when classes differ only in their behavior. For this cases is a good idea to isolate the algorithms in separate classes in order to have the ability to select different algorithms at runtime.

Strategy Pattern defines a family of algorithms, encapsulate each one, and make them interchangeable. Strategy lets the algorithm vary independently from clients that use it.

Let's use a real life example to define the problem and see how to use Strategy Pattern can be applied to solve it

## Real-life Example

Suppose you are trying to design a game, to be specific, it is about swiming racing. Here are different swimming strokes that we will support in the game:

![](https://raw.githubusercontent.com/Zhenye-Na/img-hosting-picgo/master/img/b30c1eab225297bedfd43b719d109aa5.jpg)

Now, let's think how we could implement each swimming techniques in the programming point of view.

Naively, the first solution or method in my mind is that could think about is using `Inheritance` and override each method in the child class. Here is an UML example of how the class should be inherited.

[![](https://mermaid.ink/img/pako:eNp9lL9uwyAQh18FMbVS8gIeOkRJt05uNxYKZxeFPxGGWlaady9D3Bz2uRu-7xO6nw-4chU08IYrK4fhaGQfpRNe-ENOCWJnp3Y0zhnfs_3-54XNX8K_RoA2TRa2hEMEOaQ2xXDedqQ6_28I_0ca9m4csJPXOUqvoEKjjO7j8vRcFVUI9hhGvyh_ls7SFyyqZYO38L2sWujnKvVT1j1RzqM5iuIuKY7apTDqm8JVgPXQ1gEo5xGAojgAxVEACqMAFK4CbBwrYgy0hiZBC9UwaAXPgzbwSGijPlbrW0AEoiQUh8JVGErAUSiOg1AcxeA77iA6aXR5Ta7CMyZ42dqB4E1Zauhktklw4W9FzRctE5y0SSHyppN2gB2XOYV28oo3KWaYpfujdLduv1bbt2I)](https://mermaid.live/edit#pako:eNp9lL9uwyAQh18FMbVS8gIeOkRJt05uNxYKZxeFPxGGWlaady9D3Bz2uRu-7xO6nw-4chU08IYrK4fhaGQfpRNe-ENOCWJnp3Y0zhnfs_3-54XNX8K_RoA2TRa2hEMEOaQ2xXDedqQ6_28I_0ca9m4csJPXOUqvoEKjjO7j8vRcFVUI9hhGvyh_ls7SFyyqZYO38L2sWujnKvVT1j1RzqM5iuIuKY7apTDqm8JVgPXQ1gEo5xGAojgAxVEACqMAFK4CbBwrYgy0hiZBC9UwaAXPgzbwSGijPlbrW0AEoiQUh8JVGErAUSiOg1AcxeA77iA6aXR5Ta7CMyZ42dqB4E1Zauhktklw4W9FzRctE5y0SSHyppN2gB2XOYV28oo3KWaYpfujdLduv1bbt2I)

For example: in `BreastStrokeSwimming` class, we will override the each method in the parent class (`Swimming`). Then let's assume that some of the swimming styles share the same implementation logic, for example, maybe `warmUp()` and `coolDown()` are exactly the same across all styles but not for `BackStrokeSwimming`, `legMove()` method is the same for `FreeStyleSwimming` and `BackStrokeSwimming`. Given these assumption, we will noticed that code blocks for method `warmUp()`, `coolDown()` and `legMove()` will be duplicated to some extents.

```java
public class Swimming {

    private Time endurance;

    public void warmUp() {}
    public void coolDown() {}

    public void breathe() {}
    public void armMove() {}
    public void legMove() {}

}


public class FreeStyleSwimming extends Swimming {

    private Time endurance;

    @Override
    public void warmUp() {
        // ...
    }

    @Override
    public void coolDown() {
        // ...
    }

    @Override
    public void breathe() {}

    @Override
    public void armMove() {}

    @Override
    public void legMove() {}
}
```

As a developer, we should always align with [Don't repeat yourself](https://www.wikiwand.com/en/Don%27t_repeat_yourself) principlie when writing codes. But what is the solution?

Actually this is when Strategy Pattern could come in to save out time. Consider the following UML for the changes we make:

[![](https://mermaid.ink/img/pako:eNqNlkFvgkAQhf8K2VPb6B8gxkSjTZq0J9obly2MlsguZlk0xPrfu4i2w_Io6kXnvVlmvjyFk0iKlEQoklyW5SqTWyNVrGO9rKwls8nr6JgpleltMJ1-z4Pbt1g_G6LI1jkNGZaGZGkja4rdsEcmu_8drP4UvDRn2i93XSMtbWtfXhj1VhxIkbZDllfa9i3OlKl9Tt7x7Sz9iy7Sg9QJpXfam_cFb087xTpwr9ks0w1smdB83pY-W-PDY6zPrB8sOHyGck7_ALD-nQf8YgyDozTqY98orJgURb4qjtors0VYVbZ7eNW8Hc6rvmeKgrVOK9NAx9nkMyGVD4d0NiWS2bhIZnMj2V8AefxkXCf6CxFsAnFoZh3pAhloVuCB7f-4OWGkcsJIZ4SRzAgjmRFGsk8YeUYJw6ZRwrDrDsLw37ETY2zoJBlbeJixg-cZO3iksaOXamwbD_ZA33i2Bxrvgd-_7XTQI7kDHhk4dqRz6EjnyJHeA45M47hh1zhs2DaCWkyEIqNklroHjMttJhZuNkWxCN3HlDayym0s3B3GWat96rrWaWYLI8KNzEuaCFnZIqp1IkJrKrqZrs8pV9f5B7IjQFw)](https://mermaid.live/edit#pako:eNqNlkFvgkAQhf8K2VPb6B8gxkSjTZq0J9obly2MlsguZlk0xPrfu4i2w_Io6kXnvVlmvjyFk0iKlEQoklyW5SqTWyNVrGO9rKwls8nr6JgpleltMJ1-z4Pbt1g_G6LI1jkNGZaGZGkja4rdsEcmu_8drP4UvDRn2i93XSMtbWtfXhj1VhxIkbZDllfa9i3OlKl9Tt7x7Sz9iy7Sg9QJpXfam_cFb087xTpwr9ks0w1smdB83pY-W-PDY6zPrB8sOHyGck7_ALD-nQf8YgyDozTqY98orJgURb4qjtors0VYVbZ7eNW8Hc6rvmeKgrVOK9NAx9nkMyGVD4d0NiWS2bhIZnMj2V8AefxkXCf6CxFsAnFoZh3pAhloVuCB7f-4OWGkcsJIZ4SRzAgjmRFGsk8YeUYJw6ZRwrDrDsLw37ETY2zoJBlbeJixg-cZO3iksaOXamwbD_ZA33i2Bxrvgd-_7XTQI7kDHhk4dqRz6EjnyJHeA45M47hh1zhs2DaCWkyEIqNklroHjMttJhZuNkWxCN3HlDayym0s3B3GWat96rrWaWYLI8KNzEuaCFnZIqp1IkJrKrqZrs8pV9f5B7IjQFw)

- Parent class still contains those methods and child classes override each method
- However, child classes take dependency on a new Interface variable, for example: `IBreathStrategy` and there will be two classes `SimpleBreatheStrategy` and `AdvancedBreatheStrategy` which implement the interface for `breathe()` method.
  - note: in the UML, I just add the implement class for interface `IBreathStrategy` for simplification, actually every interface will have specific strategy class to implement the actual logic

What benefits does this approach give?

1. Reduce Code Redundancy
   1. Since actual logic of `breathe()` or `move()` method is abstracted benhind the interface, in the child class, we can simply do `breatheStrategy.breathe()` in the method.
   2. In this way, one logic could be used everywhere applicable, without duplicating the whole code block
2. Single Responsibility
   1. `XXXStrategy` Class is just for the logic/implementation of one single method, which the implementation is abstracted from `XXXSwimming` instances we instantiated


## Problem

Figure demonstrates how this is routinely achieved - encapsulate interface details in a base class, and bury implementation details in derived classes. Clients can then couple themselves to an interface, and not have to experience the upheaval associated with change: no impact when the number of derived classes changes, and no impact when the implementation of a derived class changes.

![](https://raw.githubusercontent.com/Zhenye-Na/img-hosting-picgo/master/img/Strategy1.png)

A generic value of the software community for years has been, "maximize cohesion and minimize coupling". The object-oriented design approach shown in figure is all about minimizing coupling. Since the client is coupled only to an abstraction (i.e. a useful fiction), and not a particular realization of that abstraction, the client could be said to be practicing "abstract coupling" . an object-oriented variant of the more generic exhortation "minimize coupling".

A more popular characterization of this "abstract coupling" principle is "Program to an interface, not an implementation".

Clients should prefer the "additional level of indirection" that an interface (or an abstract base class) affords. The interface captures the abstraction (i.e. the "useful fiction") the client wants to exercise, and the implementations of that interface are effectively hidden.


## Pros and Cons

| Pros                                                                                	| Cons                                                                      	|
|-------------------------------------------------------------------------------------	|---------------------------------------------------------------------------	|
| Each strategy (algorithm/implementation) is easily inter-changable                  	| Overkill if the strategy never changes                                    	|
| Each strategy's implementation is abstracted from the main class                    	| Could confuse clients on which is the proper strategy to use              	|
| Favor composition instead of inheritance                                            	| Complicated for programming language which support functional programming 	|
| Open/Close Principle                                                                	|                                                                           	|
| (Optional) SIngleton Pattern could be applied to create instances for each strategy 	|                                                                           	|

## Reference

- [Strategy Pattern - OODesign](https://www.oodesign.com/strategy-pattern.html)
- [Strategy Pattern - Refactoring.guru](https://refactoring.guru/design-patterns/strategy)
- [Design Patterns - Strategy Pattern](https://www.tutorialspoint.com/design_pattern/strategy_pattern.htm)
