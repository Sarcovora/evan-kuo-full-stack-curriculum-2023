/*
 * Write a JavaScript program to find the longest string in a given array
 * Write an arrow function that calculates the area of a rectangle
 * Write a JavaScript program to display the reading status (i.e. display
   book name, author name and reading status) of the following books:
 * (From slide 16 of: https://docs.google.com/presentation/d/1essRh0WoaFv948jVREw5WqM4Y3cPEr0n/edit#slide=id.p3) 
*/


var library = [ 
    {
        title: 'Bill Gates',
        author: 'The Road Ahead',
        readingStatus: true
    },
    {
        title: 'Steve Jobs',
        author: 'Walter Isaacson',
        readingStatus: true
    },
    {
        title: 'Mockingjay',
        author: 'Suzanne Collins',
        readingStatus: false
    }];

function longestString (arr) {
	let longest = "";
	for (let i = 0; i < arr.length; i++) {
		if (arr[i].length > longest.length) {
			longest = arr[i];
		}
	}
	return longest;
}

const areaOfRectangle = (length, width) => {
	return length * width;
}

function displayReadingStatus () {
	for (let i = 0; i < library.length; i++) {
		if (library[i].readingStatus) {
			console.log("You have read " + library[i].title + " by " + library[i].author);
		} else {
			console.log("You have not read " + library[i].title + " by " + library[i].author);
		}
	}
}