import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../cardStyle.css';
import axios from 'axios';

const ManagePrivateClass = () => {
  const [classes, setClasses] = useState([]);
  const [newClass, setNewClass] = useState({ coach: '', expertise: '',sessionday:'',time:''});
  const [editIndex, setEditIndex] = useState(null); // Track the index of the class being edited

  // Fetch all classes when the component mounts
  useEffect(() => {
    axios.get('http://localhost:5000/api/privateClasses') // Change URL to match your backend route
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
     axios.put(`http://localhost:5000/api/privateClasses/${updatedClass.id}`, updatedClass)
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
          setNewClass({ coach: '', expertise: '',sessionday:'',time:''}); // Reset form
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
    axios.delete(`http://localhost:5000/api/privateClasses/${classId}`)
      .then(() => {
        setClasses(classes.filter((_, i) => i !== index));
      })
      .catch(error => {
        console.error('Error deleting class:', error);
      });
  };

  return (
    <div>
      <h2>Manage Private Classes</h2>

      {/* Class List */}
      <div className="row">
        {classes.map((classItem, index) => (
          <div className="col-sm-4" key={index}>
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Coach: {classItem.coach}</h5>
                <p className="card-text">Expertise: {classItem.expertise}</p>
                <p className="card-text">Day: {classItem.sessionday}</p>
                <p className="card-text">Time: {classItem.time}</p>
                {classItem.book_by ? (
                <p className="booked-by">
                  <strong>Booked By:</strong> {classItem.book_by}
                </p>
              ) : (
                <p className="booked-by">Not Booked Yet</p>
              )}
                <button className="btn btn-primary mr-2" onClick={() => editClass(index)}>Edit</button>
                <button className="btn btn-primary mr-2" onClick={() => deleteClass(index)}>Delete</button>
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
            name="coach"
            value={newClass.coach}
            onChange={handleInputChange}
            className="form-control"
            placeholder="Class coach"
          />
        </div>
        <div className="mb-3">
          <input
            type="text"
            name="expertise"
            value={newClass.expertise}
            onChange={handleInputChange}
            className="form-control"
            placeholder="Class Expertise"
          />
        </div>
        <div className="mb-3">
          <input
            type="text"
            name="sessionDay"
            value={newClass.sessionDay}
            onChange={handleInputChange}
            className="form-control"
            placeholder="Class Date"
          />
        </div>
        <div className="mb-3">
          <input
            type="text"
            name="time"
            value={newClass.time}
            onChange={handleInputChange}
            className="form-control"
            placeholder="Class time"
          />
        </div>
        <button type="button" onClick={addClass} className="btn btn-primary">
          {editIndex !== null ? 'Save Changes' : 'Add Class'}
        </button>
      </form>
    </div>
  );
};

export default ManagePrivateClass;