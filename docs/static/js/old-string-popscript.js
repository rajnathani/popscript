_total_pops_created = 0;
_rough_total_pops_atm = 0;
var pop_manifest = {};
pop_manifest.all_properties = ['popup-class', 'cover-class', 'close-pop', 'close-pop-class', 'horizontal', 'vertical',
    'align-check', 'cover', 'cover-animation-in', 'popup-animation-in', 'cover-animation-out', 'popup-animation-out',
    'animation-in-duration', 'animation-out-duration', 'position', 'escape', 'blur'];

function _escapePopOut(e) {
    var keycode = e ? e.keyCode : (window.event).keyCode;
    if (keycode === 27) {
        popOut(_currentHighestPopNum(function () {
            return new Pop(JSON.parse(this.getAttribute('data-pop-cache'))).scan('escape') !== 'no'
        }));
    }

}

function _blurPopOut(e) {

    popOut(_currentHighestPopNum(function () {
        return new Pop(JSON.parse(this.getAttribute('data-pop-cache'))).scan('blur') !== 'no'
    }));
}


// Script
compilePopScript(
    "                                                       \
    basic {                                                 \
        popup-class:  popup-popup;                          \
        cover-class:  popup-cover;                          \
                                                            \
        close-pop: yes;                                     \
        close-pop-class:  popup-close;                      \
                                                            \
        horizontal:  auto;                                  \
        cover-animation-in:  in-backy;                      \
        popup-animation-in:  in-pop;                        \
        animation-in-duration: 410;                         \
                                                            \
        cover-animation-out:  out-backy;                    \
        popup-animation-out:  out-pop;                      \
        animation-out-duration: 410;                        \
                                                            \
        align-check: 10, 20, 30;                            \
        cover: yes                                          \
    }                                                       \
    \
    trailer {     \
    position:fixed;\
        horizontal:-10%;                             \
        vertical:150px;                            \
        cover:no;                               \
        popup-animation-in: side-in;            \
        popup-animation-out: side-out;          \
        escape: no;\
        blur: no;\
        \
    \
    }\
    \
    right {\
        horizontal:-20%;\
        vertical:0\
    \
    \
    }"
);


if (document.addEventListener) {
    document.addEventListener('keydown', _escapePopOut, false);
} else if (document.detachEvent) {
    document.attachEvent('keydown', _escapePopOut);
}
if (document.addEventListener) {
    document.addEventListener('click', _blurPopOut, false);
} else if (document.detachEvent) {
    document.attachEvent('click', _blurPopOut);
}

function popError(num, msg) {
    var full_msg = 'PopScript Error ' + num + ": " + msg;
    console.error(full_msg);
    alert(full_msg);
}


