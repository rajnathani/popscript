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

##Functions!

###pop(content, [, pop_class] [, extra_dict])  

This is the most important function as it creates those pops!  
Let us see how it used, here are the function parameters:

- `content`  
    content can either be
    - string: in this case a pop will be created with text mentioned by `content`. This is useful for
    simple messages as 'transaction successfull'.
    - node: at times a simple text message passed through a pop up isn't sufficient, therefore popscript
    enables you to pass a complete node (it can have as many children as it wants as well), the pop created
    will have the node mentioned by `content` as its inner element.

- `pop_class`
    `pop_class` is a string which indicates to popscript what type of pop you would want created.   
    It is a a string with one or more pop classes separated by spaces.  
    Any pop created has the 'basic' pop class preprended to it, this is unavoidable, even if you call pop by writing
    `pop('the passwords do not match', 'error')`, you are actually using 'basic error' as your pop_class,
    and if you did not mention `pop_class` at all, such as `pop('please refresh the page')` the `pop_class`
    will be 'basic'. Read further in this guide to understand why this is like this.
    More about pop classes will be mentioned later in the documentation as well.

- `extra_dict`
    As of writing the documentation, `extra_dict` has only one key which can be mentioned:
    - `onpopout`  
    The value of this key is a function. This function will be called when the user closes the
    pop up.


## Pop Classes
    
As you have seen before the top of your popscript files contain:

    var popscript = {
        basic:{
            popup_class:'popup-popup',
            cover_class:'popup-cover',
            
            close_pop:true,
            close_pop_class:'popup-close',
            
            cover_animation_out_keyframes_name:'out-backy',
            popup_animation_out_keyframes_name:'out-pop',
            animation_out_duration:410,
            
            align_check:[20, 350, 900]
        },
        
        slide:{
            popup_class:'popup-popup arrive-right',
            popup_animation_out_keyframes_name:'depart-right cubic-bezier(1,0,.46,1)'
        },
        
        error:{
            popup_class:'popup-popup error-popup',
            'top':'45px',
            popup_animation_out_keyframes_name:'out-error'
        }
    };
    
The above is simply a default, you can write your pop classes and add it in `popscript`,
let us take a look at some key points of pop classes.

###Let's you do pop ups they want you want
pop classes let you define more than how your pop ups and cover (the layer behind the pop up) look like,
but how they will be animated when they come in and when are closed by the user, the way its aligned (the
alignment which cannot be done by css properties, more about this later), and many more aspects. By writing
pop classes one is defining the experience of the pop ups.

###Similar to CSS Classes
Before getting deeper into the explanation, it might help mentioning that pop classes are based very close to
the guidelines of CSS classes, 3 quick similaries worth mentioning is that
    - both pop and css classes cannot contain spaces.
    - for using multiple classes together*, spaces are used to separate the class names.
    - the properties are mentioned by using the property-value notion.  
\*The second point about chaining multiple classes together follows the same rules of css, the properties
mentioned of the classes later are given high precedence, for instance if the pop class `error` and `slide`
both have the `popup_animation_out_keyframes_name`, and the pop class is mentioned as 'error slide', the 
`popup_animation_out_keyframes_name` of `slide` will be used.




    


    
    
    
