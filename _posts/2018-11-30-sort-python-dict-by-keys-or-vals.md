---
layout: post
title: "Sort a Python dictionary by keys or values"
date: 2018-11-30
modify_date: 2018-11-30
excerpt: "Sort a Python dictionary by keys or values"
tags: [Python, Data Structures]
mathjax: true
mathjax_autoNumber: true
---

# Sort a Python dictionary by keys or values


## Sort a dictionary by keys


```python
marvel = {'Wolverine':12,
          'Spider-Man':23,
          'Thor':34,
          'Iron Man':45,
          'Hulk': 56,
          'Captain America': 67,
          'Daredevil': 78,
          'Punisher': 89,
          'Deadpool': 90}

for key in sorted(marvel.iterkeys()):
    print "%s: %s" % (key, marvel[key])
```

**Results**:

```python
>>> marvel = {'Wolverine':12,
...           'Spider-Man':23,
...           'Thor':34,
...           'Iron Man':45,
...           'Hulk': 56,
...           'Captain America': 67,
...           'Daredevil': 78,
...           'Punisher': 89,
...           'Deadpool': 90}
>>> for key in sorted(marvel.iterkeys()):
...     print "%s: %s" % (key, marvel[key])
...
Captain America: 67
Daredevil: 78
Deadpool: 90
Hulk: 56
Iron Man: 45
Punisher: 89
Spider-Man: 23
Thor: 34
Wolverine: 12
```

## Sort a dictionary by values

```python
marvel = {'Wolverine':12,
          'Spider-Man':23,
          'Thor':34,
          'Iron Man':45,
          'Hulk': 56,
          'Captain America': 67,
          'Daredevil': 78,
          'Punisher': 89,
          'Deadpool': 90}

for key, value in sorted(marvel.iteritems(), key=lambda (k,v): (v,k)):
    print "%s: %s" % (key, value)
```

**Results**:

```python
>>> marvel = {'Wolverine':12,
...           'Spider-Man':23,
...           'Thor':34,
...           'Iron Man':45,
...           'Hulk': 56,
...           'Captain America': 67,
...           'Daredevil': 78,
...           'Punisher': 89,
...           'Deadpool': 90}
>>>
>>> for key, value in sorted(marvel.iteritems(), key=lambda (k,v): (v,k)):
...     print "%s: %s" % (key, value)
...
Wolverine: 12
Spider-Man: 23
Thor: 34
Iron Man: 45
Hulk: 56
Captain America: 67
Daredevil: 78
Punisher: 89
Deadpool: 90
```




<style>
.center {
  display: block;
  margin-left: auto;
  margin-right: auto;
}
</style>