//Source: http://www.howtocreate.co.uk/tutorials/javascript/browserwindow
function _windowDimensions() {
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
//Source: Mozilla Development Network
function _animationPossible() {
    var animation = false;
    var animationstring = 'animation';
    var keyframeprefix = '';
    var domPrefixes = 'Webkit O MS MOZ'.split(' ');
    pfx = '';

    if (elm.style.animationName) {
        animation = true;
    }

    if (animation === false) {
        for (var i = 0; i < domPrefixes.length; i++) {
            if (elm.style[ domPrefixes[i] + 'AnimationName' ] !== undefined) {
                var pfx = domPrefixes[ i ];
                animationstring = pfx + 'Animation';
                keyframeprefix = '-' + pfx.toLowerCase() + '-';
                animation = true;
                break;
            }
        }
    }

    return animation;
}

function _getDocHeight() {
    return Math.max(
        Math.max(document.body.scrollHeight, document.documentElement.scrollHeight),
        Math.max(document.body.offsetHeight, document.documentElement.offsetHeight),
        Math.max(document.body.clientHeight, document.documentElement.clientHeight)
    );
}


function _getScrolled() {
    return {v: Math.max(window.scrollY, document.body.scrollTop),
        'h': Math.max(window.scrollX)};
}


function increasePopup() {
    _total_pops_created++;
    _rough_total_pops_atm++;
}

function decreasePopup() {
    _rough_total_pops_atm--;
}


function _checkValidPopClasses(pop_class) {
    var pop_class_list = pop_class.trim().split(/[\s]+/);
    for (var i = 0; i < pop_class_list.length; i++) {
        if (!compiled_popscript[pop_class_list[i]]) {
            return popError(3, "Inexistent Pop Class: '" + pop_class_list[i] + "'");

        }
    }
    return pop_class_list;

}




function _trimString(line) {
    //source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim
    return line.replace(/^\s+|\s+$/g, '');

}
function compilePopScript(popscript) {
    window.compiled_popscript = {};
    window.pop_classes = [];


    var total_opening_braces = popscript.match(/\{/g).length;
    var total_closing_braces = popscript.match(/\}/g).length;

    if (total_opening_braces !== total_closing_braces) {
        return popError(10, 'Unmatched Braces');
    }
    if (!total_opening_braces) {
        return {};
    } else {

        var prev_closing_brace = -1;
        var opening_brace_index, closing_brace_index, pop_classes;
        var cur_popscript = popscript;
        var i = 0;
        do {
            cur_popscript = cur_popscript.substring(prev_closing_brace + 1);
            opening_brace_index = cur_popscript.indexOf('{');
            closing_brace_index = cur_popscript.indexOf('}');

            pop_classes = _extractPopClasses(cur_popscript.substring(0, opening_brace_index));

            if (!pop_classes) {
                return
            }
            _compilePopBlock(pop_classes, cur_popscript.substring(opening_brace_index + 1, closing_brace_index));
            prev_closing_brace = closing_brace_index;

            i++;
        } while (i < total_opening_braces)

    }


}

function _extractPopClasses(raw_val) {
    var split_val = raw_val.split(",");

    var pop_classes = [];
    var pop_class;
    for (var i = 0; i < split_val.length; i++) {

        pop_class = _trimString(split_val[i]);
        if (pop_class.match(/[^A-Z0-9\-]/i)) {
            popError(6, "Invalid Pop Class Name: '" + pop_class + "'");
            return false;
        }
        pop_classes.push(pop_class);
    }
    return pop_classes;
}
function _compilePopBlock(pop_classes, pop_block) {
    var lines = pop_block.split(';');
    var dict = {};
    var line, prop_val;
    for (var i = 0; i < lines.length; i++) {
        line = _trimString(lines[i]);
        if (line) {
            prop_val = line.split(':');
            _associatePopClass(pop_classes, _trimString(prop_val[0]), _trimString(prop_val[1]));
        }
    }
}

function _associatePopClass(pop_classes, prop, val) {
    if (prop) {
        if (pop_manifest.all_properties.indexOf(prop) === -1) {
            return popError(8, "Invalid Pop Property: '" + prop + "'")
        }
        var pop_class;
        for (var i = 0; i < pop_classes.length; i++) {
            pop_class = pop_classes[i];
            if (!compiled_popscript[pop_class]) {
                compiled_popscript[pop_class] = {};
            }
            compiled_popscript[pop_classes[i]][prop] = val;
        }

    }
}

function _compilePopClass(pop_class_list) {
    var compiled = {};
    var cur, cur_attrs, cur_attr;
    for (var i = 0; i < pop_class_list.length; i++) {
        cur = pop_class_list[i];
        cur_attrs = compiled_popscript[cur];
        for (cur_attr in cur_attrs) {
            compiled[cur_attr] = cur_attrs[cur_attr];
        }
    }
    return compiled;
}

function _removePx(s) {
    var start_px = s.indexOf('px');
    if (start_px !== -1) {
        return parseInt(s.substr(0, start_px));
    }
}


function _findNodeDimensions(node) {
    // dimension object
    var dim = {};
    // add a node to check the dimensions
    node.style.visibility = 'hidden';
    node.id = "popscript-check-popup-dimensions";

    document.body.appendChild(node);
    var appended_node = document.getElementById("popscript-check-popup-dimensions");

    dim.height = appended_node.offsetHeight;
    dim.width = appended_node.offsetWidth;

    node.style.visibility = "visible";
    document.body.removeChild(appended_node);
    return dim;
}


function _autoDimension(pop_attr, window_dimension, pop_dimension, scrolled) {
    if (!pop_attr || pop_attr === "auto") {

        if (pop_dimension >= window_dimension) {
            return scrolled;
        }
        else {
            return (parseInt((window_dimension - (pop_dimension)) / 2.0)) + scrolled
        }

    } else {
        pop_attr = pop_attr.trim();

        if (pop_attr[pop_attr.length - 1] === "%") {
            return scrolled + (parseFloat(window_dimension) * (parseInt(pop_attr.match(/([\d]+)%/)[1]) / 100));
        } else {
            return scrolled + parseInt(pop_attr.match(/([\d]+)/)[1]);
        }


    }


}


function popAlign(popy, pop) {
    var dim = _findNodeDimensions(popy.cloneNode(true));

    var window_dim = _windowDimensions();
    var pop_vertical = pop.scan('vertical');
    var pop_horizontal = pop.scan('horizontal');
    var position_fixed = pop.scan('position') && pop.scan('position') === 'fixed';
    var scrolled = _getScrolled();
    var scrolled_v = position_fixed ? 0 : scrolled.v;
    var scrolled_h = position_fixed ? 0 : scrolled.h;
    if (pop_vertical && pop_vertical[0]) {
        if (pop_vertical[0] === "-") {
            popy.style.bottom = _autoDimension(pop_vertical, window_dim.height, dim.height, -scrolled_v) + "px";

        } else {
            popy.style.top = _autoDimension(pop_vertical, window_dim.height, dim.height, scrolled_v) + "px";
        }

    } else {
        popy.style.top = _autoDimension(pop_vertical, window_dim.height, dim.height, scrolled_v) + "px";
    }

    if (pop_horizontal && pop_horizontal[0]) {
        if (pop_horizontal[0] === "-") {

            popy.style.right = _autoDimension(pop_horizontal, window_dim.width, dim.width, -scrolled_h) + "px";

        } else {
            popy.style.left = _autoDimension(pop_horizontal, window_dim.width, dim.width, scrolled_h) + "px";
        }

    } else {
        popy.style.left = _autoDimension(pop_horizontal, window_dim.width, dim.width, scrolled_h) + "px";
    }


}
var Pop = function () {

    var cached = !arguments[0].substring;
    this.pop_class = cached ? arguments[0] : "";
    if (!cached) {
        this.pop_class_list = _checkValidPopClasses(arguments[0]);

        this.compiled = this.pop_class_list ? _compilePopClass(this.pop_class_list) : {};
    } else {
        this.compiled = arguments[0];
    }
    this.isValid = function () {
        return this.pop_class_list;
    };
    this.scan = function (attr) {


        return this.compiled[attr];
    }
};

function pop(content, pop_input, extra_dict) {

    if (!pop_input) {
        pop_input = "";
    }
    pop_input = "basic " + pop_input;

    if (pop_input.substr === undefined) {
        extra_dict = pop_input;
        pop_input = "basic";
    }


    var new_popscript_number = _total_pops_created + 1;

    var pop = new Pop(pop_input);
    if (pop.isValid() === false) {

        return false;
    }

    var animation_in_duration = pop.scan('animation-in-duration');

    var cover_required = !pop.scan('cover') || pop.scan('cover') !== 'no';
    if (cover_required) {
        increasePopup();
        var backy = document.createElement('div');
        backy.style.height = _getDocHeight() + "px";
        backy.style.position = 'absolute';
        backy.style.width = '100%';
        backy.style.top = '0';
        backy.style.left = '0';
        backy.style.right = '0';
        backy.style.zIndex = '999999';
        var given_cover_class = pop.scan('cover-class');
        if (given_cover_class && given_cover_class !== 'no') {
            backy.className = pop.scan('cover-class');
        }

        var cover_animation_in = pop.scan('cover-animation-in');
        if (cover_animation_in) {
            _popAddAnimation(backy, cover_animation_in, animation_in_duration)
        }

        backy.id = 'popscript-cover-' + new_popscript_number;

    }

    var popy = document.createElement('div');


    var popup_animation_in = pop.scan('popup-animation-in');
    if (popup_animation_in) {
        _popAddAnimation(popy, popup_animation_in, animation_in_duration)
    }


    popy.style.position = pop.scan('position') ? pop.scan('position') : 'absolute';
    popy.style.zIndex = '1000000';
    popy.setAttribute('data-pop-cache', JSON.stringify(pop.compiled));
    popy.className = pop.scan('popup-class');

    if ((content.substring) !== undefined) {
        popy.appendChild(document.createTextNode(content));
    } else {
        popy.appendChild(content);
    }


    popAlign(popy, pop);

    popy.id = 'popscript-popup-' + new_popscript_number;

    var redo_align = function () {
        var inaction_popy = document.getElementById('popscript-popup-' + new_popscript_number);
        if (inaction_popy !== null) {
            popAlign(inaction_popy, pop);

        }
    };

    var align_checks = pop.scan('align-check');
    if (align_checks) {
        align_checks = align_checks.split(",");
        var cur_align_check, timer_num, last_ind;
        for (var i = 0; i < align_checks.length; i++) {
            cur_align_check = align_checks[i];
            last_ind = cur_align_check.length - 1;
            if (cur_align_check[last_ind] === "*") {
                timer_num = parseInt(cur_align_check.substr(0, last_ind));
                if (isNaN(timer_num)) {
                    return popError(5, 'Invalid Align Check Number: ' + cur_align_check);
                }
                setInterval(redo_align, timer_num);
            } else {
                timer_num = parseInt(cur_align_check);
                setTimeout(redo_align, timer_num);
            }
        }
    }


    popy.onclick = function (e) {
        e.stopImmediatePropagation()
    };

    if (extra_dict && extra_dict.onpopout) {
        popy.onClosePop = extra_dict.onpopout;
    } else {
        popy.onClosePop = function () {
        };
    }


    if (pop.scan('close-pop') && pop.scan('close-pop') !== 'no') {
        var close = document.createElement('span');
        close.style.cursor = "pointer";
        close.style.position = 'absolute';
        close.style.top = '0';
        close.style.right = '0';
        close.className = pop.scan('close-pop-class');
        close.innerHTML = 'x';

        close.onclick = closePop;
    }


    popy.appendChild(close);


    if (cover_required) {
        backy.appendChild(popy);
        document.body.appendChild(backy);
    } else {
        document.body.appendChild(popy);
    }


    _total_pops_created++;
}

function _currentHighestPopNum(condition) {

    if (!condition) {
        condition = function () {
            return true
        }
    }
    var cur_num = _total_pops_created;

    var cur_pop;
    while (cur_num !== 0) {
        cur_pop = document.getElementById('popscript-popup-' + cur_num);
        if (cur_pop && condition.call(cur_pop)) {

            return cur_num;
        }
        cur_num--;

    }

    return false;
}

function popOut(pop_num) {


    var current_highest_pop_num = arguments.length ? pop_num : _currentHighestPopNum();
    if (!current_highest_pop_num) return false;

    var pop_cover = document.getElementById('popscript-cover-' + current_highest_pop_num);

    var pop_popup = document.getElementById('popscript-popup-' + current_highest_pop_num);

    var pop = new Pop(JSON.parse(pop_popup.getAttribute('data-pop-cache')));

    pop_popup.onClosePop();

    var animate_out_dict = {};
    animate_out_dict[pop_popup.id] = pop.scan('popup-animation-out');


    if (pop_cover) {

        animate_out_dict[pop_cover.id] = pop.scan('cover-animation-out');
    }
    var animation_out_length = pop.scan('animation-out-duration');


    _pAnimateOut(animation_out_length, pop_cover ? pop_cover : pop_popup,
        animate_out_dict);
    decreasePopup();


}


function noPopsLeft() {
    var all_elements = document.getElementsByTagName('*');
    var pattern = /^popscript\-popup\-([\d]+)$/;
    for (var i = 0; i < all_elements.length; i++) {
        if (all_elements[i].id && all_elements[i].id.match(pattern)) {
            return false;
        }
    }
    return true;
}

function onePopLeft() {
    var all_elements = document.getElementsByTagName('*');
    var pattern = /^popscript\-cover\-([\d]+)$/;
    var one_pop_encountered = false;
    for (var i = 0; i < all_elements.length; i++) {
        if (all_elements[i].id && all_elements[i].id.match(pattern)) {
            if (one_pop_encountered) {
                return false
            }
            else {
                one_pop_encountered = true
            }
        }
    }
    return one_pop_encountered;
}

function closePop() {

    if (!noPopsLeft()) {
        var pat = /popscript\-popup\-([\d]+)/;
        var cur_element = this;

        var found = false;
        var cur_id_val, m;
        var pop_num, pop_popup, pop_cover;
        while (cur_element && cur_element.getAttribute) {

            cur_id_val = cur_element.getAttribute('id');

            m = cur_id_val ? cur_id_val.match(pat) : false;
            if (m) {
                found = true;
                pop_num = m[1];

                pop_cover = document.getElementById('popscript-cover-' + pop_num);
                pop_popup = cur_element;
                break;
            }

            cur_element = cur_element.parentNode;

        }

        if (found) {
            popOut(pop_num);
        }
    }
}


function _pAnimateOut(delay_length, main, todo) {
    var delay = 0;
    if ((!_animationPossible) || (delay_length !== 0)) {
        delay = delay_length - 30;
        setTimeout(function () {
            main.parentNode.removeChild(main);
        }, delay);
        for (var key in todo) {
            var value = todo[key];
            if (value && value !== "none") {
                var key_node = document.getElementById(key);
                _popAddAnimation(key_node, value, delay)

            }
        }
    } else {
        main.parentNode.removeChild(main);
    }
}

function _popAddAnimation(node, value, delay) {
    node.style.animation = (value + ' ' + delay + 'ms');
    node.style.webkitAnimation = (value + ' ' + delay + 'ms');
    node.style.mozAnimation = (value + ' ' + delay + 'ms');
    node.style.oAnimation = (value + ' ' + delay + 'ms');
    node.style.msAnimation = (value + ' ' + delay + 'ms');
}

