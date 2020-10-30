/*マップの定義 leafletを使用 */
let mymap=L.map("map")
mymap.setView([35.1356448, 136.9760683], 17);//初期位置、ズームレベル

new L.tileLayer('http://tile.openstreetmap.jp/{z}/{x}/{y}.png',
  {
    //オープンストリートマップをデフォルトとして使用
  attribution: '&copy; <a href="http://osm.org/copyright" target="_blank">OpenStreetMap</a>',
  maxZoom: 18
}).addTo(mymap)

//オープンストリートマップを使用（デフォルトは地理院地図）
// let osm = L.tileLayer('http://tile.openstreetmap.jp/{z}/{x}/{y}.png',
//     {attribution: "<a href='http://osm.org/copyright' target='_blank'>OpenStreetMap</a> contributors"});
// osm.addTo(mymap);


let watch_id;// イベントハンドラid,
let dist;// 目的地の位置情報, 
let now; // 現在地の位置情報
let cnt = 0;//ヒントを与えた回数
let tol = 5;//許容誤差(m)
let now_lat;　//現在の緯度
let now_lon; //現在の経度
let dist_lat; //目的地の緯度
let dist_lon; //目的地の経度


// map画面に遷移後、目的地の緯度経度を取得
window.onload = function(){
  var data = location.href.split("?")[1];
  dist_lat = data.split("&")[0].split("=")[1];
  dist_lon = data.split("&")[1].split("=")[1];
  // document.getElementById("message").innerHTML = decodeURIComponent(text);
}

  /*2点間距離を算出するプログラム */
function calc_euclid_dist(mode=true) {

  // 参考ページ；https://qiita.com/chiyoyo/items/b10bd3864f3ce5c56291(ヒュベニの公式)
  // mode: true -> 世界測地系; false -> 日本測地系.

  // 緯度経度をラジアンに変換
  let radnow_lat = (now_lat) * (Math.PI / 180); // 緯度１
  let radnow_lon = (now_lon) * (Math.PI / 180); // 経度１
  let raddist_lat = (dist_lat) * (Math.PI / 180); // 緯度２
  let raddist_lon = (dist_lon) * (Math.PI / 180); // 経度２

  // 緯度差
  let radLatDiff = radnow_lat - raddist_lat;

  // 経度差算
  let radLonDiff = radnow_lon - raddist_lon;

  // 平均緯度
  let radLatAve = (radnow_lat + raddist_lat) / 2.0;

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

  // 小数点以下を切り捨てる
  dist = dist.toFixed();

  return dist;
  }

// 現在地からみた目的地の方角を角度で算出
function calc_direction () {

  // 緯度経度をラジアンに変換
  let radnow_lat = (now_lat) * (Math.PI / 180); // 緯度１
  let radnow_lon = (now_lon) * (Math.PI / 180); // 経度１
  let raddist_lat = (dist_lat) * (Math.PI / 180); // 緯度２
  let raddist_lon = (dist_lon) * (Math.PI / 180); // 経度２

  // 経度差
  let radLonDiff = radnow_lon - raddist_lon;

  let arg1 = Math.sin(radLonDiff);
  let arg2 = Math.cos(radnow_lat) * Math.tan(raddist_lat) - Math.sin(radnow_lat) * Math.cos(radLonDiff);

  let dir = 90.0 - Math.atan2(arg1, arg2);

  // 小数点2桁以下を切り捨てる
  dir = dir.toFixed(2);

  // 16方位から適切なものを選択
  int_dir = ["北北東","北東","東北東","東","東南東","南東","南南東","南","南南西","南西","西南西","西","西北西","北西","北北西","北"]
  let left = 12.5; 
  for (var i = 0;i < 15;i++) {
    if (left <= dir && dir < (left + 22.5)){
      dir = int_dir[i];
      break;
    }
    if (i == 14){
      dir = int_dir[15];
    }
    left += 22.5;
  }

  return dir;
}

