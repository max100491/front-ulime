var $ = require('jquery');
var animate = require('./partials/customAnimate.js')

$('html').removeClass('no-js');

animate();




// dropdown
var el = document.getElementById('map-block__dropdown');
var el2 = document.getElementsByClassName('map-block__dropdown-list')[0];
el.addEventListener('click', function(){
el2.classList.add('act');

});