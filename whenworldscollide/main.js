const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');
const backend = require('./backend/server');

let win;

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
    app.quit();
} else {
    app.on('second-instance', () => {
        if (win) {
            if (win.isMinimized()) win.restore();
            win.focus();
        }
    });

    app.on('ready', () => {
        createWindow();
        backend.start();
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

    app.on('before-quit', () => {
        backend.stop();
    });

    function createWindow() {
        win = new BrowserWindow({
            width: 800,
            height: 600,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
            },
        });

        win.loadURL(
            url.format({
                pathname: path.join(__dirname, `/dist/whenworldscollide/browser/index.html`),
                protocol: 'file:',
                slashes: true,
            })
        );

        win.on('closed', () => {
            win = null;
        });
    }
}