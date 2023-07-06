import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UpdateCredential = ({ credentialId }) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    // Fetch the existing credential data and populate the form
    axios.get(`/api/users/credential/${credentialId}`)
      .then(response => {
        const { credential } = response.data;
        // Populate the form fields with the existing credential data
        setName(credential.name);
        setUsername(credential.username);
        setPassword(credential.password);
      })
      .catch(error => {
        console.error('Error retrieving credential:', error);
        // Handle error
      });
  }, [credentialId]);

  const handleUpdateCredential = (event) => {
    event.preventDefault();

    // Make a request to the backend to update the credential
    axios.put(`/api/users/credential/${credentialId}`, {
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
        console.log('Credential updated:', response.data);
      })
      .catch(error => {
        console.error('Error updating credential:', error);
        // Handle error
      });
  };

  return (
    <div>
      <h2>Update Credential</h2>
      <form onSubmit={handleUpdateCredential}>
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
        <button type="submit">Update Credential</button>
      </form>
    </div>
  );
};

export default UpdateCredential;
