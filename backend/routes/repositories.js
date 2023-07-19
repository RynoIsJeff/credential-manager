const express = require('express');
const router = express.Router();
const CredentialRepository = require('../models/CredentialRepository');
const Credential = require('../models/Credential');
const { verifyToken, managementPermission } = require("./users");
const User = require('../models/User');
const Division = require('../models/Division');



// View division's credential repository for the current user endpoint 
router.get('/divisions/', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId).populate("divisions")
        const userDivisions = user.divisions

        const credentialRepositories = await CredentialRepository.find({
            divisionId: { $in: userDivisions }
        }).populate('credentials').populate({path: "divisionId",populate:"ou"});

        return res.json(credentialRepositories);

    } catch (error) {
        console.error('Error retrieving credential repository:', error);
        res.status(500).json({ message: 'An error occurred while retrieving the credential repository' });
    }

});

// View division's credential repository endpoint
router.get('/division/:divisionId', verifyToken, async (req, res) => {
    const { divisionId } = req.params;

    try {
        // Check if the user has access to a division repository
        // Check if the user is an admin/management or belongs to the division
        const user = await User.findById(req.userId)
        if (user.role == "normal" && !user.divisions.includes(divisionId)) {
            return res.status(403).json({ message: 'Unauthorized access' });
        }
        const credentialRepository = await CredentialRepository.findOne({ divisionId }).populate('credentials');
        if (!credentialRepository) {
            return res.status(404).json({ message: 'Credential repository not found' });
        }
        res.json({ credentialRepository });
    } catch (error) {
        console.error('Error retrieving credential repository:', error);
        res.status(500).json({ message: 'An error occurred while retrieving the credential repository' });
    }
});

// Add credential to a specific repository
router.post('/:repoId/credentials', verifyToken, managementPermission, async (req, res) => {
    try {
        const { repoId } = req.params;
        const credentialData = req.body;

        const repository = await CredentialRepository.findById(repoId);
        if (!repository) {
            return res.status(404).json({ message: 'Repository not found' });
        }

        const newCredential = new Credential({ ...credentialData, repository: repoId });
        const savedCredential = await newCredential.save();

        repository.credentials.push(savedCredential._id);
        await repository.save();

        res.json({ message: 'Credential added successfully' });
    } catch (error) {
        console.error('Error adding credential:', error);
        res.status(500).json({ message: 'An error occurred while adding the credential' });
    }
});

// Get credential details
router.get('/credential/:credentialId', verifyToken, async (req, res) => {
    const { credentialId } = req.params;

    try {

        const credential = await Credential.findById(credentialId).populate("repository");
        if (!credential) {
            return res.status(404).json({ message: 'Credential not found' });
        }
        // Check if the user has access to a division repository
        // Check if the user is an admin/management or belongs to the division
        const user = await User.findById(req.userId)
        if (user.role == "normal" && !user.divisions.includes(credential.repository.divisionId)) {
            return res.status(403).json({ message: 'Unauthorized access' });
        }
        res.json({ credential });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while getting the credential' });
    }
});

// Update credential endpoint
router.put('/credential/:credentialId', verifyToken, managementPermission, async (req, res) => {
    const { credentialId } = req.params;
    const { name, username, password } = req.body;

    try {
        const credential = await Credential.findById(credentialId);
        if (!credential) {
            return res.status(404).json({ message: 'Credential not found' });
        }

        credential.name = name;
        credential.username = username;
        credential.password = password;

        const updatedCredential = await credential.save();

        res.json({ credential: updatedCredential });
    } catch (error) {
        console.error('Error updating credential:', error);
        res.status(500).json({ message: 'An error occurred while updating the credential' });
    }
});

// Get all credential repositories
router.get('/', verifyToken, async (req, res) => {
    try {
        const credentialRepositories = await CredentialRepository.find().populate({path: "divisionId",populate:"ou"});
        res.json(credentialRepositories);
    } catch (error) {
        res.status(500).json({ message: 'Failed to get credential repositories' });
    }
});
module.exports = router;
