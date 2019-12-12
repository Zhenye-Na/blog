---
layout: article
title: "Shell 编程从入门到放弃"
date: 2019-11-13
modify_date: 2019-11-27
excerpt: "了解 Shell 脚本编程基础知识, 深入底层原理"
tags: [Shell]
mathjax: false
mathjax_autoNumber: false
key: intro-to-shell
---



# Shell 编程从入门到放弃

> 最近要对公司的 Shell 脚本用 Python 进行重构, 没办法只能把忘得快 (yi) 要 (jing) 干净的 Shell 捡起来了
>
> 看了 B 站的视频, 做了一份笔 (cheat) 记 (sheet)
>
> 更简单的版本可以看我之前发过的文章~



**Outline:**

- Shell 的基本语法结构;
- 基本正则表达式使用;
- 文件处理 `grep`, `sed`, `awk` ;
- 使用 Shell 脚本完成复杂任务;



## 1. 回顾 Linux 文本处理工具

### 1.1. grep

`grep` 是**行过滤工具**; 用于<u>根据关键字进行行过滤</u>



使用方法

```bash
grep [选项] '关键字' 文件名
```



常见选项

```powershell
OPTIONS:
    -i: 不区分大小写
    -v: 查找不包含指定内容的行,反向选择
    -w: 按单词搜索
    -o: 打印匹配关键字
    -c: 统计匹配到的行数
    -n: 显示行号
    -r: 逐层遍历目录查找
    -A: 显示匹配行及后面多少行	
    -B: 显示匹配行及前面多少行
    -C: 显示匹配行前后多少行
    -l：只列出匹配的文件名
    -L：列出不匹配的文件名
    -e: 使用正则匹配
    -E:使用扩展正则匹配
    ^key:以关键字开头
    key$:以关键字结尾
    ^$:匹配空行
    --color=auto ：可以将找到的关键词部分加上颜色的显示
```

**颜色显示（别名设置）：**

```powershell
临时设置：
# alias grep='grep --color=auto'			// 只针对当前终端和当前用户生效

永久设置：
1）全局（针对所有用户生效）
vim /etc/bashrc
alias grep='grep --color=auto'
source /etc/bashrc

2）局部（针对具体的某个用户）
vim ~/.bashrc
alias grep='grep --color=auto'
source ~/.bashrc
```

**举例说明：**

==说明：不要直接使用/etc/passwd文件，将其拷贝到/tmp下做实验！==

```powershell
# grep -i root passwd						忽略大小写匹配包含root的行
# grep -w ftp passwd 						精确匹配ftp单词
# grep -w hello passwd 						精确匹配hello单词;自己添加包含hello的行到文件
# grep -wo ftp passwd 						打印匹配到的关键字ftp
# grep -n root passwd 						打印匹配到root关键字的行好
# grep -ni root passwd 						忽略大小写匹配统计包含关键字root的行
# grep -nic root passwd						忽略大小写匹配统计包含关键字root的行数
# grep -i ^root passwd 						忽略大小写匹配以root开头的行
# grep bash$ passwd 							匹配以bash结尾的行
# grep -n ^$ passwd 							匹配空行并打印行号
# grep ^# /etc/vsftpd/vsftpd.conf		匹配以#号开头的行
# grep -v ^# /etc/vsftpd/vsftpd.conf	匹配不以#号开头的行
# grep -A 5 mail passwd 				 	匹配包含mail关键字及其后5行
# grep -B 5 mail passwd 				 	匹配包含mail关键字及其前5行
# grep -C 5 mail passwd 					匹配包含mail关键字及其前后5行
```


### 1.2. sed

> 流文本编辑器 (Stream Editor), 处理文件

sed <u>一行一行</u>读取文件内容并按照要求进行处理， 把处理后的结果<u>输出到屏幕</u>上， 源文件没变

1. 读取一行的内容，将其保存在缓冲区，对这个**副本**进行编辑，不会直接修改源文件
2. 处理缓冲区的内容，发送到屏幕
3. sed 用来自动编辑一个或者多个文件；简化对文件的重复操作，对文件进行过滤和转换操作


使用 sed 一般有两种情景

1. 直接在命令行
2. 写在脚本中运行


#### 1.2.1. 命令行格式

##### 语法格式

```bash
sed [options] '处理动作' 文件名
```

##### 常用选项


| 选项 | 说明                   | 备注               |
| ---- | ---------------------- | ------------------ |
| `-e` | 进行多项（多次）编辑   |                    |
| `-n` | **取消默认输出**       | 不自动打印模式空间 |
| `-r` | 使用扩展正则表达式     |                    |
| `-i` | 原地编辑（修改源文件） |                    |
| `-f` | 指定 sed 脚本的文件名  |                    |


