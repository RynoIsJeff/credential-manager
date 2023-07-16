// models/Credential.js

const mongoose = require('mongoose');

const credentialSchema = new mongoose.Schema({
  repository: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CredentialRepository',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const Credential = mongoose.model('Credential', credentialSchema);

module.exports = Credential;
