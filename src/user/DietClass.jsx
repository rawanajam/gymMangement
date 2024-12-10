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
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2 style={styles.title}>Request Your Diet Plan</h2>
      <input
        type="number"
        name="age"
        placeholder="Age"
        value={formData.age}
        onChange={handleChange}
        style={styles.input}
        required
      />
      <input
        type="number"
        name="weight"
        placeholder="Weight (kg)"
        value={formData.weight}
        onChange={handleChange}
        style={styles.input}
        required
      />
      <input
        type="number"
        name="height"
        placeholder="Height (cm)"
        value={formData.height}
        onChange={handleChange}
        style={styles.input}
        required
      />
      <select
        name="activityLevel"
        value={formData.activityLevel}
        onChange={handleChange}
        style={styles.input}
        required
      >
        <option value="">Activity Level</option>
        <option value="low">Low</option>
        <option value="moderate">Moderate</option>
        <option value="high">High</option>
      </select>
      <textarea
        name="goals"
        placeholder="Your Goals (e.g., weight loss, muscle gain)"
        value={formData.goals}
        onChange={handleChange}
        style={styles.textarea}
        required
      />
      <textarea
        name="dietaryRestrictions"
        placeholder="Any Dietary Restrictions?"
        value={formData.dietaryRestrictions}
        onChange={handleChange}
        style={styles.textarea}
      />
      <button type="submit" style={styles.button}>Submit</button>
    </form>
  );
};

const styles = {
  form: {
    maxWidth: "500px",
    margin: "0 auto",
    padding: "20px",
    border: "1px solid #333333",
    borderRadius: "8px",
    backgroundColor: "#FAF3E0",
  },
  title: {
    textAlign: "center",
    marginBottom: "15px",
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "5px",
    border: "1px solid #333333",
  },
  textarea: {
    width: "100%",
    height: "80px",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "5px",
    border: "1px solid #333333",
  },
  button: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#50C878",
    color: "#FAF3E0",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default DietClass;

