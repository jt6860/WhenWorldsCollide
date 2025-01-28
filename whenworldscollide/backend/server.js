const express = require('express');
const cors = require('cors');
const dbFunctions = require('./database');
const { db } = require('./database');
const { app } = require('electron');
const path = require('path');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

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

appExpress.get('/api/orders', (req, res) => {
  db.all('SELECT * FROM customerorder', (err, rows) => {
    if (err) {
      console.error('Error fetching orders:', err);
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

// POST for registration
appExpress.post('/api/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  const checkUserQuery = 'SELECT * FROM admincredentials WHERE username = ?';
  db.get(checkUserQuery, [username], (err, row) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'Registration error.' });
    }

    if (row) {
      return res.status(409).json({ message: 'Username already exists.' });
    } else {
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
          console.error('Error hashing password:', err);
          return res.status(500).json({ message: 'Registration error.' });
        }

        const insertQuery = 'INSERT INTO admincredentials (username, password) VALUES (?, ?)';
        db.run(insertQuery, [username, hashedPassword], (err) => {
          if (err) {
            console.error('Database insert error:', err);
            return res.status(500).json({ message: 'Registration error.' });
          }

          res.status(201).json({ message: 'Registration successful.', username: username });
        });
      });
    }
  });
});

// POST for login
appExpress.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  const query = 'SELECT * FROM admincredentials WHERE username = ?';

  db.get(query, [username], (err, row) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'Login error.' });
    }

    if (row) {
      bcrypt.compare(password, row.password, (err, result) => {
        if (err) {
          console.error('Error comparing passwords:', err);
          return res.status(500).json({ message: 'Login error.' });
        }
        if (result) {
          console.log("Login successful!");
          res.status(200).json({ message: 'Login successful.', username: row.username });
        } else {
          console.log("Invalid credentials");
          return res.status(401).json({ message: 'Invalid username or password.' });
        }
      });
    } else {
      console.log("Invalid credentials");
      return res.status(401).json({ message: 'Invalid username or password.' });
    }
  });
});

appExpress.post('/api/orders', (req, res) => {
  const { name, orderitems, totalprice } = req.body;

  if (!name || !orderitems || totalprice === undefined) {
    return res.status(400).json({ error: 'Invalid order data.' });
  }

  const orderItemsArray = JSON.parse(orderitems);

  const insertOrder = db.prepare('INSERT INTO customerorder (name, orderitems, totalprice) VALUES (?, ?, ?)');
  insertOrder.run(name, orderitems, totalprice, function (err) {
    if (err) {
      console.error('Error inserting order:', err.message);
      return res.status(500).json({ error: 'Failed to save order.' });
    }

    const orderId = this.lastID; // Get the ID of the newly inserted order

    console.log('Order saved successfully:', { name, orderitems: orderItemsArray, totalprice });
    res.status(200).json({ message: 'Order submitted successfully!', orderId });
  });
  insertOrder.finalize();
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