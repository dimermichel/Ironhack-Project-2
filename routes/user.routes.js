const express = require('express');
const router  = express.Router();
const uploadCloud = require('../configs/cloudinary.config');
const routeGuard = require('../configs/route-guard.config');

const User = require('../models/User.model')

/* User profile page */
router.get('/profile', routeGuard, (req, res, next) => {
  User.findOne({_id: req.session._id})
  .then(currentUser => {
    console.log({currentUser})
    res.render('user-views/profile', {user: currentUser});
  })
  .catch(err => next(err))
});

router.post('/profile/update', routeGuard, uploadCloud.single('imageUrl') ,(req, res, next) => {
  console.log(">>>>>>>>>>>>>>>>>> updating profile <<<<<<<<<<<<<<<<<<<<< ");
  const userInputInfo = req.body;
  
  // Prevent user to force empty input
  const {firstName, lastName, email} = req.body
  if (firstName === "" || lastName === "" || email === "") {
    res.render("user-views/profile", {
      errorMessage: "Please fill up the forms."
    });
    return;
  }
  // Check if there is a file to upload
  if (req.file) {
    userInputInfo.imageUrl = req.file.url;
  }

  // Prepare to log the action =======================
  let dt = new Date();
  let utcDate = dt.toUTCString();
  // console.log({userInputInfo});
  // console.log({body: req.body , file: req.file})
  // console.log("=======================================");
  // console.log('You are about to see the req.session');
  // console.log({Sessions: req.session});
  User.findByIdAndUpdate( req.session._id, { 
    $set: userInputInfo,
    $push: {logActions: {action: 'Profile update', date: utcDate}},
  }, {new:true})
  .then( updatedUser => {
    console.log({updatedUser});
    let cropFaceImage = updatedUser.imageUrl
    cropFaceImage = cropFaceImage.split('upload/')
    // This logic is to make sure to return a round crop face .PNG image from cloudinary
    let finalImg = `${cropFaceImage[0]}upload/w_240,h_240,c_thumb,g_face,r_max/${cropFaceImage[1].substr(0, cropFaceImage[1].length - 3)}png`
    req.session.imageUrl = finalImg;
    // console.log({session: req.session});
    res.redirect('/profile');
  })
  .catch(err => next(err))
  
});

module.exports = router;
