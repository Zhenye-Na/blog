---
layout: article
title: "Support Vector Machines Explained"
date: 2019-04-18
modify_date: 2019-04-18
excerpt: "Under the hood - Support Vector Machines (SVM)"
tags: [Machine Learning, Supervised Learning, Support Vector Machines]
pageview: true
mathjax: true
mathjax_autoNumber: true
---

# Support Vector Machines Explained

A Support Vector Machine (SVM) is a very powerful and versatile Machine Learning model, capable of performing linear or nonlinear classification, regression, and even outlier detection. It is one of the most popular models in Machine Learning, and anyone interested in Machine Learning should have it in their toolbox. SVMs are particularly well suited for classification of complex but small- or medium-sized datasets. In this tutorial, I will explain the core concepts of SVMs, how to use them, and how they work.



- [Functional and geometric margins]()
  - [Functional margin]()
  - [Geometric margin]()
- [haha]()





## Functional and geometric margins

### Functional margin

Consider training example $(x^{(i)}, y^{(i)})$, the functional margin of $(w, b)$ w.r.t. the training example

$$
\hat{\gamma}^{(i)} = y^{(i)} (w^T x + b).
$$

a large functional margin represents a confident and a correct prediction.


Given training set $S = \{ (x^{(i)}, y^{(i)}); i = 1,\dots, m \}$, we also define the functional margin of $(w, b)$ w.r.t. $S$ to be smallest of the functional margins $\hat{\gamma}$ of the individual training examples.

$$
\hat{\gamma} = \min \limits_{i=1, \dots, m} \hat{\gamma}^{(i)}.
$$


### Geometric margin

$$
\gamma^{(i)} = y^{(i)} \Large( \large( \frac{w}{\|w\|} \large)^T x^{(i)} + \frac{b}{\|w\|} \Large).
$$


Given training set $S = \{ (x^{(i)}, y^{(i)}); i = 1,\dots, m \}$, we also define the geometric margin of $(w, b)$ w.r.t. $S$ to be smallest of the geometric margins $\gamma$ of the individual training examples.

$$
\gamma = \min \limits_{i=1, \dots, m} \gamma^{(i)}.
$$



## Prerequisites

### Linearly separable

The first assumption we make so far is that the dataset we have can be **linearly seprable**.

<div align="center">
  <img src="https://cdn-images-1.medium.com/max/1600/1*JVZ4FXVRlr1oN-4ffq_kNQ.png" width="70%">
  <p>Non-linearly separable and linearly separable. <a href="https://medium.com/@vivek.yadav/how-neural-networks-learn-nonlinear-functions-and-classify-linearly-non-separable-data-22328e7e5be1">Image resource: Vivek Yadav's Medium blog</a></p>
</div><br>

The image on the RHS is a case of linearly separable, which is possible to separate the two classes examples by using some separating hyperplane. In this case, Kernel function has been used to project low dimensional data to high dimension. Low dimensional data is not lineary separable, however, it may be linearly separable in a higher dimension.



### Lagrange duality



#### Lagrangian 

Optimization problems may be viewed from either of two perspectives, the **primal problem** or the **dual problem**.

Consider a optimzation problem as follows:

<div align="center">
  <img src="https://github.com/Zhenye-Na/Zhenye-Na.github.io/blob/master/assets/images/posts-img/intro2svm/optimization-problem.gif?raw=true" width="35%">
</div><br>


Then we define the **Lagrangian** of the preceding problem as:

<div align="center">
  <img src="https://github.com/Zhenye-Na/Zhenye-Na.github.io/blob/master/assets/images/posts-img/intro2svm/lagrangian.png?raw=true" width="35%">
</div><br>


The $\beta_i$'s are called **Lagrange multipliers**. The next step is to take the derivatie of $\mathcal{L}$ w.r.t $w$ and $\beta$ and set to zero to solve for $w$ and $\beta$.



#### Generalized Lagrangian

As we said before, optimization can be viewed as **primal** problem as well as **dual** problem. Let us define the **primal** optimization problem:

<div align="center">
  <img src="https://github.com/Zhenye-Na/Zhenye-Na.github.io/blob/master/assets/images/posts-img/intro2svm/primal-problem.png?raw=true" width="40%">
</div><br>

The **generalized Lagrangian** is defined as follows:


$$
\mathcal{L}(w, \alpha, \beta) = f(w) + \sum \limits_{i=1}^{k} \alpha_i g_i(w) + \sum \limits_{i=1}^{l} \beta_i h_i(w)
$$


Here, the $\alpha_i$'s and $\beta_i$ 's are the Lagrange multipliers.

We use $\mathcal{P}$ to stand for "primal". If $w$ violates any of the constraints, then we could derive that

<div align="center">
  <img src="https://github.com/Zhenye-Na/Zhenye-Na.github.io/blob/master/assets/images/posts-img/intro2svm/theta-primal.png?raw=true" width="45%">
</div><br>


