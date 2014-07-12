/*document.getElementById('vt-basic-1').onclick = function () {
PS.pop("hello");
 };
 */

var non_binder_button = document.getElementById('vt-non-binder');
non_binder_button.onclick = function () {
   PS.pop("general", "Non-Binder pop");
};

PS.pop("general", "Binder pop" ,{binder:[document.getElementById('vt-binder-1'), 'click']});
PS.pop("general", "Binder pop" ,{binder:[document.getElementById('vt-binder-2'), ['click', 'contextmenu']]});

PS.pop("general",
    "<b>hello world</b>",
    {binder:[document.getElementById('vt-basic-1'), "click"]}
);


PS.pop("general",
    function () {
        return "<b>hello world</b>"
    },
{binder: [document.getElementById('vt-basic-2'), "click"]}
    );

var el = document.createElement('b');
el.innerHTML = "hello world";

PS.pop("general",
    el,
    {binder:[document.getElementById('vt-basic-3'), "click"]}
    );

PS.pop("general",
    function () {
        var el = document.createElement('b');
        el.innerHTML = "hello world";
        return el;
    },
      {binder: [document.getElementById('vt-basic-4'), "click"]}
    );


document.getElementById('vt-beforepopout-1').onclick = function () {
   PS.pop("general", "hello", {beforePopOut: function () {
       PS.pop("general","You will be unable to destroy the pop.<br>" +
            "Refreshing the page is the only remaining option.");
        return false;
    }});
};

document.getElementById('vt-beforepopout-2').onclick = function () {
   PS.pop("general", "hello", {beforePopOut: function () {
        return true;
    }});
};

document.getElementById('vt-beforepopin-1').onclick = function () {
   PS.pop("general", "hello", {beforePopIn: function () {
       PS.pop("general","No I will not pop, you should not see me popping besides this pop");
        return false;
    }});
};

PS.pop( "general", 'hello', {
  binder:[document.getElementById('vt-beforepopin-2'),'click'],
  beforePopIn:function(){
   PS.pop("general","Before pop!");
}});

document.getElementById('vt-afterpopout-1').onclick = function () {
   PS.pop("general","hello", {afterPopOut: function (thePop, out_type) {
       PS.pop("general", "After pop called.<br>The out type is: " + out_type);
    },
        animation_out_cover: 'fade-out 2s',
        animation_in_duration: 70
    });
};

document.getElementById('vt-afterpopout-2').onclick = function () {
   PS.pop("general","hello", {afterPopOut: [
        function (pop_num, out_type) {
           PS.pop("general","The first of the 2 pops");
        },
        function (pop_num, out_type) {
           PS.pop("general","The second of the 2 pops");
        }]
    });
};


var hideAndShowPop;
document.getElementById('vt-hide-and-show').onclick = function () {
    if (!hideAndShowPop) {
        hideAndShowPop = PS.pop("general","<input placeholder='Anything random!'><br>" +
            "<input type='checkbox' name='random-checkbox' value='1'> 1 <input type='checkbox' name='random-checkbox' value='2'> 2 <br>" +
            "<input type='radio' name='random-radio' value='1'> a <input type='radio' name='random-radio' value='2'> b <input type='radio' name='random-radio' value='3'> c<br>",
            {out: 'hide'});
    } else if (hideAndShowPop.isHidden()) {
        hideAndShowPop.show();
    }
};

var togglePop;
document.getElementById('vt-toggle').onclick = function () {
    if (!togglePop) {
        togglePop =PS.pop("general","<input placeholder='Anything random!'><br>" +
            "<input type='checkbox' name='random-checkbox' value='1'> 1 <input type='checkbox' name='random-checkbox' value='2'> 2 <br>" +
            "<input type='radio' name='random-radio' value='1'> a <input type='radio' name='random-radio' value='2'> b <input type='radio' name='random-radio' value='3'> c<br>",
            {out: 'hide'});
    } else {
        togglePop.toggle();
    }
};




PS.pop(
    "general",
    function(thePop){
        setTimeout(function () {
            thePop.changeClass('success', 200);
        }, 1000);
        setTimeout(function () {
            thePop.changeClass('error', 400);
        }, 2000);
        setTimeout(function () {
            thePop.changeClass( 'general', 500);
        }, 3000);
        return 'I am pop. I am a pop who likes changing.';
    },
  {binder: [document.getElementById('vt-change-class'), 'click']}
);

PS.pop(
    "general",
    function (thePop) {
        setTimeout(function () {
            thePop.changeProperties({position_x: 'right'}, 400);
        }, 1000);
        setTimeout(function () {
            thePop.changeProperties({ position_y: 'bottom' }, 400);
        }, 2000);
        setTimeout(function () {
            thePop.changeProperties({ position_x: 'left' }, 400);
        }, 3000);
        setTimeout(function () {
            thePop.changeProperties({ position_x: 'auto', position_y: 'auto' }, 400);
        }, 4000);

        return 'I am pop. I will be doing a world tour around the screen corners.';
    },
    {position_x: 'left', position_y: 'top',
    binder: [document.getElementById('vt-inline-and-macros'), 'click']
    }
);