##### 常用处理操作


| 处理方式 | 说明                          | 备注 |
| -------- | ----------------------------- | ---- |
| `'p'`    | 打印                          |      |
| `'i'`    | 在指定行**之前**插入内容      |      |
| `'a'`    | 在指定行**之后**插入内容      |      |
| `'c'`    | **替换**<u>指定行所有内容</u> |      |
| `'d'`    | 删除指定行                    |      |


#### 1.2.2. 举例说明


##### 一、增删改查

```bash
sed [options] '定位+命令' 需要处理的文件
```


1. 打印文件内容

   ```bash
   $ sed '' a.txt          # 对文件什么都不做
   $ sed -n 'p' a.txt      # 打印每一行，取消默认输出
   $ sed -n '1p' a.txt     # 打印第一行
   $ sed '1p' a.txt        # 第一行打印了两遍，其他行原样输出
   $ sed -n '1,5p' a.txt   # 打印第一到第五行
   $ sed -n '$p' a.txt     # 打印最后一行
   ```

2. 增加文件内容

   ```bash
   $ sed '$a9999' a.txt    # 文件最后一行下面增加内容
   $ sed 'a9999' a.txt     # 文件每行下面增加内容
   $ sed '5a9999' a.txt    # 文件第 5 行下面增加内容
   $ sed '$i9999' a.txt    # 文件最后一行之前一行增加内容
   $ sed 'i9999' a.txt     # 文件每一行的前一行增加内容
   $ sed '6i9999' a.txt    # 文件第 6 行的前一行增加内容
   $ sed '/^uucp.ihello'   # 以 uucp开头的行的上一行插入内容
   ```

3. 修改文件内容

   ```bash
   $ sed '5chello' a.txt       # 替换文件第 5 行内容
   $ sed 'chello' a.txt        # 替换文件所有内容
   $ sed '1,5chello ' a.txt    # 替换文件 1-5 行所有内容
   $ sed '/^user01/c88' a.txt  # 替换以 user01 开头的行
   ```

4. 删除文件内容

   ```bash
   $ sed '1d' a.txt            # 删除第一行
   $ sed '1,5d' a.txt          # 删除 1-5 行
   $ sed '$d' a.txt            # 删除最后一行
   ```


##### 二、对文件进行搜索替换

**使用格式**

```bash
sed [options] 's/搜索的内容/替换的内容/动作' 需要处理的文件
```

其中 `s` 表示搜索， 斜杠是分隔符，p 是打印，g 是全局替换, **分隔符是可以自定义的**


**举例说明**

```bash
$ sed -n 's/root/ROOT/p' 1.txt
$ sed -n 's/root/ROOT/gp' 1.txt
$ sed -n 's/^#//gp' 1.txt
$ sed -n 's@/sbin/nolongin@bla@/gp' 1.txt
$ sed -n 's/\/sbin\/nologin/bla/gp' 1.txt
$ sed -n '10s#/sbin/nologin#bla#p' 1.txt
```


##### 三、其他命令


| 命令 | 解释                                       | 备注            |
| ---- | ------------------------------------------ | --------------- |
| `r`  | 从另外文件读取内容                         |                 |
| `w`  | 内容另存为                                 |                 |
| `&`  | 保存<u>查找串</u>以便<u>替换串</u>引用     | 跟 `\( \)` 相同 |
| `=`  | 打印行号                                   |                 |
| `!`  | 对所选行以外的所有行应用命令，放到行数之后 |                 |
| `q`  | 退出                                       |                 |



##### 四、结合正则表达式

- `-e` 多项编辑
- `-r` 扩展正则
- `-i` 修改源文件


| 正则             | 说明                                                         | 备注                        |
| ---------------- | ------------------------------------------------------------ | --------------------------- |
| `/key/`          | 查询包含关键字的行                                           | `sed -n '/root/p 1.txt'`    |
| `/key1/, /key2/` | 匹配包含两个关键字**之间**的行                               | `sed -n '/^adm/,/^mysql/p'` |
| `/key/, x`       | 从匹配关键字的行开始到文件**第 `x` 行**之间的所有行 （包含关键字所在行） | `sed -n '/^ftp/,7p'`        |
| `x, /key/`       | 从第 `x` 行开始到与关键字匹配行之间的行                      |                             |
| `x, y!`          | **不包含** `x` 到 `y` 行                                     |                             |
| `/key/!`         | **不包括**关键字的行                                         | `sed -n '/bash$/!p' 1.txt`  |



### 1.3. awk

- 对文本和数据及逆行处理
  - 逐行扫描文件：逐行寻找匹配的特定模式
- 统计数据，比如统计访问量等
- 支持条件判断


