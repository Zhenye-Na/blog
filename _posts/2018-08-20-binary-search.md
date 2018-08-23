---
layout: post
title: "Binary Search | LintCode/LeetCode Summary"
date: 2018-08-20
excerpt: "Binary Search Algorithm"
tags: [Algorithms, Binary Search, LeetCode/LintCode]
---

> 本人的 LintCode [**题解**](https://github.com/Zhenye-Na/LxxxCode) 以及 [**分析**](https://lintcode-solutions.gitbook.io/project/)

# Binary Search | LintCode/LeetCode 总结

- 本总结参考/复制/修改了很多综合帖的内容，全部参考文档会赋予文章底部。
- 作者：公瑾
- 转载请注明出处：[https://github.com/yuzhoujr/leetcode](https://github.com/yuzhoujr/leetcode)

## Binary Search | 基础

> 用途：**针对Sorted数组查找的算法**  
> 时间复杂度: `O(log(n))`

二分查找法的前置条件要拥有一个**已经Sorted**好的序列，这样在查找所要查找的元素时, 首先与序列中间的元素进行比较, 如果大于这个元素, 就在当前序列的后半部分继续查找, 如果小于这个元素, 就在当前序列的前半部分继续查找, 直到找到相同的元素, 或者所查找的序列范围为空为止.

> 伪代码:

```java
left = 0, right = n -1
while (left <= right)
    mid = (left + right) / 2
    case
        x[mid] < t:    left = mid + 1;
        x[mid] = t:    p = mid; break;
        x[mid] > t:    right = mid -1;
return -1;
```


## Binary Search | 痛点

**十个二分九个错**：编程珠玑的作者Jon Bentley，布置作业让他的学生们写二分查找，然后他一个个来看。结果呢，他发现 `90%` 是错的。

按照上面的伪代码写出了下列的Python代码

```python
def binarySearch(arr, target):
    l , r = 0, len(arr) - 1  
    while l <= r:            
        mid = (l + r) // 2
        if arr[mid] == target:
            return mid
        if target > arr[mid]:
            l = mid + 1
        else:
            r = mid - 1
    return -1
```

接下来说说二分查找的一些痛点。

### 痛点 1:  溢出
> `mid = (l + r) // 2`

在对两个Signed 32-bit数字进行相加时，有可能出现**溢出**，例如下面这种情况：

```java
left = 1, right = Integer.MAX_VALUE
```

当left 与 right 之和超过了所在类型的表示范围的话, 这个和就会成为一个很随机的值, 那么 middle 就不会得到正确的值.
所以, 更稳妥的做法应该是这样的

```python
mid = l + (r - l) // 2
```


### 痛点 2: 边界错误

二分查找算法的边界, 一般来说分两种情况, 一种是左闭右开区间, 类似于 `[left, right)`, 一种是左闭右闭区间, 类似于 `[left, right]`. 

等等，区间是个什么鬼，左闭右开，左闭右闭又是个什么鬼？

区间的定义： 区间有开区间和闭区间，其中又分为全开区间 `(  )`，全闭区间 `[   ]`，左开右闭区间 `(     ]` 和左闭右开区间 `[  )` , 开区间的意思是区间两处的端点值取不到，而闭区间的端点值就可以取到。

例如区间 `[2,6)` ,他是一个左闭右开的区间，那么在这 `2~6` 之间的数字我都可以取到，而且可以取到 `2` ，但不可以取到 `6` .

需要注意的是, 循环体外的初始化条件, 与循环体内的迭代步骤, 都必须遵守**一致的区间规则**, 也就是说, 如果循环体初始化时, 是以左闭右开区间为边界的, 那么循环体内部的迭代也应该如此. 如果两者不一致, 会造成程序的错误. 比如下面就是错误的二分查找算法:

```python
def binarySearch(arr, target):
    l , r = 0, len(arr)
    while l < r:            
        mid = (l+r)//2
        if arr[mid] == target:
            return mid
        if target > arr[mid]:
            l = mid + 1
        else:
            r = mid - 1
    return -1
```


这个算法的错误在于, 在循环初始化的时候, 初始化 `r = len(arr)`, 也就是采用的是左闭右开区间, 而当满足 `target < arr[mid]` 的条件是, target 如果存在的话应该在 `[left, mid)` 区间中, 但是这里却把 `r` 赋值为 `mid - 1` 了, 这样, 如果恰巧 mid-1 就是查找的元素, 那么就会找不到这个元素.

下面给出两个算法, 分别是正确的**左闭右闭**和**左闭右开**区间算法, 可以与上面的进行比较:

**左闭右闭：包括End区间，end inclusive**

```python
def binarySearch(arr, target):
    '''
    定义：在[l...r]的范围里寻找target, 因为这里定义是需要将r归入范围区间, inclusive，所以while循环的边界需要包含r
    '''
    l , r = 0, len(arr) - 1  
    while l <= r:            

        mid = (l+r)//2
        if arr[mid] == target:
            return mid
        if target > arr[mid]:
            l = mid + 1   # 明确区间的要求，只要使用过的，一律绕过。
        else:
            r = mid - 1   # 明确区间的要求，只要使用过的，一律绕过。
    return -1

```

**左闭右开，不包括End区间, end exclusive**

```python
def binarySearch(arr, target):
    '''
    定义：在[l...r)的范围里寻找target, 因为这里定义是不需要将end归入范围区间
    exclusive，所以while循环的边界小于End即可，因为length本身长度会比index大1
    相对应的，每次target的value小于arr[mid]的时候，我们在重新定义新的end时候，
    也选择exclusive的模式，r = mid即可
    '''
    l , r = 0, len(arr)
    while l < r:            
        mid = l + (r-l)//2
        if arr[mid] == target:
            return mid
        if target > arr[mid]:
            l = mid + 1  
        else:
            r = mid
    return -1

```

### 痛点 3 :  死循环
上面的情况还只是把边界的其中一个写错, 也就是右边的边界值写错, 如果两者同时都写错的话, 可能会造成死循环, 比如下面的这个程序:

```python
    l , r = 0, len(arr) - 1
    while l <= r:            
        mid = l + (r - l) // 2
        if arr[mid] == target:
            return mid
        if target > arr[mid]:
            l = mid
        else:
            r = mid
    return -1
```

这个程序采用的是左闭右闭的区间. 但是, 

当 `target < arr[mid]` 的时候, 那么下一次查找的区间应该为 `[mid + 1, right]`, 而这里变成了 `[mid, right]`;  

当 `target > arr[mid]` 的时候, 那么下一次查找的区间应该为 `[left, mid - 1]`, 而这里变成了 `[left, mid]`. 两个边界的选择都出现了问题, 因此, 有可能出现某次查找时始终在这两个范围中轮换, 造成了程序的死循环.



## Binary Search | 模板选择

@gengwuli 提出了模板一致性的观点，我也十分赞同。公瑾的策略是 `95%` 的情况下都用以下模板：

```python
def binarySearch(arr, target):
    l , r = 0, len(arr) - 1  
    while l <= r:            
        mid = (l + r) // 2
        if arr[mid] == target:
            return mid
        if target > arr[mid]:
            l = mid + 1
        else:
            r = mid - 1 
    return -1
```

极个别情况会采用以下的模板：

```python
def binary_search(array, target):
    start, end = 0, len(array) - 1
    while start + 1 < end:
        mid = (start + end) / 2
        if array[mid] == target:
            start = mid
        elif array[mid] < target:
            start = mid
        else:
            end = mid

    if array[start] == target:
        return start
    if array[end] == target:
        return end
    return -1
```

至于为什么不采用一个模板，是因为在大部分题的时候，运用第一种模板能够有更好的可读性
而第二个模板专门针对的是第一个模板的短板：当要access数组边界的数，如果边界的数在运行中出现更改，可能越界。虽然这种情况也可以用Edge Case来写，但太过麻烦。这点我们后面具体说来。

这里插一句话：**用的惯的模板**才是最适合你的，**切记**



## Binary Search | 题型

<!--![快祝我好人一身平安](https://raw.githubusercontent.com/yuzhoujr/leetcode/master/img/binary_search.png)-->

题目类型分为三类:

1. **有**明确Target
2. **没有**明确Target
3. **没有**明确Target (**可越界类型**）

### 第一类题：有明确 Target 的题型

这一类题，会要求你找一个 `Target` 值，一般找到就返回 `Target` 值的下标或者Boolean函数。基础题目举两个例子：

#### Leetcode 374.  Guess Number Higher or Lower

> 告知 `Target` 是 `1` 到 `N` 之间的一个数，然后返回这个数的下标

```python
class Solution(object):
    def guessNumber(self, n):
        """
        :type n: int
        :rtype: int
        """
        l , r = 0 , n
        while l <= r :
            mid = l + (r-l)//2
            toggle = guess(mid)
            if toggle == 0:
                return mid
            if toggle == 1:
                l = mid + 1
            else:
                r = mid - 1
```

#### Leetcode 367.  Valid Perfect Square

> 给定一个数值，判断是不是 `Perfect Square` ，这里只需要从 `0` 到 `Target` 中选择折中点，然后不停乘方和 `Target` 比对即可，因为返回是 `Boolean` ，同样不需要考虑边界

```python
class Solution:
    def isPerfectSquare(self, num):
        """
        :type num: int
        :rtype: bool
        """
        l, r = 0, num
        while l <= r:
            mid = l + (r-l)//2
            if mid ** 2 == num:
                return True
            if num > mid ** 2:
                l = mid + 1
            else:
                r = mid - 1
        return False
```

由于这一类题基本上就是套公式，直接考公式的几率很小。所以Medium以上的题目会对边界的选定模糊化，我们要做的是明确边界，然后再套公式。下面举例二分经典题：

#### 33. Search in Rotated Sorted Array

> 取中间值以后会发现，左边或者右边，至少有一边是sorted的，根据这个特性，搭配下面这个神图，就能理解下一段的代码

<!--![来自水中的鱼](http://3.bp.blogspot.com/-ovV6zYeEdZg/U_ke6coEoAI/AAAAAAAAIc4/lmb1A9FsjgQ/s1600/Picture123.png)-->

```python
class Solution:
    def search(self, nums, target):
        """
        :type nums: List[int]
        :type target: int
        :rtype: int
        """
        if not nums: return -1
        l , r = 0, len(nums) - 1

        while l <= r:
            mid = l + (r - l) // 2
            if target == nums[mid]:
                return mid
            if nums[mid] >= nums[l]:
                if nums[l] <= target <= nums[mid]:
                    r = mid - 1
                else:
                    l = mid + 1
            else:
                if nums[mid] <= target <= nums[r]:
                    l = mid + 1
                else:
                    r = mid - 1
        return -1
```


### 第二类题：没有明确 Target 的题型

> 纳尼，你说你弄不懂到底返回 `left` 还是 `right` ，不慌，边界处理[神器](http://pythontutor.com/visualize.html#mode=display)镇楼。

该神器的使用方法：把代码拷过去，然后initiatize一个object，随便传入一个Test Case，然后点运行。代码会一步一步的跑，你就可以看你 `left` 和 `right` 在每一层迭代之后的值了。

这一类的题比较多变，可能会要你找

* 比Target大的最小值
* 比Target小的最大值
* 满足要求的第一个值
* 不满足要求的最后一个值
* ...

在刷这类题前，我们先看看模板，在迭代退出的时候，`left` 和 `right` 的位置：

![](https://raw.githubusercontent.com/yuzhoujr/leetcode/master/img/binary_ex1.png)

**Case 1:**

```python
Array = [1,2,3,5,6], Target = 4
```

![](http://redirect.viglink.com/?format=go&jsonp=vglnk_15348220615851384&key=a1aa544c3b328def412653f9fc432107&libId=jl2torlg0101x1cs000DAjnsijj44&loc=http%3A%2F%2Fwww.1point3acres.com%2Fbbs%2Fthread-432793-1-1.html&v=1&out=https%3A%2F%2Fraw.githubusercontent.com%2Fyuzhoujr%2Fleetcode%2Fmaster%2Fimg%2Fbinary_case1.jpeg&ref=http%3A%2F%2Fwww.1point3acres.com%2Fbbs%2Fforum-84-1.html&title=Binary%20Search%E7%9A%84%E6%80%BB%E7%BB%93%E5%B8%96%E3%80%90%E4%B8%80%E4%BA%A9%E4%B8%89%E5%88%86%E5%9C%B0%E8%AE%BA%E5%9D%9B%E5%88%B7%E9%A2%98%E7%89%88%E3%80%91%20-&txt=https%3A%2F%2Fraw.githubusercontent.co%20...%20g%2Fbinary_case1.jpeg)

- 首先这个程序肯定返回`-1`。我们的模板对While Loop定义如下：
- `while l <= r:`
- 那么只有当`l > r`的时候，While Loop才会终止。
- 重点来了，当迭代结束后，假设`Target`为4， L和R的位置分别对应着两个条件：
    - `L`对应的是：第一个比4大的坐标, 根据这道题的定义就是比Target大的最小值
    - `R`对应的是：最后一个比4小的坐标，根据这道题的定义就是比Target小的最大值


**Case 2**:

```python
Array = [1,2,3,5,6], Target = 7
```

根据我们 `While Loop` 的特性，有一个 `Edge` 的情况就是，L最大可以等于`len(array)`

![](http://redirect.viglink.com/?format=go&jsonp=vglnk_15348222223051467&key=a1aa544c3b328def412653f9fc432107&libId=jl2torlg0101x1cs000DAjnsijj44&loc=http%3A%2F%2Fwww.1point3acres.com%2Fbbs%2Fthread-432793-1-1.html&v=1&out=https%3A%2F%2Fraw.githubusercontent.com%2Fyuzhoujr%2Fleetcode%2Fmaster%2Fimg%2Fbinary_case2.jpeg&ref=http%3A%2F%2Fwww.1point3acres.com%2Fbbs%2Fforum-84-1.html&title=Binary%20Search%E7%9A%84%E6%80%BB%E7%BB%93%E5%B8%96%E3%80%90%E4%B8%80%E4%BA%A9%E4%B8%89%E5%88%86%E5%9C%B0%E8%AE%BA%E5%9D%9B%E5%88%B7%E9%A2%98%E7%89%88%E3%80%91%20-&txt=https%3A%2F%2Fraw.githubusercontent.co%20...%20g%2Fbinary_case2.jpeg)

这里可以看到，如果我们要返回 `array[l]` ，系统是会报错的，因为我们的L已经越界了，这个局限性是这套模板的小短板，当然，只要大家记住这一点，以后就可以写出相对应的Edge Case处理。

`l` 和 `r` 的位置和定义清楚了以后，我们来做做题。


#### 返回 `l` 的情况： 33. Search in Rotated Sorted Array

> 给了一个Target值，找到在Array里，Target按顺序应该插入的位置。

```python
class Solution:
    def searchInsert(nums, target):
        l, r = 0, len(nums) - 1
        while l <= r:
            mid = l + (r - l) // 2
            if nums[mid] == target:
                return mid
            if target > nums[mid]:
                l = mid + 1
            else:
                r = mid - 1
        return l
```

这里我们同样可以用镇楼法宝模拟下 `L` , `R` 在迭代结束后的下标

```python
Input: [1,3,5,6], 2
Output: 1
```

- `l`的下标是1， 定义是第一个满足条件的最小值。
- `r`的下标是0，定义是最后一个不满足条件的最大值。

我们返回`l` 即可，另外还要说一点，这个模板对于这道题得天独厚的好处就是，不需要考虑当target插入的下标等于`len(arr)`的Edge Case，因为`l`本身就自带这个特性。


#### 返回`r`的情况：458. Last Position of Target (Lintcode)

> 给了一个Target值，找到在Array里，该Target值出现最后的坐标

```python
class Solution:
    def lastPosition(self, nums, target):
        if not nums:
            return -1
        l , r = 0 , len(nums) - 1
        while l <= r:
            mid = l + (r - l) // 2
            if nums[mid] <= target:
                l = mid + 1
            else:
                r = mid - 1
        if nums[r] == target:
            return r
        else:
            return -1
```

这道题的Array里面会有重复，去重的方式就是当 `nums[mid] == target` 的时候，对left进行增值。这样就可以去掉左边重复的数。

举例：

```python
Input: [1, 2, 2, 4, 5, 5]
target = 2, return 2
```

- `l`的下标是3， 定义是第一个不满足条件的值
- `r`的下标是2，定义是最后一个满足条件的值

所以返回`r`


#### 楼上两题的合体：34. Search for a Range

> 分别找到第一个位置，和最后一个位置，返回一个区间。

```python
class Solution:
    def searchRange(self, nums, target):
        l = self.findLeft(nums, target)
        r = self.findRight(nums, target)
        return [l, r] if l <= r else [-1, -1]


    def findLeft(self, nums, target):
        l, mid, r = 0, 0, len(nums)-1
        while l <= r:
            mid = l + (r - l) // 2
            if nums[mid] < target:
                l = mid + 1
            else:
                r = mid - 1
        return l    


    def findRight(self, nums, target):
        l, mid, r = 0, 0, len(nums)-1
        while l <= r:
            mid = l + (r - l) // 2
            if nums[mid] <= target:
                l = mid + 1
            else:
                r = mid - 1
        return r
```



### 第三类题：没有明确Target的题型，可越界类型

这种类型的题目，用 `l <= r` 的模板可能会越界，我们可以填写个别的Edge Case处理，或者套用其他比如 `l < r` 或者 `l + 1 < r`的模板解决。


#### 162.  Find Peak Element

找峰值，`mid` 比对的区间是 `nums[mid + 1]` ，这种情况当 `l` 越界等于 `len(nums)` 就会报错，所以可以选择用 `while l + 1 < r` 的区间，最终对 `l` 和`r` 进行比对。当然也可以写Edge处理。

```python
class Solution:
    def findPeakElement(self, nums):
        """
        :type nums: List[int]
        :rtype: int
        """
        l , mid , r = 0, 0, len(nums) - 1
        while l + 1 < r:
            mid = l + (r-l) // 2
            if nums[mid] < nums[mid + 1]:
                l = mid
            else:
                r = mid 
        if nums[l] > nums[r]: return l
        else: return r
```

#### 153.  Find Minimum in Rotated Sorted Array

这道题最终要返回的 `nums[l]`。同样，可以写 Edge Case 处理，也可以使用 `while l < r` 或者 `while l + 1 < r` 来解。


```python
class Solution(object):
    def findMin(self, nums):
        """
        :type nums: List[int]
        :rtype: int
        """
        l, r = 0, len(nums) - 1
        while l + 1 < r:
            mid = l + (r - l) // 2
            if nums[mid] > nums[r]:
                l = mid
            else:
                r = mid 
        return min(nums[l], nums[r])
```


## 参考
1. [二分查找学习札记](http://www.cppblog.com/converse/archive/2009/10/05/97905.aspx) 作者: 那谁
2. [Search in Rotated Sorted Array 配图](http://redirect.viglink.com/?format=go&jsonp=vglnk_15348223956231555&key=a1aa544c3b328def412653f9fc432107&libId=jl2torlg0101x1cs000DAjnsijj44&loc=http%3A%2F%2Fwww.1point3acres.com%2Fbbs%2Fthread-432793-1-1.html&v=1&out=http%3A%2F%2Ffisherlei.blogspot.com%2F2013%2F01%2Fleetcode-search-in-rotated-sorted-array.html&ref=http%3A%2F%2Fwww.1point3acres.com%2Fbbs%2Fforum-84-1.html&title=Binary%20Search%E7%9A%84%E6%80%BB%E7%BB%93%E5%B8%96%E3%80%90%E4%B8%80%E4%BA%A9%E4%B8%89%E5%88%86%E5%9C%B0%E8%AE%BA%E5%9D%9B%E5%88%B7%E9%A2%98%E7%89%88%E3%80%91%20-&txt=http%3A%2F%2Ffisherlei.blogspot.com%2F20%20...%20d-sorted-array.html) 作者: 水中的鱼
3. [[二分/排序/搜索] Binary Search的总结帖](http://www.1point3acres.com/bbs/thread-432793-1-1.html) 作者: junior147147