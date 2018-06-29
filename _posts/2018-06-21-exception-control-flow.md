---
layout: post
title: "Exceptional Control Flow in Computer Systems"
date: 2018-06-21
excerpt: "Notes of CSAPP3e Exceptional Control Flow"
tags: [Computer Systems, Exceptional Control Flow]
---

# Exceptional Control Flow

Exceptional Control Flow exists at all levels of a computer system. It contains:

**Low level mechanisms**

1. **Exceptions**
    - Change in control flow in response to a system event (i.e., change in system state).
    - Implemented using combina;on of hardware and OS software.

**Higher level mechanisms**

2. **Process context switch**
    - Implemented by OS software and hardware timer.

3. **Signals**
    - Implemented by OS software. 

4. **Nonlocal jumps**: `setjmp()` and `longjmp()`
    - Implemented by `C` runtime library


## Exceptions

An exception is a transfer of control to the OS kernel in response to some event (i.e., change in processor state)

> **Kernel** is the memory-resident part of the OS  
> **Examples of events**: *Divide by 0, arithmetic overflow, page fault, I/O request completes, typing `Ctrl-C`*

<figure>
    <img src="https://github.com/Zhenye-Na/Zhenye-Na.github.io/blob/master/assets/images/posts-img/ecf/ecf1.png?raw=true" width="70%" class="center">
    <figcaption class="center">Figure 1: Exceptions. (Image Source: <a href="http://www.cs.cmu.edu/afs/cs/academic/class/15213-f15/www/schedule.html" target="_blank"><em>15-213: Intro to Computer Systems lecture slides</em></a>)</figcaption>
</figure>


### Asynchronous Exceptions (Interrupts)

Caused by events *external to the processor*

- Indicated by setting the processor's interrupt pin 
- Handler returns to "next" instruction

Examples:

- **Timer interrupt** 
    - Every few ms, an external timer chip triggers an `interrupt`
    - Used by the kernel to take back control from user programs 
- **I/O interrupt from external device**
    - Hitting `Ctrl-C` at the keyboard 
    - Arrival of a packet from a network
    - Arrival of data from a disk


### Synchronous Exceptions

Caused by events that *occur as a result of executing an instruction*:

- **Traps**
    - Intentional
    - Examples: *system calls, breakpoint traps, special instructions*
    - Returns control to "next" instruction

- **Faults** 
    - Unintentional but possibly recoverable 
    - Examples: *page faults (recoverable), protection faults (unrecoverable), floating point exceptions* 
    - Either re-executes faulting ("current") instruction or aborts 

- **Aborts** 
    - Unintentional and unrecoverable 
    - Examples: *illegal instruction, parity error, machine check* 
    - Aborts current program


## Processes

**A process is an instance of a running program.**

- One of the most profound ideas in computer science 
- Not the same as "program" or "processor"

Process provides each program with ***two key abstractions***:

- **Logical control flow**
    - Each program seems to have exclusive use of the CPU
    - Provided by kernel mechanism called *context switching*

- **Private address space**
    - Each program seems to have exclusive use of main memory
    - Provided by kernel mechanism called *virtual memory*


### Concurrent Processes

Each process is a logical control flow.

- Two processes run concurrently (are concurrent) if their flows overlap in time
- Otherwise, they are sequential


**User View of Concurrent Processes**:

- Control flows for concurrent processes are physically disjoint in time
- However, we can think of concurrent processes as running in parallel with each other


### Context Switching

- Processes are managed by a shared chunk of memory-­resident OS code called the ***kernel***
    - Important: *the kernel is not a separate process, but rather runs as part of some existing process.*

- Control flow passes from one process to another via a **context switch**


<figure>
    <img src="https://github.com/Zhenye-Na/Zhenye-Na.github.io/blob/master/assets/images/posts-img/ecf/ecf2.png?raw=true" width="70%" class="center">
    <figcaption class="center">Figure 2: Context Switching. (Image Source: <a href="http://www.cs.cmu.edu/afs/cs/academic/class/15213-f15/www/schedule.html" target="_blank"><em>15-213: Intro to Computer Systems lecture slides</em></a>)</figcaption>
</figure>


## System Call Error Handling

On error, Linux system-level functions typically return `-1` and set global variable `errno` to indicate cause.

Hard and fast rule:

- You must check the return status of every system-level function
- Only exception is the handful of functions that return `void`

Example:

```c
if ((pid = fork()) < 0) {
    fprintf(stderr, "fork error: %s\n", strerror(errno));
    exit(0);
}
```


## Creating and Terminating Processes

A process is in one of three states:

- **Running**
    - Process is either *executing*, or *waiting to be executed* and will *eventually be scheduled* (i.e., chosen to execute) by the kernel

- **Stopped**
    - Process execution is *suspended* and *will not be scheduled until* further *notice*

