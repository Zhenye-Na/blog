---
layout: post
title:  "Viola Jones Face Detection"
date:   2018-05-10
modify_date: 2018-06-18
excerpt: "Viola Jones object detection framework is the first object detection framework to provide competitive object detection rates in real-time"
tags: [Computer Vision, Face Detection, Viola Jones]
mathjax: true
mathjax_autoNumber: true
---

> *The Viola Jones object detection framework is the first object detection framework to provide competitive object detection rates in real-time proposed in 2001 by Paul Viola and Michael Jones. Although it can be trained to detect a variety of object classes, it was motivated primarily by the problem of face detection. In this project, I implemented Viola Jones Face Detection algorithm and I will explain the detail in the algorithm.*


## Algorithm Overview

The figure below is the diagram of Viola Jones Face Detection. This is the high level pipeline of our implementation. We first computed integral image of all the training and test image. Then we used AdaBoost algorithm to select best weak classifiers.


<img src="https://github.com/Zhenye-Na/Zhenye-Na.github.io/blob/master/assets/images/projs-img/violaj/violaj1.png?raw=true" width="20%" class="center">


## Dataset

For the dataset used in Face Detection, `LFW` dataset (positive examples) `CIFAR10` dataset (negative examples) are still used for training and testing. However, due to the training time, I only use 155 images (85 faces and 70 non-faces) for training and 105 images (60 faces and 45 non-faces) for testing at first. We will improve the codes (reduce number of loops, add CUDA support to this and etc..), then use larger number of images to train and test.


## Data Preprocessing

