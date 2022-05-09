---
layout: article
title: "Java Best Practices - Logging"
date: 2022-05-03
modify_date: 2022-05-09
excerpt: "How to log Java events effectively"
tags: [Java]
mathjax: false
mathjax_autoNumber: false
key: java-best-practices-logging
---

> **What is Logging?**
>
> Logging is to keep the log that records either events that occur in an operating system or applications as a file, so that developer can trace in for more details when something bad happened.

## Logging Types

Logging is an important topic in software development and I cannot stress how important and helpful enough when it comes to debug a problem or error during daily development. There are several different types of logs in Java and let's dive deep to look into them.

### Application Logs

Usually, the application produces the logs. for example

1. _Information_ on what is the request context, like what methods are triggered and what is the response
2. _Warning_ message of a abnormal invocation
3. _Error_ message like `InternalServerException` or just the client request is malformed
4. etc ...


### Server Logs

This could be produced by Tomcat/Netty Server, Nginx Server etc. It might contain information concerning Server healthy status, Running status etc..

If you adopted AWS Lambda as the deploy menthod, your Lambda function comes with a CloudWatch Logs log group and a log stream for each instance of your function. The Lambda runtime environment sends details about each invocation to the log stream, and relays logs and other output from your function's code.


### JVM Logs

The JVM logs are created by redirecting the `System.out` and `System.err` streams of the JVM to independent log files.

1. The `System.out` log is used to monitor the health of the running application server.
2. The `System.err` log contains exception stack trace information that is useful when performing problem analysis.

