'use strict';

// NexaTrust Bank APP
// Data
const account1 = {
  owner: 'Zsolt Marku',
  movements: [200, 450, -400.29, 3000, -650.50, -130.99, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    "2023-11-18T21:31:17.178Z",
    "2023-12-23T07:42:02.383Z",
    "2024-01-20T09:15:04.904Z",
    "2024-01-21T10:17:24.185Z",
    "2024-01-26T14:11:59.604Z",
    "2024-01-29T17:01:17.194Z",
    "2024-02-03T13:36:17.929Z",
    "2024-02-04T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "nl-NL"
};

const account2 = {
  owner: 'Barbara Marku',
  movements: [5000, 3400, -150.11, -790, -3210.21, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    "2023-11-18T13:15:33.035Z",
    "2023-12-23T09:48:16.867Z",
    "2024-01-20T06:04:23.907Z",
    "2024-01-21T14:18:46.235Z",
    "2024-01-22T16:33:06.386Z",
    "2024-02-01T14:43:26.374Z",
    "2024-02-03T15:59:59.371Z",
    "2024-02-04T01:01:20.894Z",
  ],
  currency: "EUR",
  locale: "nl-NL"
};

const account3 = {
  owner: 'Wilko Beukers',
  movements: [15000, 14000, -2550.11, 790, -13210.21, 12000, 35000, -300, -5000, 10000, 1000, -1000],
  interestRate: 2.2,
  pin: 9999,
  movementsDates: [
    "2023-11-18T13:15:33.035Z",
    "2023-12-23T09:48:16.867Z",
    "2024-01-20T06:04:23.907Z",
    "2024-01-21T14:18:46.235Z",
    "2024-01-22T16:33:06.386Z",
    "2024-01-23T14:43:26.374Z",
    "2024-01-24T15:59:59.371Z",
    "2024-01-26T01:01:20.894Z",
    "2024-01-29T01:01:20.894Z",
    "2024-01-30T01:01:20.894Z",
    "2024-02-03T01:01:20.894Z",
    "2024-02-04T01:01:20.894Z",
  ],
  currency: "CHF",
  locale: "en-CH"
};

const account4 = {
  owner: 'Győző Follath',
  movements: [5000, 3400, -150.11, -790, -3210.21, -1000, 8500, -30, 200, 450, -400.29, 3000, -650.50, -130.99, 70, 1300],
  interestRate: 1.7,
  pin: 5555,
  movementsDates: [
    "2023-11-18T13:15:33.035Z",
    "2023-12-23T09:48:16.867Z",
    "2024-01-20T06:04:23.907Z",
    "2024-01-21T14:18:46.235Z",
    "2024-01-22T16:33:06.386Z",
    "2024-01-23T14:43:26.374Z",
    "2024-01-24T15:59:59.371Z",
    "2024-01-26T01:01:20.894Z",
    "2024-01-27T01:01:20.894Z",
    "2024-01-29T01:01:20.894Z",
    "2024-01-29T01:01:20.894Z",
    "2024-01-30T01:01:20.894Z",
    "2024-01-31T01:01:20.894Z",
    "2024-02-02T01:01:20.894Z",
    "2024-02-03T01:01:20.894Z",
    "2024-02-04T01:01:20.894Z"
  ],
  currency: "EUR",
  locale: "nl-NL"
};

const accounts = [account1, account2, account3, account4];


// DOM Elements
const modal = document.querySelector('.modal');
const modalMessage = document.querySelector('.modal-message');

const loginForm = document.querySelector('.login');
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerNav = document.querySelector('.nav__login');
const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');
const btnLogOut = document.createElement('button');
const btnCloseModal = document.querySelector('.close__modal');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');


//Define the current date
const currentDate = new Date();
//Define the end time for the timer
let endTime;
//Define the timer interval
let timerInterval;
//Function to update the timer & log out the user
const updateTimer = () => {
  const timeRemaining = new Date(endTime * 1000);
  endTime--;
  console.log(endTime);
  const minutes = timeRemaining.getMinutes();
  const seconds = timeRemaining.getSeconds();
  // Display the remaining time in a specific format (e.g., 05:30)
  const timerDisplay = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  // Update the timer element with the display
  labelTimer.textContent = timerDisplay;
  // Check if the timer has reached zero
  if (minutes === 0 && seconds === 0) {
    // Log the user out
    logOutUI();
    openModal('Your session has expired!');
  }
};


//Define the date format options
const options = {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: 'numeric',
  minute: 'numeric'
};

const options2 = {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit'
};


//Function to format the currency
const formatCurrency = (value, locale, currency) => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency
  }).format(value);
}


