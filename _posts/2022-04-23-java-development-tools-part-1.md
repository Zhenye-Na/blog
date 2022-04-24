---
layout: article
title: "Java Development Tools - Part 1"
date: 2022-04-03
modify_date: 2022-04-21
excerpt: "Code boilerpate, Unit test, and Logging tools in Java"
tags: [Java]
mathjax: false
mathjax_autoNumber: false
key: java-development-tools-part-1
---

## Lombok

Lombok is a very handy library that is used pretty commonly for Java development. The main use case of Lombok is that it generates the boilerplate code for you silently during **compile-time**. So that you don't need to manually create those "utility" methods every time, and you have access to all these methods as usual within IDE while writing code from the generated `.class` file.

I have listed some commonly used annotations in Lombok here and will elaborate more on each of those:

- `var` and `val`
- `@Data`
- `@Builder` and `@SuperBuilder`
- `@NonNull`
- `@Cleanup`
- `@RequiredArgsConstructor(onConstructor = @__(@Inject))`

### 1. `var` and `val`

These two aren't annotations, but they are still super helpful. They can be easily explained in almost two lines

```java
// without Lombok var or val
final VeryComplexOperationRequest request = new VeryComplexOperationRequest().withRequestBody();

// with Lombok var
final var                         request = new VeryComplexOperationRequest().withRequestBody();

// with Lombok val
val                               request = new VeryComplexOperationRequest().withRequestBody();
```


`var` works exactly like `val`, except the local variable is not marked as `final`.
{:.info}


So basically, `Lombok.var` and `Lombok.val` can help you clean up your codebase and make it compact without those interruptions with the complex class name.


### 2. `@Data`

With `@Data` annotation, we create an example class as follows:

```java
@Data
public final class Person {

    private int age;
    private String firstName;
    private String LastName;
    private Occupation occupation;
}
```

Behind the scene, `@Data` annotation is a set of

- `@Getter`
- `@Setter`
- `@ToString`
- `@EqualsAndHashCode`
- `@RequiredArgsConstructor`

It generates boilerplate for Getter/Setter in Java, and other common methods like `toString()`, `hashCode()`, and `equals()` in a default way. So if you wanna have the flexibility to implement `toString()` or `hashCode()` with your custom logic, just add them to the class definition and they will overwrite what they are in Lombok default boilerplate.

For example, based on the `Person` class we defined, we can:

```java
// initialize a Person object
Person p = new Person( ... );


// Getter
String fullName = p.getFirstName() + " " + p.getLastName();

// Setter
p.setAge(25)


// equals()
Person p2 = new Person( ... );
if (p.equals(p2)) {
    // do something ..
}
```


### 3. `@Builder` and `@SuperBuilder`

