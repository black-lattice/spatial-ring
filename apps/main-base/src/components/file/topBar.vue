<template>
    <a-dropdown @select="handleSelectChange">
        <div class="choose-folder">
            <icon-right v-if="!selectName" />
            <icon-down v-else />
            <span>{{ selectName || '请选择文件夹' }}</span>
        </div>
        <template #content>
            <a-dgroup title="默认">
                <a-doption value="folder">文件夹</a-doption>
            </a-dgroup>
            <a-dgroup title="最近">
                <a-doption v-for="item in recentFiles" :key="item.path" :value="item.path">
                    {{ getPathName(item.path) }}
                </a-doption>
            </a-dgroup>
        </template>
    </a-dropdown>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useFileStore, useFileCacheStore } from '@/store/index.js'
import { storeToRefs } from 'pinia'
document.body.setAttribute('arco-theme', 'dark')

const fileCacheStore = useFileCacheStore()
const { selectedPath } = storeToRefs(fileCacheStore)
const fileStore = useFileStore()
const { recentFiles } = storeToRefs(fileStore)

const handleSelectChange = async (value) => {
    if (value === 'file') {
        // await fileStore.readFile()
    } else if (value === 'folder') {
        await fileStore.readDir('', 'root')
    } else {
        selectedPath.value = value
    }
    fileStore.loadRecentFiles()
}
function getPathName(path) {
    if (!path) return;
    return path?.match(/[^/\\]+$/)[0] || '';
}
const selectName = computed(() => {
    return getPathName(selectedPath.value || '')
})
</script>

<style lang="less" scoped>
.choose-folder {
    height: 24px;
    font-size: 14px;
    cursor: pointer;
    color: @FontActiveColor;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: @Gap;
    overflow: hidden;

    span {
        display: inline-block;
        white-space: nowrap;
        overflow: hidden;
        flex-wrap: nowrap;
    }
}
</style>