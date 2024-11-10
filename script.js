'use strict'   // JavaScript strict mode

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////WEBSITE//////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Creating the cookie-message
const header = document.querySelector('.header'); // Selects the first element with the class 'header'
const sections = document.querySelectorAll('.section');
const body = document.querySelector('body');
// console.log(body);
// console.log(sections);
const nav = document.querySelector('.nav');
const message = document.createElement('div'); // Create a new element
message.classList.add('cookie-message');
message.classList.add('hidden') // Add a class to the element
message.innerHTML = 'We use cookies for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>'; //Add HTML to the element
document.body.appendChild(message); // Add the element as the last child of the header element


// Show the cookie message
setTimeout(() => {
    message.style.bottom = 0;
    message.classList.remove('hidden');
}, 1000); // Delayed appearance for smoother effect


//Formatting the cookie message style with JS
message.style.backgroundColor = '#37383d';
message.style.width = '100vw';
message.style.height = Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';


//Deleting the cookie message
document.querySelector('.btn--close-cookie').addEventListener('click', () => {
    message.style.bottom = '-100px';
    setTimeout(() => {
        message.remove();
    }, 300); // Delay removal to ensure smooth transition
});


//Implementing smooth scrolling for the button on the welcome screen
const buttonScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

buttonScrollTo.addEventListener('click', () => {
    section1.scrollIntoView({ behavior: 'smooth' })
});


//Implementing smooth scrolling for the nav bar buttons (my own version 1.0)
//BUT THIS IS NOT EFFICIENT with huge website because it will create a new event listener for each button
// document.querySelectorAll('a[href^="#"]').forEach(anchor => {
//     anchor.addEventListener('click', function (e) {
//         e.preventDefault();

//         const target = document.querySelector(this.getAttribute('href'));
//         const offsetTop = target.offsetTop;

//         window.scrollTo({
//             top: offsetTop,
//             behavior: 'smooth'
//         });
//     });
// });


//Efficient way to implement smooth scrolling for the nav bar buttons (with event delegation; (my own version 2.0))
header.addEventListener('click', function (e) {
    if (e.target.matches('a[href^="#"]')) { // Check if the clicked element is an anchor with href starting with '#'
        e.preventDefault();
        document.getElementById(e.target.getAttribute('href').substring(1)).scrollIntoView({ behavior: 'smooth' });
    }
});

//Tabbed components
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

tabsContainer.addEventListener('click', function (e) {
    const clickedTab = e.target.closest('.operations__tab');

    // Guard clause
    if (!clickedTab) return;

    // Remove active classes from all tabs and contents
    tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
    tabsContent.forEach(content => content.classList.remove('operations__content--active'));

    // Activate clicked tab
    clickedTab.classList.add('operations__tab--active');

    // Activate corresponding content
    const contentId = clickedTab.dataset.tab;
    console.log(contentId);
    const correspondingContent = document.querySelector(`.operations__content--${contentId}`);
    console.log(correspondingContent);
    correspondingContent.classList.add('operations__content--active')
});


//Menu fade animation
//Version A) without bind method
//creating a new function to make our code a bit more dry
// const opacityControl = (event, opacityValue) => {
//     if (event.target.classList.contains('nav__link')) {
//         const hovered = event.target;
//         const siblings = hovered.closest('.nav').querySelectorAll('.nav__link');
//         const logo = hovered.closest('.nav').querySelector('img');
//         siblings.forEach(el => {
//             if (el !== hovered) el.style.opacity = opacityValue;
//         })
//         logo.style.opacity = opacityValue
//     }
// }
// //hovered with mouse
// nav.addEventListener('mouseover', event => opacityControl(event, 0.5));
// //unhovered with mouse
// nav.addEventListener('mouseout', event => opacityControl(event, 1));

//Version B with bind method, can't use arrow function
const opacityControl = function (e) {
    if (e.target.classList.contains('nav__link')) {
        const hovered = e.target;
        const siblings = hovered.closest('.nav').querySelectorAll('.nav__link');
        const logo = hovered.closest('.nav').querySelector('img');
        siblings.forEach(el => {
            if (el !== hovered) el.style.opacity = this;
        })
        logo.style.opacity = this;
    };
};
//Passing "argument" into handler
//hovered with mouse
nav.addEventListener('mouseover', opacityControl.bind(0.5));
//unhovered with mouse
nav.addEventListener('mouseout', opacityControl.bind(1));


