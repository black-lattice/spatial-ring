<script setup>
/**
 * TODO:
 * edit：编辑，按enter键编辑
 * delete：删除，按cmd+delete删除
 */
import { computed, ref, reactive, defineProps, watchEffect, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useFileCacheStore, useFileStore, useGlobalStore } from '@/store/index';

import { IconRight } from '@arco-design/web-vue/es/icon';

const { path } = defineProps({
  path: {
    type: String,
    default: '',
  },
});

const fileCache = useFileCacheStore();
const { activePath, dirStatus } = storeToRefs(fileCache);
const activePathIsFolder = ref(true);
let currentDir = ref([]);
watchEffect(() => {
  currentDir.value = fileCache.getDir(path)?.files;
});
const globalStore = useGlobalStore();
const { microAppName } = storeToRefs(globalStore);
const fileStore = useFileStore();
const handleItemClick = async (isFolder, path) => {
  if (isFolder) {
    dirStatus.value[path] = !dirStatus.value[path];
  }
  activePathIsFolder.value = isFolder;
  activePath.value = path;
  if (!isFolder) {
    let res = !isFolder && (await fileStore.readFile(path));
    globalStore.setMicroData({ type: microAppName.value, name: microAppName.value, isFolder, ...res });
  }
};

const inputStyle = {
  width: '100%',
  paddingLeft: '14px',
  borderColor: '#333333',
  background: 'transparent',
  outline: 'none',
  margin: '0px',
  fontSize: '14px',
  color: '#ffffff',
  height: '24px',
  lineHeight: '24px',
};
const handleOperate = (e, { name, fullPath }) => {
  if (!e) return;
  let n = e?.target.value || '';
  let newName = n ? n : name === 'newFile' || name === 'newFolder' ? '' : name;
  if (!newName) {
    fileCache.deleteFileOrFolder(fullPath);
  } else {
    fileCache.updateFileOrFolder(fullPath, newName);
  }
  currentDir.value = fileCache.getDir(path)?.files;
};
const handleItemEdit = (e, item) => {
  let { name, fullPath } = item;
  if (!e) return handleEdit(item);
  let newName = e?.target.value || name;
  if (newName !== name) {
    fileStore.rename(fullPath, newName);
    fileCache.updateFileOrFolder(fullPath, newName);
    delete item.isEdit;
    currentDir.value = fileCache.getDir(path)?.files;
  }
};

import { Modal } from '@arco-design/web-vue';
const handleDelete = (item) => {
  let { fullPath } = item;
  Modal.open({
    title: '确定删除？',
    content: '删除后将移到废纸篓，请谨慎操作！',
    onOk: () => {
      fileStore.deleteFile(fullPath);
      fileCache.deleteFileOrFolder(fullPath);
      currentDir.value = fileCache.getDir(path)?.files;
    },
    onCancel: () => {
      return;
    },
  });
};
const vFocus = {
  mounted: (el) => {
    return el.children[0].focus();
  },
};
function handleEdit(item) {
  if (item.isEdit) {
    delete item.isEdit;
  } else {
    item.isEdit = true;
  }
}
</script>
<template>
  <div class="file-tree" v-if="currentDir?.length">
    <div v-for="item of currentDir || []" :key="item.name">
      <template v-if="item.isAdd">
        <a-input v-focus :style="inputStyle" :placeholder="item.name" @blur="(e) => handleOperate(e, item)" @keyup.enter="(e) => handleOperate(e, item)" />
      </template>
      <template v-else>
        <div
          :class="['tree-item', activePath === item.fullPath && 'active-path']"
          @click="handleItemClick(item.isFolder, item.fullPath)"
          tabindex="0"
          @keydown.enter="handleEdit(item)"
          @keydown.meta.backspace="handleDelete(item)">
          <template v-if="!item.isEdit">
            <div class="icon">
              <template v-if="item.isFolder">
                <icon-right :class="{ arrow: true, 'rotate-90': dirStatus[item.fullPath] }" />
                <icon-folder />
              </template>
              <template v-else>
                <div class="dot"></div>
                <icon-file />
              </template>
            </div>
            <span :class="[item.isFolder ? 'folder-color' : 'file-color']">{{ item.name }}</span>
          </template>
          <template v-else>
            <a-input v-focus :style="inputStyle" :placeholder="item.name" @blur="handleItemEdit('', item)" @keyup.enter="(e) => handleItemEdit(e, item)" />
          </template>
        </div>
        <file-tree v-if="item.isFolder && dirStatus[item.fullPath]" :path="item.fullPath" />
      </template>
    </div>
  </div>
</template>

<style lang="less" scoped>
.file-tree {
  flex: 1;
  width: 100%;
  padding: calc(@Gap / 2) 0px calc(@Gap / 2) @FileTreePadding;
  background: @FileTreeBG;
  box-sizing: border-box;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  gap: calc(@Gap / 2);

  .tree-item {
    height: 24px;
    cursor: pointer;
    display: flex;
    align-items: center;
    font-weight: 600;

    &:hover {
      background: @GlobalBG;
    }

    .icon {
      width: 30px;
      height: 10px;
      margin-top: 2px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-right: 8px;

      .arrow {
        font-size: 10px;
      }

      .dot {
        display: inline-block;
        width: 6px;
        height: 6px;
        margin-left: 2px;
        border-radius: 50%;
        background: lighten(@FileTreeDotBG, 10%);
      }

      .rotate-90 {
        transform: rotate(90deg);
      }
    }

    .file-color {
      color: @FileTreeFileColor;
    }

    .folder-color {
      color: @FileTreeFolderColor;
    }
  }

  .active-path {
    font-weight: 600;
    color: @FontActiveColor;
    background: lighten(@GlobalBG, 1%);
  }
}
</style>
