
============================================
Chapter 0: Getting started
============================================
Welcome to the world of PopScript. The entire documentation is divided into 3 parts: (1) :doc:`getting-started` [the current section] (2) :doc:`core` [where you will learn the most used parts of popscript] (3) :doc:`guru` [discover the unknown territory]. Before beginning to use PopScript, there are few very basic set up instructions and fundamentals which you should know of, that is what this section is about to teach you.

The two files you will need
--------------------------------
Let us begin with what comes out of the box, you will need these to start poppin':

- `popscript.js` or `popscript.min.js`
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
----------------------------------
If you're lost, knowing the answer to this simple question will get you more than halfway there.
Let us split this into 3 segments (more like 2 and a half): (1) functions which constitute the API (2) scripting pop classes and (3) scripting pops already created


(First point) Functions
`````````````````````````
popscript.js has only a few functions for direct API use. Here's a quick run-through of them, note that their detailed description
will be left for later topics.

    - :ref:`pop` (do not click as yet) This is the MAIN one. This is the pop machine.
    - Every other function you use will be secondary.

(Second point) Pop Class
``````````````````````````
Let's not waste time, pop classes are very much like CSS classes. This design decision was intentional.
At the top of the `popscript.js` file we have something like this::


    var popscript = {
        basic: {
            STYLE: {
                CLASS: {
                    box: 'simple-box',
                    cover: 'curtain',
                    cross: 'cross'
                }
            },
            ANIMATION: {
                IN: {
                    box: 'zap-in cubic-bezier(.73,.75,.72,1.77)',
                    cover: 'fade-in',
                    duration: 300
                },
                OUT: {
                    box: 'zap-out cubic-bezier(.73,.75,.72,1.77)',
                    cover: 'fade-out',
                    duration: 200
                }
            },
            POSITION: {
                x: 'auto',
                y: 'auto',
                check: '20, 1000*'
            },

            cover: 'yes',
            cross: 'yes',
            cross_content: 'x',
            esc: 'ye',
            full_draggable: 'yes'
        },

        success: {
            STYLE: {
                CLASS: {
                    box: 'success'
                }
            },
            ANIMATION: {
                IN: {
                    box: 'drop'
                },
                OUT: {
                    box: 'undrop'
                }
            },
            POSITION: {
                y: 'top'
            },

            cross: 'no',
            full_draggable: 'naaaaoh',
            click_me_out: 'yes, tis is convenient'
        },
        ......
        ......
        ......
    }


| The above is just a small cut of the popscript given on top of the file.
|
| Look at the 2 (parent) keys visible: 'basic' and 'success'.
| These are *pop classes*.
|
| Look at the few (leaf) keys visible: 'box', 'x', 'y', 'esc', etc.
| These are *pop properties*.  
|
| Look at the few (in-between) keys visible: 'STYLE', 'INLINE', 'OUT', etc.
| These are *pop scopes*.
|
| The 2 main similarities it bears with CSS classes are:


    1. **Structure**: Both PopScript and CSS have a property-value system.

    2. **Inheritance:** 2 or more *CSS classes* can be separated by spaces to form a chain of *CSS classes* which inherit from each other from the left to the right. This is the case for *pop classes* too.

| The 2 main dissimilarities it bears with CSS classes are:


    1. **Case Sensitivity**: Both *pop properties* and *pop scopes* are case insensitive. Which implies that 'box' == 'BoX', and 'ANIMATION' == 'animation'. Note however that the values which *pop properties* refer to, and pop classes are case sensitive. 

    2. **Scopes:** In PopScript there exists *pop scopes*, however this feature is not present in CSS.

Details about the usage of pop classes are mentioned in :doc:`core`



(Third & Last point) The process of popping
````````````````````````````````````````````
Well, you have read through the big chunks already. The information behind this point, is that there are various functions and tools to help you pop your pops the right way. Let us look at a few examples here, remember we cover the nitty gritty details later on.

    - Hey what if you want a pop to be positioned not at a predetermined location (for example on the top right), but instead near a specific element, and this element you probably would know of only during runtime of your application. PopScript solves this problem by offering you ``nearElement`` callback.
    - Maybe you would like to know more about how your user is interacting with your application. PopScript has the option of letting you know when the user proceeds to close a pop. You can determine this at both before closing (in this situation you could even stop the user from closing it) and after it has been closed with the `beforePopOut` and `afterPopOut` callback functions, respectively.
    - Finally, you may want to make changes to an existing pop. For instance change its pop property(s) or entirely its pop class itself. For accomplishing these tasks there exist functions available to you, which we'll cover in :doc:`core`.

.. _pop-id:

pop ID
-------------
The final (third) point of the previous section mentioned the ability of dynamically changing the properties/class of an existing pop. However, to do so, we would need a reference point for a pop, some piece of identification which is unique to each pop. This where the pop ID comes in. In essence: its a unique number generated by PopScript everytime you pop. Everytime you pop? What does that mean? Well everytime you (successfully / without errors) call the :ref:`pop` function, you will receive the pop ID as the return value. In most cases you might not need to store the returned pop ID, however if you do wish to further modify a given pop later on in your code, then you would store the pop ID an use it. The best analogy here would the `setTimeout` and `setInterval` functions which we have in JavaScript, these functions return a timeout ID and an interval ID respectively, which you can then later be used to clear using `clearTimeout` and `clearInterval` respectively. In the case of popscript, your possibilities is way beyong just clearing (popping out), as mentioned earlier changing pop classes and individual pop properties are available options. Pop IDs are in essence a number ID which increase in value with each subsequent call. Which implies that if you have 2 pop IDs, you can find out which was the more recent pop by checking between the 2 of which has a numerically higher pop ID. Proper documentation with details of pop ID's usage shall be provided in the next section: :doc:`core`.




