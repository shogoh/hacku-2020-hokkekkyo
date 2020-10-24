function sendLoc () {
  // var text = document.getElementById("sendText").value;
  var lat = document.getElementById("lat").value;
  var lon = document.getElementById("lon").value;
  location.href = "main.html?latitude="+encodeURIComponent(lat) + "?longitude=" + encodeURIComponent(lon);
}