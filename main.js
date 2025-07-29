const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const SerialPort = require('serialport');
let port;
function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true
    }
  });
  win.loadFile('index.html');
}
app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
ipcMain.handle('serial-list', async () => {
  const ports = await SerialPort.list();
  return ports.map(p => ({ path: p.path, manufacturer: p.manufacturer }));
});
ipcMain.handle('serial-connect', async (event, path, baudRate) => {
  return new Promise((resolve, reject) => {
    port = new SerialPort({ path, baudRate: parseInt(baudRate) }, (err) => {
      if (err) reject(err.message);
      else resolve('connected');
    });
  });
});
ipcMain.handle('serial-send', async (event, value) => {
  if (port && port.isOpen) {
    return new Promise((resolve, reject) => {
      port.write(Buffer.from([value ? 49 : 48]), err => {
        if (err) reject(err.message);
        else resolve('sent');
      });
    });
  }
});
ipcMain.handle('serial-disconnect', () => {
  if (port && port.isOpen) {
    port.close();
    port = null;
  }
});