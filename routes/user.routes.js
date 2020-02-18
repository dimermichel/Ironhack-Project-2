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

router.post('/profile/update', routeGuard, uploadCloud.single('imageUrl') ,(req, res, next) => {
  console.log("updating profile <<<<<<<<<<<<<<<<<<<<< ");
  const userInputInfo = req.body;
  userInputInfo.imageUrl = req.file.url;
  console.log({userInputInfo});
  console.log({body: req.body , file: req.file})
  console.log("=======================================");
  console.log('You are about to see the req.session.user');
  console.log({Sessions: req.session});
  User.findByIdAndUpdate(
    req.session._id,
   userInputInfo, {new:true})
  .then( updatedUser => {
    console.log({updatedUser});
    let cropFaceImage = updatedUser.imageUrl
    cropFaceImage = cropFaceImage.split('upload/')
    let finalImg = cropFaceImage[0] + 'upload/w_240,h_240,c_thumb,g_face,r_max/' + cropFaceImage[1]
    console.log(finalImg)
    //req.session.imageUrl = updatedUser.imageUrl;
    req.session.imageUrl = finalImg;
    res.redirect('/');
  })
  .catch(err => next(err))
  
});

module.exports = router;
