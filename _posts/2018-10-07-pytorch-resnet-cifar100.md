---
layout: post
title: "Deep Residual Neural Network for CIFAR100 with Pytorch"
date: 2018-10-07
excerpt: "Deep Residual Neural Network for CIFAR100 with Pytorch"
tags: [Machine Learning, Deep Learning, Python]
mathjax: true
mathjax_autoNumber: true
---


# Deep Residual Neural Network for CIFAR100 with Pytorch

> You can find source codes [here](https://github.com/Zhenye-Na/cs598/tree/master/assignments/mp4/src/part-1)

## The CIFAR-100 dataset

This dataset is just like the CIFAR-10, except it has $100$ classes containing $600$ images each. There are $500$ training images and $100$ testing images per class. The $100$ classes in the CIFAR-100 are grouped into $20$ superclasses. Each image comes with a "fine" label (the class to which it belongs) and a "coarse" label (the superclass to which it belongs).


## Residual Network



## Implement a ResNet in Pytorch

### ResNet

### 


## Result

```
$ python3 main.py
==> Building new ResNet model ...
==> Initialize CUDA support for ResNet model ...
==> Data Augmentation ...
==> Preparing CIFAR100 dataset ...
Files already downloaded and verified
Files already downloaded and verified
==> Start training ...
Iteration: 1 | Loss: 4.104180923530033 | Training accuracy: 14.472% | Test accuracy: 14.85%
==> Saving model ...
Iteration: 2 | Loss: 3.4602092735621395 | Training accuracy: 21.066% | Test accuracy: 20.77%
Iteration: 3 | Loss: 3.1336532514922473 | Training accuracy: 26.2% | Test accuracy: 25.07%
Iteration: 4 | Loss: 2.880905361808076 | Training accuracy: 29.676% | Test accuracy: 28.47%
Iteration: 5 | Loss: 2.6510908907773545 | Training accuracy: 34.976% | Test accuracy: 32.88%
Iteration: 6 | Loss: 2.481336920845265 | Training accuracy: 37.614% | Test accuracy: 34.41%
Iteration: 7 | Loss: 2.319791035384548 | Training accuracy: 42.072% | Test accuracy: 38.09%
Iteration: 8 | Loss: 2.1693926453590393 | Training accuracy: 45.586% | Test accuracy: 41.59%
Iteration: 9 | Loss: 2.0416611147170163 | Training accuracy: 47.214% | Test accuracy: 43.04%
Iteration: 10 | Loss: 1.9338786614184478 | Training accuracy: 50.044% | Test accuracy: 45.35%
Iteration: 11 | Loss: 1.830668755331818 | Training accuracy: 52.016% | Test accuracy: 47.05%
Iteration: 12 | Loss: 1.7460169713107907 | Training accuracy: 55.38% | Test accuracy: 48.44%
Iteration: 13 | Loss: 1.6628405780208355 | Training accuracy: 56.55% | Test accuracy: 49.71%
Iteration: 14 | Loss: 1.5798143872192927 | Training accuracy: 57.216% | Test accuracy: 49.22%
Iteration: 15 | Loss: 1.5135374920708793 | Training accuracy: 59.196% | Test accuracy: 51.76%
Iteration: 16 | Loss: 1.4557876057770787 | Training accuracy: 60.756% | Test accuracy: 51.58%
Iteration: 17 | Loss: 1.397268416930218 | Training accuracy: 62.26% | Test accuracy: 53.51%
Iteration: 18 | Loss: 1.3465026586639637 | Training accuracy: 64.048% | Test accuracy: 53.08%
Iteration: 19 | Loss: 1.2904698045886294 | Training accuracy: 64.964% | Test accuracy: 54.2%
Iteration: 20 | Loss: 1.2304265331857058 | Training accuracy: 66.884% | Test accuracy: 55.15%
Iteration: 21 | Loss: 1.192518736026725 | Training accuracy: 68.66% | Test accuracy: 55.48%
Iteration: 22 | Loss: 1.1429028416774711 | Training accuracy: 67.996% | Test accuracy: 55.17%
Iteration: 23 | Loss: 1.0980666112534854 | Training accuracy: 69.424% | Test accuracy: 56.26%
Iteration: 24 | Loss: 1.057483225756762 | Training accuracy: 71.148% | Test accuracy: 57.85%
Iteration: 25 | Loss: 1.032663247719103 | Training accuracy: 71.622% | Test accuracy: 57.16%
Iteration: 26 | Loss: 0.9889624885150364 | Training accuracy: 72.68% | Test accuracy: 57.52%
Iteration: 27 | Loss: 0.9433630595401842 | Training accuracy: 73.674% | Test accuracy: 56.65%
Iteration: 28 | Loss: 0.9149068362858831 | Training accuracy: 74.494% | Test accuracy: 57.6%
Iteration: 29 | Loss: 0.8813325060265405 | Training accuracy: 74.864% | Test accuracy: 57.12%
Iteration: 30 | Loss: 0.8572023571753988 | Training accuracy: 77.112% | Test accuracy: 59.18%
Iteration: 31 | Loss: 0.8264880502710537 | Training accuracy: 76.842% | Test accuracy: 58.53%
Iteration: 32 | Loss: 0.7944095457086757 | Training accuracy: 78.034% | Test accuracy: 59.13%
Iteration: 33 | Loss: 0.7609095737642172 | Training accuracy: 78.102% | Test accuracy: 58.32%
Iteration: 34 | Loss: 0.730701387536769 | Training accuracy: 79.234% | Test accuracy: 59.07%
Iteration: 35 | Loss: 0.7049194653423465 | Training accuracy: 79.648% | Test accuracy: 58.29%
Iteration: 36 | Loss: 0.6780204106958545 | Training accuracy: 81.206% | Test accuracy: 60.43%
Iteration: 37 | Loss: 0.6612185776537779 | Training accuracy: 81.446% | Test accuracy: 59.32%
Iteration: 38 | Loss: 0.629750130736098 | Training accuracy: 82.106% | Test accuracy: 59.46%
Iteration: 39 | Loss: 0.6031098405317384 | Training accuracy: 83.31% | Test accuracy: 60.11%
Iteration: 40 | Loss: 0.5774347835353443 | Training accuracy: 83.256% | Test accuracy: 59.33%
Iteration: 41 | Loss: 0.564434007418399 | Training accuracy: 83.934% | Test accuracy: 59.97%
Iteration: 42 | Loss: 0.5355604668052829 | Training accuracy: 85.076% | Test accuracy: 60.77%
Iteration: 43 | Loss: 0.5126350830708232 | Training accuracy: 85.768% | Test accuracy: 59.78%
Iteration: 44 | Loss: 0.5005355355690937 | Training accuracy: 84.766% | Test accuracy: 58.71%
Iteration: 45 | Loss: 0.48476455406266816 | Training accuracy: 86.344% | Test accuracy: 60.54%
Iteration: 46 | Loss: 0.4556497615210864 | Training accuracy: 87.492% | Test accuracy: 61.03%
Iteration: 47 | Loss: 0.4387689603834736 | Training accuracy: 87.684% | Test accuracy: 60.64%
Iteration: 48 | Loss: 0.41509357033943645 | Training accuracy: 88.33% | Test accuracy: 61.16%
Iteration: 49 | Loss: 0.4069142019262119 | Training accuracy: 88.748% | Test accuracy: 61.1%
Iteration: 50 | Loss: 0.3926576251278118 | Training accuracy: 89.712% | Test accuracy: 61.49%
Iteration: 51 | Loss: 0.37341941132837414 | Training accuracy: 89.238% | Test accuracy: 61.19%
==> Saving model ...
Iteration: 52 | Loss: 0.3532286737950481 | Training accuracy: 90.372% | Test accuracy: 61.24%
Iteration: 53 | Loss: 0.3430648485616762 | Training accuracy: 90.106% | Test accuracy: 60.44%
Iteration: 54 | Loss: 0.32229845735187435 | Training accuracy: 90.802% | Test accuracy: 61.17%
Iteration: 55 | Loss: 0.3160853220187888 | Training accuracy: 91.03% | Test accuracy: 61.29%
Iteration: 56 | Loss: 0.30303438988571263 | Training accuracy: 91.784% | Test accuracy: 60.74%
Iteration: 57 | Loss: 0.28862097471648335 | Training accuracy: 91.85% | Test accuracy: 61.69%
Iteration: 58 | Loss: 0.27474444374746204 | Training accuracy: 92.214% | Test accuracy: 61.59%
Iteration: 59 | Loss: 0.26047237947279095 | Training accuracy: 92.97% | Test accuracy: 61.41%
Iteration: 60 | Loss: 0.2498370428018424 | Training accuracy: 92.774% | Test accuracy: 60.91%
Iteration: 61 | Loss: 0.24482293457401041 | Training accuracy: 93.09% | Test accuracy: 61.07%
Iteration: 62 | Loss: 0.24151663269315446 | Training accuracy: 93.188% | Test accuracy: 61.42%
Iteration: 63 | Loss: 0.2337216458910582 | Training accuracy: 93.858% | Test accuracy: 61.36%
Iteration: 64 | Loss: 0.2185495105020854 | Training accuracy: 94.138% | Test accuracy: 62.55%
Iteration: 65 | Loss: 0.21097918805115076 | Training accuracy: 94.15% | Test accuracy: 61.64%
Iteration: 66 | Loss: 0.1980812152733608 | Training accuracy: 94.666% | Test accuracy: 62.19%
Iteration: 67 | Loss: 0.19419803546399486 | Training accuracy: 94.804% | Test accuracy: 62.07%
Iteration: 68 | Loss: 0.18773984844435235 | Training accuracy: 95.182% | Test accuracy: 62.69%
Iteration: 69 | Loss: 0.17875460022110112 | Training accuracy: 95.026% | Test accuracy: 62.7%
Iteration: 70 | Loss: 0.16828414216181453 | Training accuracy: 95.162% | Test accuracy: 61.97%
```



## References

[1] Stanford CS231n: Convolutional Neural Networks for Visual Recognition, Lecture notes, [*"Convolutional Neural Networks (CNNs / ConvNets)"*](http://cs231n.github.io/convolutional-networks/)  
[2] Stanford CS231n: Convolutional Neural Networks for Visual Recognition, assignment instruction, [*"Assignment2 instructions"*](http://cs231n.github.io/assignments2018/assignment2/)  
[3] DeepNotes, [*"Convolution Layer - The core idea behind CNNs"*](https://deepnotes.io/convlayer)



<style>
.center {
    display: block;
    margin-left: auto;
    margin-right: auto;
}
</style>
