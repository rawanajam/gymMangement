const express = require('express');
const router = express.Router();
const { Pool } = require('pg'); // Import PostgreSQL connection pool
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

module.exports = router;