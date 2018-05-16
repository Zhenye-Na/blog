---
layout: post
title:  "Nonlinear Component Analysis as a Kernel Eigenvalue Problem"
key: 10003
date:   2017-12-10
excerpt: "Implementation of paper: Nonlinear Component Analysis as a Kernel Eigenvalue Problem"
category: project
tag: [PCA, KPCA, Python, Classification, Dimensionality Reduction]
---

<img src="https://github.com/Zhenye-Na/Zhenye-Na.github.io/blob/master/assets/images/projs-img/npca/npca.jpg?raw=true" align="center">

This is a course project of IE529 in 2017 Fall given by [Prof. Carolyn](https://sites.google.com/a/illinois.edu/carolyn-beck/). Our group members include Jvn Karthik, [Naman Shukla](https://namanuiuc.github.io/), Shubham Bansal and Ziyu Zhou.

We outlined and implemented algorithm/Pseudo-code for performing Kernel PCA presented in [paper](http://ieeexplore.ieee.org/document/6790375/) `Nonlinear Component Analysis as a Kernel Eigenvalue Problem` by Bernhard Schölkopf, Alexander Smola, Klaus-Robert Müller. Furthermore, we implemented the toy example and performed SVM classification after using [Kernel PCA](https://en.wikipedia.org/wiki/Kernel_principal_component_analysis) and [PCA](https://en.wikipedia.org/wiki/Principal_component_analysis) respectively on [Iris Dataset](https://archive.ics.uci.edu/ml/datasets/iris). Besides, we implemented Handwriting Digit Recognition via SVM given by Kernel PCA and PCA on [UPSP dataset](https://www.otexts.org/1577). 

The result of our two experiments concluded that:

- Kernel PCA can offer more features (information) than PCA, when it is preferred performing SVM or other classification approaches.
- Both Kernel PCA and PCA are just kind of [Dimensionality Reduction](https://en.wikipedia.org/wiki/Dimensionality_reduction) methods. We cannot observe apparent clusters after performing that.

For implementation details please refer to our [final report](https://github.com/Zhenye-Na/npca/blob/master/docs/report.pdf) and Github repo.
<br><br>
<a align="center" class="btn zoombtn" href="https://github.com/Zhenye-Na/npca">See this project</a>