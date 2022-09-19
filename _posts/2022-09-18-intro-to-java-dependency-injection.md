---
layout: article
title: "Introduction to Dependency Injection in Java"
date: 2022-09-18
modify_date: 2022-09-18
excerpt: "How to design and implement Dependency Injection Pattern in Java"
tags: [Java, Dependency Injection]
mathjax: false
mathjax_autoNumber: false
key: intro-java-dependency-injection
---

## Background

### What is Dependency Injection?

If you're not familiar with Dependency Injection, feel free to watch the following video to grasp the idea behind this pattern


<div class="extensions extensions--video">
  <iframe src="https://www.youtube.com/embed/IKD2-MAkXyQ?rel=0&showinfo=0"
    frameborder="0" scrolling="no" allowfullscreen></iframe>
</div>


And this article to understand the `why` part [Dependency Injection 101 — What and Why](https://medium.com/bigeye/dependency-injection-101-what-and-why-7bd11d53c528)


Dependency Injection is a concrete application of the more generic **Inversion of Control** principle in which the flow of the program is controlled by the program itself.

It's implemented through an external component that provides instances of objects (or dependencies) needed by other objects.

Different frameworks implement dependency injection in different ways. In particular, one of the most notable of these differences is whether the injection happens at run-time or compile-time.

- **Run-time DI** is usually based on reflection which is simpler to use but slower at run-time
  - Example: Spring and Google Guice
- **Compile-time DI**, on the other hand, is based on code generation. This means that all the heavy-weight operations are performed during compilation. Compile-time DI adds complexity but generally performs faster.
  - Example: Google Dagger 2


### What are the advantages that Dependency Injection provides?

- Simplifies access to shared instances
  - Dagger 2 provides a simple way to obtain references to shared instances compared to using a Java constructor to create dependencies
- Easy configuration of complex dependencies
  - Module reuse
- Easier Unit Testing
  - We can easily mock the injected dependency to write unit tests


## Dependency Injection with Dagger 2

### POJO

```java
@Lombok.Data
public final class Car {

    private Engine engine;
    private Brand brand;

    @Inject
    public Car(Engine engine, Brand brand) {
        this.engine = engine;
        this.brand = brand;
    }
}
```

### Module

`Module` is the class with the `@Module` annotation. This annotation indicates that the class can make dependencies available to the container

> `@Module`s are classes or interfaces that act as collections of instructions for Dagger on how to construct dependencies. They're called modules because they are modular: you can mix and match modules in different applications and contexts.

```java
@Module(includes = {BrandModule.class})
public class VehiclesModule {

    @Provides
    public Engine provideEngine() {
        return new Engine();
    }
}
```

Here `@Module(includes = {BrandModule.class})` means that `VehiclesModule` depends on `BrandModule` and in order to build the object graph, `BrandModule` is requried

Below is the definition of `BrandModule`. Noticed that instead of the `@Singleton` annotation that creates a singleton object, we also have other two annotations

- `@Provides` provides the dependency that the target class's constructor needs
- `@Named` differentiate the dependency based on the `"name"` given

```java
@Module
public class BrandModule {

    @Provides
    @Singleton
    @Named("Lamborghini")
    public Brand provideLamboBrand() { 
        return new Brand("Lamborghini"); 
    }

    @Provides
    @Singleton
    @Named("Bugatti")
    public Brand provideBugattiBrand() { 
        return new Brand("Bugatti"); 
    }
}
```

### Component

`Component` is the class that will generate `Car` instances, injecting dependencies provided by `VehiclesModule`. We need a method signature that returns a `Car` and we need to mark the class with the `@Component` annotation:

```java
@Singleton
@Component(modules = VehiclesModule.class)
public interface VehiclesComponent {
    Car buildCar();
}
```

Notice how we passed our module class as an argument to the @Component annotation. If we didn't do that, **Dagger wouldn't know how to build the car's dependencies.**

Also, since our module provides a singleton object, we must give the same scope to our component because **Dagger doesn't allow for unscoped components to refer to scoped bindings.**

After annotating with `@Component`, Dagger will generate boilerplate code and prepend the class name with `Dagger`, which means if we wanna use `VehiclesComponent` in the code base, we can call `DaggerVehiclesComponent`


### Client code usage

```java
@Test
public void givenGeneratedComponent_whenBuildingCar_thenDependenciesInjected() {

    VehiclesComponent component = DaggerVehiclesComponent.create();
    Car car = component.buildCar();

    // ....
}
```

## Assisted Injection with Dagger 2

> `Assisted injection` is a dependency injection (DI) pattern that is used to construct an object where **some parameters may be provided** by the DI framework and **others must be passed in at creation time (a.k.a "assisted") by the user.**
> 
> Dagger 2 documentation


To use Dagger's assisted injection, annotate the constructor of an object with `@AssistedInject` and annotate any assisted parameters with `@Assisted`, as shown below:

```java
public class MyDataService {

    @AssistedInject
    MyDataService(DataFetcher dataFetcher, @Assisted Config config) {}
}
```

Next, define a `factory` that can be used to create an instance of the object. The factory must be annotated with `@AssistedFactory` and must contain an abstract method that returns the `@AssistedInject` type and takes in all `@Assisted` parameters defined in its constructor (in the same order). This is shown below:

```java
@AssistedFactory
public interface MyDataServiceFactory {
    MyDataService create(Config config);
}
```

Finally, Dagger will create the implementation for the assisted factory and provide a binding for it. The factory can be injected as a dependency as shown below.

```java
class MyApp {
    @Inject MyDataServiceFactory serviceFactory;

    MyDataService setupService(Config config) {
        MyDataService service = serviceFactory.create(config);
        // ...
        return service;
    }
}
```

**Disambiguating `@Assisted` parameters with the same type**

If multiple `@Assisted` parameters have the same type, you must distinguish them by giving them an identifier. This can be done by adding a name via the `@Assisted("name")` annotation. These must be put on both the factory method and the` @AssistedInject` type.

For example:

```java
class MyDataService {
    @AssistedInject
    MyDataService(
        DataFetcher dataFetcher,
        @Assisted("server") Config serverConfig,
        @Assisted("client") Config clientConfig) {}
}

@AssistedFactory
public interface MyDataServiceFactory {
    MyDataService create(
        @Assisted("server") Config serverConfig,
        @Assisted("client") Config clientConfig);
}
```


## Dependency Injection with Guice

Here is a great article that explains how to use Guice DI [Dependency Injection 102 -Instrumentation with Guice](https://medium.com/bigeye/dependency-injection-102-instrumentation-with-guice-1c45dd238c95)

## Misc - FAQ

### What is the difference between `javax.inject.Inject` and `com.google.inject.Inject` ?

TL;DR: they are interchangeable.

Check Google Guice: JSR-330 specification https://github.com/google/guice/wiki/JSR330


## References

- [Dependency Injection 101 — What and Why](https://medium.com/bigeye/dependency-injection-101-what-and-why-7bd11d53c528)
- [Dependency Injection with Dagger 2](https://guides.codepath.com/android/dependency-injection-with-dagger-2)
- [Introduction to Dagger 2](https://www.baeldung.com/dagger-2)
- [YouTube: Dependency Injection](https://www.youtube.com/watch?v=IKD2-MAkXyQ)
- [Dagger 2 Assisted Injection](https://dagger.dev/dev-guide/assisted-injection.html)
- [Google Guice Dependency Injection Example Tutorial](https://www.digitalocean.com/community/tutorials/google-guice-dependency-injection-example-tutorial)
- [Dagger 2 Tutorial](https://dagger.dev/tutorial/)
