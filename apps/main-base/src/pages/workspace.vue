<script setup>
import { onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useWorkspaceStore } from '@/store/index';
const workspaceStore = useWorkspaceStore();
const { projectLists } = storeToRefs(workspaceStore);
workspaceStore.createWorkspace();
onMounted(() => {
  workspaceStore.readWorkspace();
});
const selectProject = async () => {
  await workspaceStore.selectProject();
};
function getPathName(path) {
  if (!path) return;
  return path?.match(/[^/\\]+$/)[0] || '';
}

import { useRouter } from 'vue-router';
const router = useRouter();
import { useGlobalStore } from '@/store/index';
const globalStore = useGlobalStore();
const chooseProject = (item) => {
  globalStore.chooseProject(item);
  router.push({ name: 'file' });
};
</script>
<template>
  <div class="workspace">
    <div class="top">
      <div class="note">工作空间</div>
      <div class="note">将在桌面创建spatial-ring-workspace.json文件</div>
    </div>
    <div class="projects">
      <div class="project" v-for="item of projectLists" :key="item.path" @click="chooseProject(item)">
        <div class="name">项目名称: {{ getPathName(item.path) }}</div>
        <div class="path">项目地址: {{ item.path }}</div>
        <div class="path">项目文件夹:</div>
        <div class="folder">
          <span v-for="sub of item.files">{{ sub.name }}</span>
        </div>
      </div>
      <div class="project add" @click="selectProject">
        <icon-plus />
      </div>
    </div>
  </div>
</template>
<style scoped lang="less">
.workspace {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: @DefaultBG;
  padding: @padding;
  gap: @Gap;
  font-weight: 600;
  .top {
    display: flex;
    flex-direction: column;
    gap: @Gap;
    .note {
      font-size: 12px;
      color: @FontColor;
    }
  }
  .projects {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: @Gap;
    .project {
      cursor: pointer;
      max-height: 300px;
      overflow-x: hidden;
      overflow-y: auto;
      padding: @padding;
      display: flex;
      flex-direction: column;
      justify-content: center;
      border-radius: @radius;
      border: solid 1px @FontColor;
      .name {
        color: @FileTreeFolderColor;
        font-size: @fontSize;
        font-weight: 600;
      }
      .path {
        width: 100%;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        font-size: calc(@fontSize - 2px);
      }
      .folder {
        height: 200px;
        overflow-x: hidden;
        overflow-y: auto;
        padding-left: @padding;
        font-size: calc(@fontSize - 2px);
        display: flex;
        flex-direction: column;
      }
    }
    .project:hover {
      color: @FontActiveColor;
      border: solid 1px @FontActiveColor;
    }
    .add {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 60px;
      font-weight: 600;
      border: solid 1px @FontColor;
    }
    .add:hover {
      color: @FontActiveColor;
      border: solid 1px @FontActiveColor;
    }
  }
}
</style>
