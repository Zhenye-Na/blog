---
layout: article
title: "Introduction to SQLAlchemy in Flask"
date: 2019-09-04
modify_date: 2019-09-04
excerpt: "Flask SQLAlchemy Tutorial"
tags: [Flask, SQLAlchemy, ORM]
key: flask-sqlalchemy
---

# Introduction to SQLAlchemy in Flask

> **This article is originaly from [Kite](https://kite.com)'s blog, which could be found [here](https://kite.com/blog/python/flask-sqlalchemy-tutorial). I slightly modified the article so that I can re-publish to my blog.**
>
> Author: [Shajia Abidi](https://www.linkedin.com/in/abidishajia/)



## Introduction

In this article, we're going to learn the basics of SQLAlchemy by creating a data-driven web application using Flask, a Python framework. We'll build a minimal Flask app that keeps track of your book collection.

The app will allow users to create new books, read all the existing books, update the books, and delete them. These operations – create, read, update, and delete – are more commonly known as "CRUD" and form the basis of nearly all web applications. we'll learn more about CRUD operations later in the article.

But before we start playing with CRUD, let's understand other parts of the application, beginning with SQLAlchemy.



## What is SQLAlchemy?

Note that we have a Flask extension `flask-sqlalchemy`, which simplifies the use of SQLAlchemy by providing useful defaults and extra helpers, making it easier to accomplish common tasks. For this article, we'll only be using plain SQLAlchemy – just so we have a basic understanding of SQLAlchemy before adding any extensions.

According to their website, *"SQLAlchemy is the Python SQL toolkit and the Object Relational Mapper that gives application developers the full power and flexibility of SQL"*.

After reading the definition above, the first question that pops up is what an <u>Object Relational Mapper</u> is. Object Relational Mapper, also known as ORM, is a technique used to write database queries using the object-oriented paradigm of your preferred language (in this case, Python).

In even simpler terms, an ORM can be thought of as a translator that translates code from one set of abstractions to another. In our case – from Python to SQL.



There are a lot of different reasons to use the ORM besides not having to craft SQL strings. Some of which are:

- Speeding up web development since we don't have to switch back and forth between writing Python and SQL
- Eliminating repetitive code
- Streamlining the workflow and queries the data more efficiently
- Abstracting away the database system so switching between different databases becomes smooth
- Generating boilerplate code for the basic CRUD operations



Let's dig a little deeper.

Why do we use the ORM when we can write database queries using raw SQL? When we write queries using raw SQL, we pass them to our database as strings. The following query is written in raw SQL:



```python
# imports sqlite
import sqlite3

# connects it to the books-collection database
conn = sqlite3.connect('books-collection.db')

# creates the cursor
c = conn.cursor()

# execute the query which creates the table called books with id and name
# as the columns
c.execute(
  '''
  CREATE TABLE books(
  	id INTEGER PRIMARY KEY ASC,
  	name varchar(250) NOT NULL
  )
  '''
)

# executes the query which inserts values in the table
c.execute("INSERT INTO books VALUES(1, 'The Bell Jar')")

# commits the executions
conn.commit()

# closes the connection
conn.close()
```

Now, there's absolutely nothing wrong with using raw SQL to talk to databases unless we make a mistake in the query, such as a typo or connecting to a database that doesn't exist, or trying to access a non-existent table. The Python compiler wouldn't be able to help us. 

SQLAlchemy is one of the many Python object-relational mapper implementations out there. If we're working on a small-scale application, using raw SQL might work – but if we're working on a large-scale data-driven website, using raw SQL can end up being complex and error-prone. 

To work around this issue, we can write our queries as objects using an ORM instead of writing them as strings. ORM converts our code written in Python (or any other language) to SQL statements. It's that simple!

Enough with the theory. Let's get into the good stuff and start writing some code!

## Creating a database with SQLAlchemy

Let's create a file that will set up and configure our database. We can name this file anything, but for this article, let's name it `database_setup.py`.

```python
import sys
# for creating the mapper code
from sqlalchemy import Column, ForeignKey, Integer, String

# for configuration and class code
from sqlalchemy.ext.declarative import declarative_base

# for creating foreign key relationship between the tables
from sqlalchemy.orm import relationship

# for configuration
from sqlalchemy import create_engine

# create declarative_base instance
Base = declarative_base()

# we'll add classes here

# creates a create_engine instance at the bottom of the file
engine = create_engine('sqlite:///books-collection.db')

Base.metadata.create_all(engine)
```

At the top of the file, we'll import all the necessary modules to configure and create our database. As you'll see, we imported `Column`, `ForeignKey`, `Integer`, and String to define our database table columns. 

Next, we import the declarative base. `Base = declarative_base()` constructs a base class for the declarative class definition and assigns it to the Base variable. 

As the [documentation](https://docs.sqlalchemy.org/en/latest/orm/extensions/declarative/basic_use.html) describes, `declarative_base()` returns a new base class from which all mapped classes should inherit. It expresses Table, `mapper()`, and class objects all at once within the class declaration.

Next, we create an instance of our create engine class which points to the database by adding `engine = create_engine('sqlite:///books-collection.db')`. We can name our database anything, but here we named it `books-collection`.

The last step in our configuration is to add `Base.metadata.create_all(engine)`.It will add the classes (we'll write them in a bit) as new tables in the database we just created.

After configuring our database, we'll create classes. In sqlalchemy, classes are the object-oriented--or declarative--representation of tables in our database.

```python
# we create the class Book and extend it from the Base Class.
class Book(Base):
   __tablename__ = 'book'

   id = Column(Integer, primary_key=True)
   title = Column(String(250), nullable=False)
   author = Column(String(250), nullable=False)
   genre = Column(String(250))
```

For this tutorial, we only need to create one table: Book. Our Book table has four columns: `id`, `title`, `author`, and `genre`. Integer and String are used to define the type of the values stored in a column: the column title, author and genre are all strings, while column id is of an integer type. 

There are many class attributes that we can use to define our columns, but let's take a look at some of the class attributes we've used here.

1. `primary_key`: When set to true, it indicates a value that can be used to identify each row of our table uniquely.
2. `String(250)`: While string defines the type of value, the enclosing number represents the maximum number of string.
3. `Integer`: Integer establishes the type of the value.
4. `nullable`: When set to false, indicates that it must have a value for the row to be created.

With that, we're all set with the setting up and configuring of our database. If we run `python database_setup.py` in our terminal, an empty database called `books-collection.db` will be created. Now that we have our empty database ready, let's populate the database and try talking to it.



## CRUD with SQLAlchemy by example

Remember how we briefly touched on CRUD operations in the beginning? Let's use them now. 

We'll create another file and name it `populate.py` (or any other name you'd like to give).

```python
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
# Let's import our Book and Base classes from our database_setup.py file
from database_setup import Book, Base

engine = create_engine('sqlite:///books-collection.db')
# Bind the engine to the metadata of the Base class so that the
# declaratives can be accessed through a DBSession instance
Base.metadata.bind = engine

DBSession = sessionmaker(bind=engine)
# A DBSession() instance establishes all conversations with the database
# and represents a "staging zone" for all the objects loaded into the
# database session object.
session = DBSession()
```

First, let's import some dependencies and some classes from our `database_setup.py` file.

Then we let our program know which database engine we want to communicate with. We do this by using the `create_engine` function. 

To make the connections between our class definitions and our tables in the database, we use the `Base.metadata.bind` command.

In order to create, delete, read or update entries in our database, sqlalchemy provides an interface called `Session`. To execute our queries, we need to add and commit our entry. It also provides us with a method called `flush()`. Flush pushes our changes from memory to our database transaction buffer without committing the change.



### CREATE:

The general procedure for creating an entry is:

```python
entryName = ClassName(property="value", property="value" ... )

# To persist our ClassName object, we add() it to our Session:
session.add(entryName)

# To issue the changes to our database and commit the transaction we use commit(). #Any change made against the objects in the session won't be persisted into the #database until you call session.commit().

session.commit()
```

We can create our first book by executing the following command:

```python
bookOne = Book(title="The Bell Jar", author="Sylvia Pla", genre="roman à clef")
session.add(bookOne)
session.commit()
```



### READ:

Depending on what we want to read, we can use different functions. Let's look at the two ways we'll potentially use them in our app.

`session.query(Book).all()` - this will return a list of all the books 
`session.query(Book).first()` - this will return the first result or ‘None' if the result doesn't contain a row.



### UPDATE:

To update entries in our database, we need to do the following:

1. Find the entry
2. Reset the values
3. Add the new entry
4. Commit the session to our database

If you hadn't noticed yet, there is an error in our bookOne entry. The Bell Jar was written by Sylvia Plath and not some ‘Sylvia Pla'. Let's update the author name using the four steps we just saw.

To find the entry, we can use the `filter_by()` that let us filter queries based on attribute entries. The following query will give us our book with id=1 (i.e. The Bell Jar)

```python
editedBook = session.query(Book).filter_by(id=1).one()
```

To reset and commit the author name, I can execute the following commands:

```python
editedBook.author = "Sylvia Plath"
session.add(editedBook)
session.commit()
```

We can use `all()`, `one()` or `first()` to find an entry depending on the result we're expecting. There are, however, a few gotchas that we need to be careful about.

1. `all()` - returns the results represented by the query as a list
2. `one()` - returns exactly one result or raises an exception. It raises an `sqlalchemy.orm.exc.NoResultFound` exception if no result is found or `sqlalchemy.orm.exc.NoResultFound` exception if multiple results are returned
3. `first()` - returns the first result of the query or ‘None' if the result doesn't contain any row but a non-exception is raised



### DELETE:

Deleting values from our database is almost the same as updating the values. Instead of updating, we delete the values. Let's take a look:

1. Find the entry
2. Delete the entry
3. Commit the session

```python
bookToDelete = session.query(Book).filter_by(name='The Bell Jar').one()
session.delete(bookToDelete)
session.commit()
```

Now that we have our database set up and we know how to use CRUD operations, let's write a minimal Flask application. This article won't go deep into Flask, but if you need a refresher, you can read more about Flask [here](https://kite.com/blog/python/flask).

Let's create a new file `app.py` in the same directory as `database_setup.py` and `populate.py`. We'll then import some of the necessary dependencies. 

```python
from flask import Flask, render_template, request, redirect, url_for
app = Flask(__name__)

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database_setup import Base, Book

# Connect to Database and create database session
engine = create_engine('sqlite:///books-collection.db')
Base.metadata.bind = engine

DBSession = sessionmaker(bind=engine)
session = DBSession()


# landing page that will display all the books in our database
# This function operate on the Read operation.
@app.route('/')
@app.route('/books')
def showBooks():
   books = session.query(Book).all()
   return render_template("books.html", books=books)



# This will let us Create a new book and save it in our database
@app.route('/books/new/',methods=['GET','POST'])
def newBook():
   if request.method == 'POST':
       newBook = Book(title = request.form['name'], author = request.form['author'], genre = request.form['genre'])
       session.add(newBook)
       session.commit()
       return redirect(url_for('showBooks'))
   else:
       return render_template('newBook.html')


# This will let us Update our books and save it in our database
@app.route("/books/<int:book_id>/edit/", methods = ['GET', 'POST'])
def editBook(book_id):
   editedBook = session.query(Book).filter_by(id=book_id).one()
   if request.method == 'POST':
       if request.form['name']:
           editedBook.title = request.form['name']
           return redirect(url_for('showBooks'))
   else:
       return render_template('editBook.html', book = editedBook)

# This will let us Delete our book
@app.route('/books/<int:book_id>/delete/', methods = ['GET','POST'])
def deleteBook(book_id):
   bookToDelete = session.query(Book).filter_by(id=book_id).one()
   if request.method == 'POST':
       session.delete(bookToDelete)
       session.commit()
       return redirect(url_for('showBooks', book_id=book_id))
   else:
       return render_template('deleteBook.html',book = bookToDelete)


if __name__ == '__main__':
   app.debug = True
   app.run(host='0.0.0.0', port=4996)
```

Lastly, we need to create templates i.e. `books.html`, `newBook.html`, `editBook.html`, and `deleteBook.html`. To do that, we'll create a template folder at the same level as our app.py file. Within that folder, we'll create these four files.

```html
#books.html

<html>
<body>
   <h1>Books</h1>
   <a href="{{url_for('newBook')}}">
       <button>Add Boo</button>
   </a>
   <ol>
       {% for book in books %}
       <li> {{book.title}} by {{book.author}} </li>
       <a href="{{url_for('editBook', book_id = book.id )}}">
           Edit
       </a>
       <a href="{{url_for('deleteBook', book_id = book.id )}}" style="margin-left: 10px;">
           Delete
       </a>
       <br> <br>
       {% endfor %}
   </ol>
</body>
</html>
```

Then, we'll create `newBook.html`.

```html
<h1>Add a Book</h1>
<form action="#" method="post">
   <div class="form-group">
       <label for="name">Title:</label>
       <input type="text" maxlength="100" name="name" placeholder="Name of the book">

       <label for="author">Author:</label>
       <input maxlength="100" name="author" placeholder="Author of the book">

       <label for="genre">Genre:</label>
       <input maxlength="100" name="genre" placeholder="Genre of the book">

       <button type="submit">Create</button>
   </div>
</form>
```

Next is `editBook.html`.

```html
<form action="{{ url_for('editBook',book_id = book.id)}}" method="post">
   <div class="form-group">
       <label for="name">Title:</label>
       <input type="text" class="form-control" name="name" value="{{book.title }}">
       <button type="submit"> SAVE</button>
       <a href='{{url_for('showBooks')}}'>
           <button>Cancel</button>
       </a>
   </div>
</form>
```

Then `deleteBook.html`

```html
<h2> Are you sure you want to delete {{book.title}}? </h2>
<form action="#" method = 'post'>
   <button type="submit"> Delete </button>
    <a href = '{{url_for('showBooks')}}'>
        <button> Cancel</button>
    </a>
</form>
```

If we execute python app.py command, and direct your browser to http://localhost:4996/books, you should see a list of books. If everything is working, you should see something like this on your screen:

<div align="center">
  <img src="https://kite.com/static/media/image1.49f2a37a.png" width="80%">
</div>



## Extending the App & Conclusion

If you've made it this far, then hopefully you'll have learned a thing or two about how SQLAlchemy works! SQLAlchemy is a huge topic and we only covered the basics, so if you want to learn more, try making another CRUD app or enhancing this application by adding new features. If you want to continue working on this application, you can try adding Shelf table in the database to keep track of your reading progress, or if you want to go a step further, try using Flask-Login to add authentication and authorization feature to your application. Adding authentication and authorization can make your application more scalable. Instead of everybody applying CRUD operations on your book app, they can customize it and update just their books.



> *This post is a part of Kite's new series on Python. You can check out the code from this and other posts on our* [GitHub repository](https://github.com/kiteco/kite-python-blog-post-code)*.*


