---
layout: post
title: "Metropolis-Hasting Algorithm"
date: 2018-02-12
excerpt: "Introduction to Metropolis-Hasting Algorithm, a Markov chain Monte Carlo (MCMC) method for obtaining a sequence of random samples from a probability distribution for which direct sampling is difficult."
tags: [MCMC]
comments: true
---

## Overview

As we have seen, the ability to sample from the posterior distribution is essential to the practice of Bayesian statistics, as it allows Monte Carlo estimation of all posterior quantities of interest. Today, I will discuss the mechanisms that allow us to carry out this sampling when a direct approach is not possible - **Metropolis-Hastings Algorithm**, as well as discuss why these approaches work.

Suppose that a [Markov chain](https://en.wikipedia.org/wiki/Markov_chain) is in position \\( x \\); the Metropolis-Hastings algorithm is as follows:

1. Propose a move to y with probability 
   \\( q(y \vert x) \\).  
2. Calculate the ratio: 
   \\[ r = \frac{p(y)q(x \vert y)}{p(x)q(y \vert x)} \\]
3. Accept the proposed move with probability 
   \\[ \alpha = \min \\{1, r\\}; \\] otherwise, remain at x (i.e., \\( X^{(t+1)} = X^{(t)} \\))

The Metropolis algorithm can be coded as follows:

```r
N <- 10000 
mu <- numeric(N) 
for (i in 1:(N-1)) {
	proposal <- mu[i] + rnorm(1)
	r <- p(proposal)/p(mu[i])
	accept <- rbinom(1, 1, min(1,r))
	mu[i+1] <- if (accept) proposal else mu[i]
}
```

## Sampling Result

Below is the sampling result of the implementation above. LHS is the sampling result from Metropolis-Hasting Algorithm and RHS is the groundtruth of distribution.

<img src="https://github.com/Zhenye-Na/Zhenye-Na.github.io/blob/master/assets/images/posts-img/mh-algo/MH.jpg?raw=true">



## Metropolis-Hastings Algorithm for continuous distributions

**MCMC-MH:** We need to generate identically-distributed samples \\(X \sim f(x) \\) according to some (complicated) PDF \\( f(\cdot) \\) that can be computed upto a proportionality constant.

Assume that for right now, you have a present value \\( x^{(j)} \\) for \\( X \sim f(x) \\). You have access to a known/well-understood Proposal Distribution \\( q(\cdot) \\) that is conditioned on \\( x^{(j)} \\). You get a sample \\( \hat{x} ∼ q(x \vert x^{(j)}) \\), you set \\( x^{(j+1)} = \hat{x} \\) with probability: 

\\[ p(\hat{x}, x^{(j)}) = \min \left \\{1, \frac{f(\hat{x})}{f(x^{(j)})} \times \frac{q(x^{(j)} \vert \hat{x})}{q(\hat{x} \vert x^{(j)})} \right \\} \\]

The sequence of (not necessarily independent) samples \\( \\{x^{(j)}\\}^{\infty}_{j=1} \\) will be distributed according $f(x)$. In many cases, we will pick **Proposal Distributions that are symmetric**, that is, \\( q(x^{(j)}  \vert  \hat{x}) = q(\hat{x}  \vert  x^{(j)}) \\), in which case the above expression simplifies to 

\\[ p(\hat{x}, x^{(j)}) = \min \left \\{1, \frac{f(\hat{x})}{f(x^{(j)})} \right \\} \\]

So now we suppose \\( q(\hat{x} \vert x^{(j)}) = \mathcal{N}(x^{(j)}, 1) \\) (i.e. it returns r.v.’s that are Normally-distributed with mean \\( x^{(j)} \\) with variance of 1), we have a symmetric Proposal Distribution (cf. the definition/discussion above).

That is, \\( \hat{x} \sim N(x^{(j)} , 1) \\) – which means we are drawing \\( \hat{x} \\) from a *unit-normal centered* around a mean of \\( x^{(j)} \\). The probability of getting \\( \hat{x} \\) under this scheme is exactly the same that of getting \\( x^{(j)} \\) from a *unit-normal centered* around a mean of \\( \hat{x} \\).

## Implementation of Metropolis-Hastings Algorithm

The Proposal Distribution is the d-dimensional Multivariate Gaussian with **zero-mean** (i.e. \\( \mu = 0 \\) ) and **Unit-Covariance** (i.e. \\( \Sigma = \textbf{I} \\) ). Assume that for right now we have generated \\( \\{x_i \\}^j_{i=1} \\). where \\( \textbf{x}_i \sim N(\textbf{x}, \mu, \Sigma) \\). We can generate RVs  \\(\hat{\textbf{x}} \sim N(\textbf{x}, \textbf{x}_j, \textbf{I}) \\) as \\( \hat{\textbf{x}} = \textbf{x}_j + \textbf{y} \\), where \\( \textbf{y} \sim N(\textbf{y}, \textbf{0}, \textbf{I}) \\).

```c++
#include <iostream>
#include <iomanip>
#include <cmath>
#include <fstream>
#include <cstdlib>
#include <random>
#include <chrono>

//Substitue the directory here with your own NEWMAT library path
#include "/Users/macbookpro/newmat11/include.h"
#include "/Users/macbookpro/newmat11/newmat.h"
#include "/Users/macbookpro/newmat11/newmatio.h"

#define PI 3.141592654

using namespace std;

// cf http://www.cplusplus.com/reference/random/uniform_real_distribution/operator()/
// otherwise errors will not be repeatable.
unsigned seed = (unsigned) std::chrono::system_clock::now().time_since_epoch().count();
default_random_engine generator (seed);

double get_gaussian(double mean, double standard_deviation)
{
    std::normal_distribution<double> distribution(mean, standard_deviation);
    double number = distribution(generator);
    return (number);
}

double get_uniform()
{
    std::uniform_real_distribution <double> distribution(0.0,1.0);
    double number = distribution(generator);
    return (number);
}

ColumnVector Generate_Independent_Multivariate_Gaussian(ColumnVector mean)
{
    ColumnVector x(mean.nrows());
    for (int i = 1; i <= mean.nrows(); i++) {
        x(i) = get_gaussian(mean(i), 1);
    }
    return x;
}

double MH_Discriminant(ColumnVector Current_value, ColumnVector Previous_value, SymmetricMatrix C, ColumnVector mean)
{
    Matrix c = (Current_value - mean).t() * C.i() * (Current_value - mean);
    double up_c = c(1, 1);
    double up = exp(-0.5 * up_c);
    
    Matrix p = (Previous_value - mean).t() * C.i() * (Previous_value - mean);
    double down_p = p(1, 1);
    double down = exp(-0.5 * down_p);
    
    double re = up/down;
    
    if (re < 1) {
        return re;
    }
    else {
        return 1.0;
    }
}

double Theoretical_PDF(ColumnVector x, SymmetricMatrix C, ColumnVector mean)
{
    double multi_pdf;
    int d = mean.nrows();
    
    // Determinant of C
    double det = C.determinant();
    
    // Multipliers
    double multi = pow ((2 * PI), d);
    
    // Multivariate Gaussian Distribution
    Matrix m = -0.5 * (x - mean).t() * C.i() * (x - mean);
    double mm = m(1, 1);
    
    multi_pdf = (1 / pow (det * multi, 0.5)) * exp (mm);
    return multi_pdf;
}

int main (int argc, char* argv[])
{
    ColumnVector y_prev, y_current;
    Matrix count(100,100);
    int no_of_trials, dimension;
    
    // 2D case
    dimension = 2;
    
    sscanf (argv[1], "%d", &no_of_trials);
    ofstream pdf_data(argv[2]);
    ofstream pdf_theory(argv[3]);
    
    // The covariance matrix
    SymmetricMatrix C(2);
    C(1,1) = 1.0;
    C(1,2) = 0.5;
    C(2,1) = 0.5;
    C(2,2) = 1.0;
    
    // The mean vector
    ColumnVector mean(2);
    mean(1) = 1.0;
    mean(2) = 2.0;
    
    cout << "Multivariate Gaussian Generator using MCMC-MH" << endl;
    cout << "Dimension = " << mean.nrows() << endl;
    cout << endl << "Mean Vector = " << endl << mean;
    cout << endl << "Covariance Matrix = " << endl << C;
    
    for (int i = 1; i <= 100; i++)
        for (int j = 1; j <= 100; j++)
            count(i,j) = 0.0;
    
    y_prev = Generate_Independent_Multivariate_Gaussian(mean);
    for (int i = 0; i < no_of_trials; i++)
    {
        y_current = Generate_Independent_Multivariate_Gaussian(mean);
        
        if (get_uniform() < MH_Discriminant(y_current, y_prev, C, mean))
        {
            for (int j = 1; j <= 100; j++) {
                for (int k = 1; k <= 100; k++) {
                    if ( (y_current(1) >= ((double) (j-52)/10)) && (y_current(1) < ((double) (j-51)/10)) &&
                        (y_current(2) >= ((double) (k-52)/10)) && (y_current(2) < ((double) (k-51)/10)) )
                        count(j,k)++;
                }
            }
            y_prev = y_current;
        }
    }
    
    for (int j = 1; j <= 100; j++) {
        for (int k = 1; k <= 100; k++) {
            if (k < 100)
                pdf_data << count(j,k)/((double) no_of_trials) << ", ";
            if (k == 100)
                pdf_data << count(j,k)/((double) no_of_trials) << endl;
        }
    }
    
    double x1, x2;
    for (int j = 1; j <= 100; j++) {
        x1 = ((double) (j-51)/10);
        for (int k = 1; k <= 100; k++) {
            x2 = ((double) (k-51)/10);
            ColumnVector x(2);
            x(1) = x1;
            x(2) = x2;
            if (k < 100)
                pdf_theory << Theoretical_PDF(x, C, mean)*0.01 << ", ";
            if (k == 100)
                pdf_theory << Theoretical_PDF(x, C, mean)*0.01 << endl;
        }
    }
}

```

```bash
$ g++ main.cpp /Users/macbookpro/newmat11/libnewmat.a
$ time ./a.out 10000000 x y
Multivariate Gaussian Generator using MCMC-MH
Dimension = 2

Mean Vector = 
1.000000 
2.000000 

Covariance Matrix = 
1.000000 0.500000 
0.500000 1.000000 

real	19m45.548s
user	18m12.284s
sys	0m9.108s
```