`@Builder` is the Lombok boilerplate implemenetation of [Builder Pattern](https://www.wikiwand.com/en/Builder_pattern). It is handy when your class has several optional fields, which makes the initialization a little complex.

With the `@Builder` annotation, we can create an example class as follows

```java
@Builder
public final class Engineer {

    private int yearOfExperience;
    private String specialization;
    private List<Project> contributeTo;
}
```

Then we can initialize as follows:

```java
final var engineer = Engineer.builder()
        .yearOfExperience(10)
        .specialization("Civil Engineering")
        .build();
```

You might notice that the value of `contributeTo` is not given for the initialization, considering with more optional fields, the Builder Pattern saves a lot of time for object creation (no need for a specific constructor for each case)

Meanwhile, how does `@Builder` work with inheritance? - We can use `@SuperBuilder` which is designed for the inheritance use case.

```java
@SuperBuilder
public class Engineer {

    private int yearOfExperience;
    private String specialization;
    private List<Project> contributeTo;
}

@SuperBuilder
public class SoftwareEngineer {

    private List<String> frameworks;
}
```

```java
final var sde = SoftwareEngineer.builder()
        .yearOfExperience(5)
        .specialization("Large-scale Distributed Systems")
        .frameworks(Collections.singletonList("Spring"))
        .build()
```


#### `@Data` and `@Builder`

```java
@Data
@Builder
public class exampleClass {
    private String attributes;

    public String exampleMethod() {
        exampleClass example = exampleClass.builder().attributes("test").builder();
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString();
        exampleClass example2 = mapper.readValue(json, exampleClass.class);
        System.out.println(example2);
    }
}
```

When you combine the use case of `@Data` and `@Builder` like the way above, you will have some exception errors during compilation, the reason behind this is that, when only `@Data` and `@Builder` annotations are used in your class. The default constructor is missing, in this case, when you integrate the usage with `Jackson` (which is a serialization/deserialization library in Java and we will cover this next time), the deserialization step will fail because of the missing default constructor.

To fix it, simply add the two other annotations below:

```java
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class exampleClass {
    private String attributes;

    public String exampleMethod() {
        exampleClass example = exampleClass.builder().attributes("test").builder();
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString();
        exampleClass example2 = mapper.readValue(json, exampleClass.class);
        System.out.println(example2);
    }
}
```

where each annotation means something like:

```java
// @NoArgsConstructor
public exampleClass() {}

// @AllArgsConstructor
public exampleClass(String attributes) {
    this.attributes = attributes;
}
```

### 4. `@NonNull`

With the `@NonNull` annotation, Lombok will generate a null-check for the argument you pass. For example:

> The null-check looks like
> 
> `if (param == null) throw new NullPointerException("param is marked non-null but is null");`
> 
> and will be inserted at the very top of your method. 

```java
public static void main() {

    private void exampleMethod(@NonNull SoftwareEngineer sde) {
        System.out.Println(sde.specialization); // no need to worry about NPE here
    }
}
```


### 5. `@Cleanup`

With the `@Cleanup` annotation, Lombok will help you clean up the resource use in the context after the reference. For example:

```java
public class CleanupExample {

    public static void main(String[] args) throws IOException {
        @Cleanup InputStream in = new FileInputStream(args[0]);
        @Cleanup OutputStream out = new FileOutputStream(args[1]);

        byte[] b = new byte[10000];
        while (true) {
            int r = in.read(b);
            if (r == -1) break;
            out.write(b, 0, r);
        }
    }
}
```

`InputStream` and `OutputStream` created in the `main()` method will be automatically closed after the reference. So you don't explicitly do

```java
// if else check, then
in.close();

// if else check, then
out.close();
```


### 6. `@RequiredArgsConstructor(onConstructor = @__(@Inject))`

By default, the `@RequiredArgsConstructor` annotation is contained in the `@Data` annotation, but I wanna highlight another usage of it here, just for its "integration" with [Singleton Pattern](https://zhenye-na.github.io/blog/2021/12/05/design-patterns-the-singleton-pattern.html)

> `(onConstructor = @__(@Inject))`: Lombok will generate `@Inject` annotation for the constructor

Another common use case is `@RequiredArgsConstructor(onConstructor = @__(@Autowired))` which means, for the constructor of this class, add the `Autowired` annotation to the constructor



## JUnit

> To be continued



## Mockito

Mocktio is a mocking framework for Java Unit Test, the reason why we need it can be explained in this way:

> Suppose we have a Class to be unit-tested against, and it has a dependency on the Database or another Client library code (eg RPC), then to mock the target class, we need to "mock" the dependencies and return different kinds of dummy responses for the target class to test the functionality.

An example Unit Test that utilizes the Mockito could be:


```java
public final class ExampleClassTest {

    @InjectMocks ExampleClass example;

    @Test
    public void simpleTest() {

        // define depMock object is a `Mock` object of the depdendencyClass
        final var depMock = mock(depdendencyClass.class);

        // define strCaptor object is a `ArgumentCaptor` object of the depdendencyClass
        final var strCaptor = ArgumentCaptor.forClass(String.class);

        // mock the behavior of the dependency for a successful invocation
        when(depMock.getInvoked(any())).thenReturn(new targetResponse());

        // what if the dependency throw exception?
        when(depMock.getInvoked(any())).thenReturn(new dependencyException("Exception Message"));

        // what if the dependency does not have output (or `void`) ?
        doNothing().when(depMock).getInvoked(any());
        doThrow(new dependencyException("Exception Message")).when(depMock).getInvoked(any());

        // invoke the targetClass object and assert behaviors
        example.getInvoked()

        // verify the dependency is actually get invoked
        verify(depMock).getInvoked();

        // with ArgumentCaptor, you can inspect the parameters that dependency get invoked with
        verify(depMock).getInvoked(strCaptor.capture());
        assertEquals(expectedParam, strCaptor.getValue())

        // ...
    }
}
```

However, Mockito cannot mock:

- final class
- primitive type
- anonymous class


### Powermock


> To be continued



## Reference

- [Project Lombok - Features](https://projectlombok.org/features/all)
- [Unit tests with Mockito - Tutorial](https://www.vogella.com/tutorials/Mockito/article.html)
