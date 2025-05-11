<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useGlobalStore } from '@/store';
const globalStore = useGlobalStore();
const { microAppName, sideBarLists } = storeToRefs(globalStore);
const router = useRouter();

function jumpApp(name) {
  microAppName.value = name || '';
  router.push({
    name: name || '',
  });
}
onMounted(() => {
  jumpApp(microAppName.value);
});
</script>

<template>
  <div class="side-bar">
    <div :class="['app', app.name === microAppName ? 'active-app' : '']" v-for="app of sideBarLists" :key="app.name" @click="jumpApp(app.name)">
      {{ app.shortName }}
    </div>
  </div>
</template>

<style scoped lang="less">
.side-bar {
  width: 40px;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  color: @FontColor;
  font-size: 18px;
  font-weight: 600;
  gap: 8px;

  .app {
    cursor: pointer;
    width: 40px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    border-radius: @radius;
    font-size: 14px;
  }

  .app:hover {
    color: @FontActiveColor;
    background-color: @HoverBG;
  }

  .active-app {
    color: @FontActiveColor;
    background-color: @ActiveBG;
  }
}
</style>
