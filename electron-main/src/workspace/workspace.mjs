import { app } from 'electron';
import path from 'path';
import fs from 'fs';
const userDataPath = app.getPath('desktop'); // 返回路径如：
// Windows: C:\Users\username\AppData\Roaming\YourApp
// macOS: ~/Library/Application Support/YourApp
// Linux: ~/.config/YourApp

const filePath = path.join(userDataPath, 'spatial-ring-workspace.json');
export function createWorkspace() {
  // 写入数据（同步示例）
  try {
    if (fs.existsSync(filePath)) {
      return;
    }
    const data = { name: 'spatial-ring-workspace' };
    fs.writeFileSync(filePath, JSON.stringify(data), 'utf-8');
  } catch (error) {
    throw error;
  }
}
export async function readWorkspace() {
  try {
    // 读取数据（异步示例）
    let content = await fs.promises.readFile(filePath, 'utf-8');
    const config = JSON.parse(content);
    return config;
  } catch (error) {
    throw error;
  }
}
export function updateWorkspace(data) {
  try {
    // 写入数据（同步示例）
    fs.writeFileSync(filePath, JSON.stringify(data), 'utf-8');
  } catch (error) {
    throw error;
  }
}
export function closeWorkspace() {
  try {
    // 写入数据（同步示例）
    fs.writeFileSync(filePath, JSON.stringify(data), 'utf-8');
  } catch (error) {
    throw error;
  }
}