//Cumpute usernames
const createUserName = accs => accs.forEach(acc => acc.username = acc.owner.toLowerCase().split(' ').map(name => name.charAt()).join(''));
createUserName(accounts);


//Display greetings text based on the current time of day
const welcomeText = () => {
  const currentHour = currentDate.getHours();
  const text = ['Good morning', 'Good afternoon', 'Good evening']
  if (currentHour >= 3 && currentHour < 12) {
    return text[0];
  } if (currentHour >= 12 && currentHour < 18) {
    return text[1];
  } else {
    return text[2];
  }
};


//Sort movements
// solution with using an array of functions;
let currentState = 0;
const sortFunctions = [
  () => currentAccount.movements, // Original order; with original array
  () => [...currentAccount.movements].sort((a, b) => a - b), // Ascending; with shallow copy
  () => [...currentAccount.movements].sort((a, b) => b - a), // Descending; with shallow copy
];
btnSort.addEventListener('click', (e) => {
  e.preventDefault();
  currentState = (currentState + 1) % sortFunctions.length;
  displayMovements();
});


//Display movements & dates
const locale = navigator.language; //get the current browser language

const displayMovements = () => {
  //Display date after LogIn
  labelDate.textContent = new Intl.DateTimeFormat(currentAccount.locale, options).format(currentDate);
  //Clear the container
  containerMovements.innerHTML = '';
  //Display movements
  sortFunctions[currentState]().forEach((mov, i) => {
    const depoOrWith = mov > 0 ? 'deposit' : 'withdrawal';
    const movsDate = new Date(currentAccount.movementsDates[i]);

    //Calculate days passed since the transaction was made and display the date accordingly
    const daysPassed = (Math.round(Math.abs((currentDate - movsDate) / (24 * 60 * 60 * 1000))));

    //Function to check the date and display it accordingly
    const checkDate = () => {
      if (daysPassed === 0) return 'Today';
      if (daysPassed === 1) return 'Yesterday';
      if (daysPassed <= 7) return `${daysPassed} days ago`;
      else {
        return new Intl.DateTimeFormat(currentAccount.locale, options2).format(movsDate);
      }
    };
    //Create the movement HTML element and insert it into the DOM
    const movementHTML = `
    <div class= "movements__row">
      <div class="movements__type movements__type--${depoOrWith}">${i + 1}. ${depoOrWith}</div>
      <div class="movements__date">${checkDate()}</div>
      <div class="movements__value">${formatCurrency(mov, currentAccount.locale, currentAccount.currency)}</div>
    </div>`
    containerMovements.insertAdjacentHTML('afterbegin', movementHTML);
  });
};

// 

//Display balance
const displayBalance = (acc) => {
  acc.balance = acc.movements.reduce((acc, cur) => acc + cur, 0)
  labelBalance.textContent = `${formatCurrency(acc.balance, acc.locale, acc.currency)}`
}


//Display summary
const displaySummary = (acc) => {
  const { sumIn, sumOut } = acc.movements.reduce((acc, cur) => {
    if (cur > 0) {
      acc.sumIn += cur;
    } else if (cur < 0) {
      acc.sumOut += Math.abs(cur);
    }
    return acc;
  }, { sumIn: 0, sumOut: 0 });

  labelSumIn.textContent = `${formatCurrency(sumIn, acc.locale, acc.currency)}`;
  labelSumOut.textContent = `${formatCurrency(sumOut, acc.locale, acc.currency)}`;
  labelSumInterest.textContent = `${formatCurrency(acc.movements
    .filter(mov => mov > 0)
    .map(deposit => deposit * acc.interestRate / 100)
    .filter(interest => interest >= 1)
    .reduce((acc, interest) => acc + interest, 0), acc.locale, acc.currency)
    }`
};


//Login UI
const LoginUI = () => {
  window.scrollTo(0, 0);
  endTime = 299;
  timerInterval = setInterval(updateTimer, 1000);
  document.body.style.overflow = 'visible';
  btnLogOut.classList.remove('hidden');
  containerApp.classList.add('addopacity');
  containerNav.classList.remove('nav__login');
  containerNav.classList.add('nav__loggedin');
  loginForm.classList.add('hidden');
  labelWelcome.textContent = `${welcomeText()}, ${currentAccount.owner.split(' ').at(0)}`;
}


//Create and style logout button
const createLogOutBtn = () => {
  containerNav.appendChild(btnLogOut);
  btnLogOut.classList.add('logout__btn');
  btnLogOut.textContent = 'Logout';
};


