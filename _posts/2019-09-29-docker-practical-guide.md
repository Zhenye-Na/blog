---
layout: article
title: "Docker 容器技术 (基础篇) | 学习笔记"
date: 2019-09-29
modify_date: 2019-10-06
excerpt: "Docker practical guide for beginners"
tags: [Docker]
key: docker-practical-guide
---

# Docker 容器技术 (基础篇) | 学习笔记

<div>
  <img src="http://www.datacenterdude.com/wp-content/uploads/2015/03/docker-banner.png">
</div>



> 本文将介绍 Docker 核心概念, 是什么, 能干什么, Docker 整体架构, 和传统虚拟机的区别. 什么是容器虚拟化技术, 深刻理解镜像, 容器, 仓库的各种概念和操作. 能够熟练掌握 Dockerfile 的编写和构建并使用 Dockerfile 来制作复杂镜像, 能够使用容器卷完成容器间数据共享和持久



**知识图谱**

1. Docker 简介
2. Docker 安装
3. Docker 常用命令
4. Docker 镜像
5. Docker 容器数据卷
6. Dockerfile 解析
7. Docker 常用安装
8. 本地镜像发布到阿里云 (*)



[TOC]

## 0. 前提知识储备

- 熟悉 Linux 命令和相关背景知识
- 熟悉 Git 相关知识



## 1. Docker 简介

### 1.1. 什么是 Docker

> 基于 Go 语言的云开源项目
>
> 简单来说, 就是将"代码+环境"打包在一起, 使应用达到跨平台无缝接轨使用
>
> "一次封装, 随处运行"

Docker 解决了运行环境和配置问题的**软件容器**, 方便做持续集成并有助于整体发布的容器虚拟化技术



### 1.2. Docker 可以做什么

#### 1.2.1. 虚拟机技术

虚拟机 (Virtual Machine) 就是带环境安装的一种解决方案

它可以在一种操作系统里面运行另一种操作系统. 应用程序对此毫无感知, 因为虚拟机看上去跟真实系统一模一样, 但是对于底层系统来说, 虚拟机就是一个普通文件, 不需要就可以删除. 这就能够使得应用程序, 操作系统和硬件三者之间的逻辑不变.

虚拟机的缺点:

1. 资源占用多
2. 冗余步骤多
3. 启动缓慢



#### 1.2.2. Linux 容器技术

Linux 容器不是模拟一个完整的操作系统, 而是对进程进行隔离. 只需要软件工作所需的库资源和设置

Docker 与传统虚拟化方式的不同之处:

1. 传统虚拟机技术是虚拟出一套硬件, 在其上运行一个完整操作系统, 在该系统上再运行所需应用进程
2. 而容器内的应用进程直接运行于宿主的内核, 容器没有自己的内核, 而且也没有进行硬件虚拟
3. 每个容器之间互相隔离, 每个容器有自己的文件系统, 容器之间进程不会相互影响, 能区分计算资源



#### 1.2.3. 二者对比

<div align="center">
  <img src="http://jasonhzy.github.io/images/docker/docker-virtual.png" width="80%">
  <p>图片来源: https://jasonhzy.github.io/2018/03/06/docker-command/</p>
</div>



## 2. Docker 安装

### 2.1. Docker 架构图

<div align="center">
  <img src="http://www.tiejiang.org/wp-content/uploads/2018/12/20181225023639114.jpg?imageView2/1/w/375/h/250/q/100" width="80%">
</div>



### 2.2. Docker 的基本组成

#### 2.2.1. 镜像 Image

Docker 镜像就是一个**只读**的模板, 镜像可以用来创建 Docker 容器.

> 一个镜像可以创建很多容器


容器和镜像的关系可以类比 OOP 中的类和对象

- 容器 <-> 对象
- 镜像 <-> 类



#### 2.2.2. 容器 Container

Docker 利用容器 Container 独立运行一个或者一组应用. **容器是用镜像创建的运行实例**.

它可以被启动, 开始, 停止, 删除. 每个容器都是相互隔离, 保证安全的平台.

> 可以把容器看做是一个<u>简易版</u>的 Linux 环境 (包括 root 用户权限, 进程空间, 用户空间和网络空间) 和运行在其中的应用程序

容器的定义和镜像几乎一模一样, 也是一堆层的统一是叫, 唯一区别是**容器最上面一层是可读写的**.