#### 1.3.1. 命令行使用模式

##### 一、语法结构

```bash
$ awk [options] '命令' 文件名

# 如果引用 shell 变量需要用双引号引起
```


##### 二、常用选项介绍

- `-F` 定义字段分隔符号，默认的分隔符是<u>空格</u>
- `-v` 定义变量并赋值



##### 三、命名部分说明

1. 正则表达式可以用来定位行号（地址）
2. `{awk 语句1;awk 语句2}`
3. `BEGIN ... END ...`



#### 1.3.2. awk 内部变量

|      |      |      |
| ---- | ---- | ---- |
|      |      |      |
|      |      |      |
|      |      |      |
|      |      |      |
|      |      |      |
|      |      |      |






## 1.4. cut

> cut是**列**截取工具，用于列的截取

### 语法和选项

**语法：**

```powershell
# cut 选项  文件名
```

**常见选项：**

```powershell
-c:	以字符为单位进行分割,截取
-d:	自定义分隔符，默认为制表符\t
-f:	与-d一起使用，指定截取哪个区域
```

**举例说明:**

```powershell
# cut -d: -f1 1.txt 			以:冒号分割，截取第1列内容
# cut -d: -f1,6,7 1.txt 	以:冒号分割，截取第1,6,7列内容
# cut -c4 1.txt 				截取文件中每行第4个字符
# cut -c1-4 1.txt 			截取文件中每行的1-4个字符
# cut -c4-10 1.txt 			截取文件中每行的4-10个字符
# cut -c5- 1.txt 				从第5个字符开始截取后面所有字符
```

**课堂练习：**
用小工具列出你当系统的运行级别。5/3

1. 如何查看系统运行级别
   - 命令`runlevel`
   - 文件`/etc/inittab`
2. 如何过滤运行级别

```powershell
runlevel |cut -c3
runlevel | cut -d ' ' -f2
grep -v '^#' /etc/inittab | cut -d: -f2
grep '^id' /etc/inittab |cut -d: -f2
grep "initdefault:$" /etc/inittab | cut -c4
grep -v ^# /etc/inittab |cut -c4
grep 'id:' /etc/inittab |cut -d: -f2
cut -d':' -f2 /etc/inittab |grep -v ^#
cut -c4 /etc/inittab |tail -1
cut -d: -f2 /etc/inittab |tail -1
```


sort工具

> sort工具用于排序;它将文件的每一行作为一个单位，从首字符向后，依次按ASCII码值进行比较，最后将他们按升序输出。

#### 语法和选项

```powershell
-u ：去除重复行
-r ：降序排列，默认是升序
-o : 将排序结果输出到文件中,类似重定向符号>
-n ：以数字排序，默认是按字符排序
-t ：分隔符
-k ：第N列
-b ：忽略前导空格。
-R ：随机排序，每次运行的结果均不同
```

**举例说明**

```powershell
# sort -n -t: -k3 1.txt 			按照用户的uid进行升序排列
# sort -nr -t: -k3 1.txt 			按照用户的uid进行降序排列
# sort -n 2.txt 						按照数字排序
# sort -nu 2.txt 						按照数字排序并且去重
# sort -nr 2.txt 
# sort -nru 2.txt 
# sort -nru 2.txt 
# sort -n 2.txt -o 3.txt 			按照数字排序并将结果重定向到文件
# sort -R 2.txt 
# sort -u 2.txt 
```

## 1.5. uniq

> uniq用于去除**连续**的**重复**行

```powershell
常见选项：
-i: 忽略大小写
-c: 统计重复行次数
-d:只显示重复行

举例说明：
# uniq 2.txt 
# uniq -d 2.txt 
# uniq -dc 2.txt 
```

## 1.6. tee

> tee工具是从标准输入读取并写入到标准输出和文件，即：双向覆盖重定向（屏幕输出|文本输入）

```powershell
选项：
-a 双向追加重定向

# echo hello world
# echo hello world|tee file1
# cat file1 
# echo 999|tee -a file1
# cat file1 
```

## 1.7. diff

> diff工具用于逐行比较文件的不同

注意：diff描述两个文件不同的方式是告诉我们==怎样改变第一个==文件之后==与第二个文件匹配==。

### 语法和选项

**语法：**

```powershell
diff [选项] 文件1 文件2
```


**常用选项：**

| 选项     | 含义               | 备注 |
| -------- | ------------------ | ---- |
| -b       | 不检查空格         |      |
| -B       | 不检查空白行       |      |
| -i       | 不检查大小写       |      |
| -w       | 忽略所有的空格     |      |
| --normal | 正常格式显示(默认) |      |
| -c       | 上下文格式显示     |      |
| -u       | 合并格式显示       |      |


