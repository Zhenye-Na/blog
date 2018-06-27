---
layout: post
title: "Introduction to Memory Hierarchy, Part 2"
date: 2018-06-27
excerpt: "Reading Notes of CSAPP3e Chapter 6: The Memory Hierarchy"
tags: [CSAPP, Memory Hierarchy, Computer Systems]
---

# The Memory Hierarchy

## Locality

Locality is described as having two distinct forms: *temporal locality* and *spatial locality*.

- Good *temporal locality* is a memory location that is referenced once is likely to be referenced again multiple times.
- Good *spatial locality* is a memory location that is referenced once, then the program is likely to reference a nearby memory location.

> Aside: **programs with good locality run much faster than programs with poor locality**.

- Programs that repeatedly reference the same variables enjoy good temporal locality
- For programs with *stride-$k$* reference patterns, the smaller the stride, the better the spatial locality. Programs with stride-$1$ reference patterns have a good spatial locality. Programs that hop around memory with large strides have poor spatial locality.


## Memory Hierarchy


### Caching in the Memory Hierarchy


<figure>
    <img src="https://github.com/Zhenye-Na/Zhenye-Na.github.io/blob/master/assets/images/posts-img/mh/mh5.jpeg?raw=true" width="80%" class="center">
    <figcaption class="center">Figure 1: The Memory Hierarchy. (Image Source: <a href="https://www.amazon.com/Computer-Systems-Programmers-Perspective-3rd/dp/013409266X" target="_blank"><em>Computer Systems: A Programmer's Perspective (3rd Edition)</em></a>)</figcaption>
</figure>

In general, the storage devices get slower, cheaper, and larger as we move from higher to lower *levels*.


### Cache Hits & Misses


<figure>
    <img src="https://github.com/Zhenye-Na/Zhenye-Na.github.io/blob/master/assets/images/posts-img/mh/mh6.jpeg?raw=true" class="center">
    <figcaption class="center">Figure 2: Cache Hits & Misses. (Image Source: <a href="https://www.amazon.com/Computer-Systems-Programmers-Perspective-3rd/dp/013409266X" target="_blank"><em>Computer Systems: A Programmer's Perspective (3rd Edition)</em></a>)</figcaption>
</figure>


## Cache Memories

The memory hierarchies of early computer systems consisted of: CPU registers, main memory, and disk storage.



<figure>
    <img src="https://github.com/Zhenye-Na/Zhenye-Na.github.io/blob/master/assets/images/posts-img/mh/mh8.jpeg?raw=true" width="80%" class="center">
    <figcaption class="center">Figure 3: Typical bus structure for cache memories. (Image Source: <a href="https://www.amazon.com/Computer-Systems-Programmers-Perspective-3rd/dp/013409266X" target="_blank"><em>Computer Systems: A Programmer's Perspective (3rd Edition)</em></a>)</figcaption>
</figure>


### Generic Cache Memory Organizaiton


<figure>
    <img src="https://github.com/Zhenye-Na/Zhenye-Na.github.io/blob/master/assets/images/posts-img/mh/mh7.jpeg?raw=true" width="80%" class="center">
    <figcaption class="center">Figure 4: General Cache Memory Organization. (Image Source: <a href="https://www.amazon.com/Computer-Systems-Programmers-Perspective-3rd/dp/013409266X" target="_blank"><em>Computer Systems: A Programmer's Perspective (3rd Edition)</em></a>)</figcaption>
</figure>


## Summary


<figure>
    <img src="https://github.com/Zhenye-Na/Zhenye-Na.github.io/blob/master/assets/images/posts-img/mh/mh9.jpeg?raw=true" class="center">
    <figcaption class="center">Figure 5: Summary. (Image Source: <a href="https://www.amazon.com/Computer-Systems-Programmers-Perspective-3rd/dp/013409266X" target="_blank"><em>Computer Systems: A Programmer's Perspective (3rd Edition)</em></a>)</figcaption>
</figure>


## References
  
[1] Randal E. Bryant, David R. O'Hallaron, Carnegie Mellon University [*"
Computer Systems: A Programmer's Perspective, 3/E (CS:APP3e)"*](http://csapp.cs.cmu.edu/3e/labs.html)  
[2] Randal E. Bryant, David R. O'Hallaron [*"Computer Systems: A Programmer's Perspective (3rd Edition)"*](https://www.amazon.com/Computer-Systems-Programmers-Perspective-3rd/dp/013409266X)


<!--
<figure>
    <img src="https://github.com/Zhenye-Na/Zhenye-Na.github.io/blob/master/assets/images/posts-img/ecf/ecf3.png?raw=true" width="70%" class="center">
    <figcaption class="center">Figure 3: Process Graph. (Image Source: <a href="http://www.cs.cmu.edu/afs/cs/academic/class/15213-f15/www/schedule.html" target="_blank"><em>15-213: Intro to Computer Systems lecture slides</em></a>)</figcaption>
</figure>-->


<style>
.center {
    display: block;
    margin-left: auto;
    margin-right: auto;
}
</style>