//Sticky navbar
//Performance killer version (using the scroll event listener)
// const stickNavCoords = section1.getBoundingClientRect();

// window.addEventListener('scroll', e => {
//     if (window.scrollY >= stickNavCoords.top) nav.classList.add('sticky')
//     else nav.classList.remove('sticky')
// })

//Sticky navbar using Intersection Observer API
const navHeight = nav.getBoundingClientRect().height;
const stickyNav = entries => {
    entries.forEach(entry => {
        !entry.isIntersecting ? nav.classList.add('sticky') : nav.classList.remove('sticky')
    })
}

const headerObserver = new IntersectionObserver(stickyNav, {
    root: null,
    threshold: 0,
    rootMargin: `-${navHeight}px`
})

headerObserver.observe(header);

//Sections reveal-on
const revealSect = (entries, observer) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return
        entry.target.classList.remove('section--hidden')
        observer.unobserve(entry.target)
    })
}

const sectionObserver = new IntersectionObserver(revealSect, {
    root: null,
    threshold: 0.20,
})

sections.forEach(section => {
    sectionObserver.observe(section);
    section.classList.add('section--hidden')
});


//Lazy loading images
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = (entries, observer) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return
        entry.target.src = entry.target.dataset.src;
        entry.target.addEventListener('load', () => {
            // Remove the lazy-img class after the image is loaded
            entry.target.classList.remove('lazy-img');
        });
        observer.unobserve(entry.target)
    })

}

const imgObserver = new IntersectionObserver(loadImg, {
    root: null,
    threshold: 0
})

imgTargets.forEach(img => imgObserver.observe(img));


/// Slider
const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');

let currentSlide = 0;
const maxSlide = slides.length - 1;

// Initialize the slider: position slides without transition
const initSlider = () => {
    slides.forEach((slide, index) => {
        slide.style.transform = `translateX(${100 * index}%)`;
        slide.style.transition = 'none'
    });
}

// Enable slide transition after initial positioning
const enableTransition = () => {
    slides.forEach(slide => {
        slide.style.transition = 'transform 1s';
    });
};

// Go to a specific slide
const goToSlide = (slideIndex) => {
    slides.forEach((slide, index) => {
        slide.style.transform = `translateX(${100 * (index - slideIndex)}%)`;
        enableTransition();
    });
};

// Move to the previous slide
const prevSlide = () => {
    currentSlide = currentSlide === 0 ? maxSlide : currentSlide - 1;
    goToSlide(currentSlide);
};

// Move to the next slide
const nextSlide = () => {
    currentSlide = currentSlide === maxSlide ? 0 : currentSlide + 1;
    goToSlide(currentSlide);
};

// Event listeners for navigation buttons
btnLeft.addEventListener('click', prevSlide);
btnRight.addEventListener('click', nextSlide);

// Initialize the slider
initSlider();



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////LECTURES/////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Selecting, Creating, and Deleting Elements
//Selecting Elements
// console.log(document.documentElement); // <html> element
// console.log(document.head); // <head> element
// console.log(document.body); // <body> element

// const allSections = document.querySelectorAll('.section'); // Selects all elements with the class 'section'
// console.log(allSections);

// document.getElementById('section--1'); // Selects the element with the id 'section--1')

// const allButtons = document.getElementsByTagName('button'); // Selects all button elements
// console.log(allButtons);

// console.log(document.getElementsByClassName('btn')); // Selects all elements with the class 'btn'

//Creating and Inserting Elements
// .insertAdjacentHTML

// message.textContent = 'Weuse cookies for improved functionality and analytics.'; // Add text to the element

// header.prepend(message); // Add the element as the first child of the header element
// header.append(message.cloneNode(true)); // Add a copy of the element as the last child of the header element

// header.before(message); // Add the element before the header element (sibling element
// header.after(message); // Add the element after the header element


// Styles, Attributes, and Classes
// // Styles

