import { defineConfig } from 'vite';
import path from 'path';
import vue from '@vitejs/plugin-vue';
import pkg from './package.json';
export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? './' : '/',
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
  },
  plugins: [vue()],
  build: {
    sourcemap: true,
    outDir: path.resolve(__dirname, `../../electron-main/dist/apps/${pkg.name}`), // 指定输出目录
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
    port: 7101,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        additionalData: `@import "${path.resolve(__dirname, 'src/assets/styles/variables.less')}";`,
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
