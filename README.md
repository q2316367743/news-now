# vite的utools模板

## 使用说明

src-utools目录为utools项目目录，新建utools项目后，设置`plugin.json`为`src-utools`的`plugin.json`。

图标请放在`src-utools/public`中，如果打包`web`版，请按照vite方式处理。

在`src-utools/preload.js`中写入代码后，挂载到`window.preload`上，修改`src/vite-env.d.ts`文件，将定义写在`preload`中。

请修改`src/global/Constant`中的项目信息

## 打包

先在主目录下执行`pnpm build`进行打包，打包后的资源在`src-utools/dist`中，打包`src-utools`目录即可。

## 注意

vite项目中，所有的静态资源引用都要使用相对路径，不能使用绝对路径