#### 2.2.3. 仓库 Repository

仓库是集中存放镜像文件的场所

**仓库** (Repository) 和**仓库注册服务器** (Registry) 是有区别的, 仓库注册服务器往往存放多个仓库, 每个仓库又包含多个镜像, 每个镜像又有不同的标签



#### 2.2.4. 总结

Docker 本身是一个容器运行载体或者称之为管理引擎, 我们把应用程序和配置以来打包好形成一个可以交付使用的<u>运行环境</u>. 打包好的运行环境就是一个 Image 镜像文件. 只有通过镜像文件, 生成 Docker 容器. Image 文件就是这个容器的模板. Docker 根据 Image 文件生成容器的实例. <u>同一个 Image 文件, 可以生成多个同时运行的容器实例</u>.



- Image 文件生成的容器实例, 本身也是一个文件, 镜像文件
- 一个容器运行一种服务, 当我们需要的时候, 就可以通过 Docker 客户端创建一个对应的运行实例, 也就是我们的容器
- 仓库, 类比 GitHub



### 2.3. 运行 Hello-World

```
$ docker run <image_name>
```

现在本地查找镜像, 找不到就去 Docker Hub 下载, 生成容器. Docker Hub 如果找不到, 返回错误信息



### 2.4. Docker 的底层工作原理

Client-Server 结构的系统, Docker 守护进程 (Daemon) 在主机上, 然后通过 Socket 链接从客户端访问, 守护进程从客户端接受命令并管理运行在主机上的容器.

> 容器, 是一个运行时环境



### 2.5. 为什么 Docker 比 VM 快很多?

1. Docker 有着比虚拟机更少的抽象层. 由于 Docker 不需要 Hypervisor 实现硬件资源虚拟化, 运行在 Docker 容器上的程序直接使用都是实际物理机的硬件资源. 因此在 CPU, 内存利用率上 Docker 将会在效率上有明显优势
2. Docker 利用的是宿主机的内核, 而不需要 Guest OS. 重新创建容器时, 不需要重新加载 OS 内核.



## 3. Docker 常用命令

### 3.1. 帮助命令

查看 Docker 版本号

```
$ docker version
```

查看当前 Docker 有关信息

```
$ docker info
```

帮助

```
$ docker --help
```



### 3.2. 镜像命令

#### 3.2.1. docker images

列出本地的 Images

```
$ docker images
```

运行镜像

```
$ docker run <image_name>
```

- REPOSITORY: 镜像仓库源
- TAG: 镜像的标签
- IMAGE ID: 镜像 id
- CREATED: 镜像创建时间
- SIZE: 镜像大小

同一个仓库源可以有多个 tag, 代表这个仓库源的不同版本. `REPOSITORY:TAG` 来定义不同的镜像.

若不指定版本标签, 默认使用 `latest`



常用 OPTIONS:

- `-a`: 列出本地所有的镜像 (含<u>中间映像层</u>)
- `-q`: 只显示镜像 id (`IMAGE ID`)
- `--digests`: 显示镜像的摘要信息
- `--no-trunc`: 显示完整的镜像信息



#### 3.2.2. docker search

```
$ docker search tomcat
```

OPTIONS:

- `-s`: 列出 stars 数不小于指定值
- `--no-trunc`: 显示完整镜像信息
- `--automated`: 只列出 `automated build` 类型的镜像



#### 3.2.3. docker pull

> 下载镜像
>
> docker pull 镜像[:标签]

```
$ docker search -s 30 tomcat
$ docker pull tomcat
```



#### 3.2.4. docker rmi

> 删除镜像



**删除单个镜像**

```
$ docker rmi -f hello-world[:latest]
```

如果不写标签, 默认删除的是 latest



**删除多个镜像**

```
$ docker rmi -f hello-world nginx
```



**删除全部镜像**

```
$ docker rmi -f $(docker images -qa)
```



### 3.3. 容器命令

> 有镜像才能创建容器 (重要前提!!!)

#### 3.3.1. 新建并启动容器

```
$ dcoker run [OPTIONS] IMAGE [COMMAND] [ARGS]
```

- 本地有 - 新建运行
- 本地没有 - 去 dockerhub 下载



常用 OPTIONS:

