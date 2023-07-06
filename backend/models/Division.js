// models/Division.js

const mongoose = require('mongoose');

const divisionSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

const Division = mongoose.model('Division', divisionSchema);

module.exports = Division;
