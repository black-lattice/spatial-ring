import { ipcMain } from 'electron';
import { runCommand } from './projectRun.mjs';

export function initProjectRunHandlers(win) {
  ipcMain.handle('run-command', async (event, cmd, prjectPath) => {
    try {
      const result = await runCommand(cmd, prjectPath, win);
      return { success: true, result };
    } catch (error) {
      throw new Error(`运行命令失败: ${error.message}`);
    }
  });
}