- `--name`: 为容器指定一个
- `-d`: <u>后台运行容器</u>, 并返回容器 `id`, 即**启动守护式容器**
- `-i`: 以<u>交互模式</u>运行容器. 通常与 `-t` 同时使用
- `-t`: 为容器<u>重新分配一个伪输入终端</u>, 通常与 `-i` 同时使用
- `-P`: 随机端口映射
- `-p`: 指定端口映射, 一下四种格式
  - `ip:hostPort:containerPort`
  - `ip::containerPort`
  - `hostPort:containerPort`
  - `containerPort`



```
$ docker run -it <image_id>
# 新建, 进入容器, 创建一个命令行
```



> 启动交互式容器



#### 3.3.2. 列出当前所有正在运行的容器

```
$ docker ps
CONTAINER ID    IMAGE    COMMAND    CREATED    STATUS    PORTS
```

查看 docker 中哪些 container 正在运行



常用 OPTIONS

- `-a`: 列出当前所有<u>正在运行</u>的容器 + <u>历史上运行过</u>的容器
- `-l`: 显示<u>最近</u>创建的容器
- `-n`: 显示最近 `n` 个创建的容器
- `-q`: **静默模式, 只显示容器编号**
- `--no-trunc`: 不截断输出



#### 3.3.3. 退出容器

```
$ exit
# 离开同时关闭 container, 想要再次进入需要 docker run ...

$ CTRL + P + Q
# 离开, 但是别关闭, 还想再回来使用
# docker ps 查看 container 是否还在运行
```



一个很形象的比喻:

- `exit` : 出门关灯
- `CTRL + P + Q` : 出门不关灯



#### 3.3.4. 启动容器

```
$ docker start <container_id or container_name>
```

`CTRL + P + Q` 离开容器环境以后, 如果想再次进入, 就可以使用上面的命令, 重新进入 container



#### 3.3.5. 重启容器

```
$ docker restart <container_id or container_name>
```

将停止掉的 container 重新启动



#### 3.3.6. 停止容器

```
$ docker stop <container_id or container_name>
```

让该容器"慢慢"停止, 有一段 grace period



#### 3.3.7. 强制停止容器

```
$ docker kill <container_id or container_name>
```

立刻停止 (拔电源)



#### 3.3.8. 删除已经停止的容器

```
$ docker rm <container_id>
```

没有 `-f` 强制删除



**一次性删除多个容器**

- `docker rm -f $(docker ps -a -q)`
- `docker ps -a -q | xargs docker rm`



#### 3.3.9. 重要说明

##### 启动守护式容器

```
$ docker run -d <container_name>
```

但是如果我们运行 `docker ps -a` 进行查看, 会发现容器已经退出

> Docker 容器后台运行, 就必须有一个前台进程



##### 查看容器日志

```
$ docker logs -f -t --tail <container_id>
```

- `-t`: 时间戳
- `-f`: 跟随最新的日志打印 (追加新的日志)
- `--tail`: 显示最后多少条



##### 查看容器内运行的进程

```
$ docker top <container_id>
```


##### 查看容器内部细节

```
$ docker inspect <container_id>
```

Docker 镜像就像是"套娃 - 一层套着一层"



##### 进入正在运行的容器并以命令行交互

```
$ docker exec -it <container_id> ls -l
# 直接返回结果
```

```
$ docker attach <container_id>
```

`exec` 和 `attach` 的区别:

- `exec`: 在容器中打开新的终端, 并且**可以启动新的进程**
- `attach`: 直接进入容器启动命令的终端, **不会启动新的进程**



##### 从容器内拷贝文件到主机上

```
$ docker cp <container_id>:<path> <target_path>
```



### 3.4 总结

Docker 常用命令

<div align="center">
  <img src="https://raw.githubusercontent.com/philipz/docker_practice/master/_images/cmd_logic.png" width="80%">
</div>



## 4. Docker 镜像

### 4.1. 什么是镜像

> 镜像 Image 是一种轻量级, 可执行的独立软件包, **用来打包软件运行环境和基于运行环境开发的软件**. 它包含运行某个软件所需的所有内容, 包括代码, 运行时, 库, 环境变量和配置文件



#### 4.1.1. 联合文件系统 UnionFS

