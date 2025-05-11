import { createWorkspace, readWorkspace, updateWorkspace, closeWorkspace } from './workspace.mjs';
import { ipcMain } from 'electron';

export function workspaceHandlers() {
  ipcMain.handle('user:create-workspace', async (event, arg) => {
    try {
      return await createWorkspace();
    } catch (error) {
      throw new Error(error);
    }
  });
  ipcMain.handle('user:read-workspace', async (event, arg) => {
    try {
      return await readWorkspace();
    } catch (error) {
      throw new Error(error);
    }
  });
  ipcMain.handle('user:update-workspace', async (event, arg) => {
    try {
      return await updateWorkspace(arg);
    } catch (error) {
      throw new Error(error);
    }
  });
  ipcMain.handle('user:close-workspace', async (event, arg) => {
    try {
      return await closeWorkspace(arg);
    } catch (error) {
      throw new Error(error);
    }
  });
}
