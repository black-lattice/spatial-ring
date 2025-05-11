import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { useFileStore } from './fileOperate';
export const useFileCacheStore = defineStore('fileCache', () => {
  let selectedPath = ref('');
  // 目录结构缓存 { [path]: { files: string[], lastModified: number } }
  const dirCache = ref({});
  const dirStatus = ref({});
  // 设置活动路径
  let activePath = ref('');
  // let fileContTemp = ref({})
  // 获取目录内容
  const getDir = (path = selectedPath.value) => {
    if (!path) return;
    if (!dirCache.value[path]) {
      const fileOperate = useFileStore();
      fileOperate.readDir(path);
    }
    activePath.value = path;
    return dirCache.value[path];
  };

  // 缓存目录内容
  const cacheDir = (path, files) => {
    dirCache.value[path] = {
      fullPath: path,
      files,
    };
  };
  // 清除目录缓存
  const clearDirCache = (path) => {
    delete dirCache.value[path];
    delete selectedPath.value;
  };

  // 增加一条数据到dir中
  const addFileOrFolder = (path, type) => {
    let parentPath = path.slice(0, path.lastIndexOf('/'));
    const dir = dirCache.value[path] || dirCache.value[parentPath];
    if (!dir) return;
    let name = type === 'addFolder' ? 'newFolder' : 'newFile';
    !dir.files[0].isAdd &&
      dir.files.unshift({
        name,
        fullPath: dir.fullPath + '/' + name,
        isFolder: type === 'addFolder',
        isHidden: false,
        isAdd: true,
      });
    dirStatus.value[dir.fullPath] = true;
  };
  const deleteFileOrFolder = (path) => {
    let parentPath = path.length > selectedPath.value.length ? path.slice(0, path.lastIndexOf('/')) : path;
    let dir = dirCache.value[parentPath];
    if (!dir) return;
    dir.files = dir.files.filter((item) => item.fullPath !== path);
  };
  const updateFileOrFolder = (path, name) => {
    let parentPath = path.slice(0, path.lastIndexOf('/'));
    let dir = dirCache.value[parentPath];
    if (!dir) return;
    let item = dir?.files.find((item) => item.fullPath === path);
    let fullPath = dir.fullPath + '/' + name;
    Promise.resolve()
      .then(async () => {
        const fileStore = useFileStore();
        return await fileStore.addFileOrFolder(fullPath, item.isFolder ? 'addFolder' : 'addFile');
      })
      .then(() => {
        item.name = name;
        item.fullPath = fullPath;
        delete item?.isAdd;
        dir.files.sort((a, b) => {
          if (a.isFolder && !b.isFolder) return -1;
          if (!a.isFolder && b.isFolder) return 1;
          return a.name.localeCompare(b.name);
        });
      })
      .catch((err) => {
        console.error(err);
        deleteFileOrFolder(path);
      });
  };
  const refreshFileOrFolder = async () => {
    let p = activePath.value;
    let temp = activePath.value;
    if (!dirCache.value[p]) {
      p = p.slice(0, p.lastIndexOf('/'));
    }
    await getDir(p);
    activePath.value = temp;
  };
  const closeFolder = () => {
    Object.keys(dirStatus.value).forEach((key) => {
      dirStatus.value[key] = false;
    });
  };
  return {
    selectedPath,
    dirCache,
    activePath,
    dirStatus,
    // fileContTemp,
    getDir,
    cacheDir,
    clearDirCache,
    addFileOrFolder,
    deleteFileOrFolder,
    updateFileOrFolder,
    refreshFileOrFolder,
    closeFolder,
  };
});
