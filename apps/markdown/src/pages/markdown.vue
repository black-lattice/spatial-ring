<script setup>
import { ref, reactive } from "vue";
import { MdEditor } from "md-editor-v3"; //官网： https://imzbf.github.io/md-editor-v3/zh-CN/api
import "@/assets/styles/markdown.css";

import { useMainStore } from "@/store/index";
import { storeToRefs } from "pinia";
const store = useMainStore();
const { fileContTemp } = storeToRefs(store)

const mdConfig = reactive({
  // 编辑器配置
  previewTheme: "",
  toolbarsExclude: ["github"],
  theme: "",
});
let hadChanged = ref(false);
const onFocus = () => {
  if (!hadChanged.value) {
    hadChanged.value = true;
    mdConfig.content = "";
  }
};
const onSave = (v, html) => {
  html.then((res) => {
    store.onSave();
  });
};


</script>

<template>
  <div class="markdown">
    <MdEditor class="md-editor" v-model="fileContTemp.content" :theme="mdConfig.theme"
      :previewTheme="mdConfig.previewTheme" :toolbarsExclude="mdConfig.toolbarsExclude" @onSave="onSave"
      @onFocus="onFocus" />
  </div>
</template>

<style scoped lang="less">
.markdown {
  width: 100%;
  height: 100%;
  overflow: hidden;

  .md-editor {
    width: 100%;
    height: 100%;
    // background: #242424;
  }
}
</style>