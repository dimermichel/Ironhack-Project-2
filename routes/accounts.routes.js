const express = require('express');

const router = express.Router();
const routeGuard = require('../configs/route-guard.config');

const Account = require('../models/Account.model');

// *****************************************************************************
// GET - to display the form for creating the account
// *****************************************************************************

//   make sure you see all the folders that are inside the "views" folder,
//   but you don't have to specify "views" folder tho
//   in res.render() we don't use '/'
//   before we put the the path to the hbs file we want to render
//   localhost:3000/authors-input
router.get('/accounts-input', (req, res) =>
  res.render('accounts-views/account'),
);

// *****************************************************************************
// POST route to create a new author in the DB
// *****************************************************************************

// <form action="/authors" method="POST">
router.post('/accounts', (req, res) => {
  Account.create(req.body)
    .then(savedAccount => {
      // console.log('Successfully saved: ', savedAuthor);

      // take us to the page that already exist in our app
      //      ^       ->  this is the URL so it HAS to start with '/'
      //      |      |
      //      |      |
      res.redirect('/accounts');
    })
    .catch(err => console.log(`Error while saving author in the DB: ${err}`));
});

// *****************************************************************************
// GET all accounts from the DB
// *****************************************************************************

router.get('/accounts', (req, res) => {
  Account.find() // <-- .find() method gives us always an ARRAY back
    .then(accountsFromDB => {
      // console.log('Accounts from DB: ========', accountsFromDB);
      res.render('accounts-views/account', { account: accountsFromDB });
    })
    .catch(err => console.log(`Error while getting authors from DB: ${err}`));
});

module.exports = router;
