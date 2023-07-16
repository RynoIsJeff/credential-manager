import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { NavLink } from 'react-router-dom';

const ViewCredentialRepository = () => {
  const [credentialRepositories, setCredentialRepository] = useState(null);

  useEffect(() => {
    // Make a request to the backend to retrieve the division's credential repository
    axios.get(`/api/repositories/divisions`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(response => {
        // Set the credential repository data in the component state
        setCredentialRepository(response.data);
      })
      .catch(error => {
        console.error('Error retrieving credential repository:', error.response.data.message);
        toast.error(error.response?.data?.message ?? error.message);
        // Handle error
      });
  }, []);

  return (
    <div className='card'>
      {credentialRepositories ? credentialRepositories.map(credentialRepository => (
        <div key={credentialRepository._id}>
          <p>
            {credentialRepository.divisionId.ou.name} {">"} {credentialRepository.divisionId.name} {">"}  {credentialRepository.name}
          </p>
          <p >Division Name:  {credentialRepository.divisionId.name}</p>
          <p >OU Name:  {credentialRepository.divisionId.ou.name}</p>
          <p >Credential Repository Name:  {credentialRepository.name}</p>
          <h4 className='text-center'>Credentials</h4>

          <table className='table'>
            <thead>
              <tr>
                <th>Name</th>
                <th>Username</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              {credentialRepository.credentials.map(credential => (
                <tr key={credential._id}>
                  <td>{credential.name}</td>
                  <td>{credential.username}</td>
                  <td>
                    <NavLink to={`/update-credential/${credential._id}`}>
                      <i className="material-icons medium">edit</i>
                      <span>Edit</span>
                    </NavLink>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <br />
        </div>)) : (
        <p>Loading credential repository...</p>
      )}
      {credentialRepositories?.length === 0 &&
        <p>You don't have any credential, ensure you have been added to at least 1 division</p>
      }
    </div>
  );
};

export default ViewCredentialRepository;
