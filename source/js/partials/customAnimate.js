var $ = require('jquery');

function animate(){

	var vh = $(window).height();

	var zeroLineHalf = vh/2;
	var zeroLineFour = vh - ( vh/4 );
	var zeroLineThird = vh - ( vh/3 );

	var element1 = $('.feature-box-nest')[0];
	var element2 = $('.comments')[0];

	if (element1.getBoundingClientRect().top < zeroLineFour) setTimeout(function(){$(element1).addClass('animate');}, 1000);
	if (element2.getBoundingClientRect().top < zeroLineFour) $(element2).addClass('animate');

	$(window).scroll(function(){

		if (element1.getBoundingClientRect().top < zeroLineFour) $(element1).addClass('animate');
		if (element2.getBoundingClientRect().top < zeroLineFour) $(element2).addClass('animate');

	});
};

module.exports = animate;