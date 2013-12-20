prettyPrint();

var tooltip_gap = 400;

PopScript.event.add(document, 'click', function () {
    tooltip_gap = 10
});

var all_tooltips = PopScript.css_class.nodes('sample-popscript-tooltip');
var tooltip_index = 0;


var demo_page = window.location.pathname.match(/demo/);
if (!demo_page && tooltip_index < all_tooltips.length) {
    setTimeout(popTooltip, tooltip_gap);
}


function popTooltip() {
    pop(
        all_tooltips[tooltip_index].getAttribute('data-tooltip')
        , 'tooltip tip_left', {

            near_element: all_tooltips[tooltip_index],
            nearElement: function (x, y, width, height) {
                return [x + width + 30, y - 8]
            }

        });
    tooltip_index++;

    if (tooltip_index < all_tooltips.length) {
        setTimeout(popTooltip, tooltip_gap);

    }
}


function responsive() {
    var body = document.getElementsByTagName('body')[0];
    var width = (window).innerWidth;
    var class_name;
    if (width < 1000) {
        class_name = 'tablet';
        if (width < 600) {
            class_name = 'mobile'
        }
    }
    body.className = "";
    body.className = class_name;
}


responsive();

window.onresize = responsive;

document.getElementById('pending-docs').onclick = function(e){
    e = e || window.event;
    if (e.shiftKey){
        window.location.href = '/docs/index.html';
        return false;
    }

};

if (demo_page) {
    /* General*/
    document.getElementById('demo-general').onclick = function () {
        pop("This is a general box");
    };

    /* Success*/
    document.getElementById('demo-success').onclick = function () {
        pop("Your comment was successfully posted! (click to close)", "success");
    };

    /* Error*/
    document.getElementById('demo-error').onclick = function () {
        pop("Error 418: You are a teapot", "error");
    };

    /* Dropdown*/
    var dropdown_pop_id;
    document.getElementById('demo-dropdown').onclick = function () {
        if (!(dropdown_pop_id && popExists(dropdown_pop_id))) {
            dropdown_pop_id = pop("<ul><li>About</li><li>Help</li><li>Log Out</li></ul>", "dropdown",
                {near_element: this, nearElement: function (x, y, w, h) {
                    return [x, y + h + 4]
                }}
            )
        } else {
            popOut(dropdown_pop_id);
        }
    };

    /* Context Menu*/
    document.getElementById('demo-context-menu').oncontextmenu = function (event) {
        event = event || window.event;
        pop("<ul><li>Cut</li><li>Copy</li><li>Paste</li><li>Share</li></ul>", "context_menu",
            {popscript: {POSITION: {
                y: event.clientY + "+scrolled",
                x: event.clientX + "+scrolled" }
            }}
        );
        return false;
    };

    /* Tooltips*/
    var left_pop_id, right_pop_id, up_pop_id, down_pop_id;

    /* Tooltip Left*/
    document.getElementById('demo-tooltip-left').onmouseover = function () {
        left_pop_id = pop("pop from the left", 'tooltip tip_right',
            {near_element: this, nearElement: function (x, y, w, h) {
                return [x - w - 6, y]
            }})
    };
    document.getElementById('demo-tooltip-left').onmouseout = function () {
        popOut(left_pop_id)
    };

    /* Tooltip Right*/
    document.getElementById('demo-tooltip-right').onmouseover = function () {
        right_pop_id = pop("pop from the right", 'tooltip tip_left',
            {near_element: this, nearElement: function (x, y, w, h) {
                return [x + w + 6, y]
            }}
        )
    };
    document.getElementById('demo-tooltip-right').onmouseout = function () {
        popOut(right_pop_id)
    };

    /* Tooltip Up*/
    document.getElementById('demo-tooltip-up').onmouseover = function () {
        up_pop_id = pop("pop from the up", 'tooltip tip_up',
            {near_element: this, nearElement: function (x, y, w, h) {
                return [x, y - h]
            }}
        )
    };
    document.getElementById('demo-tooltip-up').onmouseout = function () {
        popOut(up_pop_id)
    };

    /* Tooltip Down*/
    document.getElementById('demo-tooltip-down').onmouseover = function () {
        down_pop_id = pop("pop from down below", 'tooltip tip_down',
            {near_element: this, nearElement: function (x, y, w, h) {
                return [x, y + h + 6]
            }}
        )
    };
    document.getElementById('demo-tooltip-down').onmouseout = function () {
        popOut(down_pop_id)
    };
}









