---
layout: post
title: "Bloom Filters"
date: 2018-05-15
excerpt: "Bloom filter is a space-efficient probabilistic data structure, conceived by Burton Howard Bloom in 1970, that is used to test whether an element is a member of a set."
tags: [Hashing, Bloom Filters]
mathjax: true
mathjax_autoNumber: true
---

> *A Bloom filter is a space-efficient probabilistic data structure, conceived by Burton Howard Bloom in 1970, that is used to test whether an element is a member of a set. In this post, I will introduce Bloom Filters in a mathematical way.*


## Overview

If we have a key that is in (resp. not in) the table, we will deﬁnitely know that is in (resp. not in) the table after executing a sequence of chain/probe operations. In the general setting, we have a set of objects $S$ and we are asked if $x \in S$ ? The hashing methods will answer this question without error in case $x \in S$ or if $x \notin S$; but, these can be slow for some applications. For example. a automatic spell-checker has to work as you type – hashing is not an option here.



## Bloom Filters
With Bloom Filters, we are willing to put up with an occasional error if $x \notin S$. That is, if $x \in S$, we will know this for sure; if $x \notin S$, we might make a mistake and say $x \in S$ on occasion. This _*false-positive error*_ issue is something that is tolerable when it comes to spell-checking, password-security, etc. The Bloom Filter is essentially an $n$-dimensional boolean vector that has to be constructed for the set $S$. This done with the help of $k$-many hash functions $ \{ h_1(\bullet), h_2(\bullet), \dots, h_k(\bullet) \}$, where $ \forall i \in \{1, 2, \dots, n \}, h_i : S \rightarrow \{1, 2,  \dots, n \} $, and $ \text{Prob } \{h_i(x) = j \} = \frac{1}{n} \forall i \in \{1, 2, \dots, n \}, \forall x \in S. $


Here is how we build the Bloom Filter (i.e. the n-dimensional boolean vector). We start with a vector of all zeros. For each $x \in S$, $ \forall i \in \{1, 2, \dots, k \}$, we make sure the $h_i(x)^{th}$ bit of the Bloom Filter equal to $1$. Membership in $S$ is tested by the following property:


$$ (x \in S) \Leftrightarrow (h_i(x) = 1, \forall i \in \{ 1, 2, \dots, k \} ). $$

A false negative error, where $x \in S$, but we declare $x \notin S$, cannot occur under this arrangement. However, a false positive error, where $x \notin S$, but we mistakenly declare $x \in S$, can occur. Figure 1 presents an illustrative example.


<img src="https://github.com/Zhenye-Na/Zhenye-Na.github.io/blob/master/assets/images/posts-img/bloomf/bloomf1.png?raw=true" width="50%" class="center">


> **Figure 1**: An illustration of the possibility of a false positive error in the construction of a Bloom Filter. Bits 2, 4, 5 and 8 are set to 1 by the two hash functions for $y_1 \in S$ and $y_2 \in S$. But, for $y_3 \notin S$, the same two hash functions check/assign $y_3$ to bits 4 and 8. Under this construction there will be a false positive error for $y_3$ .


To get at the probability of a false positive error, let us suppose $n$ is the size/dimension of the Bloom Filter, $m = \text{card}(S)$. and $k$ is the number of hash functions used in the construction of the ﬁlter. The design of the Bloom Filter will pick a value for $n$ and $k$ that guarantees the probability of a false positive error is below an acceptable value. We note that for


$$ \begin{align} x \in S, i \in \{ 1, 2, \dots, k \}, j \in \{ 1, 2, \dots, n \}, \text{Prob} \{ h_i(x) \neq j \} &= 1 - \frac{1}{n} \\  \Rightarrow x \in S, j \in \{ 1, 2, \dots, n \}, \text{Prob} \{ \forall i \in \{ 1, 2, \dots, k \}, h_i(x) \neq j \} &= \Big( 1 - \frac{1}{n} \Big)^k \\ \Rightarrow j \in \{ 1, 2, \dots, n \}, \text{Prob} \{ \forall x \in S, \forall i \in \{ 1, 2, \dots, k \}, h_i(x) \neq j \} &= \Big( 1 - \frac{1}{n} \Big)^{km} \\ &= \Big\{ \Big( 1 - \frac{1}{n} \Big)^n \Big\}^{km/n} \\ &\approx e^{-km/n} \\ \Rightarrow j \in \{ 1, 2, \dots, n \}, \text{Prob} \{ j^{th} \text{ bit is set to 1 by some hash function} \} &=                  (1 - e^{-km/n}) \\ \Rightarrow \text{Prob} \{ \text{False Positive Error} \} &= (1 - e^{-km/n})^k. \end{align} $$

If we set $k = \frac{n}{m} \ln 2 \approx \frac{0.7n}{m} $, then


$$ \text{Prob} \{ \text{False Positive Error} \} = (1 - e^{-km/n})^k = (1/2)^k = (1/2)^{0.7n/m} = (0.615)^{n/m}. $$

If $\text{Prob} \{ \text{False Positive Error} = p \}$, then


$$ p = (0.615)^{n/m} \Rightarrow \frac{n}{m} = \frac{\log_2 p}{\log_2 0.615} = 0.7 \log_2 p. $$

if $p \leq \frac{1}{1000}$, then $ \frac{n}{m} \approx 0.7 \log_2 (1/1000) \approx 7 $ and $ k = 0.7 \times 7 \approx 5 $. That is, if we are happy with a $1/1000$ chance of a false positive error, then $k \approx 5$ and $ n/m \approx 7$, which is quite good.



>  *If you notice mistakes and errors in this post, please don't hesitate to leave a comment and I would be super happy to correct them right away!*


## References

[1] Avrim Blum, John Hopcroft, and Ravindran Kannan. *"Foundations of Data Science"*. (2018). 







<style>
.center {
    display: block;
    margin-left: auto;
    margin-right: auto;
}
</style>