//Logout UI
const logOutUI = () => {
  clearInterval(timerInterval);
  labelTimer.textContent = '05:00';
  window.scrollTo(0, 0);
  document.body.style.overflow = 'hidden';
  btnLogOut.classList.toggle('hidden');
  loginForm.classList.toggle('hidden');
  containerApp.classList.toggle('addopacity');
  containerNav.classList.toggle('nav__login');
  containerNav.classList.toggle('nav__loggedin');
  labelWelcome.textContent = 'Log in to get started:';
}


//Update UI
const updateUI = (acc) => {
  currentState = 0;
  displayMovements();
  displayBalance(acc);
  displaySummary(acc);
}


//Modal for the error messages
// Function to open the modal, open the modal with fade-in animation and display a message
const openModal = (message) => {
  modal.style.animation = 'fadeIn 0.5s ease-in-out';
  modalMessage.textContent = message;
  modal.style.display = 'block';
}


// Function to close the modal with fade-out animation
const closeModal = () => {
  modal.style.animation = 'fadeOut 0.5s ease-in-out';
  setTimeout(() => {
    modal.style.display = 'none'; // Hide the modal after animation
  }, 500); // Adjust the delay to match the animation duration
}


//EVENT HANDLERS
// Event listener to close the modal when clicking the close button
btnCloseModal.addEventListener('click', () => {
  closeModal();
});


// Event listener to close the modal when clicking outside the modal content
modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    closeModal();
  }
});


let currentAccount;
// Event listener for the login button
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);
  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display account information and update the UI
    updateUI(currentAccount);
    createLogOutBtn();
    LoginUI();
    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
  } else {
    // Handle invalid login
    openModal('Invalid login credentials!');
    inputLoginUsername.value = inputLoginPin.value = '';
    containerApp.classList.remove('addopacity');
  }
});


//Event listener for logout button
btnLogOut.addEventListener('click', () => {
  logOutUI();
  inputLoginUsername.value = inputLoginPin.value = '';
});


//Getmovements from UI (Array.from function) 
labelBalance.addEventListener('click', () => {
  const movementsUI = Array.from(document.querySelectorAll('.movements__value'), el => +el.textContent.slice(0, -1))
  //with forEach method 
  // const movementsUI = [];
  // getBalance.forEach(el => movementsUI.push(Number(el.textContent.slice(0, -1))));
  console.log(movementsUI);
})

//Transer money
btnTransfer.addEventListener('click', (e) => {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const transferAccount = accounts.find(acc => acc.username === inputTransferTo.value)
  if (transferAccount && transferAccount !== currentAccount) {
    if (transferAccount?.movements && currentAccount.balance >= inputTransferAmount.value) {
      if (inputTransferAmount.value > 0) {
        transferAccount.movements.push(amount);
        transferAccount.movementsDates.push(currentDate.toISOString());
        currentAccount.movements.push(-amount);
        currentAccount.movementsDates.push(currentDate.toISOString());
        updateUI(currentAccount);
        inputTransferTo.value = inputTransferAmount.value = '';
      } else {
        openModal(`Can't transfer a negative amount!`);
        inputTransferTo.value = inputTransferAmount.value = '';
      }
    } else {
      openModal('Insufficient balance!');
      inputTransferTo.value = inputTransferAmount.value = '';
    }
  } else {
    openModal('Invalid transfer account!');
    inputTransferTo.value = inputTransferAmount.value = '';
  };
});

//Request loan
btnLoan.addEventListener('click', (e) => {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(() => {
      currentAccount.movements.push(amount);
      currentAccount.movementsDates.push(currentDate.toISOString());
      updateUI(currentAccount);
    }, 5000);
    inputLoanAmount.value = '';
  } else {
    openModal('Invalid loan request!');
    inputLoanAmount.value = '';
  }
});

//Close account
btnClose.addEventListener('click', (e) => {
  e.preventDefault();
  //defensive programming to ensure that the array manipulation is safe
  if (currentAccount.username === inputCloseUsername.value && currentAccount.pin === +inputClosePin.value) {
    const indexToRemove = accounts.findIndex(acc => acc.username === currentAccount.username);
    accounts.splice(indexToRemove, 1);
    logOutUI();
    openModal(`Your account has been succesfully deleted.`);
    // console.log(accounts); //check if the account has been deleted
  } else {
    openModal('Invalid user credentials!')
  }
  inputCloseUsername.value = inputClosePin.value = '';
});