const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg'); // Importing Pool from 'pg'
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();



const app = express();
app.use(express.json());

app.use(cors({
    origin: '*', // Allow all origins for testing (use cautiously)
    methods: 'GET,POST,PUT,DELETE',
  }));
const publicClassRoute = require('./publicClassRoute'); // Import the class routes
const privateClassRoute = require('./privateClassRoute'); // Import the class routes  

app.use('/api', publicClassRoute); // Prefix /api for class routes
app.use('/api', privateClassRoute); // Prefix /api for class routes

// Rename the instance of the Pool to avoid overwriting the imported Pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, email FROM users'); // Fetch only id and email for simplicity
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Error fetching users' });
  }
});

app.post('/api/register', async (req, res) => {
  const { email, fullname, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      'INSERT INTO users(email, fullname ,password) VALUES($1, $2, $3) RETURNING *',
      [email, fullname, hashedPassword]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Register Error:', error); // Log the error
    res.status(500).json({ error: 'Error registering user' });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (user.rows.length === 0) {
      return res.status(400).json({ error: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.rows[0].password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    
    // Add role to the token payload
    const token = jwt.sign(
      { id: user.rows[0].id, role: user.rows[0].role, email: user.rows[0].email, fullname: user.rows[0].fullname },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    res.status(200).json({ token });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: 'Error logging in' });
  }
});

app.post('/api/diet-plan', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const fullname = decoded.fullname;
    const { age, weight, height, activityLevel, goals, dietaryRestrictions } = req.body;

    const result = await pool.query(
      `INSERT INTO diet_requests (fullname, age, weight, height, activity_level, goals, dietary_restrictions)
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [fullname, age, weight, height, activityLevel, goals, dietaryRestrictions]
    );

    res.status(201).json({ message: 'Diet plan request submitted successfully', data: result.rows[0] });
  } catch (error) {
    console.error('Diet Plan Submission Error:', error);
    res.status(500).json({ error: 'Error submitting diet plan' });
  }
});

app.get('/api/admin/diet-plans', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the user has the 'admin' role
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const result = await pool.query('SELECT * FROM diet_requests');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching diet plans:', error);
    res.status(500).json({ error: 'Error fetching diet plans' });
  }
});

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: 'Gmail', // Or use another email service provider
  auth: {
    user: process.env.EMAIL, // Your email
    pass: process.env.EMAIL_PASSWORD, // Your email password
  },
});

// API to send diet plan email
app.post('/api/admin/send-diet-plan', async (req, res) => {
  try {
    const { email, dietPlan } = req.body;

    // Define email content
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Your Personalized Diet Plan',
      html: `
        <h1>Your Diet Plan</h1>
        <p>Here is your personalized diet plan:</p>
        <pre>${dietPlan}</pre>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Diet plan sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Error sending diet plan email' });
  }
});



// Centralized error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