**举例说明：**

- 比较两个**普通文件**异同，文件准备：

```powershell
[root@MissHou ~]# cat file1
aaaa
111
hello world
222
333
bbb
[root@MissHou ~]#
[root@MissHou ~]# cat file2
aaa
hello
111
222
bbb
333
world
```

1）正常显示

```powershell
diff目的：file1如何改变才能和file2匹配
[root@MissHou ~]# diff file1 file2
1c1,2					第一个文件的第1行需要改变(c=change)才能和第二个文件的第1到2行匹配			
< aaaa				小于号"<"表示左边文件(file1)文件内容
---					---表示分隔符
> aaa					大于号">"表示右边文件(file2)文件内容
> hello
3d3					第一个文件的第3行删除(d=delete)后才能和第二个文件的第3行匹配
< hello world
5d4					第一个文件的第5行删除后才能和第二个文件的第4行匹配
< 333
6a6,7					第一个文件的第6行增加(a=add)内容后才能和第二个文件的第6到7行匹配
> 333					需要增加的内容在第二个文件里是333和world
> world
```

2）上下文格式显示

```powershell
[root@MissHou ~]# diff -c file1 file2
前两行主要列出需要比较的文件名和文件的时间戳；文件名前面的符号***表示file1，---表示file2
*** file1       2019-04-16 16:26:05.748650262 +0800
--- file2       2019-04-16 16:26:30.470646030 +0800
***************	我是分隔符
*** 1,6 ****		以***开头表示file1文件，1,6表示1到6行
! aaaa				!表示该行需要修改才与第二个文件匹配
  111
- hello world		-表示需要删除该行才与第二个文件匹配
  222
- 333					-表示需要删除该行才与第二个文件匹配
  bbb
--- 1,7 ----		以---开头表示file2文件，1,7表示1到7行
! aaa					表示第一个文件需要修改才与第二个文件匹配
! hello				表示第一个文件需要修改才与第二个文件匹配
  111
  222
  bbb
+ 333					表示第一个文件需要加上该行才与第二个文件匹配
+ world				表示第一个文件需要加上该行才与第二个文件匹配
```

3）合并格式显示

```powershell
[root@MissHou ~]# diff -u file1 file2
前两行主要列出需要比较的文件名和文件的时间戳；文件名前面的符号---表示file1，+++表示file2
--- file1       2019-04-16 16:26:05.748650262 +0800
+++ file2       2019-04-16 16:26:30.470646030 +0800
@@ -1,6 +1,7 @@
-aaaa
+aaa
+hello
 111
-hello world
 222
-333
 bbb
+333
+world
```

- 比较两个**目录不同**

```powershell
默认情况下也会比较两个目录里相同文件的内容
[root@MissHou  tmp]# diff dir1 dir2
diff dir1/file1 dir2/file1
0a1
> hello
Only in dir1: file3
Only in dir2: test1
如果只需要比较两个目录里文件的不同，不需要进一步比较文件内容，需要加-q选项
[root@MissHou  tmp]# diff -q dir1 dir2
Files dir1/file1 and dir2/file1 differ
Only in dir1: file3
Only in dir2: test1

```

**其他小技巧：**

有时候我们需要以一个文件为标准，去修改其他文件，并且修改的地方较多时，我们可以通过打补丁的方式完成。

```powershell
1）先找出文件不同，然后输出到一个文件
[root@MissHou ~]# diff -uN file1 file2 > file.patch
-u:上下文模式
-N:将不存在的文件当作空文件
2）将不同内容打补丁到文件
[root@MissHou ~]# patch file1 file.patch
patching file file1
3）测试验证
[root@MissHou ~]# diff file1 file2
[root@MissHou ~]#

```



## 2. Bash 特性

### 2.1. Bash 的通配符


```
* : 匹配 0 或多个任意字符
? : 匹配任意单个字符

[list] : 匹配 [list] 中任意单个字符, 或者一组单个字符 [a-z] 从 a 到 z
[!list] : 匹配除 [list] 中任意单个字符

{str1, str2, str3, ...} : 匹配字符串 {1..12}
```



### 2.2. Bash 的引号

- 双引号 `""` : 会把引号的内容当成整体来看待, <u>允许</u>通过 `$` 符号引用其它变量值, `"$(date + '%F %T')"`
- 单引号 `''` : 会把引号的内容当成整体来看待, <u>禁止引用其它变量值</u>, shell 中特殊符号都被视为普通字符
- 反撇号 `(``)`: 和 `$()` 一样, 引号或者括号里的命令先执行, 如果有嵌套, 则不能使用  



> Terminal 和 Shell 有什么关系?
>
> 打开 Terminal 后, 默认打开一个 Shell kernel



