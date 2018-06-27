---
layout: post
title: "Introduction to Memory Hierarchy, Part 1"
date: 2018-06-27
excerpt: "Reading Notes of CSAPP3e Chapter 6: The Memory Hierarchy"
tags: [CSAPP, Exceptional Control Flow]
---

# The Memory Hierarchy

## Storage Technologies

### Random Access Memory

*Random Access Memory (RAM)* comes into two varieties: static and dynamic.

- *Static RAM* is used for cache memories, both on and off the CPU chip.
- *Dynamic RAM* is used for the main memory plus the frame buffer of a graphics system

### Static RAM

SRAM stores each bit in a *bistable* memory cell.


<figure>
    <img src="https://github.com/Zhenye-Na/Zhenye-Na.github.io/blob/master/assets/images/posts-img/mh/mh1.png?raw=true" width="70%" class="center">
    <figcaption class="center">Figure 1: Inverted Pendulum. like an SRAM cell the pendulum has only two stable configurations, or states. from left to right: Stable left, Unstable and Stable right (Image Source: <a href="https://www.amazon.com/Computer-Systems-Programmers-Perspective-3rd/dp/013409266X" target="_blank"><em>Computer Systems: A Programmer's Perspective (3rd Edition)</em></a>)</figcaption>
</figure>


Due to its bistable nature, an SRAM memory cell will retain its value indefinitely.


### Dynamic RAM

DRAM memory cell is very sensitive to any disturbance. When the capacitor voltage is disturbed, it will never recover.

Exposure to light rays will cause the capacitor voltages to change.

> **Aside**: SRAM cells have more transistors than DRAM cells and thus have lower densities, are more expensive and consume more power.


### Conventional DRAM

The cells(bits) in a DRAM chip are partitioned into $d$ *supercells*, each conststing of $w$ DRAM *cells*. A $d \times w$ DRAM stores a total of $dw$ bits of information.

Information flows in and out of the chip via external connectors called *pins*.

The DRAM responds by sending the contents of supercell $(i, j)$ back to the controller.

- The row address $i$ is called a *RAS (row access strobe)*
- The column address $j$ is called a *CAS (column access strobe)*


### Memory Modules

DRAM chips are packaged in *memory modules* that plug into expansions slots on the main system board (motherboard).

DRAM 0 stores the first (lower-order) byte.


<figure>
    <img src="https://github.com/Zhenye-Na/Zhenye-Na.github.io/blob/master/assets/images/posts-img/mh/mh2.png?raw=true" width="70%" class="center">
    <figcaption class="center">Figure 2: Reading contents of a memory module. (Image Source: <a href="https://www.amazon.com/Computer-Systems-Programmers-Perspective-3rd/dp/013409266X" target="_blank"><em>Computer Systems: A Programmer's Perspective (3rd Edition)</em></a>)</figcaption>
</figure>


### Nonvolatile Memory

DRAMs and SRAMs are *volatile* int hte sense theat they lose their information if the supply voltage is turned off.

*Nonvalatile memories* retain their information even when they are powered off, they are referred as *read-only memories*.

- A *programmable ROM (PROM)* can be programmed exactly once.
- An *erasable programmable ROM (EPROM)* has a transparent quartz window that permits light to reach the storage cells.
- *Flash Memory*


### Accessing Main Memory

Data flows back and forth between the processorand the DRAM main memory over shared electrical conduits called *buses*. Each transfer of data between the CPU and memory is accomplished by a series of steps called a *bus transaction*.

- *read transaction* transfers data from the main memory to CPU
- *write transaction* transfers data from CPU to the main memory

A *bus* is a collection of parallel wires that carry address, data, and control signals.


<figure>
    <img src="https://github.com/Zhenye-Na/Zhenye-Na.github.io/blob/master/assets/images/posts-img/mh/mh3.jpeg?raw=true" width="70%" class="center">
    <figcaption class="center">Figure 3: Example bus structure. (Image Source: <a href="https://www.amazon.com/Computer-Systems-Programmers-Perspective-3rd/dp/013409266X" target="_blank"><em>Computer Systems: A Programmer's Perspective (3rd Edition)</em></a>)</figcaption>
</figure>


- *I/O bridge* includes memory controller
- *system bus* connects the CPU to I/O bridge
- *memory bus* connects I/O bridge to the main memory
- I/O bridge translates the electrical signals of the system bus to the electrical signals of the memory bus.


## Disk Storage

### Disk Geometry

- Disk are constructed from *platters*.
- Each platter consists of two sides, or *surfaces*.
- A rotating *spindle* in the center of the platter spins the platter at a fixed *rotational rate*
- Each surface constsrs of a collection of concentric rings called *tracks*
- Each track is partitioned into a collection of *sectors*.
- Each sector contains *equal number* of data bits encoded in the magnetic material on the sector.
- Sectors are separated by *gaps*, where no data bits are stored.
- Gaps store formatting bits that identify sectors.


<figure>
    <img src="https://github.com/Zhenye-Na/Zhenye-Na.github.io/blob/master/assets/images/posts-img/mh/mh4.jpeg?raw=true" width="70%" class="center">
    <figcaption class="center">Figure 4: Disk geometry. (Image Source: <a href="https://www.amazon.com/Computer-Systems-Programmers-Perspective-3rd/dp/013409266X" target="_blank"><em>Computer Systems: A Programmer's Perspective (3rd Edition)</em></a>)</figcaption>
</figure>



### Disk capacity & Operation

$$ \text{Capacity} = \frac{\text{# bytes}}{\text{sector}} \times \frac{\text{average # sectors}}{\text{track}} \times \frac{\text{# tracks}}{\text{surface}} \times \frac{\text{# surfaces}}{\text{platter}} \times \frac{\text{# platters}}{\text{disk}} $$


Disks read and write data in sector-size blocks. The *access time* for a sector: *seek time*, *rotational latency* and *transfer time*


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