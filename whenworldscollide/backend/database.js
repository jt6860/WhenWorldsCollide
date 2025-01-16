const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('whenworldscollide.db');

db.serialize(() => {
  // Create the admincredentials table
  db.run(`CREATE TABLE IF NOT EXISTS admincredentials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    password TEXT NOT NULL
  )`);

  // Insert admin credentials
  const adminCredentials = [
    { username: 'jtorres', password: 'passwordjt' },
    { username: 'rmarshall', password: 'passwordrm' },
    { username: 'dmunoz', password: 'passworddm' },
    { username: 'jcollins', password: 'passwordjc' }
  ];

  const stmt = db.prepare('INSERT INTO admincredentials (username, password) VALUES (?, ?)');
  adminCredentials.forEach((credentials) => {
    stmt.run(credentials.username, credentials.password);
  });
  stmt.finalize();

  // Create the menuitems table
  db.run(`CREATE TABLE IF NOT EXISTS menuitems (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT,
    price REAL
  )`);

  // Insert menu items (this is a simplified example, 
  // you'll need to format your menu data properly)
  const menuItems = [
    { name: 'Neapolitan Margherita', description: 'Experience the pinnacle...', category: 'Signature Pizzas', price: 14.00 },
    { name: 'New York Style Cheese', description: 'A true New York classic!...', category: 'Signature Pizzas', price: 12.00 },
    { name: 'Chocolate Lava Cake', description: 'A decadent dessert...', category: 'Sweet Endings', price: 9.00 },
    { name: 'World Pizza Tour', description: 'A Monthly Culinary Adventure...', category: 'World Pizza Tour', price: 20.00 }
  ];

  const stmt2 = db.prepare('INSERT INTO menuitems (name, description, category, price) VALUES (?, ?, ?, ?)');
  menuItems.forEach((item) => {
    stmt2.run(item.name, item.description, item.category, item.price);
  });
  stmt2.finalize();

  // Create the customerorder table
  db.run(`CREATE TABLE IF NOT EXISTS customerorder (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    orderitems TEXT NOT NULL, 
    totalprice REAL NOT NULL
  )`); 
});