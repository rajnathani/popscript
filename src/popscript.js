//TODO: will pAnimateOut remove elements in order? uhh? ugh stupid idiot person
var popscript = {
    basic: {
        CSS_CLASSES: {
            box: 'simple-box',
            cover: 'curtain',
            close: 'cross'
        },
        ANIMATIONS: {
            IN: {
                box: 'zap-in cubic-bezier(.73,.75,.72,1.77)',
                cover: 'fade-in',
                duration: 300
            },
            OUT: {
                box: 'zap-out cubic-bezier(.73,.75,.72,1.77)',
                cover: 'fade-out',
                duration: 300
            }
        },
        POSITION: {
            y: 'auto',
            x: 'auto',
            check: '20, 1000*'
        },

        close_content: 'x',
        close_button: 'yes',
        cover_fixed: 'no',
        esc: 'ye',
        full_draggable: 'yes'
    },

    success: {
        CSS_CLASSES: {
            box: 'success'
        },
        ANIMATIONS: {
            IN: {
                box: 'drop'
            },
            OUT: {
                box: 'undrop'
            }
        },
        POSITION: {
            x: 0,
            y: 0
        },

        close_button: 'no',
        full_draggable: 'naaaaoh',
        click_to_close: 'yes, tis is convenient'
    },

    error: {
        CSS_CLASSES: {
            box: 'error'
        },
        ANIMATIONS: {
            IN: {
                box: 'short-arrive-left-fade-in'
            },
            OUT: {
                box: 'fade-out'
            }
        },
        POSITION: {
            y: '10',
            x: '-10'
        }
    },

    dropdown: {
        CSS_CLASSES: {
            box: 'dropdown'
        },
        ANIMATIONS: {
            IN: {
                duration: 0
            },
            OUT: {
                duration: 0
            }
        },
        POSITION: {
            z: '-1'
        },

        close_button:'no',
        cover: 'no',
        full_draggable: 'no'
    },

    tooltip: {
        CSS_CLASSES: {
            box: 'popscript-tooltip'
        },

        ANIMATIONS: {
            OUT: {
                box: 'fade-out'
            }
        },
        POSITION: {
            z: '-1'
        },

        click_to_close: 'yeh',
        close_button: 'no',
        cover: 'no',
        blur: 'no',
        esc: 'yes',
        full_draggable: 'no'
    },

    context_menu: {
        CSS_CLASSES: {
            box: 'context-menu'
        },
        ANIMATIONS: {
            IN: {
                duration: 0
            },
            OUT: {
                box: 'fade-out'
            }
        },
        POSITION: {
            fixed: 'no',
            z: '-1'
        },

        cover: 'no',
        close_button:'no',
        full_draggable: 'no'
    },

    tip_left: {
        ANIMATIONS: {
            IN: {
                box: 'short-arrive-left-fade-in'
            }
        },
        CSS_CLASSES: {
            box: 'popscript-tooltip left'
        }
    },
    tip_right: {
        ANIMATIONS: {
            IN: {
                box: 'short-arrive-right-fade-in'
            }
        },
        CSS_CLASSES: {
            box: 'popscript-tooltip right'
        }
    },
    tip_up: {
        ANIMATIONS: {
            IN: {
                box: 'short-arrive-up-fade-in'
            }
        },
        CSS_CLASSES: {
            box: 'popscript-tooltip up'
        }
    },
    tip_down: {
        ANIMATIONS: {
            IN: {
                box: 'short-arrive-down-fade-in'
            }
        },
        CSS_CLASSES: {
            box: 'popscript-tooltip down'
        }
    }
};


var popscript_flags = {
    'alert error on error': true,   // alerts the error (alert)
    'throw error on error': true,   // throws the error on the console (console.error) [this is usually highlighted in red when displayed on the console]
    'Z': 1000                       // base z-index for all pops
};


/* Do not edit anything below this line*/

