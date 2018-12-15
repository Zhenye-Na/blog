---
layout: post
title: "Collision Handling Strategy"
date: 2018-12-15
modify_date: 2018-12-15
excerpt: "Collision Handling Strategy in Hashing functions"
tags: [Algorithms, Data Structures]
mermaid: true
mathjax: true
mathjax_autoNumber: true
---

# Collision Handling Strategy

**Hash Function** is a function that converts a given big phone number to a small practical integer value. The mapped integer value is used as an index in hash table. In a nutshell, a hash function maps a big number or string to a small integer that can be used as index in hash table.

Since a hash function gets us a small number for a big key, there is possibility that two keys result in same value. The situation where a newly inserted key maps to an already occupied slot in hash table is called **collision** and must be handled using some collision handling technique. 


## Seperate Chaining

**Separate chaining** is defined as a method by which *linked lists* of values are built in association with each location within the hash table when a collision occurs. This idea is to make each cell of hash table point to a linked list of records that have same hash function value. **Chain the elements in a Linked List**.

Let us consider a simple hash function as "**key % 7**" and sequence of keys as

- `S = {50, 700, 76, 85, 92, 73, 101}`.
- `|S| = n`.
- `h(k) = k % 7`.
- `|Array| = N`.

<figure>
  <img src="https://www.geeksforgeeks.org/wp-content/uploads/gq/2015/07/hashChaining1.png" width="80%" class="center">
  <figurecaption>Figure 1. Insertion in Seperate Chaining. (Image source: GeeksforGeeks, Hashing Set 2 (Separate Chaining))</figurecaption>
</figure>

Notice that when we compute $85 % 7$, it happened that the "slot" is taken up by $50$. One solution to this is that instead of storing element in array, we can store a linked list in the array and store element in the linked list.


|             	| Worst Case 	|   SUHA   	|
|:-----------:	|:----------:	|:--------:	|
|    Insert   	|   $O(1)$   	|  $O(1)$  	|
| Remove/Find 	|   $O(n)$   	| $O(n/N)$ 	|


There is a metric called **Load Factor**

$$
\alpha = \frac{n}{N}
$$.

where $n$ stands for the number of elements in the dataset, $N$
 stands for the number of elements in the array.

We can tune the parameter $N$, to increase $N$, running time of finding/removing will be decreased.



**Advantages**

1. Simple to implement.
1. Hash table never fills up, we can always add more elements to chain.
1. Less sensitive to the hash function or load factors.
1. It is mostly used when it is unknown how many and how frequently keys may be inserted or deleted.

**Disadvantages**

1. Cache performance of chaining is not good as keys are stored using linked list.
1. Wastage of Space (Some Parts of hash table are never used)
1. If the chain becomes long, then **search time can become** $O(n)$ in worst case.
1. Uses extra space for links.


<iframe width="585" height="374" src="https://www.youtube.com/embed/_xA8UvfOGgU" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>


## Open Addressing

Open Addressing (which is also called Probe-based Hashing), is another method for handling collisions. In Open Addressing, all elements are stored in the hash table itself. So at any point, size of the table must be greater than or equal to the total number of keys.

> When a new key collides, find next empty slot, and put it there.


- `Insert(k)`: Keep probing until an empty slot is found. Once an empty slot is found, insert k.
- `Search(k)`: Keep probing until slot's key doesn't become equal to k or an empty slot is reached.
- `Delete(k)`: If we simply delete a key, then search may fail. So slots of deleted keys are marked specially as "deleted".
- Insert can insert an item in a deleted slot, but the search doesn't stop at a deleted slot.


<iframe width="585" height="374" src="https://www.youtube.com/embed/Dk57JonwKNk" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>


### Linear Probing

In linear probing, we linearly probe for next slot. For example, typical gap between two probes is $1$ as taken in below example also.

Let `hash(x)` be the slot index computed using hash function and `S` be the table size


```
If slot hash(x) % S is full, then we try (hash(x) + 1) % S
If (hash(x) + 1) % S is also full, then we try (hash(x) + 2) % S
If (hash(x) + 2) % S is also full, then we try (hash(x) + 3) % S 
..................................................
..................................................
```

