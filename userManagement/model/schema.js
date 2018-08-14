const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema
var users = new Schema({
  userName : String,
  password: String,
  address: String
});

module.exports = mongoose.model('users', users);
