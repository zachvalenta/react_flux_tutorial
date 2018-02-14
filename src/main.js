/* 
can ref import using '$' or 'jQuery'
Bootstrap needs jQuery in the global namespace
['Bootstrap install' 3:00]
seems patently insane to have vars for same value 
but I'm new here
*/
$ = jQuery = require('jquery');

var App = console.log('hello zv');
module.exports = App; 
// commonJS: export this, but Browserify makes sure that it's not in the global namespace ['Browserify config' 1:15]