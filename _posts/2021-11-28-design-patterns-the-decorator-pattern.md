---
layout: article
title: "Design Patterns: Decorator Pattern"
date: 2021-11-28
modify_date: 2021-11-28
excerpt: ""
tags: [Design Patterns, Decorator Pattern, Object-Oriented Design]
mathjax: false
mathjax_autoNumber: false
key: design-patterns-decorator-pattern
---

<div align="center">
  <img src="https://refactoring.guru/images/patterns/content/decorator/decorator.png" width="50%" alt="Decorator Pattern">
  <br />
  <p>Image source: <a href="https://refactoring.guru/design-patterns/decorator">Decorator Pattern - Refactoring.guru</a></p>
</div>


## Intents

Suppose I just bought a brand new house, before I move in, I need to decorate the house with furnitures, appliances, etc. Take the bed for example, we need consider bed frame, bed mattress, bed sheet, pillows, etc. Now consider that you are create a new software which helps customers to simplify the move-in decoration process. You might wanna use inheroitance to solve this problem. For example:

```java
public abstract class Bed {
    String material;

    String getMaterial();
    int getSize();
}

public class WoodenKingBed extends Bed {
    String material = "Wood";

    String getMaterial();
    int getSize();
}

public class MetalQueenBed extends Bed {
    String material = "Metal";

    String getMaterial();
    int getSize();
}

// ...
```

For the above example, it seems ok considering the size of the bed and material for bed frame is pretty limited. However, consider another similar problem, which is the base class is `beverage` and the inheritance we can have lots of different drinks that extend the base `beverage` class. This will lead to the **explosion of classes**.

![](https://raw.githubusercontent.com/Zhenye-Na/img-hosting-picgo/master/img/coffeeshop-condiment-classes.png)

There is an opposite way to solve this, which is you can add exhaustive `if-else` statement to filter on each field. But one of the best solutions is to use **Decorator Pattern**


## The Open-Closed Principle

Classes should be open for extension, but closed for modification.
{:.info}

Decorator Pattern perfectly exmplifies the Open-Closed princinple:

1. Open for extension - decorator bring in the "extension", the add-ons
2. Closed for modification - does not changed the internal implementation


## Decorator Pattern

Let's define

The Decorator Pattern attaches additional responsibitlities to an object **dynamically**. Decorators provide a flexible _alternative to subclassing_ for extending functionality.
{:.info}

```
Component class - is the base class that we can add different add-ons to, normally this is a "abstract class"
    Concrete Component class - the concrete base class

Decorator class - is the class that can contains the add-on
    Concrete Decorator class - the concrete decorator class, concrete add-ons
```

![](https://raw.githubusercontent.com/Zhenye-Na/img-hosting-picgo/master/img/Medium.webp)

With Decorator Pattern, you can decorate or **wrap** the base class `Component.class` with different add-ons.

The `Decorator` contains a `has-a` and an `is-a` relationship with the `Component`

- `has-a`: `Decorator` used composition, contains a object of `Component` in `Decorator` class
- `is-a`: `Decorator` extends `Component`

```java
public abstract class Decorator extends Component {
    protected Component target;
    ...
}
```

### When to use Decorator Pattern?

> source: https://stackoverflow.com/a/1549777

The Decorator Pattern is used for adding additional functionality to an existing object (i.e. already instantiated class at runtime), as opposed to object's class and/or subclass. It is easy to add functionality to an entire class of objects by subclassing an object's class, but it is impossible to extend a single object this way. With the Decorator Pattern, you can add functionality to a single object and leave others like it unmodified.

In Java, a classical example of the decorator pattern is the Java I/O Streams implementation.

```java
FileReader       frdr = new FileReader(filename);
LineNumberReader lrdr = new LineNumberReader(frdr);
```

The preceding code creates a reader -- `lrdr` -- that reads from a file and tracks line numbers. Line 1 creates a file reader (`frdr`), and line 2 adds line-number tracking.

## Decorator Call Flow

![](https://milextone.ir/software-design/design-patterns/coffeeshop-bevarage-class-construction-4.png)

Remember `Decorator` contains a `has-a` and an `is-a` relationship with the `Component`, so that you can add a `Decorator` chain to the `Component`.

In the Call flow, for me, it looks like a `recursion` or `stack`

- defined the base case in the `Component`
- modify the returned value in the `Decorator`


## Examples - Starbuzz Cafe

`Component` class - `Beverage`


**`Beverage.java`**
```java
public abstract class Beverage {
    String description = "Unkown Beverage";

    public String getDescription() {
        return description;
    }

    public abstract double cost();
}
```

`Decorator` class - `Condiment`


**`CondimentDecorator.java`**
```java
public abstract class CondimentDecorator extends Beverage {
    Beverage beverage; // has-a component, "wrapping"
    public abstract String getDescription();
}
```

Now that we have our base `Component` and `Decorator` class, we can start implementing beverages. For example, `Espresso` and `ColdBrew`


**`Espresso.java`**
```java
public class Espresso extends Beverage {  // extend from Beverage

    public Espresso() {
        description = "Espresso";
    }

    public double cost() {
        return 1.99;  // base price for espresso
    }
}
```

**`ColdBrew.java`**
```java
public class ColdBrew extends Beverage {

    public ColdBrew() {
        description = "Cold Brew";
    }

    public double cost() {
        return 0.89;  // base price for espresso
    }
}
```

Since we have two concrete beverages: espresso and cold brew. Let's start implementing concrete decorator

```java
public class Mocha extends CondimentDecorator {
    public Mocha(Beverage beverage) {
        this.beverage = beverage;
    }

    public String getDescription() {
        return String.format("%s%s", beverage.getDescription(), ", Mocha");
    }

    public double cost() {
        return beverage.cost() + 0.20;  // increment the price with 0.20 if Mocha added to the beverage
    }
}
```

Now, let's summrize the `Beverage` and `Decorator` class together

**`main.java`**
```java
public class StarbuzzCoffee {

    public static void main(String args[]) {

        Beverage beverage = new Espresso();
        System.out.println(beverage.getDescription() + ", $ " + beverage.cost());

        Beverage coldBrew = new ColdBrew();
        coldBrew = new Mocha(coldBrew);
        coldBrew = new Mocha(coldBrew);  // wrap cold brew with Mocha twice
        System.out.println(coldBrew.getDescription() + ", $ " + coldBrew.cost());
    }
}
```


## Appendix: Decorator Function in Python

```python
def makebold(fn):
    def wrapped():
        return "<b>" + fn() + "</b>"
    return wrapped

def makeitalic(fn):
    def wrapped():
        return "<i>" + fn() + "</i>"
    return wrapped

@makebold
@makeitalic
def hello():
    return "hello world"

print(hello()) ## returns <b><i>hello world</i></b>
```

## References

- [Decorator pattern](https://www.wikiwand.com/en/Decorator_pattern)
- [Decorator](https://refactoring.guru/design-patterns/decorator)
- [Decorator Pattern](https://milextone.ir/software-design/design-patterns/decorator-pattern)
- [Design Patterns - Decorator Pattern](https://www.tutorialspoint.com/design_pattern/decorator_pattern.htm)
