//js에서 함수는 값이다!
var f = function(){
  console.log(1+1);
  console.log(1+2);
}
//함수를 배열에 담은 과정
var a = [f];
a[0]();//배열의 원소로써 함수 존재 가능

//함수를 객체에 담은 과정
var b = {
  func:f
}
b.func();

/*다른 statement는 객체 될 수 없음
  var i = if(true){console.log(1);}
  var w = while(true){console.log(1)};
*/
