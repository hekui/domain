# 前栈

## 资源
Animate.css动画库：[在线演示](https://www.dowebok.com/demo/2014/98/)


## Feature

1. 前端技术框架：使用`vue`全家桶（`vue`,`vuex`,`vue-router`,`axios`等），ui层自己实现。  
	1. 采用 `vue-ssr` 做服务端渲染来实现seo。
	2. 前端实现成 `SPA`，通过 `store` 来做整个数据的状态管理。做到数据交互无页面刷新。可以增强用户体验，实现页面间的动效（IE9及以下不支持）。
	3. 公共部分抽成组件，进行复用，减小整体页面dom结构、css样式以及代码量。
   > IE9及以下不支持CSS3属性 `transition`
	
2. 前端工程化打包：`webpack 3.0` 对前端组件引入、依赖进行管理打包发布。需要实现到异步加载模块。
	1. 发版时，静态资源自动打入 `hash` 指纹。
	2. 公共部分代码抽出打入到 `vendor.[hash].js`，部署缓存。
	3. 将所有组件中的样式抽出打入一个整体的样式文件。
	4. 异步加载模块，缩短首次打开加载时间。

3. 前端静态资源部分部署CDN以及缓存。
	
4. BFF：`node + koa` 主要实现功能如下：
	1. SSR(server side render)
	2. 作为前端和java端的数据中转，解决数据跨域问题。
	3. 登录控制
	4. 图形验证码生成及校验
	
5. 数据：前后端数据分离，java端提供数据api。BFF做数据透传。  
	1. 前端调用后端接口，统一从`api`出口，处理公共的数据加密，验证信息等。  
	2. `node` 使用 `node-fetch` 进行数据透传。  
 
6. 文档：技术方案、开发规范、接口文档等的编写。  

7. 浏览器兼容性：IE9+


## package 命令
- copy，在 `build` 完成后，直接部署代码到某目录，适用于前端未单独部署，需要部署至 `JAVA` 项目中的场景。  
  使用 [xcopy](https://blog.csdn.net/qq_21808961/article/details/86749733) 命令实现。
```javascript
"copy": "rimraf e:\\test/* && xcopy dist e:\\test /e /Y /d /I",
// rimraf e:\\test/*
// 删除 e 盘 test 目录下的所有文件，保留文件夹。
// xcopy 参数：  
// /E 复制目录和子目录，包括空目录。 
// /Y 取消提示以确认要覆盖现有目标文件。
// /D:m-d-y 复制在指定日期或指定日期以后更改的文件。如果没有提供日期，只复制那些源时间比目标时间新的文件。
// /I 如果目标不存在，且要复制多个文件，则假定目标必须是目录。
```

## Build Setup

``` bash
# install dependencies
npm install # or yarn

# serve in dev mode, with hot reload at localhost:8080
npm run dev

# build for production
npm run build

# serve in production mode
npm start
```