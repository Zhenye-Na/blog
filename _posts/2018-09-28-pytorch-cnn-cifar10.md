---
layout: post
title: "Deep Learning with Pytorch on CIFAR10 Dataset"
date: 2018-09-28
excerpt: "Deep Learning with Pytorch on CIFAR10 Dataset"
tags: [Machine Learning, Deep Learning]
mathjax: true
mathjax_autoNumber: true
---



# Deep Learning with Pytorch on CIFAR10 Dataset

> You can find source codes [here](https://github.com/Zhenye-Na/cs598/tree/master/assignments/mp3)

## The CIFAR-10 dataset

The CIFAR-10 dataset consists of 60000 $32 \times 32$ colour images in 10 classes, with 6000 images per class. There are 50000 training images and 10000 test images. 

The dataset is divided into five training batches and one test batch, each with 10000 images. The test batch contains exactly 1000 randomly-selected images from each class. The training batches contain the remaining images in random order, but some training batches may contain more images from one class than another. Between them, the training batches contain exactly 5000 images from each class. 

Here are the classes in the dataset, as well as 10 random images from each:


<img src="https://pytorch.org/tutorials/_images/cifar10.png">


## Trainig an Image Classifier in Pytorch

We will do the following steps in order:

- Load and normalizing the CIFAR10 training and test datasets using torchvision
- Define a Convolution Neural Network
- Define a loss function
- Add GPU and CUDA support
- Train the network on the training data
- Test the network on the test data


### Loading and normalizing CIFAR10

We will use `torchvision`, it's extremely easy to load CIFAR10.

```python
import torch
import torchvision
import torchvision.transforms as transforms
```

Then we will do Data Augmentation. Pytorch has built-in functions which can help us perform data augmentation.

**Note:** for test set, we only normalize the dataset, without data augmentation!

```python
transform_train = transforms.Compose([
    transforms.RandomCrop(32, padding=4),
    transforms.RandomHorizontalFlip(),
    transforms.ToTensor(),
    transforms.Normalize((0.4914, 0.4822, 0.4465), (0.2023, 0.1994, 0.2010)),
])

# Normalize the test set same as training set without augmentation
transform_test = transforms.Compose([
    transforms.ToTensor(),
    transforms.Normalize((0.4914, 0.4822, 0.4465), (0.2023, 0.1994, 0.2010)),
])
```

The next step is to load dataset

```python
trainset    = torchvision.datasets.CIFAR10(root=opt.dataroot, train=True, download=True, transform=transform_train)
trainloader = torch.utils.data.DataLoader(trainset, batch_size=opt.batch_size_train, shuffle=True, num_workers=2)

testset     = torchvision.datasets.CIFAR10(root=opt.dataroot, train=False, download=True, transform=transform_test)
testloader  = torch.utils.data.DataLoader(testset, batch_size=opt.batch_size_test, shuffle=False, num_workers=2)

classes = ('plane', 'car', 'bird', 'cat', 'deer', 'dog', 'frog', 'horse', 'ship', 'truck')
```


### Define a Convolution Neural Network

Then we define out CNN model here.

```python
import torch
import torch.nn as nn


class CNN(nn.Module):
    """CNN."""

    def __init__(self):
        """CNN Builder."""
        super(CNN, self).__init__()

        self.conv_layer = nn.Sequential(

            # Conv Layer block 1
            nn.Conv2d(in_channels=3, out_channels=32, kernel_size=3, padding=1),
            nn.BatchNorm2d(32),
            nn.ReLU(inplace=True),
            nn.Conv2d(in_channels=32, out_channels=64, kernel_size=3, padding=1),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(kernel_size=2, stride=2),

            # Conv Layer block 2
            nn.Conv2d(in_channels=64, out_channels=128, kernel_size=3, padding=1),
            nn.BatchNorm2d(128),
            nn.ReLU(inplace=True),
            nn.Conv2d(in_channels=128, out_channels=128, kernel_size=3, padding=1),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(kernel_size=2, stride=2),
            nn.Dropout2d(p=0.05),

            # Conv Layer block 3
            nn.Conv2d(in_channels=128, out_channels=256, kernel_size=3, padding=1),
            nn.BatchNorm2d(256),
            nn.ReLU(inplace=True),
            nn.Conv2d(in_channels=256, out_channels=256, kernel_size=3, padding=1),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(kernel_size=2, stride=2),
        )


        self.fc_layer = nn.Sequential(
            nn.Dropout(p=0.1),
            nn.Linear(4096, 1024),
            nn.ReLU(inplace=True),
            nn.Linear(1024, 512),
            nn.ReLU(inplace=True),
            nn.Dropout(p=0.1),
            nn.Linear(512, 10)
        )


    def forward(self, x):
        """Perform forward."""
        
        # conv layers
        x = self.conv_layer(x)
        
        # flatten
        x = x.view(x.size(0), -1)
        
        # fc layer
        x = self.fc_layer(x)

        return x
```


### Define a Loss function and optimizer

Let's use a Classification Cross-Entropy loss and Adam optimizer.

```python
criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(net.parameters(), lr=opt.lr, weight_decay=opt.wd)
```


### Add GPU and CUDA support

This `.cuda()` function is very useful when you have a GPU.

```python
if opt.is_gpu:
    net = net.cuda()
    net = torch.nn.DataParallel(net, device_ids=range(torch.cuda.device_count()))
    cudnn.benchmark = True
```



### Train the network

```python
for epoch in range(start_epoch, opt.epochs + start_epoch):

    running_loss = 0.0
    for i, data in enumerate(trainloader, 0):
        # get the inputs
        inputs, labels = data

        if opt.is_gpu:
            inputs = inputs.cuda()
            labels = labels.cuda()

        # wrap them in Variable
        inputs, labels = Variable(inputs), Variable(labels)

        # zero the parameter gradients
        optimizer.zero_grad()

        # forward + backward + optimize
        outputs = net(inputs)
        loss = criterion(outputs, labels)
        loss.backward()

        if epoch > 16:
            for group in optimizer.param_groups:
                for p in group['params']:
                    state = optimizer.state[p]
                    if state['step'] >= 1024:
                        state['step'] = 1000
        optimizer.step()


        # print statistics
        running_loss += loss.data[0]

    # Normalizing the loss by the total number of train batches
    running_loss /= len(trainloader)

    # Calculate training/test set accuracy of the existing model
    train_accuracy = calculate_accuracy(trainloader, opt.is_gpu)
    test_accuracy = calculate_accuracy(testloader, opt.is_gpu)

    print("Iteration: {0} | Loss: {1} | Training accuracy: {2}% | Test accuracy: {3}%".format(epoch+1, running_loss, train_accuracy, test_accuracy))

    # save model
    if epoch % 50 == 0:
        print('==> Saving model ...')
        state = {
            'net': net.module if opt.is_gpu else net,
            'epoch': epoch,
        }
        if not os.path.isdir('checkpoint'):
            os.mkdir('checkpoint')
        torch.save(state, '../checkpoint/ckpt.t7')

print('==> Finished Training ...')
```

## Result

```
$ python3 main.py
==> Data Augmentation ...
==> Preparing CIFAR10 dataset ...
Files already downloaded and verified
Files already downloaded and verified
==> Initialize CNN model ...
==> Building new CNN model ...
==> Start training ...
Iteration: 1 | Loss: 1.5150132923175001 | Training accuracy: 56.916% | Test accuracy: 55.62%
==> Saving model ...
Iteration: 2 | Loss: 1.0681475259154045 | Training accuracy: 65.806% | Test accuracy: 65.71%
Iteration: 3 | Loss: 0.8781394674954817 | Training accuracy: 72.002% | Test accuracy: 68.09%
Iteration: 4 | Loss: 0.7657369798254174 | Training accuracy: 75.442% | Test accuracy: 74.27%
Iteration: 5 | Loss: 0.6928338831495446 | Training accuracy: 78.476% | Test accuracy: 77.28%
Iteration: 6 | Loss: 0.6400617288658991 | Training accuracy: 79.514% | Test accuracy: 77.55%
Iteration: 7 | Loss: 0.5916749586534622 | Training accuracy: 80.572% | Test accuracy: 78.0%
Iteration: 8 | Loss: 0.5629336702091919 | Training accuracy: 81.942% | Test accuracy: 79.65%
Iteration: 9 | Loss: 0.534895096136176 | Training accuracy: 82.888% | Test accuracy: 80.74%
Iteration: 10 | Loss: 0.5094442191483725 | Training accuracy: 84.09% | Test accuracy: 81.1%
Iteration: 11 | Loss: 0.4911502740724617 | Training accuracy: 84.454% | Test accuracy: 80.49%
Iteration: 12 | Loss: 0.47165061491529653 | Training accuracy: 84.668% | Test accuracy: 81.35%
Iteration: 13 | Loss: 0.45937477761064954 | Training accuracy: 85.416% | Test accuracy: 81.92%
Iteration: 14 | Loss: 0.44968167156971933 | Training accuracy: 84.942% | Test accuracy: 81.6%
Iteration: 15 | Loss: 0.43403286450659223 | Training accuracy: 86.026% | Test accuracy: 81.17%
Iteration: 16 | Loss: 0.4290188334863204 | Training accuracy: 86.078% | Test accuracy: 81.39%
Iteration: 17 | Loss: 0.41906910223881605 | Training accuracy: 86.942% | Test accuracy: 83.0%
Iteration: 18 | Loss: 0.3833522180004803 | Training accuracy: 87.782% | Test accuracy: 83.78%
Iteration: 19 | Loss: 0.36290439978584915 | Training accuracy: 87.938% | Test accuracy: 83.99%
Iteration: 20 | Loss: 0.3600675714061693 | Training accuracy: 88.308% | Test accuracy: 83.61%
Iteration: 21 | Loss: 0.35304753722437204 | Training accuracy: 88.604% | Test accuracy: 83.65%
Iteration: 22 | Loss: 0.35058872626565607 | Training accuracy: 88.724% | Test accuracy: 83.7%
Iteration: 23 | Loss: 0.34309560704566633 | Training accuracy: 88.334% | Test accuracy: 83.85%
Iteration: 24 | Loss: 0.3361902222075426 | Training accuracy: 89.46% | Test accuracy: 84.2%
Iteration: 25 | Loss: 0.3339634421460159 | Training accuracy: 88.41% | Test accuracy: 83.24%
Iteration: 26 | Loss: 0.32874407811695355 | Training accuracy: 89.402% | Test accuracy: 84.45%
Iteration: 27 | Loss: 0.3276860989496836 | Training accuracy: 89.31% | Test accuracy: 84.01%
Iteration: 28 | Loss: 0.32246214124705175 | Training accuracy: 89.548% | Test accuracy: 83.81%
Iteration: 29 | Loss: 0.3193482501656198 | Training accuracy: 90.224% | Test accuracy: 84.62%
Iteration: 30 | Loss: 0.3137577373886962 | Training accuracy: 89.948% | Test accuracy: 84.03%
Iteration: 31 | Loss: 0.3102418626741985 | Training accuracy: 89.98% | Test accuracy: 84.64%
Iteration: 32 | Loss: 0.30676858275747665 | Training accuracy: 89.834% | Test accuracy: 84.36%
Iteration: 33 | Loss: 0.3054589622694513 | Training accuracy: 90.044% | Test accuracy: 84.58%
Iteration: 34 | Loss: 0.30346839354776056 | Training accuracy: 89.932% | Test accuracy: 83.74%
Iteration: 35 | Loss: 0.30111074965933093 | Training accuracy: 90.748% | Test accuracy: 85.13%
Iteration: 36 | Loss: 0.2959785862347049 | Training accuracy: 90.24% | Test accuracy: 83.49%
Iteration: 37 | Loss: 0.2921854796083382 | Training accuracy: 90.958% | Test accuracy: 85.63%
Iteration: 38 | Loss: 0.29025346581893197 | Training accuracy: 91.074% | Test accuracy: 85.14%
Iteration: 39 | Loss: 0.29113843897953057 | Training accuracy: 90.886% | Test accuracy: 85.32%
Iteration: 40 | Loss: 0.28360521976295333 | Training accuracy: 90.016% | Test accuracy: 84.31%
Iteration: 41 | Loss: 0.28354978530913055 | Training accuracy: 90.644% | Test accuracy: 85.01%
Iteration: 42 | Loss: 0.2766315230094563 | Training accuracy: 91.252% | Test accuracy: 85.22%
Iteration: 43 | Loss: 0.2846868697868284 | Training accuracy: 91.206% | Test accuracy: 85.06%
Iteration: 44 | Loss: 0.2699394336403788 | Training accuracy: 91.408% | Test accuracy: 85.33%
Iteration: 45 | Loss: 0.28177465668038637 | Training accuracy: 91.906% | Test accuracy: 85.76%
Iteration: 46 | Loss: 0.2756738036375521 | Training accuracy: 91.722% | Test accuracy: 85.32%
Iteration: 47 | Loss: 0.27103444339369265 | Training accuracy: 90.7% | Test accuracy: 84.69%
Iteration: 48 | Loss: 0.26857548944480586 | Training accuracy: 90.816% | Test accuracy: 84.79%
Iteration: 49 | Loss: 0.2688227419734306 | Training accuracy: 91.46% | Test accuracy: 84.27%
Iteration: 50 | Loss: 0.2649988779402755 | Training accuracy: 91.822% | Test accuracy: 85.09%
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
