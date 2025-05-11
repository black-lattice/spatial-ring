import { ref, computed } from 'vue';
import { defineStore, storeToRefs } from 'pinia';
import { useFileStore } from './file/fileOperate';
import { useFileCacheStore } from './file/fileCache';
import { useWorkspaceStore } from './workspace/workspace';
export { useFileStore, useFileCacheStore, useWorkspaceStore };
const urlMap = {
  markdown: '//localhost:7101',
  lume: '//localhost:7104',
  dynaload: '//localhost:7103',
  meta: '//localhost:7105',
};
const appList = [
  {
    name: 'workspace',
    shortName: 'Ws',
  },
  {
    name: 'file',
    shortName: 'File',
  },
  {
    name: 'markdown',
    shortName: 'MD',
  },
  // {
  //   name: 'lume',
  //   shortName: 'Lume',
  // },
  // {
  //   name: 'dynaload',
  //   shortName: 'Dyna',
  // },
  // {
  //   name: 'meta',
  //   shortName: 'Meta',
  // },
];
export const useGlobalStore = defineStore('global', () => {
  let protocol = process.env.NODE_ENV === 'electron' ? 'http://localhost:9999' : window.location.origin;
  let microAppName = ref('file');
  let microUrl = computed(() => {
    return process.env.NODE_ENV === 'development' ? urlMap[microAppName.value] : `${protocol}/dist/apps/${microAppName.value}/index.html`;
  });

  let microDataCache = ref({});
  let microData = computed(() => {
    return microDataCache.value[microAppName.value] || {};
  });
  function setMicroData(data) {
    if (!data.name) return;
    microDataCache.value[data.name] = data;
  }

  let sideBarLists = ref(appList);

  const fileCacheStore = useFileCacheStore();
  const { selectedPath } = storeToRefs(fileCacheStore);
  const fileStore = useFileStore();
  const { currentDir, fileList } = storeToRefs(fileStore);
  const chooseProject = (item) => {
    microAppName.value = 'file';
    currentDir.value = item.path;
    fileList.value = item.files;
    selectedPath.value = item.path;
    fileCacheStore.cacheDir(item.path, item.files);
  };
  return { sideBarLists, microAppName, microUrl, microData, setMicroData, chooseProject };
});
