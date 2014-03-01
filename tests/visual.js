/*document.getElementById('vt-basic-1').onclick = function () {
 pop("hello");
 };
 */

var non_binder_button = document.getElementById('vt-non-binder');
non_binder_button.onclick = function () {
    pop("Non-Binder pop");
};

pop([document.getElementById('vt-binder-1'), 'click'], "Binder pop");
pop([document.getElementById('vt-binder-2'), ['click', 'contextmenu']], "Binder pop");

pop([document.getElementById('vt-basic-1'), "click"],
    "<b>hello world</b>");


pop([document.getElementById('vt-basic-2'), "click"],
    function () {
        return "<b>hello world</b>"
    });

var el = document.createElement('b');
el.innerHTML = "hello world";

pop([document.getElementById('vt-basic-3'), "click"],
    el);

pop([document.getElementById('vt-basic-4'), "click"],
    function () {
        var el = document.createElement('b');
        el.innerHTML = "hello world";
        return el;
    });


document.getElementById('vt-beforepopout-1').onclick = function () {
    pop("hello", {beforePopOut: function () {
        pop("You will be unable to close the pop.<br>" +
            "Refreshing the page is the only remaining option.");
        return false;
    }});
};

document.getElementById('vt-beforepopout-2').onclick = function () {
    pop("hello", {beforePopOut: function () {
        return true;
    }});
};

document.getElementById('vt-beforepopin-1').onclick = function () {
    pop("hello", {beforePopIn: function () {
        pop("No I will not pop, you should not see me popping besides this pop");
        return false;
    }});
};

pop([document.getElementById('vt-beforepopin-2'),'click'], 'hello', {beforePopIn:function(){
    pop("Before pop!");
}});

document.getElementById('vt-afterpopout-1').onclick = function () {
    pop("hello", {afterPopOut: function (pop_num, out_type) {
        pop("After pop called.<br>The out type is: " + out_type);
    },
        animation_out_cover: 'fade-out 2s',
        animation_in_duration: 20
    });
};

document.getElementById('vt-afterpopout-2').onclick = function () {
    pop("hello", {afterPopOut: [
        function (pop_num, out_type) {
            pop("The first of the 2 pops");
        },
        function (pop_num, out_type) {
            pop("The second of the 2 pops");
        }]
    });
};


var hide_and_show_pop_id;
document.getElementById('vt-hide-and-show').onclick = function () {
    if (!PopScript.exists(hide_and_show_pop_id)) {
        hide_and_show_pop_id = pop("<input placeholder='Anything random!'><br>" +
            "<input type='checkbox' name='random-checkbox' value='1'> 1 <input type='checkbox' name='random-checkbox' value='2'> 2 <br>" +
            "<input type='radio' name='random-radio' value='1'> a <input type='radio' name='random-radio' value='2'> b <input type='radio' name='random-radio' value='3'> c<br>",
            {out: 'hide'});
    } else if (PopScript.hidden(hide_and_show_pop_id)) {
        popShow(hide_and_show_pop_id);
    }
};

var toggle_pop_id;
document.getElementById('vt-toggle').onclick = function () {
    if (!toggle_pop_id) {
        toggle_pop_id = pop("<input placeholder='Anything random!'><br>" +
            "<input type='checkbox' name='random-checkbox' value='1'> 1 <input type='checkbox' name='random-checkbox' value='2'> 2 <br>" +
            "<input type='radio' name='random-radio' value='1'> a <input type='radio' name='random-radio' value='2'> b <input type='radio' name='random-radio' value='3'> c<br>",
            {out: 'hide'});
    } else {
        popToggle(toggle_pop_id);
    }
};


pop([document.getElementById('vt-change-class'), 'click'],
    function (pop_id) {
        setTimeout(function () {
            PopScript.changeClass(pop_id, 'success');
        }, 1000);
        setTimeout(function () {
            PopScript.changeClass(pop_id, 'error', 0);
        }, 2000);
        setTimeout(function () {
            PopScript.changeClass(pop_id, '', 500);
        }, 3000);

        return 'I am pop. I am a pop who likes changing.';
    }
);

pop([document.getElementById('vt-inline-and-macros'), 'click'],
    function (pop_id) {
        setTimeout(function () {
            PopScript.inline(pop_id, {position_x: 'right'}, 400);
        }, 1000);
        setTimeout(function () {
            PopScript.inline(pop_id, { position_y: 'bottom' }, 400);
        }, 2000);
        setTimeout(function () {
            PopScript.inline(pop_id, { position_x: 'left' }, 400);
        }, 3000);
        setTimeout(function () {
            PopScript.inline(pop_id, { position_x: 'auto', position_y: 'auto' }, 400);
        }, 4000);

        return 'I am pop. I will be doing a world tour around the screen corners.';
    },
    {position_x: 'left', position_y: 'top'}
);


