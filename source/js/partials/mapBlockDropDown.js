var $ = require('jquery');

function ddw(){

	// var cont = $('.map-block__button-wrap');
	var btn = $('#map-block__dropdown');
	var list = $('.map-block__dropdown-list');
	// var item = $('.map-block__dropdown-item');

	btn.on('click', function(){
		list.toggleClass('act');
	});
	list.on('click', '.map-block__dropdown-item', function(){
		btn.text($(this).text());
		list.removeClass('act');
	});
	$('body').click(function(e){
		if ( !(e.target.className.match(/map-block__dropdown/)) ) {
		    list.removeClass('act');
		 };
	});

};

module.exports = ddw;