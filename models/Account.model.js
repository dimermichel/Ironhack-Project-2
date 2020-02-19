const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const accountSchema = new Schema(
  {
    name: {
      type: String,
      // trim : true is going to catch all empty spaces and trim them
      trim: true,
      // required: This fied is required to create this object
      required: [true, 'Please insert data.'],
    },
    currentBalance: {
      type: Number,

      required: [true, 'Please insert data.'],
    },
    transactions: {
      // this sintax don't work for Mongoose Schemas :C
      //type: Array[Object], You have to use something like this:
      // |
      // V
      type: Array,

      //required: [true, 'Please insert data.'],
      // You cannot require transactions right away otherwise will block the creation of the accounts
    },
  },
  {
    timestamps: true,
  },
);

module.exports = model('Account', accountSchema);
