# develop process

windows：

  1. 安装 Scoop[http://scoop.sh/]
  powershell3 下
  iex (new-object net.webclient).downloadstring('https://get.scoop.sh')

  2. 安装 Nodejs
  scoop install nodejs

  3. 安装淘宝cnpm / 设置代理 / 设置淘宝镜像
  npm install -g cnpm --registry=https://registry.npm.taobao.org
  npm config set proxy=http://127.0.0.1:1008
  npm config set registry=https://registry.npm.taobao.org  [recommand]
  npm config delete <key>

  4. 安装Electron
  cnpm install -g electron
j
  5. 安装Electron-forge
  cnpm install -g electron-forge

  6. 初始化
  electron-forge init epicasa --template=react-typescript

  7. 调试 见electron-forge主页文档

  8. electron-devtools-installer: 如果国内无法下载插件可以把下好的插件放到目录下
  linux: ~/.config/chromium/Default/Extensions/
  windows:
  mac: 

# Todo
1. 快速搜索整个系统的逻辑
    搜索的逻辑放到另外一个进程中 和 Electron主进程通过ipc通信，（因为Electron的main process 需要处理renderer process和GPU的ipc通信所以不可以被阻塞）
    需要一个数据库记录上次已搜索过目录的修改时间，只搜索修改时间更新的目录

