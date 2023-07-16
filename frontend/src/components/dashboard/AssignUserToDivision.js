import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AssignUserToDivision = () => {
  const [users, setUsers] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [userId, setUserId] = useState('');
  const [divisionId, setDivisionId] = useState('');
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

  useEffect(() => {
    if (users && userId) {
      let user = users.find((user) => user._id === userId)
      let ouDivision = user.ous.reduce((prev, ou) => prev.concat(ou.divisions.map(division => ({ ...division, ou }))), [])
      setDivisions(ouDivision)
    }
  }, [userId, users])

  const assignUserToDivision = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`/api/admin/assign-division/${userId}/${divisionId}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setMessage(response.data.message);
      toast.success(response.data.message ?? "User assigned to a division successfully");
    } catch (error) {
      setMessage('An error occurred while assigning user to division');
      console.error(error);
      toast.error(error.response?.data?.message ?? error.message);
    }
  };

  return (
    <div>
      <h2 className='text-center'>Assign User to Division</h2>
      <form className='dashboard-form' onSubmit={assignUserToDivision}>
        <small >A user must belongs to at least 1 OU before adding them to a division</small>
        <br /> <br />
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
          Division ID:
          <select required value={divisionId} onChange={(e) => setDivisionId(e.target.value)}>
            <option value=''>Select Division</option>
            {divisions.map(division => (
              <option key={division._id} value={division._id}>
                {division.ou.name} {">"} {division.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Assign</button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
};

export default AssignUserToDivision;

