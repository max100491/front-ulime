document.addEventListener("click", function(event){
  if(event.target.className == "questions-category__header") {
    event.preventDefault();
    event.target.parentNode.classList.toggle("questions-category_active");
  }
});
