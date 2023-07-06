import React, { useState } from 'react';
import axios from 'axios';

const AddCredential = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleAddCredential = (event) => {
    event.preventDefault();

    // Make a request to the backend to add a new credential
    axios.post('/api/users/credential', {
      name,
      username,
      password,
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`, // Include the JWT token in the request headers
      },
    })
      .then(response => {
        // Handle success
        console.log('Credential added:', response.data);
      })
      .catch(error => {
        console.error('Error adding credential:', error);
        // Handle error
      });
  };

  return (
    <div>
      <h2>Add Credential</h2>
      <form onSubmit={handleAddCredential}>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
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
        <button type="submit">Add Credential</button>
      </form>
    </div>
  );
};

export default AddCredential;
