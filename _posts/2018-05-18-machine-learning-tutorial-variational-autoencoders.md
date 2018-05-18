---
layout: post
title: "Machine Learning Tutorial Part 8: Variational Autoencoders"
date: 2018-05-18
excerpt: "Understanding Variational Autoencoders (VAEs)"
tags: [VAE, Deep Learning, Machine Learning]
mathjax: true
mathjax_autoNumber: true
---

> *Variational Autoencoders (VAEs) have emerged as one of the most popular approaches to unsupervised learning of complicated distributions. VAEs are appealing because they are built on top of standard function approximators (Neural Networks), and can be trained with Stochastic Gradient Descent (SGD). VAEs have already shown promise in generating many kinds of complicated data. In this tutorial, I will introduce the intuitions behind VAEs, explains the mathematics behind them, and experiments with MNIST dataset.*

Goals of this Tutorial:

* Getting to know Variational Autoencoders, a Generative modeling technique.
* Understanding the reasons for approximations.

## Kullback–Leibler Divergence

Before we start examining VAEs closely, let us first review the metric used in VAE for quantifying the similarity between two probability distributions.

[KL (Kullback–Leibler) divergence](https://en.wikipedia.org/wiki/Kullback%E2%80%93Leibler_divergence) which is closely related to relative entropy, information divergence, and information for discrimination, is a non-symmetric measure of the difference between two probability distributions $p(x)$ and $q(x)$. Specifically, the Kullback-Leibler (KL) divergence of $q(x)$ from $p(x)$, denoted $D_{KL}(p(x) \| q(x))$, is a measure of the information lost when $q(x)$ is used to approximate $p(x)$.

$$ D_{KL}(p \| q) = \int_x p(x) \log \frac{p(x)}{q(x)} dx $$

<figure>
    <img src="https://github.com/Zhenye-Na/Zhenye-Na.github.io/blob/master/assets/images/posts-img/vae/KL.png?raw=true" width="60%" class="center">
    <figcaption>Figure 1: Illustration of the Kullback–Leibler (KL) divergence for two normal distributions. The typical asymmetry for the Kullback–Leibler divergence is clearly visible. <i>(Image source: <a href="https://en.wikipedia.org/wiki/Kullback%E2%80%93Leibler_divergence#/media/File:KL-Gauss-Example.png">Wikipedia: Kullback–Leibler divergence</a>)</i>.</figcaption>
</figure>


$D_{KL}(p(x) \| q(x))$ achieves minimum (zero) if and only if $p(x) = q(x)$ everywhere.

> **Proof:**

$$ \begin{align} D_{KL}(p(x) \| q(x)) &= - \int p(x) \log \frac{q(x)}{p(x)} dx \\ &\geq - \log \int p(x) \frac{q(x)}{p(x)} dx \\ &= - \log \int q(x) dx \\ &= 0 \end{align} $$


### KL-Divergence in Python

`Scipy` apparently does implement this, with a naming scheme more related to the field of information theory. The function is ["scipy.stats.entropy"](http://scipy.github.io/devdocs/generated/scipy.stats.entropy.html):


```python
scipy.stats.entropy(pk, qk=None, base=None)
```


## Generative models

A Generative Model is a powerful way of learning any kind of data distribution using unsupervised learning and it has achieved tremendous success in just few years. All types of generative models aim at learning the *true data distribution* of the training set so as to generate new data points with some variations. But it is not always possible to learn the exact distribution of our data either implicitly or explicitly and so we try to model a distribution which is as similar as possible to the true data distribution. 

There are several examples of Generative models, like:

* Variational Autoencoders (VAEs)
* Generative Adversarial Networks (GANs)
* Gaussian Mixture Model (GMM)
* K-Means

Unlike Discriminative models using

$$ p(y \vert x) = \frac{\exp F(\textbf{y}, x, \textbf{w}) / \epsilon}{\sum \limits_{\hat{y}} \exp F(\hat{\textbf{y}}, x, \textbf{w}) / \epsilon } $$

* $\textbf{y}$: discrete output space
* $x$: input data

to predict labels, Generative models directly model 

$$ p(x) $$

given a data point $x$.

* Fit mean and variance (= parameters $\theta$) of a distribution (e.g., Gaussian)
* Fit parameters $\theta$ of a mixture distribution (e.g., mixture of Gaussian, k-means)



## Latent Variable Models

More formally, a latent variable model (LVM) $p$ is a probability distribution over two sets of variables $x$, $z$:


$$ p(x, z; \theta), $$

where the $x$ variables are observed at learning time in a dataset $\mathcal{D}$ and the $z$ are never observed.


The model may be either directed or undirected. There exist both discriminative and generative LVMs, although here we will focus on the latter (the key ideas hold for discriminative models as well). To make this notion precise mathematically, we are aiming maximize the probability of each $X$ in the training set under the entire generative process, according to:


$$ P(X) = P(X \vert z; \theta)P(z)dz. $$

Here, $f(z; \theta)$ has been replaced by a distribution $P(X \vert z; \theta)$, which allows us to make the dependence of $X$ on $z$ explicit by using the law of total probability. The intuition behind this framework—called "maximum likelihood" is that if the model is likely to produce training set samples, then it is also likely to produce similar samples, and unlikely to produce dissimilar ones. In VAEs, the choice of this output distribution is often Gaussian, i.e., $ P(X \vert z; \theta) = \mathcal{N}(X \vert f (z; \theta), \sigma^2 * I) $.



## Variational Auto-Encoders

The mathematical basis of VAEs actually has relatively little to do with classical autoencoders, e.g. Sparse Autoencoders or Denoising Autoencoders. They are called "autoencoders" only because the final training objective that derives from this setup does have an encoder and a decoder, and resembles a traditional autoencoder. Unlike sparse autoencoders, there are generally no tuning parameters analogous to the sparsity penalties. And unlike sparse and denoising autoencoders, we can sample directly from $P(X)$ (without performing Markov Chain Monte Carlo).



<figure>
    <img src="https://github.com/Zhenye-Na/Zhenye-Na.github.io/blob/master/assets/images/posts-img/vae/decoder2.png?raw=true" width="40%" class="center">
    <figcaption><center>Figure 2: VAEs training process.</center></figcaption>
</figure>


### Decoder

<figure>
    <img src="https://github.com/Zhenye-Na/Zhenye-Na.github.io/blob/master/assets/images/posts-img/vae/decoder1.png?raw=true" width="50%" class="center">
    <figcaption><center>Figure 3: Illustration of the structure of Decoder.</center></figcaption>
</figure>

According to Manifold Hypothesis, real-world high dimensional data (such as images) lie on low-dimensional manifolds embedded in the high-dimensional space. If $x$ is a high dimensional vector, then data is concentrated around a low dimensional manifold. So we can represent our sample data using "latent variables".



Decoder is a Neural Net. Its input is the latent variables $z$, it outputs sample data $x$, and has weights and biases $\theta$. Decoder is denoted by $p_\theta (x \vert z)$ in this tutorial.



### Encoder


Let us first figure out what is $p_\theta (z \vert x)$ - Encoder:

$$ \begin{align} p_\theta (z \vert x) &= \frac{p_\theta (x \vert z) p(z) }{p_\theta x} \\ &= \frac{p_\theta (x \vert z) p(z)}{\int_\hat{z} p_\theta (x \vert \hat{z}) p(\hat{z}) d\hat{z}} \end{align} $$


We can easily compute $p_\theta (x \vert z)$ and $p(z)$. However, $\int_\hat{z} p_\theta (x \vert \hat{z}) p(\hat{z}) d\hat{z}$ is hard to get because there is a messy integration over all latent variable $\hat{x}$. There are two feasible approaches to solve this problem:


* Sampling techniques $\Rightarrow$ generally very costly)
* Approximate $p_\theta (z \vert x)$ with $q_\phi (z \vert x)$ $\Rightarrow$ Encoder


Encoder is another Neural Network. Its input is a datapoint $x$, its output is a laten variables $z$, and it has weights and biases $\phi$.


<figure>
    <img src="https://github.com/Zhenye-Na/Zhenye-Na.github.io/blob/master/assets/images/posts-img/vae/encoder1.png?raw=true" width="50%" class="center">
    <figcaption><center>Figure 4: Illustration of the structure of Encoder.</center></figcaption>
</figure>

This is typically referred to as a "bottleneck" because the encoder must learn an efficient compression of the data into this *lower-dimensional space*. Let’s denote the encoder as


$$ q_\phi (z \vert x) = \mathcal{N}(z; \mu_\phi (x), \sigma_\phi (x)). $$ 


### Architecture

The current architecture of VAEs is as follows

<figure>
    <img src="https://github.com/Zhenye-Na/Zhenye-Na.github.io/blob/master/assets/images/posts-img/vae/archi.png?raw=true" width="80%" class="center">
    <figcaption><center>Figure 5: Architecture of Variational Autoencoders.</center></figcaption>
</figure>

$\Diamond$ Pay attention to we model $\sigma_z^2$ in $\log$ space here, the reason why is to mmake sure $\sigma_z^2$ is always non-negative.


### Loss Function

The loss function of the variational autoencoder is the negative log-likelihood with a regularizer.


$$ \begin{align} \log p_\theta (x) &= \int_z q_\phi (z \vert x) \log p_\theta (x) \\ &= \int_z q_\phi (z \vert x) \log \frac{p_\theta (x, z)}{p_\theta (z \vert x)} \\ &= \int_z q_\phi (z \vert x) \log \bigg( \frac{p_\theta (x, z)}{q_\phi (z \vert x)} \cdot \frac{q_\phi (z \vert x)}{p_\theta (z \vert x)} \bigg) \\ &= \int_z q_\phi (z \vert x) \log \frac{p_\theta (x, z)}{q_\phi (z \vert x)} + \int_z q_\phi (z \vert x) \log \frac{q_\phi (z \vert x)}{p_\theta (z \vert x)} \\ &= \mathcal{L} (p_\theta, q_\phi) + D_{KL} (q_\phi, p_\theta) \\ &\geq \mathcal{L} (p_\theta, q_\phi) \end{align} $$


$\mathcal{L}$ is often referred to as Empirical Lower BOund or Evidence Lower BOund (ELBO)


So we can approximate it as:

$$ \begin{align} \mathcal{L} (p_\theta, q_\phi) &= \int_z q_\phi (z \vert x) \log \frac{p_\theta (x, z)}{q_\phi (z \vert x)} \\ &= \int_z q_\phi (z \vert x) \log \frac{p_\theta (x \vert z) p(z)}{q_\phi (z \vert x)} \\ &= \int_z q_\phi (z \vert x) \log \frac{p_\theta (x, z)}{q_\phi (z \vert x)} \\&= \int_z q_\phi (z \vert x) \log \frac{p()z)}{q_\phi (z \vert x)} + \int_z q_\phi (z \vert x) \log p_\theta (x \vert z) \\&= -D_{KL} (q_\phi, p) + \mathbb{E}[\log p_\theta (x \vert z)] \end{align} $$

