import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../cardStyle.css';
import axios from 'axios';

const ManagePublicClass = () => {
  const [classes, setClasses] = useState([]);
  const [newClass, setNewClass] = useState({ title: '', description: ''});
  const [editIndex, setEditIndex] = useState(null); // Track the index of the class being edited
  const [bookedUsers, setBookedUsers] = useState([]); // State for booked users
  const [showUsersModal, setShowUsersModal] = useState(false); 

  // Fetch all classes when the component mounts
  useEffect(() => {
    axios.get('http://localhost:5000/api/publicClasses') // Change URL to match your backend route
      .then(response => {
        setClasses(response.data); // Assuming the API returns a list of classes
      })
      .catch(error => {
        console.error('Error fetching classes:', error);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewClass({ ...newClass, [name]: value });
  };

  const addClass = () => {
    if (editIndex !== null) {
      // If editing, update the class at the specified index
      const updatedClass = { ...newClass, id: classes[editIndex].id }; // Add ID for update
     axios.put(`http://localhost:5000/api/publicClasses/${updatedClass.id}`, updatedClass)
        .then(response => {
          const updatedClasses = classes.map((classItem, index) =>
            index === editIndex ? updatedClass : classItem
          );
          setClasses(updatedClasses);
          setEditIndex(null); // Reset edit mode
          setNewClass({ title: '', description: ''});
        })
        .catch(error => {
          console.error('Error updating class:', error);
        });
    } else {
      // If not editing, add a new class
      axios.post('http://localhost:5000/api/publicClasses', newClass)
        .then(response => {
          setClasses([...classes, { ...newClass, id: response.data.id }]);
          setNewClass({ title: '', description: '' }); // Reset form
        })
        .catch(error => {
          console.error('Error adding class:', error);
        });
    }
  };

  const editClass = (index) => {
    setNewClass(classes[index]); // Load class details into the form
    setEditIndex(index); // Set the index for editing mode
  };

  const deleteClass = (index) => {
    const classId = classes[index].id;
    axios.delete(`http://localhost:5000/api/publicClasses/${classId}`)
      .then(() => {
        setClasses(classes.filter((_, i) => i !== index));
      })
      .catch(error => {
        console.error('Error deleting class:', error);
      });
  };


  const viewBookedUsers = (classId) => {
    axios
      .get(`http://localhost:5000/api/publicClasses/${classId}/bookedUsers`)
      .then((response) => {
        setBookedUsers(response.data);
        setShowUsersModal(true); // Show modal with users
      })
      .catch((error) => {
        console.error('Error fetching booked users:', error);
      });
  };
  return (
    <div>
      <h2>Manage Public Classes</h2>

      {/* Class List */}
      <div className="row">
        {classes.map((classItem, index) => (
          <div className="col-sm-4" key={index}>
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{classItem.title}</h5>
                <p className="card-text">{classItem.description}</p>
                <button className="btn btn-primary mr-2" onClick={() => editClass(index)}>Edit</button>
                <button className="btn btn-primary mr-2" onClick={() => deleteClass(index)}>Delete</button>
                <button
                  className="btn btn-primary mr-2"
                  onClick={() => viewBookedUsers(classItem.id)}
                >Booked</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Class Form */}
      <h3>{editIndex !== null ? 'Edit Class' : 'Add New Class'}</h3>
      <form className="mb-4">
        <div className="mb-3">
          <input
            type="text"
            name="title"
            value={newClass.title}
            onChange={handleInputChange}
            className="form-control"
            placeholder="Class Title"
          />
        </div>
        <div className="mb-3">
          <input
            type="text"
            name="description"
            value={newClass.description}
            onChange={handleInputChange}
            className="form-control"
            placeholder="Class Description"
          />
        </div>
        <button type="button" onClick={addClass} className="btn btn-primary">
          {editIndex !== null ? 'Save Changes' : 'Add Class'}
        </button>
      </form>
      {showUsersModal && (
        <div className="modal" style={{ display: 'block', background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Booked Users</h5>
                <button className="close" onClick={() => setShowUsersModal(false)}>
                  &times;
                </button>
              </div>
              <div className="modal-body">
                {bookedUsers.length === 0 ? (
                  <p>No users have booked this class.</p>
                ) : (
                  <ul>
                    {bookedUsers.map((user, idx) => (
                      <li key={idx}><strong>{user.name}</strong> - {new Date(user.date).toLocaleDateString()} at {new Date(user.date).toLocaleTimeString()}</li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowUsersModal(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagePublicClass;



