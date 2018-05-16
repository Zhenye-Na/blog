---
layout: post
title: "Hashing with Chaining"
date: 2018-04-17
excerpt: "A hash function is any function that can be used to map data of arbitrary size to data of fixed size. The values returned by a hash function are called hash values, hash codes, digests, or simply hashes. One use is a data structure called a hash table, widely used in computer software for rapid data lookup."
tags: [Hashing]
comments: true
---



In the hashing methods described earlier, if we have a key that is in (resp. not in) the table, we will deﬁnitely know that is in (resp. not in) the table after executing a sequence of chain/probe operations. In the general setting, we have a set of objects S and we are asked if x ∈ S?. The hashing methods will answer this question without error in case x ∈ S or if x ∈/ S; but, these can be slow for some applications. For example. a automatic spell-checker has to work as you type – hashing is not an option here.

With Bloom Filters, we are willing to put up with an occasional error if x ∈/ S. That is, if x ∈ S, we will know this for sure; if x ∈/ S, we might make a mistake and say x ∈ S on occasion. This false-positive error issue is something that is tolerable when it comes to spell-checking, password-security, etc. The Bloom Filter is essentially an n-dimensional boolean vector that has to be constructed for the set S. This done with the help of k-many hash functions