// models/book.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  imageLink: String,
  title: {
    type: String,
    required: true
  },
  authors: Array,
  publisher: String,
  publisherDate: String,
  pageCount: Number,
  categories: Array,
  //rating: String,
  description: String,
  retailPrice: String,
  ISBN: String,
  owner: {
    type:  Schema.Types.ObjectId,
    ref: 'User'
  },
  wishlistowner: {
    type : Schema.Types.ObjectId,
    ref: 'User'
  }
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;