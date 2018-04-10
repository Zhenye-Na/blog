---
layout: page
title: Portfolio
permalink: /portfolio/
---
<style>
<!--img.center {
    display: block;
    margin: 0 auto;
}-->

img.avatar {
    border-radius: 50%;
    display: block;
    margin: 30px auto;
    width: 150px;
}

.tags {
    <!--list-style: none;-->
    padding: 0 0 25px 0;
    <!--text-align: center;-->
    font-size: 15px;
    word-spacing: 30px;
}

a:hover {
    text-decoration: none;
}

</style>


<img src="https://github.com/Zhenye-Na/Zhenye-Na.github.io/blob/master/images/avatar.jpg?raw=true" class="avatar" vspace="50" />
<div align="center">
      <p> <span style="font-family: Trebuchet MS"> <font size="5"> Zhenye Na </font></span></p>
      <p> <span style="font-family: Trebuchet MS"> ISE @ UIUC </span></p>
      <p class="tags" > <span style="font-family: Trebuchet MS;"> <font size="4"> 
        <a href="/tag/Python">Python </a>
        <a href="/tag/R"> R </a>
        <a href="/tag/MySQL"> MySQL </a>
        <a href="/tag/Java"> Java </a>
        <a href="/tag/Matlab"> Matlab </a>
      </font></span></p>
    </div>

Here are some of the projects I am currently working on / accomplished. Links to codes on GitHub are made public.

*****

### Music Information Retrieval
<span style="color:#1d58a6"><sup>Apr 2018 - Now</sup></span>  
The goals of this project are to perform Audio Analysis (minimum goals) and build an Automatic Music Generator (maximum goals). The ability to produce songs is highly desirable by listeners and is a feature of live parties, radio shows, and on-line recordings.  

These are two main parts of the ﬁnal project.

1. **Semantic Analysis of Song Lyrics**  
	I will explore the use of song lyrics for automatic indexing of music. Using lyrics we apply a standard text processing technique to characterize their semantic content. Then determine artist similarity in this space. We found lyrics can be used to discover natural genre clusters.

2. **Music Audio Analysis and Generation**  
	I will perform Music Audio Analysis in Python and will use some neural nets architecture to generate ’its’ own music.

[see this project](https://github.com/Zhenye-Na/music-info-retrieval)
<br><br>

### Mining Rig Assembly
<span style="color:#1d58a6"><sup>Mar 2018 - Now</sup></span>  
[Mining Rig Assembly](http://rigassembly.web.engr.illinois.edu/index.php) is a web-based application that allows the users to browse different parts of a mining rig, store rig setups, and estimate the performance of their setups on one integrated site. Users can set their expected payback periods for the setups, and our application will calculate the potential profits of them based on real-time price information, and notify the user when their expected payback periods can be achieved.

Several creative features:

1. Users can set their expected cost and expected profit.
2. This website calculates the lowest cost of mining rig by comparing prices from different websites.
3. This website can notify the users when the expected profit is met.

[see this project](https://github.com/Zhenye-Na/mining-rig-assembly)
<br><br>

### Viola Jones Face Detection
<span style="color:#1d58a6"><sup>Mar 2018 - Now</sup></span>  
Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce bibendum neque eget nunc mattis eu sollicitudin enim tincidunt. Vestibulum lacus tortor, ultricies id dignissim ac, bibendum in velit.


[see this project](https://github.com/Zhenye-Na/viola-jones-face-detection)
<br><br>

### Neural Network for Estimating Shortest Path Problem
<span style="color:#1d58a6"><sup>Nov 2017 - Dec 2017</sup></span>  
We analyzed the problem and selected Deep Neural Network and Graph Convolutional Network as the architecture we used. We generated random graph to feed in GCN architecture. The final result concluded an 84% accuracy of prediction of the shortest path problem via GCN whihc is much higher than DNN model.


[see this project](https://github.com/Zhenye-Na/gcn-spp)
<br><br>

### Nonlinear Component Analysis as a Kernel Eigenvalue Problem
<span style="color:#1d58a6"><sup>Nov 2017 - Dec 2017</sup></span>  
We outlined and implemented algorithm/Pseudo-code for performing Kernel PCA presented in the [paper](http://ieeexplore.ieee.org/document/6790375/) `Nonlinear Component Analysis as a Kernel Eigenvalue Problem` by Bernhard Schölkopf, Alexander Smola, Klaus-Robert Müller. Furthermore, we implemented the toy example and performed SVM classification after using [Kernel PCA](https://en.wikipedia.org/wiki/Kernel_principal_component_analysis) and [PCA](https://en.wikipedia.org/wiki/Principal_component_analysis) respectively on [Iris Dataset](https://archive.ics.uci.edu/ml/datasets/iris). Besides, we implemented Handwriting Digit Recognition via SVM given by Kernel PCA and PCA on [UPSP dataset](https://www.otexts.org/1577). 

The result of our two experiments concluded that:

- Kernel PCA can offer more features (information) than PCA, when it is preferred performing SVM or other classification approaches.
- Both Kernel PCA and PCA are just kind of [Dimensionality Reduction](https://en.wikipedia.org/wiki/Dimensionality_reduction) methods. We cannot observe apparent clusters after performing that.


[see this project](https://github.com/Zhenye-Na/npca)  

<br><br>