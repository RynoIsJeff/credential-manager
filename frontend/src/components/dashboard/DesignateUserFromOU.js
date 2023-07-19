import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const DesignateUserFromOU = () => {
  const [userId, setUserId] = useState('');
  const [ouId, setOUId] = useState('');
  const [users, setUsers] = useState([]);
  const [ous, setOus] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch users
    axios.get('/api/admin/users', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }
    })
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });

    // Fetch ous
    axios.get('/api/admin/ous', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }
    })
      .then(response => {
        setOus(response.data);
      })
      .catch(error => {
        console.error('Error fetching ous:', error);
      });
  }, []);

  const designateUserFromOU = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`/api/admin/design-ou/${userId}/${ouId}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setMessage(response.data.message);
      toast.success("User Designated from OU");
    } catch (error) {
      setMessage('An error occurred while designating user from OU');
      console.error(error);
      toast.error(error.response?.data?.message ?? error.message);
    }
  };

  return (
    <div>
      <h2 className='text-center'>Assign User to OU</h2>
      <form className='dashboard-form' onSubmit={designateUserFromOU}>
        <div>
          User ID:
          <select required value={userId} onChange={(e) => setUserId(e.target.value)}>
            <option value=''>Select User</option>
            {users.map(user => (
              <option key={user._id} value={user._id}>
                {user.username}
              </option>
            ))}
          </select>
        </div>
        <div>
          OU ID:
          <select required value={ouId} onChange={(e) => setOUId(e.target.value)}>
            <option value=''>Select Division</option>
            {ous.map(division => (
              <option key={division._id} value={division._id}>
                {division.name}
              </option>
            ))}
          </select>
        </div>
        <button onClick={designateUserFromOU}>Designate</button>
        {message && <p>{message}</p>}
      </form>

    </div>
  );
};

export default DesignateUserFromOU;
