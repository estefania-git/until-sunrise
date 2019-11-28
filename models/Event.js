const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const evenSchema = new Schema({
  name: String,
  id: String,
  localDate: String,
  localTime: String,
  url: String,
  image: String,
  venues_name: String,
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Event = mongoose.model('Event', userSchema);
module.exports = Event;



