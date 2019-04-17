---
layout: article
title: "Data Science and Machine Learning interview questions (1)"
date: 2019-04-13
modify_date: 2019-04-17
excerpt: "Series of machine learning / deep learning / data science interview questions"
tags: [Machine Learning, Deep Learning, Data Science, Interview Questions]
pageview: true
mathjax: true
mathjax_autoNumber: true
---

# Data Science and Machine Learning interview questions - Part 1


## 1. Machine Learning model selection

<div align="center">
  <img src="https://github.com/Zhenye-Na/Zhenye-Na.github.io/blob/master/assets/images/posts-img/ml-interview/model_selection.png?raw=true" width="80%">
</div>


* * *

## 2. How to choose PR curve vs ROC curve?

You should prefer the PR curve whenever the **positive class is rare** or when you **care more about the false positives than the false negatives**, and the ROC curve otherwise.

* * *

## 3. Explain The Bias/Variance Tradeoff?

An important theoretical result of statistics and Machine Learning is the fact that a model's generalization error can be expressed as the sum of three very different errors:

- **Bias**
    - This part of the generalization error is due to wrong assumptions, such as assuming that the data is linear when it is actually quadratic. A *high-bias model* is most likely to *underfit* the training data.

- **Variance**
    - This part is due to the model's excessive sensitivity to small variations in the training data. A model with many degrees of freedom (such as a high-degree polynomial model) is likely to have *high variance*, and thus to *overfit* the training data.

- **Irreducible error**
    - This part is due to the *noisiness* of the data itself. The only way to reduce this part of the error is to clean up the data (e.g., fix the data sources, such as broken sensors, or detect and remove outliers).

**Increasing a model's complexity will typically increase its variance and reduce its bias. Conversely, reducing a model's complexity increases its bias and reduces its variance.** This is why it is called a tradeoff.

* * *

## 4. What are the main motivations for reducing a dataset's dimensionality? What are the main drawbacks?

- The main **motivations** for dimensionality reduction are:
    - To speed up a subsequent training algorithm (in some cases it may even remove noise and redundant features, making the training algorithm perform better).
    - To visualize the data and gain insights on the most important features.
    - Simply to save space (compression).
- The main **drawbacks** are:
    - Some information is lost, possibly degrading the performance of subsequent training algorithms.
    - It can be computationally intensive.
    - It adds some complexity to your Machine Learning pipelines.
    - Transformed features are often hard to interpret.

* * *

## 5. What is the curse of dimensionality?

The curse of dimensionality refers to the fact that many problems that do not exist in low-dimensional space arise in high-dimensional space. In Machine Learning, one common manifestation is the fact that randomly sampled highdimensional vectors are generally very sparse, increasing the risk of overfitting and making it very difficult to identify patterns in the data without having plenty of training data.

* * *

## 6. Should you use the primal or the dual form of the SVM problem to train a model on a training set with millions of instances and hundreds of features?

*The dual problem is faster to solve than the primal when the number of training instances is smaller than the number of features.*

The computational complexity of the primal form of the SVM problem is proportional to the number of training instances $m$, while the computational complexity of the dual form is proportional to a number between $m^2$ and $m^3$ . So if there are millions of instances, you should **definitely use the primal form**, because the dual form will be much too slow.

* * *

## 7. Is it possible to speed up training of a bagging ensemble by distributing it across multiple servers? What about pasting ensembles, boosting ensembles, random forests, or stacking ensembles?

It is quite possible to speed up training of a bagging ensemble by distributing it across multiple servers, since each predictor in the ensemble is independent of the others. The same goes for pasting ensembles and Random Forests, for the same reason.

However, each predictor in a boosting ensemble is built based on the previous predictor, so training is necessarily sequential, and you will not gain anything by distributing training across multiple servers.

Regarding stacking ensembles, all the predictors in a given layer are independent of each other, so they can be trained in parallel on multiple servers. However, the predictors in one layer can only be trained after the predictors in the previous layer have all been trained.

* * *

## 8. If your AdaBoost ensemble underfits the training data, what hyperparameters should you tweak and how? If your Gradient Boosting ensemble overfits the training set, should you increase or decrease the learning rate?

If your AdaBoost ensemble underfits the training data, you can try **increasing the number of estimators** or **reducing the regularization hyperparameters of the base estimator**. You may also try **slightly increasing the learning rate**.

If your Gradient Boosting ensemble overfits the training set, you should try **decreasing the learning rate**. You could also use **early stopping** to find the right number of predictors (you probably have too many).

* * *

## 9. Does it make any sense to chain two different dimensionality reduction algorithms?

It can absolutely make sense to chain two different dimensionality reduction algorithms. A common example is using PCA to quickly get rid of a large number of useless dimensions, then applying another much slower dimensionality reduction algorithm, such as LLE. This two-step approach will likely yield the same performance as using LLE only, but in a fraction of the time.

* * *

## 10. What are the advantages of a CNN over a fully connected DNN for image classification?


These are the main advantages of a CNN over a fully connected DNN for image classification:

- Because consecutive layers are only *partially connected and because it heavily reuses its weights*, a CNN has many **fewer parameters** than a fully connected DNN, which makes it much faster to train, reduces the risk of overfitting, and requires much less training data.

- When a CNN has learned a kernel that can detect a particular feature, it **can detect that feature anywhere on the image**. In contrast, when a DNN learns a feature in one location, it can detect it only in that particular location. Since images typically have very repetitive features, CNNs are able to generalize much better than DNNs for image processing tasks such as classification, using fewer training examples.

- Finally, a DNN has no prior knowledge of how pixels are organized; it does not know that nearby pixels are close. A CNN's architecture embeds this prior knowledge. **Lower layers typically identify features in small areas of the images, while higher layers combine the lower-level features into larger feature**s. This works well with most natural images, giving CNNs a decisive head start compared to DNNs.



## References

[1] Aurélien Géron, *"Hands-On Machine Learning with Scikit-Learn and TensorFlow"*.  