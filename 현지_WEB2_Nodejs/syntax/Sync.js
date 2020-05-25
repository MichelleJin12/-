var fs = require('fs');

/*
//readFileSync
console.log('A');
var result = fs.readFileSync('syntax/sample.txt','utf8');
console.log(result);
console.log('C');
*/

console.log('A');
//fs.readFile은 fs.readFileSynd와는 다르게 return 값을 주지 않음
//세번째 인자를 function으로 줘야함 (callback에 해당하는 argument)
fs.readFile('syntax/sample.txt','utf8',function(err,result){
  console.log(result);
});
console.log('C');
