require('dotenv').config();
const crypto = require('crypto');
const express = require('express');

const authRouter = express.Router();

const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport')

const bcrypt = require('bcryptjs');
const User = require('../models/User.model');
const routeGuard = require('../configs/route-guard.config');

// Setup email transporter with Nodemailer and Sendgrid
const transporter = nodemailer.createTransport(sendgridTransport({
  auth: {
    api_key: process.env.SENDGRID_API_KEY
  }
}))

// BCrypt to encrypt passwords
const bcryptSalt = 10;

authRouter.post("/signup", (req, res, next) => {
  const { firstName, lastName, username, email, password } = req.body

  if (firstName === "" || lastName === "" || username === "" || password === "" || email === "") {
    res.render("auth-views/signup", {
      errorMessage: "Please fill up all the forms."

    });
    return;
  }

  // We need to all extra validation to the forms

  User.findOne({
    username,
  })
    .then(user => {
      if (user !== null) {
        res.render("auth-views/signup", {
          errorMessage: "The username already exists!"

        });
        return;
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      User.create({ firstName, lastName, username, passwordHash: hashPass, email })
        .then(() => {
          res.redirect("/login")
          //Send email after SignUp
          return transporter.sendMail({
            from: '"Mia Wallet Team " <welcome@miawallet.com>',
            to: email, 
            subject: 'Signup succeeded', 
            html: `
              <div style="text-align: center;">
                <h2>👋 Hi ${firstName}. 👋</h2>
                <h2>You successfully signed up!</h2>
                <h1>The Mia Wallet Team welcome you aboard.</h1>
                <h2>Discover the power to control your finances today. 🚀</h2>
              </div>
            `
          });
        })
        .catch(error => console.log(error))

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
        let finalImg = `${cropFaceImage[0]}upload/w_240,h_240,c_thumb,g_face,r_max/${cropFaceImage[1].substr(0, cropFaceImage[1].length - 3)}png`
        // console.log(finalImg)
        //req.session.imageUrl = updatedUser.imageUrl;
        req.session.imageUrl = finalImg;
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

authRouter.get('/reset', (req, res, next) => {
  const data = 'reset';
  res.render('auth-views/reset', { data });
});

authRouter.post('/reset', (req, res, next) => {
  const { email } = req.body
 
  if (email === '') {
    res.render('auth-views/reset', {
      errorMessage: 'Please enter your email.',
    });
    return;
  }
  // Creating a random token send a email to verify the user and reset password
  crypto.randomBytes(32, (err, buffer) => {
      if (err) {
        console.log(err);
        return res.redirect('/reset');
      }
      const token = buffer.toString('hex');
      
      User.findOne({
        email ,
      })
      .then(user => {
        if (!user) {
          res.render('auth-views/reset', {
            errorMessage: "This email is not registered.",
          });
          return;
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        user.save();
      })
      .then(result => {
        transporter.sendMail({
          from: '"Mia Wallet Team " <security@miawallet.com>',
          to: email, 
          subject: 'Password reset', 
          html: `
            <div style="text-align: center;">
              <h2>You requested a password reset.</h2>
              <h3>The Mia Wallet Team is here to help you. 🧑🏻‍💻</h3>
              <h3>This link is only valid for one hour.</h3>
              <h2>Please click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.</h2>
            </div>
          `
        })
      }).then(() => res.redirect('/login'))
      .catch(err => console.log(err))
  });
});

authRouter.get('/reset/:token', (req, res, next) => {
  const token = req.params.token;
  User.findOne({resetToken: token, resetTokenExpiration: {$gt: Date.now()}})
  .then(user => {

    if (!user) {
      res.render('auth-views/reset', {
        errorMessage: "This user or reset token is not valid. Reset your password again.",
      });
      return;
    }
    req.session._id = user._id;
    res.locals._id = user._id;
    req.session.token = user.resetToken
    // console.log({session: req.session})
    // console.log('---------------------');
    // console.log({locals: res.locals})
    res.render('auth-views/new-password');
  }).catch(err => console.log(err))
});

authRouter.post('/reset-password', (req, res, next) => {
  const newPassword = req.body.password;

  User.findOne({resetToken: req.session.token, resetTokenExpiration: {$gt: Date.now()}, _id: req.session._id})
  .then( user => {

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(newPassword, salt);

    user.passwordHash = hashPass;
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    user.save();

  }).then(result => {
    res.redirect('/login');
  })
  .catch(error => next(error));
  
});

authRouter.post('/logout', routeGuard, (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = authRouter;
