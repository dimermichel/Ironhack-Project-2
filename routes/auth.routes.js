require('dotenv').config();
const crypto = require('crypto');
const express = require('express');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');

const authRouter = express.Router();

const User = require('../models/User.model');
const routeGuard = require('../configs/route-guard.config');

// Setup email transporter with Nodemailer and Gmail
let transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'miawalletapp@gmail.com',
    pass: process.env.GMAIL_KEY 
  }
});

// BCrypt to encrypt passwords number of Salts
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

      email = email.toLowerCase();
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      User.create({ firstName, lastName, username, passwordHash: hashPass, email })
        .then(() => {
          res.redirect("/login")
          //Send email after SignUp
          return transporter.sendMail({
            from: '"Mia Wallet Team " <miawalletapp@gmail.com>',
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
  res.render('auth-views/login');
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
        // sets a cookie with the user's info in the Session which is stored an _id in MongoDB to access this info later on
        req.session.user = user;
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
  res.render('auth-views/reset');
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
        email
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
        // Saving the token in the DB to compare later
        user.save();
      
        transporter.sendMail({
          from: '"Mia Wallet Team " <miawalletapp@gmail.com>',
          to: email, 
          subject: 'Password Reset', 
          html: `
            <div style="text-align: center;">
              <h2>You requested a password reset.</h2>
              <h3>The Mia Wallet Team is here to help you. 🧑🏻‍💻</h3>
              <h3>This link is only valid for one hour.</h3>
              <h2>Please click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.</h2>
            </div>
          `
        })
        console.log(`Email sent to : ${email}`);
        res.redirect('/login')
      }) 
      .catch(err => console.log(err))
  });
});

authRouter.get('/reset/:token', (req, res, next) => {
  const token = req.params.token;
  User.findOne({resetToken: token, resetTokenExpiration: {$gt: Date.now()}})
  .then(user => {
    console.log(user)
    if (!user) {
      res.render('auth-views/reset', {
        errorMessage: "This user or reset token is not valid. Reset your password again.",
      });
      return;
    }
    req.session.user = user;
    res.render('auth-views/new-password');
  }).catch(err => console.log(err))
});

authRouter.post('/reset-password', (req, res, next) => {
  const newPassword = req.body.password;

  User.findOne({resetToken: req.session.user.resetToken, resetTokenExpiration: {$gt: Date.now()}, _id: req.session.user._id})
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
