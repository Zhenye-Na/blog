---
layout: post
title: "Matrix Multiplication using random Sampling"
date: 2018-04-20
excerpt: "Algorithms for matrix problems like matrix multiplication, low-rank approximations, singular value decomposition, compressed representations of matrices, linear regression etc."
tags: [Sampling, Algorithm]
mathjax: true
mathjax_autoNumber: true
---

> *Here in this tutorial, we will be looking at matrix algorithms and to achieve errors that are small compared to the Frobenius norm of the matrix rather than compared to the total number of entries, we will perform non-uniform sampling.*

## Overview
In practice, the input sometimes is so large, one would like to produce a much smaller approximation to it, or perform an approximate computation on it in low space. For instance, the input might be stored in a large slow memory and we would like a small "sketch" that can be stored in smaller fast memory and yet retains the important properties of the original input.

In fact, one can view a number of results from the chapter on machine learning in this way: we have a large population, and we want to take a small sample, perform some optimization on the sample, and then argue that the optimum solution on the sample will be approximately optimal over the whole population.


## Matrix Multiplication using Sampling

Suppose $A$ is an $m \times n$ matrix and $B$ is an $n \times p$ matrix and the product $AB$ is desired. We show how to use sampling to get an approximate product faster than the traditional multiplication. Let $A(:, k)$ denote the k th column of $A$. $A(:, k)$ is a $m \times 1$ matrix. Let $B(k, :)$ be the $k^{th}$ row of $B$. $B(k, :)$ is a $1 \times n$ matrix. It is easy to see that:

$$AB = \sum \limits_{k=1}^n A(:,k)B(k,:). $$

Note that for each value of $k$, $A(:, k)$, $B(k, :)$ is an $m \times p$ matrix each element of which is a single product of elements of $A$ and $B$. An obvious use of sampling suggests itself. Sample some values for $k$ and compute $A(:,k)B(k,:)$ for the sampled k‘s and use their suitably scaled sum as the estimate of $AB$. It turns out that nonuniform sampling probabilities are useful. Define a random variable $z$ that takes on values in $\{1, 2, ..., n\}$. Let $p_k$ denote the probability that $z$ assumes the value $k$. We will solve for a good choice of probabilities later, but for now just consider the $p_k$ as nonnegative numbers that sum to one. Define an associated random matrix variable that has value

$$ X = \frac{1}{p_k} A(:,k)B(k,:) $$

with probability $p_k$ . Let $E(X)$ denote the entry-wise expectation.

$$ \begin{align} E(X) &= \sum \limits_{k=1}^n \text{Prob}(z=k) \frac{1}{p_k} A(:,k)B(k,:) \\ &= \sum \limits_{k=1}^n A(:,k)B(k,:) \\ &= AB \end{align} $$

This explains the scaling by $\frac{1}{p_k}$ in $X$. In particular, $X$ is a matrix-valued random variable each of whose components is correct in expectation. We will be interested in

$$ E(\|AB - X \|_F^2)$$

This can be viewed as the variance of $X$, defined as the sum of the variances of all its entries.

$$ \begin{align} \text{Var}(X) &= \sum \limits_{i=1}^m \sum \limits_{j=1}^p \text{Var}(x_{ij}) \\ &= \sum \limits_{ij} E(x_{ij}^2) - E(x_{ij})^2 \\ &= \bigg( \sum \limits_{ij} \sum \limits_{k} p_k \frac{1}{p_k} a_{ik}^2 b_{kj}^2 \bigg) - \| AB \|^2_F. \end{align} $$

We want to choose $p_k$ to minimize this quantity, and notice that we can ignore the $\| AB \|^2_F$ term since it doesn’t depend on the $p_k$'s at all. We can now simplify by exchanging the order of summations to get

$$ \begin{align} \sum \limits_{ij} \sum \limits_{k} p_k \frac{1}{p_k^2} a_{ik}^2 b_{kj}^2 &= \sum \limits_k \frac{1}{p_k} \bigg( \sum \limits_k a_{ik}^2 \bigg) \bigg( \sum \limits_k b_{kj}^2 \bigg) \\&= \sum \limits_k \frac{1}{p_k} |A(:,k)|^2 |B(k,:)|^2. \end{align} $$

What is the best choice of $p_k$ to minimize this sum? It can be seen by calculus[^1] that the minimizing $p_k$ are proportional to $ \vert A(:,k) \vert \vert B(k,:) \vert $. In the special case when $ B = A^\intercal $, pick columns of $A$ with probabilities proportional to the squared length of the columns. Even in the general case when $B$ is not $ A^\intercal $ , doing so simplifies the bounds. 

This sampling is called length squared sampling. If $p_k$ is proportional to $ \vert A(:,k) \vert ^2 $, i.e, $p_k = \frac{ \vert A(:,k) \vert ^2}{ \| A \|_F^2}$, then