Union 文件系统 ([UnionFS](http://en.wikipedia.org/wiki/UnionFS)) 是一种分层, 轻量级并且高性能的文件系统，它支持对文件系统的修改作为一次提交来<u>一层层的叠加</u>，同时可以将不同目录挂载到同一个虚拟文件系统下 (unite several directories into a single virtual filesystem)

**Union 文件系统是 Docker 镜像的基础**. 镜像可以通过分层来进行继承，基于基础镜像 (没有父镜像), 可以制作各种具体的应用镜像



**特性:**

一次同时加载多个文件, 但从外面看起来, 只能看到一个文件系统, 联合加载会把各层文件系统叠加, 这样最后的文件系统会包含所有底层的文件和目录



> Docker 中使用的 AUFS（AnotherUnionFS）就是一种 Union FS。 AUFS 支持为每一个成员目录（类似 Git 的分支）设定只读（readonly）、读写（readwrite）和写出（whiteout-able）权限, 同时 AUFS 里有一个类似分层的概念, 对只读权限的分支可以逻辑上进行增量地修改(不影响只读部分的)。
>
> Docker 目前支持的 Union 文件系统种类包括 AUFS, btrfs, vfs 和 DeviceMapper。



#### 4.1.2. Docker 镜像加载原理

Docker 镜像实际上是由一层一层的文件系统组成, 这种层级的文件系统 UnionFS.

- bootfs (boot file system) 主要包含 bootloader 和 kernel
  - bootloader 主要是引导加载 kernel, Linux 刚启动时回家再 bootfs 文件系统, **在 Docker 镜像的最底层是 bootfs**, 包含 boot 加载器和内核
  - 当 boot 加载完成之后, 整个内核就都在内存之中, 此时内存的使用权已经由 bootfs 转交给内核, 系统会卸载 bootfs
- rootfs (root file system), 在 bootfs 智商, 包含的就是经典 Linux 系统中的 `/dev`, `/proc`, `/bin` 等标准目录和文件



<div align="center">
  <img src="https://testerhome.com/uploads/photo/2017/06b60903-0a74-41fa-8e2a-b51694bb7db7.png!large" width="50%">
</div>



#### 4.1.3. 镜像分层

以 `docker pull` 为例, 下载过程可以看到 docker 镜像好像是一层一层在下载



> 以 tomcat 为例, `docker pull` 下来的镜像文件有 400 MB, 为何文件如此之大?
>
> 答: "镜像分层", kernel -> centOS -> jdk8 -> tomcat, 虽然我们只是用到了最后的 tomcat, 但是所有之前的都下载了



#### 4.1.4. 为什么 Docker 镜像是分层结构?

> 共享资源

比如: 多个镜像都从相同的 base 镜像构建而来, 那么宿主机只需要在磁盘上保存一份 base 镜像. 同时内存中也只需加载一份 base 镜像, 就可以为所有容器服务了. 而且镜像的每一层都可以被共享



### 4.2. 镜像有什么特点?

特点:

- Docker 镜像都是只读的
- 当容器启动时, 一个新的可写层被加载安东镜像的顶部
- 这一层通常被称作"容器层", "容器层"之下被叫做"镜像层"



### 4.3. Docker 镜像操作补充

```
$ docker commit
```

提交容器副本使之成为一个新的镜像

```
$ docker commit -m="message" -a="author" <container_id> target_name:[tag_name]
```



## 5. Docker 容器数据卷

### 5.1. 什么是 Docker 容器数据卷

- 将运用与运行的环境打包成容器运行, 运行可以伴随着容器, 但是我们希望**数据持久化**
- 容器之间可以会有**数据共享**的需要 (容器间继承 + 共享数据)



Docker 容器产生的数据, 如果不 `docker commit` 那么容器删除后, 数据也就丢失了



> 类似于 Redis 里的 RDB 和 AOF



特点:

1. 数据卷可在容器之间共享或者重用数据
2. 卷中的更改可以直接生效
3. 数据卷中的更改不会包含在镜像的更新中
4. 数据卷的生命周期一直持续到没有容器使用它为止



### 5.2. 数据卷

> 数据卷是一个可供一个或多个容器使用的特殊目录, 它绕过 UFS, 可以提供很多有用的特性:
>
> - 数据卷可以在容器之间共享和重用
> - 对数据卷的修改会立马生效
> - 对数据卷的更新，不会影响镜像
> - 卷会一直存在，直到没有容器使用
>
> 数据卷的使用，类似于 Linux 下对目录或文件进行 `mount`



#### 5.2.1. 创建一个数据卷

##### 1. 直接命令添加

**添加数据卷命令**

在用 `docker run` 命令的时候, 使用 `-v` (`volume` 缩写) 标记来创建一个数据卷并挂载到容器里. 在一次 `run` 中多次使用可以挂载多个数据卷

```
$ $ docker run -it -v /宿主机绝对路径:/容器内目录 <image_name>
```



**查看数据卷是否挂载成功**

```
$ docker inspect
# 以 json 形式返回
```

在 `Volumes` key 中会看到挂载的文件夹, 在 `HostConfig` 中的 `Binds` 看到二者相互绑定, 那么成功.



**容器和宿主机之间数据共享**

在容器中修改文件内容, 宿主机中可以发现文件内容发生改变. **"可读可写"**



**容器停止退出后, 宿主机修改后数据是否同步?**

同步



**文件操作权限**

```
$ docker run -it -v /宿主机绝对路径:/容器内目录:权限 <image_name>
```

举个🌰子

```
$ docker run -it -v /hostDataV:/containerDataV:ro <image_name>
```

`ro` - Read Only, 只读

在 container 中 执行 `touch container.txt` 会返回错误信息



##### 2. 使用 Dockerfile 添加

> Dockerfile 会在下一章讲解

添加步骤 (举例) 简略说明:

1. 在根目录下创建 `mydocker` 文件夹并进入
2. 在 `Dockerfile` 中使用 `VOLUME` 指令来给镜像添加一个或多个数据卷
3. 编写 `Dockerfile` 文件
4. `build` 后生成镜像
   1. 比如 `myCentOS/centos`
   2. `docker build -f yourDockerFile -t nameOfImage .`
5. `run` 容器
6. 通过上述步骤, 容器内的卷目录地址如何知道对应的主机目录地址?
7. 主机对应默认地址
   1. 使用 `docker insect` 查看



```dockerfile
# Dockerfile example
FROM centos
VOLUME ["/dataVolumeContainer1", "/dataVolumeContainer1"]
CMD echo ">>> finished, success ..."
CMD /bin/bash
```



> Docker 挂载主机目录 Docker 访问出现 `cannot open directory .: Permission denied` 的解决方法:
>
> 在挂载目录后多加一个 `--privileged=true` 参数即可



### 5.3. 数据卷容器

命名的容器挂载数据卷, 其他的容器通过挂载这个 (父容器) 实现数据共享, 挂载数据卷的容器被称为**数据卷容器**



> 容器间数据的传递共享



#### 5.3.1. 利用数据卷容器来备份, 恢复, 迁移数据卷

> 摘选自: Docker - 从入门到实践 [Gitbook](http://leilux.github.io/lou/docker_practice/index.html)

可以利用数据卷对其中的数据进行进行备份, 恢复和迁移.

##### 备份

首先使用 `--volumes-from` 标记来创建一个加载 dbdata 容器卷的容器, 并从本地主机挂载当前到容器的 `/backup` 目录. 命令如下：

```
$ sudo docker run --volumes-from dbdata -v $(pwd):/backup ubuntu tar cvf /backup/backup.tar /dbdata
```

容器启动后, 使用了 `tar` 命令来将 dbdata 卷备份为本地的 `/backup/backup.tar`.

##### 恢复

如果要恢复数据到一个容器, 首先创建一个带有数据卷的容器 dbdata2

```
$ sudo docker run -v /dbdata --name dbdata2 ubuntu /bin/bash
```

然后创建另一个容器, 挂载 dbdata2 的容器, 并使用 `untar` 解压备份文件到挂载的容器卷中.

```
$ sudo docker run --volumes-from dbdata2 -v $(pwd):/backup busybox tar xvf
/backup/backup.tar
```



## 6. Dockerfile 解析

> 详细讲解 Dockerfile 中的关键字, 如何编写 Dockerfile 文件
>
> 执行 `docker build` 命令, 获得一个自定义的镜像
>
> 运行镜像



### 6.1. 什么是 Dockerfile?

Dockerfile 是用来构件 Docker **镜像**的构建文件, 是由一系列命令和参数构成的脚本

以 centos 6.8 的 Dockerfile 为例, 我们先来看一下 Dockerfile 的组成

```dockerfile
FROM scratch
MAINTAINER The CentOS Project <cloud-ops@centos.org>
ADD c68-docker.tar.xz /
LABEL name="CentOS Base Image" \
    vendor="CentOS" \
    license="GPLv2" \
    build-date="2016-06-02"

# Default command
CMD ["/bin/bash"]
```



### 6.2. Dockerfile 构建过程解析

#### 6.2.1. Dockerfile 内容基础知识

1. 每条保留字指令都必须为大写字母且后面要跟随至少一个参数
2. 指令按照从上到下, 顺序执行
3. `#` 表示注释
4. **每条指令都会创建一个新的镜像层**, 并对镜像进行提交



#### 6.2.2. Docker 执行 Dockerfile 的大致流程

1. Docker 从基础镜像运行一个容器
2. 执行一条指令并对容器作出修改
3. 执行类似 `docker commit` 的操作提交一个新的镜像层
4. Docker 再基于刚提交的镜像运行一个新容器
5. 执行 Dockerfile 中的下一条指令直到完成



#### 6.2.3. 总结

Dockerfile, Docker 镜像, Docker 容器相当于软件的三个不同阶段:

- Dockerfile 是软件的原材料
- Docker 镜像是软件的交付品
- Docker 容器可以认为是软件的运行态

> Dockerfile -> `build` -> Docker Images -> `run` -> Docker Container



### 6.3. Dockerfile 体系结构 (保留字指令)

- FROM
  - 基础镜像, 当前新镜像是基于哪个镜像的
- MAINTAINER
  - 镜像维护者
- RUN
  - 容器构建时需要运行的命令
- EXPOSE
  - 当前容器对外暴露的端口号
- WORKDIR
  - 指定在创建容器后, 终端默认登录的工作目录
- ENV
  - 用来构建镜像过程中设置环境变量
- ADD
  - 将宿主机目录下的文件拷贝进镜像且 ADD 命令自动处理 url 和解压 tar 包
- COPY
  - 类似 ADD, 拷贝文件和目录到镜像中
- VOLUME
  - 容器数据化, 保存数据和数据持久化
- CMD
  - 指定容器运行时要启动的命令
  - **可以有多个 CMD 指令, 但只有最后一个生效**, CMD 会被 `docker run` 后面的参数代替
- ENTRYPOINT
  - 指定容器运行时要启动的命令
  - ENTRYPOINT 的目的和 CMD 一样, <u>都是指定容器启动程序以及参数</u>
- ONBUILD
  - 当构建一个被继承的 Dockerfile 时运行命令, 父镜像被继承后, 父镜像 onbuild 被触发



举个栗子 (Redis.dockerfile):

```dockerfile
FROM debian:buster-slim

# add our user and group first to make sure their IDs get assigned consistently, regardless of whatever dependencies get added
RUN groupadd -r -g 999 redis && useradd -r -g redis -u 999 redis

# grab gosu for easy step-down from root
# https://github.com/tianon/gosu/releases
ENV GOSU_VERSION 1.11
RUN set -eux; \
# save list of currently installed packages for later so we can clean up
	savedAptMark="$(apt-mark showmanual)"; \
	apt-get update; \
	apt-get install -y --no-install-recommends \
		ca-certificates \
		dirmngr \
		gnupg \
		wget \
	; \
	rm -rf /var/lib/apt/lists/*; \
	\
	dpkgArch="$(dpkg --print-architecture | awk -F- '{ print $NF }')"; \
	wget -O /usr/local/bin/gosu "https://github.com/tianon/gosu/releases/download/$GOSU_VERSION/gosu-$dpkgArch"; \
	wget -O /usr/local/bin/gosu.asc "https://github.com/tianon/gosu/releases/download/$GOSU_VERSION/gosu-$dpkgArch.asc"; \
	\
# verify the signature
	export GNUPGHOME="$(mktemp -d)"; \
	gpg --batch --keyserver hkps://keys.openpgp.org --recv-keys B42F6819007F00F88E364FD4036A9C25BF357DD4; \
	gpg --batch --verify /usr/local/bin/gosu.asc /usr/local/bin/gosu; \
	gpgconf --kill all; \
	rm -rf "$GNUPGHOME" /usr/local/bin/gosu.asc; \
	\
# clean up fetch dependencies
	apt-mark auto '.*' > /dev/null; \
	[ -z "$savedAptMark" ] || apt-mark manual $savedAptMark > /dev/null; \
	apt-get purge -y --auto-remove -o APT::AutoRemove::RecommendsImportant=false; \
	\
	chmod +x /usr/local/bin/gosu; \
# verify that the binary works
	gosu --version; \
	gosu nobody true

ENV REDIS_VERSION 5.0.6
ENV REDIS_DOWNLOAD_URL http://download.redis.io/releases/redis-5.0.6.tar.gz
ENV REDIS_DOWNLOAD_SHA 6624841267e142c5d5d5be292d705f8fb6070677687c5aad1645421a936d22b3

RUN set -eux; \
	\
	savedAptMark="$(apt-mark showmanual)"; \
	apt-get update; \
	apt-get install -y --no-install-recommends \
		ca-certificates \
		wget \
		\
		gcc \
		libc6-dev \
		make \
	; \
	rm -rf /var/lib/apt/lists/*; \
	\
	wget -O redis.tar.gz "$REDIS_DOWNLOAD_URL"; \
	echo "$REDIS_DOWNLOAD_SHA *redis.tar.gz" | sha256sum -c -; \
	mkdir -p /usr/src/redis; \
	tar -xzf redis.tar.gz -C /usr/src/redis --strip-components=1; \
	rm redis.tar.gz; \
	\
# disable Redis protected mode [1] as it is unnecessary in context of Docker
# (ports are not automatically exposed when running inside Docker, but rather explicitly by specifying -p / -P)
# [1]: https://github.com/antirez/redis/commit/edd4d555df57dc84265fdfb4ef59a4678832f6da
	grep -q '^#define CONFIG_DEFAULT_PROTECTED_MODE 1$' /usr/src/redis/src/server.h; \
	sed -ri 's!^(#define CONFIG_DEFAULT_PROTECTED_MODE) 1$!\1 0!' /usr/src/redis/src/server.h; \
	grep -q '^#define CONFIG_DEFAULT_PROTECTED_MODE 0$' /usr/src/redis/src/server.h; \
# for future reference, we modify this directly in the source instead of just supplying a default configuration flag because apparently "if you specify any argument to redis-server, [it assumes] you are going to specify everything"
# see also https://github.com/docker-library/redis/issues/4#issuecomment-50780840
# (more exactly, this makes sure the default behavior of "save on SIGTERM" stays functional by default)
	\
	make -C /usr/src/redis -j "$(nproc)"; \
	make -C /usr/src/redis install; \
	\
# TODO https://github.com/antirez/redis/pull/3494 (deduplicate "redis-server" copies)
	serverMd5="$(md5sum /usr/local/bin/redis-server | cut -d' ' -f1)"; export serverMd5; \
	find /usr/local/bin/redis* -maxdepth 0 \
		-type f -not -name redis-server \
		-exec sh -eux -c ' \
			md5="$(md5sum "$1" | cut -d" " -f1)"; \
			test "$md5" = "$serverMd5"; \
		' -- '{}' ';' \
		-exec ln -svfT 'redis-server' '{}' ';' \
	; \
	\
	rm -r /usr/src/redis; \
	\
	apt-mark auto '.*' > /dev/null; \
	[ -z "$savedAptMark" ] || apt-mark manual $savedAptMark > /dev/null; \
	apt-get purge -y --auto-remove -o APT::AutoRemove::RecommendsImportant=false; \
	\
	redis-cli --version; \
	redis-server --version

RUN mkdir /data && chown redis:redis /data
VOLUME /data
WORKDIR /data

COPY docker-entrypoint.sh /usr/local/bin/
ENTRYPOINT ["docker-entrypoint.sh"]

EXPOSE 6379
CMD ["redis-server"]
```



### 6.4. 总结



<div align="center">
  <img src="https://netadmin.com.tw/images/news/NP170801000317080114394102.png" width="60%">
</div>



## References

- Docker 基础篇 - 尚硅谷课程, [Bilibili](https://www.bilibili.com/video/av26993050)
- Docker - 从入门到实践, [Gitbook](http://leilux.github.io/lou/docker_practice/index.html)
- Dockerfile 参考：https://docs.docker.com/reference/builder/
- Dockerfile 最佳实践：https://docs.docker.com/articles/dockerfile_best-practices/