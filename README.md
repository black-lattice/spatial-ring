### 这是一个利用 turbo electron vue3 pinia vite monaco-editor micro-app md-editor-v3 实现的快速选择仓库的，编辑代码与编辑和实时预览 markdown 编辑器

取名 spatial-ring 空间戒指/纳戒 是希望可以将很多实用的能力放进来。比如在公司里把项目针对一些人允许跨域访问，通过 micro-app 加载进来，主打一个快速访问的能力。还想实现一个代码片段的第代码平台，以后写的代码可以快速查找组合，生成源文件。通过把源文件上传到服务器生成对应地址，通过地址加载进来利用 vue3-sfv-loader（核心是利用 vue 的 compiler-sfc 的能力） 编译，然后交给 vue3 的异步组件，实现远程加载组件。同时通过动态路由，就实现了一个可以在线编辑修改添加页面的应用。

下面是一些截图：
![文件编辑](https://github.com/black-lattice/spatial-ring/blob/main/docs/file.png)
实现了文件的编辑，保存，新建，删除，重命名等功能
重命名与删除使用快捷键：enter 和 cmd+delete

![本地项目地址](https://github.com/black-lattice/spatial-ring/blob/main/docs/ws.png)
在用户桌面创建 spatial-ring-workspace.json 文件，用于存储本地项目地址，方便用户快速打开项目

![MarkDown文件的编辑与预览](https://github.com/black-lattice/spatial-ring/blob/main/docs/md.png)
使用 md-editor-v3 实现 MarkDown 文件的编辑与预览

项目结构：

```
├── apps
│   ├── main-base // 主应用
│   ├── markdown // 子应用
├── electron-main // electron应用
├── README.md
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── package.json // vite配置文件
└── turbo.json // turbo配置文件
```

使用 trubo 是为了能够在项目根目录下使用 pnpm 命令，能够快速启动主应用和子应用，同时也能快速启动 electron 应用。

选择微前端的目的是为了能够快速扩展本项目的功能，比如一些不需要 electron 提功能力的功能，同时又可以独立运行。

选择 microp-app 是因为文档详细，接入项目成本低，源码对于我而言比较友好，如果有什么问题可以尝试自己调试和修改。

编辑文件的功能选择 monaco-editor 是为它与 vscode 同款，功能很强大，满足我的需求。

md-editor-v3 是我目前用到文档和功能比较好的一个 markdown 编辑和预览插件，用起来很方便。

使用
项目

```
pnpm install
pnpm run dev // 启动主应用main-base和子应用markdown，启动electron-main，启动成功桌面会弹出窗口

pnpm add [依赖包名称] -w // 将依赖包添加到工作区中，子应用就可以功能一些依赖包
pnpm add [依赖包名称] --filter=[应用名称] // 将依赖包添加到指定应用中，只在子应用使用的依赖包需要使用这个命令
## electron项目的依赖包使用的是npm，是因为使用pnpm时，electron自身依赖的依赖包不会被安装，导致在build时会一直报缺少依赖。
```

项目还有很多问题，比如：
ws 保存项目地址和其中保存文件夹地址更新问题
build 之后 micro-app 不支持 file 协议，导致子应用 markdown 加载失败的问题（全局定义 fetch 方法只在 dev 时改善了，但是 build 之后还是有问题）
electron 启动时通过 process.env.NODE_ENV 判断当前环境，它一直获取不到的问题
