import { Menu } from 'electron';
const template = [
    {
        label: '文件',
        submenu: [
            { label: '新建', accelerator: 'CmdOrCtrl+N' },
            { type: 'separator' },
            { role: 'quit' }
        ]
    },
    {
        label: '编辑',
        submenu: [
            { role: 'undo' },
            { role: 'redo' },
            { type: 'separator' },
            { role: 'cut' },
            { role: 'copy' },
            { role: 'paste' }
        ]
    }
];
export const setMenu = () => {
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
};