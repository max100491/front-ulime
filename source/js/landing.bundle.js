var $ = require('jquery');


// console.log($(window).height());

var win = $(window).height();
var win2 = win/2;

var h = $('.comment-box')[0];

// console.log(h);

// console.log()

$(window).scroll(function(){

	console.log(h.getBoundingClientRect().top);

	if (h.getBoundingClientRect().top < win2) $('.comment-box').addClass('comments-animate');

});