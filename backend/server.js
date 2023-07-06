// server.js

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const usersRouter = require('./routes/users');

// Middleware to parse JSON request bodies
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://vdwryno:Ryno2003@hyperiondev-ryno.m62yslk.mongodb.net/credential-manager?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Set the JWT secret key
const JWT_SECRET = 'R123';

// Routes
app.use('/api/users', usersRouter);

// Start the server
const port = process.env.PORT || 3001; // Use the PORT environment variable or default to 3001
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});