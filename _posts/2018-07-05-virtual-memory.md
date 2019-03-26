---
layout: post
title: "Introduction to Virtual Memory"
date: 2018-07-05
excerpt: "Reading Notes of CSAPP3e Chapter 7: Linking"
tags: [Computer Systems]
---

# Virtual Memory

## I/O Basics

Four basic operations:

- open
- close
- read
- write

What's a file descriptor?

- Returned by open.

- int fd = open("/path/to/file", O_RDONLY);
- fd is some positive value or `-1` to denote error

Every process starts with 3 open file descriptors that can be accessed macros like STDOUT_fiLENO

- 0 - `STDIN`
- 1 - `STDOUT`
- 2 - `STDERR`


## Virtual Memory

We define a mapping from the virtual address used by the process to the actual physical address of the data in memory.


<figure>
    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Virtual_address_space_and_physical_address_space_relationship.svg/300px-Virtual_address_space_and_physical_address_space_relationship.svg.png" width="50%" class="center">
    <figcaption class="center">figure 1: Virtual Memory. (Image Source: <a href="https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Virtual_address_space_and_physical_address_space_relationship.svg/300px-Virtual_address_space_and_physical_address_space_relationship.svg.png" target="_blank"><em>Wikipedia</em></a>)</figcaption>
</figure>


### Page table

- Lets us look up the physical address corresponding to any virtual address. (**Array of physical addresses, indexed by virtual address.**)

### TLB (Translation Lookaside Buffer)

- A special tiny cache just for page table entries.
- Speeds up translation.

### Multi-level page tables

- The address space is often sparse.
- Use page directory to map large chunks of memory to a page table.
- Mark large unmapped regions as non-present in page directory instead of storing page tables full of invalid entries.


## VM Address Translation

### Virtual Address Space

- $V = \{ 0, 1, \cdots, N–1 \}$
- There are **N possible virtual addresses**.
- Virtual addresses are `n` bits long; $2^n = N$.

### Physical Address Space

- $P = \{ 0, 1, \cdots, M–1 \}$
- There are **M possible physical addresses**.
- Virtual addresses are `m` bits long; $2^m = M$.

### Memory is grouped into "pages."

- Page size is `P` bytes.
- The address offset is `p` bytes; $2^p = P$.
- Since the **virtual offset (VPO)** and **physical offset (PPO)** are the same, the offset doesn't need to be translated.



<figure>
    <img src="https://github.com/Zhenye-Na/Zhenye-Na.github.io/blob/master/assets/images/posts-img/vm/vm1.png?raw=true" width="80%" class="center">
    <figcaption class="center">figure 2: VM Address Translation. (Image Source: <a href="http://www.cs.cmu.edu/afs/cs/academic/class/15213-f15/www/schedule.html" target="_blank"><em>15-213: Intro to Computer Systems lecture slides</em></a>)</figcaption>
</figure>


## VM Address Translation with TLB

That's nice and simple, but it doubles memory usage.

- One memory access to look in the page table.
- One memory access of the actual memory we're looking for.

Solution:

- Cache the most frequently used page table entries in the TLB.
- To look up a virtual address in the TLB, split up the VPN (not the whole virtual address) into a TLB index and a TLB tag.



<figure>
    <img src="https://github.com/Zhenye-Na/Zhenye-Na.github.io/blob/master/assets/images/posts-img/vm/vm2.png?raw=true" width="60%" class="center">
    <figcaption class="center">figure 2: VM Address Translation. (Image Source: <a href="http://www.cs.cmu.edu/afs/cs/academic/class/15213-f15/www/schedule.html" target="_blank"><em>15-213: Intro to Computer Systems lecture slides</em></a>)</figcaption>
</figure>


## Address TranslaCon in Real Life

- Multi-level page tables, with the first level oten called a "page directory" 
- Use first part of the VPN to get to the right directory and then the next part to get the PPN 
- K-level page table divides VPN into k parts


<figure>
    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Page_table_actions.svg/440px-Page_table_actions.svg.png" width="70%" class="center">
    <figcaption class="center">figure 2: Address Translation in Real life. (Image Source: <a href="https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Page_table_actions.svg/440px-Page_table_actions.svg.png" target="_blank"><em>Wikipedia</em></a>)</figcaption>
</figure>


## References
  
[1] Randal E. Bryant, David R. O'Hallaron, Carnegie Mellon University [*"
Computer Systems: A Programmer's Perspective, 3/E (CS:APP3e)"*](http://csapp.cs.cmu.edu/3e/labs.html)  
[2] Randal E. Bryant, David R. O'Hallaron [*"Computer Systems: A Programmer's Perspective (3rd Edition)"*](https://www.amazon.com/Computer-Systems-Programmers-Perspective-3rd/dp/013409266X)


<!--
<figure>
    <img src="https://github.com/Zhenye-Na/Zhenye-Na.github.io/blob/master/assets/images/posts-img/ecf/ecf3.png?raw=true" width="70%" class="center">
    <figcaption class="center">figure 3: Process Graph. (Image Source: <a href="http://www.cs.cmu.edu/afs/cs/academic/class/15213-f15/www/schedule.html" target="_blank"><em>15-213: Intro to Computer Systems lecture slides</em></a>)</figcaption>
</figure>-->


<style>
.center {
    display: block;
    margin-left: auto;
    margin-right: auto;
}
</style>