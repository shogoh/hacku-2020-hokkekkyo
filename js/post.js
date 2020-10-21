function previewImage (obj) {
	var fileReader = new FileReader();
	fileReader.onload = (function() {
		document.getElementById('preview').src = fileReader.result;
	});
	fileReader.readAsDataURL(obj.files[0]);

	$("#upload-picture-button").fileExif(function(exif) {
		document.getElementById("longitude").value = "hoge";
		if (!exif) {
			console.log("exif情報なし");
			return;
		}
		if (!exif.GPSLatitude) {
			console.log("GPS情報なし");
			return;
		}
		var lat = exif.GPSLatitude[0]  + (exif.GPSLatitude[1] / 60)  + (exif.GPSLatitude[2] / 3600);
		var lng = exif.GPSLongitude[0] + (exif.GPSLongitude[1] / 60) + (exif.GPSLongitude[2] / 3600);
		// console.log({lat,lng}); // google maps とかで使える形式

		document.getElementsById("longitude").value = lng;
		document.getElementsById("latitude").value = lat;
	});
	
}