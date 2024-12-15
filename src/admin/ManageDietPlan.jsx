import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ManageDietPlan() {
  const [dietPlans, setDietPlans] = useState([]);
  const [error, setError] = useState('');
  const [editedMeal, setEditedMeal] = useState(''); // For editing meals
  const [selectedPlan, setSelectedPlan] = useState(null); // Selected diet plan for editing

  useEffect(() => {
    const fetchDietPlans = async () => {
      try {
        const token = localStorage.getItem('token'); // Retrieve token from localStorage
        const response = await axios.get('http://localhost:5000/api/admin/diet-plans', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDietPlans(response.data);
      } catch (error) {
        setError(error.response?.data?.error || 'Error fetching diet plans');
      }
    };

    fetchDietPlans();
  }, []);

  const sendDietPlan = async (email, dietPlan) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/admin/send-diet-plan',
        { email, dietPlan },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('Diet plan sent successfully!');
    } catch (error) {
      console.error('Error sending diet plan:', error);
      alert('Failed to send diet plan. Please try again.');
    }
  };

  const handleSendPlan = (plan) => {
    // Show confirmation alert
    const confirmation = window.confirm(
      `Are you sure you want to send this diet plan to ${plan.fullname}?`
    );
    if (!confirmation) return;

    // Generate and send the diet plan
    const updatedPlan = editedMeal || generateDietPlan(plan); // Use edited meals if any
    sendDietPlan(plan.email, updatedPlan);
  };

  const generateDietPlan = (plan) => {
    return `
    Hi,

    Based on your input, here is your personalized diet plan:

    - Age: ${plan.age}
    - Weight: ${plan.weight} kg
    - Height: ${plan.height} cm
    - Activity Level: ${plan.activity_level}
    - Goals: ${plan.goals}

    Meals:
    ${editedMeal || "Default meal plan content here."}

    Stay hydrated and active!

    Best regards,
    Your Team
    `;
  };

  const handleEditMeal = (plan) => {
    setSelectedPlan(plan); // Set the current plan for editing
    setEditedMeal(''); // Clear previous meal edits
  };

  const saveEditedMeal = () => {
    setSelectedPlan(null); // Close the editing mode
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Diet Plan Requests</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      {!error && dietPlans.length === 0 && <p>No diet plans found.</p>}
      {dietPlans.length > 0 && (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>email</th>
              <th>Age</th>
              <th>Weight</th>
              <th>Height</th>
              <th>Activity Level</th>
              <th>Goals</th>
              <th>Dietary Restrictions</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {dietPlans.map((plan, index) => (
              <tr key={plan.id}>
                <td>{index + 1}</td>
                <td>{plan.fullname}</td>
                <td>{plan.email}</td>
                <td>{plan.age}</td>
                <td>{plan.weight}</td>
                <td>{plan.height}</td>
                <td>{plan.activity_level}</td>
                <td>{plan.goals}</td>
                <td>{plan.dietary_restrictions}</td>
                <td>
                  <button
                    className="btn btn-secondary me-2"
                    onClick={() => handleEditMeal(plan)}
                  >
                    Edit Meal
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleSendPlan(plan)}
                  >
                    Send Plan
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {selectedPlan && (
        <div className="mt-4">
          <h3>Edit Meals for {selectedPlan.fullname}</h3>
          <textarea
            className="form-control mb-3"
            rows="5"
            value={editedMeal}
            onChange={(e) => setEditedMeal(e.target.value)}
            placeholder="Enter meal details here..."
          ></textarea>
          <button className="btn btn-success" onClick={saveEditedMeal}>
            Save
          </button>
        </div>
      )}
    </div>
  );
}

export default ManageDietPlan;

