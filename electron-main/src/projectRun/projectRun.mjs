// main.js (主进程)
const { exec } = require('child_process');

export function runCommand(cmd, prjectPath, mainWindow) {
  // 获取项目根目录路径
  const projectRoot = prjectPath;

  // 执行命令
  const child = exec(cmd, {
    cwd: projectRoot, // 指定工作目录
    windowsHide: true, // 隐藏Windows上的子控制台窗口
  });

  // 监听输出
  child.stdout.on('data', (data) => {
    // 可通过IPC发送到渲染进程显示
    mainWindow.webContents.send('stdout', data);
  });

  child.stderr.on('data', (data) => {
    mainWindow.webContents.send('stderr', data);
  });

  // 处理结束
  child.on('close', (code) => {
    mainWindow.webContents.send('close', code);
  });
}
