---
layout: post
title: "Introduction to SimRank algorithm"
date: 2018-10-10
modify_date: 2018-10-18
excerpt: "SimRank is a general similarity measure, based on a simple and intuitive graph-theoretic model."
tags: [Algorithms, Python]
mathjax: true
mathjax_autoNumber: true
---

# Simrank++: Query rewriting through link analysis of the click graph

## Introduction

In sponsored search, paid advertisements (ads) relevant to a user's query are shown above or along-side traditional web search results. The placement of these ads is in general related to a ranking score which is a function of the semantic relevance to the query and the advertiser's bid.


<figure>
    <img src="https://github.com/Zhenye-Na/Zhenye-Na.github.io/blob/master/assets/images/posts-img/simrank/fig1.png?raw=true" width="60%" class="center">
</figure>


Ideally, a sponsored search system would appear as in Figure 1. The system has access to a database of available ads and a set of bids. Conceptually, each bid consists of a query $q$, an ad $\alpha$, and a price $p$. With such a bid, the bidder offers to pay if the ad $\alpha$ is both displayed and clicked when a user issues query $q$. For many queries, there are not enough direct bids, so the sponsored search system attempts to find other ads that may be of interest to the user who submitted the query. Even though there is no direct bid, if the user clicks on one of these ads, the search engine will make some money (and the advertiser will receive a customer). The challenge is then to find ads related to incoming queries that may yield user click throughs.

<figure>
    <img src="https://github.com/Zhenye-Na/Zhenye-Na.github.io/blob/master/assets/images/posts-img/simrank/fig2.png?raw=true" width="60%" class="center">
</figure>

For a variety of practical and historical reasons, the sponsored search system is often split into two components, as shown in Figure 2. A front-end takes an input query $q$ and produces a list of re-writes, i.e., of other queries that are "similar" to $q$. For example, for query "camera", the queries "digital camera" and "photography" may be useful because the user may also be interested in ads for those related queries. The query "battery" may also be useful because users that want a camera may also be in the market for a spare battery. The query and its rewrites are then considered by the back-end, which displays ads that have bids for the query or its rewrites. The split approach reduces the complexity of the back-end, which has to deal with rapidly changing bids. The work of finding relevant ads, indirectly through related queries, is off-loaded to the front-end.

At the front-end, queries can be rewritten using a variety of techniques (reviewed in our Related Work section) developed for document search. However, these techniques often do not generate enough useful rewrites. Part of the problem is that in our case "documents" (the ads) have little text, and queries are very short, so there is less information to work with, as compared with larger documents. Another part of the problem is that there are relatively few queries in the bid database, so even if we found all the textually related ones, we may not have enough. Thus, it is important to generate additional rewrites, using other techniques.


## SimRank algorithm


### Basic SimRank algorithm

For a node $v$ in a directed graph, we denote by $I(v)$ and $O(v)$ the set of in-neighbors and out-neighbors of $v$, respectively. Individual in-neighbors are denoted as $I_{i}(v)$, for 

<figure>
    <img src="https://github.com/Zhenye-Na/Zhenye-Na.github.io/blob/master/assets/images/posts-img/simrank/f1.png?raw=true" width="20%" class="center">
</figure>

, and individual out-neighbors are denoted as $O_{i}(v)$, for 

<figure>
    <img src="https://github.com/Zhenye-Na/Zhenye-Na.github.io/blob/master/assets/images/posts-img/simrank/f2.png?raw=true" width="20%" class="center">
</figure>

.


Let us denote the similarity between objects $a$ and $b$ by $s(a,b)\in [0,1]$. Following the earlier motivation, a recursive equation is written for $s(a,b)$. If $a=b$ then $s(a,b)$ is defined to be $1$. Otherwise,

$$s(a,b) = \frac{C}{|I(a)||I(b)|} \sum_{i=1}^{|I(a)|} \sum_{j=1}^{|I(b)|} s(I_i(a), I_j(b))$$

where $C$ is a constant between $0$ and $1$. A slight technicality here is that either $a$ or $b$ may not have any in-neighbors. Since there is no way to infer any similarity between $a$ and $b$ in this case, similarity is set to $s(a,b)=0$, so the summation in the above equation is defined to be $0$ when $I(a)=\emptyset$ or $I(b)=\emptyset$.


