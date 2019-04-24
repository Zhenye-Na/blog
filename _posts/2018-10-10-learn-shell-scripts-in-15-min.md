---
layout: article
title: "Learn Shell script in 15 minutes"
date: 2018-10-10
excerpt: "A shell script is a computer program designed to be run by the Unix shell, a command-line interpreter. The various dialects of shell scripts are considered to be scripting languages. Typical operations performed by shell scripts include file manipulation, program execution, and printing text. A script which sets up the environment, runs the program, and does any necessary cleanup, logging, etc. is called a wrapper."
tags: [Shell Scripts]
---

> A shell script is a computer program designed to be run by the Unix shell, a command-line interpreter. The various dialects of shell scripts are considered to be scripting languages. Typical operations performed by shell scripts include file manipulation, program execution, and printing text. A script which sets up the environment, runs the program, and does any necessary cleanup, logging, etc. is called a wrapper.
> In this tutorial, I will try to help you understand some of the basics of shell script programming (aka shell scripting). You can find all source codes [here](https://github.com/Zhenye-Na/sh-tutorial).

# Learn Shell script in 15 minutes

## Overview

Normally shells are interactive. It means shell accept command from you (via keyboard) and execute them. But if you use command one by one (sequence of 'n' number of commands) , the you can store this sequence of command to text file and tell the shell to execute this text file instead of entering the commands. This is know as shell script.


### `Hello World` - your first Shell script

First, let's print `Hello World` in Shell script, which is the simplest script!

You use any kinds of text editor, just copy and paste the following code and save it as `hello_world.sh`.

```sh
#!/bin/bash
echo "Hello World!"
```

You can run the script by typing the following command in your terminal.

```sh
cd "path_of_your_hello_world.sh" # go the directory of your shell script

chmod +x ./hello_world.sh # give permission to run the script

./hello_world.sh # run it
```

After running, you will see:

```sh
cd src/
$ chmod +x ./hello_world.sh
$ ./hello_world.sh
Hello World!
```


### Variable declaration

Next, we will explore hwo to declare variables in Shell scripts. Let's create another file, copy and paste the following codes and save it as
named `variables.sh`. I will explain the meaning line by line.

```sh
#!/bin/bash
stringVar="Hello World!"
intVar="233"

echo $stringVar
echo $intVar

echo stringVar
echo intVar
```

Following the previous process to give "permission" of the sh file and you will see:

```sh
$ chmod +x ./variables.sh
$ ./variables.sh
Hello World!
233
stringVar
intVar
```

First, we declare two variables. The declaration grammar is the same as any programming languages you have known before. However, please do not leave a space before or after the `=` symbol in Shell script.

```
stringVar="Hello World!"
intVar="233"
```

Next, if we wanna use the variable we declared before, please make sure you add a `$` symbol before the variable name, like this:

```sh
echo $stringVar
echo $intVar
```

### Basic operations

| Operators 	|   Description  	|
|:---------:	|:--------------:	|
|     +     	|      Plus      	|
|     -     	|      Minus     	|
|     *     	| Multiplication 	|
|     /     	|    Division    	|


Let's create a new sh file named `operation.sh`, just copy and paste the following codes to follow along. The only thing you need pay attention to is that you cannot add space before and after `=` symbol. Besides, multiplication sign `*` should be written like `/*`.

```sh
#!/bin/bash
echo "This is a example explaining basic operations in Shell script"

a=233
b=666

val1=`expr $a + $b`
echo "Total value: $val1"

val2=`expr $a - $b`
echo "Total value: $val2"

val3=`expr $a \* $b`
echo "Total value: $val3"

val4=`expr $a / $b`
echo "Total value: $val4"
```

Output of the above codes will look like this:

```sh
This is a example explaining basic operations in Shell script
Total value: 899
Total value: -433
Total value: 155178
Total value: 0
```


### Other operations

| Operators 	| Descriptions 	|
|:---------:	|:------------:	|
|     %     	|    modulus   	|
|     ==    	|     equal    	|
|     =     	| assign value 	|
|     !=    	|   not equal  	|
|     !     	|  logical NOT 	|
|     -o    	|  logical OR  	|
|     -a    	|  logical AND 	|


Example:

```sh
#!/bin/bash
a=233
b=666

val1=`expr $a / $b`
echo "Total value: $val1"

val2=`expr $a % $b`
echo "Total value: $val2"

if [ $a == $b ]
then
    echo "a is equal to b"
fi

if [ $a != $b ]
then
    echo "a is not equal to b"
fi
```

Output:

```sh
Total value: 0
Total value: 233
a is not equal to b
```

### Relational Operators

| Operators 	|                    Descriptions                    	|
|:---------:	|:--------------------------------------------------:	|
|    -eq    	|                Return True if equals               	|
|    -ne    	|              Return True if not equals             	|
|    -gt    	|       Return True if LHS is greater than RHS       	|
|    -lt    	|         Return True if LHS is less than RHS        	|
|    -ge    	| Return True if LHS is greater than or equal to RHS 	|
|    -le    	|   Return True if LHS is less than or equal to RHS  	|

Example:

```sh
#!/bin/bash
a=233
b=666

if [ $a -eq $b ]
then
    echo "a is equal to b"
else
    echo "a is not equal to b"
fi

if [ $a -ne $b ]
then
    echo "a is not equal to b"
else
    echo "a is equal to b"
fi

if [ $a -gt $b ]
then
    echo "a is greater than b"
else
    echo "a is not greater than b"
fi

if [ $a -lt $b ]
then
    echo "a is less than b"
else
    echo "a is not less than b"
fi

if [ $a -ge $b ]
then
    echo "a is greater than or equal to b"
else
    echo "a is not greater than or equal to b"
fi

if [ $a -le $b ]
then
    echo "a is less than or equal to b"
else
    echo "a is not less than or equal to b"
fi
```

Output:

```sh
a is not equal to b
a is not equal to b
a is not greater than b
a is less than b
a is not greater than or equal to b
a is less than or equal to b
```

### String operators

| Operators 	|                    Descriptions                   	|
|:---------:	|:-------------------------------------------------:	|
|     =     	|          Return True if two strings equal         	|
|     !=    	|        Return True if two strings not equal       	|
|     -z    	|        Return True if length of string is 0       	|
|     -n    	|      Return True if length of string is not 0     	|
|  -d file  	|         Return True if `file` is directory        	|
|  -r file  	|         Return True if `file` is readable         	|
|  -w file  	|        Return True if `file` is write-able        	|
|  -x file  	|        Return True if `file` is executable        	|
|  -s file  	|         Return True if `file` is non-empty        	|
|  -e file  	| Return True if `file` (directory included) exists 	|



Example:

```sh
#!/bin/bash
string1="Harry"
string2="Potter"

string3=$string1" "$string2 # string concatenation

echo $string3       # print string3
echo ${#string3}    # print length of string3
echo ${string3:2:5} # print slice of string3
```

Output:

```sh
Harry Potter
12
rry P
```


### Array

Example:

```sh
#!/bin/sh

# declare an array
array=(1 2 3 4 5)
array2=(aa bb cc mm ee)

# get value of an array by index
val=${array[2]}
echo $val

val=${array2[3]}
echo $val

# get length of array
length=${#array[*]}
echo $length
```

Output:

```sh
3
mm
5
```


### `echo` in Shell script

echo is a built-in command in the bash and C shells that writes its arguments to standard output.


Example:

```sh
#!/bin/sh

echo "Machine Learning"
echo Machine Learning

text="Machine Learning"
echo $text

# echo with `\n` new line
echo -e "Machine \nLearning"

# echo to file
echo "Machine Learning" > ml.txt

# echo time
echo `date`
```

Output:

```
Machine Learning
Machine Learning
Machine Learning
-e Machine
Learning
Wed Oct 10 17:24:58 CDT 2018
```

### Loops

#### `for` loop

Example:

```sh
#!/bin/sh

for i in {1..5}
do
    echo $i
done


for i in 2 3 3 6 6 6
do
    echo $i
done

for FILE in $HOME/.bash*
do
    echo $FILE
done

```

Output:

```sh
1
2
3
4
5
2
3
3
6
6
6
/Users/macbookpro/.bash_history
/Users/macbookpro/.bash_profile
/Users/macbookpro/.bash_profile-anaconda.bak
/Users/macbookpro/.bash_profile.pysave
/Users/macbookpro/.bash_profile.swp
/Users/macbookpro/.bash_sessions
```


#### `while` loop

```sh
#!/bin/sh

count=0

while [ $count -lt 5 ]
do
    count=`expr $count + 1`
    echo $count
done
```


### `break` and `continue`

```sh
break    # break current loop
break n  # break the n_th loop
continue # continue current loop
```

### Functions

#### Functions with no return value

Example:

```sh
#!/bin/sh

# Define a function with no return value
sysout(){
    echo "Hello World!"
}

# Call this function
sysout
```

Output:

```sh
$ ./no-return-func.sh
Hello World!
```

#### Functions with return value

Example:

```sh
#!/bin/sh

# Define a function with return value
func(){
    intVar1=3
    intVar2=5
    return $(($intVar1+$intVar2))
}

# Call the function
func
result=$?
echo $result
```

Output:

```sh
$ ./return-val-func.sh
8
```


### Redirection

```sh
#!/bin/sh

# Write `result` in `file` (will remove previous text)
$echo result > file

# Write `result` in `file` (append at the end)
$echo result >> file

# Read `input` from `file`
$echo input < file
```

## Github Auto-push

```sh
#!/bin/sh

echo "-------------Begin-------------"

git add .
git commit -m $1
echo $1
git push origin master

echo "--------------End--------------"
```
