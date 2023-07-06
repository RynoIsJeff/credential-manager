import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/register.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegisterSubmit = (event) => {
    event.preventDefault();
    const role = 'normal';

    // Check if the username already exists
    axios
      .get(`/api/users/check-username/${username}`)
      .then((response) => {
        if (response.data.available) {
          // Make the API call to the registration endpoint
          axios
            .post('/api/users/register', {
              username,
              password,
              confirmPassword,
              role,
            })
            .then((response) => {
              // Handle the response from the backend
              // Redirect or update the UI based on a successful registration
              toast.success('Registration successful!');
            })
            .catch((error) => {
              // Handle error responses from the backend
              console.error('Error registering:', error);
              toast.error('Registration failed. Please try again.');
            });
        } else {
          // Display an error toast message indicating the username is already taken
          toast.error('Username is already taken. Please choose a different one.');
        }
      })
      .catch((error) => {
        console.error('Error checking username:', error);
        toast.error('An error occurred. Please try again.');
      });
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleRegisterSubmit}>
        <div>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
          />
        </div>
        <button type="submit">Register</button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Register;
