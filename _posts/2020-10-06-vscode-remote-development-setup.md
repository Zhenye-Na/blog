---
layout: article
title: "VS Code 远程开发配置"
date: 2020-10-06
modify_date: 2020-10-06
excerpt: "如何使用 VS Code 通过 Remote-SSH 连接本地 Ubuntu 开发"
tags: [VS Code]
mathjax: false
mathjax_autoNumber: false
key: vscode-remote-development-setup
---

# VS Code 远程开发配置

先说一下使用背景:

<div align="center">
  <img src="https://github.com/Zhenye-Na/Zhenye-Na.github.io/blob/master/assets/images/posts-img/vscode-remote-dev/use-case.png?raw=true">
</div>


公司的项目需要在本地 Ubuntu 上进行开发, 然后调试测试通过之后通过 PR merge 到 main branch. 然后 SSH 到 AWS EC2 上在进行调试, 测试. 尽管公司发的 Macbook Pro 内存已经足够用了, 但是直接在 Ubuntu 截面写代码是在是浪费了 Mac 的操作流畅性. 于是乎做了一番功课, 终于可以愉快地在 Mac 上直接写代码了.

需要的软件/工具

- VS Code + Remote-SSH
- Virtual Box + Ubuntu


## 1. 配置 VS Code

<div align="center">
  <img src="https://github.com/Zhenye-Na/Zhenye-Na.github.io/blob/master/assets/images/posts-img/vscode-remote-dev/install-remote-ssh.png?raw=true">
</div>


安装如图所示的插件, 然后在 VS Code 左下角就会有一个类似 `><` (不是卖萌) 的图标, 点击它就会询问是否连接到 VM

<div align="center">
  <img src="https://github.com/Zhenye-Na/Zhenye-Na.github.io/blob/master/assets/images/posts-img/vscode-remote-dev/configure-remote-ssh.png?raw=true">
</div>


## 2. 配置 Virtual Box Ubuntu 虚拟机

以下步骤没有来得及截图, 所以我会尽量详细说明

### 2.1 SSH 连接到 Ubuntu

#### On Mac

在 Mac 上 (或者其他的 Host machine), 关闭你的 VM, 然后在 VB 主界面左侧, 可以看到有一个图标 (三个点, 三条横线), 点击它, 然后选择 Network, 然后点击 Create New Network

```
create vboxnet0, IPv4 Address/Mask = 192.168.xxx.xxx, check DHCP Server
```

点击 Ubuntu 系统的 settings, 设置

```
Settings -> System -> Check "Enable I/O APIC"
Settings -> Network -> Adapter 2 -> host-only vboxnet0
```

#### On Ubuntu

安装 openssh server 如果没有的话

```bash
# install
sudo apt install openssh-server

# start service
sudo service ssh restart

# check status of service
sudo service ssh status
```

在 `/etc/network/interfaces` 中追加如下几行

```
auto enp0s8
iface enp0s8 inet static
address 192.168.xxx.xxx
netmask 255.255.255.0
```

然后在 Terminal 中输入 `sudo ifup enp0s8`

到此为止, 你已经可以通过

```
mac$ ssh <username>@192.168.xxx.xxx
```

登入你的 local ubuntu 了


### 2.2 配置 SSH, 简化登录过程

#### 更改 Hostname

每次登录都要输入 ip 就很麻烦.

将如下内容粘贴到 Mac 下 `~/<username>/.ssh/config` 文件下

```
Host vm
  HostName 192.168.xxx.xxx
  User <username>
```


#### 免密登录

在你的 Mac 的 Terminal 下生成 SSH key

```bash
$ ssh-keygen -t rsa
```

生成的文件会在 `$HOME/.ssh/id_rsa.pub`. 如果有这个文件那么不用在生成一次了. 复制 `id_rsa.pub` 文件的内容. 将它粘贴到 Ubuntu 系统中 `$HOME/.ssh/authorized_keys` 文件中

重新使用 VS Code 连接 Ubuntu, 你会发现不在弹出密码输入页面了.





