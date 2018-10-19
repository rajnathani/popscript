

=================
Chapter 2: Guru 
=================

| Hold on, first congratulations on reading through the entire of :doc:`core`, and reaching this part.
| In this section we shall look over some of the advanced parts of PopScript.
| These are features which on not knowing about wouldn't disable you from using PopScript, however if you are aware of them, you could reap benefits like no one other.
|
| We will go over the following:

    - :ref:`there-is-no-scope`
    - :ref:`custom-out`
    - :ref:`custom-drag`
    - :ref:`secret-api`



.. _there-is-no-scope:

Reality: There is no Scope
-----------------------------
| In the :ref:`pop-class` section of :doc:`getting-started`, we mentioned about "scopes", which are essentially the non-properties within popscript such as ``ANIMATIONS``, ``STYLE``, and many more. These serve as contexts to distinguish pop properties: for instance, the property ``box`` appears in both ``STYLE`` > ``CLASS`` *and* ``ANIMATION`` > ``IN``/``OUT``.
| But the reality is that although the novice user using popscript visibly sees scopes, the popscript architecture doesn't see them. **How?** All of popscript code is compiled down to a single nest level, where there exists no scope.
| Here are the steps followed in compiling down a scope's properties to scope-less properties:

``Concatenate (Join) all the scopes with an underscore "_" between each scope in its lower case.``

| Note that lower casing is optional as, as mentioned earlier (in :doc:`getting-started`) *pop scopes* and *pop properties* are case insensitive.
| Example time.

This::

    ANIMATION: {
        IN {
            box: 'zap-in'
        }
    }

Becomes::

    animation_in_box: 'zap-in'

| You might ask now: *What use does, popscript's decision of eliminating scopes, come to me?*
| Good question! Well the awesome truth is that popscript not only eliminates scopes for internal usage, but also provides the developer an option to eliminate it too.
| Which means that instead of specifying pop properties within scope(s) you can: jump ahead by directly provide the **scope-less** property name. It is also possible to even provide PopScript an **incomplete scope-less** property name.
| Example time.

This::

    success: {
        STYLE: {
            CLASS: {
                box: 'green-box'
            },
            INLINE: {
                box: 'width:100%; padding:25px;'
            }
        },
        POSITION: {
            y: 'top'
        }
    }
    
Can be rewritten as::

    success: {
        style_class_box: 'green-box',
        style_inline_box: 'width:100%; padding:25px;',
        position_y: 'top'
    }   


Since incomplete scope-less property names are permitted, it can also be rewritten as::

    success: {
        STYLE: {
            class_box: 'green-box',
            INLINE: {
                box: 'width:100%; padding:25px;'
            }
        }
        position_y: 'top'   
    }

| Now that you are aware of this, you may begin using scope-less/semi-scope-less property names when quickly writting PopScript code, however remember that the whole point of introducing scopes is to improve code readbility, and (long-run) conciseness. And therefore, its highly recommended to stick with nesting with scopes.
| Albeit, there is one exceptional case where the usage of scope-less property names is actually encouraged, highly encouraged. That is with :ref:`parameter-inline-popscript`.
| Example time.

This::

    pop( "Hello World",
        {
            POSITION: {
                x: "25%"
            }
        }
    });

Would become this::

        pop( "Hello World", { position_x: "25%" } );



.. _custom-out:

Creating a custowm close/hide button
---------------------------------------------

.. image:: ../static/imgs/yuno-custom-close.jpg

| Well, well, well. Yes, you actually can.
| From :ref:`components` you learnt that the ``cross`` button can be used to close or hide (depending on :ref:`out`). The issue really, is that supplying ``cross``, although it provides an exceedingly agile method of creating pops, it inhibits flexibility, as it can only be modified by its CSS, and furthermore can be enabled or disabled as a whole through the property :ref:`cross`.

Method 1: Event Handlers
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

If you have just read this documentation till :doc:`core`, then you (probably) hacked your way like this. Its **not the recommended way**::

    var inner_container = document.createElement("div");

    var msg = document.createElement("p");
    msg.innerHTML = "Your password has been successfully reseted.";

    var close_button = document.createElement("button");
    close_button.innerHTML = "Close this dialog";
    var pop_id;
    close_button.addEventListener('click', function() { popOut(pop_id) }, false);

    inner_container.appendChild(msg);
    inner_container.appendChild(close_button);

    pop_id = pop( inner_container );

