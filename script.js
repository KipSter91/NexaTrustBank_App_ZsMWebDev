'use strict'   // JavaScript strict mode

//Selecting, Creating, and Deleting Elements

//Selecting Elements
console.log(document.documentElement); // <html> element
console.log(document.head); // <head> element
console.log(document.body); // <body> element

const header = document.querySelector('.header');  // Selects the first element with the class 'header'

const allSections = document.querySelectorAll('.section'); // Selects all elements with the class 'section'
console.log(allSections);

document.getElementById('section--1'); // Selects the element with the id 'section--1')

const allButtons = document.getElementsByTagName('button'); // Selects all button elements
console.log(allButtons);

console.log(document.getElementsByClassName('btn')); // Selects all elements with the class 'btn'

//Creating and Inserting Elements
// .insertAdjacentHTML

const message = document.createElement('div'); // Create a new element
message.classList.add('cookie-message'); // Add a class to the element
message.textContent = 'Weuse cookies for improved functionality and analytics.'; // Add text to the element
message.innerHTML = 'We use cookies for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>'; //Add HTML to the element

// header.prepend(message); // Add the element as the first child of the header element
header.append(message); // Add the element as the last child of the header element
// header.append(message.cloneNode(true)); // Add a copy of the element as the last child of the header element

// header.before(message); // Add the element before the header element (sibling element
// header.after(message); // Add the element after the header element

// Delete Elements
document.querySelector('.btn--close-cookie').addEventListener('click', () => message.remove());