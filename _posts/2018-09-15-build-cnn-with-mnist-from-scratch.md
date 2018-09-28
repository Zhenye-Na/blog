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


### Convolution Layers


#### Forward Propagation

Convolutional layer replaces the matrix multiplication with convolution operation. To compute the pre non linearity for $i,j^{th}$ neuron on $l$ layer, we have:

$$ \begin{align}
Z_{ij}^{l} &= \sum_{a=0}^{m-1}\sum_{b=0}^{m-1}W_{ab}a_{(i+a)(j+b)}^{l-1}
\end{align} $$

Naively, for doing our convolutional operation we loop over each image, over each channel and take a dot product at each $F \times F$ location for each of our filters. For the sake of efficiency and computational simplicity, what we need to do is gather all the locations that we need to do the convolution operations and get the dot product at each of these locations. Lets examine this with a simple example.

Suppose we have a single image of size $1 \times 1 \times 4 \times 4$ and a single filter $ 1 \times 1 \times 2 \times 2$ and are using $S=1$ and $P=1$. After padding the shape of our image is $1 \times 1 \times 6 \times 6$.


<!--$$ \begin{align}
X_{pad} = 
\begin{bmatrix}
0 & 0 & 0 & 0 & 0 & 0\\
0 & 0 & 1 & 2 & 3  & 0\\
0 &4 & 5 & 6 & 7 & 0\\
0 &8 & 9 & 10 & 11 & 0\\
0 & 12 & 13 & 14 & 15 & 0\\
0 & 0 & 0 & 0 & 0 & 0\\
\end{bmatrix}
_{6\times 6}
\end{align} $$-->


Now we have $4−2/1+1=5$ locations along both width and height, so $25$ possible locations to do our convolution. Locations for top edges are


<!--$$ \begin{align}
X_0 =
\begin{bmatrix}
0&0\\
0&0\\
\end{bmatrix}
_{2\times 2}
X_1 =
\begin{bmatrix}
0&0\\
0&1\\
\end{bmatrix}
_{2\times 2}
X_2 =
\begin{bmatrix}
0&0\\
1&2\\
\end{bmatrix}
_{2\times 2}
X_3 =
\begin{bmatrix}
0&0\\
3&0\\
\end{bmatrix}
_{2\times 2}
\end{align} $$-->



For all the 25 locations we have a $1\times 2 \times 2$ filter, which we stretch out to $4 \times 1$ column vector. Thus we have $25$ of these column vectors, or $4 \times 25$ matrix of all the stretched out receptive fields.



<!--$$ \begin{align}
X_{col} = 
\begin{bmatrix}
0&0&0&0&0&0&0&1&2&3&0&4&5&6&7&0&8&9&10&11&0&12&13&14&15\\
0&0&0&0&0&0&1&2&3&0&4&5&6&7&0&8&9&10&11&0&12&13&14&15&0\\
0&0&1&2&3&0&4&5&6&7&0&8&9&10&11&0&12&13&14&15&0&0&0&0&0\\
0&1&2&3&0&4&5&6&7&0&8&9&10&11&0&12&13&14&15&0&0&0&0&0&0\\
\end{bmatrix}
_{4\times 25}
\end{align} $$
-->



#### Backward Propagation

We know the output error for the current layer $\partial out$ which in our case is $\frac{\partial C}{\partial Z^l_{ij}}$ as our layer is only computing pre non linearity output $Z$ . We need to find the gradient $\frac{\partial C}{\partial W_{ab}^{l}}$ for each weight .


<!--$$ \frac{\partial C}{\partial W_{ab}^{l}} = \sum_{i=0}^{N-m}\sum_{j=0}^{N-m} \frac {\partial C}{\partial Z_{ij^{l}}} \times \frac {\partial Z_{ij}^{l}}{\partial W_{ab^{l}}} \\
 = \sum_{i=0}^{N-m}\sum_{j=0}^{N-m} \frac {\partial C}{\partial Z_{ij^{l}}} \times a^{l-1}_{(i+a)(j+b)} $$
-->


Notice that $\frac {\partial Z_{ij}^{l}}{\partial W_{ab^{l}}} = a^{l-1}_{(i+a)(j+b)}$ is from the forward propagation above, where $a^{l-1}$ is the output of the previous layer and input to our current layer.


```python
# from 5x10x10x10 to 10x10x10x5 and 10x500
dout_flat = dout.transpose(1,2,3,0).reshape(n_filter,-1)

# calculate dot product 10x500 . 500x27 = 10x27
dW = np.dot(dout_flat,X_col.T)

# reshape back to 10x3x3x3
dW = dW.reshape(W.shape)
```

For bias gradient, we simply accumulate the gradient as with backpropagation for fully connected layers. So,


$$ \frac{ \partial C}{\partial b^l} = \sum_{i=0}^{N-m}\sum_{j=0}^{N-m} \frac{\partial C}{\partial Z_{ij}^{l}} $$


```python
db = np.sum(dout,axis=(0,2,3))
db = db.reshape(n_filter,-1)
```

Now to backpropagate the errors back to the previous layer, we need to compute the input gradient $\partial X$ which in our case is $\frac{\partial C}{\partial a^{l-1}_{ij}}$.


$$\frac{\partial C}{\partial a_{ij}^{l-1}} = \sum_{a=0}^{m-1}\sum_{b=0}^{m-1} \frac{\partial C}{\partial Z_{(i-a)(j-b)}}\times \frac{\partial Z^l_{(i-a)(j-b)}}{\partial a_{ij}^{l-1}} \\
 = \sum_{a=0}^{m-1}\sum_{b=0}^{m-1} \frac{\partial C}{\partial Z_{(i-a)(j-b)}}\times W_{ab}$$



Notice this looks similar to our convolution operation from forward propagation step but instead of $Z_{(i+a)(j+b)}$ we have $Z_{(i-a)(j-b)}$, which is simply a convolution using $W$ which has been flipped along both the axes.


```python
# from 10x3x3x3 to 10x9
W_flat = W.reshape(n_filter,-1)

# dot product 9x10 . 10x500 = 9x500
dX_col = np.dot(W_flat.T,dout_flat)

# get the gradients for real image from the stretched image.
# from the stretched out image to real image i.e. 9x500 to 5x3x10x10
dX = col2im_indices(dX_col,X.shape,h_filter,w_filter,padding,stride)
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
