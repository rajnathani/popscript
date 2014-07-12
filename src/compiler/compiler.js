var psError = require('../psError.js');

var other = require('../helper/other.js');

var all_properties = require('./all_properties.js');

exports.compile = compile;
exports.compilePopClass= compilePopClass;
exports.registerPopProperty = registerPopProperty;

if (process && process.env.NODE_ENV === 'unittest') {
  exports.compileScope = compileScope;
}

/*
* compiles the user inputted popscript into
* a single level object for each pop class.
* @param popscript: inputted popscript
*/
function compile(original,popscript) {
    // store the compiled popscript in originally compiled (ie PS.compiled) object
    for (var pop_class in popscript) {
        if (popscript.hasOwnProperty(pop_class)) {
            var orig_class_compiled,new_class_compiled;
            if (!original[pop_class])
                original[pop_class] = {};
                new_class_compiled = compilePopClass(popscript[pop_class]);
                for (var compiled_prop in new_class_compiled) {
                    if (new_class_compiled.hasOwnProperty(compiled_prop)) {
                        original[pop_class][compiled_prop] = new_class_compiled[compiled_prop];
                    }
                }
            }
        }
    }

    /*
    * compiles the script of a given pop class
    * to a single level object viz. removes all
    * scopes.
    * @param pop_class_script {object}: script of an arbitrary pop class, possible anonymous.
    * @param compiled_pop_class_script {object}: (optional) object specifying already compiled value for the pop class
    * (to be used for anonymous classes)
    * @return {object} single nest level object
    */
    function compilePopClass(pop_class_script, compiled_pop_class_script) {
        compiled_pop_class_script = compiled_pop_class_script ? compiled_pop_class_script : {};
        for (var key in pop_class_script) {
            if (pop_class_script.hasOwnProperty(key)) {
                // Check if the given key is a standalone property or a scope.
                if (typeof pop_class_script[key] === 'object' && !(pop_class_script[key] instanceof Array)) { // Scope
                    compileScope([key], pop_class_script[key], compiled_pop_class_script, pop_class_script)
                }
                else { // Standalone property
                    registerPopProperty(
                        compiled_pop_class_script, key, pop_class_script[key]);
                    }
                }
            }
            return compiled_pop_class_script;
        };

        /*
        Compiles the popscript scope `scope_names` (Array) [scopes are present in the order of nesting]
        and registers its properties into
        the `compiled_pop_script` object.
        @param `scope_chain` (Array) : name of the entire scope
        @param `scope` (Object): the scope properties of the current scope.
        @param `compiled_pop_classes_script` (Object): the object in which to register the scope properties.
        @param `pop_class_script` (Object): user inputted popscript for a given class/anonymous class
        */
        function compileScope(scope_chain, scope, compiled_pop_classes_script, pop_class_script) {

            // Check if the scope is given as an object
            if (typeof scope !== 'object') {
                psError(26, "Scope '" + scope_chain.join('>') + "' has to be an object");
                return null
            } else {
                for (var scope_property in scope) {
                    if (scope.hasOwnProperty(scope_property))
                        // Check if the given key is a standalone property or a scope.
                        if (typeof scope[scope_property] === 'object') { // Scope
                            compileScope(other.cloneAndPushArray(scope_chain, scope_property), scope[scope_property],
                            compiled_pop_classes_script, pop_class_script)
                        } else {
                            registerPopProperty(
                                compiled_pop_classes_script, scope_property, scope[scope_property], scope_chain);
                            }
                        }
                    }

                };


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
                * PopScript.scope_converter['STYLE_CLASS'] + '_' + 'destroy' (currently its the uppercase of the value)
                * => 'class_cross'
                * @param `compiled` (object) the compiled dict
                * @param `property` (string) the pop property which could be incomplete without the `scope_chain`
                * @param `val` (string/number/boolean) the value assigned to the pop property
                * //@param `pop_class_dict` (object) user inputted popscript object for the pop class in context (needed for rule 6 which hasn't been implemeneted yet)
                * @param [`scope_chain`] (Array) optional for non-scope properties
                */
                function registerPopProperty(compiled, property, val, scope_chain) {
                    // The property mentioned within a scope needs to be converted into
                    // its compiled name before registering the pop property.
                    // This step is step which
                    // breaks the double level of nesting created by internal scopes.
                    // Read the doc given above for more details.


                    var compiled_property_name = scope_chain ? (compiledScopeName(scope_chain) + property.toLowerCase()) : property.toLowerCase();


                    if (all_properties[compiled_property_name]) {
                        // Finally register the given property-value, before which
                        // convert the value to its compiled form
                        // Send as context (this) an array where the
                        // 0th item is the name of the compiled property
                        // 1st item is the compiled dict of the pop so far
                        compiled[compiled_property_name] = all_properties[compiled_property_name].call([compiled_property_name, compiled], val);
                    } else {
                        psError(29, ('Unknown pop property name: "' + property + '"') +
                        (!scope_chain ? "" : ' within scope: ' + scope_chain.join('>')));
                    }
                };

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
                function  compiledScopeName (scopes) {
                    var s = "";
                    for (var i = 0; i < scopes.length; i++) {
                        s += scopes[i].toLowerCase() + '_';
                    }

                    return s;
                };
