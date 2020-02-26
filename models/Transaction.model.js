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
    lastAccBalance: Number,
    merchant: String,
    date: {
      type: Date,
      required: [true, 'You need to insert a date.']
    },
    category: {
      type: String,
      default: 'Uncategorized'
    },
    tags: String,
    notes: String,
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'You need an owner id'],
    }
  },
  {
    timestamps: true,
  },
);

module.exports = model('Transaction', transactionSchema);