// Create a Singleton
var PS = {
    num_pops_created: 0,
    net_pops_atm: 0,
    pop_dict: {},

    /*
     Increases the count of pops, and Returns
     the new total pop count.
     @returns {Number}
     */
    increasePop: function () {
        this.num_pops_created++;
        this.net_pops_atm++;
        return this.num_pops_created;
    },

    /*
     Decreases the net pop count.
     */
    decreasePop: function () {
        this.net_pops_atm--;
    },

    escapePopOut: function (e) {
        e = e || window.event;
        //TODO: Check if the given pop has a cover before proceeding with escaping the pop
        if (!PS.findAncestorPop(e.srcElement || e.target)) {
            var keycode = e ? e.keyCode : (window.event).keyCode;
            if (keycode === 27) {
                var highest = PS.highestConditionPopNum(function (num) {
                    var pop = PS.pop_dict[num];
                    return pop && pop.scan('esc');
                });

                if (highest !== -1) popOut(highest)
            }
        }
    },
    blurPopOut: function (e) {
        e = e || window.event;
        if (!PS.findAncestorPop(e.srcElement || e.target)) {
            var highest = PS.highestConditionPopNum(function (num) {
                var pop = PS.pop_dict[num];
                return pop && pop.scan('blur');
            });
            if (highest !== -1) popOut(highest)
        }
    },

    /*
     Returns the highest pop number which satisfies the
     function `condition`. If condition is unspecified then
     return the highest pop number without any condition.
     Returns -1 if no pops exist
     @param `condition` {function}: condition which satisfies the highest pop num
     @return {integer} highest pop number with condition satisfied
     */
    highestConditionPopNum: function (condition) {
        if (!condition) {
            condition = function () {
                return true
            }
        }
        var cur_num = PS.num_pops_created;

        var cur_pop;
        while (cur_num !== 0) {
            cur_pop = document.getElementById('popscript-box-' + cur_num);
            if (PS.pop_dict[cur_num] && cur_pop && condition(cur_num)) {
                return cur_num;
            }
            cur_num--;

        }
        return -1;
    },


    /*
     Returns true if CSS animation is supported by the browser,
     false otherwise.
     @returns (boolean)
     */
    animationPossible:  //Source: Mozilla Development Network
        function () {
            var animation = false;
            var animationstring = 'animation';
            var keyframeprefix = '';
            var domPrefixes = 'Webkit O MS MOZ'.split(' ');
            pfx = '';

            if (document.body.style.animationName) {
                animation = true;
            }

            if (animation === false) {
                for (var i = 0; i < domPrefixes.length; i++) {
                    if (document.body.style[ domPrefixes[i] + 'AnimationName' ] !== undefined) {
                        var pfx = domPrefixes[ i ];
                        animationstring = pfx + 'Animation';
                        keyframeprefix = '-' + pfx.toLowerCase() + '-';
                        animation = true;
                        break;
                    }
                }
            }

            return animation;


        },
    /*
     Returns the height (in pixels) of the document element.
     @returns {Number}
     */
    getDocHeight: function () {
        return Math.max(
            Math.max(document.body.scrollHeight, document.documentElement.scrollHeight),
            Math.max(document.body.offsetHeight, document.documentElement.offsetHeight),
            Math.max(document.body.clientHeight, document.documentElement.clientHeight)
        );
    },


    convert: {
        /*
         - if `property` is a boolean property (exists in PopScript.boolean_properties)
         it converts `val` to its respective boolean value by the following rules before
         performing the registration:
         - case 1: `val` is a boolean
         `property` is left in the boolean state
         - case 2: `val` is a string
         if `val` begins with the letter 'y'/'Y' set `val` to (boolean) true
         if `val` begins with the letter 'n/N' set `val` to (boolean) false
         (the precondition if that string `val` has to satisfy the above 2 conditions,
         rule number 2 mentioned above ensures this)
         */
        bool: function (v) {
            if (typeof v === 'string') {
                var lc = v[0].toLowerCase();
                if (lc === 'y') {
                    v = true;
                } else if (lc === 'n') {
                    v = false;
                }
            } else if (typeof  v === 'number') {
                v = Boolean(v);
            }
            if (v !== true && v !== false) {
                PS.popError(45, "'" + v + "'" + ' is not a valid PopScript boolean.');
            }
            return v;

        },

        _position_macros: {
            left: true,
            top: true,
            right: false,
            bottom: false,
            auto: null
        },
        /*
         Converts the y/x position
         of the user input into an 2/3 item array,
         where the
         0st item is an non-negative number specifying
         the pixel/percentage position coordinates
         1st item is a boolean specifying whether the position
         should be left/top or right/bottom,
         for the the former its true for the latter
         is false.
         2nd item is a boolean specifying
         if the position value is percentage based (true)
         or pixel based (false)

         if "+scrolled" (note:ignorant of whitespace) is included
         it sets the 'scrolled_<dim>' property of the compiled pop
         (sent as context as the 2nd item of the 'this' object)
         to true. where <dim> is either 'x' or 'y' representing the dimension.
         */
        boxPosition: function (v) {
            if (typeof v === 'number') {
                return [Math.abs(v), v >= 0, false]
            }
            var tokens = v.split(/ *\+ */);
            var split = [false, false, false];
            var prop_scrolled = this[0] + '_scrolled';
            var cur_scrolled_dim = this[1][prop_scrolled];
            this[1][prop_scrolled] = cur_scrolled_dim || Boolean(tokens[1] && tokens[1].toLowerCase() === 'scrolled');
            split[0] = tokens[0];
            if (['auto', 'left', 'right', 'top', 'bottom'].indexOf(split[0]) === -1) {
                split[2] = split[0][split[0].length - 1] === "%";
                var extracted_number =
                    split[1] ?
                        split[0].match(/(\-?)([\d]+)%/) :
                        split[0].match(/(\-?)([\d]+)/);

                // Whether its a left/top position or right/bottom position

                split[1] = !Boolean(extracted_number[1]);
                // The position coordinates given,
                // if its percent based then divide
                // the number by 100 to get the coordinate
                // as a ratio to 1.
                split[0] = parseInt(extracted_number[2]) / (split[2] ? 100 : 1);
            } else if (split[0] !== 'auto') {
                split[1] = PS.convert._position_macros[split[0]];
                split[0] = 0;

            }


            return split;
        },


        /*
         Returns the given position check string converted in
         to a 2 item (array) array, where the first
         item in the array is the non-repetitive position checks
         and the second item consists of the repetitive position checks
         */
        positionCheck: function (str_check) {
            if (!str_check) {
                return false
            }

            var checks_raw_array = str_check.replace(/^(\s*)/, "").replace(/(\s*)$/, "").split(/ *, */);

            var cur_align_check, timer_num, last_ind;
            var non_rep = [], rep = [];
            for (var i = 0; i < checks_raw_array.length; i++) {
                cur_align_check = checks_raw_array[i];
                last_ind = cur_align_check.length - 1;
                if (cur_align_check[last_ind] === "*") {
                    timer_num = parseInt(cur_align_check.substr(0, last_ind));
                    if (isNaN(timer_num)) {
                        return PS.popError(23, 'Invalid Position Check Number: ' + cur_align_check);
                    }
                    rep.push(timer_num);
                } else {
                    timer_num = parseInt(cur_align_check);
                    if (isNaN(timer_num)) {
                        return PS.popError(23, 'Invalid Position Check Number: ' + cur_align_check);
                    }
                    non_rep.push(timer_num);
                }
            }
            return [non_rep, rep]
        },
        /*
         Performs no extra conversion operations.
         */
        n: function (v) {
            return v
        },

        /*
         Perform conversion for zindex inputs,
         which could either be:
         (1) A simple number,eg: "1" or 1
         (2) A number with unary addition operator, eg: "+2"
         (3) A number with unary subtract operator, eg: "-2"
         In the 1st case, the final z-index will be the number
         or string converted number, depending upon the type of the input.
         In the 2nd case the final z-index will be the number
         added to the base z-index of popscript.
         In the 2nd case the final z-index will be the number
         subtracted from the base z-index of popscript.
         (note:the base z-index of popscript is mentioned in the flags)
         Returns a function which on invoking will return the appropriate value
         @param v {string} | {number}
         @return {function}
         */

        z: function (v) {
            if (typeof v === 'number') {
                return function () {
                    return v
                };
            }
            var m = v.match(/\s*(\+|\-)?\s*(\d*)/);

            if (m) {
                var num = parseInt(m[2]);
                if (m[1]) {
                    if (m[1] === "-") {
                        return function () {
                            return popscript_flags.Z - num
                        };
                    } else {
                        return function () {
                            return popscript_flags.Z + num
                        };
                    }
                }
                return function () {
                    return num
                };
            }
        }
    },


    defaults: {
        position_x: ['auto', false, false],
        position_y: ['auto', false, false],
        position_z: function () {
            return popscript_flags.Z
        },
        positionCheck: null,
        position_fixed: true,
        position_scrolled: false,
        blur: true,
        esc: true,
        cover: true,
        close_button: true,
        full_draggable: false,
        close_content: "x",
        moved: false
    },

    scope_converter: {
        'CSS_CLASSES': 'css_class',
        'ANIMATIONS': 'animation',
        'POSITION': 'position',
        IN: 'in',
        OUT: 'out'
    },


    /*
     compiles the user inputted popscript into
     a single level object for each pop class.
     @param popscript: inputted popscript
     */
    compile: function (popscript) {
        // store the compiled popscript in
        this.compiled_popscript = {};
        for (var pop_class in popscript) {
            if (popscript.hasOwnProperty(pop_class)) {
                this.compiled_popscript[pop_class] = this.compilePopClass(popscript[pop_class]);
            }
        }

        //TODO: Free memory of original popscript

    },

    /*
     compiles the script of a given pop class
     to a single level object viz. removes all
     scopes.
     @param pop_class_script (object): script of an arbitrary pop class, possible anonymous.
     @return (object) single nest level object
     */
    compilePopClass: function (pop_class_script) {
        var compiled_pop_class_script = {};
        for (var key in pop_class_script) {
            if (pop_class_script.hasOwnProperty(key)) {
                // Check if the given key is a standalone property or a scope.
                if (this.scope_converter[key.toUpperCase()]) { // Scope

                    this.compileScope([key], pop_class_script[key], compiled_pop_class_script, pop_class_script)
                }
                else { // Standalone property
                    this.registerPopProperty(
                        compiled_pop_class_script, key, pop_class_script[key], pop_class_script);
                }
            }
        }
        return compiled_pop_class_script;
    },

    /*
     Compiles the popscript scope `scope_names` (Array) [scopes are present in the order of nesting]
     and registers its properties into
     the `compiled_pop_script` object.
     @param `scope_chain` (Array) : name of the entire scope
     @param `scope` (Object): the scope properties of the current scope.
     @param `compiled_pop_classes_script` (Object): the object in which to register the scope properties.
     @param `pop_class_script` (Object): user inputted popscript for a given class/anonymous class
     */
    compileScope: function (scope_chain, scope, compiled_pop_classes_script, pop_class_script) {

        // Check if the scope is given as an object
        if (typeof scope !== 'object') {
            this.popError(26, "Scope '" + scope_chain.join('>') + "' has to be an object");
            return null
        } else {
            for (var scope_property in scope) {
                if (scope.hasOwnProperty(scope_property))
                // Check if the given key is a standalone property or a scope.
                    if (this.scope_converter[scope_property.toUpperCase()]) { // Scope
                        this.compileScope(this.helper.cloneAndPushArray(scope_chain, scope_property), scope[scope_property],
                            compiled_pop_classes_script, pop_class_script)
                    } else {
                        this.registerPopProperty(
                            compiled_pop_classes_script, scope_property, scope[scope_property], pop_class_script, scope_chain);
                    }
            }
        }

    },


    /*
     Registers string `property` to the object `dict` the value
     of `val` in popscript compiled format.
     - Checks if the property is valid (issues a popscript error if it isn't)
     - Converts the property value to its compiled form (PopScript.compile)
     - TODO: Checks if the property is of the correct type and format [optional regex for strings] (issues a popscript error if it isn't)
     - `property` is lower cased before registration.
     - if `property` is scope based then the scope is broken by
     eg. if the scope is 'CSS_CLASSES',
     and the property within is 'close', then the compiled property would be:
     PopScript.scope_converter['CSS_CLASSES'] + '_' + 'close'
     => 'class_close'
     - if a `property` is mentioned at both scope and non-scope level, the non-scope level
     property is given higher specificity. ex: `animation_box` would have a higher specificity
     than `box` mentioned within the `ANIMATIONS` scope.
     @param `compiled` (object) the compiled dict
     @param `property` (string)
     @param `val` (string/number/boolean)
     @param `pop_class_dict` (object) user inputted popscript object for the pop class in context
     @param [`scope_chain`] (Array) optional for non-scope properties
     */
    registerPopProperty: function (compiled, property, val, pop_class_dict, scope_chain) {
        // The property mentioned within a scope needs to be converted into
        // its compiled name before registering the pop property.
        // This step is step which
        // breaks the double level of nesting created by internal scopes.
        // Read the doc given above for more details.


        var compiled_property_name = scope_chain ? (this.compiledScopeName(scope_chain) + property.toLowerCase()) : property.toLowerCase();


        // Check if the specificity of the property (rule 5 in doc)
        //TODO: check for scopes between the current and the standalone scope
        if (scope_chain && this.hasStandaloneProperty(pop_class_dict, compiled_property_name)) {
            return null;
        }

        // TODO: add type and regex checks
        if (this.all_properties[compiled_property_name]) {
            // Finally register the given property-value, before which
            // convert the value to its compiled form
            // Send as context (this) an array where the
            // 0th item is the name of the compiled property
            // 1st item is the compiled dict of the pop so far
            compiled[compiled_property_name] = PS.all_properties[compiled_property_name].call([compiled_property_name, compiled], val);
        } else {

            this.popError(29, ('Invalid pop property name: "' + property + '"') +
                (!scope_chain ? "" : ' within scope: ' + scope_chain.join('>')));
        }


    },
    /*
     Returns the compiled scope name of the
     scopes given in the Array `scopes`, according
     to the following rule:
     Each scope name is converted to its compiled
     scope name (using this.scope_converter) then
     adding an '_' (underscore) after each of the
     child scopes.
     e.g: ['ANIMATIONS', 'IN'] becomes:
     => 'animation_in_'
     @returns (String)
     */
    compiledScopeName: function (scopes) {
        var s = "";

        for (var i = 0; i < scopes.length; i++) {
            s += (this.scope_converter[scopes[i].toUpperCase()]) + '_';
        }

        return s;
    },
    /*
     Returns true if the given object `dict` has the property
     of string `prop` without case sensitivity, returns false otherwise.

     Precondition: `prop` is in lower case.

     @param dict (object): dictionary to check the property within
     @param prop (string): property to check
     @returns (boolean)
     */
    hasStandaloneProperty: function (dict, prop) {
        prop = prop.toLowerCase();
        for (var key in dict) {
            if (dict.hasOwnProperty(key)) {
                if (key.toLowerCase() === prop) {
                    return true;
                }
            }
        }
        return false;
    },

    drag: {

        box_node: null,
        pop_num: -1,
        pop_position_fixed: null,
        diff: [],
        /*
         Event Binding for mousedown on drag begin.
         */
        start: function (e) {


            PS.drag.no_user_select();
            var mp = PS.pos.mouse(e ?
                e : window.event);
            var ancestor_pop = PS.findAncestorPop(this);

            if (ancestor_pop) {
                PS.event.add(document, 'mousemove', PS.drag.during);
                PS.drag.box_node = ancestor_pop;
                PS.drag.pop_num = parseInt(ancestor_pop.getAttribute('data-pop-num'));
                PS.drag.pop_position_fixed = PS.pop_dict[PS.drag.pop_num].scan('position_fixed');

                var x_fix = 0, y_fix = 0;
                if (PS.drag.pop_position_fixed) {
                    var scrolled = PS.pos.scrolled();
                    x_fix = scrolled.x;
                    y_fix = scrolled.y;
                }

                PS.drag.diff[0] = mp[0] - x_fix - (PS.pos.offset(ancestor_pop).left);
                PS.drag.diff[1] = mp[1] - y_fix - (PS.pos.offset(ancestor_pop).top);

            }

        },

        /*
         Event Binding for mousemove on dragging.
         */
        during: function (e) {

            if (!PS.drag.box_node) {
                return null;
            }

            var x_fix = 0, y_fix = 0;
            if (PS.drag.pop_position_fixed) {
                var scrolled = PS.pos.scrolled();
                x_fix = scrolled.x;
                y_fix = scrolled.y;
            }

            var mp = PS.pos.mouse(e ?
                e : window.event);

            var x = mp[0] - x_fix - PS.drag.diff[0];
            var y = mp[1] - y_fix - PS.drag.diff[1];
            PS.drag.box_node.style.left = (x) + "px";
            PS.drag.box_node.style.top = (y) + "px";


            // Update the pop to store the information that it has been moved
            PS.pop_dict[PS.drag.pop_num].set('moved', true);


        },
        /*
         Event Binding for mouseup on drag end.
         */
        done: function (e) {
            PS.event.remove(document, 'mousemove', PS.drag.during);
            PS.drag.no_no_user_select();
            PS.drag.box_node = null;
            PS.drag.pop_num = -1;

        },
        user_select: {
            '-webkit-': "", '-moz-': "", '-ms-': "", '': ""
        },
        no_user_select: function () {
            for (var vendor in this.user_select) {
                if (this.user_select.hasOwnProperty(vendor)) {
                    this.user_select[vendor] = document.body.style[vendor + "user-select"];
                    document.body.style[vendor + "user-select"] = "none";
                }
            }
        },
        no_no_user_select: function () {
            for (var vendor in this.user_select) {
                if (this.user_select.hasOwnProperty(vendor) && document.body.style[vendor + "user-select"]) {
                    document.body.style[vendor + "user-select"] = this.user_select[vendor];
                }
            }
        }
    },
    /*
     Returns the ancestor of the DOM node element `n`
     which contains it (node `n`), it can also be
     node `n` itself.
     @param {Node} `n`
     */
    findAncestorPop: function (n) {
        var cur_node = n;
        while (cur_node) {
            if (PS.css_class.has(cur_node, 'popscript-box')) {

                return cur_node;
            }
            cur_node = cur_node.parentNode;
        }
        return null;
    },


    pos: {
        /*
         Returns the offset of the the DOM Node Element `el`
         in an object with keys 'top' and 'left'
         @returns {object}
         @param `el` {DOM Node Element}
         */
        offset: function (el) {
            if (el.style.position === 'fixed') {
                return el.getBoundingClientRect()
            }
            //return el.getBoundingClientRect(); //WARNING: this line will not work here
            // Source: http://www.quirksmode.org/js/findpos.html
            var cur_left = 0;
            var cur_top = 0;
            if (el.offsetParent) {
                do {
                    cur_left += el.offsetLeft;
                    cur_top += el.offsetTop;

                } while (el = el.offsetParent);
            }
            return {left: cur_left, top: cur_top};

        },
        mouse: function (e) {
            // Source: http://www.quirksmode.org/js/events_properties.html
            var posx = 0;
            var posy = 0;
            if (!e) var e = window.event;
            if (e.pageX) {
                posx = e.pageX;
                posy = e.pageY;
            }
            else {
                posx = e.clientX + document.body.scrollLeft
                    + document.documentElement.scrollLeft;
                posy = e.clientY + document.body.scrollTop
                    + document.documentElement.scrollTop;
            }
            return [posx, posy];

        },
        /*
         Returns an object containing
         information of the magnitude of
         x (key 'x') and y (key 'y')
         scrolled in the window.
         @returns {object} containing two keys (both values are numbers)
         */
        scrolled: function () {
            //TODO: come up with cross browser solution for 'h'
            return {y: Math.max(window.scrollY, document.body.scrollTop),
                x: Math.max(window.scrollX)};

        },
        check: function (pop_num, arg2, arg3) {
            var dim, box_node, cover_node;
            if (!arg2) {
                box_node = document.getElementById('popscript-box-' + pop_num);
                cover_node = document.getElementById('popscript-cover-' + pop_num);
                dim = PS.dims.node(box_node, true);
            } else {
                box_node = arg2;
                cover_node = arg3;
                dim = PS.dims.node(arg2.cloneNode(true));
            }
            var pop = PS.pop_dict[pop_num];
            if (pop.scan('moved')) return false;

            var window_dim = PS.dims.window();
            var scrolled = PS.pos.scrolled();

            if (pop.scan('cover')) {
                cover_node.style.height = PS.getDocHeight() + "px";

                if (pop.scan('cover_fixed')) {
                    cover_node.style.maxHeight = PS.dims.window().height + "px";
                    cover_node.style.top = scrolled.y + "px";
                    cover_node.style.left = scrolled.x + "px";
                }


            }


            // pop_y/x components
            // (0) value (number)
            // (1) left/top position or right/bottom
            // (2) percent based (boolean)

            var pop_y, pop_x, position_fixed, cover_fixed;

            cover_fixed = pop.scan('cover_fixed');

            if (pop.scan('near_element')) {
                var pop_xy = PS.nearElement(pop.scan('near_element'), pop.scan('nearElement'), dim);
                pop.compiled.position_fixed = PS.pos.isFixed(pop.scan('near_element'));
                pop_x = PS.convert.boxPosition.call(['position_x_scrolled', pop.compiled], pop_xy[0]);
                pop_y = PS.convert.boxPosition.call(['position_y_scrolled', pop.compiled], pop_xy[1]);


            } else {
                pop_y = pop.scan('position_y');
                pop_x = pop.scan('position_x');
            }

            position_fixed = pop.scan('position_fixed');

            box_node.style.position = position_fixed ? 'fixed' : 'absolute';
            // if its one of the following:
            // (1) fixed pop
            // (2) cover fixed pop
            // then do not take scrolled into account
            // since scrolled can be taken into account only once store the current value of scrolled
            // so as to provide the value for the repositioning


            pop.scrolled_y = pop.scrolled_y !== undefined ? pop.scrolled_y : (!cover_fixed && !position_fixed && pop.scan('position_y_scrolled') ? scrolled.y : 0);

            pop.scrolled_x = pop.scrolled_x !== undefined ? pop.scrolled_x : (!cover_fixed && !position_fixed && pop.scan('position_x_scrolled') ? scrolled.x : 0);

            // Reset the positions
            box_node.style.top = "auto";
            box_node.style.right = "auto";
            box_node.style.bottom = "auto";
            box_node.style.left = "auto";

            if (pop_y[0] !== 'auto') {
                // check if its a left/(top) position pop
                if (pop_y[1]) {
                    box_node.style.top = PS.dims.auto(pop_y[0], window_dim.height, dim.h, pop.scrolled_y, pop_y[2]) + "px";
                } else {
                    box_node.style.bottom = PS.dims.auto(pop_y[0], window_dim.height, dim.h, -pop.scrolled_y, pop_y[2]) + "px";
                }
            } else {
                box_node.style.top = PS.dims.auto(pop_y[0], window_dim.height, dim.h, pop.scrolled_y, pop_y[2]) + "px";
            }

            if (pop_x[0] !== 'auto') {
                // check if its a (left)/top position pop
                if (pop_x[1]) {
                    box_node.style.left = PS.dims.auto(pop_x[0], window_dim.width, dim.w, pop.scrolled_x, pop_x[2]) + "px";
                } else {
                    box_node.style.right = PS.dims.auto(pop_x[0], window_dim.width, dim.w, -pop.scrolled_x, pop_x[2]) + "px";
                }

            } else {
                box_node.style.left = PS.dims.auto(pop_x[0], window_dim.width, dim.w, pop.scrolled_x, pop_x[2]) + "px";
            }


        }, isFixed: function (ele) {

            return ((ele.style && ele.style.position === 'fixed') || (!(ele.style && ele.style.position) && ele.tagName &&
                window.getComputedStyle(ele, null) &&
                window.getComputedStyle(ele, null).getPropertyValue('position') === 'fixed')) ||
                (ele.parentNode  && PS.pos.isFixed(ele.parentNode));
        },

        checkAll: function () {
            for (var i in PS.pop_dict) {
                if (PS.pop_dict.hasOwnProperty(i)) {
                    PS.pos.check(i);
                }
            }
        }
    },

    dims: {
        /*
         Returns the dimensions (height and width) (within an object) of the DOM node `node`.
         @param `node` {DOM Node}
         @param `in_doc` {boolean} Specifies whether the node is already
         a part of the document object.
         @returns {object}  key h is the height, key w is the width.
         */
        node: function (node, part_of_doc) {
            // dimension object
            if (!part_of_doc) {  // Not a part of the document

                var dim = {};

                // temporarily add a clone of the node to the document to check its dimensions
                node.style.visibility = 'hidden';
                node.id = "popscript-check-popup-dimensions";

                document.body.appendChild(node);
                var appended_node = document.getElementById("popscript-check-popup-dimensions");

                dim.h = appended_node.offsetHeight;
                dim.w = appended_node.offsetWidth;
                node.style.visibility = "visible";
                document.body.removeChild(appended_node);
                return dim;
            }
            // Else its already a part of the document
            return {h: node.offsetHeight, w: node.offsetWidth}

        },


        /*
         Returns the pixel value of the auto y/x
         or custom alignment of a box of `pop_dimension`
         @param `pop_attr` {number}
         @param `window_dimension` {number}
         @param `pop_dimensions` {object} 2 element object containing numbers
         @param `scrolled` {number}
         @param `percent_based` {boolean} position is percent based or not
         @returns {number}
         */
        auto: function (pop_attr, window_dimension, pop_dimensions, scrolled, percent_based) {
            if (pop_attr === "auto") {
                if (pop_dimensions >= window_dimension) {
                    return scrolled;
                }
                else {

                    return (parseInt((window_dimension - (pop_dimensions)) / 2.0)) + scrolled
                }

            } else {

                if (percent_based) {
                    return scrolled + (parseFloat(window_dimension) * pop_attr);
                } else {

                    return scrolled + pop_attr;
                }


            }


        },
        /*
         Returns the dimensions (height & width) of the window in the form of
         an object.
         */
        //Source: http://www.howtocreate.co.uk/tutorials/javascript/browserwindow
        window: function () {
            var d = {};
            if (typeof( window.innerWidth ) == 'number') {
                //Non-IE
                d.width = window.innerWidth;
                d.height = window.innerHeight;
            } else if (document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight )) {
                //IE 6+ in 'standards compliant mode'
                d.width = document.documentElement.clientWidth;
                d.height = document.documentElement.clientHeight;
            } else if (document.body && ( document.body.clientWidth || document.body.clientHeight )) {
                //IE 4 compatible
                d.width = document.body.clientWidth;
                d.height = document.body.clientHeight;
            }

            return d;
        }
    },

    cover_fix: {
        orig_body_overflow: undefined,
        count: 0,
        fix: function () {
            var scope = PS.cover_fix;
            if (!scope.count++) {
                scope.orig_body_overflow = document.body.style.overflow ? document.body.style.overflow : 'visible';
                document.body.style.overflow = 'hidden';
            }

        },
        unfix: function () {
            var scope = PS.cover_fix;
            if (!--scope.count) {
                document.body.style.overflow = scope.orig_body_overflow;
            }
        }
    },
    event: {
        GUID: 1,
        add: function (element, type, handler) {
            if (element.addEventListener) {
                element.addEventListener(type, handler, false);
            } else {
                // assign each event handler a unique ID
                if (!handler.$$guid) handler.$$guid = PS.event.GUID++;
                // create a hash table of event types for the element
                if (!element.events) element.events = {};
                // create a hash table of event handlers for each element/event pair
                var handlers = element.events[type];
                if (!handlers) {
                    handlers = element.events[type] = {};
                    // store the existing event handler (if there is one)
                    if (element["on" + type]) {
                        handlers[0] = element["on" + type];
                    }
                }
                // store the event handler in the hash table
                handlers[handler.$$guid] = handler;
                // assign a global event handler to do all the work
                element["on" + type] = this.handle;
            }
        },
        remove: function (element, type, handler) {
            if (element.removeEventListener) {
                element.removeEventListener(type, handler, false);
            } else {
                // delete the event handler from the hash table
                if (element.events && element.events[type]) {
                    delete element.events[type][handler.$$guid];
                }
            }
        },
        handle: function (event) {
            var returnValue = true;
            // grab the event object (IE uses a global event object)
            event = event || PS.fix(((this.ownerDocument || this.document || this).parentWindow || window).event);
            // get a reference to the hash table of event handlers
            var handlers = this.events[event.type];
            // execute each event handler
            for (var i in handlers) {
                this.$$handleEvent = handlers[i];
                if (this.$$handleEvent(event) === false) {
                    returnValue = false;
                }
            }
            return returnValue;
        },
        fix: function (event) {
            // add W3C standard event methods
            event.preventDefault = PS.fix_preventDefault;
            event.stopPropagation = PS.fix_stopPropagation;
            return event;
        },
        fix_preventDefault: function () {
            this.returnValue = false;
        },
        fix_stopPropagation: function () {
            this.cancelBubble = true;
        }

    },


    checkValidPopClasses: function (pop_class) {
        var pop_class_list = PS.helper.trimString(pop_class).split(/[\s]+/);
        for (var i = 0; i < pop_class_list.length; i++) {
            if (!this.compiled_popscript[pop_class_list[i]]) {
                return this.popError(3, "Inexistent Pop Class: '" + pop_class_list[i] + "'");
            }
        }
        return pop_class_list;
    },

    /*
     'console.error's the respective popscript error
     and optionally (depending on the settings of the popscript flags)
     alerts and/or throws the error.
     */
    popError: function (num, msg) {
        var full_msg = 'PopScript Error ' + num + ": " + msg;

        console.error(full_msg);
        if (popscript_flags['alert error on error']) alert(full_msg);
        if (popscript_flags['throw error on error'])  throw full_msg;
    },


    popAnimateOut: function (delay_length, main, todo) {
        var delay = 0;

        if ((this.animationPossible) && (delay_length)) {
            delay = delay_length ;//- 30;
            setTimeout(function () {
                main.parentNode.removeChild(main);
            }, delay- delay*0.1); // take into account that animations last a little lesser than the given duration
            for (var key in todo) {
                if (todo.hasOwnProperty(key)) {
                    var value = todo[key];
                    if (value && value !== "none") {
                        var key_node = document.getElementById(key);
                        this.addAnimation(key_node, value, delay)

                    }
                }
            }
        } else {
            main.parentNode.removeChild(main);
        }
    },
    addAnimation: function (node, value, unified_delay) {
        var delay_mentioned_in_value = value.match(/ [\d]+(s|ms)$/);

            var delay_to_add = delay_mentioned_in_value ? "" : unified_delay + "ms";
            node.style.animation = (value + ' ' + delay_to_add);
            node.style.webkitAnimation = (value + ' ' + delay_to_add);
            node.style.mozAnimation = (value + ' ' + delay_to_add);
            node.style.oAnimation = (value + ' ' + delay_to_add);
            node.style.msAnimation = (value + ' ' + delay_to_add);


    },

    helper: {
        /*
         Clone the array/nodelist into an array, where
         the cloning is a single level deep.
         @param `ar` {array|NodeList}
         @returns {array}
         */
        cloneSingleLevel: function (ar) {
            var cloned = [];
            for (var i = 0; i < ar.length; i++) {
                cloned.push(ar[i]);
            }
            return cloned;
        },
        /*
         Returns a clone of the Array `list` with
         element (type unknown) `ele` pushed onto it.
         @param `list` (Array)
         @param `ele` (Unknown)
         @return (Array)
         */
        cloneAndPushArray: function (list, ele) {

            var clone = this.cloneSingleLevel(list);
            clone.push(ele);
            return clone;
        },
        /*
         Returns a left and right whitespace trimmed
         version of string `line`
         @param `line` {string}
         @returns {string}
         */

        trimString: function (line) {
            //source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim
            return line.replace(/^\s+|\s+$/g, '');
        }
    },
    css_class: {
        /*
         Returns an array of elements of the class name `class_name`,
         within the context of element `parent`, if `parent`
         is not specified the context to look within is the
         entire document. In the case of `parent` being
         specified, include it also within the scope.
         @param `class_name` {string}
         @param `parent` {DOM Node Element}
         @returns {array}
         */
        nodes: function (class_name, parent) {
            // Check if parent is specified
            if (!parent) {
                parent = document; // if not then the document will be the parent
            }
            var all_of_class = [];
            // Check if the browser natively supports
            // the method getcss_class.elementsName
            if (parent.getElementsByClassName) {
                all_of_class = parent.getElementsByClassName(class_name);
            }
            // Check if it supports querySelectorAll (IE 8 supports
            else if (parent.querySelectorAll) {
                all_of_class = parent.querySelectorAll(class_name);
            }

            else { // Else the browser being used is a legacy browser
                // Scan through all the elements and look for the
                // popscript boxes
                var all_elements = parent.getElementsByTagName('*');

                var num = 0;
                for (var i = 0; i < all_elements.length; i++) {
                    if (all_elements[i].className && this.has(all_elements[i], class_name)) {
                        all_of_class.push(all_elements[i]);
                    }
                }
            }

            // Check if the parent is not document,
            // in this case it should also be included
            // within the search
            if (parent !== document && this.has(parent, class_name)) {
                all_of_class = PS.helper.cloneSingleLevel(all_of_class);
                all_of_class.push(parent);
            }
            return all_of_class;
        },

        /*
         Returns true if `class_name` belongs
         to the DOM node element `el`, false otherwise.
         @param `el` {DOM Node Element}
         @param `class_name` {string}
         @returns {boolean}
         */
        has: function (el, class_name) {
            if (!el.className) {
                return false
            }


            return el.className.split(/ +/).indexOf(class_name) !== -1;
        },
        /*
         Adds the css class `class_name`
         to the DOM node element `el`.
         @param `el` {DOM Node Element}
         @param `class_name` {string}
         */
        add: function (el, class_name) {
            if (!this.has(el, class_name))
                el.className = el.className ? (el.className + " " + class_name) : class_name;
        },

        /*
         Removes the css class `class_name`
         to the DOM node element `el`.
         @param `el` {DOM Node Element}
         @param `class_name` {string}
         */
        remove: function (el, class_name) {
            if (this.has(el, class_name)) {
                el.className = el.className.replace(new RegExp(" ?" + class_name), "");
            }
        }

    },

    nearElement: function (node, cb, pop_dims) {
        var offset = PS.pos.offset(node);
        var dims = PS.dims.node(node, true);

        return cb(offset.left, offset.top, dims.w, dims.h, pop_dims.w, pop_dims.h);
    }
};


