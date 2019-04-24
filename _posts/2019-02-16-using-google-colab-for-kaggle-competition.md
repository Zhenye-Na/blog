---
layout: article
title: "Tutorial for Kaggle competition using Google Colab"
date: 2019-02-16
modify_date: 2019-02-16
excerpt: "Using Google Colab for Kaggle competition"
tags: [Machine Learning, Deep Learning, Data Science, Kaggle]
---

# Tutorial for Kaggle competition using Google Colab


`Google Colab` has free GPU usage which has become an awesome tool for people who accomplish Deep Learning projects without GPUs. Here's a sample tutorial or workflow if you would like to utilize Google Colab for your training experiments.


Great references:

- [Using kaggle datasets into Google Colab](https://stackoverflow.com/questions/49310470/using-kaggle-datasets-into-google-colab)
- [Mounting Google Drive in Google Colab](https://medium.com/@rushic24/mounting-google-drive-in-google-colab-5ecd1d3b735a)


## Enable GPU support


Go to `Edit` -> `Notebook settings` and select `GPU` or `TPU` as your Hardware accelerator



## Mount Google Drive to Google Colab

In order to have access to our Google Drive in Colab, we need mount it to Colab.

```python
from google.colab import drive
drive.mount('/content/drive')

cd drive/My\ Drive

# `cd` to the location of your jupyter notebook
cd Colab\ Notebooks
```



## Download kaggle dataset



1. Create an API key in Kaggle. `My account -> Create New API Tokens`. This will download a `kaggle.json` file to your computer. You can either upload to Google Drive manually or using the script below for uploading it.

2. If you would like to using script to upload your kaggle.json file, using the following snippet in a code cell:


    ```python
    from google.colab import files
    files.upload()
    ```

3. Install the kaggle API using the following codes. Make sure to add `!` before `pip`, it is required for Google Colab

    ```python
    !pip install -q kaggle
    ```


4. Move the `kaggle.json` file into `~/.kaggle`, which is where the API client expects your token to be located:


    ```python
    !mkdir -p ~/.kaggle
    !cp kaggle.json ~/.kaggle/
    ```


5. Give permissions to change avoids a warning on Kaggle tool startup.


    ```sh
    !chmod 600 ~/.kaggle/kaggle.json
    ```



6. Now you can download datasets by using:

    ```sh
    !kaggle competitions download -c name-of-the-competition --force
    ```

To summarize, the following snippets of codes are the workflow for downloading dataset in Colab.

```python
# To import kaggle datasets
!pip install kaggle

# import colab libraries
from google.colab import files

# import kaggle json to connect to kaggle user account to download datsets
files.upload()

# see if kaggle json exists
!ls -lha kaggle.json

# The Kaggle API client expects this file to be in ~/.kaggle,
# so lets move it there.
!mkdir -p ~/.kaggle
!cp kaggle.json ~/.kaggle/

# This permissions change avoids a warning on Kaggle tool startup.
!chmod 600 ~/.kaggle/kaggle.json

# download our dataset
!kaggle competitions download -c name-of-the-competition --force

# unzip training set to `train` folder
!mkdir train
!unzip train.zip -d train

# unzip test set to `test` folder
!mkdir test
!unzip test.zip -d test
```


## Perform awesome training process and evaluation on Google Colab

In order to perform ML/DL algorithms on the dataset we just downloaded. We can create a new notebook in Colab. 

```python
from google.colab import drive
drive.mount('/content/drive')

cd drive/My\ Drive

# `cd` to the location of your jupyter notebook
cd Colab\ Notebooks
```

Then you can write your own data processing the training/validating/testing codes.


## Submission

```
!kaggle competitions submit -c humpback-whale-identification -f submission.csv -m "Message"
```