---
layout: article
title: "django.core.exceptions.FieldError: Unknown field(s) `col_name` specified for `model_name`"
date: 2019-08-21
modify_date: 2019-08-21
excerpt: "记一次 Django 排错"
tags: [Django]
key: page-aside
---



# django.core.exceptions.FieldError: Unknown field(s) `col_name` specified for `model_name`

查找了很多资料后, 下面说一下我是怎么解决这个问题的

1. 找到对应 model 下的 `migrations/` 文件夹, 除了 `__init__.py` 其他文件全部删掉

2. 然后执行

    ```
    python manage.py makemigrations
    python manage.py migrate
    ```

3. 进入项目所在数据库, 找到 `django_migrations` 表

    用我自己的项目举例子:
    
    ```
    mysql> show tables;
    +-------------------------------------+
    | Tables_in_tablename                  |
    +-------------------------------------+
    | account_emailaddress                |
    | account_emailconfirmation           |
    | articles_article                    |
    | auth_group                          |
    | auth_group_permissions              |
    | auth_permission                     |
    | django_celery_beat_clockedschedule  |
    | django_celery_beat_crontabschedule  |
    | django_celery_beat_intervalschedule |
    | django_celery_beat_periodictask     |
    | django_celery_beat_periodictasks    |
    | django_celery_beat_solarschedule    |
    | django_content_type                 |
    | django_migrations                   |
    | django_session                      |
    | django_site                         |
    | news_news                           |
    | news_news_liked                     |
    | socialaccount_socialaccount         |
    | socialaccount_socialapp             |
    | socialaccount_socialapp_sites       |
    | socialaccount_socialtoken           |
    | taggit_tag                          |
    | taggit_taggeditem                   |
    | thumbnail_kvstore                   |
    | users_user                          |
    | users_user_groups                   |
    | users_user_user_permissions         |
    +-------------------------------------+
    28 rows in set (0.00 sec)
    ```
    
    
    查看:
    
    ```
    select * from django_migrations;
    ```
    
    在 `app` 那一列找到出错信息对应的 `model_name`, 然后
    
    ```
    delete from django_migrations where app = 'model_name'
    ```

4. 再次执行

    ```
    python manage.py makemigrations
    python manage.py migrate
    ```

5. 如果继续报错某某表已存在, 那么就把那个表删掉重新执行 migrations

