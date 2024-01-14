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
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = (movements) => {

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

displayMovements(account1.movements);

const createUserName = accs => accs.forEach(acc => acc.username = acc.owner.toLowerCase().split(' ').map(name => name.charAt()).join(''));
createUserName(accounts);
console.log(accounts);

const displayBalance = (movements) => {
  labelBalance.textContent = `${movements.reduce((acc, cur) => acc + cur, 0)}€`
}
displayBalance(account1.movements)