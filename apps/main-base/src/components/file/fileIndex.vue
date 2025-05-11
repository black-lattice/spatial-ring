<script setup>
import fileOperate from './fileOperate.vue';
import fileTree from './fileTree.vue';
import { useFileCacheStore } from '@/store/index';
const fileCache = useFileCacheStore();
</script>

<template>
    <div class="file-index">
        <file-operate />
        <file-tree :path="fileCache.selectedPath" />
    </div>
</template>
<style lang="less" scoped>
.file-index {
    width: 300px;
    height: 100%;
    padding: @padding 0px;
    border-radius: @radius;
    background: @FileTreeBG;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    overflow: hidden;
}
</style>