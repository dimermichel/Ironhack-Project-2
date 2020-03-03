const express = require('express');

const router = express.Router();
const moment = require('moment');
const routeGuard = require('../configs/route-guard.config');
const Account = require('../models/Account.model');
const Transaction = require('../models/Transaction.model');

router.get('/accounts', routeGuard, (req, res, next) => {
  Account.find({ owner: req.session.user._id })
    .then(currentAccounts => {
      console.log({
        currentAccounts,
      });
      if (!currentAccounts) {
        res.render('accounts-views/account-list', {
          errorMessage: 'There is no Account.',
        });
        return;
      }
      res.render('accounts-views/account-list', {
        accounts: currentAccounts,
      });
    })
    .catch(err => console.log(err));
});

router.get('/account-input', routeGuard, (req, res, next) => {
  res.render('accounts-views/account-input');
});

router.post('/accounts', routeGuard, (req, res, next) => {
  const { accName, accBalance } = req.body;
  if (accName === '' || accBalance === '') {
    res.render('wallet', {
      errorMessage: 'Please fill up the account form',
    });
    return;
  }
  const owner = req.session.user._id;
  Account.create({ accName, accBalance, owner })
    .then(() => {
      res.redirect('/wallet');
    })
    .catch(error => console.log(error));
});

router.get('/accounts/:id/update', routeGuard, (req, res, next) => {
  Account.findOne({ owner: req.session.user._id, _id: req.params.id })
    .then(currentAccounts => {
      console.log({ currentAccounts });
      if (!currentAccounts) {
        res.render('accounts-views/account-list', {
          errorMessage: 'There is no Account to update',
        });
        return;
      }
      Transaction.find({
        account: req.params.id,
      })
        .then(currentTransactions => {
          // console.log({ currentTransactions });
          if (!currentTransactions) {
            res.render('accounts-views/account-list', {
              account: currentAccounts,
              transaction: currentTransactions,
              errorMessage: 'There is no Transactions in this Account.',
            });
            return;
          }
          // Parse the date from ISO to Date JS using Moment.js to display in the Date Input
          const newTransactions = currentTransactions.map(element => {
            const str = element.date;
            const date = moment(str);
            const dateComponent = date.utc().format('MM/DD/YYYY');
            console.log(dateComponent);
            element.dateParsed = dateComponent;
            element.amountParsed = element.amount.toFixed(2);
            return element;
          });

          res.render('accounts-views/account-edit', {
            account: currentAccounts,
            transaction: newTransactions,
          });
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
});

router.post('/accounts/:id/update', routeGuard, (req, res, next) => {
  const { accName } = req.body;
  if (accName === '') {
    res.render('wallet', {
      errorMessage: 'Please fill the forms',
    });
    return;
  }
  Account.findOne({ _id: req.params.id })
    .then(currentAccount => {
      currentAccount.accName = accName;
      // We are going to block the User to update the Balance
      // otherwise there is no point in track the User expenses
      // and the complexity to track this grows exponencialy
      // currentAccount.accBalance = accBalance;
      currentAccount.save();
    })
    .then(res.redirect('/wallet'))
    .catch(err => console.log(err));
});
router.post('/accounts/:id/delete', routeGuard, (req, res, next) => {
  Account.findByIdAndRemove(req.params.id)
    .then(account => {
      Transaction.find({ account: req.params.id }).then(result => {
        console.log(result);
        // Deleting all the transactions that are linked to this account
        if (result) {
          Transaction.deleteMany({ account: req.params.id }).then(
            deletedTransactions => {
              console.log(
                '========================================================',
              );
              console.log({ deletedTransactions });
              console.log(
                '========================================================',
              );
            },
          );
        } else {
          res.redirect('/wallet');
        }
      });
    })
    .then(() => res.redirect('/wallet'))
    .catch(err => console.log(err));
});
module.exports = router;
