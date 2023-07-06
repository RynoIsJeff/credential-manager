// models/OU.js

const mongoose = require('mongoose');

const ouSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

const OU = mongoose.model('OU', ouSchema);

module.exports = OU;
