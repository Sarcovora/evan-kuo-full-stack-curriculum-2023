const var1 = 0;
// console.log(var1);

function isIt2022(year) {
	if (year==2022) {
		var text="YES";
	}
	// console.log(text+"yes");
	// console.log(text+" Yes!");
}
isIt2022(2022);



const obj = {name: "Evan", age: 18, major: "CS", student: true};
// console.log(obj);

let arr = [1, 2, 3, 4, 5];
console.log(arr);
console.log(arr.slice(1, 3));
console.log(arr);
arr.splice(1, 3);
console.log(arr)
arr.push(6)
console.log(arr)



// Arrow Functions
const func = (x, y) => {console.log(x+y)};
function func2(x, y) {console.log(x+y)}