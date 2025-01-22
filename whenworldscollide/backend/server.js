const express = require('express');
const cors = require('cors');
const dbFunctions = require('./database');
const { db } = require('./database');
const { app } = require('electron');
const path = require('path');
const bodyParser = require('body-parser');

const appExpress = express();
const port = 3000;
let server;

appExpress.use(express.json());
appExpress.use(cors());
appExpress.use(bodyParser.json());

dbFunctions.initialCNI();

db.serialize(() => {
  db.get('SELECT name FROM sqlite_master WHERE type="table" LIMIT 1;', (err, row) => {
    if (err) {
      console.error('Database connection failed:', err.message);
    } else {
      console.log('Database connected and initialized:', row ? 'Tables found' : 'No tables found');
    }
  });
});

// GETS
appExpress.get('/', (req, res) => {
  res.send('Hello from Express!');
});

appExpress.get('/api/menu', (req, res) => {
  db.all('SELECT * FROM menuitems', (err, rows) => {
    if (err) {
      console.error('Error fetching menu items:', err);
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

appExpress.get('/api/contact', (req, res) => {
  db.all('SELECT * FROM contacts', (err, rows) => {
    if (err) {
      console.error('Error fetching contact submissions:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// POSTS
appExpress.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;

  console.log('Incoming Contact Request:', req.body);

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const query = 'INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)';
  db.run(query, [name, email, message], (err) => {
    if (err) {
      console.error('Error inserting contact form data:', err.message);
      return res.status(500).json({ error: 'Failed to save contact form data.' });
    }

    res.status(200).json({ message: 'Contact form submitted successfully!' });
  });
});

appExpress.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  const query = 'SELECT * FROM admincredentials WHERE username = ? AND password = ?'; // Compare username and password directly

  db.get(query, [username, password], (err, row) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'Login error.' });
    }

    if (row) {
      console.log("Login successful!");
      res.status(200).json({ message: 'Login successful.', username: row.username });
    } else {
      console.log("Invalid credentials");
      return res.status(401).json({ message: 'Invalid username or password.' });
    }
  });
});

// PUTS
appExpress.put('/api/menu/:id', (req, res) => {
  const id = req.params.id;
  const { name, description, category, price } = req.body;

  const query = 'UPDATE menuitems SET name = ?, description = ?, category = ?, price = ? WHERE id = ?';
  db.run(query, [name, description, category, price, id], (err) => {
    if (err) {
      console.error('Error updating menu item:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Menu item updated successfully.' });
  });
});

module.exports = {
  start: () => {
    server = appExpress.listen(port, () => {
      console.log(`Backend listening on port ${port}`);
    });
  },
  stop: () => {
    if (server) {
      server.close();
    }
  },
};