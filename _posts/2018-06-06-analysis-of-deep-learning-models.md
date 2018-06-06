---
layout: post
title: "An Analysis of Deep Neural Network Models for Practical Applications"
date: 2018-06-06
excerpt: "Since the emergence of Deep Neural Networks (DNNs) as a prominent technique in the ﬁeld of computer vision, the ImageNet classification challenge has played a major role in advancing the state-of-the-art."
tags: [Deep Learning, Computer Vision]
mathjax: true
mathjax_autoNumber: true
---

> *This post aims to compare state-of-the-art DNN architectures, submitted for the ImageNet challenge, in terms of computational requirements and accuracy. Besides, I will breifly introduce the architecture mentioned in the paper: [*"An Analysis of Deep Neural Network Models for Practical Applications"*](https://arxiv.org/pdf/1605.07678.pdf).* ***This post is long-reading!***


*Let us start from introducing the architectures submitted for ILSVRC (ImageNet Large Scale Visual Recognition Challenge).*

## Introduction to Deep Learning Models

### LeNet-5

> [*Y. LeCun, L. Bottou, Y. Bengio and P. Haffner. "Gradient-Based Learning Applied to Document Recognition, Proceedings of the IEEE, 86(11): 2278-2324, November 1998"*](http://yann.lecun.com/exdb/publis/pdf/lecun-01a.pdf)


### AlexNet

> [*Alex Krizhevsky, Ilya Sutskever, Geoffrey E. Hinton"ImageNet Classification with Deep Convolutional Neural Networks"*](https://papers.nips.cc/paper/4824-imagenet-classification-with-deep-convolutional-neural-networks.pdf)


### ZFNet

> [*Matthew D. Zeiler, Rob Fergus"Visualizing and Understanding
Convolutional Networks"*](https://cs.nyu.edu/~fergus/papers/zeilerECCV2014.pdf)


### VGGNet

> [*Karen Simonyan, Andrew Zisserman"Very Deep Convolutional Networks for Large-Scale Image Recognition"arXiv preprint arXiv:1409.1556*](https://arxiv.org/pdf/1409.1556.pdf)



### GoogleNet

> [*Christian Szegedy, Wei Liu, Yangqing Jia, Pierre Sermanet, Scott Reed, Dragomir Anguelov, Dumitru Erhan, Vincent Vanhoucke, Andrew Rabinovich"Going Deeper with Convolutions" arXiv preprint arXiv:1409.4842*](https://arxiv.org/pdf/1409.4842.pdf)



### ResNet

> [*""*]()



### Others
#### Network in Network (NiN)

> [*""*]()


#### Identity Mappings in Deep Residual Networks (Improved ResNet)

> [*""*]()


#### Wide Residual Networks (Improved ResNet)

> [*""*]()




#### Aggregated Residual Transformations for Deep Neural Networks (ResNeXt)

> [*""*]()



#### Deep Networks with Stochastic Depth

> [*"Huang et al. 2016"*]()

- Motivation: reduce vanishing gradients and training time through short networks during training
- Randomly drop a subset of layers during each training pass
- Bypass with identity function
- Use full deep network at test time


#### FractalNet: Ultra-Deep Neural Networks without Residuals

> [*""*]()

- Argues that key is transitioning effectively from shallow to deep and residual representations are not necessary
- Fractal architecture with both shallow and deep paths to output
- Trained with dropping out sub-paths
- Full network at test time


#### Densely Connected Convolutional Networks

> [*""*]()

- Dense blocks where each layer is connected to every other layer in
feedforward fashion
- Alleviates vanishing gradient, strengthens feature propagation, encourages feature reuse


#### SqueezeNet: AlexNet-level Accuracy With 50x Fewer Parameters and <0.5Mb Model Size










## References

[1] Alfredo Canziani, Adam Paszke, Eugenio Culurciello. [*"An Analysis of Deep Neural Network Models for Practical Applications"*](https://arxiv.org/pdf/1605.07678.pdf). arXiv preprint arXiv:1605.07678 (2016).  
[2] Fei-Fei Li, Justin Johnson, Serena Yeung. [*"Lecture Slides of CS231n: Convolutional Neural Networks for Visual Recognition"*](http://cs231n.stanford.edu/slides/2017/cs231n_2017_lecture9.pdf). (2017).  
[3] Svetlana Lazebnik. [*"Lecture Slides of CS543: Computer Vision"*](http://slazebni.cs.illinois.edu/spring18/lec21_cnn.pdf). (2018).  
[4] Siddharth Das's post on Medium. [*"CNNs Architectures: LeNet, AlexNet, VGG, GoogLeNet, ResNet and more..."*](https://medium.com/@siddharthdas_32104/cnns-architectures-lenet-alexnet-vgg-googlenet-resnet-and-more-666091488df5). (2017).


<style>
.center {
    display: block;
    margin-left: auto;
    margin-right: auto;
}
</style>