Instead, PopScript provides you a simpler way. The secret is that the function :ref:`pop-out`, :ref:`pop-close`, and :ref:`pop-hide`, are all `overloaded <https://en.wikipedia.org/wiki/Function_overloading>`_ functions. You can use it to handle the events directly, here is **the recommended way** of doing it::

    var inner_container = document.createElement("div");

    var msg = document.createElement("p");
    msg.innerHTML = "Your password has been successfully reseted.";

    var close_button = document.createElement("button");
    close_button.innerHTML = "Close this dialog";
    //var pop_id; <- no need, as popOut will search the pop id for you
    close_button.addEventListener('click', popOut, false);

    inner_container.appendChild(msg);
    inner_container.appendChild(close_button);

    pop( inner_container );


Method 2: CSS Classes
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

| Method 1 has us bind event handlers, however Method 2 is much simpler to implement.
| To create an out (close/hide depending upon :ref:`out`) button, add the CSS class 'popscript-out'.
| To create a close button, add the CSS class 'popscript-close'.
| To create a hide button, add the CSS class 'popscript-hide'.

Here is the example from Method 1 done with Method 2::

    pop( "
        <div>
            <p>Your password has been successfully reseted.</p>
            <button class='popscript-out'>Close this dialog</button>
        </div>
    " );


.. _custom-drag:

Creating an element to drag a pop
---------------------------------------------

| From :doc:`core` it was learnt that the pop property :ref:`full-draggable` allows you to drag the pop box around, by holding down anywhere on the box. 
| What if, what if it is not desirable to have the entire box serve as a dragging patch?
| Well you can specifically make sub-elements of the box server as dragging patches.
| This is done by adding the 'popscript-drag' class to the sub element.

Here is an example where we have a header to drag the pop around, just as seen in (every freaking) Operating System dialog box::

    pop(
        '<div class="popscript-drag" style="padding:20px;background-color: gainsboro">
            Draggable Header
        </div>
        <p style="height:150px">
            Lorem Ipsum
        </p>',
        {
            full_draggable: 'no',
            style_inline_box: 'padding:0'
        }
    )




.. _secret-api:

The secret API
---------------------------------------------
Well besides the :ref:`pop`, :ref:`pop-out`, :ref:`pop-close`, :ref:`pop-hide`, :ref:`pop-show`, and :ref:`pop-toggle` functions which we've learnt so far. There exist a secret clan of useful functions, all embedded within the ``PopScript`` object:


PopScript.total()
~~~~~~~~~~~~~~~~~~~~~~~~~~~
| *Declaration:* ``PopScript.total()``
|
| *Role*: Returns the number of pops currently in existence.
| Note that if a pop is hidden, the pop is treated as existent.

PopScript.exists()
~~~~~~~~~~~~~~~~~~~~~~~~~~~
| *Declaration:* ``PopScript.exists( pop_id )``
|
| *Role*: Returns ``true`` if the pop associated with ``pop_id`` exists, ``false`` otherwise.
| Note that if the pop is hidden, this function will return ``true``.

PopScript.hidden()
~~~~~~~~~~~~~~~~~~~~~~~~~~~
| *Declaration:* ``PopScript.hidden( pop_id )``
|
| *Role*: Returns ``true`` if the pop associated with ``pop_id`` is in the hidden state, ``false`` otherwise.

PopScript.hasClass()
~~~~~~~~~~~~~~~~~~~~~~~~~~~
| *Declaration:* ``PopScript.hidden( pop_id, pop_class )``
|
| *Role*: Returns ``true`` if the pop associated with ``pop_id`` contains the pop class ``pop_class``.




PopScript.changeClass()
~~~~~~~~~~~~~~~~~~~~~~~~~~~
| *Declaration:* ``PopScript.changeClass( pop_id, new_pop_class [, transition_duration ] )``
|
| *Role*: Changes the :ref:`pop-class` of the pop associated with ``pop_id`` to ``new_pop_class``.

parameter: pop_id
^^^^^^^^^^^^^^^^^^^^
| Type: :ref:`pop-id`
| Serves as the identifier to the pop for which the pop class is desired change.

parameter: new_pop_class
^^^^^^^^^^^^^^^^^^^^^^^^^^^
| Type: :ref:`pop-class`
| Serves as the new pop class. 
    
parameter: transition_duration
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
| Type: Number
| Optional: Yes
| Serves as the number of milliseconds (ms) for which the transition to the new CSS (position, color, and other CSS properties) caused due to the change of the pop's pop class.
| If no transition is desired then supply the obvious: 0
| If instead of a transition, the in animation(s) of the pop class is/are desired then leave this argument undefined.
| Note that the transition uses CSS3 transition, browser support is limited to modern browsers.


PopScript.inline()
~~~~~~~~~~~~~~~~~~~~~~~~~~~
| *Declaration:* ``PopScript.inline( pop_id, inline_popscript [, transition_duration ] )``
|
| *Role*: Adds to the pop associated with ``pop_id`` inline popscript given in ``inline_popscript``.

parameter: pop_id
^^^^^^^^^^^^^^^^^^^^
| Type: :ref:`pop-id`
| Serves as the identifier to the pop, which is target of the addtion of the inline popscript.

parameter: inline_popscript
^^^^^^^^^^^^^^^^^^^^^^^^^^^
| Type: **Object** (popscript)
| Serves as the popscript to be added. 
    
parameter: transition_duration
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
| Type: **Number**
| Optional: Yes
| Serves as the number of milliseconds (ms) for which the transition to the new CSS (position, color, and other CSS properties) caused due to the addition of the inline popscript.
| If no transition is desired then supply the obvious: 0
| If instead of a transition, the in animation(s) of the pop class is/are desired then leave this argument undefined.
| Note that the transition uses CSS3 transition, browser support is limited to modern browsers.

PopScript.changeProperty()
~~~~~~~~~~~~~~~~~~~~~~~~~~~
| *Declaration:* ``PopScript.changeProperty( pop_id, property, value [, transition_duration ] )``
|
| *Role*: Changes the current specified value of the pop property ``property``, of the pop associated with ``pop_id``, to``value``.

parameter: pop_id
^^^^^^^^^^^^^^^^^^^^
| Type: :ref:`pop-id`
| Serves as the identifier to the pop, which is the pop property is to be changed.

parameter: property
^^^^^^^^^^^^^^^^^^^^^^^^^^^
| Type: **Array** | **String**
| Serves as the pop property to be updated.
| 2 possible types:

    - String: This is the scope-less property name (see :ref:`there-is-no-scope`). EG: "animation_in_box".
    - Array: This is a array of ordered scopes with the peripheral property name as the last element. EG: ['ANIMATION', 'IN', 'box']

parameter: value
^^^^^^^^^^^^^^^^^^^^^^^^^^^
| Type: **String** | **Number** | **Array** | **Function** 
| The new ``value`` for the pop property ``property``.


parameter: transition_duration
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
| Type: **Number**
| Optional: Yes
| Serves as the number of milliseconds (ms) for which the transition to the new CSS (position, color, and other CSS properties) caused due to the change of the pop property.
| If no transition is desired then supply the obvious: 0
| If instead of a transition, the in animation(s) of the pop class is/are desired then leave this argument undefined.
| Note that the transition uses CSS3 transition, browser support is limited to modern browsers.




PopScript.compile()
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
| *Declaration:* ``PopScript.compile( more_popscript )``
|
| *Role*: Compiles additional popscript, thereby serving as a method to overwrite existing pop classes or create news ones altogether.

parameter: more_popscript
^^^^^^^^^^^^^^^^^^^^^^^^^^
| Type: **Object** (popscript)
| Serves as the popscript to be compiled.


.. _popscript-pos-check:

PopScript.pos.check()
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
| *Declaration:* ``PopScript.check( pop_id )``
|
| *Role*: Checks the position and alignment of the pop (inclusive of all: :ref:`components`). This is the function which gets called in accordance to the value set at :ref:`position-check`, and addtionally (done behind the scenes by PopScript) when the users scrolls the page or resizes the window. 



PopScript.pos.checkAll()
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
| *Declaration:* ``PopScript.checkAll()``
|
| *Role*: Performs a :ref:`popscript-pos-check` on all the current pops. 