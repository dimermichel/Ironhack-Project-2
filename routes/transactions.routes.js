const express = require('express');
const router  = express.Router();

const routeGuard = require('../configs/route-guard.config');

const User = require('../models/User.model');
const Transaction = require('../models/Transaction.model');
const Account = require('../models/Account.model');
const Category = require('../data/category.data.json')

router.get('/transactions', routeGuard, (req, res, next) => {
  Account.findOne({ owner: req.session.user._id})
  .then(currentAccounts => {
    console.log({currentAccounts})
    if (!currentAccounts) {
      res.render('transactions-views/add-transaction', {
        errorMessage: "There is no Account.",
      });
      return;
    }
    res.render('transactions-views/add-transaction', {Category, Account: currentAccounts});
  })
  .catch(err => next(err))
});

router.post("/transactions", routeGuard, (req, res, next) => {

  const {amount, account, merchant, date, category, tags, notes} = req.body;

  if (amount === "" || account === "" || date === "") {
    res.render("transactions-views/add-transaction", {
      errorMessage: "Please fill up all the forms."

    });
    return;
  }
  // We need to all extra validation to the forms all fill the missing information
  let type = "";
  (amount > 0) ? type = "credit" : type = "debit";

  Transaction.create({ amount, account, type, merchant, date, category, tags, notes })
  .then(() => {
    res.redirect("/transactions")
  })
  .catch(error => console.log(error))
});

router.get('/transactions/:id', routeGuard, (req, res, next) => {
  Transaction.findById(req.params.id)
  .populate('account')
  .then(detailTransaction => {
    res.render('transactions-views/view-transaction', {Transaction: detailTransaction});
  })
  .catch(err => console.log(err))
});

router.post('/transactions/:id', routeGuard, (req, res, next) => {
  Transaction.findByIdAndUpdate(req.params.id, {$set: req.body})
  .then(transaction => {
    res.redirect('transactions-views/view-transaction');
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
    Account.find({ owner: req.session.user._id })
      .then( availableAccounts => {
        const newAvailableAccounts =  availableAccounts.filter(
          oneAccount => {
              if (transaction.account.equals(oneAccount._id)) {
                return false
              }
            return true
          })
        res.render("transactions-views/view-transaction", {transaction, newAvailableAccounts})
      })
      .catch(error => console.log(error))
  })
  .catch((error) => {
    console.log(error);
  })
});
  
module.exports = router;