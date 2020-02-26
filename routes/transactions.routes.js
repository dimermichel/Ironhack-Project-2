const express = require('express');
const router = express.Router();
const moment = require('moment');

const routeGuard = require('../configs/route-guard.config');

const Transaction = require('../models/Transaction.model');
const Account = require('../models/Account.model');
const listOfCategories = require('../data/category.data.js');

router.get('/transactions', routeGuard, (req, res, next) => {

  //Looking for all transactions of the logged user
  Transaction.find({
      owner: req.session.user._id
    })
    .then(currentTransactions => {
      //console.log({ currentTransaction });
      if (!currentTransactions) {
        res.render('transactions-views/show-transactions', {
          transaction: currentTransactions,
          errorMessage: "There is no Transaction."
        });
        return;
      }
      res.render('transactions-views/show-transactions', {
        transaction: currentTransactions
      });
    })
    .catch(err => console.log(err))
});

router.get('/add-transaction', routeGuard, (req, res, next) => {
  const category = listOfCategories.values
  //Setup Todays date to defaut when creating transaction date
  const today = moment(new Date()).format('YYYY-MM-DD')
  console.log(today)
  Account.find({
      owner: req.session.user._id
    })
    .then(currentAccounts => {
      //Checking if the user has an Account
      if (currentAccounts[0] === undefined) {
        res.render('transactions-views/add-transaction', {
          category,
          errorMessage: "You don't have an Account.",
          today
        })
        return;
      }
      res.render('transactions-views/add-transaction', {
        category,
        account: currentAccounts,
        today
      })
    })
    .catch(err => next(err))
})

router.post("/add-transaction", routeGuard, (req, res, next) => {

  let {
    amount,
    account,
    type,
    merchant,
    date,
    category,
    tags,
    notes
  } = req.body;

  let lastAccBalance = 0;

  if (amount === "" || merchant === "" || date === "") {
    res.render("transactions-views/add-transaction", {
      errorMessage: "Please fill up the required forms."
    });
    return;
  }
  let owner = req.session.user._id
  Transaction.create({
      amount,
      type,
      account,
      lastAccBalance,
      merchant,
      date,
      category,
      tags,
      notes,
      owner
    })
    // The Math of Adding or Subtracting from the Account Balance amount
    .then(createdTransaction => {
      console.log(createdTransaction);
      Account.findOne({
          _id: createdTransaction.account
        })
        .then(currentAccount => {
          console.log(currentAccount);
          let balance = currentAccount.accBalance
          if (createdTransaction.type === 'debit') {
            balance = balance - createdTransaction.amount;
          } else {
            balance = balance + createdTransaction.amount;
          }
          currentAccount.accBalance = balance;
          currentAccount.save();
        });
    })
    .then(() => {
      res.redirect("/transactions")
    })
    .catch(error => console.log(error))
});

router.get('/transactions/:id', routeGuard, (req, res, next) => {
  const category = listOfCategories.values
  Transaction.findById(req.params.id)
    .populate('account')
    .then(detailTransaction => {
      console.log(detailTransaction)
      //Filtering the  Available Categories
      const newAvailableCategories = category.filter(
        oneCategory => {
          if (detailTransaction.category === oneCategory) {
            return false
          }
          return true
        })

      // Parse the date from ISO to Date JS using Moment.js to display in the Date Input
      let str = detailTransaction.date;
      let date = moment(str);
      let dateComponent = date.utc().format('YYYY-MM-DD');

      //Render all the Data into the edit Transaction View
      res.render('transactions-views/edit-transaction', {
        transaction: detailTransaction,
        category: newAvailableCategories,
        date: dateComponent
      });

    })
    .catch(err => console.log(err))
});

router.post('/transactions/:id', routeGuard, (req, res, next) => {
  //Setup variables to calculate if it was a difference in the new amount
  let diffAmount = 0;
  let diffType = false;

  const {
    amount,
    type,
    merchant,
    date,
    category,
    tags,
    notes
  } = req.body;

  if (amount === "" || merchant === "" || date === "") {
    res.render('transactions-views/edit-transaction', {
      errorMessage: 'Please fill up the required forms.',
    });
    return;
  }
  Transaction.findOne({
      _id: req.params.id
    })
    .then(currentTransaction => {
      // Verify the difference in the amount
      if (currentTransaction.amount !== amount) {
        diffAmount = currentTransaction.amount - amount;
      }

      if (currentTransaction.type !== type) {
        diffType = true;
      }

      currentTransaction.amount = amount;
      currentTransaction.type = type;
      currentTransaction.merchant = merchant;
      currentTransaction.date = date;
      currentTransaction.category = category;
      currentTransaction.tags = tags;
      currentTransaction.notes = notes;
      currentTransaction.save()
        .then(updatedTransaction => {
          // console.log(updatedTransaction)
          //Update the Account Balance
          Account.findOne({
              _id: updatedTransaction.account
            })
            .then(currentAccount => {
              let balance = Number(currentAccount.accBalance)
              // console.log(currentAccount);
              // console.log(`    Amount: ------> ${amount}`)
              // console.log(`diffAmount: ------> ${diffAmount}`);
              // console.log(`  diffType: ------> ${diffType}`);
              // console.log(`   balance: ------> ${balance}`);
              // console.log(`      type: ------> ${updatedTransaction.type}`);
              if (diffAmount !== 0 && diffType === false) {
                if (updatedTransaction.type === 'debit') {
                  balance = balance + diffAmount;
                } else {
                  balance = balance - diffAmount;
                }
              } else if (diffAmount === 0 && diffType === true) {
                if (updatedTransaction.type === 'debit') {
                  balance = balance - (amount * 2);
                } else {
                  balance = balance + (amount * 2);
                }
              } else if (diffAmount !== 0 && diffType === true) {
                if (updatedTransaction.type === 'debit') {
                  if (diffAmount < 0) balance = -(Number(amount) + Number(diffAmount)) + Number(balance) - Number(amount);
                  if (diffAmount > 0) balance = -(Number(diffAmount) + Number(amount)) + Number(balance) - Number(amount);
                } else {
                  if (diffAmount < 0) balance = Number(balance) + (Number(diffAmount) + Number(amount)) + Number(amount);
                  if (diffAmount > 0) balance = Number(balance) + Number(diffAmount) + Number(amount) + Number(amount);
                }
              }
              // console.log({the_balance: balance});
              currentAccount.accBalance = balance;
              currentAccount.save()
                .then(result => {
                  // console.log(result)
                  res.redirect('/transactions')
                }).catch(err => console.log(err))
            }).catch(err => console.log(err))
        }).catch(err => console.log(err))
    }).catch(err => console.log(err))
});

router.post('/transaction/:id/delete', routeGuard, (req, res, next) => {
  // Find the transaction we want to delete and prepare the data to modify the Account Balance
  Transaction.findOne({
      _id: req.params.id
    })
    .then(transaction => {
      console.log()
      // Check the account and do the Math to add or subtr the accBalance
      Account.findOne({
          _id: transaction.account
        })
        .then(currentAccount => {
          console.log(currentAccount);
          let balance = currentAccount.accBalance
          if (transaction.type === 'debit') {
            balance = balance + transaction.amount;
          } else {
            balance = balance - transaction.amount;
          }
          currentAccount.accBalance = balance;
          currentAccount.save()
        })
        .then(result => {
          //Finally delete the Transaction
          Transaction.findByIdAndRemove(req.params.id)
            .then(() => res.redirect('/transactions'))
        })
        .catch(err => console.log(err));
    })
});

module.exports = router;