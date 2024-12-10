import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ManageDietPlan() {
  const [dietPlans, setDietPlans] = useState([]);
  const [error, setError] = useState('');

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
  
  // Function to generate the diet plan content
  const generateDietPlan = (plan) => {
    return `
    Hi,
  
    Based on your input, here is your personalized diet plan:
  
    - Age: ${plan.age}
    - Weight: ${plan.weight} kg
    - Height: ${plan.height} cm
    - Activity Level: ${plan.activity_level}
    - Goals: ${plan.goals}
  
    **Day 1:**
    - Breakfast: Scrambled eggs with spinach and toast
    - Snack: A handful of almonds
    - Lunch: Grilled chicken with quinoa
    - Snack: Greek yogurt
    - Dinner: Salmon with steamed vegetables
  
    Stay hydrated and active!
  
    Best regards,
    Your Team
    `;
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
              <th>Age</th>
              <th>Weight</th>
              <th>Height</th>
              <th>Activity Level</th>
              <th>Goals</th>
              <th>Dietary Restrictions</th>
            </tr>
          </thead>
          <tbody>
            {dietPlans.map((plan, index) => (
              <tr key={plan.id}>
                <td>{index + 1}</td>
                <td>{plan.fullname}</td>
                <td>{plan.age}</td>
                <td>{plan.weight}</td>
                <td>{plan.height}</td>
                <td>{plan.activity_level}</td>
                <td>{plan.goals}</td>
                <td>{plan.dietary_restrictions}</td>
                <td>
                      <button
                        className="btn btn-primary"
                        onClick={() => sendDietPlan(plan.email, generateDietPlan(plan))}
                      >
                        Send Plan
                      </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ManageDietPlan;
