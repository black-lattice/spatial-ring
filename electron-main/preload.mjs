import { contextBridge, ipcRenderer } from 'electron';

import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// 安全暴露文件操作API给渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  __dirname: __dirname,
  file: {
    createFile: (filePath, content = '') => ipcRenderer.invoke('file:create-file', { filePath, content }),
    createFolder: (filePath) => ipcRenderer.invoke('file:create-folder', filePath),
    readDir: (options) => ipcRenderer.invoke('file:read-dir', options),
    readFile: (filePath) => ipcRenderer.invoke('file:read-file', filePath),
    saveFile: (filePath, content) => ipcRenderer.invoke('file:create-file', { filePath, content }),
    delete: (filePath) => ipcRenderer.invoke('file:delete', filePath),
    copy: (source, destination) => ipcRenderer.invoke('file:copy', { source, destination }),
    move: (source, destination) => ipcRenderer.invoke('file:move', { source, destination }),
    showInExplorer: (filePath) => ipcRenderer.invoke('file:show-in-explorer', filePath),
    getRecent: (len) => ipcRenderer.invoke('file:get-recent', len),
    rename: (filePath, newName) => ipcRenderer.invoke('file:rename', { filePath, newName }),
  },
  user: {
    createWorkspace: () => ipcRenderer.invoke('user:create-workspace'),
    readWorkspace: () => ipcRenderer.invoke('user:read-workspace'),
    updateWorkspace: (data) => ipcRenderer.invoke('user:update-workspace', data),
  },
  // runcmd: {
  //   runCommand: (cmd, prjectPath) => ipcRenderer.invoke('runcmd:run-command', { cmd, prjectPath }),
  // },
});
