import fs from 'fs';
import path from 'path';
import { dialog, shell, app } from 'electron';

export class FileReader {
  /**
   * 读取文件夹 - 使用Electron对话框选择文件夹
   * @returns {Promise<{path: string, files: string[]}>}
   */
  async readDirWithDialog(fullPath = '') {
    let dirPath = fullPath;
    if (!dirPath) {
      const { canceled, filePaths } = await dialog.showOpenDialog({
        properties: ['openDirectory'],
      });
      if (canceled || !filePaths.length) return null;
      dirPath = filePaths[0];
    }
    const files = await fs.promises.readdir(dirPath);
    // 过滤掉隐藏文件和文件夹
    const filteredFiles = files.map((file) => {
      const fullPath = path.join(dirPath, file);
      const stats = fs.statSync(fullPath);
      return {
        name: file,
        isFolder: stats.isDirectory(),
        fullPath: fullPath,
        isHidden: file.startsWith('.'),
      };
    });
    const sortFiles = filteredFiles.sort((a, b) => {
      if (a.isFolder && !b.isFolder) return -1;
      if (!a.isFolder && b.isFolder) return 1;
      return a.name.localeCompare(b.name);
    });
    return { path: dirPath, files: sortFiles };
  }

  /**
   * 读取文件 - 使用Electron对话框选择文件
   * @returns {Promise<{path: string, content: string}>}
   */
  async readFile(filePath) {
    try {
      const content = await fs.promises.readFile(filePath, 'utf-8');
      return { filePath: filePath, content };
    } catch (err) {
      console.error('读取文件失败:', err);
      throw err;
    }
  }

  /**
   * 在资源管理器中显示文件/文件夹
   * @param {string} path
   */
  showInExplorer(path) {
    shell.showItemInFolder(path);
  }
}

export class FileCreator {
  /**
   * 创建文件 - 使用Electron对话框选择保存位置
   * @param {string} [defaultName]
   * @param {string} [content]
   * @returns {Promise<{path: string}>}
   */
  async createFile(filePath, content = '') {
    try {
      await fs.promises.writeFile(filePath, content);
      return { path: filePath };
    } catch (err) {
      console.error('创建/保存文件失败:', err);
      throw err;
    }
  }
  /**
   * 创建文件夹 - 使用Electron对话框选择保存位置
   * @param {string} [defaultName]
   * @returns {Promise<{path: string}>}
   */
  async createFolder(filePath) {
    try {
      await fs.promises.mkdir(filePath);
      return { path: filePath };
    } catch (err) {
      console.error('创建文件夹失败:', err);
      throw err;
    }
  }
}

export class FileOperate {
  constructor() {
    this.recentFiles = {};
  }
  /**
   * 获取最近打开的文件列表
   * @returns {string[]}
   */
  getRecentFiles(len = 5) {
    try {
      return Object.keys(this.recentFiles)
        .map((key) => {
          return {
            path: key,
            count: this.recentFiles[key],
          };
        })
        .sort((a, b) => {
          return b.count - a.count;
        })
        .slice(0, len);
    } catch (err) {
      console.log(err, 'getRecentFiles');
      throw err;
    }
  }

  /**
   * 添加文件到最近打开列表
   * @param {string} filePath
   */
  addToRecentFiles(filePath) {
    try {
      if (!this.recentFiles[filePath]) {
        this.recentFiles[filePath] = 0;
      }
      this.recentFiles[filePath]++;
    } catch (err) {
      console.log(err, 'addToRecentFiles');
      throw err;
    }
  }

  /**
   * 安全删除文件 - 先移动到回收站
   * @param {string} filePath
   * @returns {Promise<void>}
   */
  async safeRemoveFile(filePath) {
    try {
      await shell.trashItem(filePath);
    } catch (err) {
      throw err;
    }
  }

  /**
   * 打开文件
   * @param {string} filePath
   * @returns {Promise<void>}
   */
  async openFile(filePath) {
    try {
      await shell.openPath(filePath);
      this.addToRecentFiles(filePath);
    } catch (err) {
      throw err;
    }
  }
  /**
   * 判断是否是一个文件夹
   */
  isDirectory(pathString) {
    try {
      const resolvedPath = path.resolve(pathString);
      return resolvedPath.endsWith(path.sep);
    } catch (error) {
      console.log(error, 'Error resolving path');
      return false;
    }
  }
  /**
   * 修改文件/文件夹名称
   * @param {string} filePath
   * @param {string} newName
   * @returns {Promise<void>}
   */
  async rename(filePath, newName) {
    try {
      const dirPath = path.dirname(filePath);
      const newPath = path.join(dirPath, newName);
      await fs.promises.rename(filePath, newPath);
    } catch (err) {
      console.error('重命名文件/文件夹失败:', err);
      throw err;
    }
  }
}
