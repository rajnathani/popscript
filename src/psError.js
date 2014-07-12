var in_browser = !process && !process.env;


/*
 'console.error's the respective popscript error
 and optionally (depending on the settings of the popscript flags)
 alerts and/or throws the error.
 */
module.exports =  function (num, msg) {
    var full_msg = 'PopScript Error ' + num + ": " + msg;
    if (in_browser) {
      console.error(full_msg);
      if (PS.flags['alert error on error']) alert(full_msg);
      if (PS.flags['throw error on error'])  throw new Error(full_msg);
    } else {
      throw new Error(full_msg);
    }
};
