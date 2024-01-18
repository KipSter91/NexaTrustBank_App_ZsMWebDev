'use strict';

// NexaTrust Bank APP
// Data
const account1 = {
  owner: 'Zsolt Marku',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Barbara Marku',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30, 25000],
  interestRate: 1.5,
  pin: 2222,
};

const accounts = [account1, account2];


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


//Cumpute usernames
const createUserName = accs => accs.forEach(acc => acc.username = acc.owner.toLowerCase().split(' ').map(name => name.charAt()).join(''));
createUserName(accounts);


//Display movements
const displayMovements = (acc) => {
  containerMovements.innerHTML = '';
  acc.forEach((mov, i) => {
    const depoOrWith = mov > 0 ? 'deposit' : 'withdrawal';
    const movementHTML = `
    <div class= "movements__row">
      <div class="movements__type movements__type--${depoOrWith}">${i + 1}. ${depoOrWith}</div>
      <!-- <div class="movements__date">3 days ago</div> -->
      <div class="movements__value">${mov}€</div>
    </div>`
    containerMovements.insertAdjacentHTML('afterbegin', movementHTML);
  });
};

//Display balance
const displayBalance = (acc) => {
  acc.balance = acc.movements.reduce((acc, cur) => acc + cur, 0)
  labelBalance.textContent = `${acc.balance}€`
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

  labelSumIn.textContent = `${sumIn}€`;
  labelSumOut.textContent = `${sumOut}€`;
  labelSumInterest.textContent = `${acc.movements
    .filter(mov => mov > 0)
    .map(deposit => deposit * acc.interestRate / 100)
    .filter(interest => interest >= 1)
    .reduce((acc, interest) => acc + interest, 0)
    }€`
};


//Login UI
const LoginUI = () => {
  document.body.style.overflow = 'visible';
  btnLogOut.classList.remove('hidden');
  containerApp.classList.add('addopacity');
  containerNav.classList.remove('nav__login');
  containerNav.classList.add('nav__loggedin');
  loginForm.classList.add('hidden');
  labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ').at(0)}`;
}


//Create and style logout button
const createLogOutBtn = () => {
  containerNav.appendChild(btnLogOut);
  btnLogOut.classList.add('logout__btn');
  btnLogOut.textContent = 'Logout';
};


//Logout UI
const logOutUI = () => {
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
  displayMovements(acc.movements);
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
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
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
  const movementsUI = Array.from(document.querySelectorAll('.movements__value'), el => Number(el.textContent.slice(0, -1)))
  //with forEach method
  // const movementsUI = [];
  // getBalance.forEach(el => movementsUI.push(Number(el.textContent.slice(0, -1))));
  console.log(movementsUI);
})

//Transer money
btnTransfer.addEventListener('click', (e) => {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const transferAccount = accounts.find(acc => acc.username === inputTransferTo.value)
  if (transferAccount && transferAccount !== currentAccount) {
    if (transferAccount?.movements && currentAccount.balance >= inputTransferAmount.value) {
      if (inputTransferAmount.value > 0) {
        transferAccount.movements.push(amount);
        currentAccount.movements.push(-amount);
        updateUI(currentAccount)
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
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(amount);
    updateUI(currentAccount);
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
  if (currentAccount.username === inputCloseUsername.value && currentAccount.pin === Number(inputClosePin.value)) {
    const indexToRemove = accounts.findIndex(acc => acc.username === currentAccount.username);
    accounts.splice(indexToRemove, 1);
    logOutUI();
    openModal(`Your account has been succesfully deleted.`);
    console.log(accounts);
  } else {
    openModal('Invalid user credentials!')
  }
  inputCloseUsername.value = inputClosePin.value = '';
})

//Sort movements
// solution with using an array of functions;
const sortFunctions = [
  () => currentAccount.movements, // Original order; with original array
  () => [...currentAccount.movements].sort((a, b) => a - b), // Ascending; with shallow copy
  () => [...currentAccount.movements].sort((a, b) => b - a), // Descending; with shallow copy
];
let currentState = 0;

btnSort.addEventListener('click', (e) => {
  e.preventDefault();
  displayMovements(sortFunctions[currentState]());
  currentState = (currentState + 1) % sortFunctions.length;
});
