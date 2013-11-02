prettyPrint();

var tooltip_gap = 400;

PopScript.event.add(document,'click', function(){tooltip_gap = 10});

var all_tooltips = PopScript.css_class.nodes('sample-popscript-tooltip');
var tooltip_index = 0;


if (tooltip_index < all_tooltips.length) {
    setTimeout(popTooltip, tooltip_gap);
}


function popTooltip() {
    pop(
        all_tooltips[tooltip_index].getAttribute('data-tooltip')
        , 'tooltip arrow_left', {

            near_element: all_tooltips[tooltip_index],
            nearElement: function (x,y,width,height) {
                return [x + width + 30, y - 8]
            }

        });
    tooltip_index++;

    if (tooltip_index < all_tooltips.length) {
        setTimeout(popTooltip, tooltip_gap);

    }
}


//pop('hello');