### 2.3. Shell 脚本

将需要<u>执行的命令存在文本</u>中, 按照<u>顺序执行</u>. 解释性语言, 不需要编译


1. 自动化软件部署
2. 自动化管理
3. 自动化分析处理
4. 自动化备份
5. 自动化监控脚本


#### Shell 脚本基本组成

1. 脚本第一部分
   1. "魔法字符": `#!` 必写
   2. `#! /bin/bash` 表示一下内容使用 bash 解释器解析
      1. 注意: 若将解释器路径写死在脚本里, 可能会发生找不到解释器的情况, 可以使用 `#! /bin/env 解释器`
2. 脚本第二部分
   1. 对脚本信息进行描述, comment



### 2.4. 脚本执行方式

添加权限

```sh
chmod +x <filename>
```


## 3. 变量定义

### 3.3. 命令行执行结果赋值给变量

变量赋值

```bash
$ A=`hostname`
$ echo $A
$ B=${uname -r}
$ echo $B
```



### 3.4. 交互式定义变量 (`read`)

类似于 "根据提示, 给出变量应该赋的值"

举几个栗子🌰

```bash
$ # 用户自己定义变量值
$ read name
harry
$ echo ${name}
harry

$ read -p "Please enter your name:" name
harry2
$ echo $name
harry2


$ # 从文件中获取变量值
$ cat example.txt
192.168.100.1
$ read -p "Please enter a valid IP address:" ip < example.txt
$ echo `ip`
192.168.100.1

```



### 3.5. 定义有类型的变量 (`declare`)



给变量做一些限制, 比如整型, 只读



基本用法

```
declare 选项 变量名=变量值
```



<这里有一个表格>





举个栗子:

```bash
$ # env | grep 变量名

$ A=test
$ env | grep A
(no output)

$ export A
$ env | grep A
test


$ declare -x B=test2
$ env |grep B

```



### 3.6 变量的分类

#### 3.6.1. 本地变量

当前用户自定义的变量, <u>当前进程有效, 其他进程或者当前进程子进程无效</u>



1. 定义变量: `变量名 = 变量值`, 变量名必须以字母或者下划线开头, 区分大小写, 比如 `ip1 = 192.168.xx.xx`
2. 引用变量: `$变量名` 或者 `$(变量名)`
3. 查看变量: `echo $变量名` `set`所有变量
4. 取消变量: `unset 变量名`



```bash
$ A=hello
$ echo $A
$ echo $(A)
$ echo ${A}
$ unset A
```



注意:

1. 变量名不能包含特殊字符
2. 变量名区分大小写, 不能以数字开头
3. 等号两边不能有空格!



#### 3.6.2. 环境变量

`$PATH`, `$HOME`, `$USER`, `env` 等当前进程有效, 并且能够被子进程调用



1. 定义环境变量:
   1. `export back_dir2 = home/backup`
   2. `export back_dir1` 将自定义变量转换成环境变量
2. 引用环境变量: `$变量名` 或者 `$(变量名)`
3. 查看环境变量: `echo $变量名 env` 比如 `env | grep back_dir2`
4. 取消环境变量: `unset 变量名`



```
局部变量 <-> 全局变量 (Java, C)
本地变量 <-> 环境变量 (Shell)
```



- `env` <u>查看</u>当前用户的环境变量
- `set` <u>查询</u>当前用户的所有变量 (临时变量与环境变量)
- `export 变量名=变量值` 或者 `变量名=变量值; export 变量名`



#### 3.6.3 全局变量

**全局所有的用户和程序都能调用, 且继承, 新建的用户也默认能调用**



相关配置文件



<这里有一个表格>



以上文件如果修改, 需要重新 `source` 使其生效

用户登录系统读取相关文件的顺序

1. `/etc/profile`
2. `$HOME/.bash_profile`
3. `$HOME/.bashrc`
4. `/etc/bashrc`
5. `$HOME/.bash_logout`



#### 3.6.4. 系统变量

Shell 自身已经固定好了



| 内置变量       | 含义                                                         |
| -------------- | ------------------------------------------------------------ |
| **`$?`**       | 上一条命令执行后返回的状态; 状态值 (return code) 为 0 表示执行正常, 非 0 表示执行异常或错误 |
| `$0`           | <u>当前</u>执行的程序或脚本名                                |
| **`$#`**       | 脚本后面接的参数<u>个数</u>                                  |
| **`$*`**       | 脚本后面所有的参数, 作为一个整体输出, 每一个变量参数之间一空格隔开 |
| **`$@`**       | 脚本后面所有的参数, 参数是独立的, 但是也是输出所有参数       |
| **`$1 ~ $9`**  | 脚本后的位置参数, `$1` 代表第一个参数                        |
| `${10} ~ ${n}` | 扩展位置参数, 第 10 个以后要用 `{}` 括号括起来               |
| `$$`           | 当前所在进程的进程号, `echo $$`                              |



