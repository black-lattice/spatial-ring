import { defineStore } from 'pinia';
import { ref } from 'vue';
export const useWorkspaceStore = defineStore('workspaceStore', () => {
  let workspace = ref({});
  let projectLists = ref([]);
  async function createWorkspace() {
    try {
      return window.electronAPI.user.createWorkspace();
    } catch (error) {
      throw error;
    }
  }
  async function readWorkspace() {
    try {
      let res = await window.electronAPI.user.readWorkspace();
      res = JSON.parse(res);
      workspace.value = Object.assign(workspace.value, res);
      projectLists.value = workspace.value.projectLists || [];
    } catch (error) {
      throw error;
    }
  }
  async function updateWorkspace(data) {
    try {
      return window.electronAPI.user.updateWorkspace(data);
    } catch (error) {
      throw error;
    }
  }
  async function closeWorkspace(data) {
    try {
      return window.electronAPI.user.closeWorkspace(data);
    } catch (error) {
      throw error;
    }
  }
  async function selectProject() {
    try {
      const result = await window.electronAPI.file.readDir('');
      projectLists.value = upsertWithMap(projectLists.value, 'path', result);
      workspace.value['projectLists'] = projectLists.value;
      let res = JSON.stringify(workspace.value);
      updateWorkspace(res);
    } catch (error) {
      throw error;
    }
  }
  // 写的太好了吧！爱了爱了😍
  function upsertWithMap(arr, key, targetObj) {
    const map = new Map(arr.map((item) => [item[key], item]));
    map.set(targetObj[key], { ...map.get(targetObj[key]), ...targetObj });
    return Array.from(map.values());
  }
  return {
    projectLists,
    createWorkspace,
    readWorkspace,
    updateWorkspace,
    closeWorkspace,
    selectProject,
  };
});
