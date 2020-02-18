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
      type: Array[Object],

      required: [true, 'Please insert data.'],
    },
  },
  {
    timestamps: true,
  },
);

module.exports = model('Account', accountSchema);
