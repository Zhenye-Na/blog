---
layout: post
title: "How to deploy a Laravel APP to Heroku"
date: 2018-08-02
excerpt: ""
tags: [Laravel, Heroku]
---

# How to deploy a Laravel APP to Heroku

> Recently, I have completed my first full stack web application: a Q&A community, developed by using using `AngularJS` for front-end, `Laravel` and `MySQL` for back-end. I know this application is not perfect. But it is the first app I developed on my own and deployed on `Heroku`. It is really exciting that I have made a web application to real world.  
> For more information, you can refer to [here](http://qac.herokuapp.com/#!/home) for a taste of this application or [Github](https://github.com/Zhenye-Na/Quora-mini) for source code.
> 
> **So Let's started!**


## Prerequisite

- Php and Laravel knowledge
- Heroku user account
- Heroku CLI
- Git


## Creating a Laravel application

> **Here I assumed you are developing or have accomplished development of a Laravel APP and would like to deploy via [Heroku](https://www.heroku.com/) to make it online.**

So just `cd` to your project folder

### Initializing a Git repository

It’s now time to initialize a Git repository and commit the current state:

```sh
$ git init
Initialized empty Git repository in ~/your_laravel_app/.git/
$ git add .
$ git commit -m "Initial Commit"
```


## Deploying to Heroku

To deploy your application to Heroku, you must first create a `Procfile`, which tells Heroku what command to use to launch the web server with the correct settings. After you’ve done that, you’re going to create an application instance on Heroku, configure some Laravel environment variables, and then simply `git push` to deploy your code!


### Creating a Procfile

```sh
$ echo web: vendor/bin/heroku-php-apache2 public/ > Procfile
```

### Creating a new application on Heroku

```sh
$ heroku create [: your_app_name: ]
```

Replace `[: your_app_name: ]` with the name of your app or leave it blank, Heroku will generate random name for this app.


### Setting a Laravel encryption key

#### In dashboard

Copy the **APP_KEY** from your `.env` file, then go to the Heroku dashboard for you app -> Settings -> Reveal Config Vars. Add **new key pair values** like `APP_KEY : base64:[: :]`.

#### In Heroku CLI

You can simply set environment variables using the `heroku config` command, so run a `heroku config:set` as the last step before deploying your app for the first time:

```sh
$ heroku config:set APP_KEY=[: :]
```

Instead of manually replacing the `[: :]` placeholder in the command above, you can also run
`heroku config:set APP_KEY=$(php artisan --no-ansi key:generate --show)`.
{:.info}


### Pushing to Heroku

Go to the Heroku dashboard for you app -> Settings, you can find `Heroku Git URL` => `https://git.heroku.com/yourappname.git`. Copy it and run

```sh
$ git remote add heroku [: https://git.heroku.com/yourappname.git :]
```

Then you can push your codes to Heroku

```sh
$ git add .

$ git commit -m ":tada:"

$ git push heroku master
```

Cong! You have already deploy your first Heroku App online!
{:.success}


## Configure Database (MySQL) for your app (Optional)

If you are using `MySQL` in your app please follow the instructions below


### Add a PHP buildpack

```sh
$ heroku buildpacks:set https://github.com/heroku/heroku-buildpack-php
```

### Add MySQL add-ons

```sh
$ heroku addons:add cleardb
```

You may need add your credit card info first to install this add-on.
{:.info}


```sh
$ heroku config | grep CLEARDB_DATABASE_URL
```

This creates a config variable called `CLEARDB_DATABASE_URL`. Add `CLEARDB_DATABASE_URL` to our `.env` file.


### Modify database settings

Modify `config/database.php` so that we connect to our Heroku database.


```php
<?php

$url = parse_url(getenv("CLEARDB_DATABASE_URL"));

$host = $url["host"];
$username = $url["user"];
$password = $url["pass"];
$database = substr($url["path"], 1);

return [
    ...
    'connections' => [
        'mysql' => [
            'driver' => 'mysql',
            'host' => env('DB_HOST', $host),
            'port' => env('DB_PORT', '3306'),
            'database' => env('DB_DATABASE', $database),
            'username' => env('DB_USERNAME', $username),
            'password' => env('DB_PASSWORD', $password),
            'unix_socket' => env('DB_SOCKET', ''),
            'charset' => 'utf8mb4',
            'collation' => 'utf8mb4_unicode_ci',
            'prefix' => '',
            'strict' => true,
            'engine' => null,
        ],
```

### Pushing to Heroku

Go to the Heroku dashboard for you app -> Settings, you can find `Heroku Git URL` => `https://git.heroku.com/yourappname.git`. Copy it and run

```sh
$ git remote add heroku [: https://git.heroku.com/yourappname.git :]
```

Then you can push your codes to Heroku

```sh
$ git add .

$ git commit -m ":tada:"

$ git push heroku master
```

Cong! You have already deploy your first Heroku App online!
{:.success}


### Database Migration

In order to get our database set up without issue try these commands.

```sh
$ heroku run php artisan migrate

$ heroku run php artisan migrate:reset

$ heroku run php artisan migrate
```

> **From [Connor Leech's post](https://dev.to/connor11528/deploy-a-laravel-5-app-to-heroku)**:

> There is a common error many people experience (outlined above) 
Now that SQLSTATE[42000]: Syntax error or access violation: 1071 Specified key was too long; max key length is 767 bytes. Fortunately, Eric Barnes has a solution outlined [in this post](https://laravel-news.com/laravel-5-4-key-too-long-error).

If everything works fine, it will looks like this screenshot.


<img src="https://github.com/Zhenye-Na/Zhenye-Na.github.io/blob/master/assets/images/posts-img/heroku-deploy/1.jpeg?raw=true" width="80%" align="middle">


* * *

**Aside**: 

1. [Elusoji Sodeeq](https://medium.com/@sdkcodes) has made a great post and script which supports set all your Heroku Config Vars from your `.env` file once.  Check out the post [here](https://medium.com/@sdkcodes/the-easiest-way-to-set-config-vars-in-heroku-43eb3e911cac) or check out the [repo](https://github.com/sdkcodes/heroku-config) directly.
2. For SSL/HTTPS stuff, check out [Connor Leech](https://medium.com/@connorleech)'s post: thorough guide on setting up HTTPS through SSL certificates for a custom domain on [Medium](https://medium.com/@connorleech/https-ssl-on-heroku-with-google-domains-as-dns-provider-c55c438556c6)



## References

[1] Connor Leech, [Deploy a Laravel 5 app to Heroku](https://dev.to/connor11528/deploy-a-laravel-5-app-to-heroku)  
[2] Elusoji Sodeeq, [How to Deploy A Laravel App to Heroku](https://medium.com/@sdkcodes/how-to-deploy-a-laravel-app-to-heroku-24b5cb33fbe)  
[3] Heroku Dev Center, [Getting Started with Laravel on Heroku](https://devcenter.heroku.com/articles/getting-started-with-laravel)