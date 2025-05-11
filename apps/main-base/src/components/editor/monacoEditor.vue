<script setup>
import './worker';
import * as monaco from 'monaco-editor';
import { monacoOptions, langMap } from './monacoOptions';
import { onMounted, onBeforeUnmount, ref, toRaw, watchEffect, watch, defineEmits } from 'vue';
import { useGlobalStore } from '@/store/index';
import { storeToRefs } from 'pinia';
const fileCache = useGlobalStore();
const { microData } = storeToRefs(fileCache);

const emit = defineEmits(['dataChange']);
const editorRef = ref(null);
let editor = null;
const ext =
  microData?.value?.filePath
    ?.match(/[^/\\]+$/)[0]
    .split('.')
    .pop() || 'javascript';

let data = null;
onMounted(() => {
  editor = monaco.editor.create(editorRef.value, {
    value: data,
    language: ext,
    ...monacoOptions,
  });
  editor.onDidChangeModelContent(() => {
    data = editor.getValue();
  });
});
onBeforeUnmount(() => {
  editor.value?.dispose();
});

watchEffect(() => {
  data = toRaw(microData.value?.content);
  editor?.setValue(data);
});
watch(
  () => microData.value.filePath,
  () => {
    let langid = getExtension(microData.value?.filePath);
    changeLanguage(langid);
  }
);
function saveFile() {
  emit('dataChange', { detail: { data: { ...microData.value, content: data, type: 'save' } } });
}
function changeLanguage(language) {
  monaco.editor.setModelLanguage(editor.getModel(), language);
}
function getExtension(filePath) {
  try {
    let ext = '';
    const parts = filePath.split('.');
    if (parts.length > 1) {
      ext = parts[parts.length - 1];
    }
    return langMap[ext];
  } catch (error) {
    console.log(error);
    throw error;
  }
}
</script>

<template>
  <div class="editor" ref="editorRef" @keydown.meta.s="saveFile"></div>
</template>

<style lang="less" scoped>
.editor {
  width: 100%;
  height: 100%;
}
</style>