// console.log(message.style.color); // Returns the inline style of the element
// console.log(message.style.backgroundColor); // Returns the inline style of the element

// console.log(getComputedStyle(message).color); // Returns the computed style of the element


// document.documentElement.style.setProperty('--color-primary', 'orangered');

//Attributes
// const logo = document.querySelector('.nav__logo');
// console.log(logo.alt); // Returns the value of the alt attribute

// console.log(logo.src); // Returns the absolute URL of the src attribute
// console.log(logo.getAttribute('src')); // Returns the relative URL of the src attribute

// logo.setAttribute('alt', 'Fantastic NexaTrust logo'); // Sets the value of the alt attribute
// console.log(logo.getAttribute('alt')); // Returns the value of the alt attribute

// //Non-standard attributes
// console.log(logo.getAttribute('designer'));

// logo.setAttribute('company', 'ZsMWebDev');
// console.log(logo.getAttribute('company'));

// const link = document.getElementById('portfolio');
// console.log(link.href); // Returns the absolute URL of the href attribute

// //Data attributes
// console.log(logo.dataset.versionNumber); // Returns the value of the data-version-number attribute


// //Classes
// logo.classList.add('c', 'j'); // Adds the classes 'c' and 'j' to the element you can add multiple classes at once by separating them with a comma
// logo.classList.remove('c', 'j');
// logo.classList.toggle('c', 'j');
// logo.classList.contains('c', 'j');

// // Don't use this method because it will overwrite all existing classes
// logo.className = 'zsolt';
// logo.className = 'nav__logo';


//Implementing Smooth Scrolling
//Oldschool way
// buttonScrollTo.addEventListener('click', (e) => {
//     const s1coords = section1.getBoundingClientRect();
//     window.scrollTo({
//         left: s1coords.left + window.scrollX,
//         top: s1coords.top + window.scrollY,
//         behavior: 'smooth'
//     })
// });

//Types of Events and Event Handlers
//Mouse Events
// const h1 = document.querySelector('h1');
// const alertH1 = (e) => {
//     alert('addEventListener: Great, you are reading the heading!')
//     removeEventListener('mouseenter', alertH1);
// };

//Modern handling of events you can add multiple event listeners to the same element
// h1.addEventListener('mouseenter', alertH1);

//Oldschool handling of events you can add only one event listener to the same element
// h1.onmouseenter = () => {
//     alert('onmouseenter: Great, your cursor is just hovered over the H1 element!')
// }

//Removing event listeners
// setTimeout(() => h1.removeEventListener('mouseenter', alertH1), 3000);

//Event propagation in practice
// const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
// const randomColor = () => `rgba(${getRandomInt(0, 255)},${getRandomInt(0, 255)},${getRandomInt(0, 255)})`;

// console.log(randomColor());

// document.querySelectorAll('.nav__link').forEach(link => link.addEventListener('click', function (e) {
//     this.style.backgroundColor = randomColor();
// }));

// document.querySelector('.nav__links').addEventListener('click', function (e) {
//     this.style.backgroundColor = randomColor();
// });

// document.querySelector('.nav').addEventListener('click', function (e) {
//     this.style.backgroundColor = randomColor();
// });

//DOM Traversing
//Going downwards: child
// const h1 = document.querySelector('h1');
// console.log(h1.querySelectorAll('.highlight'));
// console.log(h1.childNodes);
// console.log(h1.children);
// h1.firstElementChild.style.color = 'white';
// h1.lastElementChild.style.color = 'orangered';

// //Going upwards: parents
// console.log(h1.parentNode);
// console.log(h1.parentElement);
// // h1.parentElement.style.backgroundColor = 'red'

// h1.closest('.header').style.background = 'gray';
// h1.closest('h1').style.backgroundColor = 'var(--color-secondary)';

// const highLight = Array.from(h1.children); // Convert to array
// highLight.forEach(e => {
//     e.style.background = 'var(--gradient-primary)';
// });

// //Going sideways: siblings
// console.log(h1.previousElementSibling);
// console.log(h1.nextElementSibling);
// console.log(h1.parentElement.children);
// [...h1.parentElement.children].forEach((e) => {
//     if (e !== h1) e.style.transform = 'scale(0.5)'
// });