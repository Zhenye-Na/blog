---
layout: post
title: "Build Convolutional Neural Network from scratch with Numpy on MNIST Dataset"
date: 2018-09-15
excerpt: "Build Convolutional Neural Network from scratch with Numpy on MNIST Dataset"
tags: [Machine Learning, Deep Learning]
mathjax: true
mathjax_autoNumber: true
---

> In this post, I will introduce how to implement a Convolutional Neural Network from scratch with Numpy and training on MNIST dataset. 
> 
> *This is originally HW2 of CS598: Deep Learning at UIUC.*
>
> If you have no access to the dataset or the full source code right now. Please be patient, I will make my repo "public" as soon as 2018 Fall semester ends.



# Build Convolutional Neural Network from scratch with Numpy on MNIST Dataset

In this post, when we're done we'll be able to achieve $ 97.7\% $ precision on the **MNIST dataset**. We will use **mini-batch Gradient Descent** to train and we will use another way to initialize our network's weights.


## Implementation

### Hyper-parameters


|   Hyper-parameters  	|    Description    	|
|:-------------------:	|:-----------------:	|
|      lr = 0.01      	|   learning rate   	|
|     epochs = 50     	|  epochs to train  	|
| minibatch_size = 64 	|  input batch size 	|
|    n_filter = 32    	| number of filters 	|
|     h_filter = 7    	|  height of filter 	|
|     w_filter = 7    	|  width of filter  	|
|      stride = 1     	|       stride      	|
|     padding = 1     	|      padding      	|


```python
parser = argparse.ArgumentParser()

# dataroot
parser.add_argument('--dataroot', type=str,
                    default="../MNISTdata.hdf5", help='path to dataset')

# hyperparameters setting
parser.add_argument('--lr', type=float, default=0.01, help='learning rate')
parser.add_argument('--epochs', type=int, default=50,
                    help='number of epochs to train')
parser.add_argument('--minibatch_size', type=int,
                    default=64, help='input batch size')


# filter parameters
parser.add_argument('--n_filter', type=int, default=32,
                    help='number of filters')
parser.add_argument('--h_filter', type=int, default=7,
                    help='height of filters')
parser.add_argument('--w_filter', type=int, default=7, help='width of filters')
parser.add_argument('--stride', type=int, default=1, help='stride')
parser.add_argument('--padding', type=int, default=1, help='zero padding')


# dataset parameters mnist_dims
parser.add_argument('--num_class', type=int, default=10,
                    help='number of classes in MNIST dataset')
parser.add_argument('--num_channel', type=int, default=1,
                    help='number of channels in MNIST dataset')
parser.add_argument('--img_height', type=int, default=28,
                    help='height of images in MNIST dataset')
parser.add_argument('--img_width', type=int, default=28,
                    help='width of images in MNIST dataset')


# parse the arguments
opt = parser.parse_args()
```


### Convolution


#### Forward pass


#### Back propagation




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
