/*マップの定義 位置情報が欠損してる時使用 */
let mymap=L.map("map")
mymap.setView([35.1356448, 136.9760683], 17);//初期位置、ズームレベル

new L.tileLayer('http://tile.openstreetmap.jp/{z}/{x}/{y}.png',
  {
    //オープンストリートマップをデフォルトとして使用
  attribution: '&copy; <a href="http://osm.org/copyright" target="_blank">OpenStreetMap</a>',
  maxZoom: 18
}).addTo(mymap)

var marker = "";
mymap.on('click', function(e) {
	if(marker != "")mymap.removeLayer(marker);
	marker = L.marker(e.latlng).addTo(mymap);
	document.getElementById("latitude").value = e.latlng.lat;
	document.getElementById("longitude").value = e.latlng.lng;
});

/*マップ定義終了*/


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

// var photo1_ref = picsRef.child("photo1.jpg").getDownloadURL().then(function(url) {
//   // Or inserted into an <img> element:
// 	document.getElementById("preview").src = url;
// }).catch(function(error) {
//   // Handle any errors
// });

// モーダルを開く
function openModal() {
	document.getElementById('open-modal').click();
}

// 写真のプレビューを表示
function previewImage (obj) {
	var fileReader = new FileReader();
	fileReader.onload = (function() {
		document.getElementById('preview').src = fileReader.result;
	});
	fileReader.readAsDataURL(obj.files[0]);

	$("#upload-picture-button").fileExif(function(exif) {
		if (!exif || !exif.GPSLatitude) {
			console.log("GPS情報なし");
			// モーダルを開く
			openModal();
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
	var file = document.getElementById("upload-picture-button").files[0];
	// ファイル名でそのままfirebaseに保存
	picsRef.child(file.name).put(file);
	alert("写真を投稿しました！");
}



