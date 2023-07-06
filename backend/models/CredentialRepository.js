// models/CredentialRepository.js

const mongoose = require('mongoose');

const credentialRepositorySchema = new mongoose.Schema({
  divisionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Division', required: true },
  name: { type: String, required: true },
  credentials: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Credential' }],
  createdAt: { type: Date, default: Date.now },
});

const CredentialRepository = mongoose.model('CredentialRepository', credentialRepositorySchema);

module.exports = CredentialRepository;
