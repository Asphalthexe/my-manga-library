// models/book.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  imageLinks: Object,
  title: {
    type: String,
    required: true
  },
  authors: Array,
  publisher: String,
  publisherDate: String,
  pageCount: String,
  //rating: String,
  description: String,
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