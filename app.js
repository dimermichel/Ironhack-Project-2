/* eslint-disable import/order */
/* eslint-disable import/no-extraneous-dependencies */
require('dotenv').config();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const favicon = require('serve-favicon');
const mongoose = require('mongoose');
const logger = require('morgan');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const hbs = require('hbs');
const compare = require('./configs/hbs-helper.config');
const localVariables = require('./configs/local-variables.config');

const app = express();

// require database configuration
require('./configs/db.config');

// eslint-disable-next-line camelcase
const app_name = require('./package.json').name;
// eslint-disable-next-line import/no-extraneous-dependencies

const debug = require('debug')(
  // eslint-disable-next-line camelcase
  `${app_name}:${path.basename(__filename).split('.')[0]}`,
);

// Middleware Setup

// Setup of the cookies session
app.use(
  session({
    secret: process.env.SESS_SECRET,
    cookie: { maxAge: 3600000 }, // 1 hour
    resave: true,
    saveUninitialized: true,
    duration: 24 * 60 * 60 * 1000, // how long the session will stay valid in ms
    activeDuration: 1000 * 60 * 5, // if expiresIn < activeDuration, the session will be extended by activeDuration milliseconds
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 24 * 60 * 60, // 1 day
    }),
  }),
);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// SASS Middleware Setup
app.use(
  require('node-sass-middleware')({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public'),
    sourceMap: true,
  }),
);

// Express View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

// Configure hbs helper
hbs.registerHelper('compare', compare);

// Default value for title local
app.locals.title = 'MIA WALLET APP';

// Setup local variables Midleware

app.use((req, res, next) => {
  res.locals.currentUser = req.session.currentUser;
  res.locals.imageUrl = req.session.imageUrl;
  res.locals._id = req.session._id;
  // console.log('<<<<<<<<<< Midleware in App.js >>>>>>>>>>>>>');
  // console.log({Request_session: req.session});
  // console.log("=======================================================");
  // console.log({Response_locals: res.locals});
  next();
});
app.use(localVariables);

// Setup all Routes Here
//         |  |  |
//         |  |  |
//         V  V  V
app.use('/', require('./routes/index.routes'));
app.use('/', require('./routes/auth.routes'));
app.use('/', require('./routes/user.routes'));
app.use('/', require('./routes/accounts.routes'));
app.use('/', require('./routes/transactions.routes'));
 app.use('/', require('./routes/wallet.routes'));

module.exports = app;