#### 3.6.5. 其他变量定义

##### `dirname` 和 `basename`

- `dirname` 取出文件路径
- `basename` 取出文件



```bash
$ A=/root/Desktop/shell/script.sh

$ dirname $A
/root/Desktop/shell

$ basename $A
script.sh
```



##### 变量内容的删除替换

```bash
# 一个 %  代表从右往左去掉一个 /key/
# 两个 %% 代表从右往左去掉 /key/, 直到没有匹配
# 一个 #  代表从左往右去掉一个 /key/
# 两个 ## 代表从左往右去掉 /key/ , 直到没有匹配

# 例子

$ url=www.taobao.com

# url 长度
$ echo ${#url}

# 从左往右删除匹配到 *.
$ echo ${url#*.}
taobao.com

$ echo ${url##*.}
com
```





## 4. 四则运算

### 4.1. 简单的四则运算



| 表达式       | 举例              |
| ------------ | ----------------- |
| `$(())`      | `echo $((1 + 1))` |
| `$[]`        | `echo $[12 - 23]` |
| `expr`       | `expr 10 / 5`     |
| `let`        | `n=1; let n += 1` |
| `i++`, `++i` |                   |



## 5. 条件判断语句



一共三种格式

1. `test 条件表达式`
2. `[ 条件表达式 ]`
3. `[[ 条件表达式 ]]` 支持正则



> `[ expression ]` 和 `[[ expression ]]` 方括号两边都有空格, 一定要留!



### 5.1. 判断文件类型



| 判断参数 | 含义                                               |
| -------- | -------------------------------------------------- |
| `-e`     | 判断文件是否存在 (**任何类型文件**)                |
| `-f`     | 判断文件是否存在并且是一个<u>普通文件</u>          |
| `-d`     | 判断文件是否存在并且是一个<u>目录</u>              |
| `-L`     | 判断文件是否存在并且是一个软链接文件               |
| `-s`     | 判断文件是否存在并且是一个<u>非空文件</u> (有内容) |
| `! -s`   | 判断文件是否存在并且是一个<u>空文件</u>            |



### 5.2. 判断文件权限



| 判断参数 | 含义                         |
| -------- | ---------------------------- |
| `-r`     | 当前用户对其是否可读         |
| `-w`     | 当前用户对其是否可写         |
| `-x`     | 当前用户对其是否可执行       |
| `-u`     | 是否有 `suid` 高级权限冒险位 |
| `-g`     | 是否有 `sgid` 高级权限强制位 |
| `-k`     | 是否有 `t` 位 高级权限粘滞位 |



### 5.3. 判断文件修改时间

| 判断参数          | 含义                     |
| ----------------- | ------------------------ |
| `file1 -nt file2` | 比较 file1 比 file2 新?  |
| `file1 -ot file2` | 比较 file1 比 file2 旧?  |
| `file1 -ef file2` | 是否是同一个文件, 硬链接 |
|                   |                          |



### 5.4. 判断整数



```
pass

```




### 5.5. 判断字符串



| 判断参数       | 含义                                              |
| -------------- | ------------------------------------------------- |
| `-z`           | 判断是否为**空**字符串, 字符串长度为 0 则成立     |
| `-n`           | 判断是否为**非空**字符串, 字符串长度不为 0 则成立 |
| `str1 = str2`  | 字符串相等                                        |
| `str2 != str2` | 字符串不相等                                      |



### 5.6. 多重条件判断



| 判断符号     | 含义   | 举例                                                       |
| ------------ | ------ | ---------------------------------------------------------- |
| `-a` 和 `&&` | 逻辑与 | `[ 1 -eq 1 -a 1 -ne 0 ]` 或者 `[ 1 -eq 1 ] && [ 1 -ne 0 ]` |
| `-o` 和 `||` | 逻辑或 | `[ 1 -eq 1 -o 1 -ne 0 ]` 或者 `[ 1 -eq 1 ] || [ 1 -ne 0 ]` |



说明:

- `&&` 前面表达式为真, 才会执行后面的代码
- `||` 前面表达式为假, 才会执行后面的代码
- `;` 只用于分隔命令或者表达式



### 5.7. 类 C 风格



使用 类 C 风格的判断语句, `=` 是赋值, `==`是比较 

```bash
$ ((1==1)); echo $?

$ ((1<1)); echo $?

$ ((1>1)); echo $?

$ ((a=1)); echo $?
$ echo $a
```







