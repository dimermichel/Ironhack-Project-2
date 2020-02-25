const express = require('express');

const router = express.Router();

const routeGuard = require('../configs/route-guard.config');

const User = require('../models/User.model');
const Account = require('../models/Account.model');

router.get('/accounts', routeGuard, (req, res, next) => {
  Account.find({ owner: req.session.user._id })
    .then(currentAccounts => {
      console.log({ currentAccounts });
      if (!currentAccounts) {
        res.render('accounts-views/account-list', {
          errorMessage: 'There is no Account.',
        });
        return;
      }
      console.log('Helooooooooooooooooooooooooooooooo!!!!');
      console.log(currentAccounts);
      res.render('accounts-views/account-list', { accounts: currentAccounts });
    })
    .catch(err => console.log(err));
});

router.get('/account-input', routeGuard, (req, res, next) => {
  Account.findOne({ owner: req.session.user._id })
    .then(currentAccounts => {
      console.log({ currentAccounts });
      if (!currentAccounts) {
        res.render('accounts-views/account-input', {
          errorMessage: 'There is no Account.',
        });
        return;
      }

      res.render('accounts-views/account-input');
    })
    .catch(err => console.log(err));
});

router.post('/accounts', routeGuard, (req, res, next) => {
  const { accName, accBalance } = req.body;

  console.log('creating account ============>, ==============> ', {
    req: req.body,
  });

  if (accName === '' || accBalance === '') {
    res.render('accounts-views/account-input', {
      errorMessage: 'Please fill up the account form',
    });
    return;
  }
  // We need to all extra validation to the forms all fill the missing information
  const owner = req.session.user._id;

  Account.create({ accName, accBalance, owner })
    .then(() => {
      res.redirect('/accounts');
    })
    .catch(error => console.log(error));
});

router.get('/accounts/:id/update', routeGuard, (req, res, next) => {
  Account.findOne({ owner: req.session.user._id })
    .then(currentAccounts => {
      console.log({ currentAccounts });
      if (!currentAccounts) {
        res.render('accounts-views/account-list', {
          errorMessage: 'There is no Account to update',
        });
        return;
      }

      res.render('accounts-views/account-edit', { account: currentAccounts });
    })
    .catch(err => console.log(err));
});

router.post('/accounts/:id/update'),
  routeGuard,
  (req, res, next) => {
    console.log(req.body);
    const { accName, accBalance } = req.body;
    if (accName === '' || accBalance === '') {
      res.redirect(`/accounts`);
      return;
    }
    console.log('que ota');
    Account.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
      .then(updatedAccount => res.redirect('/accounts'))
      .catch(err => console.log(err));
  };

// router.get('/transactions/:id', routeGuard, (req, res, next) => {
//   Transaction.findById(req.params.id)
//   .populate('account')
//   .then(detailTransaction => {
//     res.render('transactions-views/view-transaction', {Transaction: detailTransaction});
//   })
//   .catch(err => console.log(err))
// });

// router.post('/transactions/:id', routeGuard, (req, res, next) => {
//   Transaction.findByIdAndUpdate(req.params.id, {$set: req.body})
//   .then(transaction => {
//     res.redirect('transactions-views/view-transaction');
//   })
//   .catch(err => console.log(err))
// });

// router.post('/transactions/:id/delete', routeGuard, (req, res, next) => {

//   Transaction.findByIdAndRemove(req.params.id)
//     .then(transaction => {
//       res.redirect('transactions-views/view-transaction');
//     })
//     .catch(err => console.log(err));
// });

// router.get('/transactions/:id/edit', routeGuard, (req, res, next) => {

//   Transaction.findById(req.params.id)
//   .populate('account')
//   .then(transaction => {
//     Account.find({ owner: req.session.user._id })
//       .then( availableAccounts => {
//         const newAvailableAccounts =  availableAccounts.filter(
//           oneAccount => {
//               if (transaction.account.equals(oneAccount._id)) {
//                 return false
//               }
//             return true
//           })
//         res.render("transactions-views/view-transaction", {transaction, newAvailableAccounts})
//       })
//       .catch(error => console.log(error))
//   })
//   .catch((error) => {
//     console.log(error);
//   })
// });

module.exports = router;
