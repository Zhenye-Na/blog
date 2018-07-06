---
layout: post
title: "Introduction to Crypto and Cryptocurrencies"
date: 2018-07-05
excerpt: "Week 1: Bitcoin and Cryptocurrency Technologies, Princeton University"
tags: [Bitcoin and Cryptocurrency]
---

> In this series of tutorials, I will talk a little bit more about Crypto and Cryptocurrencies based on the course from Priceton University. Let's get statrted.

This post is looooong reading!
{:.warning}


# Introduction to Crypto and Cryptocurrencies

<figure>
    <img src="https://cdn-images-1.medium.com/max/800/0*W3LI86Xp8u_JEGfc.jpg" class="center">
    <figcaption class="center">Image Source: <a href="http://www.thelowdownblog.com/2018/05/why-blockchain-is-hard.html" target="_blank"><em>Why Blockchain Is Hard</em></a></figcaption>
</figure>


## Cryptographic Hash Functions

### Hash function:

- takes any string as input
- fixed-size output (we'll use 256 bits because it is the size of bitcoin)
- efficiently computable

### Security properties:

- collision-free
- hiding
- puzzle-friendly


#### property 1: Collision-free

Nobody can find `x` and `y` such that `x != y` and `H(x) = H(y)`

> Aside: here we use word `find`. Because collisions do exist, but nobody can find easily.

**Application: Hash as message digest**

If we know `H(x) = H(y)`, it’s safe to assume that `x = y`. To recognize a file that we saw before, just remember its hash.

Useful because the hash is small.


#### property 2: Hiding
Given `H(x)`, it is infeasible to find `x`.

**Hiding property**:

If `r` is chosen from a probability distribution that has *high min-entropy*, then given `H(r|x)`, it is infeasible to find `x`.

> *High min-entropy* means that the distribution is "very spread out", so that no particular value is chosen with more than negligible probability.

**Application: Commitment**

Want to "seal a value in an envelope", and "open the envelope" later.
Commit to a value, reveal it later.


##### Commitment API

- `(com, key) := commit(msg)`
- `match := verify(com, key, msg)`

To **seal** msg in envelope:  
`(com, key) := commit(msg)` -- then publish `com`

To **open** envelope:  
publish key, msg anyone can use verify() to check validity


#### property 3: Puzzle-friendly

For every possible output value `y`, if `k` is chosen from a distribution with *high min-entropy*, then it is infeasible to find `x` such that `H(k|x) = y`.


**Application: Search puzzle**

Given a "puzzle ID" id (from high min-entropy distrib.), and a target set Y:

Try to find a "solution" `x` such that $\text{H(id | x)} \in \text{Y}$.

- `Y`: target range or set of hash results
- `id`: particular puzzle from high min-entropy distrib.
- `x`: solution to the puzzle

Property 3 implies that no solving strategy is much better than trying random values of x.


<figure>
    <img src="https://i.stack.imgur.com/29Ts2.png" class="center">
    <figcaption class="center">Figure 1: SHA-256 hash function. (Image Source: <a href="https://bitcoin.stackexchange.com/questions/41411/mining-for-nil-transaction-blocks-only-gaming-the-incentive-scheme-by-rogue-mi/41412" target="_blank"><em>Bitcoin StackExchange</em></a>)</figcaption>
</figure>


## Hash Pointers and Data Structures

### Hash Pointers

<figure>
    <img src="https://qph.fs.quoracdn.net/main-qimg-152139fabba52dee181adc79d581d143.webp
" class="center">
    <figcaption class="center">Figure 2: Hash Pointers. (Image Source: <a href="https://www.quora.com/What-is-the-coolest-data-structure-What-makes-it-so-cool" target="_blank"><em>What is the coolest data structure? What makes it so cool?</em></a>)</figcaption>
</figure>

hash pointer is:

* pointer to where some info is stored, and
* (cryptographic) hash of the info


### Linked List implementation of Block Chain


<figure>
    <img src="https://qph.fs.quoracdn.net/main-qimg-75c5b83ba56f0deff282a64b60f1962a
" class="center">
    <figcaption class="center">Figure 3: Block Chain - Linked List. (Image Source: <a href="https://www.quora.com/What-is-the-coolest-data-structure-What-makes-it-so-cool" target="_blank"><em>What is the coolest data structure? What makes it so cool?</em></a>)</figcaption>
</figure>

The magic of a block chain is that it offers **tamper-detection**. If someone tries to change some data in one of the nodes, then the hash value changes too and is no longer consistent with the hash_value reported in the hash pointer.

The best known application of block chain is Bitcoin, a cryptocurrency in which new transactions are collected into blocks every ten minutes. Because block chain offers tamper-detection, an end user who stores just the most recent hash pointer (the top right most H( ) in the diagram above), can verify the entire history of transactions ever made in Bitcoin!



### Merkle Tree implementation of Block Chain

<figure>
    <img src="https://qph.fs.quoracdn.net/main-qimg-98b377aaaf58095fa8434c16b74c1d90.webp" class="center">
    <figcaption class="center">Figure 4: Block Chain - Merkle Tree. (Image Source: <a href="https://www.quora.com/What-is-the-coolest-data-structure-What-makes-it-so-cool" target="_blank"><em>What is the coolest data structure? What makes it so cool?</em></a>)</figcaption>
</figure>

Like the block chain, the Merkle Tree is tamper resistant because of its reliance on hash pointers. An end user only needs to store the final hash pointer at the root.

What is cool about the Merkle tree is that it allows for efficient proof of membership. If someone tells you that a particular data block exists in some leaf of a Merkle Tree with $n$ nodes, you can just ask them to show the $\log n$ nodes from the root to the leaf. If the hash pointers are valid, meaning that each hash pointer stores the correct hash of the data it points to, then membership in the tree is proven! Contrast this to the block chain, where proving membership of the thousandth block from now would require providing every block between now and a thousand blocks ago.

The Merkle tree has numerous applications including git revision control, Bitcoin block storage, and many more which are worth a full answer in themselves!


## Digital Signatures

**Signatures**

- Only you can sign, but anyone can verify
- Signature is tied to a particular document (can't be cut-and-pasted to another doc)


- "valid signatures verify"
    - verify(pk, message, sign(sk, message)) == true
- "can't forge signatures"
    - adversary who:
    - knows pk gets to see signatures on messages of his choice can't produce a verifiable signature on another message


### API for digital signatures

- `(sk, pk) := generateKeys(keysize)`
    - `sk`: secret signing key, which you use for makin gyour signaures
    - `pk`: public verification key, which is given to anyone , can be used to verify your signature when others see it
- `sig := sign(sk, message)`
    - message: where you put your signatures on
- `isValid := verify(pk, message, sig)`
    - return value `isValid` is boolean

The first two can be randomized algorithms


## Public Keys as Identities

### Useful trick: public key == an identity

if you see `sig` such that `verify(pk, msg, sig)==true`, think of it as `pk` says, "[msg]".

to "speak for" pk, you must know matching secret key `sk`


### How to make a new identity

create a new, random key-pair (sk, pk)

- `pk` is the public "name" you can use 
    - usually better to use `Hash(pk)`
- `sk` lets you "speak for" the identity

you control the identity, because only you know sk if `pk` "looks random", nobody needs to know who you are


### Decentralized identity management

- Anybody can make a new identity at any time
    - make as many as you want!
- no central point of coordination
- These **identities** are called "**addresses**" in Bitcoin.


## References
  
[1] Arvind Narayanan, Joseph Bonneau, Edward Felten, Andrew Miller, Steven Goldfeder [*"Bitcoin and Cryptocurrency Technologies"*](https://github.com/Zhenye-Na/Bitcoin-and-Cryptocurrency-Technologies/blob/master/textbooks/princeton_bitcoin_book.pdf)  
[2] Andreas M. Antonopoulos [*"Mastering Bitcoin Programming the Open Blockchain"*](https://github.com/Zhenye-Na/Bitcoin-and-Cryptocurrency-Technologies/blob/master/textbooks/Mastering%20Bitcoin%20Programming%20the%20Open%20Blockchain.pdf)  
[3] Pranav Gokhale's answer in Quora. [What is the coolest data structure? What makes it so cool?](https://www.quora.com/What-is-the-coolest-data-structure-What-makes-it-so-cool)


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