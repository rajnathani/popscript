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
            y: 'auto'
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

    error: {
        STYLE: {
            CLASS: {
                box: 'error'
            }
        },
        ANIMATION: {
            IN: {
                box: 'short-arrive-left, fade-in'
            },
            OUT: {
                box: 'fade-out'
            }
        },
        POSITION: {
            x: '!10',
            y: '10'
        }
    },

    dropdown: {
        STYLE: {
            CLASS: {
                box: 'dropdown'
            }
        },
        ANIMATION: {
            IN: {
                duration: 90
            },
            OUT: {
                box: ''
            }
        },
        POSITION: {
            z: '-1'
        },

        cross: 'no',
        cover: 'no',
        full_draggable: 'no'
    },

    context_menu: {
        STYLE: {
            CLASS: {
                box: 'context-menu'
            }
        },
        ANIMATION: {
            IN: {
                box: ''
            },
            OUT: {
                box: 'fade-out',
                duration: 120
            }
        },
        POSITION: {
            fixed: 'no',
            z: '-1'
        },

        cover: 'no',
        cross: 'no',
        full_draggable: 'no'
    },

    tooltip: {
        STYLE: {
            CLASS: {
                box: 'popscript-tooltip'
            }
        },
        ANIMATION: {
            OUT: {
                box: 'fade-out'
            }
        },
        POSITION: {
            z: '-1'
        },

        click_me_out: 'yeh',
        cross: 'no',
        cover: 'no',
        blur: 'no',
        esc: 'yes',
        full_draggable: 'no'
    },

    tip_left: {
        STYLE: {
            CLASS: {
                box: 'popscript-tooltip left'
            }
        },
        ANIMATION: {
            IN: {
                box: 'short-arrive-left, fade-in'
            }
        }
    },
    tip_right: {
        STYLE: {
            CLASS: {
                box: 'popscript-tooltip right'
            }
        },
        ANIMATION: {
            IN: {
                box: 'short-arrive-right, fade-in'
            }
        }
    },
    tip_up: {
        STYLE: {
            CLASS: {
                box: 'popscript-tooltip up'
            }
        },
        ANIMATION: {
            IN: {
                box: 'short-arrive-up, fade-in'
            }
        }
    },
    tip_down: {
        STYLE: {
            CLASS: {
                box: 'popscript-tooltip down'
            }
        },
        ANIMATION: {
            IN: {
                box: 'short-arrive-down, fade-in'
            }
        }
    },

    roller: {
        STYLE: {
            CLASS: {
                box: 'roller'
            }
        },
        ANIMATION: {
            IN: {
                box: 'newspaper',
                duration: 800
            }
        },
        POSITION: {
            x: 'auto',
            y: '8%',
            roller: 'yes'
        }
    }
};

var popscript_flags = {
    'alert error on error': false,  // alerts the error (alert)
    'throw error on error': true,   // throws the error (throw)
    'Z': 1000                       // base z-index for all pops
};


/* Do not edit anything below this line */
/***************************************/

