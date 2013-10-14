popscript_flags['alert error on error'] =  false; //turn off popscript alerts on error
popscript_flags['throw error on error'] =  true; //turn on throwing of errors on popscript error


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


module('Compiler');

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
    catch(error) {
        error_occurred = true;
    } finally {
        ok(error_occurred, 'Check string not beginning with y or n throws an error');
    }



});
