const express = require('express');
const router  = express.Router();
const listOfCategories = require('../data/category.data.js');

router.get('/add-transaction', (req, res) => {

  const categObj = {
  selector: []
  }
  
  for (let elem of listOfCategories.subcategories) {
    categObj.selector.push({
        value: elem,
        name: elem
        // `${elem.charAt(0).toUpperCase()}${elem.slice(1)}`
    });
  }
  console.log(categObj)
  res.render('transactions-views/add-transaction', {categObj})
})

module.exports = router;