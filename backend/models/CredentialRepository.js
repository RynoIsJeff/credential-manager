// models/CredentialRepository.js

const mongoose = require('mongoose');

const credentialRepositorySchema = new mongoose.Schema({
  name: { type: String, required: true },
});

const CredentialRepository = mongoose.model('CredentialRepository', credentialRepositorySchema);

module.exports = CredentialRepository;
