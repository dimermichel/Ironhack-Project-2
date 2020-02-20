const express = require('express');
const router  = express.Router();

const routeGuard = require('../configs/route-guard.config');

const User = require('../models/User.model');
const Transaction = require('../models/Transaction.model');
const Account = require('../models/Account.model');
const Category = require('../data/category.data.json')

/* User profile page */
router.get('/transactions', routeGuard, (req, res, next) => {
  User.findOne({_id: req.session._id})
  .then(user => {
      if (user !== null) {
        res.render("auth-views/signup", {
          errorMessage: "The username already exists!"

        });
        return;
      }

    console.log({currentUser})
    res.render('transactions-views/add-transaction', {user: currentUser});
  })
  .catch(err => next(err))

});

module.exports = router;