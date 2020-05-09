// models/bookshelf.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookshelfSchema = new Schema(
  {
    title: { type: String, required: true },
    description: String,
    authors: [{ type: Schema.Types.ObjectId, ref: 'Author' }],
    rating: Number
  }
);

const Bookshelf = mongoose.model('Bookshelf', bookshelfSchema);

module.exports = Bookshelf;