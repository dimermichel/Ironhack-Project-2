const express = require('express');

const router = express.Router();
const moment = require('moment');
const routeGuard = require('../configs/route-guard.config');
const Account = require('../models/Account.model');
const Transaction = require('../models/Transaction.model');
const listOfCategories = require('../data/category.data.js');

router.get('/wallet', routeGuard, (req, res, next) => {
  const category = listOfCategories.values;
  //Setup Todays date to defaut when creating transaction date
  const today = moment(new Date()).format('YYYY-MM-DD');
  console.log(today);
  Account.find({ owner: req.session.user._id })
    .then(currentAccounts => {
      console.log({
        currentAccounts,
      });
      if (!currentAccounts) {
        res.render('wallet', {
          errorMessage: 'There is no Account.',
          category,
          today
        });
        return;
      }
        //Looking for all transactions of the logged user
        Transaction.find({
          owner: req.session.user._id
        })
        .then(currentTransactions => {
          //console.log({ currentTransaction });
          if (!currentTransactions) {
            res.render('wallet', {
              errorMessage: "There is no Transaction.",
              accounts: currentAccounts,
              category,
              today
            });
            return;
          }
          const newAccounts = currentAccounts.map(element => {
            element.accNameParsed = element.accName.toUpperCase();
            element.accBalanceParsed = element.accBalance.toFixed(2);
            return element;
          });


          // Parse the date from ISO to Date JS using Moment.js to display in the Date Input
          const newTransactions = currentTransactions.map(element => {
            const str = element.date;
            const date = moment(str);
            const dateComponent = date.utc().format('MM/DD/YYYY');
            console.log(dateComponent);
            element.merchantParsed = element.merchant.toUpperCase();
            element.dateParsed = dateComponent;
            element.amountParsed = element.amount.toFixed(2);
            return element;
          });

          res.render('wallet', {
            accounts: newAccounts,
            transaction: newTransactions,
            category,
            today
          });
        })
        .catch(err => console.log(err)) 
    })
    .catch(err => console.log(err));
});




// router.get('/account-input', routeGuard, (req, res, next) => {
//   res.render('accounts-views/account-input');
// });

// router.post('/accounts', routeGuard, (req, res, next) => {
//   const { accName, accBalance } = req.body;
//   if (accName === '' || accBalance === '') {
//     res.render('accounts-views/account-input', {
//       errorMessage: 'Please fill up the account form',
//     });
//     return;
//   }
//   const owner = req.session.user._id;
//   Account.create({ accName, accBalance, owner })
//     .then(() => {
//       res.redirect('/accounts');
//     })
//     .catch(error => console.log(error));
// });

// router.get('/accounts/:id/update', routeGuard, (req, res, next) => {
//   Account.findOne({ owner: req.session.user._id, _id: req.params.id })
//     .then(currentAccounts => {
//       console.log({ currentAccounts });
//       if (!currentAccounts) {
//         res.render('accounts-views/account-list', {
//           errorMessage: 'There is no Account to update',
//         });
//         return;
//       }
//       Transaction.find({
//         owner: req.session.user._id,
//       })
//         .then(currentTransactions => {
//           // console.log({ currentTransactions });
//           if (!currentTransactions) {
//             res.render('accounts-views/account-list', {
//               account: currentAccounts,
//               transaction: currentTransactions,
//               errorMessage: 'There is no Transactions in this Account.',
//             });
//             return;
//           }
//           // Parse the date from ISO to Date JS using Moment.js to display in the Date Input
//           const newTransactions = currentTransactions.map(element => {
//             const str = element.date;
//             const date = moment(str);
//             const dateComponent = date.utc().format('MM/DD/YYYY');
//             console.log(dateComponent);
//             element.dateParsed = dateComponent;
//             return element;
//           });

//           res.render('accounts-views/account-edit', {
//             account: currentAccounts,
//             transaction: newTransactions,
//           });
//         })
//         .catch(err => console.log(err));
//     })
//     .catch(err => console.log(err));
// });

// router.post('/accounts/:id/update', routeGuard, (req, res, next) => {
//   const { accName } = req.body;
//   if (accName === '') {
//     res.render('accounts-views/account-edit', {
//       errorMessage: 'Please fill the forms',
//     });
//     return;
//   }
//   Account.findOne({ _id: req.params.id })
//     .then(currentAccount => {
//       currentAccount.accName = accName;
//       // We are going to block the User to update the Balance
//       // otherwise there is no point in track the User expenses
//       // and the complexity to track this grows exponencialy
//       // currentAccount.accBalance = accBalance;
//       currentAccount.save();
//     })
//     .then(res.redirect('/accounts'))
//     .catch(err => console.log(err));
// });
// router.post('/accounts/:id/delete', routeGuard, (req, res, next) => {
//   Account.findByIdAndRemove(req.params.id)
//     .then(account => {
//       Transaction.find({ account: req.params.id }).then(result => {
//         console.log(result);
//         // Deleting all the transactions that are linked to this account
//         if (result) {
//           Transaction.deleteMany({ account: req.params.id }).then(
//             deletedTransactions => {
//               console.log(
//                 '========================================================',
//               );
//               console.log({ deletedTransactions });
//               console.log(
//                 '========================================================',
//               );
//             },
//           );
//         } else {
//           res.redirect('/accounts');
//         }
//       });
//     })
//     .then(() => res.redirect('/accounts'))
//     .catch(err => console.log(err));
// });

module.exports = router;
