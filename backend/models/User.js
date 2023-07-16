// models/User.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['normal', 'management', 'admin'], default: 'normal' },
  divisions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Division' }],
  ous: [{ type: mongoose.Schema.Types.ObjectId, ref: 'OU' }],
});

const User = mongoose.model('User', userSchema);

module.exports = User;
