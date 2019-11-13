function app(target) {
  target.user = '777';
}

@app
class test {
  user: string;
  constructor(){
    this.user = '666';
  }
}
console.log(test['user']); // 777
console.log(new test().user);// 666


//多层
function app2(user: string) {
  return function(target){
    target.user = user;
  }
}

@app2('bgbg')
class test2 {
  
}
console.log(test2['user']); // bgbg


//修改原型
function app3(target) {
  target.prototype.user = '777';
}

@app3
class test3 {
  user: string;
  constructor(){
    this.user = '666';
  }
}
console.log(new test3()['user']);// 666

@app3
class test4 {
  constructor(){
  }
}
console.log(new test4()['user']);// 777