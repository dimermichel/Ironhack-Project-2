const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const categorySchema = new Schema(
  {
    categoryName: { 
      type: String,
      required: true
    },
    subcategoriesName: {
      type: [String]
    }
  },
  {
    timestamps: true
  }
);


module.exports = model('category', categorySchema);