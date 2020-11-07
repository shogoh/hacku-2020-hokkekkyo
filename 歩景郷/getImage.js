// Your web app's Firebase configuration
var firebaseConfig = {
	apiKey: "AIzaSyDGwSFtEvZ-nto4UKDmtTSd_NOX9oZ_X0s",
	authDomain: "hokkekkyo.firebaseapp.com",
	databaseURL: "https://hokkekkyo.firebaseio.com",
	projectId: "hokkekkyo",
	storageBucket: "gs://hokkekkyo.appspot.com",
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
var imgRef = picsRef.child('meijo.jpg');

// 画像に含まれるメタデータの取得
imgRef.getMetadata().then(function(metadata){
  document.getElementById("lat").value = metadata.customMetadata['latitude'];
  document.getElementById("lon").value = metadata.customMetadata['longitude'];
});

// 画像のURLを取得
imgRef.getDownloadURL().then(function(url){
  var img = document.getElementById('demo-img');
  img.src = url;
  document.getElementById("preview").src = url;
});