$$
\begin{aligned} \theta_{\mathcal{P}}(w) &=\max _{\alpha, \beta : \alpha_{i} \geq 0} f(w)+\sum_{i=1}^{k} \alpha_{i} g_{i}(w)+\sum_{i=1}^{l} \beta_{i} h_{i}(w) \\ &=\infty \end{aligned}
$$


The $\theta_{\mathcal{P}}$ takes the same value as the objective if $w$ satisfies our primal constraints.


$$
\min_{w} \theta_{\mathcal{P}}(w) = \min_w \max \limits_{\alpha, \beta: \alpha_i \geq 0} \mathcal{L}(w, \alpha, \beta).
$$


We use $p^*$ to stand for the **value** of the primal problem, which means that $p^* = \min_{w} \theta_{\mathcal{P}}(w)$.


Like we defined $\mathcal{P}$ subscript as primal problem before, we use $\mathcal{D}$ subscript standing for "dual" problem.


$$
\max \limits_{\alpha, \beta: \alpha_i \geq 0} \theta_{\mathcal{D}}(\alpha, \beta) = \max \limits_{\alpha, \beta: \alpha_i \geq 0} \min_w \mathcal{L}(w, \alpha, \beta)
$$


The dual problem and primal problem are related as follows


$$ d^* = \max \limits_{\alpha, \beta: \alpha_i \geq 0} \min_w \mathcal{L}(w, \alpha, \beta) \leq \min_w \max \limits_{\alpha, \beta: \alpha_i \geq 0} \mathcal{L}(w, \alpha, \beta) = p^*. $$


> In general, you can think $\max \min \leq \min \max$ is always true.

Under certain conditions, we can get:

$$d^* = p^*.$$


So that we can solver the dual problem in lieu of the primal problem under some conditions.


#### KKT conditions

Suppose:

- $f$ and the $g_i$'s are convex
- $h_i$'s are affine
- further assumption: $g_i$ are (strictly) feasible

this means that there exists some $w$ so that $g_i(w) < 0$ for all $i$. Under our above assumptions, there must exist $w^*$ , $\alpha^*$ , $\beta^*$ so that $w^*$ is the solution to the primal problem, $\alpha^*$ , $\beta^*$ are the solution to the dual problem, and moreover $p^* = d^* = \mathcal{L}(w^*, \alpha^*, \beta^*)$. Moreover, $w^*$ , $\alpha^*$ , $\beta^*$ satisfy the Karush-Kuhn-Tucker (KKT) conditions, which are as follows:


$$
\begin{aligned} \frac{\partial}{\partial w_{i}} \mathcal{L}\left(w^{*}, \alpha^{*}, \beta^{*}\right) &=0, \quad i=1, \ldots, n \\ \frac{\partial}{\partial \beta_{i}} \mathcal{L}\left(w^{*}, \alpha^{*}, \beta^{*}\right) &=0, \quad i=1, \ldots, l \\ \alpha_{i}^{*} g_{i}\left(w^{*}\right) &=0, \quad i=1, \ldots, k \\ g_{i}\left(w^{*}\right) & \leq 0, \quad i=1, \ldots, k \\ \alpha^{*} & \geq 0, \quad i=1, \ldots, k \end{aligned}
$$


If some $w^*$ , $\alpha^*$ , $\beta^*$ satisfy KKT conditions, then it is also a solution to the primal and dual problems.



#### KKT dual complementarity condition

The third equation is called KKT dual complementarity condition which is very useful when:

- SVM has only a small number of "support vectors".
- give convergence test when we talk about the SMO algorithm.



## The optimal margin classifier

We assume the training set is linearly separable and we would like to find the maximum margin classifier. We pose the following optimization problem:


<div align="center">
  <img src="https://github.com/Zhenye-Na/Zhenye-Na.github.io/blob/master/assets/images/posts-img/intro2svm/original1.png?raw=true" width="40%">
</div><br>


$\| w \| = 1$ ensures that the **functional margin equals to geometric margin**, but this constraint is "non-convex". So we transformed this optimization problem as follows:

<div align="center">
  <img src="https://github.com/Zhenye-Na/Zhenye-Na.github.io/blob/master/assets/images/posts-img/intro2svm/original2.png?raw=true" width="40%">
</div><br>


Then we scale the factor of $w$ and $b$ to make $\hat{\gamma} = 1$. Note that maximize $\hat{\gamma} / \|w\| = 1/\|w\|$ is the same thing as minimize the $\|w\|^2$. We have the following optimization problem:


<div align="center">
  <img src="https://github.com/Zhenye-Na/Zhenye-Na.github.io/blob/master/assets/images/posts-img/intro2svm/original3.png?raw=true" width="40%">
</div><br>


Its solution gives us **optimal margin classifier** and it is a quadratic programming (QP) problem which can be solved using and QP solver.


## Optimal margin classifiers

According to Largrange duality we re-write the constaints as

<div align="center">
  <img src="https://github.com/Zhenye-Na/Zhenye-Na.github.io/blob/master/assets/images/posts-img/intro2svm/primal.png?raw=true" width="40%">
