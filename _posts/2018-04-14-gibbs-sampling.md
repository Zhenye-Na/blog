---
layout: post
title: "MCMC: Intro to Gibbs Sampling"
date: 2018-04-14
excerpt: "Gibbs sampling is a computational method to calculate distributions which are intractable by mathematical means"
tags: [MCMC, Gibbs Sampling]
mathjax: true
mathjax_autoNumber: true
---

> *Gibbs sampling is a computational method to calculate distributions which are intractable by mathematical means. The sampling is dependent (not pseudorandom) because the sampling at any iteration depends on the values in the previous iteration; however, the sampling procedure is known to converge on the desired posterior distribution. In this tutorial, I will cover Gibbs Sampling and implementation of it.*

## Introduction

As Bayesian models of cognitive phenomena become more sophisticated, the need for eﬃcient inference methods becomes more urgent. In a nutshell, the goal of Bayesian inference is to maintain a full posterior probability distribution over a set of random variables. However, maintaining and using this distribution often involves computing integrals which, for most non-trivial models, is intractable. Sampling algorithms based on Monte Carlo Markov Chain (MCMC) techniques are one possible way to go about inference in such models.

The underlying logic of MCMC sampling is that we can estimate any desired expectation by ergodic averages. That is, we can compute any statistic of a posterior distribution as long as we have N simulated samples from that distribution:

$$ E[f(s)]_{\mathcal{P}} \approx \frac{1}{N} \sum \limits_{i=1}^{N}f(s^{(i)}) $$

where $ \mathcal{P} $ is the posterior distribution of interest, $ f(s) $ is the desired expectation, and $ f(s^{(i)}) $ is the $ i^{th} $ simulated sample from $ \mathcal{P} $.

