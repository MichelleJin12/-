//배열
var members = ['a', 'b','c'];
console.log(members[1]);
var i = 0;
while (i < members.length){
  console.log('array loop',members[i]);
  i = i+1;
}

//객체
var roles = {
  'programmer':'hyunji',
  'designer' : 'sujin',
  'manager' : 'ara'
}
console.log(roles.designer);
console.log('My name is ...',roles['programmer']);
for(var name in roles){
  console.log('object', name , 'value =>',roles[name]);
}
