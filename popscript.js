"use strict"

//Configuration Manifest
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
        'top':'20%'

    }
};

var _total_pops_created = 0;
var _rough_total_pops_atm = 0;
var _original_key_down = null;

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


function _getInnerHeight() {
    return window.innerHeight;
}

function _getScrolled() {
    return Math.max(window.scrollY, document.body.scrollTop);
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
        if (!popscript[pop_class_list[i]]) {
            console.error("PopScript Error 1: Inexistent Pop Class: '" + pop_class_list[i] + "'");
            alert("PopScript Error 1: Inexistent Pop Class: '" + pop_class_list[i] + "'");
            return false;
        }
    }
    return pop_class_list;

}

var Pop = function (pop_class) {
    this.pop_class = pop_class;
    this.pop_class_list = _checkValidPopClasses(pop_class);
    this.compiled = this.pop_class_list ? _compilePopClass(this.pop_class_list) : {};
    this.isValid = function () {
        return this.pop_class_list === false;
    };
    this.scan = function (attr) {
        return this.compiled[attr];
    }


};


function _compilePopClass(pop_class_list) {
    var compiled = {};
    var cur, cur_attrs, cur_attr;
    for (var i = 0; i < pop_class_list.length; i++) {
        cur = pop_class_list[i];
        cur_attrs = popscript[cur];
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


function _findMarginTopByNode(node) {
    node.style.visibility = 'hidden';
    node.id = "popscript-check-popup-height";

    document.body.appendChild(node);
    var appended_node = document.getElementById("popscript-check-popup-height");

    var h = appended_node.offsetHeight;
    node.style.visibility = "visible";
    document.body.removeChild(appended_node);
    return _findMarginTopByHeight(h);
}

function _findMarginTopByHeight(h) {
    var window_height = _getInnerHeight();
    if (h >= window_height) {
        return _getScrolled();
    }
    else {
        return (parseInt((window_height - (h)) / 2.0)) + _getScrolled()
    }
}

function _findNonAutoMarginTop(pop_top) {
    pop_top = pop_top.trim();
    if (pop_top[pop_top.length - 1] === "%") {
        return _getScrolled() + (parseFloat(_getInnerHeight()) * (parseInt(pop_top.match(/([\d]+)%/)[1])/100));
    } else {
        return _getScrolled() + parseInt(pop_top.match(/([\d]+)/)[1]);
    }
}
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
    increasePopup();
    var backy = document.createElement('div');
    backy.style.height = _getDocHeight() + "px";
    backy.style.position = 'absolute';
    backy.style.width = '100%';
    backy.style.top = '0';
    backy.style.left = '0';
    backy.style.right = '0';
    backy.style.zIndex = '999999';
    backy.className = pop.scan('cover_class');
    backy.setAttribute('data-pop', pop_input);
    backy.id = 'popscript-cover-' + new_popscript_number;
    backy.onclick = closePop;


    var popy = document.createElement('div');
    popy.style.margin = 'auto';
    popy.style.position = 'relative';
    popy.style.zIndex = '1000000';
    var pop_top = pop.scan('top');
    popy.setAttribute('data-popscript-top', pop_top);
    popy.className = pop.scan('popup_class');

    var content_area;
    if ((content.substring) !== undefined) {
        content_area = document.createElement('p');
        content_area.appendChild(document.createTextNode(content));
    } else {
        content_area = content;
    }
    popy.appendChild(content_area);

    if (!pop_top || pop_top === "auto") {
        popy.style.marginTop = _findMarginTopByNode(popy) + "px";
    } else {
        popy.style.marginTop = _findNonAutoMarginTop(pop_top) + "px";
    }
    popy.id = 'popscript-popup-' + new_popscript_number;


    var redo_margin = function () {
        var inaction_popy = document.getElementById('popscript-popup-' + new_popscript_number);
        if (inaction_popy !== null) {
            if (!pop_top || pop_top === "auto") {
                inaction_popy.style.marginTop = _findMarginTopByHeight(inaction_popy.offsetHeight) + "px";
            } else {
                inaction_popy.style.marginTop = _findNonAutoMarginTop(pop_top) + "px";
            }
        }
    };

    var align_check = pop.scan('align_check');
    if (align_check) {
        for (var i = 0; i < align_check.length; i++) {
            setTimeout(redo_margin, align_check[i]);
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


    if (pop.scan('close_pop')) {
        var close = document.createElement('span');
        close.style.cursor = "pointer";
        close.style.position = 'absolute';
        close.style.top = '0';
        close.style.right = '0';
        close.className = pop.scan('close_pop_class');
        close.innerHTML = 'x';

        close.onclick = closePop;
    }


    if (pop.scan('close_pop')) {
        popy.appendChild(close);
    }


    backy.appendChild(popy);

    document.body.appendChild(backy);

    _original_key_down = document.onkeydown;
    document.onkeydown = function (e) {

        var keycode = e ? e.keyCode : (window.event).keyCode;
        if (keycode === 27) {
            document.onkeydown = _original_key_down;

            popOut();
        }
    };

    _total_pops_created++;
}

function _currentHighestPopNum() {
    var cur_num = _total_pops_created;
    while (cur_num !== 0) {
        if (document.getElementById('popscript-cover-' + cur_num)) {
            return cur_num;
        }
        cur_num--;

    }
    return 0;
}

function popOut() {

    if (!noPopsLeft()) {

        var current_highest_pop_num = _currentHighestPopNum();
        var pop_cover = document.getElementById('popscript-cover-' + current_highest_pop_num);
        var pop_popup = document.getElementById('popscript-popup-' + current_highest_pop_num);
        var pop = new Pop(pop_cover.getAttribute('data-pop'));

        pop_popup.onClosePop();

        var animate_out_dict = {};
        animate_out_dict[pop_popup.id] = pop.scan('popup_animation_out_keyframes_name');
        animate_out_dict[pop_cover.id] = pop.scan('cover_animation_out_keyframes_name');
        var animation_out_length = pop.scan('animation_out_duration');


        _pAnimateOut(animation_out_length, document.getElementById('popscript-cover-' + current_highest_pop_num),
            animate_out_dict);
        decreasePopup();
        document.keydown = _original_key_down;

    }
}


function noPopsLeft() {
    var all_elements = document.getElementsByTagName('*');
    var pattern = /^popscript\-cover\-([\d]+)$/;
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


        var pat = /popscript\-cover\-([\d]+)/;
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
                pop_cover = cur_element;
                pop_popup = cur_element.firstChild;
                break;
            }

            cur_element = cur_element.parentNode;

        }

        if (found) {

            pop_popup.onClosePop();

            var pop = new Pop(pop_cover.getAttribute('data-pop'));

            var animate_out_dict = {};


            animate_out_dict[pop_popup.id] = pop.scan('popup_animation_out_keyframes_name');
            animate_out_dict[pop_cover.id] = pop.scan('cover_animation_out_keyframes_name');
            var animation_out_length = pop.scan('animation_out_duration');

            _pAnimateOut(animation_out_length, document.getElementById('popscript-cover-' + pop_num),
                animate_out_dict);
            decreasePopup();
            document.keydown = _original_key_down;
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
            var key_node = document.getElementById(key);
            key_node.style.animation = (value + ' ' + delay_length + 'ms');
            key_node.style.webkitAnimation = (value + ' ' + delay_length + 'ms');
            key_node.style.mozAnimation = (value + ' ' + delay_length + 'ms');
            key_node.style.oAnimation = (value + ' ' + delay_length + 'ms');
            key_node.style.msAnimation = (value + ' ' + delay_length + 'ms');
            key_node.onanimationstart = function () {
                alert('fre');
            }
        }
    } else {
        main.parentNode.removeChild(main);
    }
}