* Regularization Loss: $ -D_{KL} (q_\phi, p) $ with prior $p(z)$ (Gaussian)
* Reconstruction Loss: $ \mathbb{E}[\log p_\theta (x \vert z)] $

#### Regularization Loss

$$ -D_{KL} (q_\phi, p) = \int_z q_\phi (z \vert x) \log \frac{p(z)}{q_\phi (z \vert x)} $$

* $ p(z) = \mathcal{N} (z; 0, 1). $
* $ q_\phi (z \vert x) $ is a Gaussian with mean $ \mu_\phi (x) $, variance $ \sigma^2_\phi (x) $

$$ D_{KL} (q(z \vert x) \| p(z)) = \frac{1}{2} \cdot (\sigma_z^2 + \mu_z^2 - 1 \log(\sigma_z^2)) $$

#### Reconstruction Loss

$$ \mathbb{E}[\log p_\theta (x \vert z)] = \int_z q_\phi (z \vert x) \log p_\theta (x \vert z) $$

What we deal with Reconstruction Loss is to sample from $q_\phi (z \vert x)$.

$ \mathbb{E}[\log p_\theta (x \vert z)] \approx \frac{1}{N} \sum \limits_{i=1}^N \log p_\theta (x \vert z^i)$, where $z^i \sim \mathcal{N}(z; \mu_\phi (x), \sigma_phi (x))$


