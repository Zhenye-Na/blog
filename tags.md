---
layout: page
title: Tags
footer: false
permalink: /tags/
---
<style>
.tags {
    list-style: none;
    padding: 0;
    text-align: center;
    font-size: 18px;
}
.tags li {
    display: inline-block;
    margin: 0 25px 25px 0;
}

<!--img.center {
    display: block;
    margin: 0 auto;
}-->

img.avatar {
    border-radius: 50%;
    display: block;
    margin: 30px auto;
    width: 150px;
}

a:hover {
    text-decoration: none;
}

</style>


<img src="https://pic.qqtn.com/up/2018-2/2018022614235526444.jpg!360_360" class="avatar" vspace="50" />

<div align="center">
      <p> <span style="font-family: Trebuchet MS"> <font size="5"> Zhenye Na </font></span></p>
      <p> <span style="font-family: Trebuchet MS"> ISE @ UIUC </span></p>
</div>

<ul class="tags">
{% for tag in site.tags %}
    <li style="font-size: {{ tag | last | size | times: 100 | divided_by: site.tags.size | plus: 70  }}%">
        <a href="#{{ tag | first | slugize }}">
            {{ tag | first }}
        </a>
    </li>
{% endfor %}
</ul>


<!--<div id="blog-archives">
{% for tag in site.tags %}
  {% capture tag_name %}{{ tag | first }}{% endcapture %}
  <h2 id="#{{ tag_name | slugize }}">{{ tag_name }}</h2>
  <a name="{{ tag_name | slugize }}"></a>
  {% for post in site.tags[tag_name] %}
  <article>
    <h3><a href="{{ root_url }}{{ post.url }}">{{post.title}}</a></h3>
  </article>
  {% endfor %}
{% endfor %}
</div>-->