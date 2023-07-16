import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddCredential = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [repositories, setRepositories] = useState([]);
  const [selectedRepository, setSelectedRepository] = useState('');

  useEffect(() => {
    axios.get('/api/repositories/', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(response => {
        setRepositories(response.data);
      })
      .catch(error => {
        console.error('Error fetching credential repositories:', error);
      });
  }, []);

  
  const handleAddCredential = (event) => {
    event.preventDefault();

    // Make a request to the backend to add a new credential
    axios.post(`/api/repositories/${selectedRepository}/credentials`, {
      name,
      username,
      password,
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(response => {
        // Handle success
        console.log('Credential added:', response.data);
        toast.success("Credential added to repository successfully")
      })
      .catch(error => {
        console.error('Error adding credential:', error);
        toast.error(error.response?.data.message ?? error.message)
      });
  };

  return (
    <div >
      <h2 className='text-center'>Add Credential</h2>
      <form onSubmit={handleAddCredential} className='dashboard-form'>
        <label>
          Select Credential Repository: </label>
        <select
          value={selectedRepository}
          onChange={(e) => setSelectedRepository(e.target.value)}
          required
        >
          <option value=''>Select Repository</option>
          {repositories.map(repository => (
            <option key={repository._id} value={repository._id}>
             {repository.divisionId.ou.name} {">"} {repository.divisionId.name} {">"}  {repository.name}
            </option>
          ))}
        </select>
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
