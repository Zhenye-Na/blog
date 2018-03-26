---
layout: post
title:  "Install MySQL on Mac OS X"
author: "Zhenye Na"
comments: true
date:   2017-07-17 
---

<style>
img.pics {
    display: block;
    margin: 0 auto;
}
</style>


# Install MySQL on Mac OS X

## Download MySQL

Downdload MySQL for mac [here](https://dev.mysql.com/downloads/mysql/). I prefer DMG Archive.

<img src="https://Zhenye-Na.github.io/images/mysql1.png" class="pics" />
<br>
<img src="https://github.com/Zhenye-Na/home/blob/master/images/mysql2.png" class="pics" />
<br>
<img src="https://github.com/Zhenye-Na/home/blob/master/images/mysql3.png" class="pics" />
<br><br>
Pay attention to the password in notification center. If you do not save the proper `password` for `admin`, open notification center and scroll a little bit, you will find something like this:

<img src="https://github.com/Zhenye-Na/home/blob/master/images/mysql4.jpg" class="pics" /> 

## MySQL Configuration

- Choose Apple () menu > System Preferences > MySQL, select MySQL and start MySQL server and move to the next step.

<img src="https://github.com/Zhenye-Na/home/blob/master/images/mysql5.jpg" class="pics" />


- Open terminal and type:
	
	```bash
	cd ~
	touch .bash_profile
	open -e .bash_profile
	```

<img src="https://github.com/Zhenye-Na/home/blob/master/images/mysql7.jpg" class="pics" />

- Type this piece of codes in the file you opened, then save the file and quit.

	```
	export PATH=${PATH}:/usr/local/mysql/bin
	```
	
- Use this piece of code and the password appeared in notification center to log in.

	```bash
	mysql -uroot -p
	```
- If you successfully log in using Terminal, you can use this piece of code to reset/change your password.
	
	```bash
	SET PASSWORD FOR 'root'@'localhost' = PASSWORD('new password');
	```

<img src="https://github.com/Zhenye-Na/home/blob/master/images/mysql8.jpg" class="pics" />
	
- Configuration is done.