---
layout: post
title: "Simple Movie Recommender System"
date: 2018-10-28
modify_date: 2018-10-28
excerpt: "The main goal of such a system is to recommend relevant movies to an user based on available data."
tags: [Machine Learning, Recommender System, Python]
mathjax: true
mathjax_autoNumber: true
---

# Simple Movie Recommender System


The main goal of such a system is to recommend relevant movies to an user based on available data. Data includes information about the movies and ratings provided by a user to a subset of movies. We will have some metadata information about each movie like title, a brief overview, tagline of the movie etc. We also have the ratings that a user has provided to some of the movies. Now based on movie metadata and ratings information, we need to recommend new movies to an user.

To recommend new movies to an user, we need to determine how relevant a movie is to an user. Relevance between a movie and an user is captured by the rating that a user provides to a particular movie. To recommend movies to an user, we need to infer/estimate the rating that a user would have provided to a movie if she had already seen this movie. So our recommendation problem becomes an unknown user-movie rating estimation problem.


Let the set of users be represented by $U(u \in U)$ and set of movies by represented by $M(m \in M)$. We want to estimate $\hat{r}_{um}$ i.e. rating provided by $u$ to $m$. Note that for the $(u, m)$ pairs already present in the data $\hat{r}_{um} = r_{um}$ 


For the $(u, m)$ pairs not present in the data, we will use the formula below




$b_{um}$ is the baseline rating predictor. $\mu$ is the global mean calculated across all the ratings available in the dataset. $R(m)$ is the set of users that have rated the movie $m$ in the available dataset. $R(u)$ are the set of the movies that have been rated by the user $u$. $s_{mj}$ is the similarity value between $2$ movies $m$ and $j$.


We need the similarity value $s_{mj}$ in Equation (1). In this assignment, we will use movie metadata content to calculate the value $s_{mj}$ We will provide the movie metadata information as a document or collection of words. $s_{m,j}$ is the **cosine similarity** between the metadata document of the $2$ movies. In order to calculate cosine similarity, first we need to convert the metadata documents to a vector form. The common way of doing this is to transform documents into **tf-idf** vector.

**Term Frequency** also known as **tf** measures the number of times a term (word) occurs in a document. Since every document is different in length, it is possible that a term would appear much more times in long documents than shorter ones. Thus, the term frequency is normalized by the document length.

$$ tf(t, m) = \frac{\text{Number of times term t appears in metadata of a movie m}}{\text{Total number of terms in the metadata about m}} $$

**Inverse Document Frequency** also known as **idf** measures how important a term is to a particular movie.

$$ idf(t) = \log_e \frac{\text{Total number of movies in dataset}}{\text{Number of movies with term t in it}} $$


Now let the total number of unique words across all movie metadata documents be $V = (V_1, V_2 , \cdots, V_{|V|} )$. Now we will convert metadata document for movie m into a $|V|$ dimensional vector $d^m$ .


$$ d^m = (d_1^m, d_2^m, \cdots, d_{|V|}^m ) $$

$$ d^m_i = tf(V_i, m) \times idf(V_i) $$

Now we will calculate the similarity as

$$ s_{mj} = cosine(d^m , d^j) $$


## Implementation

### Input Format

The input contains the (user, movie) rating information, movie metadata and the (user, movie) pair for which you need to estimate the rating.

- The first line of the input contains 2 space seperated integers `R` and `M`. `R` is the number of lines of rating information. `M` is the number of movies.
- Next `R` lines contain the rating information. Each line will contain 3 space seperated values (`user id`, `movie id`, `rating`).
- Next `M` lines contain the metadata information. The first word/value of each line is the movie id. The rest of the words are the metadata information about that movie.
- The last line with contain 2 space seperated integers (target user id, target movie id) for which you need to estimate the rating.

Please refer to the [sample input 0](#sample-input-0) below.

There are `5` rating information lines and `5` movie metadata lines. You need to find the rating that user `1` would have given to movie `4`.

### Constraints

NA

### Output Format

Your ouput should be a single floating point value for the estimated rating. Round the output to 1 decimal point.

#### Sample Input 0

```
5 5
1 1 3.0
1 2 4.0
1 3 3.0
2 4 2.0
2 5 5.0
1 batman robin superhero
2 batman dark knight
3 dark knight returns
4 batman joker gotham
5 batman superhero
1 4
```

#### Sample Output 0

```
2.0
```

#### Sample Input 1

```
6 5
1 1 3.0
1 2 4.0
1 3 3.0
2 1 2.8
2 4 2.0
2 5 5.0
1 batman robin superhero
2 batman dark knight
3 dark knight returns
4 batman joker gotham
5 batman superhero
1 5
```

#### Sample Output 1

```
5.1
```




## References

[1] David Easley and Jon Kleinberg, [*"Networks, Crowds, and Markets: Reasoning about a Highly Connected World - Chapter 9"*](https://github.com/Zhenye-Na/cs498HS4/blob/master/hw1/networks-book-ch14.pdf)


<style>
.center {
    display: block;
    margin-left: auto;
    margin-right: auto;
}
</style>