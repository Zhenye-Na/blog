---
layout: post
title: "Introduction to Linear Regression"
date: 2018-02-05
excerpt: "Under the hood - Linear Regression in Machine Learning"
tags: [Linear Regression, Deep Learning, Machine Learning]
comments: true
---

<img src="https://seaborn.pydata.org/_images/multiple_regression.png">

## Overview

Linear Regression is one of the simplest models in Machine Learning and it can be applied in serveral areas, which is pretty efficient. Having a good understanding of how things work can help you quickly home in on the appropriate model, the right training algorithm to use, and a good set of hyperparameters for your task. Understanding what’s under the hood will also help you debug issues and perform error analysis more efficiently.

In this article, I will explain two major approach to train the Linear Regression Model:

1. [Closed-form Solution](https://stats.stackexchange.com/questions/23128/solving-for-regression-parameters-in-closed-form-vs-gradient-descent), which directly computes the model parameters.
2. Iterative Optimization approach, which is called [Gradient Descent](https://en.wikipedia.org/wiki/Gradient_descent) (GD).

## Linear Regression Intuition
Linear Regression is a statistical method that allows us to summarize, study and even predict relationships between variables.

1. One variable, denoted \\( \textbf{x} \\), is regarded as vector which implies all the features you have for the problem.
2. The other variable, denoted \\( y \\), is regarded as a scalar which imples the "response" which we want to predict or summarize.

<img src="https://onlinecourses.science.psu.edu/stat501/sites/onlinecourses.science.psu.edu.stat501/files/01simple/temps.jpeg">



## Interpretations
### Geometric interpretation




### Probabilistic model




### Loss minimization

