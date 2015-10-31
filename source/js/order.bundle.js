var $ = require('jquery');
var s = require('jquery-sticky');

$('.order-det-nest').sticky({
	topSpacing: 140,
	bottomSpacing: 200
});

console.log('xmm')


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