</div><br>


where


$$
g_i(w) = 1 - y^{(i)} (w^T x^{(i)} + b) \leq 0
$$


From KKT dual complementarily condition, we have $\alpha_i > 0$ only for the training examples with contraints $g_i(w) = 0$, where functional margin equals to $1$.


<div align="center">
  <img src="https://github.com/Zhenye-Na/Zhenye-Na.github.io/blob/master/assets/images/posts-img/intro2svm/margin.png?raw=true" width="40%">
  <p>Support Vectors. Image source <a href="http://svm.michalhaltuf.cz/support-vector-machines/">Michal's blog of "Support vector machines"</a></p>
</div><br>

Something to remember concerning support vectors:

1. functional margin $\hat{\gamma} = 1$
2. $\alpha \neq 0$
3. $g_i(w) = 0$


### Largrangian of optimization problem

The next is to derive





## 4 Kernels







### Mercer Theorem











## Regularization and non-linear separable case

In order to make SVM work for **non-linearly separable datasets** as well as **less sensitive to outliers**. We introduce the $\ell_1$ regularization term, also people call this *softmargin SVM*


$$
\begin{align*}
\min_{r,w,b} \quad & \frac{1}{2}\|w\|^2 + C \sum_{i=1}^{m}{\xi_{i}}\\
\textrm{s.t.} \quad & y^{(i)}(w^T(x^{(i)}+b)) \geq 1 - \xi_{i} \quad i = 1, \dots, m\\
  & \xi_i \geq 0  \quad i = 1, \dots, m \\
\end{align*}
$$





## 6 Maximum margin solution in non-linearly separable case

### 6.1 Original form





### 6.2 Regularized form





### 6.3 Unconstrained form







## 7 The SMO algorithm

The SMO (sequential mimimal optimization) algorithm gives an efficient way to **solve the dual problem arising from the derivation of the SVM**.



### 7.1 Coordinate ascent





### 7.2 SMO algorithm







## 8 Interview Questions

### Parameter $C$ in softmargin SVM

<div align="center">
  <img src="https://github.com/Zhenye-Na/Zhenye-Na.github.io/blob/master/assets/images/posts-img/intro2svm/regularized.png?raw=true" width="40%">
</div><br>



The parameter $C$ tells the algorithm how much you want to **avoid mis-classifying each training example**.

1. For large value of $C$, optimization will choose a smaller-margin hyperplane.
2. For small value of $C$, optimization will look for a larger-margin separating hyperplane.
3. For tiny value of $C$, will find mis-classified examples, even if data is linearly separable.



### Bias-Variance tradeoff of SVMs

We can derive a regularized form of SVM

$$
\min_{r,w,b} \quad \frac{1}{2}\|w\|^2 + C \sum_{i=1}^{m}{\xi_{i}}
$$

to

$$
\min_{r,w,b} \quad \sum_{i=1}^{m}{\xi_{i}} + \frac{\lambda}{2}\|w\|^2
$$

where $\lambda = \frac{1}{C}$.


The paramter $C$ controls the relative weighting between the twin goals of

1. making the $\|w\|^2$ small which makes the margin large.
2. ensuring that most examples have functional margin at least $1$.


The procedure of bias-variance tradeoff analysis can be as follows:

1. When $C$ is large, which means $\lambda$ is small. We ignore / take away regularization term and lead to a **high variance model** (overfitting related), so the separating hyperplane is more variable and the margin should be really **small**.
2. When $C$ is small, which mean $\lambda$ is large. We take too much regularization term into account, so that we have a **high bias model** (underfitting related), so the hyperplane is to ensure the margin is **large** enough.



### Main advantages and drawbacks of SVM

**Main advantages**

- Mathematically designed to *reduce the overfitting* by maximizing the margin between data points
- Prediction is fast
- Can manage a lot of data and a lot of features (high dimensional problems)
- Doesn't take too much memory to store


**Main drawbacks**

- Can be time consuming to train
- Parameterization can be tricky in some cases
- Communicating isn't easy



## Intuition





## Lagrange Duality





## Primal Problem





## Dual Problem





## Regularized solution





## Other





## References

- [1] Andrew Ng, CS229: Machine Learning lecture notes, Stanford.
- [2] A. G. Schwing, M. Telgarsky, CS446: Machine Learning lecture slides, UIUC.
- [3]
- [4] Chih-Wei Hsu, Chih-Chung Chang and Chih-Jen Lin, [A Practical Guide to Support Vector Classification](https://www.csie.ntu.edu.tw/~cjlin/papers/guide/guide.pdf)
- [5] Stack Exachange, [When using SVMs, why do I need to scale the features?](https://stats.stackexchange.com/questions/154224/when-using-svms-why-do-i-need-to-scale-the-features)
- [6] Jose De Dona, [Lagrangian Duality](http://www.eng.newcastle.edu.au/eecs/cdsc/books/cce/Slides/Duality.pdf)