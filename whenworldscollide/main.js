// main.js (Electron main process)

const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const url = require('url');
const express = require('express');
const cors = require('cors');
const backendApp = express(); 
const port = 3000; 
const dbFunctions = require('./backend/database');

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
  backendApp.use(cors())
  dbFunctions.initialCNI();

  // API routes
  backendApp.get('/', (req, res) => {
    res.send('Hello from Express!');
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