var Pop = function (pop_class, extra_dict) {

    this.pop_class = pop_class;
    // Extract the pop classes and check if the classes
    // are valid

    this.pop_class_list = PS.checkValidPopClasses(this.pop_class);
    this.compiled = this.pop_class_list ? this.compile(this.pop_class_list, extra_dict) : {};


};

Pop.prototype.isValid = function () {
    return this.pop_class_list;
};

/*
 Returns the value of the PopScript
 property `prop`.
 @param `prop` (String)
 @returns (Any Type)
 */
Pop.prototype.scan = function (prop) {
    if (this.compiled[prop] === undefined)
        return PS.defaults[prop];
    return this.compiled[prop];
};

/*
 Sets the compiled value of property `prop`
 to the value `val`. It converts the `val` to
 its compiled form given the type of property
 `prop` is.
 @param `prop` (String)
 @param `val` (any type)
 */
Pop.prototype.set = function (prop, val) {
    this.compiled[prop] = PS.all_properties[prop](val);
};


/*
 Compiles and returns the Pop with the pop classes (given in order) in the
 array `pop_class_list` with extra functions and popscript
 from the object `extra_dict`.
 extra_dict has 3 options:
 (1) popscript -> more popscript
 (2) beforePopOut -> function to be called before popping out the pop
 (3) afterPopOut -> function to be called after popping out the pop
 (4) near_element -> node to which the pop should be located near
 (5) nearElement -> function which returns the [x,y] co-ordinates near the element
 `near_element` for where the pop will be placed
 @param `pop_class_list` {array}
 @param `extra_dict` {object}
 @returns {object} compiled pop
 */
