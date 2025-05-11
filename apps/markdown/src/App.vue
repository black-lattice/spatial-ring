<script setup>
import { onMounted, onBeforeUnmount, getCurrentInstance } from "vue";
import { RouterView } from "vue-router";
import { useMainStore } from "@/store/index";
import { storeToRefs } from "pinia";
import { useRouter } from 'vue-router'

const router = useRouter()
const store = useMainStore();
const { fileContTemp, globalProperties } = storeToRefs(store)

const instance = getCurrentInstance();
globalProperties.value = instance.appContext.config.globalProperties;

const dataListener = (data) => {
  if (data.type !== 'markdown') return;
  fileContTemp.value.type = data.type;
  fileContTemp.value.content = data.content;
  fileContTemp.value.filePath = data.path;
  let ext = data.filePath.match(/[^/\\]+$/)[0].split('.').pop()
  switch (ext) {
    case 'md':
      router.push({ name: 'markdown' })
      break;
    default:
      break;
  }
};
onMounted(() => {
  // 监听全局数据
  window.microApp.addDataListener(dataListener, true)
})

onBeforeUnmount(() => {
  // 解绑监听函数
  window.microApp.removeDataListener(dataListener)

  // 清空当前子应用的所有绑定函数(全局数据函数除外)
  window.microApp.clearDataListener()
})
</script>

<template>
  <router-view />
</template>

<style scoped lang="less">
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
