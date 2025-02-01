const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const { app, dialog } = require('electron');
const bcrypt = require('bcrypt');

// Use app.isPackaged to determine the correct path
const userDataPath = app.isPackaged
  ? app.getPath('userData') // In production, use the userData path
  : path.join(__dirname, 'userData'); // In development, use a path relative to database.js

const dbPath = path.join(userDataPath, 'whenworldscollide.db');

// Create the user data directory if it doesn't exist.
fs.mkdirSync(userDataPath, { recursive: true });

// Check if the database file exists. If not, copy it from the resources folder or create it.
if (!fs.existsSync(dbPath)) {
  const sourceDbPath = app.isPackaged
    ? path.join(process.resourcesPath, 'backend', 'whenworldscollide.db')
    : path.join(__dirname, 'whenworldscollide.db'); // Adjusted for development

  // Check if a source database exists to copy from
  if (fs.existsSync(sourceDbPath)) {
    try {
      fs.copyFileSync(sourceDbPath, dbPath);
      console.log('Database copied to userData directory');
    } catch (err) {
      console.error('Error copying database:', err);
      // Handle error - you might want to show an error dialog and exit
    }
  } else {
    // If no source database exists, create an empty database
    console.log('No source database found. Creating an empty database.');
    const newDb = new sqlite3.Database(dbPath);
    newDb.close(); // Immediately close to release the file lock
    console.log('Empty database created at', dbPath);
  }
}

const db = new sqlite3.Database(dbPath);

