const express = require('express');
const router = express.Router();
const { Pool } = require('pg'); // Import PostgreSQL connection pool
const jwt = require('jsonwebtoken');
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

// Fetch all classes
router.get('/privateClasses', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM privatesessions');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching classes:', error);
    res.status(500).json({ error: 'Error fetching classes' });
  }
});

// Add a new class
router.post('/privateClasses', async (req, res) => {
  const { coach,expertise,sessionday,time} = req.body;
  try {
    await pool.query(
      'INSERT INTO privatesessions (coach, expertise,sessionday,time) VALUES ($1, $2,$3,$4)',
      [coach,expertise,sessionDay,time]
    );
    res.status(201).json({ message: 'Class added successfully' });
  } catch (error) {
    console.error('Error adding class:', error);
    res.status(500).json({ error: 'Error adding class' });
  }
});

// Update an existing class
router.put('/privateClasses/:id', async (req, res) => {
  const { id } = req.params;
  const { coach,expertise,sessionday,time} = req.body;
  try {
    await pool.query(
      'UPDATE privatesessions SET coach = $1, expertise = $2, sessionday=$3 ,time=$4 WHERE id = $5',
      [coach, expertise,sessionDay,time, id]
    );
    res.json({ message: 'Class updated successfully' });
  } catch (error) {
    console.error('Error updating class:', error);
    res.status(500).json({ error: 'Error updating class' });
  }
});

// Delete a class
router.delete('/privateClasses/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM privatesessions WHERE id = $1', [id]);
    res.json({ message: 'Class deleted successfully' });
  } catch (error) {
    console.error('Error deleting class:', error);
    res.status(500).json({ error: 'Error deleting class' });
  }
});
router.post('/bookSession', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const fullname = decoded.fullname; // Get the name from the token
    const { id } = req.body; // ID of the session being booked

    // Update the 'book_by' column in the sessions table
    const result = await pool.query(
      `UPDATE privatesessions SET book_by = $1 WHERE id = $2 RETURNING *`,
      [fullname, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Session not found or already booked' });
    }
    res.json({
      success: true,
      message: 'Session booked successfully!',
      data: result.rows[0], // Send the updated session data if needed
    });
    res.status(200).json({ message: 'Session booked successfully', session: result.rows[0] });
  } catch (error) {
    console.error('Error booking session:', error);
    res.status(500).json({ error: 'Error booking session' });
  }
});


module.exports = router;