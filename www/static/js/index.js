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

document.getElementById('download').onclick = function () {
    pop('<table id="download-table"><tr><td>JS (pick any 1)</td><td><a href="/v1/src/popscript.js">popscript.js</a></td><td><a href="/v1/src/popscript.min.js">popscript.min.js</a></td></tr><tr><td>CSS</td><td colspan="2"><a href="/v1/src/popscript.css">popscript.css</a></td></tr></table>', {style_inline_box:'padding:0', style_inline_cross:'right:-10px;top:-10px;', style_class_cross:'cross cross-hover'});
    return false;
};

function popTooltip() {
    pop(
        all_tooltips[tooltip_index].getAttribute('data-tooltip')
        , 'tooltip tip_left', {
            nearElement: [all_tooltips[tooltip_index], function (x, y, width, height) {
                return [x + width + 30, y - 8]
            }]
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

(function(){
  pop("The current version (PopScript v1) has been depracated in favour of the new version: <a href='https://popscript.rajnathani.com/v2'>(PopScript v2)</a>", "success");
})();



if (demo_page) {
    /* General*/
    document.getElementById('demo-general').onclick = function () {
        pop('This is a general box');
    };

    /* Success*/
    document.getElementById('demo-success').onclick = function () {
        pop('Your comment was successfully posted! (click to close)',
            'success');
    };

    /* Error*/
    document.getElementById('demo-error').onclick = function () {
        pop('Error 418: You are a teapot',
            'error');
    };

    /* Dropdown*/
    var dropdown_button = document.getElementById('demo-dropdown');
    pop([dropdown_button, 'click', 'click'],
        '<ul>' +
            '<li>About</li>' +
            '<li>Help</li>' +
            '<li>Log Out</li>' +
        '</ul>',
        'dropdown',
        { nearElement: [dropdown_button, function (x, y, w, h) {
            return [x, y + h + 4]
        }]}
    );


    /* Context Menu*/
    document.getElementById('demo-context-menu').oncontextmenu = function (event) {
        event = event || window.event;
        pop('<ul>' +
                '<li>Cut</li>' +
                '<li>Copy</li>' +
                '<li>Paste</li>' +
                '<li>Share</li>' +
            '</ul>',
            'context_menu',
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
    pop([tooltip_left_button, ['mouseover', 'click'], ['mouseout', 'click']],
        'pop from the left',
        'tooltip tip_right',
        {nearElement: [tooltip_left_button, function (x, y, w, h) {
            return [x - w - 6, y]
        }]}
    );

    /* Tooltip Right*/
    var tooltip_right_button = document.getElementById('demo-tooltip-right');
    pop([tooltip_right_button, ['mouseover', 'click'], ['mouseout', 'click']],
        'pop from the right',
        'tooltip tip_left',
        {nearElement: [tooltip_right_button, function (x, y, w, h) {
            return [x + w + 6, y]
        }]}
    );

    /* Tooltip Up*/
    var tooltip_up_button = document.getElementById('demo-tooltip-up');
    pop([tooltip_up_button, ['mouseover', 'click'], ['mouseout', 'click']],
        'pop from the up',
        'tooltip tip_up',
        {nearElement: [tooltip_up_button, function (x, y, w, h) {
            return [x, y - h]
        }]}
    );

    /* Tooltip Down*/
    var tooltip_down_down = document.getElementById('demo-tooltip-down');
    pop([tooltip_down_down, ['mouseover', 'click'], ['mouseout', 'click']],
        'pop from down below',
        'tooltip tip_down',
        {nearElement: [tooltip_down_down, function (x, y, w, h) {
            return [x, y + h + 6]
        }]}
    );

    /* Roller*/
    pop([document.getElementById('demo-roller'), 'click'],
        '<iframe src="https://rajnathani.com"></iframe>',
        'roller');

}
