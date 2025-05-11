import { defineConfig } from 'vite';
import path from 'path';
import vue from '@vitejs/plugin-vue';
// import AutoImport from 'unplugin-auto-import/vite'
// import Components from 'unplugin-vue-components/vite';
// import { ArcoResolver } from 'unplugin-vue-components/resolvers';
import { vitePluginForArco } from '@arco-plugins/vite-vue';
import monacoEditorPlugin from 'vite-plugin-monaco-editor-esm';
// import monacoEditorPlugin from 'vite-plugin-monaco-editor';
import postcssPrefixSelector from 'postcss-prefix-selector';
export default defineConfig({
  base: process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'electron' ? './' : '/',
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
  },
  plugins: [
    monacoEditorPlugin({ languageWorkers: ['typescript', 'json', 'css', 'html'] }),
    vue(),
    vitePluginForArco({
      style: 'css',
    }),
  ],
  build: {
    sourcemap: true,
    outDir: path.resolve(__dirname, '../../electron-main/dist'), // 指定输出目录
    assetsDir: 'assets', // 静态资源目录
    emptyOutDir: true, // 构建前清空输出目录
    rollupOptions: {
      output: {
        chunkFileNames: 'js/[name].[hash].js',
        entryFileNames: 'js/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]',
      },
    },
  },
  server: {
    cors: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  css: {
    generateScopedName: `[name]_[local]_[hash:5]`,
    postcss: {
      plugins: [
        postcssPrefixSelector({
          prefix: '[mainbase] ',
          includeFiles: [/src\/assets\/global.less$/],
          transform(prefix, selector, file) {
            // 排除第三方库
            if (selector.startsWith('#app')) {
              return `${prefix} ${selector}`;
            }
            return selector;
          },
        }),
      ],
    },
    preprocessorOptions: {
      less: {
        additionalData: `@import "${path.resolve(__dirname, 'src/assets/variables.less')}";`,
        javascriptEnabled: true, // 允许Less中使用JS表达式[1,5](@ref)
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
