=================================
Chapter 2: Pop Methods
=================================

In reference to :ref:`pop-instance`

.. _pop-out:

Pop.out()
~~~~~~~~~~~~~~~~~~~
| *Declaration:* ``Pop.out( [, out ] )``
| *Role:* Outs the pop.

.. _parameter_out:

parameter: out
^^^^^^^^^^^^^^^^^^^^^^^^^^

| Type: **String**
| Optional: Yes
| Default: property :ref:`out`
|
| The out type provided is in compliance with the pop property :ref:`out`. Which implies that if "hide" is provided, then the pop will be hidden from the page, and if "destroy" is provided the pop will be removed from the DOM.
| If no out type is provided, then the out type will be based on the pop's compiled popscript which depends upon :ref:`parameter-pop-class` and :ref:`parameter-inline-popscript`.


.. _pop-destroy:

Pop.destroy()
~~~~~~~~~~~~~~~~~~~
| ``Pop.destroy( <parameter> )`` is the equivalent of calling :ref:`pop-out` with :ref:`out` specified as "hide".


.. _pop-hide:

Pop.hide()
~~~~~~~~~~~~~~~~~~~
| ``Pop.hide( <parameter> )`` is the equivalent of calling :ref:`pop-out` with :ref:`out` specified as "hide".


.. _pop-show:

Pop.show()
~~~~~~~~~~~~~~~~~~~
| Redisplays the pop if hidden.

.. _pop-toggle:

Pop.toggle()
~~~~~~~~~~~~~~~~~~~
| Displays the pop with the given pop ID, if its in the hidden state.
| Else hides the pop.



Pop.isHidden()
~~~~~~~~~~~~~~~~~~~~~~~~~~~
| *Declaration:* ``Pop.isHidden()``
|
| *Role*: Return ``true`` if the pop is hidden, ``false`` otherwise.

Pop.isConstructed()
~~~~~~~~~~~~~~~~~~~~~~~~~~~
| *Declaration:* ``Pop.isConstructed()``
|
| *Role*: Return ``true`` if the pop is constructed, ``false`` otherwise.
| This is only return false when the pop is a binder pop, and has not had an "in event" executed.

Pop.hasClass()
~~~~~~~~~~~~~~~~~~~~~~~~~~~
| *Declaration:* ``Pop.hasClass( class_name )``
|
| *Role*: Returns ``true`` if the pop contains the pop class ``class_name``, ``false`` otherwise.



Pop.changeClass()
~~~~~~~~~~~~~~~~~~~~~~~~~~~
| *Declaration:* ``Pop.changeClass( new_pop_class [, transition_duration ] )``
|
| *Role*: Changes the :ref:`popscript-class` of the pop.


parameter: new_pop_class
^^^^^^^^^^^^^^^^^^^^^^^^^^^
| Type: :ref:`popscript-class`
| Serves as the new pop class.

parameter: transition_duration
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
| Type: Number
| Optional: Yes
| Serves as the number of milliseconds (ms) for which the transition to the new CSS (position, color, and other CSS properties) caused due to the change of the pop's pop class.
| If no transition is desired then supply the obvious: 0
| If instead of a transition, the in animation(s) of the pop class is/are desired then leave this argument undefined.
| Note that the transition uses CSS3 transition, browser support is limited to modern browsers.


Pop.changeProperties()
~~~~~~~~~~~~~~~~~~~~~~~~~~~
| *Declaration:* ``Pop.changeProperties( inline_popscript [, transition_duration ] )``
|
| *Role*: Changes the properties of the pop.

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

Pop.changeProperty()
~~~~~~~~~~~~~~~~~~~~~~~~~~~
| *Declaration:* ``Pop.changeProperty( property, value [, transition_duration ] )``
|
| *Role*: Changes the current specified value of the pop property ``property``, of the the Pop, to ``value``.

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
