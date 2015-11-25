var headerLogin = document.getElementById("headerLogin"),
    headerList = document.getElementById("headerList");

headerLogin.addEventListener("click", function(event) {
  event.preventDefault();
  if (headerList.style.display == "block")
    headerList.style.display = "none";
  else
    headerList.style.display = "block";
});
