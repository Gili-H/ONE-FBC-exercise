const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  createAndOpenEml: (data) => ipcRenderer.invoke('create-eml', data)
});
