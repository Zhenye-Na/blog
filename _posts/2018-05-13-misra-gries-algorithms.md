---
layout: post
title: "Misra-Gries Family of Algorithms"
date: 2018-05-13
excerpt: "Misra-Gries Family of Algorithms deals with massive data problems where the input data is too large to be stored in random access memory - one solution to the MAJORITY and FREQUENT Problem"
tags: [MCMC]
comments: true
---

> *Misra-Gries Family of Algorithms deals with massive data problems where the input data is too large to be stored in random access memory. In this post, I will introduce Misra-Gries Family of Algorithms and Approximate solution to a variation of the FREQUENT problem.*


# Overview

We have a stream $ \langle a_1, a_2, \dots, a_n \rangle $ where each $ a_i \in \{ 1, 2, \dots, m \} $. We have the associated frequency vector $ (f_1, f_2, \dots, f_m) $, where $ \sum_{i=1}^n f_i = n $. For the **MAJORITY** problem, we need to to find a $j$ such that $f_j > n/2 $, if it exits. If there is no such $j$ then we can output anything. For the **FREQUENT** problem, we have to output a set $ \{j \vert f_j > n/k \} $, if it exists (otherwise, it is OK to output some junk).


## Misra-Gries Family of Algorithms

### MAJORITY problem

Let us look at the **MAJORITY** problem first. We have two variables that we store. The first-variable is the key (which is either a member of $ \{1, 2, \dots , m \} $ or a null-entity). The second-variable is an integer (which is a count). We start with an empty key, and a count of zero.


Every time an element $a_i = j$ of the data-stream is observed, if the key is empty we set the value of the key to $j$, and we initialize the count to $1$. If the key is not empty, and equal to $j$, we increment the count by $1$. If the key is not empty, and not equal to $j$, we decrement the count by $1$ – if the count becomes zero as a result of this decrementing, we set the key to null-entity. It is not hard to see that if there is a majority-element, it will be the value of the key.



### FREQUENT problem

For the **FREQUENT** problem, we have $k − 1$ keys, with associated counts. The keys are initialized to null-entities, their counts being zero. Every time an element of $a_i = j$ of the data-stream is observed, and if $j$ is one of the keys, we increment is counter by $1$. If $j$ is not one of the keys, and there is an null-entity key, we set it equal to $j$ with a count of $1$. If $j$ is not one of the keys, and there is no null-entity keys, we decrement the count of all counters. If any counter is zero as a result of this decrementing, we set its key to be a null-entity.



## Approximate solution to a variation of the FREQUENT problem

We have a stream $ \langle a_1, a_2, \dots, a_n \rangle $ where each $ a_i \in \{ 1, 2, \dots, m \} $. We have the associated frequency vector $ (f_1, f_2, \dots, f_m) $, where $ \sum_{i=1}^n f_i = n $. In this version of the problem, we wish to maintain an approximation $ (\hat{f_1}, \hat{f_2}, \dots , \hat{f_m}) $ to the frequency vector $ (f_1, f_2, \dots, f_m) $, such that $ \forall j \vert f_j - \hat{f_j} \vert < \epsilon n $ for a desired $ \epsilon > 0 $.


For this, we keep l-many keys (with their associated counters), where $l \ll n$. By design, we have at least one empty key (and zeroed counter) at any instant.


Like before (with **FREQUENT** problem), if the observed stream-element is one of the keys, we increment its associated counter. If it is not in one of the key, then


1. We add it to the list of keys (note: there is always one empty key, by design).


2. To ensure there is at least one empty key, we take the median value of the counters (let us call it $\delta_t$ at the $t$-step of the algorithm), and subtract the median-value from all counters. We delete/empty all keys with a counter value that is less-than-or-equal-to zero.


At any point in this algorithm $\hat{f_j}$ is the value of the counter associated with $j$ (if it exists).


It follows that $\hat{f_j} \leq f_j$ (because we might have deleted/emptied the key associated with $j$ at some point in the algorithm). It also follows that $ \hat{f_j} \geq f_j - \sum_t \delta_t $, which in turn implies $ \sum_t \delta_t \geq f_j - \hat{f_j} $. we also have,


$$ 0 \leq \sum \limits_j \big( 1 - \frac{l}{2} \delta_t \big) = n - \frac{l}{2} \sum \limits_t \delta_t \Rightarrow \sum \limits_t \delta_t \leq \frac{2n}{l} $$

if $l = \frac{2}{\epsilon}$, then $ \forall j, \epsilon n \geq t \sum \limits_t \delta_t ≥ f_j − \hat{f_j} $, which accomplishes what we need. This idea has been used by several researchers to form what are called sketches of larger data streams or larger objects. You may want to look at how this concept has been used in the paper on "[Simple and Deterministic Matrix Sketches](https://arxiv.org/pdf/1206.0594.pdf)" by Edo Liberty.


>  *If you notice mistakes and errors in this post, please don't hesitate to leave a comment and I would be super happy to correct them right away!*


## References

[1] Avrim Blum, John Hopcroft, and Ravindran Kannan. *"Foundations of Data Science"*. (2018).
