popscript_flags['alert error on error'] = false; //turn off popscript alerts on error
popscript_flags['throw error on error'] = true; //turn on throwing of errors on popscript error


module('Basic Functions');

test('PS.increasePop', function () {

    ok(PS.increasePop() === 1, 'Increase from 0 to 1');
    ok(PS.increasePop() === 2, 'Increase from 1 to 2');
    ok(PS.num_pops_created === 2, 'PS.num_pops_created');
    ok(PS.net_pops_atm === 2, 'PS.net_pops_atm');

});

test('PS.decreasePop', function () {
    // Reset values from the previous test
    // TODO: create setup and tear down for reset instead.
    PS.num_pops_created = 0;
    PS.net_pops_atm = 0;

    PS.increasePop();
    PS.decreasePop();
    ok(PS.net_pops_atm === 0, 'Increase from 0 to 1 then 1 to 0');
    PS.increasePop();
    PS.increasePop();
    PS.decreasePop();
    ok(PS.net_pops_atm === 1, 'Increase from 0 to 2 then 2 to 1');
    PS.increasePop();
    ok(PS.num_pops_created === 4, 'Total pops created');
});

test('PS.highestConditionPopNum', function () {
    ok(PS.highestConditionPopNum() === -1, 'Check if the highest pop number without any pops returns -1');
});


module('Compiler');

test('PS.compileScope', function () {
    var pop_class_script, compiled_pop_classes_script;
    var animations_scope = {box: 'xyz'};
    var classes_scope = {box: 'abc'};
    var multi_animations_scope = {cover: 'asd', box: 'pqr'};

    pop_class_script = {mybox: {ANIMATIONS: {IN: animations_scope,
        OUT: multi_animations_scope},
        CSS_CLASSES: {box: classes_scope}}};
    compiled_pop_classes_script = {click_to_close: false}; // The compiled popscript has some preregistered properties.
    PS.compileScope(['ANIMATIONS', 'IN'], animations_scope, compiled_pop_classes_script, pop_class_script);

    ok(_.isEqual(compiled_pop_classes_script, {click_to_close: false, animation_in_box: animations_scope.box}), "Basic scope property registration");

    PS.compileScope(['CSS_CLASSES'], classes_scope, compiled_pop_classes_script, pop_class_script);
    ok(_.isEqual(compiled_pop_classes_script, {click_to_close: false, animation_in_box: animations_scope.box, css_class_box: classes_scope.box}),
        "Scope registration after existing scope registration");

    PS.compileScope(['ANIMATIONS', 'OUT'], multi_animations_scope, compiled_pop_classes_script, pop_class_script);

    ok(_.isEqual(compiled_pop_classes_script, {click_to_close: false, animation_in_box: animations_scope.box, animation_out_cover: multi_animations_scope.cover, animation_out_box: multi_animations_scope.box, css_class_box: classes_scope.box}),
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
    ok(_.isEqual(PS.convert.boxPosition("auto"), ["auto", false, false, false]), "Compiled position for auto");
    ok(_.isEqual(PS.convert.boxPosition("auto+scrolled"), ["auto", true, false, false]), "Compiled position for auto with scroll");
    ok(_.isEqual(PS.convert.boxPosition("left"), [0, false, true, false]), "Compiled position for left");
    ok(_.isEqual(PS.convert.boxPosition("top"), [0, false, true, false]), "Compiled position for top");
    ok(_.isEqual(PS.convert.boxPosition("bottom"), [0, false, false, false]), "Compiled position for bottom");
    ok(_.isEqual(PS.convert.boxPosition("right"), [0, false, false, false]), "Compiled position for right");

    ok(_.isEqual(PS.convert.boxPosition(15), [15, false, true, false]), "Compiled position for number");

    ok(_.isEqual(PS.convert.boxPosition("15 +scrolled"), [15, true, true, false]), "Compiled position for string number + scrolled");


    console.log(PS.convert.boxPosition("15%"));
    ok(_.isEqual(PS.convert.boxPosition("15%"), [0.15, false, true, true]), "Compiled position for percentage");

    ok(_.isEqual(PS.convert.boxPosition("-0% + scrolled"), [0, true, false, true]), "Compiled position for bottom/right");

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

    console.log(PS.convert.positionCheck('50,10*, 49, 3*, 145* '));
    ok(_.isEqual(PS.convert.positionCheck(' 50,10*, 49, 3*, 145* '), [
        [50, 49],
        [10,3,145]
    ]), 'Multi timeout Multi interval');
});

test('PS.compile', function () {

    PS.compile({basic: {
        close_button: 'yes'
    }});

    ok(_.isEqual(PS.compiled_popscript, {basic: {close_button: true}}), "Basic test of single property (scope-less) compilation");


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

    PS.compile({
        basic: {
            close_content: 'x',
            CSS_CLASSES: {
                box: 'lol'
            }
        },
        second: {
            POSITION: {'horizontal': '10'}
        },
        third: {
            ANIMATIONS: {
                OUT: {
                    duration: 500
                }
            }
        }
    });

    ok(_.isEqual(PS.compiled_popscript,
        {
            basic: {close_content: 'x', css_class_box: 'lol'},
            second: {position_horizontal: [10, false, true, false]},
            third: {animation_out_duration: 500}

        }), "Intermediate test of multi-property-multi-class (scope-less) compilation");


});





