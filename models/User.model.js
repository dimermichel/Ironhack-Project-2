const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      // trim : true is going to catch all empty spaces and trim them
      trim: true,
      required:[true, 'Please insert your first name.'],
    },
    lastName: {
      type: String,
      trim: true,
      required:[true, 'Please insert your last name.'],
    },
    username: {
      type: String,
      trim: true,
      required:[true, 'Username must be unique!'],
      unique: true
    },
    passwordHash: {
      type: String,
    },
    email: {
      type: String,
      required:[true, 'This email already in use. 😢'],
      unique: true
    },
    // User's avatar image
    imageUrl: {
      type: String,
      // when setting a default value in the schema you want to avoid giving the user the option to set the value on sign up. If they by chance do not enter a field then the default will override to be blank as well.
      default:
        "https://res.cloudinary.com/dimermichel/image/upload/c_thumb,h_240,r_max,w_240/v1581909162/ironhackProject2/defaut_llrjv7.png"
    },  
    // the code sent to user email in order to validate email authenticity
    confirmationCode: {
        type: String
    },
    // Log of Delete and Update actions of the user
    logActions: {
      type: Array
    }
  },
  {
    timestamps: true
  }
);

module.exports = model('User', userSchema);