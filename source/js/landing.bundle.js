var $ = require('jquery');
var modernizr = require('modernizr/modernizr.js');

var ddw = require('./partials/mapBlockDropDown.js');
var animate = require('./partials/customAnimate.js');

$('html').removeClass('no-js');
animate();
ddw();




// sideNav
var ham = $('.header__hmbrgr');
var sideNav = $('.header__m-nav');

ham.click(function(){
	sideNav.toggleClass('active');
});