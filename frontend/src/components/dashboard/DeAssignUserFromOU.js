import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const DeAssignUserFromOU = () => {
  const [userId, setUserId] = useState('');
  const [ouId, setOUId] = useState('');
  const [users, setUsers] = useState([]);
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
  }, []);

  const deassignUserFromOU = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`/api/admin/de-assign-ou/${userId}/${ouId}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setMessage(response.data.message);
      toast.success("User De-Assigned from OU");
    } catch (error) {
      setMessage('An error occurred while de-assigning user from OU');
      console.error(error);
      toast.error(error.response?.data?.message ?? error.message);
    }
  };

  return (
    <div>
      <h2 className='text-center'>De-Assign User from OU</h2>
      <form className='dashboard-form' onSubmit={deassignUserFromOU}>
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
            <option value=''>Select OU</option>
            {userId && users.filter(user => user._id === userId)[0].ous.map(ou => (
              <option key={ou._id} value={ou._id}>
                {ou.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">De-Assign</button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
};

export default DeAssignUserFromOU;
