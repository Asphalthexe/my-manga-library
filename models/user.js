const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({

  email: String,
  password: String,
  /*  role: {
     type: String, enum: ['admin', 'co-host', 'student']
   }, */
  pictureUrl: String,
  slackPicture: String,
  slackID: String,
  verifiedEmail: {
    type: Boolean,
    default: false
  },
  bookshelf: [{
    type: Schema.Types.ObjectId,
    ref: 'Book'
  }],

  token: String
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;