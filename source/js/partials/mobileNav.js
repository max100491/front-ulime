var $ = require('jquery');

function mobileNav(){
	var element = document.getElementsByClassName('header__hmbrgr')[0];
	var sideNav = document.getElementsByClassName('header__m-nav')[0];

	var eventName;
	'ontouchstart' in document.documentElement ? eventName = 'touchstart' : eventName = 'click';

	element.addEventListener(eventName, function(){
		$(sideNav).toggleClass('active');
	});
}

module.exports = mobileNav;