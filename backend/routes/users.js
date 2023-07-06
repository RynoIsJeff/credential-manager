// users.js

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');
const CredentialRepository = require('../models/CredentialRepository');
const Credential = require('../models/Credential');
require('dotenv').config(); // Load environment variables

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret'; // Access the JWT_SECRET from the environment variables or use a default value

// Middleware for verifying JWT
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  jwt.verify(token, JWT_SECRET, (error, decoded) => {
    if (error) {
      return res.status(401).json({ message: 'Failed to authenticate token' });
    }

    req.userId = decoded.userId; // Store the user ID from the token payload
    next();
  });
};

// Middleware for checking user permissions
const checkPermissions = (req, res, next) => {
  const { userId } = req;

  User.findById(userId, (error, user) => {
    if (error) {
      return res.status(500).json({ message: 'An error occurred while checking user permissions' });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check user permissions
    // For example, assuming an 'admin' role has access to the division's credential repository
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    next();
  });
};

// View division's credential repository endpoint
router.get('/division/:divisionId/credential-repository', verifyToken, checkPermissions, async (req, res) => {
  const { divisionId } = req.params;

  try {
    // Find the division's credential repository
    const credentialRepository = await CredentialRepository.findOne({ divisionId });

    if (!credentialRepository) {
      return res.status(404).json({ message: 'Credential repository not found' });
    }

    // Return the credential repository data
    res.json({ credentialRepository });
  } catch (error) {
    console.error('Error retrieving credential repository:', error);
    res.status(500).json({ message: 'An error occurred while retrieving the credential repository' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the user by username
    const user = await User.findOne({ username });

    // If user not found, return error
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Compare the provided password with the stored password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // If password is invalid, return error
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET);

    // Return the token
    res.status(200).json({ token });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'An error occurred while logging in' });
  }
});

// Register endpoint
router.post('/register', async (req, res) => {
  try {
    const { username, password, confirmPassword, role } = req.body;

    // Check if the passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords don't match" });
    }

    // Check if the username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new User({
      username,
      password: hashedPassword,
      role,
    });

    // Save the user to the database
    const savedUser = await newUser.save();

    // Generate a JWT token
    const token = jwt.sign({ userId: savedUser._id, role: savedUser.role }, JWT_SECRET);

    // Send the token as a response
    res.json({ token });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'An error occurred while registering the user' });
  }
});

// Check username availability
router.get('/check-username/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const existingUser = await User.findOne({ username });

    res.json({ available: !existingUser });
  } catch (error) {
    console.error('Error checking username availability:', error);
    res.status(500).json({ message: 'An error occurred while checking username availability' });
  }
});

// Add credential to a specific repository
router.post('/repositories/:repoId/credentials', verifyToken, checkPermissions, async (req, res) => {
  try {
    const { repoId } = req.params;
    const { credentialData } = req.body;

    // Find the repository by ID
    const repository = await CredentialRepository.findById(repoId);

    // If repository not found, return error
    if (!repository) {
      return res.status(404).json({ message: 'Repository not found' });
    }

    // Create a new credential with the provided data
    const newCredential = new Credential(credentialData);

    // Save the credential to the database
    const savedCredential = await newCredential.save();

    // Add the credential to the repository's credentials array
    repository.credentials.push(savedCredential._id);

    // Save the updated repository
    await repository.save();

    res.status(200).json({ message: 'Credential added successfully' });
  } catch (error) {
    console.error('Error adding credential:', error);
    res.status(500).json({ message: 'An error occurred while adding the credential' });
  }
});

// Update credential endpoint
router.put('/credential/:credentialId', verifyToken, async (req, res) => {
  const { credentialId } = req.params;
  const { name, username, password } = req.body;

  try {
    // Find the credential by ID
    const credential = await Credential.findById(credentialId);

    // If credential not found, return error
    if (!credential) {
      return res.status(404).json({ message: 'Credential not found' });
    }

    // Update the credential fields
    credential.name = name;
    credential.username = username;
    credential.password = password;

    // Save the updated credential
    const updatedCredential = await credential.save();

    // Return the updated credential
    res.json({ credential: updatedCredential });
  } catch (error) {
    console.error('Error updating credential:', error);
    res.status(500).json({ message: 'An error occurred while updating the credential' });
  }
});

module.exports = router;