Pop.prototype.compile = function (pop_class_list, extra_dict) {
    var compiled = {};
    var cur_attrs, cur_attr;
    // Iterate 1 extra time if there is any extra popscript
    for (var i = 0; i < pop_class_list.length + Number(Boolean(extra_dict.popscript)); i++) {
        cur_attrs = i < pop_class_list.length ? PS.compiled_popscript[pop_class_list[i]] : PS.compilePopClass(extra_dict.popscript);
        for (cur_attr in cur_attrs) {
            if (cur_attrs.hasOwnProperty(cur_attr)) {
                compiled[cur_attr] = cur_attrs[cur_attr];
            }
        }
    }

    compiled.beforePopOut = extra_dict.beforePopOut;
    compiled.afterPopOut = extra_dict.afterPopOut;
    compiled.near_element = extra_dict.near_element;
    compiled.nearElement = extra_dict.nearElement;
    // No need to set 'moved' here to false, as by default
    // it will be 'undefined' which is as good as false
    // when doing look ups.

    return compiled;
};

/*
 Creates a pop based on the pop class mentioned
 in the string `pop_input` with the content of
 `content`. `pop_input` always contains the 'basic'
 pop class within.
 */
function pop(content, pop_input, extra_dict) {
    // If pop_input hasn't been declared, the arguments
    // are essentially shifted (left) with extra_dict
    // (potentially) being pop_input
    if (pop_input && pop_input.substr === undefined) {
        extra_dict = pop_input;
        pop_input = "basic";
    }
    if (!pop_input) {
        pop_input = "";
    }

    // 'basic' is an essential pop class in any pop
    pop_input = "basic " + pop_input;


    // Make sure extra_dict exists even if its empty
    // so as to skip repeatedly checking if it has
    // defined later on the code.
    extra_dict = extra_dict ? extra_dict : {};

    // Instantiate a new pop with the given pop_input
    var pop = new Pop(pop_input, extra_dict);
    if (pop.isValid() === false) {
        return false;
    }

    // Increase the popscript number to ensure uniqueness
    var new_popscript_number = PS.increasePop();

    PS.pop_dict[new_popscript_number] = pop;

    var animation_in_duration = pop.scan('animation_in_duration');

    if (pop.scan('cover')) {
        var cover_node = document.createElement('div');
        cover_node.style.position = 'absolute';
        cover_node.style.overflow = 'auto';
        cover_node.style.width = '100%';
        cover_node.style.top = '0';
        cover_node.style.left = '0';
        cover_node.style.right = '0';
        cover_node.style.zIndex = pop.scan('position_z')();
        if (pop.scan('cover_fixed')) {
            PS.cover_fix.fix();
        }
        cover_node.className = pop.scan('css_class_cover') + " popscript-cover";


        var cover_animation_in = pop.scan('animation_in_cover');
        if (cover_animation_in) {
            PS.addAnimation(cover_node, cover_animation_in, animation_in_duration)
        }
        cover_node.id = 'popscript-cover-' + new_popscript_number;

    }

    var box_node = document.createElement('div');

    var popup_animation_in = pop.scan('animation_in_box');
    if (popup_animation_in) {
        PS.addAnimation(box_node, popup_animation_in, animation_in_duration)
    }


    box_node.style.zIndex = pop.scan('position_z')();
    box_node.setAttribute('data-pop-num', new_popscript_number.toString());
    // Add the to be created pop to the object reference of pops,
    // for further look ups and manipulations.

    box_node.className = pop.scan('css_class_box') + " popscript-box";

    if ((content.substring) !== undefined) {
        box_node.innerHTML = content;
    } else {
        box_node.appendChild(content);
    }

    // Positioning of box

    PS.pos.check(new_popscript_number, box_node, cover_node);

    box_node.id = 'popscript-box-' + new_popscript_number;


    var align_checks = pop.scan('position_check');
    pop.compiled.timeouts = [];
    pop.compiled.intervals = [];
    if (align_checks) {
        var timeouts = align_checks[0];
        for (var i = 0; i < timeouts.length; i++) {
            pop.compiled.timeouts.push(setTimeout(function () {
                PS.pos.check(new_popscript_number)
            }, timeouts[i]));
        }
        var intervals = align_checks[1];
        for (i = 0; i < intervals.length; i++) {
            pop.compiled.intervals.push(setInterval(function () {
                PS.pos.check(new_popscript_number)
            }, intervals[i]));
        }

    }

    /*PopScript.addEvent(box_node, 'click', function (e) {

     e.stopImmediatePropagation();
     });*/


    if (pop.scan('full_draggable')) {
        box_node.className += ' popscript-move';
    }


    if (pop.scan('close_button')) {
        var close_node = document.createElement('span');
        close_node.style.cursor = "pointer";
        close_node.style.position = 'absolute';
        close_node.style.top = '0';
        close_node.style.right = '0';
        close_node.className = pop.scan('css_class_close') + ' popscript-close';
        close_node.appendChild(document.createTextNode(pop.scan('close_content')));

        box_node.appendChild(close_node);
    }

    if (pop.scan('click_to_close')) {

        PS.css_class.add(box_node, 'popscript-close');
    }

    if (pop.scan('cover')) {
        cover_node.appendChild(box_node);
        document.body.appendChild(cover_node);
    } else {
        document.body.appendChild(box_node);
    }

    // Check if the user has added any popscript-move elements to the pop.
    var all_move = PS.css_class.nodes('popscript-move', box_node);
    for (i = 0; i < all_move.length; i++) {
        PS.event.add(all_move[i], 'mousedown', PS.drag.start);
        PS.event.add(all_move[i], 'mouseup', PS.drag.done);
    }

    // Check if the user has added any popscript-close elements to the pop.
    var all_close = PS.css_class.nodes('popscript-close', box_node);
    for (i = 0; i < all_close.length; i++) {
        PS.event.add(all_close[i], 'click', closePop);
    }

    PS.num_pops_created++;

    var orig_blur = pop.compiled.blur;
    pop.compiled.blur = false;

    setTimeout(function () {
        pop.compiled.blur = orig_blur
    }, 500);


    // Return the popscript number
    // for tracking purposes
    return new_popscript_number;
}

