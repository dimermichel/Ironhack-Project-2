const express = require('express');
const router = express.Router();

const routeGuard = require('../configs/route-guard.config');

const Account = require('../models/Account.model');

router.get('/accounts', routeGuard, (req, res, next) => {
  Account.find({ owner: req.session.user._id })
    .then(currentAccounts => {
      console.log({
        currentAccounts
      });
      if (!currentAccounts) {
        res.render('accounts-views/account-list', {
          errorMessage: 'There is no Account.',
        });
        return;
      }
      res.render('accounts-views/account-list', {
        accounts: currentAccounts
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
    res.render('accounts-views/account-input', {
      errorMessage: 'Please fill up the account form',
    });
    return;
  }

  const owner = req.session.user._id;

  Account.create({ accName, accBalance, owner })
    .then(() => {
      res.redirect('/accounts');
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

      res.render('accounts-views/account-edit', {
        account: currentAccounts
      });
    })
    .catch(err => console.log(err));
});

router.post('/accounts/:id/update', routeGuard, (req, res, next) => {
  const { accName, accBalance } = req.body;
  if (accName === '' || accBalance === '') {
    res.render('accounts-views/account-edit', {
      errorMessage: 'Please fill the forms',
    });
    return;
  }
  Account.findOne({ _id: req.params.id })
    .then(currentAccount => {
      currentAccount.accName = accName;
      currentAccount.accBalance = accBalance;
      currentAccount.save();
    }).then(res.redirect('/accounts'))
    .catch(err => console.log(err))
});

router.post('/accounts/:id/delete', routeGuard, (req, res, next) => {

  Account.findByIdAndRemove(req.params.id)
    .then(account => {
      res.redirect('/accounts');
    })
    .catch(err => console.log(err));
});

module.exports = router;