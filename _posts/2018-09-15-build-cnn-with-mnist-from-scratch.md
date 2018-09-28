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

In this post, when we're done we'll be able to achieve $ 97.7\% $ accuracy on the **MNIST dataset**. We will use **mini-batch Gradient Descent** to train.

## Convolutional Neural Networks (CNNs / ConvNets)

Convolutional Neural Networks are very similar to ordinary Neural Networks: they are made up of neurons that have **learnable weights and biases**. Each neuron receives some inputs, performs a dot product and optionally follows it with a non-linearity. The whole network still expresses a single differentiable score function: from the raw image pixels on one end to class scores at the other. And they still have a loss function (e.g. SVM/Softmax) on the last (fully-connected) layer and all the tips/tricks we developed for learning regular Neural Networks still apply.

So what does change? ConvNet architectures make the explicit assumption that the **inputs are images**, which allows us to encode certain properties into the architecture. **These then make the forward function more efficient to implement and vastly reduce the amount of parameters in the network**.


| ![](http://cs231n.github.io/assets/nn1/neural_net2.jpeg) 	| ![](http://cs231n.github.io/assets/cnn/cnn.jpeg) 	|
|:--------------------------------------------------------:	|:------------------------------------------------:	|


> Left: A regular 3-layer Neural Network. Right: A ConvNet arranges its neurons in three dimensions (width, height, depth), as visualized in one of the layers. Every layer of a ConvNet transforms the 3D input volume to a 3D output volume of neuron activations. In this example, the red input layer holds the image, so its width and height would be the dimensions of the image, and the depth would be 3 (Red, Green, Blue channels).


- The convolutional layer takes an input volume of:
    - Number of input $N$
    - The depth of input $C$
    - Height of the input $H$
    - Width of the input $W$
- These hyperparameters control the size of output volume:
    - Number of filters $K$
    - Spatial Extent $F$
    - Stride length $S$
    - Zero Padding $P$
- The spatial size of output is given by 
    - $(H-F+2P)/S+1 \times (W-F+2P)/S+1 $


**Note:** When $S=1$, $P=(F−1)/2$ preserves the input volume size.



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
