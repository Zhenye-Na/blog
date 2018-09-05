---
layout: post
title: "10 Common Data Structures Explained"
date: 2018-09-03
excerpt: "Data structures are a critical part of software development, and one of the most common topics for developer job interview questions. The good news is that they are basically just specialized formats for organizing and storing data."
tags: [Data Structures]
---


# 10 Common Data Structures Explained

## Linked Lists

A linked list is one of the most basic data structures. It is often compared to an array since many other data structures can be implemented with either an array or a linked list. They each have advantages and disadvantages.

<img src="https://image.slidesharecdn.com/singlelinkedlist-100513043540-phpapp01/95/single-linked-list-1-728.jpg?cb=1409962522" width="60%">

A linked list consists of a group of nodes which together represent a sequence. Each node contains two things:

- the actual **data** being stored (which can be basically any type of data)
- a **pointer** (or link) to the next node in the sequence.

There are also doubly linked lists where each node has a pointer to both the next item and the previous item in the list.

The most basic operations in a linked list are adding an item to the list, deleting an item from the list, and searching the list for an item.

Linked list time complexity

```
╔═══════════╦═════════╦════════════╗
║ Algorithm ║ Average ║ Worst Case ║
╠═══════════╬═════════╬════════════╣
║ Space     ║ O(n)    ║ O(n)       ║
║ Search    ║ O(n)    ║ O(n)       ║
║ Insert    ║ O(1)    ║ O(1)       ║
║ Delete    ║ O(1)    ║ O(1)       ║
╚═══════════╩═════════╩════════════╝
```


## Stacks

A stack is a basic data structure where you can only insert or delete items at the top of the stack. It is kind of similar to a stack of books. If you want to look at a book in the middle of the stack you must take all of the books above it off first.

The stack is considered **LIFO** (Last In First Out) — meaning the last item you put in the stack is the first item that comes out of the stack


<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Data_stack.svg/391px-Data_stack.svg.png" width="60%">


- There are three main operations that can be performed on stacks: 
    - inserting an item into a stack (called 'push')
    - deleting an item from the stack (called 'pop')
    - displaying the contents of the stack (sometimes called 'peek')

Stack time complexity

```
╔═══════════╦═════════╦════════════╗
║ Algorithm ║ Average ║ Worst Case ║
╠═══════════╬═════════╬════════════╣
║ Space     ║ O(n)    ║ O(n)       ║
║ Search    ║ O(n)    ║ O(n)       ║
║ Insert    ║ O(1)    ║ O(1)       ║
║ Delete    ║ O(1)    ║ O(1)       ║
╚═══════════╩═════════╩════════════╝
```


## Queues

You can think of a queue as a line of people at a grocery store. The first one in the line is the first one to be served. Just like a queue.

<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Data_Queue.svg/1200px-Data_Queue.svg.png" width="60%">

A queue is considered **FIFO** (First In First Out) to demonstrate the way it accesses data. This means that once a new element is added, all elements that were added before have to be removed before the new element can be removed.

A queue has just two main operations: enqueue and dequeue. Enqueue means to insert an item into the back of the queue and dequeue means removing the front item.


Queue time complexity

```
╔═══════════╦═════════╦════════════╗
║ Algorithm ║ Average ║ Worst Case ║
╠═══════════╬═════════╬════════════╣
║ Space     ║ O(n)    ║ O(n)       ║
║ Search    ║ O(n)    ║ O(n)       ║
║ Insert    ║ O(1)    ║ O(1)       ║
║ Delete    ║ O(1)    ║ O(1)       ║
╚═══════════╩═════════╩════════════╝
```


## Sets


<img src="https://www.codeproject.com/KB/recipes/DotNetSet/Sets02.png" width="60%">

The set data structure stores values without any particular order and with no repeated values. Besides being able to add and remove elements to a set, there are a few other important set functions that work with two sets at once.

- Union — This combines all the items from two different sets and returns this as a new set (with no duplicates).
- Intersection — Given two sets, this function returns another set that has all items that are part of both sets.
- Difference — This returns a list of items that are in one set but NOT in a different set.
- Subset — This returns a boolean value that shows if all the elements in one set are included in a different set.


## Maps

A map is a data structure that stores data in key / value pairs where every key is unique. **A map is sometimes called an associative array or dictionary**. It is often used for fast look-ups of data. Maps allow the following things:

<img src="https://cdn-images-1.medium.com/max/1600/1*gu_lK-CJmho9llQAVD01Kw.png" width="60%">

- the addition of a pair to the collection
- the removal of a pair from the collection
- the modification of an existing pair
- the lookup of a value associated with a particular key


## Hash Tables

**A hash table is a map data structure that contains key / value pairs**. It uses a **hash function** to compute an index into an array of buckets or slots, from which the desired value can be found.


<img src="https://cdn-images-1.medium.com/max/1600/1*Ic9dWfQsehh74OidwUZgkA.png" width="60%">


The hash function usually takes a string as input and it outputs an numerical value. The hash function should always give the same output number for the same input. **When two inputs hash to the same numerical output, this is called a collision**. The goal is to have few collisions.

So when you input a key / value pair into a hash table, the key is run through the hash function and turned into a number. This numerical value is then used as the actual key that the value is stored by. When you try to access the same key again, the hashing function will process the key and return the same numerical result. The number will then be used to look up the associated value. This provides very efficient O(1) lookup time on average.


Hash table time complexity

