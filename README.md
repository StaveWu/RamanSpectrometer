# RamanSpectrometer

RamanSpectrometer是拉曼光谱识别软件的前端部分，主要负责界面显示和与后端（RamanSpectrometer-Flasky）的通信。其界面如下所示：

![RamanSpectrometer](https://raw.githubusercontent.com/StaveWu/images/master/RamanSpectrometer/mainpage.png)

## 安装
> 本软件运行于`node.js v10.15.1`，在安装本软件前请确保当前系统已安装`node.js v10.15.1`
```
npm install
```

## 运行
执行以下命令编译和热加载程序：
```
npm run electron:serve
```

## 打包
执行以下命令打包程序：
```
npm run electron:build
```
打包成功后在`dist_electron`文件夹中寻找打包好的exe。

