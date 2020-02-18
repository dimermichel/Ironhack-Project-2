const express = require('express');

const router = express.Router();
const uploadCloud = require('../configs/cloudinary.config');
const routeGuard = require('../configs/route-guard.config');

const User = require('../models/User.model');

/* User profile page */
router.get('/profile', routeGuard, (req, res, next) => {
  User.findOne({ username: req.session.currentUser })
    .then(currentUser => {
      console.log({ currentUser });
      res.render('user-views/profile', { user: currentUser });
    })
    .catch(err => next(err));
});

router.post(
  '/profile/update',
  uploadCloud.single('image'),
  (req, res, next) => {
    const userInputInfo = req.body;
    userInputInfo.imageUrl = req.file.url;
    console.log(userInputInfo);
    console.log({ body: req.body, file: req.file });
    User.updateOne(userInputInfo)
      .then(updatedUser => {
        req.session.imageUrl = updatedUser.imageUrl;
        res.redirect('back');
      })
      .catch(err => next(err));
  },
);

module.exports = router;
