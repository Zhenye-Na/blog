---
layout: post
title: "Deep Residual Neural Network for CIFAR100 with Pytorch"
date: 2018-10-07
excerpt: "Deep Residual Neural Network for CIFAR100 with Pytorch"
tags: [Machine Learning, Deep Learning, Python]
mathjax: true
mathjax_autoNumber: true
---

> Residual Network developed by Kaiming He et al. was the winner of ILSVRC 2015. It features special skip connections and a heavy use of batch normalization. The architecture is also missing fully connected layers at the end of the network. ResNets are currently by far state of the art Convolutional Neural Network models and are the default choice for using ConvNets in practice (as of May 10, 2016). In particular, also see more recent developments that tweak the original architecture from Kaiming He et al. In this post, I will introduce the architecture of ResNet (Residual Network) and the implementation of ResNet in Pytorch.  
> You can find source codes [here](https://github.com/Zhenye-Na/cs598/tree/master/assignments/mp4/src/part-1).


# Deep Residual Neural Network for CIFAR100 with Pytorch

## Dataset

CIFAR-100 is a image dataset with its classification labeled. It is widely used for easy image classification task/benchmark in research community.

### CIFAR-100 dataset

This dataset is just like the CIFAR-10, except it has $100$ classes containing $600$ images each. There are $500$ training images and $100$ testing images per class. The $100$ classes in the CIFAR-100 are grouped into $20$ superclasses. Each image comes with a "fine" label (the class to which it belongs) and a "coarse" label (the superclass to which it belongs).

To prepare CIFAR100 dataset in Pytorch is really simple. CIFAR100 dataset is integrated in `torchvision` and we should use `torch.utils.data.DataLoader`, this will make sure that your data is loaded in parallel.

```python
trainset = torchvision.datasets.CIFAR100(root=dataroot,
                                         train=True,
                                         download=True,
                                         transform=transform_train)
trainloader = torch.utils.data.DataLoader(
    trainset, batch_size=batch_size_train, shuffle=True, num_workers=4)

testset = torchvision.datasets.CIFAR100(root=dataroot,
                                        train=False,
                                        download=True,
                                        transform=transform_test)
testloader = torch.utils.data.DataLoader(
    testset, batch_size=batch_size_test, shuffle=False, num_workers=4)
```

## Deep Residual Network

Deep residual networks led to 1st-place winning entries in all five main tracks of the ImageNet and COCO 2015 competitions, which covered image classification, object detection, and semantic segmentation.

**Motivation**: What happens when we continue stacking deeper layers on a "plain" convolutional neural network?

<figure>
    <img src="https://github.com/Zhenye-Na/Zhenye-Na.github.io/blob/master/assets/images/posts-img/resnet/motivation.png?raw=true" width="80%" class="center">
    <figcaption>Figure 1: Training and testing on the same dataset with a 56-layer model and a 20-layer model.</figcaption>
</figure>



From the figure above, we can observe that 56-layer model performs worse on both training and test error. The deeper model performs worse, but it's not caused by overfitting.


**Hypothesis**: the problem is an optimization problem, deeper models are harder to
optimize.

As we know, the deeper model should be able to perform at least as well as the shallower model in common sense.

So the solution is that by construction, copy the learned layers from the shallower model and setting additional layers to identity mapping. ResNet uses network layers to fit a residual mapping instead of directly trying to fit a desired underlying mapping

We can denote each layer by $f(x)$. In a standard network $y = f(x)$. However, in a residual network, $y = f(x) + x$. We hypothesize that it is easier to optimize the residual mapping than to optimize the original, unreferenced mapping. To the extreme, if an identity mapping were optimal, it would be easier to push the residual to zero than to fit an identity mapping by a stack of nonlinear layers.

<figure>
    <img src="https://github.com/Zhenye-Na/Zhenye-Na.github.io/blob/master/assets/images/posts-img/resnet/resnet.png?raw=true" width="80%" class="center">
    <figcaption>Figure 2: ResNet architecture.</figcaption>
</figure>



### Full ResNet architecture

- Stack residual blocks
- Every residual block has two 3x3 conv layers
- Periodically, double # of filters and downsample spatially using stride 2(/2 in each dimension)
- Additional conv layer at the beginning
- No FC layers at the end (only FC 1000 to output classes)


### Training ResNet in practice

- Batch Normalization after every CONV layer
- Xavier 2/ initialization from He et al.
- SGD + Momentum (0.9)
- Learning rate: 0.1, divided by 10 when validation error plateaus
- Mini-batch size 256
- Weight decay of 1e-5
- No dropout used


## Implement a ResNet in Pytorch

### ResNet Architecture

<!--<figure>
    <img src="https://github.com/Zhenye-Na/Zhenye-Na.github.io/blob/master/assets/images/posts-img/resnet/explain.png?raw=true" width="80%" class="center">
    <figcaption>Figure 3: ResNet architecture in my own implementation.</figcaption>
</figure>-->

The figure above is the architecture I used in my own imlementation of ResNet. I have reached $62 \sim 63\%$ accuracy on CIFAR100 test set after training for 70 epochs.

### Hyper-parameters settings


|   Hyper-parameters   	|         Description        	|
|:--------------------:	|:--------------------------:	|
|        lr=0.01       	|        learning rate       	|
|     momentum=0.9     	|       momentum factor      	|
|   weight\_decay=1e-5  	|  weight decay (L2 penalty) 	|
|      epochs=500      	|  Number of epochs to train 	|
| batch\_size\_train=256 	| Batch size of training set 	|
|  batch\_size\_test=256 	|   Batch size of test set   	|


### Data Augmentation

We should use data augmentation techniques in the implementation. Thanks to Pytorch, data augmentation has been so simple and codes are as follows.

```python
# Normalize training set together with augmentation
transform_train = transforms.Compose([
    transforms.RandomCrop(32, padding=4),
    transforms.RandomHorizontalFlip(),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.507, 0.487, 0.441], std=[0.267, 0.256, 0.276])
])

# Normalize test set same as training set without augmentation
transform_test = transforms.Compose([
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.507, 0.487, 0.441], std=[0.267, 0.256, 0.276])
])
```

### ResNet model

Note: I have used different architecture in the ResNet. Please pay attention when you wanna use this pieces of codes.

#### Basic Block Class

```python
def conv3x3(in_channels, out_channels, stride=1):
    """3x3 kernel size with padding convolutional layer in ResNet BasicBlock."""
    return nn.Conv2d(
        in_channels=in_channels,
        out_channels=out_channels,
        kernel_size=3,
        stride=stride,
        padding=1,
        bias=False)


class BasicBlock(nn.Module):
    """Basic Block of ReseNet."""

    def __init__(self, in_channels, out_channels, stride=1, downsample=None):
        """Basic Block of ReseNet Builder."""
        super(BasicBlock, self).__init__()

        # First conv3x3 layer
        self.conv1 = conv3x3(in_channels, out_channels, stride)

        #  Batch Normalization
        self.bn1 = nn.BatchNorm2d(num_features=out_channels)

        # ReLU Activation Function
        self.relu = nn.ReLU(inplace=True)

        # Second conv3x3 layer
        self.conv2 = conv3x3(out_channels, out_channels)

        #  Batch Normalization
        self.bn2 = nn.BatchNorm2d(num_features=out_channels)

        # downsample for `residual`
        self.downsample = downsample
        self.stride = stride

    def forward(self, x):
        """Forward Pass of Basic Block."""
        residual = x

        out = self.conv1(x)
        out = self.bn1(out)
        out = self.relu(out)
        out = self.conv2(out)
        out = self.bn2(out)

        if self.downsample is not None:
            residual = self.downsample(x)

        out += residual
        return out
```


#### Residual Network Class

```python
class ResNet(nn.Module):
    """Residual Neural Network."""

    def __init__(self, block, duplicates, num_classes=100):
        """Residual Neural Network Builder."""
        super(ResNet, self).__init__()

        self.in_channels = 32
        self.conv1 = conv3x3(in_channels=3, out_channels=32)
        self.bn = nn.BatchNorm2d(num_features=32)
        self.relu = nn.ReLU(inplace=True)
        self.dropout = nn.Dropout2d(p=0.02)

        # block of Basic Blocks
        self.conv2_x = self._make_block(block, duplicates[0], out_channels=32)
        self.conv3_x = self._make_block(block, duplicates[1], out_channels=64, stride=2)
        self.conv4_x = self._make_block(block, duplicates[2], out_channels=128, stride=2)
        self.conv5_x = self._make_block(block, duplicates[3], out_channels=256, stride=2)

        self.maxpool = nn.MaxPool2d(kernel_size=4, stride=1)
        self.fc_layer = nn.Linear(256, num_classes)

        # initialize weights
        # self.apply(initialize_weights)
        for m in self.modules():
            if isinstance(m, nn.Conv2d):
                nn.init.kaiming_normal(m.weight.data, mode='fan_out')
            elif isinstance(m, nn.BatchNorm2d):
                m.weight.data.fill_(1)
                m.bias.data.zero_()
            elif isinstance(m, nn.Linear):
                m.bias.data.zero_()

    def _make_block(self, block, duplicates, out_channels, stride=1):
        """
        Create Block in ResNet.

        Args:
            block: BasicBlock
            duplicates: number of BasicBlock
            out_channels: out channels of the block

        Returns:
            nn.Sequential(*layers)
        """
        downsample = None
        if (stride != 1) or (self.in_channels != out_channels):
            downsample = nn.Sequential(
                conv3x3(self.in_channels, out_channels, stride=stride),
                nn.BatchNorm2d(num_features=out_channels)
            )

        layers = []
        layers.append(
            block(self.in_channels, out_channels, stride, downsample))
        self.in_channels = out_channels
        for _ in range(1, duplicates):
            layers.append(block(out_channels, out_channels))

        return nn.Sequential(*layers)

    def forward(self, x):
        """Forward pass of ResNet."""
        out = self.conv1(x)
        out = self.bn(out)
        out = self.relu(out)
        out = self.dropout(out)

        # Stacked Basic Blocks
        out = self.conv2_x(out)
        out = self.conv3_x(out)
        out = self.conv4_x(out)
        out = self.conv5_x(out)

        out = self.maxpool(out)
        out = out.view(out.size(0), -1)
        out = self.fc_layer(out)

        return out
```

For the source codes, you can refer to my Github repo which is [here](https://github.com/Zhenye-Na/cs598/tree/master/assignments/mp4).


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

[1] Kaiming He, Xiangyu Zhang, Shaoqing Ren, Jian Sun. [*"Deep Residual Learning for Image Recognition"*](https://arxiv.org/abs/1512.03385). arXiv:1512.03385  
[2] Kaiming He, Xiangyu Zhang, Shaoqing Ren, Jian Sun. [*"Identity Mappings in Deep Residual Networks"*](https://arxiv.org/abs/1603.05027). arXiv:1603.05027
[3] Pytorch torchvision.models [https://pytorch.org/docs/stable/torchvision/models.html](https://pytorch.org/docs/stable/torchvision/models.html)  
[4] Source code for [*torchvision.models.resnet*](https://pytorch.org/docs/0.4.0/_modules/torchvision/models/resnet.html)  




<style>
.center {
    display: block;
    margin-left: auto;
    margin-right: auto;
}
</style>
