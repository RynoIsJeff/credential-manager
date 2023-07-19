import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const UpdateCredential = () => {
  const { credentialId } = useParams();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');



  const handleUpdateCredential = (event) => {
    event.preventDefault();

    axios.put(`/api/repositories/credential/${credentialId}`, {
      name,
      username,
      password,
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(response => {
        console.log('Credential updated:', response.data);
        toast.success("Credential updated successfuly")
      })
      .catch(error => {
        console.error('Error updating credential:', error);
        toast.error(error.response?.data?.message ?? error.message);
      });
  };
  useEffect(() => {
    axios.get(`/api/repositories/credential/${credentialId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
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

  return (
    <div>
      <h2 className="text-center">Update Credential</h2>
      <form onSubmit={handleUpdateCredential} className="dashboard-form">


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
