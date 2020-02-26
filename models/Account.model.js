const mongoose = require('mongoose');

const { Schema, model } = mongoose;
const accountSchema = new Schema(
  {
    accName: {
      type: String,
      // trim : true is going to catch all empty spaces and trim them
      trim: true,
      // required: This fied is required to create this object
      required: [true, 'Please insert data.'],
    },
    accBalance: {
      type: Number,
      required: [true, 'Please insert data.'],
    },
    // We don't need to add an Array of transactions beacause each transaction already has the account ID
    // transactions: {
    //   type: Array,
    // },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'You need an owner id'],
    },
  },
  {
    timestamps: true,
  },
);
module.exports = model('Account', accountSchema);
