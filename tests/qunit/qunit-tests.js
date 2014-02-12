popscript_flags['alert error on error'] = false; //turn off popscript alerts on error
popscript_flags['throw error on error'] = true; //turn on throwing of errors on popscript error


module('Basic Functions');

test('PS.increasePop', function () {

    ok(PS.increasePop() === 1, 'Increase from 0 to 1');
    ok(PS.increasePop() === 2, 'Increase from 1 to 2');
    ok(PS.num_pops_created === 2, 'PS.num_pops_created');

});



test('PS.highestConditionPopId', function () {
    ok(PS.highestConditionPopId() === -1, 'Check if the highest pop number without any pops returns -1');
});


module('Compiler');

test('PS.compileScope', function () {
    var pop_class_script, compiled_pop_classes_script;
    var animations_scope = {box: 'xyz'};
    var classes_scope = {box: 'abc'};
    var multi_animations_scope = {cover: 'asd', box: 'pqr'};

    pop_class_script = {mybox: {ANIMATION: {IN: animations_scope,
        OUT: multi_animations_scope},
        STYLE_CLASS: {box: classes_scope}}};
    compiled_pop_classes_script = {click_me_out: false}; // The compiled popscript has some preregistered properties.


    PS.compileScope(['ANIMATION', 'IN'], animations_scope, compiled_pop_classes_script, pop_class_script);
    ok(_.isEqual(compiled_pop_classes_script, {click_me_out: false, animation_in_box: PS.convert.ani.call(['animation_in_box', {}], animations_scope.box), animation_in_true_duration: {global: true, len: 0}}), "Basic scope property registration");


    PS.compileScope(['STYLE_CLASS'], classes_scope, compiled_pop_classes_script, pop_class_script);
    ok(_.isEqual(compiled_pop_classes_script, {click_me_out: false, animation_in_box: PS.convert.ani.call(['animation_in_box', {}], animations_scope.box), animation_in_true_duration: {global: true, len: 0}, style_class_box: classes_scope.box}),
        "Scope registration after existing scope registration");

    PS.compileScope(['ANIMATION', 'OUT'], multi_animations_scope, compiled_pop_classes_script, pop_class_script);

    ok(_.isEqual(compiled_pop_classes_script, {click_me_out: false, animation_in_box: PS.convert.ani.call(['animation_in_box', {}], animations_scope.box), animation_in_true_duration: {global: true, len: 0}, animation_out_true_duration: {global: true, len: 0}, animation_out_cover: PS.convert.ani.call(['animation_out_cover', {}], multi_animations_scope.cover), animation_out_box: PS.convert.ani.call(['animation_out_box', {}], multi_animations_scope.box), style_class_box: classes_scope.box}),
        "Multi-property scope update");


});

test('PS.convert.bool', function () {
    ok(PS.convert.bool(true) === true, 'Trivial check of boolean true');
    ok(PS.convert.bool(false) === false, 'Trivial check of boolean false');
    ok(PS.convert.bool(0) === false, 'Check 0 is false');
    ok(PS.convert.bool(1) === true, 'Check 1 is true');
    ok(PS.convert.bool(4) === true, 'Check number greater than 0 is true');
    ok(PS.convert.bool(-1) === true, 'Check number less than 0 is true');
    ok(PS.convert.bool('y') === true, 'Check single character lower case y is true');
    ok(PS.convert.bool('Y') === true, 'Check single character upper case Y is true');
    ok(PS.convert.bool('n') === false, 'Check single character lower case n is false');
    ok(PS.convert.bool('N') === false, 'Check single character upper case N is false');
    ok(PS.convert.bool('YuPP') === true, 'Check multi letter string starting with y/Y is true');
    ok(PS.convert.bool('Nah!') === false, 'Check multi letter string starting with n/Y is false');

    var error_occurred;
    try {
        PS.convert.bool('Maybe?');
    }
    catch (error) {
        error_occurred = true;
    } finally {
        ok(error_occurred, 'Check string not beginning with y or n throws an error');
    }
});


test('PS.convert.boxPosition', function () {
    var compiled, prop, scrolled_prop;
    prop = 'position_x';
    scrolled_prop = prop + '_scrolled';
    compiled = {};
    ok(_.isEqual(PS.convert.boxPosition.call([prop, compiled], "auto"), ["auto", false, false]), "Compiled position for auto");

    ok(_.isEqual(PS.convert.boxPosition.call([prop, compiled], "auto+scrolled"), ["auto", false, false]) && compiled[scrolled_prop], "Compiled position for auto with scroll");
    ok(_.isEqual(PS.convert.boxPosition.call([prop, compiled], "left"), [0, true, false]), "Compiled position for left");
    ok(_.isEqual(PS.convert.boxPosition.call([prop, compiled], "top"), [0, true, false]), "Compiled position for top");
    ok(_.isEqual(PS.convert.boxPosition.call([prop, compiled], "bottom"), [0, false, false]), "Compiled position for bottom");
    ok(_.isEqual(PS.convert.boxPosition.call([prop, compiled], "right"), [0, false, false]), "Compiled position for right");


    ok(_.isEqual(PS.convert.boxPosition.call([prop, compiled], 15), [15, true, false]), "Compiled position for number");


    ok(_.isEqual(PS.convert.boxPosition.call([prop, compiled], "15 +scrolled"), [15, true, false]) && compiled[scrolled_prop], "Compiled position for string number + scrolled");


    ok(_.isEqual(PS.convert.boxPosition.call([prop, compiled], "15%"), [0.15, true, true]), "Compiled position for percentage");
    ok(_.isEqual(PS.convert.boxPosition.call([prop, compiled], "!0% + scrolled"), [0, false, true]) && compiled[scrolled_prop], "Compiled position for bottom/right");

});

