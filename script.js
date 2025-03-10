'use strict';

// Global Variables
const header = document.querySelector('.header');
const nav = document.querySelector('.nav');
const sections = document.querySelectorAll('.section');
const body = document.body;
const buttonScrollTo = document.querySelector('.btn--scroll-to');
const btnLogin = document.querySelector('.btn--login');
const section1 = document.querySelector('#section--1');

// Initialize Website
document.addEventListener('DOMContentLoaded', () => {
    createCookieMessage();
    loginBtn();
    setupSmoothScroll();
    setupTabbedComponent();
    setupNavAnimation();
    setupStickyNavbar();
    setupSectionReveal();
    setupLazyLoading();
    setupSlider();
});

// Cookie Message
function createCookieMessage() {
    const message = document.createElement('div');
    message.classList.add('cookie-message', 'hidden');
    message.innerHTML = `
        We use cookies for improved functionality and analytics. <br> You can log in using one of the following credentials to test the app's functionality: (br:2222; gf:5555; wb:9999; zm:1111)
        <button class="btn btn--close-cookie">Got it!</button>`;
    body.appendChild(message);

    // Show the cookie message after a delay
    setTimeout(() => {
        message.classList.remove('hidden');
        message.style.bottom = '0';
    }, 1000);

    // Style the message
    Object.assign(message.style, {
        backgroundColor: '#37383d',
        width: '100vw',
        height: `${parseFloat(getComputedStyle(message).height) + 30}px`,
    });

    // Delete the cookie message on button click
    document.querySelector('.btn--close-cookie').addEventListener('click', () => {
        message.style.bottom = '-100px';
        setTimeout(() => message.remove(), 1000);
    });
}

// Smooth Scrolling for Buttons
function setupSmoothScroll() {
    buttonScrollTo.addEventListener('click', () => {
        section1.scrollIntoView({ behavior: 'smooth' });
    });

    // Delegate smooth scrolling to header links
    header.addEventListener('click', e => {
        if (e.target.matches('a[href^="#"]')) {
            e.preventDefault();
            const targetId = e.target.getAttribute('href').substring(1);
            document.getElementById(targetId).scrollIntoView({ behavior: 'smooth' });
        }
    });
}

// Tabbed Component
function setupTabbedComponent() {
    const tabsContainer = document.querySelector('.operations__tab-container');
    const tabs = document.querySelectorAll('.operations__tab');
    const tabsContent = document.querySelectorAll('.operations__content');

    tabsContainer.addEventListener('click', e => {
        const clickedTab = e.target.closest('.operations__tab');
        if (!clickedTab) return;

        // Remove active classes
        tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
        tabsContent.forEach(content =>
            content.classList.remove('operations__content--active')
        );

        // Activate clicked tab and corresponding content
        clickedTab.classList.add('operations__tab--active');
        document
            .querySelector(`.operations__content--${clickedTab.dataset.tab}`)
            .classList.add('operations__content--active');
    });
}

// Navigation Fade Animation
function setupNavAnimation() {
    const handleHover = function (e) {
        if (e.target.classList.contains('nav__link')) {
            const hovered = e.target;
            const siblings = hovered.closest('.nav').querySelectorAll('.nav__link');
            const logo = hovered.closest('.nav').querySelector('img');
            siblings.forEach(el => {
                if (el !== hovered) el.style.opacity = this;
            });
            logo.style.opacity = this;
        }
    };
    nav.addEventListener('mouseover', handleHover.bind(0.5));
    nav.addEventListener('mouseout', handleHover.bind(1));
}

// Sticky Navbar using Intersection Observer API
function setupStickyNavbar() {
    const navHeight = nav.getBoundingClientRect().height;

    const stickyNav = entries => {
        const [entry] = entries;
        nav.classList.toggle('sticky', !entry.isIntersecting);
    };

    const headerObserver = new IntersectionObserver(stickyNav, {
        root: null,
        threshold: 0,
        rootMargin: `-${navHeight}px`,
    });

    headerObserver.observe(header);
}

