<script setup>
import SideBar from './components/sideBar.vue';
</script>

<template>
  <div :class="$style.content">
    <SideBar />
    <router-view />
  </div>
</template>

<style module scoped lang="less">
.content {
  width: 100%;
  flex: 1;
  overflow: hidden;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: flex-start;
  gap: @Gap;
}
</style>
