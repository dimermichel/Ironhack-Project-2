const mongoose = require('mongoose');
const Category = require('../models/Category.model')

require('../configs/db.config');

const categories = [{
    name: 'Auto & Transport',
    subcategories: {
      1:'Auto Insurance', 
      2:'Auto Payment', 
      3:'Gas and Fuel', 
      4:'Parking', 
      5:'Public Transportation', 
      6:'Service and Parts'
    }
  },
  {
    name: 'Entertainment',
    subcategories: {
      1:'Auto Insurance', 
      2:'Auto Payment', 
      3:'Gas and Fuel'
    }
  },{
    name: 'Food',
    subcategories: {
      1:'Auto Insurance', 
      2:'Auto Payment'
    }
  }
]

const createCategories = categories.map(oneCateg => {
    console.log('=-=-=-=-', oneCateg.subcategories);
    // to check the name of our categories
  });

// const categories = [{
//     name: 'Auto & Transport',
//     subcategories: ['Auto Insurance', 'Auto Payment', 'Gas and Fuel', 'Parking', 'Public Transportation', 'Service and Parts']
//   },
//   {
//     name: 'Bill & Utilities',
//     subcategories: ['Mobile Phone', 'Internet', 'Television', 'Utilities']
//   },
//   {
//     name: 'Taxes',
//     subcategories: ['Property Tax', 'Sales Tax', 'State Tax', 'Federal Tax', 'Local Tax', ]
//   },
//   {
//     name: 'Transfer',
//     subcategories: ['Credit Card Payment', 'Transfer for Cash Spending']
//   },
//   {
//     name: 'Travel',
//     subcategories: ['Air Travel', 'Hotel', 'Rental Car and Taxi', 'Vacation']
//   },
//   {
//     name: 'Uncategorized',
//     subcategories: ['Cash and ATM', 'Check', 'State Tax']
//   },
//   {
//     name: 'Kids',
//     subcategories: ['Allowance', 'Baby Supplies', 'Babysitter and Daycare', 'Child Support']
//   },
//   {
//     name: 'Loans',
//     subcategories: ['Loan Fees and Charges', 'Loan Insurance', 'Loan Interest', 'LOan Payment', 'Loan Principal']
//   },
//   {
//     name: 'Personal Care',
//     subcategories: ['Hair', 'Laundry', 'Spa and Massage']
//   },
//   {
//     name: 'Pets',
//     subcategories: ['Pet Food and Supplies', 'Pet Grooming', 'Veterinary']
//   },
//   {
//     name: 'Shopping',
//     subcategories: ['Books', 'Clothing', 'Electronics and Software', 'Hobbies', 'Sporting Goods']
//   },
//   {
//     name: 'Business Services',
//     subcategories: ['Advertising', 'Lega', 'Office Supplies', 'Printing', 'Shipping']
//   },
//   {
//     name: 'Education',
//     subcategories: ['Books and Supplies', 'Student Loan', 'Tuition']
//   },
//   {
//     name: 'Entertaiment',
//     subcategories: ['Amusement', 'Arts', 'Movies and DVDs', 'Music', 'Newspapers and Magazines']
//   },
//   {
//     name: 'Fees & Charges',
//     subcategories: ['ATM Fee', 'Bank Fee', 'Finance Charge', 'Late Fee', 'Service Fee', 'Trade Commissions']
//   },
//   {
//     name: 'Food & Dinning',
//     subcategories: ['Alcohol and Bars', 'Coffee Shops', 'Fast Food', 'Groceries', 'Restaurants', ]
//   },
//   {
//     name: 'Gifts & Donations',
//     subcategories: ['Charity', 'Gift']
//   },
//   {
//     name: 'Health & Fitness',
//     subcategories: ['Dentist', 'Doctor', 'Eyecare', 'Gym', 'Health Insurance', 'Pharmacy', 'Sports']
//   },
//   {
//     name: 'Home',
//     subcategories: ['Furnishings', 'Home Improvement', 'Home Insurance', 'Home Service', 'Home Supplies', 'Lawn and Garden', 'Mortgage and Rent']
//   },
//   {
//     name: 'Income',
//     subcategories: ['Bonus', 'Interest Income', 'Paycheck', 'Reimbursement', 'Rental Income', 'Returned Purchase']
//   },
//   {
//     name: 'Investment',
//     subcategories: ['Buy', 'Deposit', 'Dividend and Cap Gains', 'Sell', 'Withdrawal']
//   }
// ]

// const createCategories = categories.map(oneCateg => {
//   console.log('=-=-=-=-', oneCateg.name);
//   // to check the name of our categories
// });