- **Terminated**
    - Process is *stopped permanently*



### Creating Processes

Parent process creates a new running child process by calling `fork`

`int fork(void)`

- Returns `0` to the *child process*, child's `PID` to *parent process*
- Child is almost identical to parent:
    - Child get an identical (but separate) copy of the parent's virtual address space
    - Child gets identical copies of the parent's open file descriptors 
    - Child has a diﬀerent PID than the parent
- `fork` is interesting (and often confusing) because it is *called once but returns twice*


### Terminating Processes

Process becomes terminated for one of three reasons:

- Receiving a signal whose default action is to terminate (next lecture)
- Returning from the main routine 
- Calling the exit function

`void exit(int status)`

- Terminates with an exit status of status 
- Convention: *normal return status is `0`, nonzero on error* 
- Another way to explicitly set the exit status is to return an integer value from the main routine

`exit` is *called once but never returns*.


## Modeling `fork` with Process Graphs

A process graph is a useful tool for capturing the partial ordering of statements in a concurrent program:

- Each vertex is the execution of a statement 
- `a -> b` means `a` happens before `b` 
- Edges can be labeled with current value of variables 
- printf vertices can be labeled with output 
- Each graph begins with a vertex with no inedges

Any *topological sort* of the graph corresponds to a feasible total ordering.

- Total ordering of vertices where all edges point from left to right


<figure>
    <img src="https://github.com/Zhenye-Na/Zhenye-Na.github.io/blob/master/assets/images/posts-img/ecf/ecf3.png?raw=true" width="70%" class="center">
    <figcaption class="center">Figure 3: Process Graph. (Image Source: <a href="http://www.cs.cmu.edu/afs/cs/academic/class/15213-f15/www/schedule.html" target="_blank"><em>15-213: Intro to Computer Systems lecture slides</em></a>)</figcaption>
</figure>



## Reaping Child Processes

- When process terminates, it still consumes system resources 
    - Examples: Exit status, various OS tables 
- Called a "zombie"
    - Living corpse, half alive and half dead

Reaping

- Performed by parent on terminated child (using wait or waitpid) 
- Parent is given exit status information 
- Kernel then deletes zombie child process

What if parent doesn't reap?

- If any parent terminates without reaping a child, then the orphaned child will be reaped by `init` process (`pid == 1`) 
- So, only need explicit reaping in long-running processes
    - e.g., shells and servers


## Synchronizing with Children: `wait`

Parent reaps a child by calling the `wait` function

`int wait(int *child_status)`

Suspends current process until one of its children terminates 
Return value is the pid of the child process that terminated 
If `child_status != NULL`, then the integer it points to will be set to a value that indicates reason the child terminated and the exit status:

- Checked using macros defined in `wait.h`
    - `WIFEXITED`, `WEXITSTATUS`, `WIFSIGNALED`, `WTERMSIG`, `WIFSTOPPED`, `WSTOPSIG`, `WIFCONTINUED`



## Loading and Running Programs: `execve`

`int execve(char *filename, char *argv[], char *envp[])`

Loads and runs in the current process:

- Executable ﬁle filename 
    - Can be object file or script file beginning with `#!interpreter` (e.g., `#!/bin/bash`) 
- ... with argument list argv 
    - By convention `argv[0]==filename` 
- ... and environment variable list envp 
    - "name=value" strings (e.g., `USER=droh`) 
    - `getenv`, `putenv`, `printenv`

- Overwrites code, data, and stack 
    - Retains PID, open files and signal context 

- Called once and never returns 
    - except if there is an error


## Summary

- **Exceptions**
    - Events that require nonstandard control flow 
    - Generated externally (interrupts) or internally (traps and faults)
- **Processes**
    - At any given time, system has multiple active processes 
    - Only one can execute at a time on a single core, though 
    - Each process appears to have total control of processor + private memory space

- **Spawning processes**
    - Call `fork`
    - One call, two returns

- **Process completion**
    - Call `exit`
    - One call, no return

- **Reaping and waiting for processes** 
    - Call `wait` or `waitpid`

- **Loading and running programs** 
    - Call `execve` (or variant) 
    - One call, (normally) no return



## References
  
[1] Randal E. Bryant, David R. O'Hallaron, Carnegie Mellon University [*"
Computer Systems: A Programmer's Perspective, 3/E (CS:APP3e)"*](http://csapp.cs.cmu.edu/3e/labs.html)  
[2] Randal E. Bryant, David R. O'Hallaron [*"Computer Systems: A Programmer's Perspective (3rd Edition)"*](https://www.amazon.com/Computer-Systems-Programmers-Perspective-3rd/dp/013409266X)



<style>
.center {
    display: block;
    margin-left: auto;
    margin-right: auto;
}
</style>