document.getElementById('vt-change-pop-prop').onclick = function () {
    var thePop =PS.pop("general",'I will change one of my pop properties');
    setTimeout(function () {
        thePop.changeProperty( ['position', 'x'], 'right');
    }, 1000);
    setTimeout(function () {
        thePop.changeProperty( 'position_x', 'left');
    }, 2000);
    setTimeout(function () {
        thePop.changeProperty( ['position', 'x'], 'right');
    }, 3000);
};


PS.pop(
  "general",
    function (thePop) {
        setTimeout(function () {
            thePop.changeProperty( 'cross', 'noo!!');
        }, 1000);
        setTimeout(function () {
            thePop.changeProperty( 'cover', 'not you either!!');
        }, 2000);
        setTimeout(function () {
            thePop.changeProperties(
                {'cross': 'yes! I actually want you',
                    'cover': 'y'});
        }, 3000);

        return "Keen eyes makes a popscript winner";

    }, {
      out: 'destroy',
      binder: [document.getElementById('vt-change-pop-prop-n-inline'), 'click']
      });


PS.pop("general","hello world, drag me.", {binder: [document.getElementById('vt-drag-1'), "click"]});


document.getElementById('vt-drag-2').onclick = function () {
   PS.pop("general",
        '<div style="padding:20px;background-color: gainsboro" class="popscript-drag">Draggable Header</div>' +
            '<div style="height:150px"></div>'
        , {
            full_draggable: 'no',
            style_inline_box: 'padding:0'
        }
    )
};

document.getElementById('vt-drag-3').onclick = function () {
   PS.pop("general",
        '<div style="height:150px"></div>' +
            '<div style="padding:20px;background-color: gainsboro" class="popscript-drag">Footer</div>'
        , {
            full_draggable: 'no',
            style_inline_box: 'padding:0'
        }
    )
};


document.getElementById('vt-sub-out-1').onclick = function () {
   PS.pop("general", '<div style="height:150px; background-color: red" class="popscript-out">Out me by clicking here</div>');
};

/*
document.getElementById('vt-sub-out-2').onclick = function () {
    var sub_el = document.createElement('div');
    sub_el.style.height = '150px';
    sub_el.style.backgroundColor = 'red';
    sub_el.innerHTML = 'Out me by clicking here';
    sub_el.onclick = Pop.prototype.out;
   PS.pop("general",sub_el);
};
*/

var input_box_usage = {
    hide: 'use this text area to confirm that when reopening the pop the pop being opened is a previous hidden one',
    destroy: 'use this text area to confirm that when reopening the pop the pop being opened is a new one'
};

document.getElementById('vt-sub-destroy-1').onclick = function () {
   PS.pop("general",
        '<div style="height:150px; background-color: red" class="popscript-hide">Out me by clicking here</div>' +
            input_box_usage.destroy +
            '<input/>'
    );
};

/*document.getElementById('vt-sub-destroy-2').onclick = function () {
    var par_el = document.createElement('div');
    var sub_el = document.createElement('div');
    sub_el.style.height = '150px';
    sub_el.style.backgroundColor = 'red';
    sub_el.innerHTML = 'Out me by clicking here';
    sub_el.onclick = popHide;
    var input_info = document.createTextNode(input_box_usage.destroy);
    var input_box = document.createElement('input'); //input box added for testing

    par_el.appendChild(sub_el);
    par_el.appendChild(input_info);
    par_el.appendChild(input_box);

   PS.pop("general", par_el);
};*/


var popSubHide1, popSubHide2;

document.getElementById('vt-sub-hide-1').onclick = function () {
    if (!popSubHide1) {
        popSubHide1 =PS.pop(
          "general",
            '<div style="height:150px; background-color: red" class="popscript-hide">Out me by clicking here</div>' +
                input_box_usage.hide +
                '<input/>'
        );
    } else {
        popSubHide1.show()
    }
};

/*document.getElementById('vt-sub-hide-2').onclick = function () {
    if (!popSubHide2) {
        var par_el = document.createElement('div');
        var sub_el = document.createElement('div');
        sub_el.style.height = '150px';
        sub_el.style.backgroundColor = 'red';
        sub_el.innerHTML = 'Out me by clicking here';
        sub_el.className = 'popscript-hide';
        var input_info = document.createTextNode(input_box_usage.hide);
        var input_box = document.createElement('input'); //input box added for testing

        par_el.appendChild(sub_el);
        par_el.appendChild(input_info);
        par_el.appendChild(input_box);

        popSubHide2 =PS.pop("general", par_el);
    } else {
        popSubHide2.show();
    }
};*/


PS.pop("general",
    "Hola scrollman",
    {
      position_fixed: 'no', position_y: "auto+scroll",
      binder:[document.getElementById('vt-scroll'), "click"]
    }
);

PS.pop("general",
    "Hola scrollman",
    {
      position_fixed: 'no', position_y: "auto+scrolled",
      binder:[document.getElementById('vt-scrolled'), "click"]
    }
);

PS.pop("general",
"Going to destroy myself soon..",
    {
      destroy:2000,
      binder:[document.getElementById('vt-destroy'), "click"]
    }
);
