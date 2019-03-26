---
layout: post
title: "Counting bits set, bitCount"
date: 2018-06-17
excerpt: "CSAPP3e Self-Study Datalab"
tags: [bitwise, CSAPP]
---

## Counting bits set, in parallel

```c
unsigned int v; // count bits set in this (32-bit value)
unsigned int c; // store the total here
static const int S[] = {1, 2, 4, 8, 16}; // Magic Binary Numbers
static const int B[] = {0x55555555, 0x33333333, 0x0F0F0F0F, 0x00FF00FF, 0x0000FFFF};

c = v - ((v >> 1) & B[0]);
c = ((c >> S[1]) & B[1]) + (c & B[1]);
c = ((c >> S[2]) + c) & B[2];
c = ((c >> S[3]) + c) & B[3];
c = ((c >> S[4]) + c) & B[4];
```

The `B` array, expressed as binary, is:

```c
B[0] = 0x55555555 = 01010101 01010101 01010101 01010101
B[1] = 0x33333333 = 00110011 00110011 00110011 00110011
B[2] = 0x0F0F0F0F = 00001111 00001111 00001111 00001111
B[3] = 0x00FF00FF = 00000000 11111111 00000000 11111111
B[4] = 0x0000FFFF = 00000000 00000000 11111111 11111111
```

We can adjust the method for larger integer sizes by continuing with the patterns for the ***Binary Magic Numbers***, `B` and `S`. If there are `k` bits, then we need the arrays `S` and `B` to be `ceil(lg(k))` elements long, and we must compute the same number of expressions for c as S or B are long. For a 32-bit `v`, 16 operations are used.

The best method for counting bits in a 32-bit integer `v` is the following:

```c
v = v - ((v >> 1) & 0x55555555);                    // reuse input as temporary
v = (v & 0x33333333) + ((v >> 2) & 0x33333333);     // temp
c = ((v + (v >> 4) & 0xF0F0F0F) * 0x1010101) >> 24; // count
```

The best bit counting method takes only 12 operations, which is the same as the lookup-table method, but avoids the memory and potential cache misses of a table. It is a hybrid between the purely parallel method above and the earlier methods using multiplies (in the section on counting bits with 64-bit instructions), though it doesn't use 64-bit instructions. The counts of bits set in the bytes is done in parallel, and the sum total of the bits set in the bytes is computed by multiplying by `0x1010101` and shifting right 24 bits.

A generalization of the best bit counting method to integers of bit-widths upto 128 (parameterized by type T) is this:

```c
v = v - ((v >> 1) & (T)~(T)0/3);                           // temp
v = (v & (T)~(T)0/15*3) + ((v >> 2) & (T)~(T)0/15*3);      // temp
v = (v + (v >> 4)) & (T)~(T)0/255*15;                      // temp
c = (T)(v * ((T)~(T)0/255)) >> (sizeof(T) - 1) * CHAR_BIT; // count
```

See [Ian Ashdown's nice newsgroup post](http://groups.google.com/groups?q=reverse+bits&num=100&hl=en&group=comp.graphics.algorithms&imgsafe=off&safe=off&rnum=2&ic=1&selm=4fulhm%248dn%40atlas.uniserve.com) for more information on counting the number of bits set (also known as sideways addition). The best bit counting method was brought to my attention on October 5, 2005 by [Andrew Shapira](http://onezero.org/); he found it in pages 187-188 of [Software Optimization Guide for AMD Athlon™ 64 and Opteron™ Processors](http://www.amd.com/us-en/assets/content_type/white_papers_and_tech_docs/25112.PDF). Charlie Gordon suggested a way to shave off one operation from the purely parallel version on December 14, 2005, and Don Clugston trimmed three more from it on December 30, 2005. I made a typo with Don's suggestion that Eric Cole spotted on January 8, 2006. Eric later suggested the arbitrary bit-width generalization to the best method on November 17, 2006. On April 5, 2007, Al Williams observed that I had a line of dead code at the top of the first method.

## Code

```c
/*
 * bitCount - returns count of number of 1's in word
 *   Examples: bitCount(5) = 2, bitCount(7) = 3
 *   Legal ops: ! ~ & ^ | + << >>
 *   Max ops: 40
 *   Rating: 4
 */
int bitCount(int v) {
    unsigned int c;                                     // store the total here
    v = v - ((v >> 1) & 0x55555555);                    // reuse input as temporary
    v = (v & 0x33333333) + ((v >> 2) & 0x33333333);     // temp
    c = ((v + (v >> 4) & 0xF0F0F0F) * 0x1010101) >> 24; // count
    return c;
}
```

## References

[1] Stanford [*"Counting bits set, in parallel"*](http://graphics.stanford.edu/~seander/bithacks.html#CountBitsSetParallel)  
[2] Randal E. Bryant, David R. O'Hallaron, Carnegie Mellon University [*"
Computer Systems: A Programmer's Perspective, 3/E (CS:APP3e)"*](http://csapp.cs.cmu.edu/3e/labs.html)