---
layout: post
title: "Aria2 for Mac 配置教程"
date: 2019-01-25
modify_date: 2019-01-25
excerpt: "Aria2 for Mac 配置百度云下载教程"
tags: [Mac OS X]
mermaid: true
mathjax: true
mathjax_autoNumber: true
---

# Aria2 for Mac 配置教程

> 使用 Aria2 以达到 `百度云盘` 非会员满速下载

## 下载 Aria2 for Mac

下载地址：http://pan.baidu.com/s/1nu4UHfV

下载完成后**解压**移动至下一步即可

## 安装

### Aria2GUI

> 使用简单，点击即用

1. 安装 `Aria2GUI.dmg`
2. 安装 `Google Chrome` 插件， https://chrome.google.com/webstore/detail/baiduexporter/mjaenbjdjmgolhoafkohbhhbaiedbkno
3. **下载前**打开 `Aria2GUI`，然后打开需要下载的百度网盘链接，稍等插件工作完成，会发现网页上方多出一个 `导出下载` 按钮，点击它弹出的 `ARIA2 RPC` 就自动添加到你的下载队列里了

> 如果发现无法下载，请 打开`导出下载` 按钮 `设置`中， 如下设置或参考 https://github.com/acgotaku/BaiduExporter/issues/547
> 
> User-agent 设置为： netdisk;5.2.7;PC;PC-Windows;6.2.9200;WindowsBaiduYunGuanJia  
> Referer 设置为：http://pan.baidu.com/disk/home

### Aria2c

1. 下载安装 `Aria2c` : `aria2-1.21.0-osx-darwin.dmg` 
2. 下载 `Aria2` 所需文件  
    找到网盘文件夹中的配置文件 `aria2.conf`，运行 `Aria2` 所有的选项都可以在配置文件中设置。用文本编辑打开 `aria2c.conf`, 第二行是设置下载路径 `dir=/Users/XXX/Downloads`,其中 `XXX` 为你的用户名

    1. 打开 Terminal，输入：`mkdir ~/.aria2`
    1. 将配置文件 `aria2.conf` 拖入这个文件夹中
    1. 接着找到压缩文件夹 `aria2c.zip`，解压后将 `aria2c` 文件夹整个拖入 `~/Applications` 目录下

3. 运行 `Aria2`

    在 Terminal 里输入 `aria2c`
    检查 `aria2c` 是否启动的办法是Terminal中输入：`ps aux|grep aria2c`

    ```
    $ ps aux|grep aria2c
    macbookpro      49398   0.5  0.2  2498976   8460   ??  Ss    3:54PM   0:07.82 /Applications/Aria2GUI.app/Contents/Resources/aria2c --input-file=/Users/Shared/aria2.session --save-session=/Users/Shared/aria2.session --save-session-interval=10 --dir=/Users/macbookpro/Downloads/ --max-connection-per-server=10 --max-concurrent-downloads=10 --continue=true --split=10 --min-split-size=10M --enable-rpc=true --rpc-listen-all=false --rpc-listen-port=6800 --rpc-allow-origin-all --check-integrity=true --bt-enable-lpd=true --follow-torrent=true --user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/601.3.9 (KHTML, like Gecko) Version/9.0 Safari/601.3.9 -c -D
    macbookpro      49479   0.0  0.0  2463888    420   ??  Ss    3:55PM   0:00.16 aria2c
    macbookpro      50605   0.0  0.0  2444056    788 s000  S+    4:28PM   0:00.01 grep aria2c
    ```

    如上所示，运行成功。

4. 通过 `webui-aria2` 控制 `Aria2`

    `aria2` 是基于命令行的下载工具

    1. 最常用的webui-aria2: http://ziahamza.github.io/webui-aria2/
    1. 也可以用binux大神的YAAW：http://binux.github.io/yaaw/demo/

    > 如果连接不成功可以打开Setting-Connection Setting查看host是否localhost, 端口是否是6800


## References

[1] Baidu Exporter, https://github.com/acgotaku/BaiduExporter  
[2] Justin Smith, [Aria2配置教程（Mac和Windows）](https://medium.com/@Justin___Smith/aria2%E9%85%8D%E7%BD%AE%E6%95%99%E7%A8%8B-mac%E5%92%8Cwindows-b31d0f64bd4e)  
[3] 下载失效解决方法， https://github.com/acgotaku/BaiduExporter/issues/547  
[4] Vaayne, https://www.jianshu.com/p/1290f8e7b326


<style>
.center {
    display: block;
    margin-left: auto;
    margin-right: auto;
}
</style>


Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/601.3.9 (KHTML, like Gecko) Version/9.0 Safari/601.3.9