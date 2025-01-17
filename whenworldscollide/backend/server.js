// server.js

const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000; // Choose your desired port
const dbFunctions = require('./database');

// Middleware to parse JSON request bodies and CORS
app.use(express.json()); 
app.use(cors());

dbFunctions.initialCNI();

// API routes (you'll add more routes here)
app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

app.get('/api/menu', (req, res) => {
  const sqlite3 = require('sqlite3').verbose();
  const db = new sqlite3.Database('whenworldscollide.db');

  if (db) {
    console.log(db)
  }
  db.all('SELECT * FROM menuitems', (err, rows) => {
    if (err) {
      console.error("Error fetching menu items in main:", err);
      res.status(500).json({ error: err.message });
      return;
    }

    res.json(rows);
  });
});


// waitOn for Angular dev server to start
const waitOn = require('wait-on');
waitOn({
  resources: ['http://localhost:4200'],
  timeout: 30000
}, err => {
  if (err) {
    console.error('Error waiting for Angular dev server:', err);
    return;
  }
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});