'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP


// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
        '2021-01-01T21:31:17.178Z',
        '2021-02-17T07:42:02.383Z',
        '2021-03-28T09:15:04.904Z',
        '2021-04-25T10:17:24.185Z',
        '2021-04-29T14:11:59.604Z',
        '2021-05-10T17:01:17.194Z',
        '2021-05-30T23:36:17.929Z',
        '2021-06-08T10:51:36.790Z',
      ],
      currency: 'EUR',
      locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
        '2021-01-05T13:15:33.035Z',
        '2021-02-25T09:48:16.867Z',
        '2021-03-10T06:04:23.907Z',
        '2021-04-05T14:18:46.235Z',
        '2021-04-25T16:33:06.386Z',
        '2021-05-15T14:43:26.374Z',
        '2021-05-30T18:49:59.371Z',
        '2021-06-07T12:01:20.894Z',
      ],
      currency: 'USD',
      locale: 'en-US',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    '2021-01-02T21:31:17.178Z',
    '2021-02-18T07:42:02.383Z',
    '2021-03-29T09:15:04.904Z',
    '2021-04-17T10:17:24.185Z',
    '2021-04-22T14:11:59.604Z',
    '2021-05-06T17:01:17.194Z',
    '2021-05-28T23:36:17.929Z',
    '2021-06-05T10:51:36.790Z',
  ],
  currency: 'USD',
  locale: 'en-US', // de-DE
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  movementsDates: [
    '2021-01-01T21:31:17.178Z',
    '2021-02-16T07:42:02.383Z',
    '2021-03-21T09:15:04.904Z',
    '2021-04-20T10:17:24.185Z',
    '2021-04-15T14:11:59.604Z',
   
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const accounts = [account1, account2, account3, account4];

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

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

//Function

const formatMovementDate = function(date ,locale){

      const calcDaysPassed = (date1 , date2) => Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
     
        const daysPassed = calcDaysPassed(new Date() , date);

        if(daysPassed === 0) return 'Today';
        if(daysPassed === 1 ) return 'Yesterday';
        if(daysPassed <= 7) return `${daysPassed} days ago`;

        else{ 

      // const day = `${date.getDate()}`.padStart(2 , 0);
      // const month = `${date.getMonth() + 1}`.padStart(2 , 0);
      // const year = date.getFullYear();
      
      
      //  return `${day}/${month}/${year}`

         return new Intl.DateTimeFormat(locale).format(date)
        }
      
}

const formatCur = function(value , locale , currency){
  return  new Intl.NumberFormat(locale , {
    style: 'currency',
    currency: currency,
  }).format(value);
}

const displayMovements = function(acc , sort = false) {
      containerMovements.innerHTML= ''

      //here we use slice not spread operator to copy bcz we r in the middle of the chain and we need to continue
      const movs = sort ? acc.movements.slice().sort((a , b) => a - b) : acc.movements;

      movs.forEach(function (mov , i ){
      const type = mov > 0 ? 'deposit' : 'withdrawal' ;

      const date = new Date(acc.movementsDates[i]);
      const displayDate = formatMovementDate(date , acc.locale)
      
      const formattedMov = formatCur(mov , acc.locale , acc.currency);
      
     

      const html = `
      <div class="movements__row">
          <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
          <div class="movements__date">${displayDate}</div>
          <div class="movements__value">${formattedMov}</div>
        </div>
      `;

      containerMovements.insertAdjacentHTML('afterbegin' , html);


  });
};

const calcDisplayBalance = function(acc){
      acc.balance = acc.movements.reduce((acc , mov) => acc + mov , 0);

    
      labelBalance.textContent = formatCur(acc.balance , acc.locale , acc.currency);


};

const calcDisplaySummary = function(acc){
  const incomes = acc.movements.filter(mov => mov > 0).reduce((acc , mov) => acc + mov , 0);
  labelSumIn.textContent = formatCur(incomes , acc.locale , acc.currency);
  
   const outGoing = acc.movements.filter(mov => mov < 0).reduce((acc , mov) => acc + mov , 0);
   labelSumOut.textContent = formatCur(Math.abs(outGoing) , acc.locale , acc.currency);

   const interest = acc.movements.filter(mov => mov >0 ).map(deposit => (deposit * acc.interestRate) / 100).filter(int => int >= 1).reduce((acc , int) => acc + int , 0);
   labelSumInterest.textContent = formatCur(interest , acc.locale , acc.currency);

};

const createUsernames = function(accs){
  accs.forEach(function(acc){
    acc.username = acc.owner.toLowerCase().split(' ').map( name => name[0]).join('');
  });
};

createUsernames(accounts);

const updateUI = function(acc){
  //Display Movements
  displayMovements(acc);

  //Display Balance
  calcDisplayBalance(acc)

  //Display summary
  calcDisplaySummary(acc);

}

const startLogOutTimer = function(){

  const tick = function(){
    const min = String(Math.trunc(time / 60)).padStart(2 , 0);
    const sec = String(time % 60).padStart(2 , 0);

    // In each call , print the remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;

  

    //when 0 second , stop timer and logout user
    if (time === 0){
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started'
         containerApp.style.opacity = 0;

    }

      //Decrease 1s
      time-- ;

  }

  //Set time to 5 minute
  let time = 120;

  //Call the timer every second
  tick();
  const timer = setInterval(tick , 1000);

  return timer ; 
}

let currentAccount , timer;

//FAKE ALWAYS LOGGED IN
// currentAccount = account1;
// updateUI(currentAccount)
// containerApp.style.opacity = 100 ;



btnLogin.addEventListener('click' , function(e){

  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value

  );
  console.log(currentAccount);
    
      if (currentAccount?.pin === +inputLoginPin.value){
         //Display UI and message
         labelWelcome.textContent = `Welcome back , ${currentAccount.owner.split(' ')[0]}`;
         containerApp.style.opacity = 100;

         //CREATE THE CURRENT DATES and time

         const now = new Date();

        
        const options= {
         hour: 'numeric',
         minute: 'numeric',
         day: 'numeric',
         month: 'numeric',
         year : 'numeric',
        //  weekday : 'long',

};

// const locale = navigator.language;
labelDate.textContent = new Intl.DateTimeFormat(currentAccount.locale , options).format(now);


        //  const day = `${now.getDate()}`.padStart(2 , 0);
        //  const month = `${now.getMonth() + 1}`.padStart(2 , 0);
        //  const year = now.getFullYear();
        //  const hour = `${now.getHours()}`.padStart(2 , 0);
        //  const min = `${now.getMinutes()}`.padStart(2 , 0);
        //  labelDate.textContent = `${day}/${month}/${year} , ${hour}:${min}`

         // Clear the input fields.
         inputLoginUsername.value = inputLoginPin.value = '' ;

         inputLoginPin.blur();
         inputLoginUsername.blur();
    
         //Timer
         if (timer) clearInterval(timer);
         timer = startLogOutTimer();


               
         updateUI(currentAccount);

        }
    });


     btnTransfer.addEventListener('click' , function(e){
       e.preventDefault();
       const amount = +inputTransferAmount.value;
       const receiverAcc = accounts.find(
         acc => acc.username === inputTransferTo.value
       );

       inputTransferTo.value = inputTransferAmount.value = '' ;

       inputTransferTo.blur();
       inputTransferAmount.blur();



       //we use optional chaining in below if condition to see if account exist
       if(amount > 0 && receiverAcc && currentAccount.balance >= amount && receiverAcc?.username !== currentAccount.username){
             //Doing the transfer.......
            currentAccount.movements.push(-amount);
            receiverAcc.movements.push(amount);

            //Add transfer date
            currentAccount.movementsDates.push(new Date().toISOString());
            receiverAcc.movementsDates.push(new Date().toISOString());
         
            updateUI(currentAccount);

            //Reset timer
            clearInterval(timer);
            timer = startLogOutTimer();
          
       }
       

     })

     btnLoan.addEventListener('click' , function(e){
       
       e.preventDefault();

       const amount = Math.floor(inputLoanAmount.value);

       if(amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)){
 
         setTimeout(function(){

         
          //add movement
          currentAccount.movements.push(amount);

          //Add loan date
          currentAccount.movementsDates.push(new Date().toISOString());

          //Update UI

          updateUI(currentAccount);

           //Reset timer
           clearInterval(timer);
           timer = startLogOutTimer();

        }, 3000);

   


       }


       inputLoanAmount.value = '' ;

       inputLoanAmount.blur();
       


     })

     btnClose.addEventListener('click' , function(e){
       e.preventDefault();
       
       

       if (inputCloseUsername.value === currentAccount.username && +inputClosePin.value === currentAccount.pin){
          
         const index = accounts.findIndex(acc => acc.username === currentAccount.username);

         //Delete Account
         accounts.splice(index, 1);

         //Hide UI
         containerApp.style.opacity = 0;


       }
       inputCloseUsername.value = inputClosePin.value = '' ;
     })

     let sorted = false;
     btnSort.addEventListener('click' , function(e){
       e.preventDefault();
       displayMovements(currentAccount , !sorted);
         sorted = !sorted;
     });




//////////////////////////////////////////////////////////////////////



const deposits = movements.filter(mov => mov > 0)
const withdrawls = movements.filter( mov => mov <0 )


const balance = movements.reduce((acc , cur) => acc + cur , 0);
// console.log(balance);


