import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ViewCredentialRepository = () => {
  const [credentialRepository, setCredentialRepository] = useState(null);

  useEffect(() => {
    // Make a request to the backend to retrieve the division's credential repository
    axios.get('/api/users/division/:divisionId/credential-repository', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`, // Include the JWT token in the request headers
      },
    })
      .then(response => {
        // Set the credential repository data in the component state
        setCredentialRepository(response.data.credentialRepository);
      })
      .catch(error => {
        console.error('Error retrieving credential repository:', error);
        // Handle error
      });
  }, []);

  return (
    <div>
      {credentialRepository ? (
        <div>
          <h2>Credential Repository</h2>
          <p>Name: {credentialRepository.name}</p>
          {/* Render other credential repository details */}
        </div>
      ) : (
        <p>Loading credential repository...</p>
      )}
    </div>
  );
};

export default ViewCredentialRepository;
