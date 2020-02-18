const express = require('express');

const authRouter = express.Router();

const bcrypt = require('bcryptjs');
const User = require('../models/User.model');
const routeGuard = require('../configs/route-guard.config');

// BCrypt to encrypt passwords
const bcryptSalt = 10;

authRouter.post('/signup', (req, res, next) => {
  const { firstName, lastName, username, email, password } = req.body;

  if (
    firstName === '' ||
    lastName === '' ||
    username === '' ||
    password === '' ||
    email === ''
  ) {
    res.render('auth/signup', {
      errorMessage: 'Please fill up all the forms.',
    });
    return;
  }

  // We need to all extra validation to the forms

  User.findOne({
    username,
  })
    .then(user => {
      if (user !== null) {
        res.render('auth/signup', {
          errorMessage: 'The username already exists!',
        });
        return;
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      User.create({
        firstName,
        lastName,
        username,
        passwordHash: hashPass,
        email,
      })
        .then(() => res.redirect('/'))
        .catch(error => console.log(error));
    })
    .catch(error => next(error));
});

authRouter.get('/signup', (req, res, next) => {
  res.render('auth-views/signup');
});

authRouter.get('/login', (req, res, next) => {
  const data = 'login';
  res.render('auth-views/login', { data });
});

authRouter.post('/login', (req, res, next) => {
  const theUsername = req.body.username;
  const thePassword = req.body.password;

  if (theUsername === '' || thePassword === '') {
    res.render('auth-views/login', {
      errorMessage: 'Please enter both, username and password to sign up.',
    });
    return;
  }

  User.findOne({
    username: theUsername,
  })
    .then(user => {
      if (!user) {
        res.render('auth-views/login', {
          errorMessage: "The username doesn't exist.",
        });
        return;
      }
      if (bcrypt.compareSync(thePassword, user.passwordHash)) {
        // Save the login in the session!
        req.session.currentUser = theUsername;
        let cropFaceImage = user.imageUrl;
        cropFaceImage = cropFaceImage.split('upload/')
        let finalImg = cropFaceImage[0] + 'upload/w_240,h_240,c_thumb,g_face,r_max/' + cropFaceImage[1]
        console.log(finalImg)
        //req.session.imageUrl = updatedUser.imageUrl;
        req.session.imageUrl = finalImg;
        //-------------------------------------
        // req.session.imageUrl = user.imageUrl;
        req.session._id = user._id;
        res.redirect("/");
      } else {
        res.render('auth-views/login', {
          errorMessage: 'Incorrect password',
        });
      }
    })
    .catch(error => next(error));
});

authRouter.post('/logout', routeGuard, (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = authRouter;
