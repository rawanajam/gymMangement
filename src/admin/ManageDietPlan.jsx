import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ManageDietPlan() {
  const [dietPlans, setDietPlans] = useState([]);
  const [error, setError] = useState('');
  const [dietPlan, setDietPlan] = useState(''); // For editing meals
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

  const sendDietPlan = async (email,fullname, dietPlan) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/admin/send-diet-plan',
        { email,fullname, dietPlan },
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
    const updatedPlan = dietPlan || generateDietPlan(plan); // Use edited meals if any
    sendDietPlan(plan.email, plan.fullname,updatedPlan);

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
    ${dietPlan || "Default meal plan content here."}

    Stay hydrated and active!

    Best regards,
    Your Team
    `;
  };

  const handleEditMeal = (plan) => {
    setSelectedPlan(plan); // Set the current plan for editing
    setDietPlan(plan.dietPlan||''); // Clear previous meal edits
  };

  const saveEditedMeal = async (dietPlan) => {
    try {
      const fullname = selectedPlan.fullname; // Extract email from selectedPlan
      const token = localStorage.getItem('token');
      console.log('Selected plan:', selectedPlan);
console.log('fullname:', selectedPlan?.fullname);

      // Send only the required data
      const updatedDietPlan = dietPlan;
      console.log('diet plan: ',updatedDietPlan);
      await axios.put(
        'http://localhost:5000/api/admin/write-diet-plan',
        { fullname,dietPlan: updatedDietPlan}, // Pass email and dietPlan as the data
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('Diet plan saved successfully!');
      setSelectedPlan(null); // Close editing mode
      setDietPlans((prevPlans) =>
        prevPlans.map((plan) =>
          plan.email === selectedPlan.email ? { ...plan, diet_plan: dietPlan } : plan
        )
      );
    } catch (error) {
      console.error('Error saving diet plan:', error);
      alert('Failed to save the diet plan. Please try again.');
    }
  };
  

  return (
    <div className="container mt-5">
      <nav className="navbar navbar-light fixed-top">
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h1">Diet Plan Requests</span>
        </div>
      </nav>
      {error && <div className="alert alert-danger">{error}</div>}
      {!error && dietPlans.length === 0 && <p>No diet plans found.</p>}
      {dietPlans.length > 0 && (
        <div className="table-diet">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">email</th>
              <th scope="col">Age</th>
              <th scope="col">Weight</th>
              <th scope="col">Height</th>
              <th scope="col">Activity Level</th>
              <th scope="col">Goals</th>
              <th scope="col">Dietary Restrictions</th>
              <th scope="col">Actions</th>
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
                    className="btn btn-primary"
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
        </div>
      )}
      {selectedPlan && (
        <div className="mt-4">
          <h3>Edit Meals for {selectedPlan.fullname}</h3>
          <textarea
            className="form-control mb-3"
            rows="5"
            value={dietPlan}
            onChange={(e) => setDietPlan(e.target.value)}
            placeholder="Enter meal details here..."
          ></textarea>
          <button className="btn btn-success" onClick={() => saveEditedMeal(dietPlan)}>
               Save
            </button>

        </div>
      )}
    </div>
  );
}

export default ManageDietPlan;

