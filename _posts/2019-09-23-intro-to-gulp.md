---
layout: article
title: "gulp.js - 基于文件流的构建系统 | 入门简介"
date: 2019-09-23
modify_date: 2019-09-23
excerpt: "gulp.js 入门简介 | 学习笔记"
tags: [gulp.js]
key: gulp-intro
---

# gulp.js - 基于文件流的构建系统 | 入门简介

> Gulp 是与 Grunt 功能类似的**前段项目构建工具**, 也是基于 Node.js 的**自动任务运行器**
> 
> 特点: 任务化, 基于流, 任务执行异步
> 
> 能够自动化的完成 js/css/html 等文件的合并, 压缩, 检查, 监听


## 0. 准备项目文件

```
.
├── dist
├── gulpfile.js
├── index.html
├── package.json
└── src
    ├── css/
    ├── js/
    └── less/
```

可以在 css, js, less 三个文件夹添加几个随意的文件, 方便看出效果

***

全局安装 `gulp.js`

```
npm install gulp -g
```

局部安装 `gulp.js`

```
npm install gulp --save-dev
```

## 1. 下载安装所需的插件

处理 js

```sh
npm install gulp-concat gulp-uglify gulp-rename --save-dev
```

处理 css

```sh
npm install gulp-less gulp-clean-css --save-dev
```

处理 html

```sh
npm install gulp-htmlmin --save-dev
```


## 2. gulp.js 相关 API 介绍

1. `gulp.src()`
    1. 获取到对应文件的位置
2. `gulp.dest()`
    1. 输出文件位置
3. `gulp.task()`
    1. 注册一个任务
4. `gulp.watch()`
    1. 监听 globs 并在发生更改时运行任务 

详细 API 一定要看官方文档!!!

http://www.gulpjs.com.cn/docs/api/

## 3. 处理 js 文件

在这里我们用以下几个插件来对 js 文件进行处理

- gulp-concat: 合并文件 (js/css)
- gulp-uglify: 压缩 js 文件
- gulp-rename: 文件重命名

其中 uglify 和 rename 没有先后顺序, gulp 会记录执行顺序, 就算多次 rename 也不影响

```js
.pipe(rename({suffix: '.min'}))
```

上面这一行代码的意思是在文件名加上 `.min` 这个后缀. 比较常见的就是 `bootstrap.min.js`

```js
var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

gulp.task('js', function() {
    return gulp.src('src/js/**/*.js')   // 找到目标源文件, 将数据读取到 gulp 内存中
        .pipe(concat('build.js'))       // 临时合并文件
        .pipe(gulp.dest('dist/js/'))    // 临时文件输出目录
        .pipe(uglify())                 // 压缩文件
        .pipe(rename({suffix: '.min'})) // 重命名
        .pipe(gulp.dest('dist/js/'))    // 输出压缩后的文件
});
```

 执行任务, 在命令行输入
 
 ```sh
 gulp js
 ```

## 4. 处理 css / less 文件

我们用到了以下插件

- gulp-less: 编译 less 文件
- gulp-clean-css: 清理 css 文件

在下面这个例子里面, 我们的处理流程是

1. 先处理 less 文件, 将其编译成 css, 输出目录为 css
2. 将 css 目录下的 css 文件压缩

我们可以将上述处理流程写成这个"亚子"

```js
var less = require('gulp-less');
var cssClean = require('gulp-clean-css');

gulp.task('less', function() {
    return gulp.src('src/less/**/*.less')
        .pipe(less())                   // 编译 less 为 css 文件
        .pipe(gulp.dest('src/css/'))
});

gulp.task('css', function() {
    return gulp.src('src/css/**/*.css')
        .pipe(concat('build.css'))
        .pipe(rename({suffix: '.min'}))
        .pipe(cssClean({compatiility: 'ie8'}))
        .pipe(gulp.dest('dist/css/'))
});
```

我们在设置一个默认的 task

```js
gulp.task('default', ['js', 'less', 'css']);
```

看起来感觉没什么问题哦, 但是! 因为 `return gulp.src().pipe()` 语句, 所以整个任务是**异步执行**, 也就是说当你在命令行敲下 `gulp`, 实际的执行顺序**可能**是下面这个亚子:

```
Starting task: js
Starting task: css
Starting task: less
Finishing task: less
Finishing task: js
Finishing task: css
```

如果你还没有意识到问题的严重性, 那么...

既然是异步执行, 就有可能 css 这个 task 结束后, less 任务才编译完成, 将输出文件保存到了 css 文件夹, 但已经没有什么用了, 因为 css 任务已经完成了.

一种解决方案就是删掉 `return` 语句, 这样 gulp task 的执行就是同步的 (顺序执行)

另一种解决方案就是比较推荐的了, 因为异步高效啊


```js
gulp.task('less', function() {
    return gulp.src('src/less/**/*.less')
        .pipe(less())                   // 编译 less 为 css 文件
        .pipe(gulp.dest('src/css/'))
});

// 执行 css 之前确保 less 执行完毕
// ['less'] 依赖任务

gulp.task('css', ['less'], function() {
    return gulp.src('src/css/**/*.css')
        .pipe(concat('build.css'))
        .pipe(rename({suffix: '.min'}))
        .pipe(cssClean({compatiility: 'ie8'}))
        .pipe(gulp.dest('dist/css/'))
})
```

css 的任务多了一个传参 `['less']`, 这个传参代表着 dependencies, 表示当前任务需要依赖哪些任务的完成, 很显然, css 要等 less 编译结束才进行处理压缩, 完美!


## 5. 处理 html 文件

这个就很中规中矩, 没什么花样, 也没什么可以压缩,

```js
var htmlMin = require('gulp-htmlmin');

gulp.task('html', function() {
    return gulp.src('index.html')
        .pipe(htmlMin({collapseWhitespace:true}))
        .pipe(gulp.dest('dist/'))
});
```

## 6. 自动化处理

### "半自动化"

安装插件

```sh
npm install gulp-liverreload --save-dev
```

gulp-liverreload 主要作用是: **实时自动编译刷新**

```js
var livereload = require('gulp-livereload');
gulp.task('watch', ['default'], function() {
    livereload.listen();  // 开启监听
    // 确认监听目标以及绑定相应的任务
    gulp.watch('src/js/**/*.js', ['js']);
    gulp.watch(['src/css/**/*.css', 'src/less/**/*.less'], ['css']);
});
```

`gulp.watch()` 监视某一些文件, 如果文件发生变化, 自动运行传参代表的任务

为了使 `livereload` 呢能够正常使用, 我们还需要在之前的 task 之后加上一行 (再铺一个管道)

```js
    .pipe(livereload())
```

### "全自动化"

安装 `gulp-connect` 插件, connect 代码里其实有一个微型的 server

```sh
npm install gulp-connect --save-dev
```

- root: "输出的文件位置"
- livereload: 是否自动刷新
- port: 端口号

```js
// 注册热加载的任务 server, 注意依赖 build 任务
// 注册热加载的任务
gulp.task('server', ['default'], function() {
    connect.server({
        root: 'dist/',
        livereload: true,
        port: 5000
    })

    gulp.watch('src/js/**/*.js', ['js']);
    gulp.watch(['src/css/**/*.css', 'src/less/**/*.less'], ['css']);
});
```

不同于上一种方法, 我们要在 task 加上这样一行

```js
    .pipe(connect.reload())
```

其实, 我们还可以调用 `open` 这个插件, 做到自动在浏览器新建一个 tab, 打开 localhost 的地址, 但我觉得没什么卵用就不写了.


下次想到什么, 再加.