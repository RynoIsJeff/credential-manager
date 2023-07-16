import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ChangeUserRole = () => {
  const [userId, setUserId] = useState(null);
  const [role, setRole] = useState("normal");
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState([]);

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

  const changeUserRole = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`/api/admin/change-role/${userId}`, { role }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setMessage(response.data.message);
      toast.success(response.data.message ?? "User role updated successfully");
    } catch (error) {
      setMessage('An error occurred while changing user role');
      toast.error(error.response?.data?.message ?? error.message);
      console.error(error);
    }
  };

  return (
    <div>
      <h2 className='text-center'>Change User Role</h2>
      <form className='dashboard-form' onSubmit={changeUserRole}>

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
          Role: <select required  value={role} onChange={(e) => setRole(e.target.value)} >
            <option value="admin" >
              Admin
            </option>
            <option value="management">
              Management
            </option>
            <option value="normal">
              Normal
            </option>
          </select>
        </div>
        <button onClick={changeUserRole}>Change Role</button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
};

export default ChangeUserRole;