### Reparametrization

Where are we now? We have figured out the architecture for both Encoder and Decoder. However, how do we optimize or how do we perform backpropogation? 


<img src="https://github.com/Zhenye-Na/Zhenye-Na.github.io/blob/master/assets/images/posts-img/vae/archi2.png?raw=true" width="80%" class="center">


We can easily backpropgation through Decoder. However, how to take derivatives with respect to the parameters of a stochastic variable. If we are given $z$ that is drawn from a distribution $q_\theta (z \vert x)$, and we want to take derivatives of a function of $z$ with respect to $\theta$, how do we do that?


$$ z \sim q_\phi (z \vert x) = \mathcal{N}(z; \mu_\phi (x), \sigma_\phi (x)) $$

is equivalent to

$$ z = \mu_\phi (x) + \sigma_\phi (x) \cdot \epsilon, $$

where $ \epsilon \sim \mathcal{N} (0, 1)$


### Flowchart

Variational Autoencoder flowchart

<figure>
    <img src="https://github.com/Zhenye-Na/Zhenye-Na.github.io/blob/master/assets/images/posts-img/vae/flowchart.png?raw=true" width="80%" class="center">
    <figcaption><center>Figure 6: Flowchart of Variational Autoencoders.</center></figcaption>
</figure>


## Implementation