We implemented several preprocessing method (function). First we rescale all the image to $(32 \times 32)$ to keep all the images in the same scale. Then we implemented several alternative method for preprocessing. For example, transform from RGB to HSV to gray-scale and so on. For more detailed information, [this](https://github.com/Zhenye-Na/Piface/blob/master/detection/utils/data_tools.py) is the code for data processing.


## Integral image

This is first part to be implemented in Face Detection algorithm. This is done by making each pixel equal to the entire sum of all pixels above and to the left of the concerned pixel,

$$ ii(x, y) = \sum \limits_{x' \leq x, y' \leq y} i(x', y'). $$    

The reason why we need integral image is that in the next step (generating Haar-Like Features), we will try to subtract two regions to get the 'delta' of the particular features in particular size. It will reach high computational complexity. However, with integral image, we can simplify to an $O(1)$ problem.


The sum of pixels in rectangle ABCD can be calculated with only four values from integral image:


$$\sum \limits_{(x,y) \in ABCD} i(x, y) = ii(D) + ii(A) - ii(B) - ii(C).$$

<img src="https://github.com/Zhenye-Na/Zhenye-Na.github.io/blob/master/assets/images/projs-img/violaj/violaj2.png?raw=true" width="80%" class="center">

For this function, it is already available in [skimage](http://scikit-image.org/docs/dev/api/skimage.html). So we heavily used [integral_image](http://github.com/scikit-image/scikit-image/blob/master/skimage/transform/integral.py#L7) function and [integrate](http://github.com/scikit-image/scikit-image/blob/master/skimage/transform/integral.py#L39) function for this project.


## Haar-like Features

As figure below shows, there are several types of features in Viola Jones Face Detection. In our case, we implemented the first five type of features in a HaarFeature class. Each feature results in a single value which is calculated by subtracting the sum of the white rectangle(s) from the sum of the black rectangle(s) in integral image computed in previous section.


<img src="https://github.com/Zhenye-Na/Zhenye-Na.github.io/blob/master/assets/images/projs-img/violaj/violaj3.jpg?raw=true" width="80%" class="center">

Viola-Jones have empirically found that a detector with a base resolution of $24 \times 24$ pixels gives satisfactory results. So we restrict our feature size to be in range(20, 30) in order to get a better accuracy for testing.


## Adaboost

Given a feature set and a training set of positive and negative
images, any number of machine learning approaches could be used to learn a classification function. The algorithm uses a modified AdaBoost to both select a small set of features and train the classifier. A single AdaBoost classifier consists of a weighted sum of many weak classifiers, where each weak classifier is a threshold on a single Haarlike rectangular feature. The weight associated with a given sample is adjusted based on whether or not the weak classifier correctly classifies the sample. Figure below is the modified version of the AdaBoost algorithm.


<img src="https://github.com/Zhenye-Na/Zhenye-Na.github.io/blob/master/assets/images/projs-img/violaj/violaj4.png?raw=true" width="80%" class="center">

During experimentation, we tried with different number of weak classifiers and got a not bad accuracy with 15 classifiers. It does not improve the accuracy if we increase the number of weak classifiers. This may be resulted from low accuracy of the other classifiers (selected only because it is higher than the others, but accuracy is still lower than previous).


## Implementation

The most important two function/class are pasted here, for more details in implementation, please refer to my [**Github repository**](https://github.com/Zhenye-Na/Piface/tree/master/detection)

- Haar-like features

```python
class HaarFeature(object):
    """Haar-Like Features model."""

    def __init__(self, feature_type, position, width, height, threshold, polarity):
        """Initialize a Haar-Like Feature.
        Args:
            position (int, int): Top left corner where the feature begins (x,y)
            width (int): Width of the feature
            height (int): Height of the feature
            threshold (float): Feature threshold
            polarity (int): polarity of the feature -1 or 1
            feature_type (string): Type of features in reference.
                - 'type-2-y': 2 rectangles varying along the y axis; @ Type1
                - 'type-2-x': 2 rectangles varying along the x axis; @ Type2
                - 'type-3-y': 3 rectangles varying along the y axis; @ Type3
                - 'type-3-x': 3 rectangles varying along the x axis; @ Type4
                - 'type-4': 4 rectangles varying along x and y axis. @ Type5
                By default all features are extracted.
        References
        ----------
        .. [1] O. H. Jensen, "Implementing the Viola-Jones Face Detection Algorithm"
            https://github.com/Zhenye-Na/viola-jones-face-detection/blob/master/docs/Implementing%20the%20Viola-Jones%20Face%20Detection%20Algorithm.pdf
        """
```


- Adaboost algorithm

```python
def AdaBoost(images, labels, num_pos, num_neg, feature_size=0):
    """Perform Adaboost Algorithm in Viola Jones Face Detection.
    Select a set of classifiers using Boosting algorithm.
    Iteratively takes the best classifiers based on a weighted error.
    Algorithm:
        1. Normalize the weights so that w_{i,l} is a probability distribution
        2. For each feature j, train a classifier h_j which is restricted to
           using a single feature.
        3. Choose the best weak classifier with lowest error.
        4. Update the weights.
    Args:
        images (np.ndarray): Integral images include positive images
            and negative images.
        labels (np.ndarray): graound truth labels
        num_pos (int): number of positive image samples
        num_neg (int): number of negative image samples
        feature_size (int): size of features.
    Returns:
        classifiers (list): list of weak classifiers
    """
```



## Result

```
[*] Loading training set...
[*] Loading training set successfully!
[*] 85 faces loaded! 70 non-faces loaded!
[*] Generating features...
[*] Getting votes...
[*] Got 0 votes now!
[*] Got 5 votes now!
[*] Got 10 votes now!
.
.
.
.
.
.
[*] Got 135 votes now!
[*] Got 140 votes now!
[*] Got 145 votes now!
[*] Got 150 votes now!
[*] Generated 2912 features!
[*] Selecting 15 classifiers...
[*] Slected 0 classifiers now!
[*] Slected 5 classifiers now!
[*] Slected 10 classifiers now!
[*] Loading test set...
[*] Loading test set successfully!
[*] 60 faces loaded! 45 non-faces loaded!
[*] Start testing...
[*] Test done!
Faces [32 / 60] accuracy: 0.5333333333333333
Objects [23 / 45] accuracy: 0.5333333333333333
```

> *If you notice mistakes and errors in this post, please don't hesitate to leave a comment and I would be super happy to correct them right away!*



## References

[1] K. Lyngby. [*"Implementing the Viola-Jones Face Detection Algorithm"*](https://pdfs.semanticscholar.org/40b1/0e330a5511a6a45f42c8b86da222504c717f.pdf). (2008).



<style>
.center {
    display: block;
    margin-left: auto;
    margin-right: auto;
}
</style>