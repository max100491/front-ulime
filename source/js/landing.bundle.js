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





// dropdown
var el = document.getElementById('map-block__dropdown');
var el2 = document.getElementsByClassName('map-block__dropdown-list')[0];
el.addEventListener('click', function(){
el2.classList.add('act');

});