Based on what we mentioned before, let us build a `VariationalAutoencoder` class. We will use `Tensorflow` as the Deep Learning library for training.


```python
class VariationalAutoencoder(object):
    """Varational Autoencoder."""

    def __init__(self, ndims=784, nlatent=2):
        """Initialize a VAE.

        Args:
            ndims(int): Number of dimensions in the feature.
            nlatent(int): Number of dimensions in the latent space.
        """
        self._ndims = ndims
        self._nlatent = nlatent

        # Create session
        self.session = tf.Session()
        self.x_placeholder = tf.placeholder(tf.float32, [None, ndims])
        self.learning_rate_placeholder = tf.placeholder(tf.float32, [])

        # Build graph.
        self.z_mean, self.z_log_var = self._encoder(self.x_placeholder)
        self.z = self._sample_z(self.z_mean, self.z_log_var)
        self.outputs_tensor = self._decoder(self.z)

        # Setup loss tensor, predict_tensor, update_op_tensor
        self.loss_tensor = self.loss(self.outputs_tensor, self.x_placeholder,
                                     self.z_mean, self.z_log_var)

        self.update_op_tensor = self.update_op(self.loss_tensor,
                                               self.learning_rate_placeholder)

        # Initialize all variables.
        self.session.run(tf.global_variables_initializer())
```

Recall what we mentioned in Reblablablabla section, we will use that in latent variable $z$ sampling in `VariationalAutoencoder` class.


```python
    def _sample_z(self, z_mean, z_log_var):
        """Sample z using reparametrization trick.

        Args:
            z_mean (tf.Tensor): The latent mean,
                tensor of dimension (None, _nlatent)
            z_log_var (tf.Tensor): The latent log variance,
                tensor of dimension (None, _nlatent)
        Returns:
            z (tf.Tensor): Random sampled z of dimension (None, _nlatent)
        """
        # z = tf.random_normal(tf.shape(z_mean), mean=z_mean, stddev=tf.sqrt(
        #     tf.exp(z_log_var)), dtype=tf.float32)
        epsilon = tf.random_normal(tf.shape(z_mean), 0, 1, dtype=tf.float32)
        z = z_mean + tf.sqrt(tf.exp(z_log_var)) * epsilon
        return z
```