// Section Reveal on Scroll
function setupSectionReveal() {
    const revealSection = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.remove('section--hidden');
                observer.unobserve(entry.target);
            }
        });
    };

    const sectionObserver = new IntersectionObserver(revealSection, {
        root: null,
        threshold: 0.2,
    });

    sections.forEach(section => {
        sectionObserver.observe(section);
        section.classList.add('section--hidden');
    });
}

// Lazy Loading Images
function setupLazyLoading() {
    const imgTargets = document.querySelectorAll('img[data-src]');

    const loadImg = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.src = entry.target.dataset.src;
                entry.target.addEventListener('load', () => {
                    entry.target.classList.remove('lazy-img');
                });
                observer.unobserve(entry.target);
            }
        });
    };

    const imgObserver = new IntersectionObserver(loadImg, {
        root: null,
        threshold: 0,
    });
    imgTargets.forEach(img => imgObserver.observe(img));
}

// Slider Component
function setupSlider() {
    const slides = document.querySelectorAll('.slide');
    const btnLeft = document.querySelector('.slider__btn--left');
    const btnRight = document.querySelector('.slider__btn--right');
    const dotContainer = document.querySelector('.dots');
    let currentSlide = 0;
    const maxSlide = slides.length - 1;

    const createDots = () => {
        slides.forEach((_, index) => {
            dotContainer.insertAdjacentHTML(
                'beforeend',
                `<button class="dots__dot" data-slide="${index}"></button>`
            );
        });
    };

    const activateDot = slide => {
        document
            .querySelectorAll('.dots__dot')
            .forEach(dot => dot.classList.remove('dots__dot--active'));
        document
            .querySelector(`.dots__dot[data-slide="${slide}"]`)
            .classList.add('dots__dot--active');
    };

    const goToSlide = slide => {
        slides.forEach(
            (s, i) => (
                (s.style.transform = `translateX(${100 * (i - slide)}%)`),
                (s.style.transition = 'transform 1.5s')
            )
        );
    };

    const nextSlide = () => {
        currentSlide = currentSlide === maxSlide ? 0 : currentSlide + 1;
        goToSlide(currentSlide);
        activateDot(currentSlide);
    };

    const prevSlide = () => {
        currentSlide = currentSlide === 0 ? maxSlide : currentSlide - 1;
        goToSlide(currentSlide);
        activateDot(currentSlide);
    };

    const initSlider = () => {
        goToSlide(0);
        slides.forEach((s, _) => (s.style.transition = 'none'));
        createDots();
        activateDot(0);
    };
    initSlider();

    // Event Handlers
    btnRight.addEventListener('click', nextSlide);
    btnLeft.addEventListener('click', prevSlide);
    document.addEventListener('keydown', e => {
        e.key === 'ArrowRight' && nextSlide();
        e.key === 'ArrowLeft' && prevSlide();
    });
    dotContainer.addEventListener('click', e => {
        if (e.target.classList.contains('dots__dot')) {
            const { slide } = e.target.dataset;
            goToSlide(slide);
            activateDot(slide);
        }
    });
}

//Login btn functionality
function loginBtn() {
    btnLogin.addEventListener('click', function (e) {
        e.preventDefault();
        window.location.href = this.getAttribute('data-href');
    });
}

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

//Lifecycle DOM events
//document ==> DOMContentLoaded
document.addEventListener('DOMContentLoaded', e => {
    console.log('HTML elements has been parsed and DOM tree has been created', e);

});

//window ==> load
window.addEventListener('load', e => { console.log('Page fully loaded.', e) });

//window ==> beforeunload (when you try to leave the page)
// window.addEventListener('beforeunload', e => {
//     e.preventDefault();
//     console.log(e);
//     e.returnValue = '';
// });

//Efficient sript loading ==> defer & async
