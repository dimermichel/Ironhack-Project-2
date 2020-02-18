const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const transactionSchema = new Schema(
  {
    name: {
      type: String,
      // trim : true is going to catch all empty spaces and trim them
      trim: true,
      // required: This fied is required to create this object
      required: [true, 'Please insert data.'],
    },
    // Need to add field here
  },
  {
    timestamps: true,
  },
);

module.exports = model('Transaction', transactionSchema);
