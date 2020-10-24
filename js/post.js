// Your web app's Firebase configuration
var firebaseConfig = {
	apiKey: "AIzaSyDGwSFtEvZ-nto4UKDmtTSd_NOX9oZ_X0s",
	authDomain: "hokkekkyo.firebaseapp.com",
	databaseURL: "https://hokkekkyo.firebaseio.com",
	projectId: "hokkekkyo",
	storageBucket: "hokkekkyo.appspot.com",
	messagingSenderId: "359136951142",
	appId: "1:359136951142:web:7b7649f5106379bd8366a7",
	measurementId: "G-GL59KRQMHV"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

// cloud storageのルートディレクトリを参照
var storage = firebase.storage();
var storageRef = storage.ref();

// pictures下を参照
var picsRef = storageRef.child('pictures');


// 写真のプレビューを表示
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

	// submitボタンを押せるようにする
	document.getElementById("upload-button").disabled = false;
	
}
// firebaseに画像のアップロードを行う
function uploadPic() {
	var file = document.getElementById("upload-picture-button");
	if (document.getElementById("preview").src != ""){
		picsRef.child('hoge.png').put(file.files[0]);
		alert("写真を投稿しました！");
	}
}



