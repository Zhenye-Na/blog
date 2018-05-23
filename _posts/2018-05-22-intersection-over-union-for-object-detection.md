---
layout: post
title: "Intersection over Union (IoU) for Object Detection"
date: 2018-05-22
excerpt: "Intersection over Union is an evaluation metric used to measure the accuracy of an object detector "
tags: [IoU, Object Detection]
mathjax: true
mathjax_autoNumber: true
---

> *Intersection over Union is an evaluation metric used to measure the accuracy of an object detector on a particular dataset. In this post, I would like to introduce IoU and how to implement IoU in details.*


## What is Intersection over Union

Intersection over Union is an evaluation metric used to measure the accuracy of an object detector on a particular dataset. More formally, in order to apply Intersection over Union to evaluate an (arbitrary) object detector we need:

- The ground-truth bounding boxes (i.e., the hand labeled bounding boxes from the testing set that specify where in the image our object is).
- The predicted bounding boxes from our model.

<figure>
    <img src="https://www.pyimagesearch.com/wp-content/uploads/2016/09/iou_stop_sign.jpg" width="60%" class="center">
    <figcaption>Figure 1: Illustration of Intersection over Union. The predicted bounding box is drawn in red while the ground-truth bounding box is drawn in green. Our goal is to compute the Intersection of Union between these bounding box. (Image Source: <a href="https://www.pyimagesearch.com/2016/11/07/intersection-over-union-iou-for-object-detection/" target="_blank"><em>Intersection over Union (IoU) for object detection</em></a>)</figcaption>
</figure>


## How to compute IoU?

<figure>
    <img src="https://www.pyimagesearch.com/wp-content/uploads/2016/09/iou_equation.png" width="60%" class="center">
    <figcaption>Figure 2: Computing the Intersection of Union is as simple as dividing the area of overlap between the bounding boxes by the area of union. (Image Source: <a href="https://www.pyimagesearch.com/2016/11/07/intersection-over-union-iou-for-object-detection/" target="_blank"><em>Intersection over Union (IoU) for object detection</em></a>)</figcaption>
</figure>

In the numerator we compute the area of overlap between the predicted bounding box and the ground-truth bounding box. The denominator is the area of union, or more simply, the area encompassed by both the predicted bounding box and the ground-truth bounding box.

$$ \text{IoU} = \frac{\text{Area of Overlap}}{\text{Area of Union}} $$


## Implementation

```python
# import the necessary packages
from collections import namedtuple
import numpy as np
import cv2

# define the `Detection` object
Detection = namedtuple("Detection", ["image_path", "gt", "pred"])

def bb_intersection_over_union(boxA, boxB):
    # determine the (x, y)-coordinates of the intersection rectangle
    xA = max(boxA[0], boxB[0])
    yA = max(boxA[1], boxB[1])
    xB = min(boxA[2], boxB[2])
    yB = min(boxA[3], boxB[3])

    # compute the area of intersection rectangle
    interArea = (xB - xA) * (yB - yA)

    # compute the area of both the prediction and ground-truth
    # rectangles
    boxAArea = (boxA[2] - boxA[0]) * (boxA[3] - boxA[1])
    boxBArea = (boxB[2] - boxB[0]) * (boxB[3] - boxB[1])

    # compute the intersection over union by taking the intersection
    # area and dividing it by the sum of prediction + ground-truth
    # areas - the interesection area
    iou = interArea / float(boxAArea + boxBArea - interArea)

    # return the intersection over union value
    return iou
```


## Quiz

<figure>
    <img src="https://github.com/Zhenye-Na/Zhenye-Na.github.io/blob/master/assets/images/posts-img/iou/iou1.png?raw=true" width="40%" class="center">
</figure>

For the predicted and ground truth detector boxes shown above (with their pixel coordinates), which of the following is correct:

A. IoU = 1/3  
B. IoU = 9/20  
C. IoU = 9/16  
**D. IoU = 1/10**

Solution: IoU = 800/8000 = 1/10


## References
[1] Adrian Rosebrock. [*"Intersection over Union (IoU) for object detection"*](https://www.pyimagesearch.com/2016/11/07/intersection-over-union-iou-for-object-detection/). (2016).  
[2] Stack Overflow [*"Intersection-over-Union between two detections"*](https://stackoverflow.com/questions/28723670/intersection-over-union-between-two-detections).  


<style>
.center {
    display: block;
    margin-left: auto;
    margin-right: auto;
}
</style>