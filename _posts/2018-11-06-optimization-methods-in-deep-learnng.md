---
layout: post
title: "Optimization methods in Deep Learning"
date: 2018-11-06
modify_date: 2018-11-09
excerpt: ""
tags: [Optimization, Deep Learning]
mathjax: true
mathjax_autoNumber: true
---

> Still working on this ...

# Optimization methods in Deep Learning

We note that optimization for deep networks is currently a very active area of research. In this section we highlight some established and common techniques you may see in practice, briefly describe their intuition, but leave a detailed analysis outside of the scope of the class. We provide some further pointers for an interested reader.

## Optimization methods

### First Order Optimization

These algorithms minimize or maximize a Loss function $E(x)$ using its **Gradient** values with respect to the parameters. Most widely used First order optimization algorithm is **Gradient Descent**. The First order derivative tells us whether the function is decreasing or increasing at a particular point. First order Derivative basically give us a line which is Tangential to a point on its Error Surface.

### Second Order Optimization

Second-order methods use the second order derivative which is also called **Hessian** to minimize or maximize the Loss function. The Hessian is a Matrix of Second Order Partial Derivatives. Since the second derivative is costly to compute, the second order is not used much. The second order derivative tells us whether the first derivative is increasing or decreasing which hints at the function's curvature. Second Order Derivative provide us with a quadratic surface which touches the curvature of the **Error Surface**.

$$ x \leftarrow x - [H f(x)]^{-1} \nabla f(x) $$


Some Advantages of Second Order Optimization over First Order:  
Although the Second Order Derivative may be a bit costly to find and calculate, but the advantage of a Second order Optimization Technique is that is **does not neglect or ignore the curvature of Surface**. Secondly, **in terms of Step-wise Performance they are better**.
{:.info}


### Comparison between two optimization methods

- First Order Optimization techniques are **easy to compute** and **less time consuming**, **converging pretty fast on large data sets**.
- Second Order Techniques are faster only when the Second Order Derivative is known otherwise, these methods are always slower and costly to compute in terms of both time and memory.



## Gradient Descent

### Stochastic gradient descent


### mini-batch gradient descent


## Gradient Descent with Momentum

In the notations below,

$$ g = \nabla_{\theta} \frac{1}{M} \sum_{m=1}^{M} \rho \big(f(x^m; \theta), y^m \big). $$

### Adam

$$ \begin{align} t &\leftarrow t + 1 \\
s &\leftarrow \rho_1 s + (1- \rho_1) g, \\ r &\leftarrow \rho_2 s + (1- \rho_2) g \odot g,\\ \hat{s} &\leftarrow \frac{s}{1 - \rho_1^t},\\ \hat{r} &\leftarrow \frac{s}{1 - \rho_2^t},\\ \Delta &= - \frac{\epsilon}{\delta + \sqrt{\hat{r}}} \odot \hat{s},\\ \theta_i &\leftarrow \theta_i + \Delta \theta_i \end{align} $$

where $\theta_i$ is the $i_{\text{th}}$ parameter.

### RMSprop

