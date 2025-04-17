import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'

function App() {

  const BASE_URL = "https://react-crud-app-6x5e.onrender.com";

  const [users, setusers] = useState([]);
  const [filterData, setfilterData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    age: '',
    city: ''
  });
  const [editUser, setEditUser] = useState(null);

  const getUsers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/users`);
      setusers(res.data);
      setfilterData(res.data);
    } catch (err) {
      console.warn("Initial API call failed, retrying in 2s...");
      setTimeout(async () => {
        try {
          const retryRes = await axios.get(`${BASE_URL}/users`);
          setusers(retryRes.data);
          setfilterData(retryRes.data);
        } catch (finalErr) {
          console.error("Failed after retry:", finalErr);
        }
      }, 2000);
    }
  }

  useEffect(() => {
    getUsers();
  }, [])
  //search filter

  const handleSearch = (e) => {
    const searchText = e.target.value.toLowerCase();
    const filteredText = users.filter((user) => user.username.toLowerCase().includes(searchText) || user.city.toLowerCase().includes(searchText));
    setfilterData(filteredText);
  }

  //handle Delete

  const handleDelete = async (id) => {

    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    await axios.delete(`${BASE_URL}/users/${id}`).then((res) => {
      setusers(res.data);
      setfilterData(res.data);
    })

  }

  // handle edit
  const handleEdit = (user) => {
    setEditUser(user); // sets selected user for editing
    setShowModal(true);
  }

  //handle Add Record

  const handleAddRecord = () => {
    setNewUser({
      username: '',
      age: '',
      city: ''
    });
    setShowModal(true);
  }

  const handleAddUser = async () => {
    try {
      const res = await axios.post(`${BASE_URL}/users`, newUser);
      setusers(res.data);
      setfilterData(res.data);
      setShowModal(false);
      setNewUser({ username: '', age: '', city: '' });
    } catch (err) {
      console.error("Error adding user:", err);
    }
  };

  const handleUpdateUser = async () => {
    try {
      const res = await axios.patch(`${BASE_URL}/${editUser.id}`, editUser);
      setusers(res.data);
      setfilterData(res.data);
      setShowModal(false);
      setEditUser(null);
    } catch (err) {
      console.error("Error updating user:", err);
    }
  };


  return (
    <>


      <div className='container'>
        <h2>CRUD Operation in React</h2>
        <div className='input-search'>
          <input type='search' onChange={handleSearch} />
          <button onClick={handleAddRecord}>Add Records</button>
        </div>
        <table className='table'>
          <thead>
            <tr>
              <th>Sl.No</th>
              <th>Name</th>
              <th>Age</th>
              <th>City</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {filterData && filterData.map((user, index) => {
              return (<tr key={index}>
                <td>{index  + 1}</td>
                <td>{user.username}</td>
                <td>{user.age}</td>
                <td>{user.city}</td>
                <td><button onClick={() => handleEdit(user)} className='edit-btn'>Edit</button></td>
                <td><button onClick={() => handleDelete(user.id)} className='delete-btn'>Delete</button></td>
              </tr>)
            })}

          </tbody>

        </table>
        {showModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Add New User</h3>
              <input
                type="text"
                placeholder="Username"
                value={editUser ? editUser.username : newUser.username}
                onChange={(e) =>
                  editUser
                    ? setEditUser({ ...editUser, username: e.target.value })
                    : setNewUser({ ...newUser, username: e.target.value })
                }
              />

              <input
                type="number"
                placeholder="Age"
                value={editUser ? editUser.age : newUser.age}
                onChange={(e) =>
                  editUser
                    ? setEditUser({ ...editUser, age: e.target.value })
                    : setNewUser({ ...newUser, age: e.target.value })
                }
              />

              <input
                type="text"
                placeholder="City"
                value={editUser ? editUser.city : newUser.city}
                onChange={(e) =>
                  editUser
                    ? setEditUser({ ...editUser, city: e.target.value })
                    : setNewUser({ ...newUser, city: e.target.value })
                }
              />

              {editUser ? (
                <button onClick={handleUpdateUser}>Update</button>
              ) : (
                <button onClick={handleAddUser}>Submit</button>
              )}
              <button onClick={() => {
                setShowModal(false);
                setEditUser(null);
              }}>Cancel</button>
            </div>
          </div>
        )}
      </div>

    </>
  )
}

export default App
