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

When you combine the use case of `@Data` and `@Builder` like the way above, you will have some exception errors during compilation, the reason behind this is that when only `@Data` and `@Builder` annotations are used in your class. The default constructor is missing, in this case, when you integrate the usage with `Jackson` (which is a serialization/deserialization library in Java and we will cover this next time), the deserialization step will fail because of the missing default constructor.

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

***

## JUnit

> What is Junit?
> 
> Junit is a Java Testing framework, which provides annotations, assertions, etc to help test the application you are creating.
> 
> What is Unit Testing?
> 
> There are different categories of testing, to name a few: Unit Test, Integration Test, Canary Test, Load Test, and Smoke Test
> 
> Unit Test kind of self-explanatory. It tests against individual modules within the application in an isolated fashion, while Integration Test "enables" those dependencies and checks if it works fine following the flow.



| Annotation           | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@Test`              | Denotes that a method is a test method. Unlike JUnit 4’s `@Test` annotation, this annotation does not declare any attributes, since test extensions in JUnit Jupiter operate based on their dedicated annotations. Such methods are _inherited_ unless they are _overridden_.                                                                                                                                                                               |
| `@ParameterizedTest` | Denotes that a method is a [parameterized test](https://junit.org/junit5/docs/current/user-guide/#writing-tests-parameterized-tests). Such methods are _inherited_ unless they are _overridden_.                                                                                                                                                                                                                                                                |
| `@RepeatedTest`      | Denotes that a method is a test template for a [repeated test](https://junit.org/junit5/docs/current/user-guide/#writing-tests-repeated-tests). Such methods are _inherited_ unless they are _overridden_.                                                                                                                                                                                                                                                      |
| `@TestFactory`       | Denotes that a method is a test factory for [dynamic tests](https://junit.org/junit5/docs/current/user-guide/#writing-tests-dynamic-tests). Such methods are _inherited_ unless they are _overridden_.                                                                                                                                                                                                                                                          |
| `@TestInstance`      | Used to configure the [test instance lifecycle](https://junit.org/junit5/docs/current/user-guide/#writing-tests-test-instance-lifecycle) for the annotated test class. Such annotations are _inherited_.                                                                                                                                                                                                                                                        |
| `@TestTemplate`      | Denotes that a method is a [template for test cases](https://junit.org/junit5/docs/current/user-guide/#writing-tests-test-templates) designed to be invoked multiple times depending on the number of invocation contexts returned by the registered [providers](https://junit.org/junit5/docs/current/user-guide/#extensions-test-templates). Such methods are _inherited_ unless they are _overridden_.                                                       |
| `@DisplayName`       | Declares a custom display name for the test class or test method. Such annotations are not _inherited_.                                                                                                                                                                                                                                                                                                                                                         |
| `@BeforeEach`        | Denotes that the annotated method should be executed _before_ **each** `@Test`, `@RepeatedTest`, `@ParameterizedTest`, or `@TestFactory` method in the current class; analogous to JUnit 4’s `@Before`. Such methods are _inherited_ unless they are _overridden_.                                                                                                                                                                                              |
| `@AfterEach`         | Denotes that the annotated method should be executed _after_ **each** `@Test`, `@RepeatedTest`, `@ParameterizedTest`, or `@TestFactory` method in the current class; analogous to JUnit 4’s `@After`. Such methods are _inherited_ unless they are _overridden_.                                                                                                                                                                                                |
| `@BeforeAll`         | Denotes that the annotated method should be executed _before_ **all** `@Test`, `@RepeatedTest`, `@ParameterizedTest`, and `@TestFactory` methods in the current class; analogous to JUnit 4’s `@BeforeClass`. Such methods are _inherited_ (unless they are _hidden_ or _overridden_) and must be `static` (unless the "per-class" [test instance lifecycle](https://junit.org/junit5/docs/current/user-guide/#writing-tests-test-instance-lifecycle) is used). |
| `@AfterAll`          | Denotes that the annotated method should be executed _after_ **all** `@Test`, `@RepeatedTest`, `@ParameterizedTest`, and `@TestFactory` methods in the current class; analogous to JUnit 4’s `@AfterClass`. Such methods are _inherited_ (unless they are _hidden_ or _overridden_) and must be `static` (unless the "per-class" [test instance lifecycle](https://junit.org/junit5/docs/current/user-guide/#writing-tests-test-instance-lifecycle) is used).   |
| `@Nested`            | Denotes that the annotated class is a nested, non-static test class. `@BeforeAll` and `@AfterAll`methods cannot be used directly in a `@Nested` test class unless the "per-class" [test instance lifecycle](https://junit.org/junit5/docs/current/user-guide/#writing-tests-test-instance-lifecycle) is used. Such annotations are not _inherited_.                                                                                                             |
| `@Tag`               | Used to declare _tags_ for filtering tests, either at the class or method level; analogous to test groups in TestNG or Categories in JUnit 4. Such annotations are _inherited_ at the class level but not at the method level.                                                                                                                                                                                                                                  |
| `@Disabled`          | Used to _disable_ a test class or test method; analogous to JUnit 4’s `@Ignore`. Such annotations are not _inherited_.                                                                                                                                                                                                                                                                                                                                          |
| `@ExtendWith`        | Used to register custom [extensions](https://junit.org/junit5/docs/current/user-guide/#extensions). Such annotations are _inherited_.                                                                                                                                                                                                                                                                                                                           |


### Commonly Used Annotations

- `@Test`
- `@BeforeEach` and `@AfterEach`
- `@Disabled`


#### `@Test`

Define a Test case

```java
@Test
public void exampleTest() {
    assertTrue(2, 1 + 1);
}
```


#### `@BeforeEach` and `@AfterEach`

These two annotations help if the test cases will share a common object, the methods under these annotations will be invoked every time before/after each test

```java
public final class exampleTest {

