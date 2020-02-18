const express = require('express');

const router = express.Router();

const subs = require('../data.json')
console.log('jlajdljaljd ===> ', subs)

const { shopping, newSub } = subs

/* GET home page */
// Modify here the routes and remenber to send the data to the right HBS File
// router.get('/', (req, res, next) => {
//   // Passing the cookie to the index to update the navbar
//   const Session = req.session;
//   //console.log(Session);
//   res.render('index', {Session})
// });

module.exports = router;
