function demo() {
  alert('I\'m JavaScript!');
}

function calc(a,b) {
  let admin;
  let name;

  name = prompt("What is your name?",null);
  admin = name;
  // バッククォートで${name}囲むと変数nameの中身を出力できる.
  result = confirm(`are you ${admin} years old?`);
  alert((result?"you are older than me":"you are younger than me"));
}
function copyToClipboard() {
    // コピー対象をJavaScript上で変数として定義する
    var copyTarget = document.getElementById("copyTarget");

    // コピー対象のテキストを選択する
    copyTarget.select();

    // 選択しているテキストをクリップボードにコピーする
    document.execCommand("Copy");

    // コピーをお知らせする
    alert("コピーできました！ : " + copyTarget.value);
}

$(function(){
//appends an "active" class to .popup and .popup-content when the "Open" button is clicked
$(".open").on("click", function a(){
  $(".popup-overlay, .popup-content").addClass("active");
});

//removes the "active" class to .popup and .popup-content when the "Close" button is clicked 
$(".close, .popup-overlay").on("click", function(){
  $(".popup-overlay, .popup-content").removeClass("active");
});
});
