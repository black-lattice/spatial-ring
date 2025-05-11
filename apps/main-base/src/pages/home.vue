<script setup>
import { ref } from 'vue';
import { RouterView } from 'vue-router';
import monacoEditor from '@/components/editor/monacoEditor.vue';
import fileIndex from '@/components/file/fileIndex.vue';
import { useFileCacheStore, useFileStore, useGlobalStore } from '@/store/index';
import { storeToRefs } from 'pinia';
const globalStore = useGlobalStore();
const { microAppName } = storeToRefs(globalStore);
// const fileCache = useFileCacheStore();
// const { fileContTemp } = storeToRefs(fileCache);
// const microTagStyle = {
//   width: '100%',
//   height: '100%',
//   border: 'none',
// };
const fileStore = useFileStore();
const handleDataChange = async (e) => {
  const { type, filePath, content } = e.detail.data;
  type === 'save' && (await fileStore.saveFile(filePath, content));
};
</script>

<template>
  <div class="file-container">
    <file-index />
  </div>
  <div class="container">
    <router-view />
    <!-- <micro-app
      v-if="microAppName === 'markdown'"
      :style="microTagStyle"
      :data="fileContTemp"
      :name="microAppName"
      url="//localhost:7101"
      :scope="['home']"
      iframe
      @datachange="handleDataChange"
    /> -->
    <monaco-editor v-if="microAppName === 'file'" @dataChange="handleDataChange" />
    <!-- <SubAppContainer v-else :url="url" /> -->
  </div>
</template>
<style scoped lang="less">
.file-container {
  width: 300px;
  border-radius: @radius;
  background: @GlobalBG;
  box-sizing: border-box;
  overflow: hidden;
}

.container {
  flex: 1;
  height: 100%;
  padding: @padding;
  border-radius: @radius;
  background: @ContainerBG;
  box-sizing: border-box;
  overflow: auto;
}
</style>