$$ E(\|AB - X \|_F^2) = \text{Var}(X) \leq \| A \|_F^2 \sum \limits_k \vert B(k,:) \vert ^2 = \|A\|_F^2 \|B\|_F^2. $$

To reduce the variance, we can do $s$ independent trials. Each trial $i$, which $i = 1, 2, . . . , s$ yields a matrix $X_i$. We take $\frac{1}{s} \sum \limits_{i=1}^s X_i $ as our estimate of $AB$. Since the variance of a sum of independent random variables is the sum of variances, the variance of $\frac{1}{s} \sum \limits_{i=1}^s X_i $ is $\frac{1}{s} \text{Var}(X)$ and so is at most $\frac{1}{s} \|A\|_F^2 \|B\|_F^2. $ Let $k_1 , . . . , k_s $ be the $k$'s chosen in each trial. Expanding this, gives:

$$ \frac{1}{s} \sum \limits_{i=1}^s X_i  = \frac{1}{s} \bigg( \frac{A (:, k_1) B (k_1 , :)}{p_{k1}} + \frac{A (:, k_2) B (k_2 , :)}{p_{k2}}  \dots \frac{A (:, k_s) B (k_s, :)}{p_{ks}} \bigg). $$

We will find it convieneint to write this as the product of an $m \times s$ matrix with a $s \times p$ matrix as follows: Let $C$ be the $m \times s$ matrix consisting of the following columns which are scaled versions of the chosen columns of $A$:

$$ \frac{A(:, k_1)}{\sqrt{sp_{k1}}}, \frac{A(:, k_2)}{\sqrt{sp_{k2}}}, \dots, \frac{A(:, k_s)}{\sqrt{sp_{ks}}}. $$

Note that the scaling has a nice property:

$$ E(CC^\intercal) = AA^\intercal. $$

Define $R$ to be the $s \times p$ matrix with the corresponding rows of $B$ similarly scaled, namely, $R$ has rows

$$ \frac{B(k_1,:)}{\sqrt{sp_{k1}}}, \frac{B(k_2,:)}{\sqrt{sp_{k2}}}, \dots, \frac{B(k_s,:)}{\sqrt{sp_{ks}}}. $$

It is obvious to prove that:

$$ E(R^\intercal R) = B^\intercal B. $$

We see that $$\frac{1}{s} \sum \limits_{i=1}^s X_i  = CR. $$ This is represented in the figure below:

<img src="https://github.com/Zhenye-Na/Zhenye-Na.github.io/blob/master/assets/images/posts-img/matrixmul/sampling1.png?raw=true" width="85%">


## Algorithm

### Vanilla three-look matrix multiplication algorithm

Given an arbitrary $m \times n$ matrix $A$ and an arbitrary $n \times p$ matrix $B$, compute, exactly or approximately, the product $AB$. As a starting point, the well-known three-loop algorithm to solve this problem is the following:

<img src="https://github.com/Zhenye-Na/Zhenye-Na.github.io/blob/master/assets/images/posts-img/matrixmul/sampling2.png?raw=true">


The running time of this algorithm is $O(mnp)$ time, which is $O(n^3)$ time if $m = n = p$. Note in particular that this algorithm loops over all pairs of elements in the product matrix and computes that element as a dot product or inner product between the $i^{th}$ row of $A$ and the $j^{th}$ column of $B$.

### BasicMatrixMultiplication algorithm

Viewing matrix multiplication as the sum of outer products *suggests*, by analogy with the sum of numbers, that we should sample rank-1 components, to minimize their size, according to their size. Recall that, if we were summing numbers, that we could sample (and rescale — see below) according to any probability distribution, and in particular the uniform distribution, and obtain an unbiased estimator of the sum; but that if we want to minimize the variance of the estimator that we should sample (and rescale) according to the size or magnitude of the numbers. Well, the same is true in the case of matrices. Since the role of these probabilities will be important in what follows, we will leave then unspecified as input to this algorithm, and we will return below to what probabilities should or could be used in this algorithm.

![](https://github.com/Zhenye-Na/Zhenye-Na.github.io/blob/master/assets/images/posts-img/matrixmul/sampling3.png?raw=true)

Basically, what we want to show for this algorithm is that

$$ AB = CR $$



> *If you notice mistakes and errors in this post, please don't hesitate to leave a comment and I would be super happy to correct them right away!*



## References

[1] Michael Mahoney. [*"Stat260/CS294: Randomized Algorithms for Matrices and Data, Lecture 2: Approximating Matrix Multiplication"*](https://www.stat.berkeley.edu/~mmahoney/f13-stat260-cs294/Lectures/lecture02.pdf). (2013).  
[2] Avrim Blum, John Hopcroft, and Ravindran Kannan. *"Foundations of Data Science"*. (2018).


[^1]: By taking derivatives, for any set of nonnegative numbers $c_k$, $\sum_k \frac{c_k}{p_k}$ is minimized with $p_k$ proportional to $\sqrt{c_k}$.
