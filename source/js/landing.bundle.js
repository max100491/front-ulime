var $ = require('jquery');
var modernizr = require('modernizr/modernizr.js');

var ddw = require('./partials/mapBlockDropDown.js');
var animate = require('./partials/customAnimate.js');
var mobileNav = require('./partials/mobileNav.js');

$('html').removeClass('no-js');
window.onload = animate;
ddw();
mobileNav();