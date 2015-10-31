var $ = require('jquery');



;(function(){
	//flatCounter
	var inputVal = $('#form-ord__range_value');
	var value = inputVal.val();
	var el = $('#form-ord__range_val');
	var valGt = $('.form-ord__range_gt');
	var valLt = $('.form-ord__range_lt');

	el.html(value+'');

	valLt.click(function(){
		if ( inputVal.val() > 1 ) {
			var tt = inputVal.val();
			inputVal.val(--tt);
			inputVal.trigger('change');
		}
	});

	valGt.click(function(){
		if ( inputVal.val() < 5 ) {
			var tt = inputVal.val();
			inputVal.val(++tt);
			inputVal.trigger('change');
		}
	});

	inputVal.change(function(){
		if ( inputVal.val() <= 5 ) el.html($(this).val());
	});
})();





;(function(){

	var el = $('.order-det-nest');
	var footer = $('.footer');
	var zero  = el[0].getBoundingClientRect().bottom + 78;

	$(window).scroll(function(){
		if ( footer[0].getBoundingClientRect().top <= zero ) {
			el.addClass('unfixed')
		} else {
			el.removeClass('unfixed')
		}
	});
})();