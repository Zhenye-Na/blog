---
layout: post
title: "Setting up MongoDB in AWS Cloud9"
date: 2018-08-05
excerpt: "Install MongoDB on AWS Cloud9 in just a few minutes"
tags: [Cloud9, MongoDB]
---

> *Recently, I have been working on AWS Cloud9 for my newly project which needs dealing with MongoDB. I have spent nearly a hour to make sure that MongoDB is installed successfully. I have found this wonderful explanation in the followup of the outdated "Official tutorial". So don't waste your time on searching anymore, let's start it!*

## Official tutorial of setting up MongoDB in Cloud9

Below are the steps of the Official tutorial of installing MongoDB on Cloud9, you can follow the instructions, if everything is working fine, that will be great. If not, you can go directly to the second part of this tutorial.

1. **Installing MongoDB on a Cloud9 workspace**

    To install MongoDB in your workspace, you can open a terminal and run the following command:
    
    ```
    sudo apt-get install -y mongodb-org
    ```

2. **Running MongoDB on a Cloud9 workspace**

    MongoDB is preinstalled in your workspace. To run MongoDB, run the following below (passing the correct parameters to it). Mongodb data will be stored in the folder data.
    
    ```sh
    $ mkdir data
    $ echo 'mongod --bind_ip=$IP --dbpath=data --nojournal --rest "$@"' > mongod
    $ chmod a+x mongod
    ```
    
    You can start mongodb by running the mongod script on your project root:
    
    ```sh
    $ ./mongod
    ```

## Modified version

AWS Linux has changed to use `yum` instead of `apt-get`, so you should use the following commands instead:

1. copy this to the terminal.

    ```sh
    $ sudo yum-config-manager --add-repo /etc/yum.repos.d/mongodb-org-3.6.repo
    ```

2. **Optional** - try first without this step

    ```sh
    $ sudo yum-config-manager --enable epel
    ```


3. First enter this to the terminal

    ```sh
    $ sudo vi /etc/yum.repos.d/mongodb-org-3.6.repo
    ```

    then need to enter the text into terminal: 

    ```
    [mongodb-org-3.6]
    name=MongoDB Repository
    baseurl=https://repo.mongodb.org/yum/amazon/2013.03/mongodb-org/3.6/x86_64/
    gpgcheck=1
    enabled=1
    gpgkey=https://www.mongodb.org/static/pgp/server-3.6.asc
    ```

4. when the text above appears in the terminal press `Esc` then need to enter `:wq` (colon +wq) to save the changed file

5. Now need to install mongodb : 

    ```sh
    $ sudo yum install -y mongodb-org
    ```

6. Then enter the following in the root `~` directory:

    ```sh
    $ mkdir data
    $ echo 'mongod --dbpath=data --nojournal' > mongod
    $ chmod a+x mongod
    ```

7. No, in order to run `mongod`, you should `cd` to `~` first, then run

    ```sh
    $ ./mongod
    ```
    
    If everything works fine, then you have already installed MongoDB successfully on Cloud9, try type `mongo` in terminal to check. If not, please follow the instructions below.


6. If you will have error that mongodb conflicts with earlier version or something like this then you need to delete the the pkg with what it conflicts by : 

    ```sh
    $ sudo yum remove
    ```

7. Then go to [Configure the package management system (yum)](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-amazon/#configure-the-package-management-system-yum) and continue from the step Run MongoDB Community Edition:

    ```sh
    $ sudo service mongod start
    ```



## References

[1] Brady, [*"Setting up MongoDB"*](https://community.c9.io/t/setting-up-mongodb/1717)  
[2] [MetaGS](https://community.c9.io/u/MetaGS), followup in post [*"Setting up MongoDB"*](https://community.c9.io/t/setting-up-mongodb/1717)  