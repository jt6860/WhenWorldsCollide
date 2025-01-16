// main.js (Electron main process)

const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const url = require('url');
const express = require('express');
const backendApp = express(); 
const port = 3000; 

// Keep a global reference of the window object
let win;

function createWindow() {
  win = new BrowserWindow({ width: 800, height: 600 });

  win.loadURL(
    url.format({
      pathname: path.join(__dirname, `/dist/whenworldscollide/browser/index.html`),
      protocol: 'file:',
      slashes: true
    })
  );

  // Open the DevTools (optional)
  // win.webContents.openDevTools()

  win.on('closed', () => {
    win = null;
  });
}

app.on('ready', () => {
  createWindow();

  const express = require('express');
  const backendApp = express();
  const port = 3000;

  backendApp.use(express.json());
  require('./backend/database');

  // API routes
  backendApp.get('/', (req, res) => {
    res.send('Hello from Express!');
  });

  backendApp.get('/api/menu', (req, res) => {
    const sqlite3 = require('sqlite3').verbose();
    const db = new sqlite3.Database('./backend/whenworldscollide.db');

    db.all('SELECT * FROM menuitems', (err, rows) => {
      if (err) {
        console.error("Error fetching menu items:", err);
        res.status(500).json({ error: err.message });
        return;
      }

      res.json(rows);
    });
  });

  // ... other API routes ...

  // Wait for the Angular dev server to start before starting Express
  const waitOn = require('wait-on'); 
  waitOn({
    resources: ['http://localhost:4200'], 
    timeout: 30000 
  }, err => {
    if (err) {
      console.error('Error waiting for Angular dev server:', err);
      return;
    }

    backendApp.listen(port, '0.0.0.0', () => { // Specify 0.0.0.0 as the host
      console.log(`Server listening on port ${port}`);
    });
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});

// ... other IPC handlers (if needed) ...