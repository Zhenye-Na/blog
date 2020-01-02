---
layout: article
title: "GitLab, Jenkins, SonarQube 持续集成实践"
date: 2019-12-16
modify_date: 2019-12-16
excerpt: "CI/CD Practice with GitLab, Jenkins and SonarQube"
tags: [Jenkins, SonarQube, CI/CD]
mathjax: false
mathjax_autoNumber: false
key: ci-cd-practice
---



# GitLab, Jenkins, SonarQube 持续集成实践

**目录**

1. 持续集成
2. 持续交付
3. 持续部署
4. CI 实现思路 (Git, Jenkins, SonarQube)



> **网课的一些笔记, 不全面, 仅供参考**

## 持续集成, 持续交付和持续部署

> 「 持续集成 (Continuous Integration) 」、「 持续交付 (Continuous Delivery) 」和「 持续部署 (Continuous Deployment) 」



### 持续集成 Continuous Integration



<img src="https://github.com/Zhenye-Na/Zhenye-Na.github.io/blob/master/assets/images/posts-img/jenkins-sonarqube-cicd/409-images-for-snap-blog-postedit_image1.png?raw=true" style="zoom:67%;" />



**集成**的概念就是开发人员成块的将开发好的代码传到一个系统之中, 集成结束后会对其进行部署上线

**持续集成**就是频繁性的将开发中的代码提交到系统中, 然后进行 build, test 判断新代码是否通过, 可以 merge 到 master



#### 优点

1. 快速发现错误, 容易定位错误
2. 节省人力成本
3. 加快开发进度
4. 实时交付



### 持续交付 Continuous Delivery



<img src="https://github.com/Zhenye-Na/Zhenye-Na.github.io/blob/master/assets/images/posts-img/jenkins-sonarqube-cicd/db7198e3c39e4656e18efcb4bd1b20b1_hd.jpg?raw=true" style="zoom:67%;" />



**持续交付**是指在持续集成的环境基础之上, 将代码部署到预生产环境.

持续交付: 代码开发 → 单元测试 → 合并代码 → 测试 → 部署生产





### 持续部署 Continuous Deployment



<img src="https://github.com/Zhenye-Na/Zhenye-Na.github.io/blob/master/assets/images/posts-img/jenkins-sonarqube-cicd/409-images-for-snap-blog-postedit_image3-auto.png?raw=true" style="zoom:67%;" />



将最后部署到 production 的过程自动化



> 持续部署与持续交付的区别: 部署到生产环境是自动化与否



## Git

> 简单的那种操作比如 `add`, `commit`, `push`, `pull` 就不写了 ...



### 回退历史版本

比如误删除文件内容, 但是并没有覆盖缓存区 staging area

```shell
$ git checkout <filename>

# 使用以前上传的 staging area 文件进行覆盖
```



覆盖了暂存区

```shell
$ git reset HEAD <filename>
```



如果已经进行了多次覆盖

```shell
$ git log --online
$ git reset --hard <commit_id>
```



对历史的所有记录进行查询 (比如已经 reset 去之前的 版本了, 那么之后的版本 `git log` 是看不到的)

```shell
$ git reflog
$ git reset --hard <commid_id>
```



### 分支管理



#### 查看, 创建分支

```shell
$ git branch

$ git branch <branch_name>
```



#### 切换分支

```shell
$ git checkout <branch_name>
```



#### 合并分支

创建 `develop-xxx-feature` 分支进行功能的开发, 等 feature 基本完成后, 把 `master` merge 到 `develop-xxx-feature` branch. 因为 master 是一直都要可以部署的, 所以讲 master merge 过来, 进行测试. 待完成后将 `develop-xxx-feature` merge 到 master 上



```shell
$ git merge master

$ git merge develop
```



`git merge` 会创建新的 `commit id`



#### 删除分支

```shell
$ git branch -d <branch_name>
```



> 合并分支冲突怎么办? 不同的情况, 不同处理
>
> 将 master branch pull 到你自己的分支中



### 标签

```shell
$ git tag -a "version" <commit_id> -m "message"
```



## Jenkins 持续集成服务

快问快答:

1. Jenkins 是一个开源的持续集成工具, 由 Java 开发
   1. 就是一个调度平台, 本身不处理任何事情, 调用*插件完成所有的工作*
2. Jenkins 可以将各种开源工具进行集成





## Sonar Qube 代码质检

> Java 编写的, 很吃内存

在 Jenkins 上安装 Sonar Qube 的插件, 就可以完成 pull -> check -> build 这一系列操作











## References

1. Vincent Driessen, [A successful Git branching model](https://nvie.com/posts/a-successful-git-branching-model/)
2. second