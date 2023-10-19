// MAP EXAMPLE
const array1 = [1, 4, 9, 16];

// pass a function to map
const map1 = array1.map(x => x * 2); // returns a new array
// console.log(map1);
// console.log(array1); // DOES NOT CHANGE ORIGINAL ARRAY


// FILTER EXAMPLE
const ages = [32, 33, 16, 40];
// console.log(ages.filter(checkAdult));
function checkAdult(age) { // DOES NOT MATTER WHERE THIS IS DEFINED
  return age >= 18;
}

// ForEach EXAMPLE
const array2 = ['a', 'b', 'c'];
array2.forEach(el => console.log(el)); // Doesn't return anything

// Deconstruction EXAMPLE
const hero = {
	n: 'Batman',
	realName: 'Bruce Wayne'
};
const { n, realName } = hero;
// console.log(n);
// console.log(realName);
// console.log(hero);

// Spread Operator EXAMPLE
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const arr3 = [...arr1, ...arr2];
console.log(arr3);

let obj1 = { foo: 'bar', x: 42 };
let obj2 = { foo: 'baz', y: 13 };
console.log({ ...obj1, ...obj2 })


// Short Circuiting EXAMPLE
let online = true;
let printData = () => {
	console.log("Hello World");
}
online && printData(); // if online is true, printData() will be called