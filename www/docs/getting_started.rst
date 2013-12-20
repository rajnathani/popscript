

Getting started
=================
Welcome to the world of PopScript, before becoming pro at using PopScript, there are few very basic set up instructions and fundamentals which you should know of:

The two files you will need
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Let us begin with what comes out of the box, you will need these to start poppin':

- `popscript.js`
    This contains the code responsible for implementing PopScript, and it contains the entire javascript API.
    It also comes with default popscript already coded at the top of the file.

- `popscript.css`
    popscript.css is the boilerplate CSS file for generating the pops. The default popscript provided in popscript.js references
    CSS classes and animations defined in popscript.css.


How to put in these two files?

Your webpage would look like this::

    <html>
        <head>
        ......................
        <link rel="stylesheet" type="text/css" href="popscript.css" />
        <script type="text/javascript" src="popscript.js"></script>
        ......................
        </head>
        <body>
        ......................
        <button onclick="pop('hello world')">Click Me!</button>
        ......................
      </body>
    </html>

**OR**::

    <html>
        <head>
            ......................
            <link rel="stylesheet" type="text/css" href="popscript.css" />
            ......................
        </head>
        <body>
            ......................
            <button id="more-info">Click Me!</button>
            ......................
        </body>
        <script type="text/javascript" src="popscript.js"></script>
        <script type="text/javascript">
            document.getElementById("more-info").onclick =
            function(){ pop('hello world') }
        </script>
    </html>


The way you go about it is entirely upto you, just as long as both the resources (popscript.css & popscript.js) will
be loaded before uou call `pop()` or any other available API.


How am I going to use popscript?
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
If you're lost, knowing the answer to this simple question will get you more than halfway there.
Let us split this into 2 segments: (1) functions a part of the API (2) scripting pop classes.
<code>a = b + c</code>
Functions
````````````



