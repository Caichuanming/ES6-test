let a = 1;
const b = 2;
console.log(a+b);
console.log(b);
let obj1 = {a:1,b:2,c:3}
const obj2 = {d:4}
let obj = Object.assign(obj1,obj2);
console.log(obj === obj2);