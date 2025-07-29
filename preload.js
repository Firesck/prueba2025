const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('api', {
  listPorts: () => ipcRenderer.invoke('serial-list'),
  connectPort: (path, baudRate) => ipcRenderer.invoke('serial-connect', path, baudRate),
  sendPTT: (data) => ipcRenderer.invoke('serial-send', data),
  disconnect: () => ipcRenderer.invoke('serial-disconnect')
});