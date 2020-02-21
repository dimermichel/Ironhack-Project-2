const express = require('express');

const router = express.Router();
const uploadCloud = require('../configs/cloudinary.config');
const routeGuard = require('../configs/route-guard.config');

const User = require('../models/User.model');

/* User profile page */
router.get('/profile', routeGuard, (req, res, next) => {
  User.findOne({_id: req.session.user._id})
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
    // Preparing to save the original file
    userInputInfo.imageUrl = req.file.url;
    // Setup the Profile Pic with crop face image from Cloudinary
     let cropFaceImage = userInputInfo.imageUrl;
     cropFaceImage = cropFaceImage.split('upload/')
     let finalImg = `${cropFaceImage[0]}upload/w_240,h_240,c_thumb,g_face,r_max/${cropFaceImage[1].substr(0, cropFaceImage[1].length - 3)}png`
      console.log(finalImg)
     //req.session.imageUrl = updatedUser.imageUrl;
     userInputInfo.profilePicUrl = finalImg;
  }

  // Prepare to log the action =======================
  let dt = new Date();
  let utcDate = dt.toUTCString();

  User.findByIdAndUpdate( req.session.user._id, { 
    $set: userInputInfo,
    $push: {logActions: {action: 'Profile update', date: utcDate}},
  }, {new:true})
  .then( updatedUser => {
    console.log({updatedUser});
    res.redirect('/profile');
  })
  .catch(err => next(err))
  
});

module.exports = router;
