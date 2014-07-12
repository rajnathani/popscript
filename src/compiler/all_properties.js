var convert = require('./convert.js');


module.exports = {
    animation_in_box: convert.ani,
    animation_in_cover: convert.ani,
    animation_in_duration: convert.n,
    animation_out_box: convert.ani,
    animation_out_cover: convert.ani,
    animation_out_duration: convert.n,


    style_class_box: convert.n,
    style_class_cross: convert.n,
    style_class_cover: convert.n,
    style_inline_box: convert.n,
    style_inline_cross: convert.n,
    style_inline_cover: convert.n,


    position_fixed: convert.bool,
    position_x: convert.boxPosition,
    position_y: convert.boxPosition,
    position_z: convert.z,
    position_x_scrolled: convert.bool,
    position_y_scrolled: convert.bool,
    position_x_scroll: convert.bool,
    position_y_scroll: convert.bool,
    position_check: convert.positionCheck,

    position_roller: convert.bool,
    full_draggable: convert.bool,
    cover: convert.bool,
    esc: convert.bool,
    blur: convert.bool,
    cross: convert.bool,
    click_me_out: convert.bool,
    cross_content: convert.n,
    destroy:convert.n,

    out: convert.hideOrDestroy,

    beforepopout: convert.n,
    afterpopout: convert.loff,
    nearelement: convert.n,
    beforepopin: convert.n,
    binder:convert.n
};