```
╔═══════════╦═════════╦════════════╗
║ Algorithm ║ Average ║ Worst Case ║
╠═══════════╬═════════╬════════════╣
║ Space     ║ O(n)    ║ O(n)       ║
║ Search    ║ O(1)    ║ O(n)       ║
║ Insert    ║ O(1)    ║ O(n)       ║
║ Delete    ║ O(1)    ║ O(n)       ║
╚═══════════╩═════════╩════════════╝
```


## Binary Search Tree


<img src="https://cdn-images-1.medium.com/max/1600/0*x5o1G1UpM1RfLpyx.png" width="60%">

A tree is a data structure composed of nodes. It has the following characteristics:

- Each tree has a root node (at the top).
- The root node has zero or more child nodes.
- Each child node has zero or more child nodes, and so on.


A binary search tree adds these two characteristics:

- Each node has up to two children.
- For each node, its left descendents are less than the current node, which is less than the right descendents.

Binary search trees allow fast lookup, addition and removal of items. The way that they are set up means that, on average, each comparison allows the operations to skip about half of the tree, so that each lookup, insertion or deletion takes time proportional to the logarithm of the number of items stored in the tree.


Binary search time complexity

```
╔═══════════╦══════════╦════════════╗
║ Algorithm ║ Average  ║ Worst Case ║
╠═══════════╬══════════╬════════════╣
║ Space     ║ O(n)     ║ O(n)       ║
║ Search    ║ O(log n) ║ O(n)       ║
║ Insert    ║ O(log n) ║ O(n)       ║
║ Delete    ║ O(log n) ║ O(n)       ║
╚═══════════╩══════════╩════════════╝
```


## Trie

The trie (pronounced 'try'), or **prefix tree**, is a kind of search tree. **A trie stores data in steps where each step is a node in the trie**. Tries are often used to store words for quick lookup, such as a **word auto-complete feature**.

<img src="https://cdn-images-1.medium.com/max/1600/0*lqKJ7WnpvZ4fbUYd.png" width="80%">

**Each node in a language trie contains one letter of a word**. You follow the branches of a trie to spell a word, one letter at a time. The steps begin to branch off when the order of the letters diverge from the other words in the trie, or when a word ends. Each node contains a letter (data) and a boolean that indicates whether the node is the last node in a word.

Look at the image and you can form words. Always start at the root node at the top and work down. The trie shown here contains the word ball, bat, doll, do, dork, dorm, send, sense.



## Binary Heap

A binary heap is another type of tree data structure. Every node has at most two children. Also, it is a complete tree. **This means that all levels are completely filled until the last level and the last level is filled from left to right.**

<img src="https://cdn-images-1.medium.com/max/1600/1*Lu5E1YaakS3JFcCqOsiniw.png" width="80%">


A binary heap can be either a **min heap** or a **max heap**.

- In a max heap, the keys of parent nodes are always greater than or equal to those of the children.
- In a min heap, the keys of parent nodes are less than or equal to those of the children.

The order between levels is important but the order of nodes on the same level is not important. In the image, you can see that the third level of the min heap has values 10, 6, and 12. Those numbers are not in order.

Binary heap time complexity

```
╔═══════════╦══════════╦════════════╗
║ Algorithm ║ Average  ║ Worst Case ║
╠═══════════╬══════════╬════════════╣
║ Space     ║ O(n)     ║ O(n)       ║
║ Search    ║ O(n)     ║ O(n)       ║
║ Insert    ║ O(1)     ║ O(log n)   ║
║ Delete    ║ O(log n) ║ O(log n)   ║
║ Peek      ║ O(1)     ║ O(1)       ║
╚═══════════╩══════════╩════════════╝
```


## Graph

Graphs are collections of nodes (also called vertices) and the connections (called edges) between them. Graphs are also known as networks.

One example of graphs is a social network. The nodes are people and the edges are friendship.

<img src="https://cdn-images-1.medium.com/max/1600/1*fYG3B8hi4O2kk6aHvFB5mg.png" width="80%">

There are two major types of graphs: directed and undirected. Undirected graphs are graphs without any direction on the edges between nodes. Directed graphs, in contrast, are graphs with a direction in its edges.

Two common ways to represent a graph are an adjacency list and an adjacency matrix.

<img src="https://cdn-images-1.medium.com/max/1600/1*01PEzMXTsl9UOnqiGpfnWw.png" width="80%">

An adjacency list can be represented as a list where the left side is the node and the right side lists all the other nodes it’s connected to.

An adjacency matrix is a grid of numbers, where each row or column represents a different node in the graph. At the intersection of a row and a column is a number that indicates the relationship. Zeros mean there is no edge or relationship. Ones mean there is a relationship. Numbers higher than one can be used to show different weights.

Traversal algorithms are algorithms to traverse or visit nodes in a graph. The main types of traversal algorithms are breadth-first search and depth-first search. One of the uses is to determine how close nodes are to a root node.


Adjacency list (graph) time complexity

```
╔═══════════════╦════════════╗
║   Algorithm   ║    Time    ║
╠═══════════════╬════════════╣
║ Storage       ║ O(|V|+|E|) ║
║ Add Vertex    ║ O(1)       ║
║ Add Edge      ║ O(1)       ║
║ Remove Vertex ║ O(|V|+|E|) ║
║ Remove Edge   ║ O(|E|)     ║
║ Query         ║ O(|V|)     ║
╚═══════════════╩════════════╝
```



## References

[1] Beau Carnes [*"10 Common Data Structures Explained with Videos + Exercises"*](https://medium.freecodecamp.org/10-common-data-structures-explained-with-videos-exercises-aaff6c06fb2b)  