* Latent Loss 

```python
    def _latent_loss(self, z_mean, z_log_var):
        """Construct the latent loss.

        Args:
            z_mean(tf.Tensor): Tensor of dimension (None, _nlatent)
            z_log_var(tf.Tensor): Tensor of dimension (None, _nlatent)
        Returns:
            latent_loss(tf.Tensor): A scalar Tensor of dimension ()
                containing the latent loss.
        """
        latent_loss = 0.5 * tf.reduce_mean(tf.reduce_sum(
            tf.exp(z_log_var) + tf.square(z_mean) - 1 - z_log_var, 1),
            name="latent_loss")
        return latent_loss
```

* Reconstruction Loss

```python
    def _reconstruction_loss(self, f, x_gt):
        """Construct the reconstruction loss, assuming Gaussian distribution.

        Args:
            f(tf.Tensor): Predicted score for each example, dimension (None,
                _ndims).
            x_gt(tf.Tensor): Ground truth for each example, dimension (None,
                _ndims).
        Returns:
            recon_loss(tf.Tensor): A scalar Tensor for dimension ()
                containing the reconstruction loss.
        """
        # recon_loss = tf.losses.mean_squared_error(labels=x_gt, predictions=f)
        recon_loss = tf.nn.l2_loss(f - x_gt, name="recon_loss")
        return recon_loss
```


## Experimentation with MNIST Dataset

More details for implementation can be found [here](https://github.com/Zhenye-Na/cs446/blob/master/assignments/assignment10/mp10/vae.py).

<img src="https://github.com/Zhenye-Na/cs446/blob/master/assignments/assignment10/mp10/vae.gif?raw=true" width="60%" class="center">



## Quiz
* What is the difference between generative and discriminative modeling?
* What generative modeling techniques do you know about?
* What are the approximations used in variational auto-encoders?
* Why are variational auto-encoder results smooth?


> *If you notice mistakes and errors in this post, please don't hesitate to leave a comment and I would be super happy to correct them right away!*


## References
  
[1] Diederik P Kingma, Max Welling. [*"Auto-Encoding Variational Bayes"*](https://arxiv.org/pdf/1312.6114.pdf). arXiv preprint arXiv:1312.6114 (2013).  
[2] Carl Doersch. [*"Tutorial on Variational Autoencoders"*](https://arxiv.org/pdf/1606.05908.pdf). arXiv preprint arXiv:1606.05908 (2016).  
[3] A. G. Schwing, M. Telgarsky. *"L22: Variational Auto-Encoders"*. Lecture Slides of CS446, UIUC. (2018).  
[4] Mehmet Süzen. [*"The art of data science and scientific computing"*](http://memosisland.blogspot.com/2015/08/practical-kullback-leibler-kl.html). (2017).  
[5] Jan Hendrik METZEN. [*"Variational Autoencoder in TensorFlow"*](https://jmetzen.github.io/2015-11-27/vae.html). (2015).  
[6] Course notes for CS228: Probabilistic Graphical Models. [*"Learning in latent variable models"*](https://ermongroup.github.io/cs228-notes/learning/latent/)  
[7] Jaan Altosaar. [*"Tutorial - What is a variational autoencoder?"*](https://jaan.io/what-is-variational-autoencoder-vae-tutorial/).  
[8] Irhum Shafkat. [*"Intuitively Understanding Variational Autoencoders"*](https://towardsdatascience.com/intuitively-understanding-variational-autoencoders-1bfe67eb5daf). (2018).


<style>
.center {
    display: block;
    margin-left: auto;
    margin-right: auto;
}
</style>