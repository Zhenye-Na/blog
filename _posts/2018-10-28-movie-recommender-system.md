---
layout: post
title: "Simple Movie Recommender System"
date: 2018-10-28
modify_date: 2018-10-29
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

```python
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

```python
2.0
```

#### Sample Input 1

```python
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

```python
5.1
```

### Codes

```python
"""A Python implementation of Simple Recommender Systems."""

from scipy import spatial
from collections import defaultdict

import sys
import math
import numpy as np


def read_input():
    """
    Read input from stdin.

    The first line of the input contains 2 space seperated integers R M.
        R is the number of lines of rating information.
        M is the number of movies.
    Next R lines contain the rating information.
        Each line will contain 3 space seperated values (user id, movie id, rating).
    Next M lines contain the metadata information.
        The first word/value of each line is the movie id.
        The rest of the words are the metadata information about that movie.
    The last line with contain 2 space seperated integers (target user id, target movie id)
        for which you need to estimate the rating.
    """
    first_line = sys.stdin.readline().rstrip("\n").split(" ")

    # number of rating information and total number of movies
    global R, M
    R, M = int(first_line[0]), int(first_line[1])

    user_ids = []
    movie_ids = []
    ratings = []

    # R(m) is the set of users that have rated the movie m in the available dataset. Rm[movie] = list of users
    Rm = defaultdict(list)

    # R(u) are the set of the movies that have been rated by the user u.  Ru[user] = list of movies
    Ru = defaultdict(list)

    # (user, movie) -> rating
    rating_dict = {}
    user_movie_mapping = defaultdict(list)
    user_ratings = defaultdict(list)
    movie_ratings = defaultdict(list)

    for _ in range(R):
        rating_info = sys.stdin.readline().rstrip("\n").split(" ")
        user_id, movie_id, rating = int(rating_info[0]), int(rating_info[1]), float(rating_info[2])

        rating_dict[(user_id, movie_id)] = rating
        user_movie_mapping[user_id].append(movie_id)
        movie_ratings[movie_id].append(rating)
        user_ratings[user_id].append(rating)

        # mapping from movie to the users rated this movie
        Rm[movie_id].append(user_id)

        # mapping from user to the movies this user rated
        Ru[user_id].append(movie_id)

        # user_ids, movie_ids, ratings
        user_ids.append(user_id)
        movie_ids.append(movie_id)
        ratings.append(rating)

    # µ is the global mean calculated across all the ratings available
    global mu
    mu = sum(ratings) / len(ratings)

    # get all the movies' words
    movie_meta_info = {}
    word_movie_mapping = defaultdict(set)
    for _ in range(M):
        meta_info = sys.stdin.readline().rstrip("\n").split(" ")
        word_dict = defaultdict(int)
        for word in meta_info[1:]:
            word_movie_mapping[word].add(int(meta_info[0]))
            word_dict[word] += 1
        movie_meta_info[int(meta_info[0])] = dict(word_dict)

    term_index = {}
    words = list(word_movie_mapping.keys())
    global V
    V = len(word_movie_mapping)
    for idx, word in enumerate(words):
        term_index[word] = idx

    last_line = sys.stdin.readline().rstrip("\n").split(" ")
    global target_user_id, target_movie_id
    target_user_id, target_movie_id = int(last_line[0]), int(last_line[1])

    return rating_dict, Rm, Ru, movie_ratings, user_ratings, movie_meta_info, word_movie_mapping, term_index, user_movie_mapping, movie_ratings


def main():
    """Main pipeline for Simple Recommender Systems."""
    rating_dict, Rm, Ru, movie_ratings, user_ratings, movie_meta_info, word_movie_mapping, term_index, user_movie_mapping, movie_ratings = read_input()

    # get target user rated movies
    rated_target_movies = Ru[target_user_id]

    bm_mapping = defaultdict(float)
    b_um = cal_b_m(movie_ratings, rating_dict, user_ratings, bm_mapping, user_movie_mapping, target_movie_id, target_user_id)

    # calculate s_mj
    s_mj = []
    d_m = cal_dv(movie_meta_info, word_movie_mapping, term_index, target_movie_id)
    for j in rated_target_movies:
        d_j = cal_dv(movie_meta_info, word_movie_mapping, term_index, j)
        s_mj.append(1 - spatial.distance.cosine(d_m, d_j))

    up = []
    for j in range(len(rated_target_movies)):
        r_uj = rating_dict[(target_user_id, rated_target_movies[j])]
        b_uj = cal_b_m(movie_ratings, rating_dict, user_ratings, bm_mapping, user_movie_mapping, rated_target_movies[j], target_user_id)
        up.append(s_mj[j] * (r_uj - b_uj))

    result = np.sum(up) / np.sum(s_mj)
    print(round(b_um + result, 1))


def cal_dv(movie_meta_info, word_movie_mapping, term_index, m_id):
    """Calculate d^m."""
    tf_vector = np.zeros(V)
    idf_vector = np.zeros(V)

    words = movie_meta_info[m_id].keys()
    total = sum(movie_meta_info[m_id].values())

    for word in words:
        # tf
        tf_vector[term_index[word]] = movie_meta_info[m_id][word] / total
        # idf
        idf_vector[term_index[word]] = math.log(M / len(word_movie_mapping[word]))
    dm = tf_vector * idf_vector
    return dm.tolist()


def cal_b(movie_ratings, bm_mapping, m_id):
    m_id_rates = movie_ratings[m_id]
    val = np.sum(np.array(m_id_rates) - mu) / len(m_id_rates)
    bm_mapping[m_id] = val
    return val


def cal_b_m(movie_ratings, rating_dict, user_ratings, bm_mapping, user_movie_mapping, m_id, u_id):
    """Calculate b_m."""
    if m_id in bm_mapping:
        b_m = bm_mapping[m_id]
    else:
        b_m = cal_b(movie_ratings, bm_mapping, m_id)

    movie_lists = user_movie_mapping[u_id]
    up = []
    up = 0
    for m_id in movie_lists:
        if m_id in bm_mapping:
            val = bm_mapping[m_id]
        else:
            val = cal_b(movie_ratings, bm_mapping, m_id)
        up += rating_dict[(u_id, m_id)] - mu - val
    b_u = up / len(user_ratings[u_id])
    return mu + b_u + b_m


if __name__ == '__main__':
    main()
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