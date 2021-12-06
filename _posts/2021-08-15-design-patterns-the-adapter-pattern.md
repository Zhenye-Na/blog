---
layout: article
title: "Design Patterns: Adapter Pattern"
date: 2021-08-15
modify_date: 2021-08-15
excerpt: "Adapters are everywhere"
tags: [Design Patterns, Adapter Pattern, Object-Oriented Design]
mathjax: false
mathjax_autoNumber: false
key: design-patterns-adapter-pattern
---

## Background

<div class="item">
  <div class="item__image">
    <img class="image" src="https://raw.githubusercontent.com/Zhenye-Na/img-hosting-picgo/master/img/adapter-en.png" width="30%" alt="Adapter Pattern" />
  </div>
  <div class="item__content">
    <div class="item__header">
      <h4><strong>What is adapter (patterns) ?</strong></h4>
    </div>
    <div class="item__description">
      <blockquote>
        <p>Suppose you have a US-made laptop and you are now in Europe or China for a vacation. You may notice that the interface on the wall is incompatible for the plug you have for the laptop. Then you might need an <em>adapter</em> to &quot;translate&quot; or &quot;convert&quot; your plug interface.</p>
        <br />
        <p>This also applies to Software Development. A very common scenario is that. Customers or Clients will have a set of APIs to call or you used an external library to proceed the requests. But, the Backend system you build use another set of APIs with different arguments or endpoints. You wanna unify the gap betweens these two different sets of APIs. This is the time you wanna bring the &quot;Adapter Pattern&quot; onboard.</p>
      </blockquote>
    </div>
  </div>
</div>


> Meanwhile, you may also wanna check
> - Facade Pattern
> - Decorator Pattern
> - Proxy Pattern
> 
> These patterns are pretty similar, so you may wanna check before designing the interface.
>
> image credits to https://refactoring.guru/design-patterns/adapter

## Adapter Pattern

**The Adapter Pattern** converts the interface of a class into another interface the clients expect. Adapter lets classes work together that couldn't otherwise because of imcompatble interfaces
{:.success}


Like what I mentioned in the background session. It is pretty common to see that the new things we wanna bring in conflict the existing code base. Of course, we developers are too lazy to modify / migrate the entire code base. So, we bring the "Adapter Pattern" to the play

