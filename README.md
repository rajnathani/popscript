popscript
=========

A JS + CSS library for creating pop ups (modals) with support for animations, lightweight with zero dependencies. (MIT licensed)

###How to get popping?

Let us begin with what comes out of the box, you will need these to start poppin':
- `popscript.js`  
This contains the code responsible for providing you with functions such as `pop()`, `closePop()`, `popOut()`, `noPopsLeft()`, etc,
and also gives you access to the internal Pop class which is used in the code to create a layer of abstraction. The scripting
of the pops is also done in this file.

- `popscript.css`  
popscript.css is the boilerplate CSS file for generating the pops. The default popscript provided in popscript.js references
CSS classes and animations defined in popscript.css.  

#Loading popscript

To include these two files (popscript.js & popscript.css), your webpage would look like this:

    <html>
      <head>
        ''''''''''''''''''''''
        <link rel="stylesheet" type="text/css" href="popscript.css" />
        ''''''''''''''''''''''
        <script type="text/javascript" src="popscript.js"></script>
        ''''''''''''''''''''''
      </head>
        <body>
        ''''''''''''''''''''''
        <button onclick="pop('hello world')">Click Me!</button>
        ''''''''''''''''''''''
      </body>
    </html>

**OR**

    <html>
      <head>
        ''''''''''''''''''''''
        <link rel="stylesheet" type="text/css" href="popscript.css" />
        ''''''''''''''''''''''
      </head>
        <body>
        ''''''''''''''''''''''
        <button id="more-info">Click Me!</button>
        ''''''''''''''''''''''
      </body>
      <script type="text/javascript" src="popscript.js"></script>
      <script type="text/javascript">
        document.getElementById("more-info").addEventListener("click",
          function(){ pop('hello world') },
          false)
      </script>
    </html>


The way you go about it is entirely upto you, just as long as both the resorces will
be loaded before uou call `pop()`

###pop
    
    
    
