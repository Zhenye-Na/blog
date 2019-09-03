---
layout: article
title: "Backtracking"
date: 2018-08-29
excerpt: "How to understand Backtracking and Recursion?"
tags: [Algorithms, Backtracking]
key: backtracking
---

# Backtracking

If the required function does not accept more parameters that we need, we can create a `helper()` function to help us :) like the name

- a **helper function** that accepts more parameters
- extra params can represent current state, previous choices etc.

```cpp
returnType functionName(params) {
    // blablabla
    return helper(params, moreParams);
}

returnType helper(params, moreParams) {
    // blabla
}
```


## Backtracking 

Finding solution(s) by trying solutions and then abandoning them if they are not suitable.

- a **"brute force"** algorithm technique -> (try all possible solutions)
- often implemented **recursively**


Applications:

- permutations
- parsing languages
- anagrams, crosswords, word jumbles, 8 queens
- ...


### Backtracking algorithms

*A general pseudo-code algorithm for backtracking problems:*

```c
Explore(decisions):
    if (there are no more decisions to make) {
        stop
    } else {
        for (each available choice C for this decision) {
            Choose C
            Explore the remaining decisions that follow C
            Un-choose C (backtrack!!!!)
        }
    }
```

Related problems in LeetCode:

- [x] 46. Permutations
- [x] 78. Subsets


## Summary

什么时候用回溯法?

```
如果题目要求求出所有满足条件的解，一般来说是用回溯法，记住回溯法的模板，对不同的题目只需要修改这个条件即可。  
```

回溯法的本质是在问题的解空间树上做**深度优先搜索**（DFS）。这节课主要讲了四个排列组合的问题，分别是子集，带重复元素的子集，全排列，带重复元素的全排列。本文分析求子集的问题，给出程序模板。

**题目1**：给定一个含不同整数的集合，返回其所有的子集。

**样例：**

如果 S = `[1,2,3]`，有如下的解：

```c
[
  [3],
  [1],
  [2],
  [1,2,3],
  [1,3],
  [2,3],
  [1,2],
  []
]
```

**代码**：

```java
public class Solution {
    public List<List<Integer>> subsets(int[] nums) {
        List<List<Integer>> results = new ArrayList<List<Integer>>();
        helper(nums,results,new ArrayList<Integer>(),0);
        return results;
    }

    // helper function
    public void helper(int[] nums,
                       List<List<Integer>> res,
                       List<Integer> cur,
                       int start){
        List<Integer> subset = new ArrayList<Integer>(cur);
        res.add(subset);
        
        for(int i=start;i<=nums.length-1;i++){
            // choose
            cur.add(nums[i]);
            
            // explore
            helper(nums,res,cur,i+1);
            
            // un-choose
            cur.remove(cur.size()-1);
        }
    }
}
```

**写的时候要注意递归的三要素**：

1. **递归的定义**。这里的 `helper` 函数定义为：将所有以当前cur子集开头的所有子集（包含当前cur）加入到结果res中。
2. **递归的出口**。即满足什么条件保存答案。这里对每个遍历得到的cur都保存答案。
3. **递归的拆解**。拆解为更小规模的问题。

注意理解这里的DFS思想: 当前 `cur` 开头的所有子集找完了，才去找下一个 `cur` 开头的所有子集。


### References

[1] Prof. Marty Stepp, *"CS106B: Programming Abstractions lecture slides"*
