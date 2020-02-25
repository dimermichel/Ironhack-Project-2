const express = require('express');
const router = express.Router();


const routeGuard = require('../configs/route-guard.config');

const User = require('../models/User.model');
const Transaction = require('../models/Transaction.model');
const Account = require('../models/Account.model');
const listOfCategories = require('../data/category.data.js');

router.get('/transactions', routeGuard, (req, res, next) => {
  Transaction.find({
      owner: req.session.user._id
    })
    .then(currentTransaction => {
      console.log({
        currentTransaction
      })
      if (!currentTransaction) {
        res.render('transactions-views/show-transactions', {
          transaction: currentTransaction,
          errorMessage: "There is no Transaction."
        });
        return;
      }
      res.render('transactions-views/show-transactions', {transaction: currentTransaction}); 
    })
    .catch(err => console.log(err))
});

router.get('/add-transaction', routeGuard, (req, res, next) => {
  const value = listOfCategories.values
  Account.findOne({
      owner: req.session.user._id
    })
    .then(currentAccount => {
      if (!currentAccount) {
        // console.log(`++++++++++++++++ HELLO`)
        res.render('transactions-views/add-transaction', {
          value,
          errorMessage: "There is no account."
        })
        return
      }
      res.render('transactions-views/add-transaction', {
        value,
        currentAccount
      })
    })
    .catch(err => next(err))
})

router.post("/add-transaction", routeGuard, (req, res, next) => {

  let {
    amount,
    // account,
    merchant,
    date,
    category,
    tags,
    notes
  } = req.body;

  if (amount === "") {
    res.render("transactions-views/add-transaction", {
      errorMessage: "Please fill up all the forms."
    });
    return;
  }

  let owner = req.session.user._id
  Transaction.create({
    amount,
    // type,
    // account,
    merchant,
    date,
    category,
    tags,
    notes,
    owner
    })
    .then(() => {
      res.redirect("/transactions")
    })
    .catch(error => console.log(error))
});

router.get('/transactions/:id', routeGuard, (req, res, next) => {
  Transaction.findById(req.params.id)
    .populate('account')
    .then(detailTransaction => {
      res.render('transactions-views/edit-transaction', {
        transaction: detailTransaction
      });
      console.log(`THIS IS OUR TRANSACTION -------------- ${transaction}`)
    })
    .catch(err => console.log(err))
});

router.post('/transactions/:id', routeGuard, (req, res, next) => {
  Transaction.findByIdAndUpdate(req.params.id, {
      $set: req.body
    })
    .then(transaction => {
      res.redirect('transactions-views/show-transaction');
    })
    .catch(err => console.log(err))
});

router.post('/transactions/:id/delete', routeGuard, (req, res, next) => {

  Transaction.findByIdAndRemove(req.params.id)
    .then(transaction => {
      res.redirect('transactions-views/view-transaction');
    })
    .catch(err => console.log(err));
});

router.get('/transactions/:id/edit', routeGuard, (req, res, next) => {

  Transaction.findById(req.params.id)
    .populate('account')
    .then(transaction => {
      Account.find({
          owner: req.session.user._id
        })
        .then(availableAccounts => {
          const newAvailableAccounts = availableAccounts.filter(
            oneAccount => {
              if (transaction.account.equals(oneAccount._id)) {
                return false
              }
              return true
            })
          res.render("transactions-views/view-transaction", {
            transaction,
            newAvailableAccounts
          })
        })
        .catch(error => console.log(error))
    })
    .catch((error) => {
      console.log(error);
    })
});

module.exports = router;