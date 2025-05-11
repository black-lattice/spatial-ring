import { ipcMain } from 'electron';
import { FileOperate, FileReader, FileCreator } from './fileOperate.mjs';

const fileOperate = new FileOperate();
const fileReader = new FileReader();
const fileCreator = new FileCreator();
/**
 * 初始化文件操作IPC监听器
 */
export function initFileOperateHandlers() {
  ipcMain.handle('file:create-file', async (_, { filePath, content = '' }) => {
    try {
      return await fileCreator.createFile(filePath, content);
    } catch (err) {
      throw err;
    }
  });
  ipcMain.handle('file:create-folder', async (_, filePath) => {
    try {
      return await fileCreator.createFolder(filePath);
    } catch (err) {
      throw err;
    }
  });
  // 读取文件夹
  ipcMain.handle('file:read-dir', async (_, options) => {
    try {
      let res = await fileReader.readDirWithDialog(options);

      if (res) {
        !options && fileOperate.addToRecentFiles(res.path);
        return res;
      }
    } catch (err) {
      throw err;
    }
  });

  // 读取文件
  ipcMain.handle('file:read-file', async (_, filePath) => {
    try {
      return await fileReader.readFile(filePath);
    } catch (err) {
      throw err;
    }
  });

  // 创建/保存文件
  // ipcMain.handle('file:save-file', async (_, { filePath, content }) => {
  //     try {
  //         return await fileCreator.createFile(filePath, content);
  //     } catch (err) {
  //         throw err;
  //     }
  // });

  // 删除文件
  ipcMain.handle('file:delete', async (_, filePath) => {
    try {
      await fileOperate.safeRemoveFile(filePath);
      return { success: true };
    } catch (err) {
      throw err;
    }
  });

  // 复制文件
  ipcMain.handle('file:copy', async (_, { source, destination }) => {
    try {
      await fs.promises.copyFile(source, destination);
      return { success: true };
    } catch (err) {
      throw err;
    }
  });

  // 移动文件
  ipcMain.handle('file:move', async (_, { source, destination }) => {
    try {
      await fs.promises.rename(source, destination);
      return { success: true };
    } catch (err) {
      throw err;
    }
  });

  // 在资源管理器中显示文件
  ipcMain.handle('file:show-in-explorer', (_, filePath) => {
    try {
      fileReader.showInExplorer(filePath);
      return { success: true };
    } catch (err) {
      throw err;
    }
  });

  // 获取最近文件列表
  ipcMain.handle('file:get-recent', (_, len) => {
    try {
      return fileOperate.getRecentFiles(len);
    } catch (err) {
      throw err;
    }
  });
  // 获取最近文件列表
  ipcMain.handle('file:rename', (_, { filePath, newName }) => {
    try {
      return fileOperate.rename(filePath, newName);
    } catch (err) {
      throw err;
    }
  });
}
