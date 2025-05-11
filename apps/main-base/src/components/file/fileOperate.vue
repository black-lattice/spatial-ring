<script setup>
import topBar from './topBar.vue';
import { ref, defineEmits, defineProps } from 'vue';
import { useFileCacheStore } from '@/store/index'
const fileCache = useFileCacheStore()
const iconStyle = {
    fontSize: '16px',
    cursor: 'pointer'
}
const operate = (oper) => {
    switch (oper) {
        case 'addFile':
            fileCache.addFileOrFolder(fileCache.activePath, oper)
            break;
        case 'addFolder':
            fileCache.addFileOrFolder(fileCache.activePath, oper)
            break;
        case 'refresh':
            fileCache.refreshFileOrFolder(fileCache.activePath)
            break;
        case 'closeFolder':
            fileCache.closeFolder(fileCache.activePath)
            break;
        default:
            break;
    }
}
// const foldOpen = ref(true)
// const openFolder = () => {
//     foldOpen.value = !foldOpen.value
//     operate('openFolder')
// }
</script>

<template>
    <div class="file-operate">
        <div class="title">
            <top-bar />
        </div>
        <div class="operate">
            <IconFile class="icon" :style="iconStyle" @click="operate('addFile')" />
            <IconFolderAdd class="icon" :style="iconStyle" @click="operate('addFolder')" />
            <IconRefresh class="icon" :style="iconStyle" @click="operate('refresh')" />
            <IconFolderDelete class="icon" :style="iconStyle" @click="operate('closeFolder')" />
        </div>
    </div>
</template>

<style scoped lang="less">
.file-operate {
    width: 100%;
    height: 24px;
    padding: 0px @padding;
    box-sizing: border-box;
    overflow: hidde;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: @Gap;

    .title {
        flex: 1;
        display: flex;
        align-items: center;
        font-size: 14px;
        font-weight: 600;
        color: @FontActiveColor;
    }

    .operate {
        width: 100px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        gap: calc(@Gap * 2);

        .icon {
            color: @FontColor;

            &:hover {
                color: @FontActiveColor;
                background: @HoverBG;
            }
        }
    }


}
</style>