![](https://raw.githubusercontent.com/Zhenye-Na/img-hosting-picgo/master/img/1*PwslTy9cJi19fG66wJOpmA.png)

> Image credits to **Head First: Design Patterns**, by Eric Freeman, Elisabeth Robson, Bert Bates, Kathy Sierra
> 
> Blog: https://faun.pub/head-first-design-patterns-using-go-6-being-adaptive-the-adapter-and-facade-patterns-c6361a602c3a

The Client uses the Adapter:

- The client makes a request to the adapter by calling a method on it using the `Target` interface: `ITarget`
- The adapter translates the request into one or more calls on teh **adaptee** using the `adaptee` interface
- The client receives the results of the call and *never* knows there is an adapter doing the translation

The Client and Adaptee are **decoupled**. neither do they knows about the other

### Toy example: Duck and Turkey

Let's take Duck and Turkey for an example of how Adaper Pattern works

Duck interface `IDuck`:

```java
public interface Duck {
    public void quack();
    publick void fly();
}
```

Here is a concrete class `MallardDuck` which implements the Duck interface `IDuck`

```java
public class MallardDuck implements Duck {

    public void quack() {
        System.out.println("Quack");
    }


    public void fly() {
        System.out.println("I am flying!");
    }

}
```

Now there is another interface Turkey `ITurkey` and the class `WildTurkey` which implements `ITurkey`

```java
public interface Turkey {
    public void gobble();
    public void fly();
}

public class WildTurkey implements Turkey {

    public void gobble() {
        System.out.println("Gobble Gobble");
    }


    public void fly() {
        System.out.println("I am flying very short distance");
    }

}
```

Now the clients wanna use Duck objects but can only call on Turkey objects. So we create a `TurkeyAdapter` class to adapt to the Duck class


```java
/**
 * implement the interface of the type you are adapting to
 * since the client wanna see the `Duck` interface
 * we create the `TurkeyAdapter` class to implement `IDuck`
 */
public class TurkeyAdapter implements Duck {
    Turkey turkey;

    /**
     * Pass a reference to the object that we are adapting
     */
    public TurkeyAdapter(Turkey turkey) {
        this.turkey = turkey;
    }

    public void quack() {
        turkey.gobble();
    }

    public void fly() {
        for(int i = 0; i < 5; i++) {
            turkey.fly();
        }
    }
}
```

After that we create a test class to do a simple testing

```java
public class DuckTestDrive {
    public static void main(String[] args) {
        MallardDuck duck = new MallardDuck();

        WildTurkey turkey = new WildTurkey();
        Duck turkeyAdapter = new TurkeyAdapter(turkey);  // wrap the turkey in TurkeyAdapter class

        System.out.println("The Turkey says...");
        turkey.gobble();
        turkey.fly();

        System.out.println("\nThe Duck says...");
        testDuck(duck);

        System.out.println("\nThe TurkeyAdapter says...");
        testDuck(turkeyAdapter);

    }

    static void testDuck(Duck duck) {
        duck.quack();
        duck.fly();
    }
}
```

Output:

```sh
$ java DuckTestDrive
The Turkey says...
Gobble gobble
I'm flying a short distance

The Duck says...
Quack
I'm flying

The TurkeyAdapter says...
Gobble gobble
I'm flying a short distance
I'm flying a short distance
I'm flying a short distance
I'm flying a short distance
I'm flying a short distance
```


![](https://raw.githubusercontent.com/Zhenye-Na/img-hosting-picgo/master/img/adapter-object-pattern.png)

> Image credits to **Head First: Design Patterns**, by Eric Freeman, Elisabeth Robson, Bert Bates, Kathy Sierra
>
> Blog https://fjp.at/design-patterns/adapter

- The `Client` is implemented against the `Target` interface
- the `Adapter` implements the `Target` interface and holds an instance of the `Adaptee`
  - In the above example, `TurkeyAdapter` implement `IDuck` and holds an instance of `Turkey`


## Object and Class Adapter

There are two types of adapters

- Object Adapter
- Class Adapter

We have already seen the Object Adapter in the above section. Let's now check the Class Adapter

![](https://raw.githubusercontent.com/Zhenye-Na/img-hosting-picgo/master/img/adapter-class-pattern.png)

> Image credits to **Head First: Design Patterns**, by Eric Freeman, Elisabeth Robson, Bert Bates, Kathy Sierra
>
> Blog https://fjp.at/design-patterns/adapter

The only difference is that Class Adapter is the subclass of Target and Adaptee, instead of using composition to adapt the Adaptee.

![](https://raw.githubusercontent.com/Zhenye-Na/img-hosting-picgo/master/img/IMG_0292.PNG)

> Image credits to **Head First: Design Patterns**, by Eric Freeman, Elisabeth Robson, Bert Bates, Kathy Sierra


## Real-world examples

Now let's jump into a real-world example provided in the book: `Iterators` and `Enumerators`

Iterator and Enumerator both let you  step through the elements of a collection without knowing the specifics of how they are managed in the collection. But Iterator adds the ability to remove items

So to use adapter pattern, lets use the `Enumerators` with code that expects `Iterators`

```java
public interface Enumeration<E>
{
    public bool hasMoreElements(); // Tells if there are any more elements in the collection
    public E nextElement(); // Returns the next element in the collection/enumeration
}
```

In later versions of Java this was replaced with Iterators which has also a remove() method:

```java
public interface Iterator<E>
{
    public bool hasNext();  // Tells if there are any more elements in the collection
    public E next();        // Returns the next element in the collection/iteration.
    public void remove();   // Removes from the underlying collection the last element returned by this iterator
}
```

If you notice, Enumeration interface does not support `remove()` method. What should we do?

```java
public class EnumerationIterator implements Iterator<Object> {
    Enumeration<?> enumeration;
 
    public EnumerationIterator(Enumeration<?> enumeration) {
        this.enumeration = enumeration;
    }

    public boolean hasNext() {
        return enumeration.hasMoreElements();
    }

    public Object next() {
        return enumeration.nextElement();
    }

    public void remove() {
        throw new UnsupportedOperationException(); // we throw exception since remove() is not supported
    }
}
```

## References

- Head First: Design Patterns, by Eric Freeman, Elisabeth Robson, Bert Bates, Kathy Sierra
- Adapter Pattern - https://www.youtube.com/watch?v=2PKQtcJjYvc
- https://fjp.at/design-patterns/adapter
- https://faun.pub/head-first-design-patterns-using-go-6-being-adaptive-the-adapter-and-facade-patterns-c6361a602c3a