    private SomeClient client;
    private AutoCloseable closeable;

    @BeforeEach
    public void setUp() {
        client = new SomeClient();
    }


    @AfterEach
    public void tearDown() {
        closeable.close();
    }

}
```

#### `@Disabled`

This annotation is to skip a Test case

```java
@Disabled
@Test
public void disabledTest() {

}
```



### Assertion and Assumption

Both Assertion and Assumption stop when a test fails and moves on to the next test. But the difference is:

- A failed Assertion registered the failed test case, and it means if your code went to production, it will not work
- A failed Assumption JUST moved to the next test and you don't know what exactly happened


> Java Doc for Assume
> 
> A set of methods useful for stating assumptions about the conditions in which a test is meaningful. A failed assumption does not mean the code is broken, but that the test provides no useful information.


### Advanced Usage

Some advanced use cases are related to specific tests based on the Operating System the Unit Tests are running on or the Java Runtime version it is using, etc. These are helpful if the logic in different OS is different or you have separate logic for Java Runtime.

#### Based on Operating System

```java
@Test
@EnabledOnOs({ LINUX, MAC })
void enabledOnLinuxOrMac() {

}

@Test
@DisabledOnOs(WINDOWS)
void disabledOnWindows() {

}
```

#### Based on Java Runtime

```java
@Test
@EnabledOnJre({ JAVA_9, JAVA_10 })
void enabledOnJava9Or10() {

}

@Test
@DisabledOnJre(JAVA_9)
void disabledOnJava9() {

}
```

#### Based on System Property

```java
@Test
@EnabledIfSystemProperty(named = "os.arch", matches = ".*64.*")
void enabledOn64BitArchitectures() {

}

@Test
@DisabledIfSystemProperty(named = "ci-server", matches = "true")
void disabledOnCiServer() {

}
```

***

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

- Final class
- Primitive type
- Anonymous class
- Static method
- Constructor method


### PowerMock

Based on the limitations above, [PowerMock](https://github.com/powermock/powermock) is the one framework that comes to save your life. It also provides an extension for Mockito API, [(PowerMockito)](https://www.javadoc.io/doc/org.powermock/powermock-api-mockito/1.7.0/index.html) which can be easily integrated with Mockito for Unit Testing.


To make your test case run-able with PowerMockito, we need the following configuration beforehand

```java
@RunWith(PowerMockRunner.class)
@PrepareForTest(fullyQualifiedNames = "ExampleFinalClass.class")
public final class exampleTest {

}
```

- `@RunWith`: required if using JUnit 4.x or the following code block if using Junit 3.x

    ```java
    public static TestSuite suite() throws Exception {
        return new PowerMockSuite(MyTestCase.class);
    }
    ```

- `@PrepareForTest`: This annotation tells PowerMock to prepare a certain class for testing. Typically, final classes, classes with final, static methods, which need to be byte-code manipulated
  - This annotation can be placed on both class and individual test methods. If placed on class means: all test methods will be handled by PowerMock


Sample class definition we will use for illustration:

```java
public class CollaboratorWithFinalAndStaticMethods {

    public final String helloMethod() {
        return "Hello World!";
    }

    public static String firstMethod(String name) {
        return "Hello " + name + " !";
    }