document.getElementById('vt-change-pop-prop').onclick = function () {
    var pop_id = pop('I will change one of my pop properties');
    setTimeout(function () {
        PopScript.changeProperty(pop_id, ['position', 'x'], 'right');
    }, 1000);
    setTimeout(function () {
        PopScript.changeProperty(pop_id, 'position_x', 'left');
    }, 2000);
    setTimeout(function () {
        PopScript.changeProperty(pop_id, ['position', 'x'], 'right');
    }, 3000);
};


pop([document.getElementById('vt-change-pop-prop-n-inline'), 'click'],
    function (pop_id) {
        setTimeout(function () {
            PopScript.changeProperty(pop_id, 'cross', 'noo!!');
        }, 1000);
        setTimeout(function () {
            PopScript.changeProperty(pop_id, 'cover', 'not you either!!');
        }, 2000);
        setTimeout(function () {
            PopScript.inline(pop_id,
                {'cross': 'yes! I actually want you',
                    'cover': 'y'});
        }, 3000);

        return "Keen eyes makes a popscript winner";

    }, {'out': 'close'});


pop([document.getElementById('vt-drag-1'), "click"],
    "<b>hello world</b>");


document.getElementById('vt-drag-2').onclick = function () {
    pop(
        '<div style="padding:20px;background-color: gainsboro" class="popscript-drag">Draggable Header</div>' +
            '<div style="height:150px"></div>'
        , {
            full_draggable: 'no',
            style_inline_box: 'padding:0'
        }
    )
};

document.getElementById('vt-drag-3').onclick = function () {
    pop(
        '<div style="height:150px"></div>' +
            '<div style="padding:20px;background-color: gainsboro" class="popscript-drag">Footer</div>'
        , {
            full_draggable: 'no',
            style_inline_box: 'padding:0'
        }
    )
};


document.getElementById('vt-sub-out-1').onclick = function () {
    pop('<div style="height:150px; background-color: red" class="popscript-out">Out me by clicking here</div>');
};


document.getElementById('vt-sub-out-2').onclick = function () {
    var sub_el = document.createElement('div');
    sub_el.style.height = '150px';
    sub_el.style.backgroundColor = 'red';
    sub_el.innerHTML = 'Out me by clicking here';
    sub_el.onclick = popOut;
    pop(sub_el);
};


var input_box_usage = {
    hide: 'use this text area to confirm that when reopening the pop the pop being opened is a previous hidden one',
    close: 'use this text area to confirm that when reopening the pop the pop being opened is a new one'
};

document.getElementById('vt-sub-close-1').onclick = function () {
    pop(
        '<div style="height:150px; background-color: red" class="popscript-hide">Out me by clicking here</div>' +
            input_box_usage.close +
            '<input/>'
    );
};

document.getElementById('vt-sub-close-2').onclick = function () {
    var par_el = document.createElement('div');
    var sub_el = document.createElement('div');
    sub_el.style.height = '150px';
    sub_el.style.backgroundColor = 'red';
    sub_el.innerHTML = 'Out me by clicking here';
    sub_el.onclick = popHide;
    var input_info = document.createTextNode(input_box_usage.close);
    var input_box = document.createElement('input'); //input box added for testing

    par_el.appendChild(sub_el);
    par_el.appendChild(input_info);
    par_el.appendChild(input_box);

    pop(par_el);
};


var pop_id_sub_hide_1, pop_id_sub_hide_2;

document.getElementById('vt-sub-hide-1').onclick = function () {
    if (!PopScript.exists(pop_id_sub_hide_1)) {
        pop_id_sub_hide_1 = pop(
            '<div style="height:150px; background-color: red" class="popscript-hide">Out me by clicking here</div>' +
                input_box_usage.hide +
                '<input/>'
        );
    } else {
        popShow(pop_id_sub_hide_1)
    }
};

document.getElementById('vt-sub-hide-2').onclick = function () {
    if (!PopScript.exists(pop_id_sub_hide_2)) {
        var par_el = document.createElement('div');
        var sub_el = document.createElement('div');
        sub_el.style.height = '150px';
        sub_el.style.backgroundColor = 'red';
        sub_el.innerHTML = 'Out me by clicking here';
        sub_el.onclick = popHide;
        var input_info = document.createTextNode(input_box_usage.hide);
        var input_box = document.createElement('input'); //input box added for testing

        par_el.appendChild(sub_el);
        par_el.appendChild(input_info);
        par_el.appendChild(input_box);

        pop_id_sub_hide_2 = pop(par_el);
    } else {
        popShow(pop_id_sub_hide_2)
    }
};


pop([document.getElementById('vt-scroll'), 'click'],
    "Hola scrollman",
    {position_fixed: 'no', position_y: "auto+scroll"}
);

pop([document.getElementById('vt-scrolled'), 'click'],
    "Hola scrollman",
    {position_fixed: 'no', position_y: "auto+scrolled"}
);

