import { contextBridge, ipcRenderer } from 'electron'

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
    // PDF operations will be added here
    readPDF: (filePath: string) => ipcRenderer.invoke('read-pdf', filePath),
    savePDF: (data: any) => ipcRenderer.invoke('save-pdf', data),
})
