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

  7.