// Create a Singleton
var PS = {
    version: 1.0,

    num_pops_created: 0,
    map: {},
    bind_map: {},
    rev_bind_map: {},
    pop_bind_num: 0,

    compiled_popscript: {},

    /*
     Increases the count of pops, and Returns
     the new total pop count.
     @returns {Number}
     */
    increasePop: function () {
        return ++this.num_pops_created;

    },


    escPopOut: function (e) {
        e = e || window.event;
        if (!PS.findAncestorPop(e.srcElement || e.target)) {
            var keycode = e ? e.keyCode : (window.event).keyCode;
            if (keycode === 27) {
                var highest = PS.highestConditionPopId(function (num) {
                    var the_pop = PS.map[num];
                    return the_pop && the_pop.scan('esc');
                });

                if (highest !== -1) {
                    var the_pop = PS.map[highest];
                    popOut(highest, the_pop.scan('out'))
                }
            }
        }
    },
    blurPopOut: function (e) {
        e = e || window.event;
        if (!PS.findAncestorPop(e.srcElement || e.target)) {
            var highest = PS.highestConditionPopId(function (num) {
                var the_pop = PS.map[num];
                return the_pop && the_pop.scan('blur');
            });
            if (highest !== -1) {
                var the_pop = PS.map[highest];
                popOut(highest, the_pop.scan('out'))
            }
        }
    },

    /*
     Returns the highest pop id which satisfies the
     function `condition`. If condition is unspecified then
     return the highest pop id without any condition.
     Returns -1 if no pops exist
     @param `condition` {function}: condition which satisfies the highest pop id
     @return {integer} highest pop id with condition satisfied
     */
    highestConditionPopId: function (condition) {
        if (!condition) {
            condition = function () {
                return true
            }
        }
        var cur_id = PS.num_pops_created;
        var cur_box_node;
        var cur_pop;
        while (cur_id !== 0) {
            cur_box_node = document.getElementById('popscript-box-' + cur_id);
            cur_pop = PS.map[cur_id];
            if (cur_pop && cur_box_node && !cur_pop.compiled.hidden && condition(cur_id)) {
                return cur_id;
            }
            cur_id--;

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

            var animation = false,
                animationstring = 'animation',
                keyframeprefix = '',
                domPrefixes = 'Webkit Moz O ms Khtml'.split(' '),
                pfx  = '';

            if( document.body.style.animationName !== undefined ) { animation = true; }

            if( animation === false ) {
                for( var i = 0; i < domPrefixes.length; i++ ) {
                    if( document.body.style[ domPrefixes[i] + 'AnimationName' ] !== undefined ) {
                        pfx = domPrefixes[ i ];
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
        var body_dims = PS.dims.node(document.getElementsByTagName("html")[0], true);
        return body_dims.h;
        /*return Math.max(
         Math.max(document.body.scrollHeight, document.documentElement.scrollHeight),
         Math.max(document.body.offsetHeight, document.documentElement.offsetHeight),
         Math.max(document.body.clientHeight, document.documentElement.clientHeight)
         );*/
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

        /*
         Convert a CSS animation into an array containing (as 0th element)
         each CSS animation separated by commas, each CSS animation duration
         separated by commas (1st element), and the maximum length (duration * iterations)
         of any of the CSS animations
         as the last element (2nd element)
         @arg `v` {string}
         @ret {array} 3 item array of form [{string},{string},{number}]
         */

        ani: function (v) {
            var flag_bracket_commas = v.replace(/(\([^\)]*\))/g, function (match) {
                return match.replace(/,/g, "@");
            });
            var all_animations = flag_bracket_commas.split(/ *, */);
            var max_length, cur_duration_iterations, cur_duration, cur_iterations, cur_length, durations, global_duration_used;
            durations = "";
            for (var i = 0; i < all_animations.length; i++) {
                cur_duration_iterations = PS.animationDurationIteration(all_animations[i]);

                cur_duration = cur_duration_iterations[0];
                cur_iterations = cur_duration_iterations[1];
                cur_length = cur_duration * cur_iterations;
                if (cur_duration) {
                    durations += (cur_duration + "ms");
                    if (!max_length || cur_length > max_length) {
                        max_length = cur_length;
                    }
                } else { // The user has not given a duration, therefore we'll use the global duration.
                    // Since we are still parsing the popscript, we are unsure of the value of the global duration,
                    // also by creating pops with multiple pop classes we could possibly overwrite the global
                    // duration for a given class.
                    durations += "$g"; // global duration given by a property like ANIMATION > IN/OUT > DURATION
                    global_duration_used = true;
                }
                if (i + 1 !== all_animations.length) {
                    durations += ",";
                }


            }
            var compiled = this[1];
            var prop_name = this[0];
            var ani_match = prop_name.match(/animation_((in)|(out))_/);

            var true_duration_prop, true_duration_val, true_duration_len, true_duration_global;
            true_duration_prop = 'animation_' + ani_match[1] + '_true_duration';
            true_duration_val = compiled[true_duration_prop];
            if (!true_duration_val) {
                true_duration_len = max_length === undefined ? 0 : Math.max(0, max_length);
                // the global prop specifies whether an animation has chosen the global duration
                // knowing this is imperative in finding out the true duration of the animation
                true_duration_global = global_duration_used;
            } else {
                true_duration_len = max_length === undefined ? true_duration_val.len : (Math.max(true_duration_val.len, max_length));
                true_duration_global = true_duration_val.global || global_duration_used;
            }
            compiled[true_duration_prop] = {len: true_duration_len, global: true_duration_global};

            return [flag_bracket_commas.replace(/@/g, ","), durations, max_length]
        },

        _position_macros: {
            left: true,
            top: true,
            right: false,
            bottom: false,
            auto: null
        },
        /*
         Convert the y/x position
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

         if "+scrolled"/"+scroll" (note:ignorant of whitespace) is included
         it sets the '<dim>_scrolled'/'<dim>_scroll' (respectively) property of the compiled pop
         (sent as context as the 2nd item of the 'this' object)
         to true. where <dim> is either 'x' or 'y' representing the dimension.
         */
        boxPosition: function (v) {
            if (typeof v === 'number') {
                return [Math.abs(v), true, false]
            }
            var tokens = (v.toLowerCase()).split(/ *\+ */);
            var split = [false, false, false];

            //scrolled
            var prop_scrolled = this[0] + '_scrolled';
            var cur_scrolled_dim = this[1][prop_scrolled];
            this[1][prop_scrolled] = cur_scrolled_dim || Boolean(tokens.indexOf('scrolled') !== -1);

            //scroll
            var prop_scroll = this[0] + '_scroll';
            var cur_scroll_dim = this[1][prop_scroll];
            this[1][prop_scroll] = cur_scroll_dim || Boolean(tokens.indexOf('scroll') !== -1);


            split[0] = tokens[0];
            if (['auto', 'left', 'right', 'top', 'bottom'].indexOf(split[0]) === -1) {
                split[2] = split[0][split[0].length - 1] === "%";
                var extracted_number =
                    split[1] ?
                        split[0].match(/(!?) *(\-?[\d]+)%/) :
                        split[0].match(/(!?) *(\-?[\d]+)/);

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

        /* loff -> list of functions
         * The input can either (1) function (2) list of functions
         * Convert (1) to a list of 1 item.
         * Keep (2) as it is.
         */
        loff: function (v) {
            return typeof v === 'function' ? [v] : v;
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
        },

        /*
         * The supplied value `v` must be either "hide" or "close"
         */
        hideOrClose: function (v) {
            if (v !== "close" && v !== "hide") return PS.popError(92, 'Invalid out value (must be either "hide" or "close"): ' + v);
            return v;
        }
    },


    defaults: {
        position_x: ['auto', false, false],
        position_y: ['auto', false, false],
        position_z: function () {
            return popscript_flags.Z
        },
        position_check: [
            [20, 333],
            [1000]
        ],
        positioncheck: null,
        position_fixed: true,

        position_x_scroll: false,
        position_x_scrolled: false,
        position_y_scroll: false,
        position_y_scrolled: false,

        blur: true,
        esc: true,
        out: 'hide',

        cover: true,
        cross: true,
        full_draggable: false,
        position_roller: false,
        cross_content: "x",

        animation_in_duration: 300,
        animation_out_duration: 300,

        afterpopout: [],
        transition_duration: 500
    },

    /*
     scope_converter: {
     'STYLE': 'style',
     'CLASS': 'class',
     'INLINE': 'inline',
     'ANIMATION': 'animation',
     'POSITION': 'position',
     IN: 'in',
     OUT: 'out'
     },
     */


    /*
     * compiles the user inputted popscript into
     * a single level object for each pop class.
     * @param popscript: inputted popscript
     */
    compile: function (popscript) {
        // store the compiled popscript in PS.compiled_popscript object
        for (var pop_class in popscript) {
            if (popscript.hasOwnProperty(pop_class)) {
                var orig_class_compiled,new_class_compiled;
                if (!PS.compiled_popscript[pop_class])
                    PS.compiled_popscript[pop_class] = {};
                new_class_compiled = this.compilePopClass(popscript[pop_class]);
                for (var compiled_prop in new_class_compiled) {
                    if (new_class_compiled.hasOwnProperty(compiled_prop)) {
                        PS.compiled_popscript[pop_class][compiled_prop] = new_class_compiled[compiled_prop];
                    }
                }
            }
        }
        //TODO: Free memory of original popscript
    },

    /*
     * compiles the script of a given pop class
     * to a single level object viz. removes all
     * scopes.
     * @param pop_class_script {object}: script of an arbitrary pop class, possible anonymous.
     * @param compiled_pop_class_script {object}: (optional) object specifying already compiled value for the pop class
     * (to be used for anonymous classes)
     * @return {object} single nest level object
     */
    compilePopClass: function (pop_class_script, compiled_pop_class_script) {
        compiled_pop_class_script = compiled_pop_class_script ? compiled_pop_class_script : {};
        for (var key in pop_class_script) {
            if (pop_class_script.hasOwnProperty(key)) {
                // Check if the given key is a standalone property or a scope.
                if (typeof pop_class_script[key] === 'object' && !(pop_class_script[key] instanceof Array)) { // Scope
                    this.compileScope([key], pop_class_script[key], compiled_pop_class_script, pop_class_script)
                }
                else { // Standalone property
                    this.registerPopProperty(
                        compiled_pop_class_script, key, pop_class_script[key]);
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
                    if (typeof scope[scope_property] === 'object') { // Scope
                        this.compileScope(this.helper.cloneAndPushArray(scope_chain, scope_property), scope[scope_property],
                            compiled_pop_classes_script, pop_class_script)
                    } else {
                        this.registerPopProperty(
                            compiled_pop_classes_script, scope_property, scope[scope_property], scope_chain);
                    }
            }
        }

    },


    /*
     * Registers string `property` to the object `dict` the value
     * of `val` in popscript compiled format.
     * (1) Checks if the property is valid (issues a popscript error if it isn't)
     * (2) Converts the property value to its compiled form (PopScript.compile)
     * (3) Checks if the property is of the correct type and format [optional (not optional as yet)regex for strings] (issues a popscript error if it isn't)
     * (4) `property` is lower cased before registration.
     * (5) if `property` is scope based then the scope is broken by
     * eg. if the scope is 'STYLE_CLASS',
     * and the property within is 'cross', then the compiled property would (formerly) be:
     * PopScript.scope_converter['STYLE_CLASS'] + '_' + 'close' (currently its the uppercase of the value)
     * => 'class_cross'
     * >>> the below rule (6) has not been implemented in the current version of popscript ) <<<
     * (6) if a `property`
     * is mentioned at both scope and non-scope level, the non-scope level
     * property is given higher specificity. ex: `animation_in_box` would have a higher specificity
     * than `box` mentioned within the `ANIMATION` scope.
     * @param `compiled` (object) the compiled dict
     * @param `property` (string) the pop property which could be incomplete without the `scope_chain`
     * @param `val` (string/number/boolean) the value assigned to the pop property
     * //@param `pop_class_dict` (object) user inputted popscript object for the pop class in context (needed for rule 6 which hasn't been implemeneted yet)
     * @param [`scope_chain`] (Array) optional for non-scope properties
     */
    registerPopProperty: function (compiled, property, val, scope_chain) {
        // The property mentioned within a scope needs to be converted into
        // its compiled name before registering the pop property.
        // This step is step which
        // breaks the double level of nesting created by internal scopes.
        // Read the doc given above for more details.


        var compiled_property_name = scope_chain ? (this.compiledScopeName(scope_chain) + property.toLowerCase()) : property.toLowerCase();


        // Rule 6 has not been implemented a yet
        /*
         // Check if the specificity of the property (rule 6 in doc)
         //TODO: check for scopes between the current and the standalone scope
         if (scope_chain && this.hasStandaloneProperty(pop_class_dict, compiled_property_name)) {
         return null;
         }
         */

        if (this.all_properties[compiled_property_name]) {
            // Finally register the given property-value, before which
            // convert the value to its compiled form
            // Send as context (this) an array where the
            // 0th item is the name of the compiled property
            // 1st item is the compiled dict of the pop so far
            compiled[compiled_property_name] = PS.all_properties[compiled_property_name].call([compiled_property_name, compiled], val);
        } else {
            this.popError(29, ('Unknown pop property name: "' + property + '"') +
                (!scope_chain ? "" : ' within scope: ' + scope_chain.join('>')));
        }


    },
    /*
     Returns the compiled scope name of the
     scopes given in the Array `scopes`, according
     to the following rule:
     Each scope name is converted to its compiled
     scope name (formerly using this.scope_converter, currently its the lowercase of the input)
     then adding an '_' (underscore) after each of the
     child scopes.
     e.g: ['ANIMATION', 'IN'] becomes:
     => 'animation_in_'
     @returns (String)
     */
    compiledScopeName: function (scopes) {
        var s = "";
        for (var i = 0; i < scopes.length; i++) {
            s += scopes[i].toLowerCase() + '_';
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


    /* Return the box node associated with the `pop_id` */
    boxNode: function (pop_id) {
        return document.getElementById('popscript-box-' + pop_id)
    },
    /* Return the cover node associated with the `pop_id` */
    coverNode: function (pop_id) {
        return document.getElementById('popscript-cover-' + pop_id)
    },
    /* Return the roller node associated with the `pop_id` */
    rollerNode: function (pop_id) {
        return document.getElementById('popscript-roller-' + pop_id)
    },
    /* Return the cross node associated with the `pop_id` */
    crossNode: function (pop_id) {
        return document.getElementById('popscript-cross-' + pop_id)
    },

    drag: {

        box_node: null,
        pop_id: -1,
        roller_node: null,
        pop_position_fixed: null,
        diff: [],
        /*
         Event Binding for mousedown on drag begin.
         */
        start: function (e) {


            PS.drag.no_user_select();

            var ancestor_pop = PS.findAncestorPop(this);

            if (ancestor_pop) {
                PS.event.add(document, 'mousemove', PS.drag.during);
                PS.drag.box_node = ancestor_pop;
                PS.drag.pop_id = parseInt(ancestor_pop.getAttribute('data-pop-id'));
                PS.drag.roller_node = document.getElementById('popscript-roller-' + PS.drag.pop_id);
                PS.drag.pop_position_roller = PS.map[PS.drag.pop_id].scan('position_roller');
                PS.drag.pop_position_fixed = PS.map[PS.drag.pop_id].scan('position_fixed') && !PS.drag.pop_position_roller;


                var mp = PS.pos.mouse(e ?
                    e : window.event, PS.drag.pop_position_roller ? PS.drag.roller_node : undefined);


                var scrolled_fix = {x: 0, y: 0};
                if (PS.drag.pop_position_fixed) {
                    scrolled_fix = PS.pos.scrolled();
                }

                PS.drag.diff[0] = mp[0] - scrolled_fix.x - (PS.pos.offset(ancestor_pop, PS.drag.roller_node).left);
                PS.drag.diff[1] = mp[1] - scrolled_fix.y - (PS.pos.offset(ancestor_pop, PS.drag.roller_node).top);

            }

        },

        /*
         Event Binding for mousemove on dragging.
         */
        during: function (e) {

            if (!PS.drag.box_node) {
                return null;
            }

            var mp = PS.pos.mouse(e ?
                e : window.event, PS.drag.pop_position_roller ? PS.drag.roller_node : undefined);


            var scrolled_fix = {x: 0, y: 0};
            if (PS.drag.pop_position_fixed) {
                scrolled_fix = PS.pos.scrolled();

            }


            var x = mp[0] - scrolled_fix.x - PS.drag.diff[0];
            var y = mp[1] - scrolled_fix.y - PS.drag.diff[1];
            PS.drag.box_node.style.left = (x) + "px";
            PS.drag.box_node.style.top = (y) + "px";


            // Update the pop to store the information that it has been moved
            PS.map[PS.drag.pop_id].compiled.moved = true
        },
        /*
         Event Binding for mouseup on drag end.
         */
        done: function () {
            PS.event.remove(document, 'mousemove', PS.drag.during);
            PS.drag.no_no_user_select();
            PS.drag.box_node = null;
            PS.drag.pop_id = -1;
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
     * Returns the ancestor of the DOM node element `n`
     * which contains it (node `n`), it can also be
     * node `n` itself.
     * @param {Node} `n`
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
         * Returns the offset of the element `el`,
         * relative to element `rel`. `rel` is optional,
         * if left out, assume `rel` to be the window.
         * in an object with keys 'top' and 'left'
         * @param `el` {DOM Node Element}
         * @param `rel` {DOM Node Element}
         * @returns {object}
         */
        offset: function (el, rel) {
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

                } while ((el = el.offsetParent) && el !== rel);
            }
            return {left: cur_left, top: cur_top};

        },
        /*
         * Returns the mouse position relative to element `obj`.
         * If `obj` is mentioned assume that `obj` is window
         */
        mouse: function (e, obj) {
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
            // special thanks: http://stackoverflow.com/questions/3234256/find-mouse-position-relative-to-element
            if (obj && obj !== window) {
                var offset = PS.pos.offset(obj);
                var scrolled = PS.pos.scrolled();

                return [(posx - offset.left) + scrolled.x, (posy - offset.top) + scrolled.y];
            }

            return [posx, posy];

        },
        /*
         Returns an object containing
         information of the magnitude of
         x (key 'x') and y (key 'y')
         scrolled in the the element `obj`.
         If `obj` is not mentioned then assume `obj` is the window;
         @param `obj` {element}
         @returns {object} containing two keys (both values are numbers)
         */
        scrolled: function (obj) {

            if (!obj || obj === window) {
                return {y: Math.max(window.scrollY,
                    document.documentElement.scrollTop,
                    document.body.scrollTop),
                    x: Math.max(window.scrollX,
                        document.documentElement.scrollLeft,
                        document.body.scrollLeft)};
            }
            return {y: obj.scrollTop, x: obj.scrollLeft}

        },
        check: function (pop_id, arg2, arg3, arg4) {
            var dim, box_node, cover_node, roller_node;
            if (!arg2) {
                box_node = PS.boxNode(pop_id);
                cover_node = PS.coverNode(pop_id);
                roller_node = PS.rollerNode(pop_id);
                dim = PS.dims.node(box_node, true);
            } else {
                box_node = arg2;
                cover_node = arg3;
                roller_node = arg4;
                dim = PS.dims.node(arg2.cloneNode(true));
            }
            if (!dim) return;

            var the_pop = PS.map[pop_id];
            if (the_pop.scan('moved') || the_pop.scan('hidden')) return false;

            var window_dim = PS.dims.window();
            var scrolled = PS.pos.scrolled();

            if (the_pop.scan('cover')) {
                cover_node.style.height = PS.getDocHeight() + "px";
            }
            if (the_pop.scan('position_roller')) {
                roller_node.style.height = PS.getDocHeight() + "px";
                roller_node.style.maxHeight = PS.dims.window().height + "px";
                roller_node.style.top = scrolled.y + "px";
                roller_node.style.left = scrolled.x + "px";
            }

            // pop_y/x components
            // (0) value (number)
            // (1) left/top position or right/bottom
            // (2) percent based (boolean)

            var pop_y, pop_x, position_fixed, position_roller, cover, final_scroll_x, final_scroll_y;

            cover = the_pop.scan('cover');
            position_roller = the_pop.scan('position_roller');

            if (the_pop.scan('nearelement')) {
                var ele, cb;
                ele = the_pop.scan('nearelement')[0];
                cb = the_pop.scan('nearelement')[1];
                var pop_xy = PS.nearElement(ele, cb, dim);
                the_pop.compiled.position_fixed = PS.pos.isFixed(ele);
                pop_x = PS.convert.boxPosition.call(['position_x_scrolled', the_pop.compiled], pop_xy[0]);
                pop_y = PS.convert.boxPosition.call(['position_y_scrolled', the_pop.compiled], pop_xy[1]);
            } else {
                pop_x = the_pop.scan('position_x');
                pop_y = the_pop.scan('position_y');
            }

            position_fixed = the_pop.scan('position_fixed');

            box_node.style.position = (!position_roller && position_fixed) ? 'fixed' : 'absolute';

            // if its one of the following:
            // (1) fixed pop
            // [deleted] (2) roller pop (this req has been officially removed)
            // then do not take scrolled into account
            // since scrolled can be taken into account only once store the current value of scrolled
            // so as to provide the value for the repositioning

            the_pop.scrolled_y = the_pop.scrolled_y !== undefined ? the_pop.scrolled_y : (!position_roller && the_pop.scan('position_y_scrolled') ? scrolled.y : 0);
            the_pop.scrolled_x = the_pop.scrolled_x !== undefined ? the_pop.scrolled_x : (!position_roller && the_pop.scan('position_x_scrolled') ? scrolled.x : 0);

            final_scroll_y = the_pop.scrolled_y + (!position_roller && the_pop.scan('position_y_scroll') ? scrolled.y : 0);
            final_scroll_x = the_pop.scrolled_x + (!position_roller && the_pop.scan('position_x_scroll') ? scrolled.x : 0);


            // Reset the positions
            box_node.style.top = "auto";
            box_node.style.right = "auto";
            box_node.style.bottom = "auto";
            box_node.style.left = "auto";

            var left_offset = window_dim.width - dim.w + final_scroll_x;
            var top_offset = window_dim.height - dim.h + final_scroll_y;

            if (pop_y[0] !== 'auto') {
                // check if its a left/(top) position pop
                if (pop_y[1]) {
                    box_node.style.top = PS.dims.auto(pop_y[0], window_dim.height, dim.h, final_scroll_y, pop_y[2]) + "px";
                } else {
                    box_node.style.top = (top_offset - PS.dims.auto(pop_y[0], window_dim.height, dim.h, -final_scroll_y, pop_y[2])) + "px";
                }
            } else {
                box_node.style.top = PS.dims.auto(pop_y[0], window_dim.height, dim.h, final_scroll_y, pop_y[2]) + "px";
            }

            if (pop_x[0] !== 'auto') {
                // check if its a (left)/top position pop
                if (pop_x[1]) {
                    box_node.style.left = PS.dims.auto(pop_x[0], window_dim.width, dim.w, final_scroll_x, pop_x[2]) + "px";
                } else {
                    box_node.style.left = (left_offset - PS.dims.auto(pop_x[0], window_dim.width, dim.w, -final_scroll_x, pop_x[2])) + "px";
                }

            } else {
                box_node.style.left = PS.dims.auto(pop_x[0], window_dim.width, dim.w, final_scroll_x, pop_x[2]) + "px";
            }

        }, isFixed: function (ele) {

            return ((ele.style && ele.style.position === 'fixed') || (!(ele.style && ele.style.position) && ele.tagName &&
                window.getComputedStyle(ele, null) &&
                window.getComputedStyle(ele, null).getPropertyValue('position') === 'fixed')) ||
                (ele.parentNode && PS.pos.isFixed(ele.parentNode));
        },

        checkAll: function () {
            for (var i in PS.map) {
                if (PS.map.hasOwnProperty(i)) {
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
            if (!node) return;
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
        },

        /*
         Create, style, and return a node according to cover dimensions.
         This has the use cases of:
         (1) cover
         (2) roller
         @returns {node}
         */
        cover: function () {
            var cover_type_node = document.createElement('div');
            cover_type_node.style.position = 'absolute';
            cover_type_node.style.overflow = 'auto';
            cover_type_node.style.width = '100%';
            cover_type_node.style.top = '0';
            cover_type_node.style.left = '0';
            cover_type_node.style.right = '0';
            return cover_type_node;
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
        return false;
    },


    animateIn: function (pop, box_node, cover_node) {
        var animation_in_duration = pop.scan('animation_in_duration');
        if (pop.scan('cover')) {
            var cover_animation_in = pop.scan('animation_in_cover');
            if (cover_animation_in)
                PS.addAnimation(cover_node, cover_animation_in, animation_in_duration);
        }
        var box_animation_in = pop.scan('animation_in_box');
        if (box_animation_in)
            PS.addAnimation(box_node, box_animation_in, animation_in_duration);

    },


    animateOut: function (global_duration, todo, pop, out_type) {

        for (var key in todo) {
            if (todo.hasOwnProperty(key)) {
                var value = todo[key];
                if (value) {
                    var key_node = document.getElementById(key);
                    this.addAnimation(key_node, value, global_duration, out_type);
                }
            }
        }

    },


    /*
     Return an array with the 0th item length of the (single) animation (in ms)
     and the 1st item the number of iterations in the (single) animation, if
     no iterations are mentioned, or 'infinity' iterations are mentioned the
     value should be 1.
     mentioned in the string `value`.
     If not found return undefined.
     @arg `value` {string}
     @ret {number}
     */
    animationDurationIteration: function (value) {
        var m_duration = value.match(/(.?\d+)(m?s)/);
        var m_iterations = value.match(/ +(\d+) +/);
        return [m_duration ? (m_duration[2] === 's' ? parseFloat(m_duration[1]) * 1000 : parseFloat(m_duration[1])) : undefined,
            (m_iterations ? parseInt(m_iterations[1]) : 1)];

    },

    /*
     * Adds animation to the given node.
     * After the maximum duration if the `out_type`
     * is mentioned then perform one of the either depending
     * on the value of `out_type`
     * (1) "close" In this case remove the node from DOM
     * (2) "hide" In this case apply a display none to the node's CSS
     * following the above 2 also call the respective afterPopOut callback
     * supplying the out_type to it.
     */
    addAnimation: function (node, value, global_duration, out_type) {


        var end_of_node_out = function () {
            if (out_type) {
                if (node.parentNode.className === 'popscript-roller') {
                    if (out_type === "close")
                        node.parentNode.parentNode.removeChild(node.parentNode);
                    else
                        PS.css_class.add(node.parentNode, 'popscript-display-none');
                }
                else {
                    if (out_type === "close")
                        node.parentNode.removeChild(node);
                    else
                        PS.css_class.add(node, 'popscript-display-none');
                }
            }

        };
        if (PS.animationPossible()) {
            // `animations` contains the value for the CSS property `animation`
            // `durations` contains the value for the CSS property `animation-duration`
            // `ani_max_duration` contains the value for the maximum animation duration found in `animation`
            // `max_duration` contains the value for `uni_max_duration` if defined else the value of `global_duration`
            var animations, ani_max_duration, max_duration, durations;

            animations = value[0];
            durations = value[1];

            // Check function PS.convert.ani for more details on this step
            durations = durations.replace(/\$g/g, global_duration + "ms");

            node.style.animation = animations;
            node.style.webkitAnimation = animations;

            node.style.animationDuration = durations;
            node.style.webkitAnimationDuration = durations;

            if (out_type) {
                ani_max_duration = value[2];
                max_duration = (ani_max_duration === undefined ? global_duration : ani_max_duration);

                setTimeout(end_of_node_out, max_duration);

            }
        } else {
            end_of_node_out();
        }

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
         Return a new array which is slice of
         Array `list` from start index `s`
         to end index (non-inclusive) `e`.
         @param `list` Array
         @param `s` Number
         @param `e` Number
         */
        sliceArray: function (list, s, e) {
            var sliced_array = [];
            for (; s < e; s++)
                sliced_array.push(list[s]);
            return sliced_array;
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
        },

        event: function (e) {
            if (this === (e.srcElement || e.target)) {
                var ancestor_pop = PS.findAncestorPop(this);
                if (ancestor_pop) {
                    return (parseInt(ancestor_pop.getAttribute('data-pop-id')));
                }
            }
        },

        changeTransition: function (pop, pop_id, transition_duration) {

            var transition = typeof transition_duration === 'number';   // Transition is off if given a value of 0
            var box_node = PS.boxNode(pop_id);
            var cover_node = PS.coverNode(pop_id);
            if (transition) {
                box_node.style.animation = "";
                box_node.style.webkitAnimation = "";
                cover_node.style.animation = "";
                cover_node.style.webkitAnimation = "";

                var box_orig_transition_normal = box_node.style.transition;
                var box_orig_transition_webkit = box_node.style.webkitTransition;

                var cover_orig_transition_normal = cover_node.style.transition;
                var cover_orig_transition_webkit = cover_node.style.webkitTransition;

                box_node.style.transition = transition_duration + 'ms all';
                box_node.style.webkitTransition = transition_duration + 'ms all';
                cover_node.style.transition = transition_duration + 'ms all';
                cover_node.style.webkitTransition = transition_duration + 'ms all';
                setTimeout(function () {
                    box_node.style.transition = box_orig_transition_normal;
                    box_node.style.webkitTransition = box_orig_transition_webkit;
                    cover_node.style.transition = cover_orig_transition_normal;
                    cover_node.style.webkitTransition = cover_orig_transition_webkit;
                }, transition_duration + 100);
            }

            PS.constructPop(pop, box_node,
                cover_node,
                PS.rollerNode(pop_id),
                PS.crossNode(pop_id), transition)
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

    /*
     * Returns the total number of non-hidden pops with roller positions.
     */
    numRollersLeft: function () {
        var the_pop;
        var count = 0;
        for (var pop_id in PS.map) {
            if (PS.map.hasOwnProperty(pop_id)) {
                the_pop = PS.map[pop_id];
                if (!the_pop.scan('hidden') && the_pop.scan('position_roller')) {
                    count++;
                }
            }
        }
        return count;
    },

    nearElement: function (node, cb, pop_dims) {
        var offset = PS.pos.offset(node);
        var dims = PS.dims.node(node, true);

        return cb(offset.left, offset.top, dims.w, dims.h, pop_dims.w, pop_dims.h);
    },


    /*
     Initiates a pop by supplying it a position in PS.map
     with a unique pop id `pop_id`, and components including:
     (1) box (will contain `content`)
     (2) cover
     (3) roller
     (4) cross
     @return {array} [box_node,cover_node,roller_node,cross_node]
     */
    initiatePop: function (content, pop_id) {
        var box_node, cover_node, roller_node, cross_node;

        box_node = document.createElement('div');
        box_node.setAttribute('data-pop-id', pop_id.toString());
        PS.css_class.add(box_node, 'popscript-display-none');
        box_node.id = 'popscript-box-' + pop_id;

        content = typeof content === 'function' ? content(pop_id) : content;
        var content_type = typeof content;
        if (['string', 'number'].indexOf(content_type) !== -1) {
            box_node.innerHTML = content;
        } else {
            box_node.appendChild(content);
        }
        document.body.appendChild(box_node);


        // Initiation of cross_node
        cross_node = document.createElement('span');
        PS.css_class.add(cross_node, 'popscript-display-none');
        cross_node.id = 'popscript-cross-' + pop_id;
        box_node.appendChild(cross_node);


        // Initiation of cover_node
        cover_node = PS.dims.cover();
        PS.css_class.add(cover_node, 'popscript-display-none');
        cover_node.id = 'popscript-cover-' + pop_id;
        document.body.appendChild(cover_node);

        // Initiation of roller_node
        roller_node = PS.dims.cover();
        PS.css_class.add(roller_node, 'popscript-display-none');
        roller_node.id = "popscript-roller-" + pop_id;
        document.body.appendChild(roller_node);

        return [ box_node, cover_node, roller_node, cross_node];
    },

    constructPop: function (pop, box_node, cover_node, roller_node, cross_node, transition) {

        box_node.cssText = '';
        cover_node.cssText = '';
        roller_node.cssText = '';
        cross_node.cssText = '';

        var pop_id = pop.pop_id;

        if (!transition)
            PS.animateIn(pop, box_node, cover_node);

        if (pop.scan('cover')) {
            cover_node.className = 'popscript-cover ' + pop.scan('style_class_cover');
            if (pop.scan('style_inline_cover'))
                cover_node.style.cssText += pop.scan('style_inline_cover');

            cover_node.style.zIndex = pop.scan('position_z')();
            PS.css_class.remove(cover_node, 'popscript-display-none');
        } else {
            PS.css_class.add(cover_node, 'popscript-display-none');
        }

        // Cross
        cross_node.innerHTML = "";
        if (pop.scan('cross')) {
            cross_node.className = 'popscript-cross  popscript-out ' + pop.scan('style_class_cross');
            if (pop.scan('style_inline_cross'))
                cross_node.style.cssText += pop.scan('style_inline_cross');

            cross_node.appendChild(document.createTextNode(pop.scan('cross_content')));
            cross_node.style.display = 'inline';
        } else {
            PS.css_class.add(cross_node, 'popscript-display-none');
        }

        // Box
        PS.css_class.remove(box_node, 'popscript-display-none');
        box_node.className = 'popscript-box ' + pop.scan('style_class_box');
        box_node.style.zIndex = pop.scan('position_z')();

        if (pop.scan('style_inline_box'))
            box_node.style.cssText += pop.scan('style_inline_box');

        // Clean up the drag events directly associated with the box node.
        // (Done due to popscript property conflicts with previous pop classes)
        PS.css_class.remove(box_node, 'popscript-drag');
        PS.event.remove(box_node, 'mousedown', PS.drag.start);
        PS.event.remove(box_node, 'mouseup', PS.drag.done);

        if (pop.scan('full_draggable'))
            PS.css_class.add(box_node, 'popscript-drag');

        // Clean up the hide/close events directly associated with the box node.
        // (Done due to popscript property conflicts with previous pop classes)
        PS.css_class.remove(box_node, 'popscript-close');
        PS.css_class.remove(box_node, 'popscript-hide');
        PS.event.remove(box_node, 'click', popClose);
        PS.event.remove(box_node, 'click', popHide);

        if (pop.scan('click_me_out'))
            PS.css_class.add(box_node, 'popscript-' + pop.scan('out'));

        box_node.parentNode.removeChild(box_node);
        if (pop.scan('position_roller')) {
            roller_node.className = 'popscript-roller';
            roller_node.style.zIndex = pop.scan('position_z')();
            roller_node.innerHTML = '';
            roller_node.appendChild(box_node);
            PS.cover_fix.fix();
            PS.css_class.remove(roller_node, 'popscript-display-none');
        } else {
            PS.css_class.add(roller_node, 'popscript-display-none');
            document.body.appendChild(box_node);
        }


        // Check if the user has added any popscript-drag elements to the pop.
        var all_move = PS.css_class.nodes('popscript-drag', box_node);
        for (i = 0; i < all_move.length; i++) {
            PS.event.add(all_move[i], 'mousedown', PS.drag.start);
            PS.event.add(all_move[i], 'mouseup', PS.drag.done);
        }

        // Check if the user has added any popscript-close elements to the pop.
        var all_close = PS.css_class.nodes('popscript-close', box_node);
        for (i = 0; i < all_close.length; i++) {
            PS.event.add(all_close[i], 'click', popClose);
        }

        // Check if the user has added any popscript-out elements to the pop.
        var all_out = PS.css_class.nodes('popscript-out', box_node);
        for (i = 0; i < all_out.length; i++) {
            PS.event.add(all_out[i], 'click', popOut);
        }


        // Check if the user has added any popscript-hide elements to the pop.
        var all_hide = PS.css_class.nodes('popscript-hide', box_node);
        for (i = 0; i < all_hide.length; i++) {
            PS.event.add(all_hide[i], 'click', popHide);
        }

        var align_checks = pop.scan('position_check');
        if (pop.compiled.timeouts) {
            for (var i = 0; i < pop.compiled.timeouts.length; i++) {
                clearTimeout(pop.compiled.timeouts[i]);
            }
        }
        if (pop.compiled.intervals) {
            for (var i = 0; i < pop.compiled.intervals.length; i++) {
                clearTimeout(pop.compiled.intervals[i]);
            }
        }
        pop.compiled.timeouts = [];
        pop.compiled.intervals = [];

        if (align_checks) {
            var timeouts = align_checks[0];
            for (var i = 0; i < timeouts.length; i++) {
                pop.compiled.timeouts.push(setTimeout(function () {
                    PS.pos.check(pop_id)
                }, timeouts[i]));
            }
            var intervals = align_checks[1];
            for (i = 0; i < intervals.length; i++) {
                pop.compiled.intervals.push(setInterval(function () {
                    PS.pos.check(pop_id)
                }, intervals[i]));
            }

        }

        PS.blurNoPropagate(pop);
        PS.pos.check(pop_id, box_node, cover_node, roller_node);
    },

    /*
     * Set the pop's blur property to false, and
     * then return it to its original value after 500ms.
     * This is done in order to prevent clicking of an external
     * node to deploy the pop to cause the blur property of the po
     * to dispatch it immediately.
     */
    blurNoPropagate: function (pop) {
        var orig_blur = pop.compiled.blur;
        pop.compiled.blur = false;
        setTimeout(function () {
            pop.compiled.blur = orig_blur
        }, 500);
    },


    binder_wait: function (e) {
        e = e || window.event;
        var pop_bind_id = parseInt(this.getAttribute('data-pop-bind-id'));
        var pop_id = PS.bind_map[pop_bind_id].ev2pn[e.type];
        var params = PS.bind_map[pop_bind_id][pop_id];
        for (var i = 0; i < params.in_events.length; i++) {
            PS.event.remove(this, params.in_events[i], PS.binder_wait);
        }
        pop([this, params.in_events, params.out_events, pop_id], params.content, params.pop_class, params.inline_popscript)
    },

    binder_done: function (e) {
        e = e || window.event;
        var pop_bind_id = parseInt(this.getAttribute('data-pop-bind-id'));
        var pop_id = PS.bind_map[pop_bind_id].ev2pn[e.type];
        popClose(pop_id);
    },


    // direct API
    /*
     Returns the number of pops currently in existence
     @return (Number)
     */
    total: function () {
        return PS.css_class.nodes('popscript-box').length;
    },


    /*
     * Return true if a pop with pop id `pop_id` exists,
     * else returns false.
     * @arg `pop_id` {number}
     */
    exists: function (pop_id) {
        return PS.map[pop_id] !== undefined;
    },
    /*
     * Return true if a pop with pop id `pop_id` is hidden,
     * false if its shown. In the case of the pop not present
     * it will return undefined.
     * @arg `pop_id` {number}
     */
    hidden: function (pop_id) {
        var the_pop = PS.map[pop_id];
        if (!the_pop) return undefined;
        return the_pop.scan('hidden');
    },
    hasClass: function (pop_id, class_name) {
        var el = PS.map[pop_id];
        return el && el.pop_class.split(/ +/).indexOf(class_name) !== -1;
    },
    changeClass: function (pop_id, pop_class_input, transition_duration) {
        // 'basic' is an essential pop class in any pop
        pop_class_input = "basic " + pop_class_input;
        var the_pop = PS.map[pop_id];
        if (!pop)
            return PS.popError(4, "Unknown Pop with pop id " + pop_id);

        the_pop.changeClass(pop_class_input);
        PS.helper.changeTransition(the_pop, pop_id, transition_duration);

    },


    changeProperty: function (pop_id, prop, val, transition_duration) {
        var the_pop = PS.map[pop_id];
        if (!pop)
            return PS.popError(4, "Unknown Pop with pop id " + pop_id);
        the_pop.changeProperty(prop, val);
        PS.helper.changeTransition(the_pop, pop_id, transition_duration);
    },

    inline: function (pop_id, inline_popscript, transition_duration) {
        var the_pop = PS.map[pop_id];
        if (!pop)
            return PS.popError(4, "Unknown Pop with pop id " + pop_id);
        the_pop.inline(inline_popscript);
        PS.helper.changeTransition(the_pop, pop_id, transition_duration);
    }




};


function Pop(pop_class, inline_popscript) {
    this.changeClass(pop_class);
    this.inline_popscript = {};
    this.inline(inline_popscript);
}

/*
 * Changes the pop class (inclusive of 'basic' class)
 * and compiles.
 */
Pop.prototype.changeClass = function (pop_class) {
    this.pop_class = pop_class;
    this.pop_class_list = PS.checkValidPopClasses(this.pop_class);
    this.compileClasses();
};
/*
 * Adds inline popscript, and combines it along with
 * the existing compilation.
 */
Pop.prototype.inline = function (inline_popscript) {
    if (inline_popscript) {
        PS.compilePopClass(inline_popscript, this.compiled);
        // Update the extra popscript with the newly arrived extra popscript
        for (var k in inline_popscript) {
            if (inline_popscript.hasOwnProperty(k)) {
                this.inline_popscript[k] = inline_popscript[k];
            }
        }
    }
};

/*
 Returns true if the pop input is valid, false otherwise.
 */
Pop.prototype.isValid = function () {
    return this.pop_class_list;
};


/*
 Sets the compiled value of property `prop`
 to the value `val`. It converts the `val` to
 its compiled form given the type of property
 `prop` is.
 `prop` may me given as an array of n-1 scopes
 and the last item being the sub property. In this
 case it convert the scope chain to a string property name
 in order to set the property. (eg: ['ANIMATION', 'IN', 'box] -> 'animation_in_box')
 @param `prop` (String/Array)
 @param `val` (any type)
 */
Pop.prototype.changeProperty = function (prop, val) {
    var scope_chain = prop instanceof Array ? PS.helper.sliceArray(prop, 0, prop.length - 1) : [];
    prop = prop instanceof Array ? prop[prop.length - 1] : prop;
    PS.registerPopProperty(this.compiled, prop, val, scope_chain);
};


/*
 Compiles and returns the Pop with the pop classes (given in order) in the
 array `this.pop_class_list`.
 @returns {object} compiled pop
 */
Pop.prototype.compileClasses = function () {
    this.compiled = {}; //obliterate the present compilation
    var cur_attrs, cur_attr;
    // Iterate 1 extra time if there is any extra popscript
    for (var i = 0; i < this.pop_class_list.length; i++) {
        cur_attrs = PS.compiled_popscript[this.pop_class_list[i]];
        for (cur_attr in cur_attrs) {
            if (cur_attrs.hasOwnProperty(cur_attr)) {
                this.compiled[cur_attr] = cur_attrs[cur_attr];
            }
        }
    }

};


/*
 Returns the value of the PopScript
 property `prop`.
 @param `prop` (String)
 @returns (Any Type)
 */
Pop.prototype.scan = function (prop) {
    prop = prop.toLowerCase();
    if (this.compiled[prop] === undefined)
        return PS.defaults[prop];
    return this.compiled[prop];
};


/*
 Creates a pop based on the pop class mentioned
 in the string `pop_input` with the content of
 `content` (`pop_input` is non-inclusive of 'basic'
 class) with an optional `inline_popscript` and an optional
 `binder` as the 1st argument
 */
function pop(arg1, arg2, arg3, arg4) {

    var content, binder, pop_class, inline_popscript, pop_id, box_node, cover_node, roller_node, cross_node, init;

    if (arg1 instanceof Array) {
        binder = arg1;
        content = arg2;
    } else {
        content = arg1;
    }
    var carg; // Just continuing the awesome tradition of weird variable names when it comes to arg (its current arg)
    //SKIP the first 2 arguments [represents: binder, content] if binder is present,
    // else skip the first argument [represents: content]
    for (var i = 1 + Number(Boolean(binder)); i < arguments.length; i++) {
        carg = arguments[i];
        if (typeof carg === 'string') {
            pop_class = carg;
        } else if (typeof carg === 'object') {
            inline_popscript = carg;
        }
    }

    // 'basic' is an essential pop class in any pop
    // If no pop class was defined then the pop class
    // will just be "basic"
    pop_class = pop_class ? "basic " + pop_class : "basic";

    // Instantiate a new pop with the given pop_input
    var the_pop, in_events, out_events, binder_mature;


    binder_mature = false;
    if (binder) {
        var el = binder[0];
        // the binder events can either be an array of events or a single event directly represented as a string
        // eg: ["click", "mouseover"] for an array (multiple events)
        // eg: "click" for string (single event)
        in_events = binder[1] instanceof Array ? binder[1] : [binder[1]];
        out_events = binder[2] instanceof Array ? binder[2] : (binder[2] === undefined ? [] : [binder[2]]);
        binder_mature = binder[3];
    }

    if (!binder || !binder_mature) {
        pop_id = PS.increasePop();
        the_pop = new Pop(pop_class, inline_popscript);
        the_pop.pop_id = pop_id;
        the_pop.binder = Boolean(binder);
        // Add the to be created pop to the object reference of pops,
        // for further look ups and manipulations.
        PS.map[pop_id] = the_pop;
    }

    if (binder) {
        if (!binder_mature) {
            var in_event, out_event;
            var pop_bind_id;
            if (el.getAttribute('data-pop-bind-id') === null) {
                pop_bind_id = ++PS.pop_bind_num;
                el.setAttribute('data-pop-bind-id', String(pop_bind_id));
                PS.bind_map[pop_bind_id] = {};
                // ev2pn: mapping of event type to pop id
                PS.bind_map[pop_bind_id].ev2pn = {};
            } else {
                pop_bind_id = parseInt(el.getAttribute('data-pop-bind-id'));
            }
            PS.rev_bind_map[pop_id] = pop_bind_id;


            PS.bind_map[pop_bind_id][pop_id] =
            {el: el, content: content, pop_class: pop_class, inline_popscript: inline_popscript, in_events: in_events, out_events: out_events};

            for (i = 0; i < in_events.length; i++) {
                in_event = in_events[i];
                PS.bind_map[pop_bind_id].ev2pn[in_event] = pop_id;
                PS.event.add(el, in_event, PS.binder_wait);
            }


        } else {

            pop_id = binder_mature;
            the_pop = PS.map[pop_id];
            if (the_pop.scan('out') === 'hide') {
                var common_event;
                var common_events = [];
                for (i = 0; i < in_events.length; i++) {
                    in_event = in_events[i];
                    if (out_events.indexOf(in_event) !== -1)
                        common_events.push(in_event);
                    else
                        PS.event.add(el, in_event, function () {
                            popShow(pop_id)
                        });
                }
                for (i = 0; i < out_events.length; i++) {
                    out_event = out_events[i];
                    if (in_events.indexOf(out_event) === -1)
                        PS.event.add(el, out_event, function () {
                            popHide(pop_id)
                        });
                }
                for (i = 0; i < common_events.length; i++) {
                    common_event = common_events[i];
                    PS.event.add(el, common_event, function () {
                        popToggle(pop_id)
                    });
                }

            }
            else {
                for (i = 0; i < out_events.length; i++) {
                    out_event = out_events[i];
                    PS.event.add(el, out_event, PS.binder_done);
                }
            }


        }
    }


    if (!binder || binder_mature) {


        init = PS.initiatePop(content, pop_id);
        box_node = init[0];
        cover_node = init[1];
        roller_node = init[2];
        cross_node = init[3];

        if (the_pop.scan('beforePopIn') && the_pop.scan('beforePopIn')(true) === false) {
            return false;
        }

        PS.constructPop(the_pop, box_node, cover_node, roller_node, cross_node);

    }

    // Return the popscript number
    // for tracking purposes
    return pop_id;

}


function popOut(arg1, arg2) {

    var pop_id, out_type, e; // the `e` variable is used if this function is used as a callback event handler
    // Perform arg checks, as the order and number (can be {0,1,2}) of arguments is not fixed
    if (arg1) {
        if (typeof arg1 === 'string') out_type = arg1;
        else if (typeof arg1 === 'number') pop_id = arg1;
        else if (typeof arg1 === 'object') {
            if (this !== window) { // this is an event being handled as this function has been called as a callback to an event
                e = arg1;
                // We search the ancestors to find an ancestor box_node which this
                // pop belongs to. In the exceptional case that this callback was misused, which
                // means that there is no box node belonging to the ancestors of the event on
                // the node on which the event took place (this `this` variable), then pop_id
                // will be undefined. This is no issue as we handle this case few lines below in this
                // function.
                pop_id = PopScript.helper.event.call(this, e);
            }
        }
        else PS.popError(51, 'Invalid argument type: ' + typeof arg1);
    }
    if (arg2) {
        if (typeof arg2 === 'string') out_type = arg2;
        else if (typeof arg2 === 'number') pop_id = arg2;
        else PS.popError(51, 'Invalid argument type: ' + typeof arg2);
    }

    // If no pop id is supplied, then by default we remove the pop which is on the top of the stack
    if (pop_id === undefined) {
        pop_id = PS.highestConditionPopId();
        if (pop_id === -1) return;
    }
    var the_pop = PS.map[pop_id];
    if (!the_pop || the_pop.scan('hidden')) return;
    if (the_pop.destroyed)
        return;
    else if (the_pop.scan('out') === 'close')
        the_pop.destroyed = true;

    // The default out type is that of 'close'
    out_type = (out_type === undefined) ? the_pop.scan('out') : out_type;
    // The value must either be 'hide' or 'close'
    out_type = PS.convert.hideOrClose(out_type);
    if (!out_type) return;

    var box_node, cover_node, roller_node;
    box_node = PS.boxNode(pop_id);
    cover_node = PS.coverNode(pop_id);
    roller_node = PS.rollerNode(pop_id);

    if (the_pop.scan('beforePopOut') && the_pop.scan('beforePopOut').call(box_node, out_type) === false) {
        return false;
    }

    var animate_out_dict = {};
    animate_out_dict[box_node.id] = the_pop.scan('animation_out_box');

    if (cover_node)
        animate_out_dict[cover_node.id] = the_pop.scan('animation_out_cover');
     else
        cover_node.parentNode.removeChild(cover_node);

    var prop_true_duration, global_duration, true_duration;
    global_duration = the_pop.scan('animation_out_duration');
    prop_true_duration = the_pop.scan('animation_out_true_duration');

    true_duration = (prop_true_duration === undefined) ? 0 :
        (prop_true_duration.global ?
            Math.max(global_duration, prop_true_duration.len) :
            prop_true_duration);


    if (the_pop.binder && out_type === 'close') {
        var pop_bind_id = PS.rev_bind_map[pop_id];
        var params = PS.bind_map[pop_bind_id][pop_id];
        for (var i = 0; i < params.out_events.length; i++)
            PS.event.remove(params.el, params.out_events[i], PS.binder_done);
        delete PS.bind_map[pop_bind_id][pop_id];
        pop([params.el, params.in_events, params.out_events], params.content, params.pop_class, params.inline_popscript);
    }
    setTimeout(function () {
        var after_pop_outs = the_pop.scan('afterPopOut');
        for (var i = 0; i < after_pop_outs.length; i++)
            after_pop_outs[i](pop_id, out_type);

        if (out_type === 'close') {
            // Clear the created timeouts and intervals for
            // alignment checks.
            var pop_timeouts = the_pop.scan('timeouts');
            var pop_intervals = the_pop.scan('intervals');

            for (var i = 0; i < pop_timeouts.length; i++) {
                clearInterval(pop_timeouts[i]);
            }

            for (i = 0; i < pop_intervals.length; i++) {
                clearInterval(pop_intervals[i]);
            }
            // if position roller isn't set the roller isn't the parent of box and therefore we remove it separately
            if (!the_pop.scan('position_roller')) roller_node.parentNode.removeChild(roller_node);
            delete PS.map[pop_id];
        } else {
            the_pop.compiled.hidden = true;
            // if position roller isn't set the roller isn't the parent of box and therefore we hide it separately
            if (!the_pop.scan('position_roller')) PS.css_class.add(roller_node, 'popscript-display-none');
        }
    }, true_duration);
    PS.animateOut(global_duration,
        animate_out_dict, the_pop, out_type);

    // Undo the body scrolling hack for enabling position roller if this
    // is the last roller pop.
    if (the_pop.scan('position_roller') && PS.numRollersLeft() === 1) {
        PS.cover_fix.unfix();
    }
    return false;
}

function popClose(arg1) {
    // arg1 is either pop_id or event
    if (typeof arg1 === 'object') {
        popOut.call(this, arg1, 'close'); //arg1 is event
    }
    popOut(arg1, "close");  //arg1 is pop_id
}

function popHide(arg1) {
    // arg1 is either pop_id or event
    if (typeof arg1 === 'object') {
        popOut.call(this, arg1, 'hide'); //arg1 is event
    }
    popOut(arg1, "hide");  //arg1 is pop_id
}

function popShow(pop_id) {
    var the_pop = PS.map[pop_id];
    if (!the_pop || !the_pop.compiled.hidden) return false;
    if (the_pop.scan('beforePopIn') && the_pop.scan('beforePopIn')(false) === false) {
        return false;
    }

    var box_node, cover_node, roller_node;
    box_node = PS.boxNode(pop_id);
    cover_node = PS.coverNode(pop_id);
    roller_node = PS.rollerNode(pop_id);

    PS.animateIn(the_pop, box_node, cover_node);

    PS.css_class.remove(cover_node, 'popscript-display-none');
    if (the_pop.scan('position_roller')) {
        PS.css_class.remove(roller_node, 'popscript-display-none');
        PS.cover_fix.fix();
    } else {
        PS.css_class.remove(box_node, 'popscript-display-none');
    }
    the_pop.compiled.hidden = false;

    PS.blurNoPropagate(the_pop);
    PS.pos.check(pop_id, box_node, cover_node, roller_node);

}

function popToggle(pop_id) {
    var the_pop = PS.map[pop_id];
    if (!the_pop) return false;
    the_pop.compiled.hidden ? popShow(pop_id) : popHide(pop_id);
}


// Add all properties to the singleton PS
// after declaring it so as to have PS.convert
// declared beforehand.
PS.all_properties = {
    animation_in_box: PS.convert.ani,
    animation_in_cover: PS.convert.ani,
    animation_in_duration: PS.convert.n,
    animation_out_box: PS.convert.ani,
    animation_out_cover: PS.convert.ani,
    animation_out_duration: PS.convert.n,


    style_class_box: PS.convert.n,
    style_class_cross: PS.convert.n,
    style_class_cover: PS.convert.n,
    style_inline_box: PS.convert.n,
    style_inline_cross: PS.convert.n,
    style_inline_cover: PS.convert.n,


    position_fixed: PS.convert.bool,
    position_x: PS.convert.boxPosition,
    position_y: PS.convert.boxPosition,
    position_z: PS.convert.z,
    position_x_scrolled: PS.convert.bool,
    position_y_scrolled: PS.convert.bool,
    position_x_scroll: PS.convert.bool,
    position_y_scroll: PS.convert.bool,
    position_check: PS.convert.positionCheck,

    position_roller: PS.convert.bool,
    full_draggable: PS.convert.bool,
    cover: PS.convert.bool,
    esc: PS.convert.bool,
    blur: PS.convert.bool,
    cross: PS.convert.bool,
    click_me_out: PS.convert.bool,
    cross_content: PS.convert.n,

    out: PS.convert.hideOrClose,

    beforepopout: PS.convert.n,
    afterpopout: PS.convert.loff,
    nearelement: PS.convert.n,
    beforepopin: PS.convert.n


};

/*
 Initiates PopScript in the browser environment.
 */
function initiatePopScript() {
    PS.compile(popscript);
    PS.event.add(document, 'keydown', PS.escPopOut);
    PS.event.add(document, 'click', PS.blurPopOut);
    PS.event.add(document, 'contextmenu', PS.blurPopOut);
    PS.event.add(window, 'resize', PS.pos.checkAll);
    PS.event.add(window, 'scroll', PS.pos.checkAll);

}

// thanks: http://stackoverflow.com/a/6829157
if (!Array.indexOf) {
    Array.prototype.indexOf = function (obj) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] == obj) {
                return i;
            }
        }
        return -1;
    }
}

// Create an alias for PS to improve
// readability of calls to methods of
// the object.
// Note internally the variable `PS`
// should always be used over `PopScript`,
// In other words `PopScript` should be unused
var PopScript = PS;

initiatePopScript();
