import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../cardStyle.css';

const DietClass = () => {
  const [formData, setFormData] = useState({
    age: "",
    weight: "",
    height: "",
    activityLevel: "",
    goals: "",
    dietaryRestrictions: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token'); // Get the token from localStorage
     if (!token) {
      alert('You need to log in to submit your diet plan.');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:5000/api/diet-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        const data = await response.json();
        alert(data.message);
        setFormData({
          age: "",
          weight: "",
          height: "",
          activityLevel: "",
          goals: "",
          dietaryRestrictions: "",
        });
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error submitting diet plan:', error);
      alert('Error submitting diet plan.');
    }
  };
  

  return (
    <div>
      <nav className="navbar navbar-light fixed-top">
            <div className="container-fluid">
              <span className="navbar-brand mb-0 h1">Request Your Diet Plan</span>
            </div>
           </nav>
      <div className="form-container">
        <div className="card" style={{ width: '100%' }}>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <input
                  type="number"
                  name="age"
                  placeholder="Age"
                  value={formData.age}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  type="number"
                  name="weight"
                  placeholder="Weight (kg)"
                  value={formData.weight}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  type="number"
                  name="height"
                  placeholder="Height (cm)"
                  value={formData.height}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="mb-3">
                <select
                  name="activityLevel"
                  value={formData.activityLevel}
                  onChange={handleChange}
                  className="form-control"
                  required
                >
                  <option value="">Activity Level</option>
                  <option value="low">Low</option>
                  <option value="moderate">Moderate</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="mb-3">
                <textarea
                  name="goals"
                  placeholder="Your Goals (e.g., weight loss, muscle gain)"
                  value={formData.goals}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="mb-3">
                <textarea
                  name="dietaryRestrictions"
                  placeholder="Any Dietary Restrictions?"
                  value={formData.dietaryRestrictions}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <button type="submit" className="btn btn-primary w-100">
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
      </div>
    );
  };
export default DietClass;