## 6. for 循环语句

### 6.1. 列表循环



```bash
for variable in {list}
do
    command ...
       
done
   
```



`{1..5}` 就相当于 `range(1, 6)` in python

```bash
for i in {1..5}
do
    echo $i
done


# 步长为 2
for i in {0..50..2}
do
    echo $i
done
```





### 6.2. 不带列表循环



脚本后面所跟的<u>参数</u>, 用户指定的



```bash
for i
do
    command ...
done
```



比如 `./script.sh 5`，就是 for 循环 `5` 次



## 7. while 循环





## 8. 影响 shell 程序的内置命令

```bash
exit            # 退出程序
break           # 结束当前循环，或跳出本层循环
continue        # 忽略本次循环剩余的代码， 直接进行下一次循环

shift           # **使位置参数向左移动， 默认移动 1 位，但是也可以使用 `shift 2`**

:
true
false
```



### 8.1 补充扩展 `except`

`expect` 自动应答，`tcl` 语言

#### 使用场景一：远程登陆到 server，但无操作

```bash
#！ /usr/bin/expect

# 开启一个程序
spawn ssh root@10.1.1.1

# 捕获相关内容
expect {
    "(yes/no)?" { send "yes\r";exp_continue}
    "password：" { send "123456\r" }
}

# 交互
interact
```



第二种使用方式是下面这种，直接创建好变量然后直接使用

```bash
# 定义变量
set ip 10.1.1.1
set pass 123456
set timeout 5

spawn ssh root@ip
expect {
    "(yes/no)?" { send "yes\r";exp_continue}
    "password：" { send "$pass\r" }
}

interact
```



第三种方法是使用脚本后面的位置参数

例子：`./script.sh 10.1.1.1 password`

```bash
set ip [ lindex $argv 0 ]
set pass [ lindex $argv 1 ]
set timeout 5

spawn ssh root@ip
expect {
    "(yes/no)?" { send "yes\r";exp_continue}
    "password：" { send "$pass\r" }
}

interact
```



#### 使用场景二：远程登陆到 server，并操作



```bash
while read ip address
do
    /usr/bin/expect << -END &> /dev/null
    ...
    ...
    
    END

done < ip.txt
```

`-END` 中 `-` 表示 `END` 之前有制表符，需要省略，`END` 就是个字符，可以随意更换





## 9. 扩展补充

### 9.1. 数组定义

#### 9.1.1. 数组分类

- 普通数组：只能使用**整数**作为数组索引（元素的下标）
- 关联数组：可以使用**字符串**作为数组索引（元素的下标）



#### 9.1.2. 普通数组定义

- 一次赋予一个值

  ```bash
  # 数组名[索引下标] = 值
  
  array[0]=v1
  array[1]=v2
  array[2]=v3
  ```

- 一次赋予多个值

  ```bash
  array=(var1 var2 var3 var4)
  
  array2=(1 2 3 4 "Hello World!" [10]="10th element")
  ```

- 查看普通数组，关联数组

  ```bash
  declare -a
  
  declare -A
  ```

  

##### 数组元素读取

```bash
#! /usr/bin bash

$ array=(var1 var2 var3 var4)

# 获取第一个元素
$ echo ${array[0]}
var1
# 获取整个数组所有元素
$ echo ${array[*]}
var1 var2 var3 var4

$ echo ${array[@]}
var1 var2 var3 var4

# 获取数组中的一段 slicing; 注意可以取到 end 位的元素，与 python 不同
$ echo ${array[@]:1:2}
var2 var3

# 获取数组元素个数
$ echo ${#array[@]}
4

# 获取数组的下标
$ echo ${!array[@]}
0 1 2 3
```



#### 9.1.3. 关联数组定义

##### 关联数组声明

```bash
declare -A asso_array1
declare -A asso_array2
declare -A asso_array3
```



##### 数组赋值

1. 一次赋一个值

   ```bash
   # 数组名[索引]=变量值
   
   $ asso_array1=val1
   ```

2. 一次赋多个值

   ```bash
   $ asso_array1=([name1]=harry [name2]=potter [name3]=jack)
   ```

3. 查看关联数组

   ```bash
   # declare -A
   
   $ declare -A asso_array1='([name1]=harry [name2]=potter [name3]=jack)'
   ```



##### 数组获取

1. 获取关联数组所有元素

   ```bash
   $ echo ${asso_array1[@]}
   ```

2. 获取关联数组的下标

   ```bash
   $ echo ${!asso_array1[@]}
   ```



## 10. `case` 语句



1. 多重匹配语句
2. 匹配成功，执行相应的命令



### 10.1. 语法结构

