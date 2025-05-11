import { app, BrowserWindow } from 'electron';
// import { setMenu } from './topBar/topBar.mjs'; // 引入菜单设置函数
import { initFileOperateHandlers } from './src/fileOperate/fileHandler.mjs'; // 引入文件操作
import { workspaceHandlers } from './src/workspace/workspaceIPC.mjs';
// import { initProjectRunHandlers } from './src/projectRun/projectRun.mjs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 创建窗口
function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, '/preload.mjs'),
      nodeIntegration: true,
      contextIsolation: true, // 启用上下文隔离
      webSecurity: false, // 禁用安全策略以支持跨域加载子应用
      experimentalFeatures: true, // 启用实验性功能
    },
  });

  // bug：process.env.NODE_ENV读取不到这个值
  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:5173');
    win.webContents.openDevTools({ openDevTools: true }); // 打开开发者工具
  } else {
    // 生产环境加载打包后的基座应用
    win.loadURL('http://localhost:5173');
    win.webContents.openDevTools({ openDevTools: true });
    // win.loadFile(path.join(__dirname, 'dist/index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();
  // setMenu()
  initFileOperateHandlers(); // 初始化文件操作IPC监听器
  workspaceHandlers();
  // initProjectRunHandlers(win);
});
