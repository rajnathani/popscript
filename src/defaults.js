module.exports =  {
    position_x: ['auto', false, false],
    position_y: ['auto', false, false],
    position_z: function () {
        return PS.flags.Z
    },
    position_check: [
        [20, 333,1000],
        []
    ],
    positioncheck: null,
    position_fixed: true,

    position_x_scroll: false,
    position_x_scrolled: false,
    position_y_scroll: false,
    position_y_scrolled: false,

    blur: true,
    esc: true,
    out: 'hide',
    cover: true,
    cross: true,
    full_draggable: false,
    position_roller: false,
    cross_content: "x",

    animation_in_duration: 200,
    animation_out_duration: 170,

    afterpopout:[]

};
