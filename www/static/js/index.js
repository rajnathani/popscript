prettyPrint();

var tooltip_gap = 400;

document.addEventListener( 'click', function () {
    tooltip_gap = 10
});

var all_tooltips = document.querySelectorAll('.sample-popscript-tooltip');
var tooltip_index = 0;


var demo_page = window.location.pathname.match(/demo/);
if (!demo_page && tooltip_index < all_tooltips.length) {
    setTimeout(popTooltip, tooltip_gap);
}

document.getElementById('download').onclick = function () {
   PS.pop('general', '<table id="download-table"> \
   <tr> \
   <td>Library</td> \
   <td colspan=2><a href="/v2/dist/popscript.js">popscript.js</a></td> \
   </tr> \
   <tr> \
   <td>Boilerplate</td> \
   <td ><a href="/v2/dist/popscript-boilerplate.css">popscript-boilerplate.css</a></td> \
   <td ><a href="/v2/dist/popscript-boilerplate.js">popscript-boilerplate.js</a></td> \
   </tr> \
   </table>', {style_inline_box:'padding:0;width:440px', style_inline_cross:'right:-10px;top:-10px;', style_class_cross:'cross cross-hover'});
    return false;
};

function popTooltip() {
   PS.pop(
        'tooltip tip_left',all_tooltips[tooltip_index].getAttribute('data-tooltip')
        , {
            nearElement: [all_tooltips[tooltip_index], function (x, y, width, height) {
                return [x + width + 30, y - 8]
            }],
//            style_inline_box:'color:rgb(20,20,20); background-color:white; border-color:white !important;'
        });
    tooltip_index++;

    if (tooltip_index < all_tooltips.length) {
        setTimeout(popTooltip, tooltip_gap);

    }
}


function responsive() {
    var html_tag = document.getElementsByTagName('html')[0];
    var width = (window).innerWidth;
    var class_name;
    if (width < 1000) {
        class_name = 'tablet';
        if (width < 600) {
            class_name = 'mobile'
        }
    }
    html_tag.className = class_name ? class_name : "";
}


responsive();

window.onresize = responsive;


(function () {
    var docs_body = (document.getElementsByClassName('body')[0]);
    if (docs_body) {
        var ps_props = (docs_body).querySelectorAll('.docs-ps-prop');
        var ps_prop, table_desc;
        for (var i = 0; i < ps_props.length; i++) {
            ps_prop = ps_props[i];
            table_desc = ps_prop.parentNode.nextSibling.nextSibling;
            table_desc.style.display = 'none';
            PS.event.add(ps_prop, 'click',
                function () {
                    var closure_table_desc;
                    closure_table_desc = this.parentNode.nextSibling.nextSibling;
                    closure_table_desc.style.display = closure_table_desc.style.display === 'none' ? 'table' : 'none';
                })
        }
    }

})();


if (demo_page) {
    /* General*/
    document.getElementById('demo-general').onclick = function () {
       PS.pop('general','This is an example.<br>You can insert HTML markup or a DOM node in this box.');
    };

    /* Success*/
    document.getElementById('demo-success').onclick = function () {
       PS.pop('success','Your comment was successfully posted! (click to close)');
    };

    /* Error*/
    document.getElementById('demo-error').onclick = function () {
       PS.pop('error','Error 418: You are a teapot');
    };

    /* Dropdown*/
    var dropdown_button = document.getElementById('demo-dropdown');
    PS.pop('dropdown',
        '<ul>' +
            '<li>About</li>' +
            '<li>Help</li>' +
            '<li>Log Out</li>' +
        '</ul>',
        {
          binder:[dropdown_button, 'click'],
          nearElement: [dropdown_button, function (x, y, w, h) {
            return [x, y + h + 4]
        }]});


    /* Context Menu*/
    document.getElementById('demo-context-menu').oncontextmenu = function (event) {
        event = event || window.event;
       PS.pop('context_menu','<ul>' +
                '<li>Cut</li>' +
                '<li>Copy</li>' +
                '<li>Paste</li>' +
                '<li>Share</li>' +
            '</ul>',
            {POSITION: {
                y: event.clientY + '+scrolled',
                x: event.clientX + '+scrolled' }
            }
        );
        return false;
    };

    /* Tooltips*/

    /* Tooltip Left*/
    var tooltip_left_button = document.getElementById('demo-tooltip-left');
    PS.pop(
        'tooltip tip_right',
        'pop from the left',
        {
          binder:[tooltip_left_button, ['mouseover', 'click'], ['mouseout', 'click']],
          nearElement: [tooltip_left_button, function (x, y, w, h) {
            return [x - w - 6, y]
        }]}
    );

    /* Tooltip Right*/
    var tooltip_right_button = document.getElementById('demo-tooltip-right');
    PS.pop(
        'tooltip tip_left',
        'pop from the right',
        {
          binder:[tooltip_right_button, ['mouseover', 'click'], ['mouseout', 'click']],
          nearElement: [tooltip_right_button, function (x, y, w, h) {
            return [x + w + 6, y]
        }]}
    );

    /* Tooltip Up*/
    var tooltip_up_button = document.getElementById('demo-tooltip-up');
    PS.pop(
        'tooltip tip_up',
        'pop from the up',
        {
          binder:[tooltip_up_button, ['mouseover', 'click'], ['mouseout', 'click']],
          nearElement: [tooltip_up_button, function (x, y, w, h) {
            return [x, y - h]
        }]}
    );

    /* Tooltip Down*/
    var tooltip_down_down = document.getElementById('demo-tooltip-down');
    PS.pop(
        'tooltip tip_down',
        'pop from down below',
        {
          binder:[tooltip_down_down, ['mouseover', 'click'], ['mouseout', 'click']],
          nearElement: [tooltip_down_down, function (x, y, w, h) {
            return [x, y + h + 6]
        }]}
    );

    /* Roller*/
    document.getElementById('demo-roller').onclick = function () {
        PS.pop('roller','<iframe src="http://relfor.co/about"></iframe>');
    };
}