> Reference: [Java virtual machine (JVM) log settings](https://www.ibm.com/docs/en/was-nd/8.5.5?topic=logs-java-virtual-machine-jvm-log-settings)


#### Garbage collector Logs

Within the large set of JVM logs, there is one type of log which could provide some insights for developers which is the Garbage collector logs. By default, the implementation of Garbage Collection in Java is pretty efficient. However, if your application has a very large throughput and in case the default Garbage Collection implementation reaches to bottleneck

Be default the GC log is off, you can use the following properties to enable the GC log for Java 8 or earlier

```
-XX:+PrintGCDetails -Xloggc:
```


### System Logs

Logs that written by your OS. Since most developer use Linux/Unix system, it will be good if you know syslog service

To know more about System Logs, check the resource posted by Stackify here: https://stackify.com/syslog-101/


## Basic Concepts

### Logger

Loggers are created in your Java application, for example:

```java
public class LoggingDemo {

    private static final org.apache.logging.log4j.Logger log = org.apache.logging.log4j.LogManager.getLogger(LogExample.class);

    public static void main(final String[] args) {
        log.info("Log something here");
    }

}
```

They are objects that trigger/extrac log events. They will capture it and pass the log events to Appender


### Appender

Appenders forward logs from Loggers to an **output destination**. During this process, log messages are formatted using a **Layou**t before being delivered to their final destination. Multiple Appenders can be combined to write log events to multiple destinations. For example, *a single event can be simultaneously displayed in a console and written to a file*.

**Console Appender**



**File Appender**



### Layout

This property is to define the preferred format of your logs.

For example, you can use `JSONLayout` for the Appender, you will have a log entry message looks like following (from Log4j2 website: https://logging.apache.org/log4j/2.x/manual/layouts.html)

```json
{
  "instant" : {
    "epochSecond" : 1493121664,
    "nanoOfSecond" : 118000000
  },
  "thread" : "main",
  "level" : "INFO",
  "loggerName" : "HelloWorld",
  "marker" : {
    "name" : "child",
    "parents" : [ {
      "name" : "parent",
      "parents" : [ {
        "name" : "grandparent"
      } ]
    } ]
  },
  "message" : "Hello, world!",
  "thrown" : {
    "commonElementCount" : 0,
    "message" : "error message",
    "name" : "java.lang.RuntimeException",
    "extendedStackTrace" : [ {
      "class" : "logtest.Main",
      "method" : "main",
      "file" : "Main.java",
      "line" : 29,
      "exact" : true,
      "location" : "classes/",
      "version" : "?"
    } ]
  },
  "contextStack" : [ "one", "two" ],
  "endOfBatch" : false,
  "loggerFqcn" : "org.apache.logging.log4j.spi.AbstractLogger",
  "contextMap" : {
    "bar" : "BAR",
    "foo" : "FOO"
  },
  "threadId" : 1,
  "threadPriority" : 5,
  "source" : {
    "class" : "logtest.Main",
    "method" : "main",
    "file" : "Main.java",
    "line" : 29
  }
}
```


## Logging Frameworks

In Java, there are several logging libraries and you don't have to be familiar with each one, but we should be familiar with the fundamental concepts and know which library we should use.

Commonly used logging libraries include but not limit to: _`Slf4j`_, `Log4j`, `Logback`, `Log4j2`, `Apache Common-logging`, `java.util.logging` etc. Below is the dagram which illustrates the relationship of them

![](https://raw.githubusercontent.com/Zhenye-Na/img-hosting-picgo/master/img/slf4j-to-other-log.png)


- SLF4j: **Simple Logging Facade for Java** (SLF4j) serves as a simple **facade or abstraction** for various logging frameworks allowing the end user to plug in the desired logging framework at *deployment time*
    - It is not itself a logging library, but a generic **interface** to one of many logging libraries.
    - IF you are not familiar with Facade Pattern, check my previous article on Facade Pattern [here](https://zhenye-na.github.io/blog/2021/12/09/design-patterns-the-facade-pattern.html)
- Log4j: Apache Java Logging framework
- Logback - Successor to the Log4j project
- Log4j2 - Improved and fixed issues in Logback and Log4j

Compared to Logback and Log4j, Log4j2 is preferred to use as the logging frameworks nowadays since the performance is better as well as more features. If performance is not an important factor then Lobback could be the second option



## Log levels

There are several levels of logs, each represent different "severity" of the logged event, here are some:

* `TRACE`: This should ONLY be used during development to track bugs, but NEVER committed to your VCS.
* `DEBUG`: This is mostly used during debugging. Leave only the most meaningful entries before going into production, and can be activated during troubleshooting.
* `INFO`: This is for all actions that are user-driven, or system specific (ie regularly scheduled operations...)
* `NOTICE`: This will be the level at which the program will run when in production. Log at this level all the notable events that are not considered an error.
* `WARN`: This is for all events that could potentially become an error. For example, one API call took more than a predefined time
* `ERROR`: This is for logging error/exception condition at this level. That can be API calls that return errors or internal error conditions.
* `FATAL`: Don't use this until Dooms Day


## Log messages

**Meaningful**

* When writing your log entries messages, always anticipate that there are emergency situations where the only thing you have is the log file, from which you have to understand what happened. Doing it right might be the subtle difference between getting fired and promoted.
* Keep the audience in mind, it is not only you who read the log, customers, developers, devops engs, test engineers, etc..
* Don't log message that depends on a previous message's content, this is bad because:
  * previous message maybe in another log level
  * the other log message may appear far before or after, if this is a multi-threading environment

**With Context**

As mentioned above, imagine that give a SEV2 ticket, the only thing you have is your CloudWatch Logs. Add proper context to your log messages will save your time to find the root cause.

**Machine Parse-able (Optional)**

If we perform automation/monitoring on the log messages, with a good machine readable format, like JSON, it will be easy to be parsed and sent to monitoring system.

Compare the two messages below, you can easily find out that the second one is more readable, for both human and machine.


```java
log.info("User {} plays game {}", userId, gameId);
// => [INFO] c.d.g.UserRequest  User 2333 plays GTA5

// vs

// just for the idea
log.info(gson.toJson(User))
// => [INFO] c.d.g.UserRequest {"User":"2333", "Game":"GTA5"}
```

#### Don't log sensitive message

* Credentials, Session Tokens, etc..
* Don't expose internal services to External customers



## Mapped Diagnostic Context (MDC)

- What is MDC?
  - MDC is short for "Mapped Diagnostic Context", it helps logging the information that normal logging cannot 
- Why we wanna use it?
  - suppose we wanna add the `requestId` or `orderId` for every request comes in, we can store `orderId` in MDC and access to it later
  - MDC can enable us to use a `Map-like` structure to store and access information


### ThreadContext

> `ThreadContext` data structure is the MDC implementation in Log4j2, which is based on [ThreadLocal](https://docs.oracle.com/javase/6/docs/api/java/lang/ThreadLocal.html)

```
- At the start of the thread, clear the `ThreadContext` object and fill in information that you want for log messages, like `requestId`, `awsAccountId` etc.
- Log the message with accessing it like `ThreadContext.get("awsAccountId")`
    - best way is to update the Log4j2 configuration file to make it automatically add the variables in ThreadContext without accessing `ThreadContext.get("awsAccountId")` explicitly in codes
```


## Lombok @Log (and friends)

During the daily usage of Logging, we have to create `Logger` in each class and this is pretty verbose. Take `Log4j2` for example:

```java
public class LoggingDemo {

    private static final org.apache.logging.log4j.Logger log = org.apache.logging.log4j.LogManager.getLogger(LogExample.class);

    public static void main(final String[] args) {
        log.info("Log something here");
    }

}
```

With the help of `lombok.extern.log4j` package, it could be simplified as

```java
@Log4j2
public class LoggingDemo {

    public static void main(final String[] args) {
        log.info("Log something here");
    }

}
```

The `Log4j2` annotation will automatically generate a `static final log` variable for you. If a field called `log` already exists, a warning will be emitted and **no code will be generated**.

***

## References

- [Java Logging Basics](https://www.loggly.com/ultimate-guide/java-logging-basics/)
- [What is the difference between Log4j, SLF4J and Logback?](https://stackoverflow.com/a/39563140)
- [Syslog Tutorial: How It Works, Examples, Best Practices, and More](https://stackify.com/syslog-101/)