function initialCNI() {
  db.serialize(() => {
    // Create the admincredentials table
    db.run(`CREATE TABLE IF NOT EXISTS admincredentials (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      password TEXT NOT NULL
    )`);

    // Hash the default passwords
    const saltRounds = 10;
    const defaultPasswords = {
      jtorres: 'passwordjt',
      rmarshall: 'passwordrm',
      dmunoz: 'passworddm',
      jcollins: 'passwordjc',
    };

    for (const username in defaultPasswords) {
      bcrypt.hash(
        defaultPasswords[username],
        saltRounds,
        (err, hashedPassword) => {
          if (err) {
            console.error('Error hashing password:', err);
            return;
          }

          // Insert admin credentials with hashed passwords
          const stmt = db.prepare(
            'INSERT OR IGNORE INTO admincredentials (username, password) VALUES (?, ?)'
          );
          stmt.run(username, hashedPassword);
          stmt.finalize();
        }
      );
    }

    // Create the menuitems table
    db.run(`CREATE TABLE IF NOT EXISTS menuitems (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        description TEXT,
        category TEXT,
        price REAL
        )`);

    // Create the world_pizza_tour table
    db.run(`CREATE TABLE IF NOT EXISTS world_pizza_tour (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      menu_item_id INTEGER,
      month TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      FOREIGN KEY (menu_item_id) REFERENCES menuitems(id)
    )`);

    // Create the contacts table if it doesn't exist
    db.run(`CREATE TABLE IF NOT EXISTS contacts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        message TEXT NOT NULL
        )`);

    // Menu items (without options)
    const menuItems = [
      // Signature Pizzas
      {
        name: 'Neapolitan Margherita',
        description:
          "Experience the pinnacle of pizza with this classic Neapolitan pie. Featuring San Marzano tomatoes, fresh mozzarella, fragrant basil, and a drizzle of extra virgin olive oil, it's a symphony of simple flavors.",
        category: 'Signature Pizzas',
        price: 14.0,
      },
      {
        name: 'New York Style Cheese',
        description:
          'A true New York classic! Enjoy a simple yet satisfying pizza with high-quality mozzarella cheese melted to perfection on our signature thin, hand-tossed crust.',
        category: 'Signature Pizzas',
        price: 12.0,
      },
      {
        name: "Chicago Deep Dish Meat Lover's",
        description:
          "Dive into a hearty Chicago-style experience. This deep-dish masterpiece is layered with Italian sausage, pepperoni, ground beef, and crispy bacon, then generously topped with a blanket of mozzarella cheese and finished with a rich marinara sauce.",
        category: 'Signature Pizzas',
        price: 22.0,
      },
      {
        name: 'Detroit-Style Veggie',
        description:
          'Our Detroit-style pizza features a unique, crispy, caramelized crust. Enjoy a flavorful vegetarian option with onions, mushrooms, bell peppers, spinach, mozzarella, and Wisconsin brick cheese.',
        category: 'Signature Pizzas',
        price: 18.0,
      },
      {
        name: 'Sicilian',
        description:
          'Indulge in our thick, rectangular Sicilian pizza. This classic features a light and airy interior, topped with San Marzano tomatoes, oregano, a generous layer of mozzarella cheese, and a drizzle of olive oil for a touch of Mediterranean flair.',
        category: 'Signature Pizzas',
        price: 16.0,
      },

      // Fresh Salads
      {
        name: 'Caprese Salad',
        description:
          'A vibrant and refreshing salad featuring fresh mozzarella, ripe tomatoes, and fragrant basil leaves. Drizzled with balsamic glaze and extra virgin olive oil for a touch of sweetness.',
        category: 'Fresh Salads',
        price: 8.0,
      },
      {
        name: 'Greek Salad',
        description:
          'A classic Greek salad with crisp romaine lettuce, diced cucumbers, ripe tomatoes, red onions, Kalamata olives, crumbled feta cheese, and a zesty lemon-oregano vinaigrette.',
        category: 'Fresh Salads',
        price: 9.0,
      },
      {
        name: 'Caesar Salad',
        description:
          'Our Caesar Salad is a timeless favorite. Enjoy crisp romaine lettuce, crunchy croutons, grated Parmesan cheese, and our creamy homemade Caesar dressing.',
        category: 'Fresh Salads',
        price: 7.0,
      },

      // Appetizers
      {
        name: 'Spanish Tapas Platter',
        description:
          'Embark on a culinary journey to Spain with this delightful platter. Enjoy patatas bravas (crispy fried potatoes with a spicy paprika aioli), chorizo al ajillo (grilled Spanish chorizo with garlic), and aceitunas marinadas (marinated mixed olives).',
        category: 'Appetizers',
        price: 12.0,
      },
      {
        name: 'Vegetable Samosas',
        description:
          'Savory and satisfying. Crispy, triangular pastries filled with a spiced mixture of potatoes, peas, and onions. Served with a tangy tamarind chutney for a perfect balance of flavors.',
        category: 'Appetizers',
        price: 7.0,
      },
      {
        name: 'Garrett’s Popcorn Chicken',
        description:
          "A unique twist on a classic! Bite-sized pieces of crispy fried chicken infused with the legendary Chicago signature Garrett's Popcorn seasoning. Perfectly seasoned and served with honey mustard sauce for dipping.",
        category: 'Appetizers',
        price: 9.0,
      },

      // Sweet Endings
      {
        name: 'Tiramisu',
        description:
          'Indulge in this classic Italian dessert. Layers of ladyfingers soaked in espresso, layered with creamy mascarpone cheese, and dusted with cocoa powder.',
        category: 'Sweet Endings',
        price: 8.0,
      },
      {
        name: 'New York Cheesecake',
        description:
          'A true New York classic! Our cheesecake features a smooth and creamy texture with a buttery graham cracker crust.',
        category: 'Sweet Endings',
        price: 7.0,
      },
      {
        name: 'Paczki',
        description:
          'Traditional Polish doughnuts filled with various flavors like raspberry or custard and dusted with powdered sugar. A delightful treat for any occasion.',
        category: 'Sweet Endings',
        price: 3.0,
      },
      {
        name: 'Baklava',
        description:
          'Layers of flaky filo pastry filled with chopped nuts (walnuts, pistachios) and drizzled with sweet honey syrup. A taste of Greece with every bite.',
        category: 'Sweet Endings',
        price: 6.0,
      },
      {
        name: 'Chocolate Lava Cake',
        description:
          'A decadent dessert. Our rich chocolate cake features a warm, molten chocolate center, served with a scoop of vanilla ice cream.',
        category: 'Sweet Endings',
        price: 9.0,
      },
    ];

    // Insert menu items
    const insertMenuItem = db.prepare(
      'INSERT OR IGNORE INTO menuitems (name, description, category, price) VALUES (?, ?, ?, ?)'
    );
    menuItems.forEach((item) => {
      insertMenuItem.run(item.name, item.description, item.category, item.price);
    });
    insertMenuItem.finalize();

    // Insert the main World Pizza Tour item into menuitems table
    const worldPizzaTourData = {
      name: 'World Pizza Tour',
      description: 'A Monthly Culinary Adventure',
      category: 'World Pizza Tour',
      price: 20.00,
    };

    const insertWorldPizzaTour = db.prepare(
      'INSERT OR IGNORE INTO menuitems (name, description, category, price) VALUES (?, ?, ?, ?)'
    );
    insertWorldPizzaTour.run(
      worldPizzaTourData.name,
      worldPizzaTourData.description,
      worldPizzaTourData.category,
      worldPizzaTourData.price,
      function (err) {
        if (err) {
          console.error('Error inserting World Pizza Tour menu item:', err.message);
          return;
        }

        const worldPizzaTourMenuItemId = this.lastID; // Get the ID of the inserted menu item

        // Insert monthly variations into world_pizza_tour table
        const worldPizzaTourItemsData = [
          {
            month: 'January',
            name: "Irish Shepherd's Pie Pizza",
            description:
              'Warm and comforting, perfect for the cold winter months.',
          },
          {
            month: 'February',
            name: 'German Bratwurst Pizza',
            description:
              'Hearty and flavorful, a great choice for the chilly February weather.',
          },
          {
            month: 'March',
            name: 'Argentine Fugazza',
            description: 'Simple yet satisfying, a good transition into spring.',
          },
          {
            month: 'April',
            name: 'Lebanese Manoushe',
            description: 'Light and refreshing, perfect for the arrival of spring.',
          },
          {
            month: 'May',
            name: 'Greek Spanakopita Pizza',
            description:
              'Fresh and vibrant flavors, ideal for the warmer spring months.',
          },
          {
            month: 'June',
            name: 'Mexican Al Pastor Pizza',
            description: 'Zesty and flavorful, perfect for a summer treat.',
          },
          {
            month: 'July',
            name: 'Hawaiian Classic Hawaiian',
            description: 'A classic summer pizza, light and refreshing.',
          },
          {
            month: 'August',
            name: 'Brazilian Churrasco Pizza',
            description:
              'Grilled meats and vibrant chimichurri sauce, ideal for summer barbecues.',
          },
          {
            month: 'September',
            name: 'Indian Tandoori Chicken Pizza',
            description:
              'Spicy and flavorful, perfect for the transition to fall.',
          },
          {
            month: 'October',
            name: 'Korean Bulgogi Pizza',
            description:
              'Hearty and warming, a great choice for the cooler autumn months.',
          },
          {
            month: 'November',
            name: 'Japanese Teriyaki Chicken Pizza',
            description: 'Sweet and savory, a comforting option for the fall.',
          },
          {
            month: 'December',
            name: 'Thai Pad Thai Pizza',
            description:
              'A unique and flavorful option for the holiday season.',
          },
        ];

        const insertWorldPizzaTourItem = db.prepare(
          'INSERT INTO world_pizza_tour (menu_item_id, month, name, description) VALUES (?, ?, ?, ?)'
        );
        worldPizzaTourItemsData.forEach((item) => {
          insertWorldPizzaTourItem.run(
            worldPizzaTourMenuItemId,
            item.month,
            item.name,
            item.description
          );
        });
        insertWorldPizzaTourItem.finalize();
      }
    );
    insertWorldPizzaTour.finalize();

    // Create the customerorder table
    db.run(`CREATE TABLE IF NOT EXISTS customerorder (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        orderitems TEXT NOT NULL, 
        totalprice REAL NOT NULL
        )`);
  });
}

module.exports = { db, initialCNI };