**Clustering**: The main problem with linear probing is clustering, many consecutive elements form groups and it starts taking time to find a free slot or to search an element.


### Quadratic Probing

We look for $i^2$ th slot in $i$ th iteration.

```
let hash(x) be the slot index computed using hash function.  
If slot hash(x) % S is full, then we try (hash(x) + 1*1) % S
If (hash(x) + 1*1) % S is also full, then we try (hash(x) + 2*2) % S
If (hash(x) + 2*2) % S is also full, then we try (hash(x) + 3*3) % S
..................................................
..................................................
```



### Double Hashing

We use another hash function hash2(x) and look for i*hash2(x) slot in i’th rotation.

```
let hash(x) be the slot index computed using hash function.  
If slot hash(x) % S is full, then we try (hash(x) + 1*hash2(x)) % S
If (hash(x) + 1*hash2(x)) % S is also full, then we try (hash(x) + 2*hash2(x)) % S
If (hash(x) + 2*hash2(x)) % S is also full, then we try (hash(x) + 3*hash2(x)) % S
..................................................
..................................................
```

## Summary

### Comparison

|  	| Seperate Chaining 	| Open Addressing 	|
|:--:	|:-------------------------------------------------------------------------------------------------------:	|:--------------------------------------------------------------------------------------------:	|
| 1. 	| Chaining is Simpler to implement. 	| Open Addressing requires more computation. 	|
| 2. 	| In chaining, Hash table never fills up, we can always add more elements to chain. 	| In open addressing, table may become full. 	|
| 3. 	| Chaining is Less sensitive to the hash function or load factors. 	| Open addressing requires extra care for to avoid clustering and load factor. 	|
| 4. 	| Chaining is mostly used when it is unknown how many and how frequently keys may be inserted or deleted. 	| Open addressing is used when the frequency and number of keys is known. 	|
| 5. 	| Cache performance of chaining is not good as keys are stored using linked list. 	| Open addressing provides better cache performance as everything is stored in the same table. 	|
| 6. 	| Wastage of Space (Some Parts of hash table in chaining are never used). 	| In Open addressing, a slot can be used even if an input doesn’t map to it. 	|
| 7. 	| Chaining uses extra space for links. 	| No links in Open addressing 	|


### Running Time Analysis

**Separate Chaining**: Linear Probing leads to Primary Clustering

- Successful (Search hit): $1 + \frac{\alpha}{2}$
- Unsuccessful (Search miss / insert): $1 + \alpha$

**Linear Probing**: Under uniform hashing assumption, the average # of probes in a linear probing hash table of size $M$ that contains $N = \alpha M$ key is:

- Successful (Search hit): $\sim \frac{1}{2} (1 + \frac{1}{1 - \alpha})$
- Unsuccessful (Search miss / insert): $\sim \frac{1}{2} (1 + \frac{1}{1 - \alpha})^2$


**Double Hashing**:

- Successful (Search hit): $\frac{1}{\alpha} \times \ln (\frac{1}{1 - \alpha})$
- Unsuccessful (Search miss / insert): $\frac{1}{1 - \alpha}$


### Choice of parameters

- $M$ too large $\Rightarrow$ too many empty table entries
- $M$ too small $\Rightarrow$ search time blows up
- Typical choice: $\alpha = N/M \sim \frac{1}{2}$




### Summarization

<figure>
  <img src="https://cdn-images-1.medium.com/max/2000/1*WVpgpdQFy6fguB960xeahQ.png" width="80%" class="center">
</figure>



## References

[1] Lyna Griffin, [Separate Chaining: Concept, Advantages & Disadvantages](https://study.com/academy/lesson/separate-chaining-concept-advantages-disadvantages.html)  
[2] GeeksforGeeks, [Hashing Set 2 (Separate Chaining)](https://www.geeksforgeeks.org/hashing-set-2-separate-chaining/)  
[3] GeeksforGeeks, [Hashing Set 3 (Open Addressing)](https://www.geeksforgeeks.org/hashing-set-3-open-addressing/)



<style>
.center {
    display: block;
    margin-left: auto;
    margin-right: auto;
}
</style>
