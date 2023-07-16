import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const DeAssignUserToDivision = () => {
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState('');
  const [divisionId, setDivisionId] = useState('');

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

  const deassignUserFromDivision = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`/api/admin/de-assign-division/${userId}/${divisionId}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      toast.success(response.data.message ?? "User deassigned from the division successfully");
    } catch (error) {

      console.error(error);
      toast.error(error.response?.data?.message ?? error.message);
    }
  }
  const getUserDivisions = (userId) => {
    let user = users.find(user => user._id === userId)
    return user.divisions.map(division => ({ ...division, ou: user.ous.find(ou => ou._id === division.ou) }));
  }
  return (
    <div>
      <h2 className='text-center'>De-Assign User to Division</h2>
      <form className='dashboard-form' onSubmit={deassignUserFromDivision}>
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

            {userId && getUserDivisions(userId).map(division => (
              <option key={division._id} value={division._id}>
                {division.ou?.name} {">"}  {division.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">De-Assign</button>
      </form>
    </div>
  );
};

export default DeAssignUserToDivision;

