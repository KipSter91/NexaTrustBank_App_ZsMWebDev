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

// Elements
const ca = 'classList.add';

const loginForm = document.querySelector('.login');
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerNav = document.querySelector('.nav');
const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');
const btnLogOut = document.createElement('button');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

//cumpute usernames
const createUserName = accs => accs.forEach(acc => acc.username = acc.owner.toLowerCase().split(' ').map(name => name.charAt()).join(''));
createUserName(accounts);

console.log(accounts);

//display elements from the data of the account
const displayMovements = (movements) => {
  containerMovements.innerHTML = '';
  movements.forEach((mov, i) => {
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

const displayBalance = (movements) => {
  labelBalance.textContent = `${movements.reduce((acc, cur) => acc + cur, 0)}€`
}

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


//Event Handlers

// Function to find an account based on username and PIN
const findAccount = (username, pin) => accounts.find(acc => acc.username === username && acc.pin === Number(pin));

// Event listener for the login button
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  const inputUsername = inputLoginUsername.value;
  const inputPin = Number(inputLoginPin.value);

  // Find the account
  const currentAccount = findAccount(inputUsername, inputPin);

  if (currentAccount) {
    // Display account information and update the UI
    displayMovements(currentAccount.movements);
    displayBalance(currentAccount.movements);
    displaySummary(currentAccount);
    btnLogOut.classList.remove('hidden');
    containerApp.classList.add('addopacity');
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ').at(0)}`;
    loginForm.classList.add('hidden');
    labelWelcome.classList.add('loggedin');
    containerNav.appendChild(btnLogOut);
    btnLogOut.textContent = 'Logout';
    btnLogOut.classList.add('logout__btn');

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
  } else {
    // Handle invalid login
    labelWelcome.textContent = 'Invalid login credentials!';
    inputLoginUsername.value = inputLoginPin.value = '';
    containerApp.classList.remove('addopacity');
  }
});

//Eventlistener for logout button
btnLogOut.addEventListener('click', () => {
  btnLogOut.classList.add('hidden');
  loginForm.classList.remove('hidden');
  inputLoginUsername.value = inputLoginPin.value = '';
  containerApp.classList.remove('addopacity');
  labelWelcome.textContent = 'Log in to get started:'
});

//Transer 