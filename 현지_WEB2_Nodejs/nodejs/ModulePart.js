var M = {
  v: 'v',
  f: function(){
    console.log(this.v);
  }
}

//모듈이 담겨있는 ModulePart.js 파일에 있는 여러 기능 중
//M이 가리키는 객체를 이 모듈 밖에서 사용할 수 있도록 export하겠다.
module.exports = M;