/* Return true if the pop exists, false otherwise
@param `pop_num` {number}
 */
function popExists(pop_num) {
    return PS.pop_dict[pop_num] !== undefined;
}

function popOut(pop_num) {
    if (pop_num === undefined) {
        pop_num = PS.highestConditionPopNum();
        if (pop_num === -1) return;
    }
    var pop_cover = document.getElementById('popscript-cover-' + pop_num);
    var pop_popup = document.getElementById('popscript-box-' + pop_num);
    var pop = PS.pop_dict[pop_num];

    if (!pop) {
        return
    }

    if (pop.scan('beforePopOut') && pop.scan('beforePopOut').call(pop_popup) === false) {
        return false;
    }

    if (pop.scan('afterPopOut')) pop.scan('afterPopOut')();

    var animate_out_dict = {};
    animate_out_dict[pop_popup.id] = pop.scan('animation_out_box');

    if (pop_cover) {
        animate_out_dict[pop_cover.id] = pop.scan('animation_out_cover');
    }
    var animation_out_length = pop.scan('animation_out_duration');

    PS.popAnimateOut(animation_out_length, pop_cover ? pop_cover : pop_popup,
        animate_out_dict);


    if (pop.scan('cover_fixed'))
        PS.cover_fix.unfix();
    PS.decreasePop();

    // Clear the created timeouts and intervals for
    // alignment checks.
    var pop_timeouts = pop.scan('timeouts');
    var pop_intervals = pop.scan('intervals');

    for (var i = 0; i < pop_timeouts.length; i++) {
        clearInterval(pop_timeouts[i]);
    }

    for (i = 0; i < pop_intervals.length; i++) {
        clearInterval(pop_intervals[i]);
    }
    delete PS.pop_dict[pop_num];
}


