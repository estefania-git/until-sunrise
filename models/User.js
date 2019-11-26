const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  googleID: String,
  email: String,
  email_verified: Boolean,
  name: String,
  picture: String,
  given_name: String,
  family_name: String,
  locale: String,
  access_token: String,
  refresh_token: String
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
