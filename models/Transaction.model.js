const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const transactionSchema = new Schema(
  {
    amount: {
      type: Number,
      default: 0
    },
    type: {
      type: String, 
      enum : ['credit','debit'], 
      default: 'debit'
    },
    account: { 
      type: Schema.Types.ObjectId, 
      ref: 'Account' 
    },
    merchant: String,
    date: {
      type: Date,
      required: [true, 'You need to insert a date.']
    },
    category: {
      type: String,
      default: 'Uncategorized'
    },
    tags: [String],
    notes: String
  },
  {
    timestamps: true,
  },
);

module.exports = model('Transaction', transactionSchema);
