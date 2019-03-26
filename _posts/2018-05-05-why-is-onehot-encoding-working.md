---
layout: post
title: "Why is One-Hot Encoding working?"
date: 2018-05-05
excerpt: "Why One-Hot Encode Data in Machine Learning?"
tags: [One-Hot Encoding, Deep Learning, Machine Learning]
mathjax: true
mathjax_autoNumber: true
---

> *Often, machine learning tutorials will recommend or require that you prepare your data in speciﬁc ways before ﬁtting a machine learning model. One good example is to use a one-hot encoding on categorical data. In this post, you will discover the answer to these important questions and better understand data preparation in general in applied machine learning.*


## Overview

Categorical data are variables that contain label values rather than numeric values. The number of possible values is often limited to a fixed set. Categorical variables are often called nominal. Some categories may have a natural relationship to each other, such as a natural ordering.


## Representation

- Data: $(x^{(1)}, y^{(1)})$, $(x^{(2)}, y^{(2)})$, $\dots$, $(x^{(n)}, y^{(n)})$
  - E.g. $y^{(i)} \in \{\text{"person"}, \text{"hamster"}, \text{"capybara"} \} $
- Encode $y^{(i)} \in \{1, 2, 3 \} $
  - Shouldn't be running something like linear regression, since "hamster" is not really the average of "person" and "capybara", so things are not likely to work well.


**Solution:** one-hot encoding
* "person" => [1, 0, 0]
* "hamster" => [0, 1, 0]
* "capybara" => [0, 0, 1]


## Multilayer Neural Network for Classification

### Neural Network Architecture

Below is the basic architecture of multilayer perceptron (Multilayer Neural Network):

<img src="https://github.com/Zhenye-Na/Zhenye-Na.github.io/blob/master/assets/images/posts-img/onehot/onehot1.png?raw=true" width="70%" class="center">

$y_i$ is large if the probability that the correct class is $i$ is high. $y^{(i)}$ encoded using `one-hot encoding`.

### Softmax

Sometimes we want to estimate the probability of $P( y = y' \vert x, \theta)$, $\theta$ are network parameters.

<img src="https://github.com/Zhenye-Na/Zhenye-Na.github.io/blob/master/assets/images/posts-img/onehot/onehot2.png?raw=true" width="70%" class="center">

$$ p_i = \frac{\exp y_i}{\sum_j \exp y_j}. $$

or

$$  \begin{align} p_j &= \frac{e^{a_i}}{\sum_{k=1}^N e^{a_k}} \\ &= \frac{Ce^{a_i}}{C\sum_{k=1}^N e^{a_k}} \\ &= \frac{e^{a_i + \log(C)}}{\sum_{k=1}^N e^{a_k + \log(C)}} \\\end{align} $$

which can be thought of as probabilities

* $0 < p_i < 1$
* $\sum_j p_j = 1$

we could think it as a generalization of logistic regression.

## Softmax Cross-Entropy

Cross entropy indicates the distance between what the model believes the output distribution should be, and what the original distribution really is. It is defined as

$$ H(y,p) = - \sum_i y_i \log(p_i). $$

Here we pay attention to  $\log (p_i)$ which is a vector of probabilities because $y_i$ is the groundtruth label which using one-hot-encoding, which will be tricky if we put it in the $\log$.
{: style="text-align: justify"}

Cross entropy measure is a widely used alternative of squared error. It is used when node activations can be understood as representing the probability that each hypothesis might be true, i.e. when the output is a probability distribution. Thus it is used as a loss function in neural networks which have softmax activations in the output layer.


## Implementation of One-Hot Encoding

- implementation from [scikit-learn](http://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.OneHotEncoder.html)

```python
>>> from sklearn.preprocessing import OneHotEncoder
>>> enc = OneHotEncoder()
>>> enc.fit([[0, 0, 3], [1, 1, 0], [0, 2, 1], [1, 0, 2]])  
OneHotEncoder(categorical_features='all', dtype=<... 'numpy.float64'>,
       handle_unknown='error', n_values='auto', sparse=True)
>>> enc.n_values_
array([2, 3, 4])
>>> enc.feature_indices_
array([0, 2, 5, 9])
>>> enc.transform([[0, 1, 1]]).toarray()
array([[ 1.,  0.,  0.,  1.,  0.,  0.,  1.,  0.,  0.]])
```


- implementation from scratch

```python
def one_hot_bldg_type(bldg_type):
    """Build the one-hot encoding vector.
    Args:
        bldg_type(str): String indicating the building type.
    Returns:
        ret(list): A list representing the one-hot encoding vector.
            (e.g. for 1Fam building type, the returned list should be
            [1,0,0,0,0].
    """
    type_to_id = {'1Fam': 0,
                  '2FmCon': 1,
                  'Duplx': 2,
                  'TwnhsE': 3,
                  'TwnhsI': 4,
                  }

    # bldg_type in train.csv first row is '1Fam'
    idx = type_to_id[bldg_type]

    vector = [0, 0, 0, 0, 0]

    # change the vector to one-hot encoding
    vector[idx] = 1

    # vector assignment
    ret = vector[:]
    return ret
```

- implementation of cross-entropy loss

```python
def cross_entropy(X,y):
    """cross entropy loss.
      
    Args:
        X: the output from fully connected layer (num_examples x num_classes)
        y: is labels (num_examples x 1)
      
    """
    m = y.shape[0]
    p = softmax(X)
    log_likelihood = -np.log(p[range(m),y])
    loss = np.sum(log_likelihood) / m
    return loss
```

- implementation of softmax

```python
def softmax(X):
    """softmax.
      
    Args:
        X: the output from fully connected layer
      
    """
    exps = np.exp(X - np.max(X))
    return exps / np.sum(exps)
```


>  *If you notice mistakes and errors in this post, please don’t hesitate to leave a comment and I would be super happy to correct them right away!*


## References

[1] Eli Bendersky. [*The Softmax function and its derivative*](https://eli.thegreenplace.net/2016/the-softmax-function-and-its-derivative/). (2016).

<style>
.center {
    display: block;
    margin-left: auto;
    margin-right: auto;
}
</style>