Let $s(q, q')$ denote the similarity **between queries** $q$ and $q'$, and let $s(\alpha, \alpha')$ denote the similarity **between ads** $\alpha$ and $\alpha'$. For $q \neq q$, we write the equation:

$$s(q, q') = \frac{C_1}{N(q)N(q')} \sum_{i \in E(q)} \sum_{j \in E(q')} s(i,j)$$

where $C_1$ is a constant between $0$ and $1$. For $\alpha \neq \alpha'$, we write:

$$s(\alpha, \alpha') = \frac{C_1}{N(\alpha)N(\alpha')} \sum_{i \in E(q)} \sum_{j \in E(q')} s(i,j)$$

where $C_2$ is a constant between $0$ and $1$.

If $q = q'$, we deﬁne $s(q, q') = 1$ and analogously if $\alpha = \alpha'$ we define $s(\alpha, \alpha') = 1$. Neglecting $C_1$ and $C_2$, equation 4.1 says that the similarity between queries $q$ and $q'$ is the average similarity between the ads that were clicked on for $q$ and $q'$. Similarly, equation 4.2 says that the similarity between ads $\alpha$ and $\alpha'$ is the average similarity between the queries that triggered clicks on $\alpha$ and $\alpha'$.

### Matrix representation of SimRank

Let $\mathbf{S}$  be the similarity matrix whose entry $[\mathbf {S}]_{a,b}$ denotes the similarity score $s(a,b)$, and $\mathbf{A}$ be the column normalized adjacency matrix whose entry 


<figure>
    <img src="https://github.com/Zhenye-Na/Zhenye-Na.github.io/blob/master/assets/images/posts-img/simrank/f3.png?raw=true" width="20%" class="center">
</figure>


if there is an edge from $a$ to $b$, and $0$ otherwise. Then, in matrix notations, SimRank can be formulated as

$${\mathbf{S} } = \max \{C\cdot (\mathbf{A}^{T} \cdot {\mathbf{S}} \cdot {\mathbf{A}}),{\mathbf{I}}\},$$

where $\mathbf{I}$  is an identity matrix.



## Revising Simrank

Consider a bipartite graph $G = (V_1 , V_2 , E)$ and two nodes $a, b \in V_1$. We will denote as $\text{evidence}(a, b)$ the evidence existing in $G$ that the nodes $a, b$ are similar. The definition of $\text{evidence}(a, b)$ we use is shown on Equation 

### geometric evidence scores

$$\text{evidence}(a, b) = \sum^{|E(a) \cap E(b)|}_{i=1} \frac{1}{2^i}$$

The intuition behind choosing such a function is as follows. We want the evidence score $\text{evidence}(a, b)$ to be an increasing function of the common neighbors between $a$ and $b$. In addition we want the evidence scores to get closer to one as the common neighbors increase.

### exponential evidence scores

Thus, another reasonable choice would be the following:

$$\text{evidence}(a, b) = \Big(1 - e^{-|E(a) \cap E(b)|} \Big)$$


## Partial Sums Memoization

Lizorkin et al.^[[1]](https://web.archive.org/web/20090407093025/http://modis.ispras.ru/Lizorkin/Publications/simrank_accuracy.pdf) proposed three optimization techniques for speeding up the computation of SimRank:

- Essential nodes selection may eliminate the computation of a fraction of node pairs with a-priori zero scores.
- Partial sums memoization can effectively reduce repeated calculations of the similarity among different node pairs by caching part of similarity summations for later reuse.
- A threshold setting on the similarity enables a further reduction in the number of node pairs to be computed.

In particular, the second observation of partial sums memoization plays a paramount role in greatly speeding up the computation of SimRank from $\mathcal {O}(Kd^{2}n^{2})$ to $\mathcal {O}(Kdn^{2})$, where $K$ is the number of iterations, $d$ is average degree of a graph, and $n$ is the number of nodes in a graph. The central idea of partial sums memoization consists of two steps:

First, the partial sums over $I(a)$ are memoized as

$$ \text{Partial}_{I(a)}^{s_{k}}(j) = \sum_{i \in I(a)} s_k(i,j), \forall j\in I(b) $$

and then $s_{k+1}(a,b)$ is iteratively computed from $\text{Partial}_{I(a)}^{s_{k}}(j)$ as

$$s_{k+1}(a,b) = \frac{C}{|I(a)||I(b)|} \sum_{j \in I(b)} \text{Partial}_{I(a)}^{s_{k}}(j).$$

Consequently, the results of $\text{Partial}_{I(a)}^{s_{k}}(j)$, $\forall j\in I(b)$, can be reused later when we compute the similarities $s_{k+1}(a,*)$ for a given vertex $a$ as the first argument.


## Implementation


### Basic implementation of SimRank

```python
import math

users = {}
ads = {}
user_sim = {}
ad_sim = {}
C = 0.8
iterations = 10


line_index = 0
linelim = 1

while line_index < linelim:
    line = input()
    if line_index == 0 or line_index == linelim - 1:
        # print(line)
        if line_index == 0:
            linelim = int(line.split("\n")[0]) + 2
            # print(linelim)
        if line_index == linelim - 1:
            line = line.split(",")
            u1 = line[0]
            m1 = line[1]
        line_index += 1
        continue
    line = line.split("\n")[0].split(",")
    if line[0] not in users:
        users[line[0]] = []
    users[line[0]].append(line[1])
    if line[1] not in ads:
        ads[line[1]] = []
    ads[line[1]].append(line[0])
    line_index += 1


for user in users:
    user_sim[user] = {}
    for user2 in users:
        user_sim[user][user2] = 0.0
    user_sim[user][user] = 1.0

for ad in ads:
    ad_sim[ad] = {}
    for ad2 in ads:
        ad_sim[ad][ad2] = 0.0
    ad_sim[ad][ad] = 1.0

for iteration in range(iterations):
    for user in users:
        for user2 in users:
            if user2 == user:
                continue
            total = 0.0
            for ad in users[user]:
                for ad2 in users[user2]:
                    total += ad_sim[ad][ad2]
            user_sim[user][user2] = (
                C * total) / (len(users[user]) * len(users[user2]))

    for ad in ads:
        for ad2 in ads:
            if ad == ad2:
                continue
            total = 0.0
            for user in ads[ad]:
                for user2 in ads[ad2]:
                    total += user_sim[user][user2]
            ad_sim[ad][ad2] = (C * total) / (len(ads[ad]) * len(ads[ad2]))


top_users = sorted(user_sim[u1].items(), key=lambda t: (
    float(t[1]), -float(t[0])), reverse=True)
top_ads = sorted(ad_sim[m1].items(), key=lambda t: (
    float(t[1]), -float(t[0])), reverse=True)

print(",".join([t[0] for t in top_users[1:4]]))
print(",".join([t[0] for t in top_ads[1:4]]))


# With geometric evidence
for user in users:
    for user2 in users:
        if user2 == user:
            continue
        common = len(list(set(users[user]) & set(users[user2])))
        evidence = 0.0
        for i in range(common):
            evidence += 1.0 / (2**(i + 1))
        user_sim[user][user2] *= evidence

for ad in ads:
    for ad2 in ads:
        if ad == ad2:
            continue
        common = len(list(set(ads[ad]) & set(ads[ad2])))
        evidence = 0.0
        for i in range(common):
            evidence += 1.0 / (2**(i + 1))
        ad_sim[ad][ad2] *= evidence


top_users = sorted(user_sim[u1].items(), key=lambda t: (
    float(t[1]), -float(t[0])), reverse=True)
top_ads = sorted(ad_sim[m1].items(), key=lambda t: (
    float(t[1]), -float(t[0])), reverse=True)

print(",".join([t[0] for t in top_users[1:4]]))
print(",".join([t[0] for t in top_ads[1:4]]))


# With exponential evidence
for user in users:
    for user2 in users:
        if user2 == user:
            continue
        common = len(list(set(users[user]) & set(users[user2])))
        evidence = 0.0
        for i in range(common):
            evidence += 1.0 / (2**(i + 1))
        if evidence > 0.0:
            user_sim[user][user2] /= evidence
        evidence = 1.0 - math.exp(-common)
        user_sim[user][user2] *= evidence

for ad in ads:
    for ad2 in ads:
        if ad == ad2:
            continue
        common = len(list(set(ads[ad]) & set(ads[ad2])))
        evidence = 0.0
        for i in range(common):
            evidence += 1.0 / (2**(i + 1))
        if evidence > 0.0:
            ad_sim[ad][ad2] /= evidence
        evidence = 1.0 - math.exp(-common)
        ad_sim[ad][ad2] *= evidence


top_users = sorted(user_sim[u1].items(), key=lambda t: (
    float(t[1]), -float(t[0])), reverse=True)
top_ads = sorted(ad_sim[m1].items(), key=lambda t: (
    float(t[1]), -float(t[0])), reverse=True)
print(",".join([t[0] for t in top_users[1:4]]))
print(",".join([t[0] for t in top_ads[1:4]]))
```


### SimRank implementation in Matrix representation

```python
from collections import defaultdict
from scipy.sparse import csr_matrix, csc_matrix, diags
import numpy as np

C = 0.8
line_1, line_2, line_3, line_4, line_5, line_6 = [], [], [], [], [], []
cnt = int(raw_input().strip())
user_dict = defaultdict(list)
ad_dict = defaultdict(list)
for _ in range(cnt):
    item_list = list(raw_input().split(','))
    user_dict[int(item_list[0])].append(int(item_list[1]))
    ad_dict[int(item_list[1])].append(int(item_list[0]))
target_list = list(raw_input().split(','))
user = int(target_list[0])
ad = int(target_list[1])
users = list(user_dict.keys())
users.sort()
ads = list(ad_dict.keys())
ads.sort()
ads_m = np.matrix(np.identity(len(ads)))
graph = np.matrix(np.zeros([len(users), len(ads)]))
for key, value in user_dict.items():
    for v in value:
        graph[users.index(key), ads.index(v)] = 1


def sort_inorder(tt_list, res_list, tt):
    ind = np.argpartition(tt_list, 1)[0]
    res_list.append(str(tt[ind]))
    tt_list[ind] = 1


def evident_calc(flag, tt, ua):
    return np.multiply(1 - np.power(0.5, ua), tt) if flag else np.multiply(1 - np.exp(-ua), tt)


def simple_simrank(N):
    update_usr = diags(np.ones(len(users)))
    update_ads = diags(np.ones(len(ads)))
    pref_user = np.dot(graph.sum(axis=1), graph.sum(axis=1).T)
    pref_ad = np.dot(graph.sum(axis=0).T, graph.sum(axis=0))

    for _ in range(N):
        temp = (graph*update_ads*graph.T)*C/pref_user
        update_usr = temp - np.diag(np.diag(temp)) + diags(np.ones(len(users)))
        temp = graph.T*update_usr*graph*C/pref_ad
        update_ads = temp - np.diag(np.diag(temp)) + diags(np.ones(len(ads)))
    return update_usr, update_ads


def e_inco_simrank(update_usr, update_ads):

    tar_usr_simple = -update_usr[users.index(user)].A1
    tar_ad_simple = -update_ads[ads.index(ad)].A1
    tar_usr_simple[users.index(user)] = 1
    tar_ad_simple[ads.index(ad)] = 1
    common_user = (graph*graph.T[:, users.index(user)]).T.A[0]
    common_ad = (graph.T * graph[:, ads.index(ad)]).T.A[0]

    geo_user = evident_calc(1, tar_usr_simple, common_user)
    geo_ad = evident_calc(0, tar_ad_simple, common_ad)
    exp_user = evident_calc(1, tar_usr_simple, common_user)
    exp_ad = evident_calc(0, tar_ad_simple, common_ad)
    return tar_usr_simple, tar_ad_simple, geo_user, geo_ad, exp_user, exp_ad


def simrank():
    update_usr, update_ads = simple_simrank(10)
    tar_usr_simple, tar_ad_simple, geo_user, geo_ad, exp_user, exp_ad = e_inco_simrank(
        update_usr, update_ads)

    for _ in range(3):
        sort_inorder(tar_usr_simple, line_1, users)
        sort_inorder(tar_ad_simple, line_2, ads)
        sort_inorder(geo_user, line_3, users)
        sort_inorder(geo_ad, line_4, ads)
        sort_inorder(exp_user, line_5, users)
        sort_inorder(exp_ad, line_6, ads)


if __name__ == "__main__":
    simrank()

    print ','.join(line_1)
    print ','.join(line_2)
    print ','.join(line_3)
    print ','.join(line_4)
    print ','.join(line_5)
    print ','.join(line_6)
```

> For source codes, you can refer to my Github repo [here](https://github.com/Zhenye-Na/cs498HS4/tree/master/hw2)


## References

[1] David Easley and Jon Kleinberg, [*"Networks, Crowds, and Markets: Reasoning about a Highly Connected World - Chapter 14.2"*](https://github.com/Zhenye-Na/cs498HS4/blob/master/hw1/networks-book-ch14.pdf)  
[2] HITS algorithm from wiki, [*"HITS algorithm"*](https://en.wikipedia.org/wiki/HITS_algorithm#Algorithm)  
[3] Weiren Yu, Xuemin Lin, Wenjie Zhang [*"Towards Efficient SimRank Computation over Large Networks"*](https://www.doc.ic.ac.uk/~wyu1/ppt/oral/icde13.pdf)


<style>
.center {
    display: block;
    margin-left: auto;
    margin-right: auto;
}
</style>