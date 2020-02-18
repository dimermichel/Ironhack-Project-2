const express = require('express');

const router = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  // Passing the cookie to the index to update the navbar
  const Session = req.session;
  // console.log(Session);
  res.render('index', { Session });
});

module.exports = router;
