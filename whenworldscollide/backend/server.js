const express = require('express');
const cors = require('cors');
const dbFunctions = require('./database'); // Import database setup and functions
const { db } = require('./database'); // Use the exported `db` instance directly

const app = express();
const port = 3000; // Port for the server

// Middleware to parse JSON request bodies and enable CORS
app.use(express.json());
app.use(cors());

// Initialize the database (set up tables and seed data)
dbFunctions.initialCNI();

// Test database connection
db.serialize(() => {
  db.get('SELECT name FROM sqlite_master WHERE type="table" LIMIT 1;', (err, row) => {
    if (err) {
      console.error('Database connection failed:', err.message);
    } else {
      console.log('Database connected and initialized:', row ? 'Tables found' : 'No tables found');
    }
  });
});

// API routes
app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

// Get all menu items
app.get('/api/menu', (req, res) => {
  db.all('SELECT * FROM menuitems', (err, rows) => {
    if (err) {
      console.error('Error fetching menu items:', err);
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Handle POST request for the Contact form
app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;

  // Log the incoming request for debugging
  console.log('Incoming Contact Request:', req.body);

  // Validate input
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  // Insert the contact data into the database
  const query = 'INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)';
  db.run(query, [name, email, message], (err) => {
    if (err) {
      console.error('Error inserting contact form data:', err.message);
      return res.status(500).json({ error: 'Failed to save contact form data.' });
    }

    res.status(200).json({ message: 'Contact form submitted successfully!' });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
