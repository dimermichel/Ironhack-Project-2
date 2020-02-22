const User = require('../models/User.model');

module.exports = (req, res, next) => {
  console.log('<<<<<<<<<< Local Variables Midleware >>>>>>>>>>>>>');
  if (req.session && req.session.user) {
    User.findOne({ _id: req.session.user._id }, (err, user) => {
      if (user) {
        req.session.user = user;  //refresh the session value
        req.session.user.passwordHash = undefined; // delete the password from the session
        res.locals.user = req.session.user;
      }
      // finishing processing the middleware and run the route
      console.log({Request_session: req.session});
      console.log("=======================================================");
      console.log({Response_locals: res.locals});
      next();
    });
  } else {
    next();
  }
}