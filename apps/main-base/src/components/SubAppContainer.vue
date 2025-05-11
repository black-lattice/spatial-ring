<script setup>
import { ref } from 'vue';
import { useGlobalStore } from '@/store/index';
import { storeToRefs } from 'pinia';
const globalStore = useGlobalStore();
const { microAppName, microUrl, microData } = storeToRefs(globalStore);

const microTagStyle = {
  width: '100%',
  height: '100%',
  border: 'none',
};
const handleDataChange = async (e) => {
  const { type, filePath, content } = e.detail.data;
  type === 'save' && (await fileStore.saveFile(filePath, content));
};
const routeMode = ref({
  markdown: 'pure',
});
</script>
<template>
  <micro-app v-if="microUrl" :style="microTagStyle" :name="microAppName" :url="microUrl" :data="microData" :router-mode="routeMode[microAppName] || 'search'" iframe @datachange="handleDataChange" />
</template>

<style scoped lang="less">
#container {
  width: 100%;
  height: 100%;
}
</style>
