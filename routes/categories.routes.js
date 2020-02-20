const express = require('express');
const router  = express.Router();

const subcateg = require('../data/category.data.json')

router.get('/category', (req, res, next) => {
  res.render('categories-views/file', {subcateg})
})


// console.log('jlajdljaljd ===> ', subcateg.transport)

// const { shopping, newSub } = sub

// const { transport, utilities, taxes, transfer, travel, kids, loans, personalCare, pets, shopping, businessServices, education, entertaiment, feesAndCharges, foodAndDinning, giftsAnDonations, healthAndFitness, home, income, investment, uncatgorized} = subcateg


/* GET home page */
// Modify here the routes and remenber to send the data to the right HBS File
// router.get('/', (req, res, next) => {
//   // Passing the cookie to the index to update the navbar
//   const Session = req.session;
//   //console.log(Session);
//   res.render('index', {Session})
// });

module.exports = router;