
let mymap=L.map("map")
mymap.setView([35.1356448, 136.9760683], 16);//初期位置、ズームレベル

new L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png',
  {
  attribution: '&copy; <a href="https://maps.gsi.go.jp/development/ichiran.html#std">国土地理院</a>',
  maxZoom: 18
}).addTo(mymap)

//オープンストリートマップを使用（デフォルトは地理院地図）
// let osm = L.tileLayer('http://tile.openstreetmap.jp/{z}/{x}/{y}.png',
//     {attribution: "<a href='http://osm.org/copyright' target='_blank'>OpenStreetMap</a> contributors"});
// osm.addTo(mymap);

let marker_meijo = L.marker([35.1356448, 136.9760683]).addTo(mymap);
marker_meijo.bindPopup("<p>名城大学</p>")
//marker.bindPopup("<p>地図を表示タイミングでポップアップ</p>").openPopup();

// 現在の位置情報

// Geolocation APIに対応していない場合にアラートを出す
if(!navigator.geolocation ){
  alert( "あなたの端末では、現在位置を取得できません。" ) ;
}
function calc_euclid_dist(lat1, lon1, lat2, lon2, mode=true) {
  // 参考ページ；https://qiita.com/chiyoyo/items/b10bd3864f3ce5c56291(ヒュベニの公式)
  // 緯度経度をラジアンに変換
  let radLat1 = (lat1) * (Math.PI / 180); // 緯度１
  let radLon1 = (lon1) * (Math.PI / 180); // 経度１
  let radLat2 = (lat2) * (Math.PI / 180); // 緯度２
  let radLon2 = (lon2) * (Math.PI / 180); // 経度２

  // 緯度差
  let radLatDiff = radLat1 - radLat2;

  // 経度差算
  let radLonDiff = radLon1 - radLon2;

  // 平均緯度
  let radLatAve = (radLat1 + radLat2) / 2.0;

  // 測地系による値の違い
  let a = mode ? 6378137.0 : 6377397.155; // 赤道半径
  let b = mode ? 6356752.314140356 : 6356078.963; // 極半径
  //$e2 = ($a*$a - $b*$b) / ($a*$a);
  let e2 = mode ? 0.00669438002301188 : 0.00667436061028297; // 第一離心率^2
  //$a1e2 = $a * (1 - $e2);
  let a1e2 = mode ? 6335439.32708317 : 6334832.10663254; // 赤道上の子午線曲率半径

  let sinLat = Math.sin(radLatAve);
  let W2 = 1.0 - e2 * (sinLat*sinLat);
  let M = a1e2 / (Math.sqrt(W2)*W2); // 子午線曲率半径M
  let N = a / Math.sqrt(W2); // 卯酉線曲率半径

  let t1 = M * radLatDiff;
  let t2 = N * Math.cos(radLatAve) * radLonDiff;
  let dist = Math.sqrt((t1*t1) + (t2*t2));

  if (dist >= 1000) {
    dist /= 1000;
    dist = dist + "km";
  }
  else {
    dist = dist + "m";
  }
  return dist;
  }
function successFunc(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;

  alert("緯度:" + latitude + ", 経度:" + longitude + ",名城大までの距離:" + calc_euclid_dist(latitude, longitude,35.1356448, 136.9760683));
  let marker_now = L.marker([latitude, longitude]).addTo(mymap);
  marker_now.bindPopup("<p>現在地</p>");
  mymap.setView([latitude, longitude], 16);//初期位置、ズームレベル
};
function errorFunc( error )
{
	// エラーコードのメッセージを定義
	var errorMessage = {
		0: "原因不明のエラーが発生しました…。" ,
		1: "位置情報の取得が許可されませんでした…。" ,
		2: "電波状況などで位置情報が取得できませんでした…。" ,
		3: "位置情報の取得に時間がかかり過ぎてタイムアウトしました…。" ,
};

	// エラーコードに合わせたエラー内容をアラート表示
	alert( errorMessage[error.code] ) ;
}
// オプション・オブジェクト
var optionObj = {
	"enableHighAccuracy": false ,
	"timeout": 8000 ,
	"maximumAge": 5000 ,
};

navigator.geolocation.getCurrentPosition(successFunc , errorFunc, optionObj);


function changeTxt(str) {
  

  // ヒントエリアの文字を変更
  document.getElementById('hintText').value = str;
}