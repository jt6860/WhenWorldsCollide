const express = require('express');
const cors = require('cors');
const dbFunctions = require('./database');
const { db } = require('./database');
const { app } = require('electron');
const path = require('path');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const rateLimit = require('express-rate-limit'); // Import express-rate-limit
const helmet = require('helmet');

const appExpress = express();
const port = 3000;
let server;

// Use Helmet for setting various HTTP headers to enhance security
appExpress.use(helmet());

// Basic rate-limiting to prevent brute-force attacks against authentication
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many login attempts from this IP, please try again after 15 minutes"
});
appExpress.use('/api/login', authLimiter);
appExpress.use('/api/register', authLimiter);

// Enable CORS with specific options (customize as needed)
appExpress.use(cors({
  origin: 'http://localhost:4200', // Only allow requests from your frontend origin
  methods: ['GET', 'POST', 'PUT'],    // Specify allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'] // Control allowed headers
}));

appExpress.use(express.json());
// Parse JSON request bodies with a size limit (mitigates DoS)
appExpress.use(bodyParser.json({ limit: '10kb' }));

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

// Example of parameterized query to prevent SQL injection
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

// GET World Pizza Tour items for the current month
appExpress.get('/api/world-pizza-tour', (req, res) => {
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  const query = 'SELECT * FROM world_pizza_tour WHERE month = ?';

  db.all(query, [currentMonth], (err, rows) => {
    if (err) {
      console.error('Error fetching World Pizza Tour items:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// POSTS
// Contact Form Submission
appExpress.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;

  // Basic input validation
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }
  if (name.length > 20) { // Name length limit
    return res.status(400).json({ error: 'Name is too long.' });
  }

  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format.' });
  }

  // Use parameterized queries to prevent SQL injection
  const query = 'INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)';
  db.run(query, [name, email, message], (err) => { // Using parameterization
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

  // Basic input validation
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  // Check for username existence
  const checkUserQuery = 'SELECT * FROM admincredentials WHERE username = ?';
  db.get(checkUserQuery, [username], (err, row) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'Registration error.' });
    }

    if (row) {
      return res.status(409).json({ message: 'Username already exists.' });
    } else {
      // Hash the password
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
          console.error('Error hashing password:', err);
          return res.status(500).json({ message: 'Registration error.' });
        }

        // Insert new user with hashed password
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

  // Basic input validation
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
      // Compare the provided password with the hashed password in the database
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

// POST for submitting an order
appExpress.post('/api/orders', (req, res) => {
  const { name, orderitems, totalprice } = req.body;

  // Basic input validation
  if (!name || !orderitems || totalprice === undefined) {
    return res.status(400).json({ error: 'Invalid order data.' });
  }

  // Prevent prototype pollution
  if (orderitems.indexOf('__proto__') !== -1 || orderitems.indexOf('constructor') !== -1 || orderitems.indexOf('prototype') !== -1) {
    return res.status(400).json({ error: 'Invalid order data.' });
  }

  // Convert orderitems from JSON string to array for further processing if needed
  let orderItemsArray;
  try {
    orderItemsArray = JSON.parse(orderitems);
    if (!Array.isArray(orderItemsArray)) {
      throw new Error('Parsed orderitems is not an array');
    }
  } catch (error) {
    console.error('Error parsing orderitems:', error);
    return res.status(400).json({ error: 'Invalid order items data.' });
  }

  // Convert the orderitems array back to a JSON string for database insertion
  const orderitemsString = JSON.stringify(orderItemsArray);

  const insertOrder = db.prepare('INSERT INTO customerorder (name, orderitems, totalprice) VALUES (?, ?, ?)');
  insertOrder.run(name, orderitemsString, totalprice, function (err) {
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

  // Basic input validation
  if (!name || !description || !category || price === undefined) {
    return res.status(400).json({ error: 'Incomplete menu item data.' });
  }


  const query = 'UPDATE menuitems SET name = ?, description = ?, category = ?, price = ? WHERE id = ?';
  db.run(query, [name, description, category, price, id], (err) => {
    if (err) {
      console.error('Error updating menu item:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Menu item updated successfully.' });
  });
});

appExpress.put('/api/world-pizza-tour/:id', (req, res) => {
  const id = req.params.id;
  const { menu_item_id, month, name, description } = req.body;

  // Basic input validation
  if (!month || !name || !description) {
    return res.status(400).json({ error: 'Incomplete World Pizza Tour item data.' });
  }

  const query = 'UPDATE world_pizza_tour SET menu_item_id = ?, month = ?, name = ?, description = ? WHERE id = ?';
  db.run(query, [menu_item_id, month, name, description, id], function (err) {
    if (err) {
      console.error('Error updating World Pizza Tour item:', err);
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: `World Pizza Tour item with ID ${id} not found.` });
    }
    res.json({ message: 'World Pizza Tour item updated successfully.' });
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