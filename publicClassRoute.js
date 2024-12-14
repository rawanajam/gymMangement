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
router.get('/publicClasses', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM publicclasses');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching classes:', error);
    res.status(500).json({ error: 'Error fetching classes' });
  }
});

// Add a new class
router.post('/publicClasses', async (req, res) => {
  const { title, description} = req.body;
  try {
    await pool.query(
      'INSERT INTO publicclasses (title, description) VALUES ($1, $2)',
      [title, description]
    );
    res.status(201).json({ message: 'Class added successfully' });
  } catch (error) {
    console.error('Error adding class:', error);
    res.status(500).json({ error: 'Error adding class' });
  }
});

// Update an existing class
router.put('/publicClasses/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description} = req.body;
  try {
    await pool.query(
      'UPDATE publicclasses SET title = $1, description = $2 WHERE id = $3',
      [title, description, id]
    );
    res.json({ message: 'Class updated successfully' });
  } catch (error) {
    console.error('Error updating class:', error);
    res.status(500).json({ error: 'Error updating class' });
  }
});

// Delete a class
router.delete('/publicClasses/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM publicclasses WHERE id = $1', [id]);
    res.json({ message: 'Class deleted successfully' });
  } catch (error) {
    console.error('Error deleting class:', error);
    res.status(500).json({ error: 'Error deleting class' });
  }
});
router.post('/bookClass', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const fullname = decoded.fullname; // Get the name from the token
    const { id } = req.body; // ID of the session being booked

    // Update the 'book_by' column in the sessions table
    const result = await pool.query(
      `UPDATE publicclasses
       SET book_by =array_append(book_by, $1)
       WHERE id = $2
       RETURNING *`,
      [fullname, id]
    );
    

    res.json({
      success: true,
      message: 'Class booked successfully!',
      data: result.rows[0], // Send the updated session data if needed
    });
  } catch (error) {
    console.error('Error booking class:', error);
    res.status(500).json({ error: 'Error booking class' });
  }
});
router.get('/publicClasses/:id/bookedUsers', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'SELECT book_by FROM publicclasses WHERE id = $1',
      [id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Class not found' });
    }
    res.json(result.rows[0].book_by || []);
  } catch (error) {
    console.error('Error fetching booked users:', error);
    res.status(500).json({ error: 'Error fetching booked users' });
  }
});


module.exports = router;