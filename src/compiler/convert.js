var psError = require('../psError.js');


var position_macros= {
  left: true,
  top: true,
  right: false,
  bottom: false,
  auto: null
};


module.exports = {
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
      psError(45, "'" + v + "'" + ' is not a valid PopScript boolean.');
    } else {
      return v;
    }

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
    cur_duration_iterations = animationDurationIteration(all_animations[i]);

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
  split[2] ?
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
  split[1] = position_macros[split[0]];
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

  var checks_raw_str = str_check.replace(/^(\s*)/, "").replace(/(\s*)$/, "");
  if (checks_raw_str === '') {
    return [[],[]]
  }
  var checks_raw_array =  checks_raw_str.split(/ *, */);
var cur_align_check, timer_num, last_ind;
var non_rep = [], rep = [];
for (var i = 0; i < checks_raw_array.length; i++) {
  cur_align_check = checks_raw_array[i];
  last_ind = cur_align_check.length - 1;
  if (cur_align_check[last_ind] === "*") {
    timer_num = parseInt(cur_align_check.substr(0, last_ind));
    if (isNaN(timer_num)) {
      return psError(23, 'Invalid Position Check Number: ' + cur_align_check);
    }
    rep.push(timer_num);
  } else {
    timer_num = parseInt(cur_align_check);
    if (isNaN(timer_num)) {
      return psError(23, 'Invalid Position Check Number: ' + cur_align_check);
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
          return PS.flags.Z - num
        };
      } else {
        return function () {
          return PS.flags.Z + num
        };
      }
    }
    return function () {
      return num
    };
  }
},

/*
* The supplied value `v` must be either "hide" or "destroy"
*/
hideOrDestroy: function (v) {

  if (v !== "destroy" && v !== "hide") return psError(92, 'Invalid out value (must be either "hide" or "destroy"): ' + v);
    return v;
  }
};



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
function animationDurationIteration (value) {
  var m_duration = value.match(/(.?\d+)(m?s)/);
  var m_iterations = value.match(/ +(\d+) +/);
  return [m_duration ? (m_duration[2] === 's' ? parseFloat(m_duration[1]) * 1000 : parseFloat(m_duration[1])) : undefined,
  (m_iterations ? parseInt(m_iterations[1]) : 1)];

};
