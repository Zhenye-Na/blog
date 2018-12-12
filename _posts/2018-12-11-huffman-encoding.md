---
layout: post
title: "The Huffman Encoding algorithm"
date: 2018-12-09
modify_date: 2018-12-09
excerpt: "Introduction to Huffman Encoding algorithm"
tags: [Algorithms]
mathjax: true
mathjax_autoNumber: true
---

> Huffman coding is a **lossless** data compression algorithm. The idea is to assign variable-length codes to input characters, lengths of the assigned codes are based on the frequencies of corresponding characters.

<figure>
  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Huffman_tree_2.svg/1920px-Huffman_tree_2.svg.png" width="50%" class="center">
  <figurecaption>Figure 1. Huffman tree generated from the exact frequencies of the text "this is an example of a huffman tree". The frequencies and codes of each character are below. Encoding the sentence with this code requires 195 (or 147) bits, as opposed to 288 (or 180) bits if 36 characters of 8 (or 5) bits were used. (This assumes that the code tree structure is known to the decoder and thus does not need to be counted as part of the transmitted information.)</figurecaption>
</figure>


# The Huffman Encoding

The process of finding and/or using such a code proceeds by means of Huffman coding, an algorithm developed by [David A. Huffman](https://en.wikipedia.org/wiki/David_A._Huffman) while he was a Sc.D. student at MIT, and published in the 1952 paper ["A Method for the Construction of Minimum-Redundancy Codes"](https://en.wikipedia.org/wiki/Huffman_coding#cite_note-1).

## Overview

The video below is Huffman Encoding section of CS225 Online Series taught by Chase Geige. It is strongly recommended that you watch the video to understand the motivation for why we're talking about Huffman Encoding as well as how the algorithm works. If you are interested in seeing a step-by-step execution of the Huffman Tree algorithms, please watch it:


<!--<iframe width="652" height="451" src="https://www.youtube.com/embed/fWk6Y8Rd6bs" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>-->


In a nutshell, Huffman encoding takes in a text input and generates a binary code (a string of 0's and 1's) that represents that text.
{:.info}

## Building the Huffman tree

Input is array of unique characters along with their frequency of occurrences and output is Huffman Tree.

1. Create a leaf node for each unique character and build a min heap of all leaf nodes (Min Heap is used as a priority queue. The value of frequency field is used to compare two nodes in min heap. Initially, the least frequent character is at root)
2. Extract two nodes with the minimum frequency from the min heap.
3. Create a new internal node with frequency equal to the sum of the two nodes frequencies. Make the first extracted node as its left child and the other extracted node as its right child. Add this node to the min heap.
4. Repeat steps #2 and #3 until the heap contains only one node. The remaining node is the root node and the tree is complete.


## From Text to Binary

> Let's understand the algorithm with this example: "feed me more food"


**Step 1**: Calculate frequency of every character in the text, and order by increasing frequency. Store in a queue.


```
r : 1 | d : 2 | f : 2 | m : 2 | o : 3 | 'SPACE' : 3 | e :
```


**Step 2**: Build the tree from the bottom up. Start by taking the two least frequent characters and merging them (create a parent node for them). Store the merged characters in a new queue:


```mermaid
graph TD;
    A(rd:3) --> B(r:1);
    A(rd:3) --> C(d:2);
```

```
SINGLE: f : 2 | m : 2 | o : 3 | 'SPACE' : 3 | e : 4

MERGED: rd : 3
```


**Step 3**: Repeat Step 2 this time also considering the elements in the new queue. 'f' and 'm' this time are the two elements with the least frequency, so we merge them:


```mermaid
graph TD;
    A(rd:3) --> B(r:1);
    A(rd:3) --> C(d:2);
    
    D(fm:4) --> E(f:2);
    D(fm:4) --> F(m:2);
```

```
SINGLE: o : 3 | 'SPACE' : 3 | e : 4

MERGED: rd : 3 | fm : 4
```


**Step 4**: Repeat Step 3 until there are no more elements in the SINGLE queue, and only one element in the MERGED queue:

```mermaid
graph TD;
    A(rd:3) --> B(r:1);
    A(rd:3) --> C(d:2);
    
    D(fm:4) --> E(f:2);
    D(fm:4) --> F(m:2);
    
    G(o+SPACE:6) --> H(o:3);
    G(o+SPACE:6) --> J(SPACE:3);
```

```
SINGLE: e : 4

MERGED: rd : 3 | fm : 4 | o+SPACE : 6
```

```mermaid
graph TD;
    K(rde:7) --> L(e:4);
    K(rde:7) --> A(rd:3);
    
    A(rd:3) --> B(r:1);
    A(rd:3) --> C(d:2);
    
    D(fm:4) --> E(f:2);
    D(fm:4) --> F(m:2);
    
    G(o+SPACE:6) --> H(o:3);
    G(o+SPACE:6) --> J(SPACE:3);
```


```
SINGLE:

MERGED: fm : 4 | o+SPACE : 6 | rde: 7
```

```mermaid
graph TD;
    K(rde:7) --> L(e:4);
    K(rde:7) --> A(rd:3);
    
    A(rd:3) --> B(r:1);
    A(rd:3) --> C(d:2);
    
    D(fm:4) --> E(f:2);
    D(fm:4) --> F(m:2);
    
    G(o+SPACE:6) --> H(o:3);
    G(o+SPACE:6) --> J(SPACE:3);
    
    M(fmo+SPACE:10) --> D(fm:4);
    M(fmo+SPACE:10) --> G(o+SPACE:6);
```


```
SINGLE:

MERGED: rde: 7 | fmo+SPACE: 10
```


```mermaid
graph TD;
    K(rde:7) --> L(e:4);
    K(rde:7) --> A(rd:3);
    
    A(rd:3) --> B(r:1);
    A(rd:3) --> C(d:2);
    
    D(fm:4) --> E(f:2);
    D(fm:4) --> F(m:2);
    
    G(o+SPACE:6) --> H(o:3);
    G(o+SPACE:6) --> J(SPACE:3);
    
    M(fmo+SPACE:10) --> D(fm:4);
    M(fmo+SPACE:10) --> G(o+SPACE:6);
    
    N(rdefmo+SPACE:17) --> K(rde:7);
    N(rdefmo+SPACE:17) --> M(fmo+SPACE:10);
```


```
SINGLE:

MERGED: rdefmo+SPACE: 17
```


## From Binary Code to Text






## References

[1] Lab assignment of CS225: Data Structures in UIUC. [Hazardous Huffman Codes](https://courses.engr.illinois.edu/cs225/sp2018/labs/huffman/)  
[2] Video intro to huffman encoding by Chase Geige. [CS225 Online Series: Huffman Encodings](https://www.youtube.com/watch?time_continue=3&v=fWk6Y8Rd6bs)  
[3] GeeksforGeeks. [Huffman Coding | Greedy Algo-3](https://www.geeksforgeeks.org/huffman-coding-greedy-algo-3/)





<style>
.center {
    display: block;
    margin-left: auto;
    margin-right: auto;
}
</style>