/*
 Returns the number of pops currently in existence
 @return (Number)
 */
// TODO: Move to scope of PopScript (as PopScript.total ?)
function numPops() {
    return PS.css_class.nodes('popscript-box').length;
}

function closePop(e) {
    if (this === (e.srcElement || e.target)) {
        var ancestor_pop = PS.findAncestorPop(this);
        if (ancestor_pop) {
            popOut(ancestor_pop.getAttribute('data-pop-num'));
        }
    }
}


// Add all properties to the singleton PS
// after declaring it so as to have PS.convert
// declared beforehand.
PS.all_properties = {
    animation_in_duration: PS.convert.n,
    animation_out_duration: PS.convert.n,
    position_fixed: PS.convert.bool,
    position_x: PS.convert.boxPosition,
    position_y: PS.convert.boxPosition,
    position_z: PS.convert.z,
    position_x_scrolled: PS.convert.bool,
    position_y_scrolled: PS.convert.bool,

    cover_fixed: PS.convert.bool,

    full_draggable: PS.convert.bool,
    animation_out_box: PS.convert.n,
    cover: PS.convert.bool,
    css_class_close: PS.convert.n,
    css_class_cover: PS.convert.n,
    animation_out_cover: PS.convert.n,
    esc: PS.convert.bool,
    blur: PS.convert.bool,
    close_button: PS.convert.bool,
    animation_in_cover: PS.convert.n,
    position_check: PS.convert.positionCheck,
    animation_in_box: PS.convert.n,
    css_class_box: PS.convert.n,
    click_to_close: PS.convert.bool,
    close_content: PS.convert.n,

    beforePopOut: PS.convert.n,
    afterPopOut: PS.convert.n,
    nearElement: PS.convert.n,
    near_element: PS.convert.n,
    moved: PS.convert.n
};

/*
 Initiates PopScript in the browser environment.
 */
function initiatePopScript() {
    PS.compile(popscript);
    PS.event.add(document, 'keydown', PS.escapePopOut);
    PS.event.add(document, 'click', PS.blurPopOut);
    PS.event.add(document, 'contextmenu', PS.blurPopOut);
    PS.event.add(window, 'resize', PS.pos.checkAll);
    PS.event.add(window, 'scroll', PS.pos.checkAll);


    //PS.event.add(window, 'scroll', PS.checkAll );
}

// Create an alias for PS to improve
// readability of calls to methods of
// the object.
// Note internally the variable `PS`
// should always be used over `PopScript`,
// In other words `PopScript` should be unused
var PopScript = PS;

initiatePopScript();