How do we obtain samples from the posterior distribution? Gibbs sampling is one MCMC technique suitable for the task. The idea in Gibbs sampling is to generate posterior samples by sweeping through each variable (or block of variables) to sample from its conditional distribution with the remaining variables fixed to their current values. For instance, consider the random variables $ X_1 $, $ X_2 $, and $ X_3 $. We start by setting these variables to their initial values $ x_1^{(0)} $, $ x_2^{(0)} $ , and $ x_3^{(0)} $ (often values sampled from a prior distribution q). At iteration $ i $, we sample $ x_i^{(1)} \sim p(X_1 = x_1 \vert X_2 = x_2^{(i−1)}, X_3 = x_3^{(i−1)} $, sample $ x_2 \sim p(X_2 = x_2 \vert X_1 = x_1^{(i)}, X_3 = x_3^{(i−1)} $, sample $ x_3 \sim p(X_3 = x_3 \vert X_1 = x_1^{(i)}, X_2 = x_2^{(i)} $. This process continues until “convergence” (the sample values have the same distribution as if they were sampled from the true posterior joint distribution). Algorithm 1 details a generic Gibbs sampler.

![](https://github.com/Zhenye-Na/Zhenye-Na.github.io/blob/master/assets/images/posts-img/gibbsampling/gibbs1.png?raw=true)


In Algorithm 1, we are not directly sampling from the posterior distribution itself. Rather, we simulate samples by sweeping through all the posterior conditionals, one random variable at a time. Because we initialize the algorithm with random values, the samples simulated based on this algorithm at early iterations may not necessarily be representative of the actual posterior distribution. However, the theory of MCMC guarantees that the stationary distribution of the samples generated under Algorithm 1 is the target joint posterior that we are interested in (Gilks et al., 1996; also see the Computational Cognition Cheat Sheet on Metropolis-Hastings sampling). For this reason, MCMC algorithms are typically run for a large number of iterations (in the hope that convergence to the target posterior will be achieved). Because samples from the early iterations are not from the target posterior, it is common to discard these samples. The discarded iterations are often referred to as the "burn-in" period.

A good way of learning about MCMC techniques is to study examples. In the rest of this note, we develop a Gibbs sampler for a change-point model.


## A change-point model

Suppose that we observe a sequence of counts $x_1 $, $x_2 $, ... , $x_N $ where the average of the counts has some value for time steps 1 to n, and a diﬀerent value for time steps $ n + 1 $to $ N $. We model the counts at each time step $ i $ as a Poisson variable, which has the following density function:

$$ \begin{align}  \text{Poisson}(x; \lambda) &= e^{-\lambda} \frac{\lambda ^{x}}{x!} \tag{1} \\ &= \exp (x \log \lambda − \lambda − \log(x!)) \end{align} $$

where $ \lambda $ is the mean of the distribution. We model the mean $ \lambda $ as a Gamma distribution, which has the following density function:

$$ \begin{align} \text{Gamma}(\lambda; a, b) &= \frac{1}{\Gamma(a)}b^a \lambda^{a-1} \exp (-b \lambda) \tag{3} \\ &= \exp ((a-1) \log \lambda - b \lambda - \log \Gamma(a) + a \log b) \end{align} $$


The initial mean $ \lambda_1$ jumps to a new value $ \lambda_2$ after a random time step $ n $. Thus the generative model is as follows:

$$ \begin{align} n & \sim \text{Uniform}(1, 2, ..., N) \\ \lambda_i &\sim \text{Gamm} a(\lambda_i; a, b) \\ x_i &\sim \begin{cases} \text{Poisson}(x_i ; \lambda_1), & \text{if}\ 1 \leq i \leq n \\ \text{Poisson}(x_i ; \lambda_2), & \text{if}\ n \leq i \leq N \end{cases} \end{align} $$

The problem of inferring the posterior distribution over the latent variables $ n $, $ \lambda_1 $, $ \lambda_2 $ can be solved via Bayes theorem.

$$ p(\lambda_1, \lambda_2, n \vert x_{1:N}) \varpropto p(x_{1:n} \vert \lambda_1)p(x_{n+1:N} \vert \lambda_2)p(\lambda_1)p(\lambda_2)p(n) $$


## Conditional distributions

As **Algorithm 1** illustrates, we need the posterior conditionals for each of the variables to perform Gibbs sampling. We start by deriving the full joint distribution. We then derive the posterior conditionals for each of the variables $ \lambda_1 $, $ \lambda_1 $, $ n $ using the full joint distribution.

A form of the full joint distribution is given on the right hand side of Equation 5. We start our derivation from there.

$$ \begin{equation} p(x_{1:n} \vert \lambda_1)p(x_{n+1:N} \vert \lambda_2)p(\lambda_1)p(\lambda_2)p(n) \\ = \bigg(\prod \limits_{i=1}^n p(x_i |\lambda_1)\bigg) \bigg(\prod \limits_{i=n+1}^N p(x_i |\lambda_2)\bigg) p(\lambda_1)p(\lambda_2)p(n) \end{equation} $$


Next we write the log of the full posterior by taking the logarithm of the right hand side of Equation 6 and plugging in Equations 1 ~ 4 wherever appropriate.

$$ \begin{equation} \log p(x_{1:n} \vert \lambda_1 ) + \log p(x_{n+1:N} \vert \lambda_2) + \log(\lambda_1) + \log(\lambda_2) + \log p(n) \\ = \sum \limits_{i=1}^n (x_i \log \lambda_1 - \lambda_1 - \log (x_i!)) \\ + \sum \limits_{i=n+1}^N (x_i \log \lambda_2 - \lambda_2 - \log (x_i!)) \\ + (a-1) \log \lambda_1 - b \lambda_1 - \log \Gamma(a) + a \log b \\ + (a-1) \log \lambda_2 - b \lambda_2 - \log \Gamma(a) + a \log b \\ - \log N \end{equation} $$

Now we obtain the posterior conditionals for each of the latent variables by collecting the terms in the full joint distribution that include the latent variable of interest. We start with $ \lambda_1 $ . We obtain its posterior conditional by picking up the relevant terms in Equation 7 (and rearranging some of these terms).

$$ \begin{align} \log p(\lambda_1 \vert n, \lambda_2, x_{1:N}) &=^+ \sum \limits_{i=1}^n (x_i \log \lambda_1 - \lambda_1) + (a-1)\log \lambda_1 - b \lambda_1 \\ &= \bigg( a + \sum \limits_{i=1}^n x_i - 1 \bigg) \log \lambda_1 - (n+b)\lambda_1 \\ &=^+ \log \Gamma \bigg( a + \sum \limits_{i=1}^n x_i, n+b \bigg)    \end{align} $$

where the operator $=^+$ means "equal up to a constant". Note that the posterior conditional and the prior for λ 1 are both Gamma distributions (albeit with diﬀerent sets of parameters). This correspondence of distributions is not random, but arises because we used a "conjugate" prior distribution. That is, for certain pairs of priors and likelihoods, the posterior ends up having the same probability distribution as the prior (with updated parameters). GammaPoisson is one such pair of conjugacy, resulting in a Gamma posterior.

The posterior conditional for $ \lambda_2 $ can be derived similarly:

$$ \begin{align} \log p(\lambda_1 \vert n, \lambda_2, x_{1:N}) &=^+ \sum \limits_{i=n+1}^N (x_i \log \lambda_2 - \lambda_2) + (a-1)\log \lambda_2 - b \lambda_2 \\ &=^+ \log \Gamma \bigg( a + \sum \limits_{i=1}^n a+x_i, N-n+b \bigg) \end{align} $$

finally, we derive the posterior conditional for n, the time step at which counts jump from a mean of $ \lambda_1 $  to a mean of $ \lambda_2 $ :

$$ \begin{align} \log p(n \vert \lambda_1, \lambda_2, x_{1:N}) &= \sum \limits_{i=1}^n (x_i \log \lambda_1 - \lambda_1 - \log (x_i!)) + \sum \limits_{i=n+1}^N (x_i \log \lambda_2 - \lambda_2 - \log (x_i!)) \\ &=^+ \bigg( \sum \limits_{i=1}^n x_i \bigg) \log \lambda_1 -n \lambda_1+ \bigg( \sum \limits_{i=n+1}^N x_i \bigg) \log \lambda_2 - (N - n) \lambda_2 \end{align} $$

Note that the conditional posterior for n is not of a known closed form. But we can easily obtain a multinomial distribution for n by computing $ p(n \vert \lambda_1, \lambda_1, x_{1:N} ) $ for $ n = 1, . . . , N $  which we can use to draw new samples.

Now that we have the posterior conditionals for all the latent variables, we are ready to simulate samples from the target joint posterior in Equation 5 using Algorithm 1.

## Implementation

Below is the `C++` implementation of Gibbs Sampling algorithm:

```c++
//
//  main.cpp
//  Multivariate Gaussian via Gibbs Sampling
//
//  Zhenye Na Apr 13, 2018
//

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

#define PI 3.141592654

using namespace std;
unsigned seed = (unsigned) std::chrono::system_clock::now().time_since_epoch().count();
default_random_engine generator (seed);

double get_gaussian(double mean, double standard_deviation)
{
    std::normal_distribution<double> distribution(mean, standard_deviation);
    double number = distribution(generator);
    return (number);
}

ColumnVector Gibbs_sampler_for_Multivariate_Gaussian(int index, ColumnVector Previous_value, SymmetricMatrix C, ColumnVector mean)
{
    int d = mean.nrows();
    Matrix S11(d-1,d-1);
    ColumnVector S12(d-1), x1(d-1), mean1(d-1);
    RowVector S21(d-1);
    double S22;
    if(index == d){
        // Write code to construct Sigma11 here
        S11 = C.submatrix(1,index-1,1,index-1);
        
        // Write code to construct Sigma12 here
        S12 = C.submatrix(1,index-1,index,index);
        
        // Write code to construct Sigma21 here
        S21 = C.submatrix(index,index,1,index-1);
        
        // Write code to construct Sigma22 here
        S22 = C(index,index);
        
        x1 = Previous_value.rows(1, index-1);
        mean1 = mean.rows(1, index-1);
    }
    else if(index == 1){
        // Write code to construct Sigma11 here
        S11 = C.submatrix(index+1, d, index+1, d);
        
        // Write code to construct Sigma12 here
        S12 = C.submatrix(index+1, d, index, index);
        
        // Write code to construct Sigma21 here
        S21 = C.submatrix(index, index, index+1, d);
        
        // Write code to construct Sigma22 here
        S22 = C(index, index);
        
        x1 = Previous_value.rows(index+1, d);
        mean1 = mean.rows(index+1, d);
    }
    else {
        // Write code to construct Sigma11 here
        int ii = 0;
        int jj = 0;
        for(int i=1;i<=d;i++){
            ii += 1;
            if(i != index){
                for(int j=1; j<=d; j++){
                    jj += 1;
                    if(j != index){
                        S11(ii,jj) = C(i,j);
                    }
                    else{
                        jj -= 1;
                    }
                }
            }
            else{
                ii -= 1;
            }
        }
        
        // Write code to construct Sigma12 here
        ii = 0;
        for(int i=1; i<=d; i++){
            ii += 1;
            if(ii != index){
                S12(ii) = C(i,index);
            }
            else{
                ii -= 1;
            }
        }
        
        // Write code to construct Sigma21 here
        jj = 0;
        for(int j=1; j<=d; j++){
            jj += 1;
            if(jj != index){
                S21(jj) = C(index,jj);
            }
            else{
                jj -= 1;
            }
        }
        
        // Write code to construct Sigma22 here
        S22 = C(index,index);
        
        ii=0;
        for(int i=1; i<=d; i++){
            ii += 1;
            if(i != index){
                x1(ii) = Previous_value(i);
                mean(ii) = mean(i);
            }
            else {
                ii -= 1;
            }
        }
    }
    
    double mean2 = (mean(index) + (S12.t() * S11.i() * (x1 - mean1))).as_scalar();
    double sigma2 = (S22 - (S12.t() * S11.i() * S12)).as_scalar();
    double x = get_gaussian(mean2, sigma2);
    
    
    ColumnVector xx(mean.nrows());
    xx = Previous_value;
    xx(index) = x;
    
    return xx;
}


double Theoretical_PDF(ColumnVector x, SymmetricMatrix C, ColumnVector mean)
{
    // write C++ code that computes the expression of equation 1 of the assignment description
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
    ColumnVector y_prev, y;
    Matrix count(100,100);
    int no_of_trials, dimension;
    
    // 2D case
    dimension = 2;
    
    sscanf (argv[1], "%d", &no_of_trials);
    ofstream pdf_data(argv[2]);
    ofstream pdf_theory(argv[3]);
    
    // The covariance matrix
    SymmetricMatrix C(2);
    C(1,1) = 0.75;
    C(1,2) = 0.25;
    C(2,1) = 0.25;
    C(2,2) = 0.5;
    
    // The mean vector
    ColumnVector mean(2);
    mean(1) = 1.0;
    mean(2) = 2.0;
    
    cout << "Multivariate Gaussian Generator using Gibbs Sampling" << endl;
    cout << "Dimension = " << mean.nrows() << endl;
    // cout << endl << "Mean Vector = " << endl << mean;
    // cout << endl << "Covariance Matrix = " << endl << C;
    
    for (int i = 1; i <= 100; i++)
        for (int j = 1; j <= 100; j++)
            count(i,j) = 0.0;
    
    y_prev = mean;
    for (int i = 0; i < no_of_trials; i++)
    {
        y = Gibbs_sampler_for_Multivariate_Gaussian(i%(mean.nrows())+1, y_prev, C, mean);
        for (int j = 1; j <= 100; j++) {
            for (int k = 1; k <= 100; k++) {
                if ( (y(1) >= ((double) (j-52)/10)) && (y(1) < ((float) (j-51)/10)) &&
                    (y(2) >= ((double) (k-52)/10)) && (y(2) < ((float) (k-51)/10)) )
                    count(j,k)++;
            }
        }
        y_prev = y;
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

### Comparison with Ground Truth Distribution

![](https://github.com/Zhenye-Na/Zhenye-Na.github.io/blob/master/assets/images/posts-img/gibbsampling/gibbs2.png?raw=true)


## Summary

Given a generative model for a set of random variables, we can summarize Gibbs sampling in two steps:

- Step 1: Derive the full joint density, and the posterior conditionals for each of the random variables in the model.
- Step 2: Simulate samples from the posterior joint distribution based on the posterior conditionals (Algorithm 1).

We illustrated both of these steps in a change-point detection problem.


> *If you notice mistakes and errors in this post, please don't hesitate to leave a comment and I would be super happy to correct them right away!*


## References

[1] Lynch, S. M. (2007). [*Introduction to Applied Bayesian Statistics and Estimation for Social Scientists*](https://www.springer.com/us/book/9780387712642). New York: Springer;  
[2] Taylan Cemgil’s [lecture slides](http://www.cmpe.boun.edu.tr/courses/cmpe58n/fall2009/) on Monte Carlo methods;  
[3] Gilks, W. R., Richardson, S., & Spiegelhalter, D. J. (1996). [*Markov Chain Monte Carlo in Practice*](http://www.stat.columbia.edu/~gelman/research/published/kass5.pdf). London: Chapman and Hall.