```bash
# pattern 表示需要匹配的模式

case var in

pattern1)
    command
    ;;
pattern2)
    command
    ;;
*)
    command
    ;;
esac

```







## 11. 函数



### 11.1. 定义函数

```bash
函数名() {
    command ...
}


function 函数名() {
    command
}
```



### 11.2. 函数中的 `return` 关键字

1. `return` 可以结束一个函数，just like normal function
2. `reutrn` 默认返回函数中最后一个命令的状态值， 也可以给定参数，范围是 `0-256`
3. 如果没有 `return` 命令，函数将返回组后一个指令的退出状态值 `return_code`



### 11.3. 调用函数

```bash
# func.sh

# source 一下函数定义的文件
$ source func.sh

# 在 terminal 中调用函数
$ function1
```





## 12. 正则表达式



### 12.1. 正则表达式中的名词解释

1. 元字符

   指正则表达式中具有特殊意义的专用字符，比如 点(.) 星(*) 问号(?)

2. 前导字符

   位于元字符前面的字符 ab**c** *



### 12.2. 第一类正则表达式



#### 12.2.1. 普通常用元字符



| 元字符 | 功能                                                     | 备注      |
| ------ | -------------------------------------------------------- | --------- |
| `.`    | 匹配除了换行符以外的任意**<u>单个</u>**字符              |           |
| `*`    | **前导字符**出现 *0* 次或者*连续多次*                    |           |
| `.*`   | **<u>任意</u>长度字符**                                  | `ab.*`    |
| `^`    | 以 ... 开头                                              | `^root`   |
| `$`    | 以 ... 结尾                                              | `bash$`   |
| `^$`   | 空行                                                     |           |
| `[]`   | 匹配括号里任意单个字符或者一组单个字符                   | `[abc]`   |
| `[^]`  | 匹配**不包含**括号里任意单个字符或者一组单个字符         | `[^abc]`  |
| `^[]`  | 匹配括号里任意单个字符或者一组单个字符**开头**           | `^[abc]`  |
| `^[^]` | 匹配**不包含**括号里任意单个字符或者一组单个字符**开头** | `^[^abc]` |



#### 12.2.2. 其他常用元字符



| 元字符    | 功能                                    | 备注           |
| --------- | --------------------------------------- | -------------- |
| `\<`      | 取单词的头                              | 举例 `\<str`   |
| `\>`      | 取单词的尾                              | 举例 `ed\>`    |
| `\< \>`   | **精确匹配**                            |                |
| `\{n\}`   | 匹配<u>前导字符</u>**连续**出现 n 次    |                |
| `\{n,\}`  | 匹配<u>前导字符</u>**至少**出现 n 次    |                |
| `\{n,m\}` | 匹配<u>前导字符</u>出现 n 次与 m 次之间 |                |
| `\( \)`   | 保存被匹配的字符                        |                |
| `\d`      | 匹配 数字 `grep -P`                     | `[0-9]`        |
| `\w`      | 匹配 字母数字下划线 `grep -P`           | `[a-zA-Z0-9_]` |
| `\s`      | 匹配 空格 制表符 换页符`grep -P`        | `[\t\r\n]`     |



#### 12.2.3. 扩展类正则常用元字符

扩展正则匹配需要添加额外的 flag

- `grep` 必须使用 `-E` ， 或者使用 `egrep`
- `sed` 必须使用 `-r`



| 扩展元字符 | 功能                                | 备注                       |
| ---------- | ----------------------------------- | -------------------------- |
| `+`        | 匹配**一个或者多个**<u>前导字符</u> | `bo+` 匹配 `boo` 或者 `bo` |
| `?`        | 匹配**零个或者一个**<u>前导字符</u> | `bo+` 匹配 `bo` 或者 `b`   |
| `|`        | 或                                  | `a|b` 匹配 `a` 或者 `b`    |
| `()`       | 组字符 （看成整体）                 |                            |
| `{n}`      | 前导字符重复 n 次                   |                            |
| `{n,}`     | 前导字符重复至少 n 次               |                            |
| `{n,m}`    | 前导字符重复 `n - m` 次             |                            |



### 12.3. 第二类正则表达式



| 表达式 | 功能 | 示例 |
| ------ | ---- | ---- |
|        |      |      |
|        |      |      |
|        |      |      |
|        |      |      |
|        |      |      |
|        |      |      |






## 补充一些写代码时用到的 tricks

### `${variableName,,}`

This is called "Parameter Expansion" available in bash version 4+ . To change the case of the string stored in the variable to lower case. Eg:

```
var=HeyThere
echo ${var,,}
heythere
```


### `jq`

jq is a lightweight and flexible command-line JSON processor. very useful when use shell for `curl` and receive a JSON format do some filterings.
















