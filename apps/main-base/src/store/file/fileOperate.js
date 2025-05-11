import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useFileCacheStore } from './fileCache';

export const useFileStore = defineStore('file', () => {
  // 状态
  const currentDir = ref(null);
  const fileList = ref([]);
  const recentFiles = ref([]);
  const isLoading = ref(false);
  const error = ref(null);

  // 操作方法
  const readDir = async (path, type = '') => {
    try {
      isLoading.value = true;
      const result = await window.electronAPI.file.readDir(path);
      if (result) {
        currentDir.value = result.path;
        fileList.value = result.files;
        // 缓存目录内容
        const fileCache = useFileCacheStore();
        fileCache.cacheDir(result.path, result.files);
        type === 'root' && (fileCache.selectedPath = result.path);
      }
      return result;
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const readFile = async (options) => {
    try {
      isLoading.value = true;
      return await window.electronAPI.file.readFile(options);
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const saveFile = async (filePath, content) => {
    try {
      isLoading.value = true;
      return await window.electronAPI.file.saveFile(filePath, content);
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const deleteFile = async (filePath) => {
    try {
      isLoading.value = true;
      await window.electronAPI.file.delete(filePath);
      // 从文件列表中移除已删除文件
      fileList.value = fileList.value.filter((file) => file !== filePath);
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const copyFile = async (source, destination) => {
    try {
      isLoading.value = true;
      await window.electronAPI.file.copy(source, destination);
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const moveFile = async (source, destination) => {
    try {
      isLoading.value = true;
      await window.electronAPI.file.move(source, destination);
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const showInExplorer = (filePath) => {
    window.electronAPI.file.showInExplorer(filePath);
  };

  const loadRecentFiles = async (len = 5) => {
    try {
      isLoading.value = true;
      recentFiles.value = await window.electronAPI.file.getRecent(len);
      console.log(recentFiles.value, '---', len, '---', 'recentFiles.value');
    } catch (err) {
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
  };
  const addFileOrFolder = async (filePath, type) => {
    try {
      isLoading.value = true;
      return await window.electronAPI.file[type === 'addFile' ? 'createFile' : 'createFolder'](filePath);
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      isLoading.value = false;
    }
  };
  const rename = async (filePath, newName) => {
    try {
      isLoading.value = true;
      return await window.electronAPI.file.rename(filePath, newName);
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      isLoading.value = false;
    }
  };
  return {
    // 状态
    currentDir,
    fileList,
    recentFiles,
    isLoading,
    error,

    // 方法
    readDir,
    readFile,
    saveFile,
    deleteFile,
    copyFile,
    moveFile,
    showInExplorer,
    addFileOrFolder,
    loadRecentFiles,
    rename,
  };
});