    public static String secondMethod() {
        return "Hello no one!";
    }

    public static String thirdMethod() {
        return "Hello no one again!";
    }
}

```


#### Mocking Constructors

First, we create a mock object using the PowerMockito API:

```java
CollaboratorWithFinalAndStaticMethods mock = mock(CollaboratorWithFinalAndStaticMethods.class);
```

Next, set an expectation telling that whenever the no-arg constructor of that class is invoked, a mock instance should be returned rather than a real one:

```java
whenNew(CollaboratorWithFinalAndStaticMethods.class).withNoArguments().thenReturn(mock);
```

Let's see how this construction mocking works in action by instantiating the `CollaboratorWithFinalMethods` class using its default constructor, and then verify the behaviors of PowerMock:

```java
CollaboratorWithFinalAndStaticMethods collaborator = new CollaboratorWithFinalAndStaticMethods();
verifyNew(CollaboratorWithFinalAndStaticMethods.class).withNoArguments(); 
```


#### Mocking Final Methods

```java
when(collaborator.helloMethod()).thenReturn("Hello World!");
```

This method is then executed:

```java
String welcome = collaborator.helloMethod();
```

The following assertions confirm that the `helloMethod` method has been called on the `collaborator` object, and returns the value set by the mocking expectation:

```java
Mockito.verify(collaborator).helloMethod();
assertEquals("Hello World!", welcome);
```


#### Mocking Static Methods

Mock static method

```java
mockStatic(CollaboratorWithFinalAndStaticMethods.class);
```

Define the output value

```java
when(CollaboratorWithFinalAndStaticMethods.firstMethod(Mockito.anyString())).thenReturn("Hello World!");
when(CollaboratorWithFinalAndStaticMethods.secondMethod()).thenReturn("Nothing special");
```

Or throw an exception

```java
doThrow(new RuntimeException()).when(CollaboratorWithFinalAndStaticMethods.class);
CollaboratorWithFinalAndStaticMethods.thirdMethod();
```


```java
String firstWelcome = CollaboratorWithFinalAndStaticMethods.firstMethod("Whoever");
String secondWelcome = CollaboratorWithFinalAndStaticMethods.firstMethod("Whatever");


assertEquals("Hello World!", firstWelcome);
assertEquals("Hello World!", secondWelcome);
```


Verify the behavior of the mock's method

```java
verifyStatic(Mockito.times(2));
CollaboratorWithStaticMethods.firstMethod(Mockito.anyString());

verifyStatic(Mockito.never());
CollaboratorWithStaticMethods.secondMethod();
```

Note: The verifyStatic method must be called right before any static method verification for PowerMockito to know that the successive method invocation is what needs to be verified.
{:.info}


#### Partial Mocking

Partial mocks allow you to mock some of the methods of a class while keeping the rest intact. Thus, you keep your original object, not a mock object, and you are still able to write your test methods in isolation.

Given this example Class:

```java
class CustomerService {
 
    public void add(Customer customer) {
        if (someCondition) {
            subscribeToNewsletter(customer);
        }
    }
 
    void subscribeToNewsletter(Customer customer) {
        // ...subscribing stuff
    }
}
```

So you want to test the `add()` method for actually invoking `subscribeToNewsletter()` and do **NOT** want to execute the logic from `subscribeToNewsletter()` in this test – e.g. since you've already unit tested `subscribeToNewsletter()` somewhere else.

Then you create a **PARTIAL** mock of `CustomerService`, giving a list of methods you want to mock.

```java
CustomerService customerService = PowerMock.createPartialMock(CustomerService.class, "subscribeToNewsletter");
customerService.subscribeToNewsletter(anyObject(Customer.class));

replayAll();

customerService.add(createMock(Customer.class));
```

Note:

- Partial Mock only works with `PUBLIC` or `DEFAULT` methods
- Using method name could potentially break your test cases sooner or later if the method name is changed



## Reference

- [Project Lombok - Features](https://projectlombok.org/features/all)
- [Unit tests with Mockito - Tutorial](https://www.vogella.com/tutorials/Mockito/article.html)
- [Assume vs assert in JUnit tests](https://stackoverflow.com/questions/44628483/assume-vs-assert-in-junit-tests)
- [Introduction to PowerMock](https://www.baeldung.com/intro-to-powermock)
- [Partial Mocking](https://docs.telerik.com/devtools/justmock/advanced-usage/partial-mocking#:~:text=Partial%20mocks%20allow%20you%20to,both%20static%20and%20instance%20calls.)
