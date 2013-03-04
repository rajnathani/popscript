## Working of the Pop Up

The function _pop_up_ takes in two parameters, one of which
is optional. The first property is the content of the popup,
this can be one of the two:
<ol>
<li>
String (plain text)<br>
In this case a popup box will be created with contents as the
in putted text (automatically) enclosed in a \<p> tag. Thus any
styling which needs to be done in terms of placement of the text
inside the popup box can be done with the following CSS:
    <pre>
    #\<popID> p {
        \<styling goes here>
        ...
        ... 
    }
    </pre>
example:
    <pre>
    #popup p {
        margin: 3px 2px;
        text-align: justify;
    }
    </pre>
</li>
<li>Node<br>
In order for the popup box to be flexible in terms of what it takes.
A glance at large,complex and robust websites of that of Amazon, Google
and Facebook, will show you popup boxes consisting of things like lists,
images and even forms where input can be entered an submitted. To account
for this the _pop_up_ function will let you pass in a JavaScript node. This
node could consist of any possible html structure. You could have a \<ul> node
with some \<li> children, or you could have a <div> tag encompassing 40 other
\<div> tags containing _n_ number of other html tags with any number of children
possible
</li>
</ul>

***
