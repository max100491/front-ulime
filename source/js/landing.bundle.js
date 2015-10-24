var $ = require('jquery');
var modernizr = require('modernizr/modernizr.js');

var ddw = require('./partials/mapBlockDropDown.js');
var animate = require('./partials/customAnimate.js');

$('html').removeClass('no-js');
animate();
ddw();




// sideNav
// var ham = $('.header__hmbrgr');
var ham = document.getElementsByClassName('header__hmbrgr')[0];
var sideNav = document.getElementsByClassName('header__m-nav')[0];

ham.addEventListener('mousedown', function(){
	if ( sideNav.className.match(/(?:^|\s)active(?!\S)/) ){
		sideNav.className = sideNav.className.replace( /active/,'');
		console.log(sideNav.className)
	} else {
		sideNav.className += ' active';
	}
});

// ham.click(function(){
// 	sideNav.toggleClass('active');
// });