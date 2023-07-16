const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');

// Load environment variables
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

const verifyToken = async (req, res, next) => {
  try {
    let token = req.headers['authorization'];

    if (!token) {
      return res.status(403).json({ message: 'No token provided' });
    }

    const items = token.split(/\s+/);
    token = items[items.length - 1];

    jwt.verify(token, JWT_SECRET, (error, decoded) => {
      if (error) {
        console.log(error);
        return res.status(401).json({ message: 'Failed to authenticate token' });
      }

      req.userId = decoded.userId; // Store the user ID from the token payload
      next();
    });
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(500).json({ message: 'An error occurred while verifying the token' });
  }
};

const adminPermission = async (req, res, next) => {
  try {
    const { userId } = req;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    next();
  } catch (error) {
    console.error('Error checking admin permission:', error);
    res.status(500).json({ message: 'An error occurred while checking admin permission' });
  }
};

const managementPermission = async (req, res, next) => {
  try {
    const { userId } = req;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role !== 'admin' && user.role !== 'management') {
      return res.status(403).json({ message: 'Insufficient management permissions' });
    }

    next();
  } catch (error) {
    console.error('Error checking management permission:', error);
    res.status(500).json({ message: 'An error occurred while checking management permission' });
  }
};

// Login route
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '30d' });

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

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords don't match" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      password: hashedPassword,
      role,
    });

    const savedUser = await newUser.save();

    const token = jwt.sign({ userId: savedUser._id, role: savedUser.role }, JWT_SECRET);

    res.json({ token });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'An error occurred while registering the user' });
  }
});

// Check username availability
router.get('/check-username/:username', async (req, res) => {
  try {
    const { username } = req.params;

    const existingUser = await User.findOne({ username });

    res.json({ available: !existingUser });
  } catch (error) {
    console.error('Error checking username availability:', error);
    res.status(500).json({ message: 'An error occurred while checking username availability' });
  }
});

router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'An error occurred' });
  }
});
module.exports = { router, verifyToken, adminPermission, managementPermission };
