// server.js

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const { router: usersRouter } = require('./routes/users.js');
const repositoryRouter = require('./routes/repositories');
const adminRouter = require('./routes/admin.js');
const Division = require('./models/Division.js');
const OU = require('./models/OU.js');
const User = require('./models/User.js');

// Middleware to parse JSON request bodies
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://vdwryno:Ryno2003@hyperiondev-ryno.m62yslk.mongodb.net/credential-manager?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(async () => {
    console.log('Connected to MongoDB');

  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });


// Routes
app.use('/api/users', usersRouter);
app.use('/api/repositories', repositoryRouter);
app.use('/api/admin', adminRouter);


// Start the server
const port = process.env.PORT || 3001; // Use the PORT environment variable or default to 3001
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});