test('PS.convert.positionCheck', function () {
    ok(_.isEqual(PS.convert.positionCheck('20'), [
        [20],
        []
    ]), 'Single timeout');
    ok(_.isEqual(PS.convert.positionCheck('50*'), [
        [],
        [50]
    ]), 'Single interval');
    ok(_.isEqual(PS.convert.positionCheck('20, 50*'), [
        [20],
        [50]
    ]), 'Single timeout Single interval');

    ok(_.isEqual(PS.convert.positionCheck(' 50,10*, 49, 3*, 145* '), [
        [50, 49],
        [10, 3, 145]
    ]), 'Multi timeout Multi interval');
});


test('PS.convert.z', function () {
    var base_z = popscript_flags.Z;
    ok(PS.convert.z(5)() === 5, "integer non operator input");
    ok(PS.convert.z(" 5 ")() === 5, "string non operator input");
    ok(PS.convert.z(" +2")() === base_z + 2, "string unary add");
    ok(PS.convert.z("-1 ")() === base_z - 1, "string unary subtract");
});

test('PS.convert.ani', function () {
    var compiled = {};
    ok(_.isEqual(PS.convert.ani.call(['animation_in_box', compiled], "fade-in"), ["fade-in", "$g", undefined]) &&
        _.isEqual(compiled, {animation_in_true_duration: {global: true, len: 0}}),
        "single non duration animation");

    ok(_.isEqual(PS.convert.ani.call(['animation_in_cover', compiled], "fade-in, fade-out,slide-in"),
        ["fade-in, fade-out,slide-in", "$g,$g,$g", undefined]) &&
        _.isEqual(compiled, {animation_in_true_duration: {global: true, len: 0}}),
        "multiple non duration animation");

    ok(_.isEqual(PS.convert.ani.call(['animation_out_box', compiled], "fade-in 2s"), ["fade-in 2s", "2000ms", 2000]) &&
        _.isEqual(compiled, {animation_in_true_duration: {global: true, len: 0}, animation_out_true_duration: {global: undefined, len: 2000}}),
        "single duration animation");

    ok(_.isEqual(PS.convert.ani.call(['animation_out_cover', compiled], "fade-in 2s, fade-out,slide-in 10000ms"),
        ["fade-in 2s, fade-out,slide-in 10000ms", "2000ms,$g,10000ms", 10000])
        &&
        _.isEqual(compiled, {animation_in_true_duration: {global: true, len: 0}, animation_out_true_duration: {global: true, len: 10000}}),
        "multiple duration animation");
});

test('PS.convert.hideOrClose', function () {
    ok(PS.convert.hideOrClose('hide') === 'hide', 'check for hide');
    ok(PS.convert.hideOrClose('close') === 'close', 'check for close');
    var error_occurred;
    try {
        PS.convert.hideOrClose('shut');
    }
    catch (error) {
        error_occurred = true;
    } finally {
        ok(error_occurred, 'check value not hide or close');
    }

});


test('PS.compile', function () {

    PS.compiled_popscript = {};

    PS.compile({basic: {
        cross: 'yes'
    }});

    ok(_.isEqual(PS.compiled_popscript, {basic: {cross: true}}), "Basic test of single property (scope-less) compilation");


    PS.compiled_popscript = {};

    PS.compile({basic: {
        cover: 'no',
        esc: 'yes'
    },
        second: {
            'blur': 'noooo'
        }});

    ok(_.isEqual(PS.compiled_popscript,
        {
            basic: {cover: false, esc: true},
            second: {blur: false}

        }), "Intermediate test of multi-property-multi-class (scope-less) compilation");


    PS.compiled_popscript = {};

    PS.compile({
        basic: {
            cross_content: 'x',
            STYLE_CLASS: {
                box: 'lol'
            }
        },
        second: {
            POSITION: {'x': '10'}
        },
        third: {
            ANIMATION: {
                OUT: {
                    duration: 500
                }
            }
        }
    });

    ok(_.isEqual(PS.compiled_popscript,
        {
            basic: {cross_content: 'x', style_class_box: 'lol'},
            second: {position_x: PS.convert.boxPosition.call(['position_x', {}], '10'), position_x_scrolled: false, position_x_scroll: false},
            third: {animation_out_duration: 500}

        }), "Intermediate test of multi-property-multi-class (scope-less) compilation");


    PS.compile({
        basic: {
            style_class_box:'lmao', // modified property
            style_class_cover:'rofl' // added property
        },
        newest: {               // new class
            out:'hide'
        }
    });

    ok(_.isEqual(PS.compiled_popscript,
        {
            basic: {cross_content: 'x', style_class_box: 'lmao', style_class_cover:'rofl'},
            second: {position_x: PS.convert.boxPosition.call(['position_x', {}], '10'), position_x_scrolled: false, position_x_scroll: false},
            third: {animation_out_duration: 500},
            newest:{out:'hide'}

        }), "Compilation over existing compilation: addition of a new class, modification of an existing property, addition of a new property.");


});






