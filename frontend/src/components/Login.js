import React, { useContext, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/login.css';
import ApplicationContext from '../state';
import { NavLink, useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(ApplicationContext);
  const navigate = useNavigate();

  const handleLoginSubmit = (event) => {
    event.preventDefault();

    // Make the API call to the login endpoint
    axios.post('/api/users/login', { username, password })
      .then(response => {
        // Handle the response from the backend
        const { token } = response.data;
        // Save the token to local storage or a cookie for authentication
        localStorage.setItem('token', token);
        // Display a success toast message
        toast.success('Login successful!');
        // Redirect or update the UI based on a successful login
        login()
        navigate("/")
      })
      .catch(error => {
        // Handle error responses from the backend
        console.error('Error logging in:', error);
        // Display an error toast message
        toast.error('Login failed. Please try again.');
      });
  };

  return (
    <div>
      <h2 className='text-center'>Login</h2>
      <form onSubmit={handleLoginSubmit} className="login-form">
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button type="submit">Login</button>
        <br />
        <br />
        <div>
          You don't have an account? <NavLink to="/register" >
            <span>Register</span>
          </NavLink>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Login;