// ヒントを与える
function calc_hint(pos) {

  if (cnt == 0){
    //現在地から目的地までの方角を算出(1回目のヒント)
    // window.alert("方角:" + calc_direction() + "\n方位角は北:0度、東:90度、南:180度、西:270度");
    document.getElementById("hintText").textContent = "方角:" + calc_direction() + "\n";
  }
  else if (cnt == 1){
    // 現在地から目的地までの距離を算出（2回目のヒント）
    // window.alert("緯度:" + now_lat + ", 経度:" + now_lon + ",写真の場所までの距離:" + calc_euclid_dist());
    document.getElementById("hintText").textContent += "距離:" + calc_euclid_dist() + "m";
  }
  else if (cnt == 2) {
    // 3回目は答えを出す
    L.marker([dist_lat, dist_lon]).addTo(mymap).bindPopup("<p>ゴール</p>");
    mymap.setView([dist_lat, dist_lon]);
    document.getElementById("hintText").textContent = "ゴールはここだよ！";
  }

};

	// エラーコードのメッセージを定義
function errorFunc( error )
{
	let errorMessage = {
		0: "原因不明のエラーが発生しました…。" ,
		1: "位置情報の取得が許可されませんでした…。" ,
		2: "電波状況などで位置情報が取得できませんでした…。" ,
		3: "位置情報の取得に時間がかかり過ぎてタイムアウトしました…。" ,
};
	// エラーコードに合わせたエラー内容をアラート表示
	alert( errorMessage[error.code] ) ;
}

// オプション・オブジェクト
/*https://developer.mozilla.org/ja/docs/Web/API/PositionOptions:*/
let optionObj = {
  // 高精度を必要とするか
  "enableHighAccuracy": false ,
  // 位置情報取得時間の上限
  "timeout": 8000 ,
  // 一度取得した位置情報の有効期限
	"maximumAge": 3000 ,
};

// 現在地の更新を行う && ゴール判定
function successFunc (pos) {

  // 現在地の更新をする前にピンを消す
  if((now != null)) mymap.removeLayer(now);

  now_lat = pos.coords.latitude;　//現在の緯度の更新
  now_lon = pos.coords.longitude; //現在の経度の更新

  // リアルタイムの現在の自分の位置をマップに表示
  now = L.marker([now_lat, now_lon]).addTo(mymap);
  mymap.setView([now_lat, now_lon]);//現在場所、ズームレベル

//  目的地誤差5m以内ならゴール判定とする。
  if(calc_euclid_dist() <= tol){
    // ゴール判定ができるようになったらボタンを転倒させる
    if (document.getElementById("find-dist").style.visibility == "hidden"){
      document.getElementById("find-dist").style.visibility = "visible";
    }
  }
  else {
    // ゴールから遠かったらボタンを隠す
    if (document.getElementById("find-dist").style.visibility == "visible"){
      document.getElementById("find-dist").style.visibility = "hidden";
    }
  }
    // 位置情報が現在地==目的地であるならばゴールと判定
  // if (now_lat == dist_lat && now_lon == dist_lon){
  //   alert('Congratulations!! \n 写真の場所を見つけたよ！');
  //   navigator.geolocation.clearWatch(watch_id);
  // }
}

// 発見ボタンが押された後、ウォッチを終了
function findIt() {
  navigator.geolocation.clearWatch(watch_id);
}

// ヒントとなる目的地までの距離,方角を算出
function get_hint() {
  if (confirm("投稿しますか？")) {
    if (now_lat == null || now_lon == null){
      alert("位置情報がありません。 \n位置情報をオンにしてください");
      return;
    }
    alert("共有しました！")
    // ヒントを与える
    calc_hint();

    // ヒント回数をインクリメント
    cnt++;
  }
}

// 定期的にユーザの位置情報を取得　idには登録されたハンドラを識別するIDが入る
watch_id = navigator.geolocation.watchPosition(successFunc, errorFunc, optionObj);