RMSprop is a very effective, but currently unpublished adaptive learning rate method. Amusingly, everyone who uses this method in their work currently cites [slide 29 of Lecture 6](http://www.cs.toronto.edu/~tijmen/csc321/slides/lecture_slides_lec6.pdf) of Geoff Hinton's Coursera class. The RMSProp update adjusts the Adagrad method in a very simple way in an attempt to reduce its aggressive, monotonically decreasing learning rate. In particular, it uses a moving average of squared gradients instead, giving:

```python
cache = decay_rate * cache + (1 - decay_rate) * dx ** 2
x += - learning_rate * dx / (np.sqrt(cache) + eps)
```

Here, `decay_rate` is a hyperparameter and typical values are `[0.9, 0.99, 0.999]`. Notice that the `x +=` update is identical to Adagrad, but the `cache` variable is a "leaky". Hence, RMSProp still modulates the learning rate of each weight based on the magnitudes of its gradients, which has a beneficial equalizing effect, but unlike Adagrad the updates do not get monotonically smaller.

Mathematical representation is given by:

$$ \begin{align} r_i &\leftarrow \rho r_i + (1 - \rho) g_i^2 \\
\Delta \theta_i &= - \frac{\epsilon}{\sqrt{\delta + r_i}} g_i \\
\theta_i &\leftarrow \theta_i + \Delta \theta_i \end{align} $$

where $\theta_i$ is the $i_{\text{th}}$ parameter.

#### RMSprop element-wise


$$ \begin{align} r_i &\leftarrow \rho r_i + (1 - \rho) g \odot g  \\
\Delta \theta_i &= - \frac{\epsilon}{\sqrt{\delta + r_i}} \odot g \\
\theta_i &\leftarrow \theta_i + \Delta \theta_i \end{align} $$

where $\sqrt{\cdot}$ is applied element-wise.

### AdaGrad

an adaptive learning rate method originally proposed by [Duchi et al.](http://jmlr.org/papers/v12/duchi11a.html)

```python
# Assume the gradient dx and parameter vector x
cache += dx ** 2
x += - learning_rate * dx / (np.sqrt(cache) + eps)
```
Notice that the variable `cache` has size equal to the size of the gradient, and keeps track of per-parameter sum of squared gradients. This is then used to normalize the parameter update step, element-wise. Notice that the weights that receive high gradients will have their effective learning rate reduced, while weights that receive small or infrequent updates will have their effective learning rate increased. Amusingly, the square root operation turns out to be very important and without it the algorithm performs much worse. The smoothing term `eps` (usually set somewhere in range from 1e-4 to 1e-8) avoids division by zero. A downside of Adagrad is that in case of Deep Learning, the monotonic learning rate usually proves too aggressive and stops learning too early.

Mathematical representation is given by:

$$ \begin{align} r_i &\leftarrow r_i + g_i^2 \\
\Delta \theta_i &= - \frac{\epsilon}{\delta + \sqrt{r_i}} g_i \\
\theta_i &\leftarrow \theta_i + \Delta \theta_i \end{align} $$

where $\theta_i$ is the $i_{\text{th}}$ parameter.


## Visualization of the Optimization Algorithms

There is a great blog made by [Emilien Dupont](https://bl.ocks.org/EmilienDupont) on "Optimization Algorithms Visualization", you can find the blog [here](https://bl.ocks.org/EmilienDupont/aaf429be5705b219aaaf8d691e27ca87).

More specifically,


<div class="row">
  <div class="column">
    <img src="https://cs231n.github.io/assets/nn3/opt1.gif" alt="opt1" style="width:100%">
  </div>
  <div class="column">
    <img src="https://cs231n.github.io/assets/nn3/opt2.gif" alt="opt2" style="width:100%">
  </div>
</div>


> Animations that may help your intuitions about the learning process dynamics. Left: Contours of a loss surface and time evolution of different optimization algorithms. Notice the "overshooting" behavior of momentum-based methods, which make the optimization look like a ball rolling down the hill. Right: A visualization of a saddle point in the optimization landscape, where the curvature along different dimension has different signs (one dimension curves up and another down). Notice that SGD has a very hard time breaking symmetry and gets stuck on the top. Conversely, algorithms such as RMSprop will see very low gradients in the saddle direction. Due to the denominator term in the RMSprop update, this will increase the effective learning rate along this direction, helping RMSProp proceed. Images credit: [Alec Radford](https://twitter.com/alecrad).



## References

[1] CS231n Convolutional Neural Networks for Visual Recognition, lecture notes [*"CS231n Convolutional Neural Networks for Visual Recognition - lecture notes 3"*](http://cs231n.github.io/neural-networks-3/#second)  
[2] Anish Singh Walia, [*"Types of Optimization Algorithms used in Neural Networks and Ways to Optimize Gradient Descent"*](https://towardsdatascience.com/types-of-optimization-algorithms-used-in-neural-networks-and-ways-to-optimize-gradient-95ae5d39529f)


<style>
.center {
  display: block;
  margin-left: auto;
  margin-right: auto;
}

/* Three image containers (use 25% for four, and 50% for two, etc) */
.column {
  float: left;
  width: 45%;
  padding: 5px;
}

/* Clear floats after image containers */
.row::after {
  content: "";
  clear: both;
  display: table;
}
</style>