### 永恒的前言
* * *
### 已发布npm包 bgwd-deploy 在我github项目中
移步[bgwd-deploy](https://github.com/bgwd666/bgwd-deploy)


(如果您觉得对您有一点点帮助 点个star 那就非常感谢了)

(这个git项目是我自己搭的一个比较low的vue脚手架,集成ts)

(主要看 自动部署 在 upload 目录 )

本demo执行: npm 或 cnpm i 安装依赖

**运行 npm run serve**

**打包 npm run build**

**自动部署  npm run deploy  (需要配置 upload目录下的 config.js 配置项)**

教程在下面, 或者点文章链接

[文章地址-思否](https://segmentfault.com/a/1190000020994461?share_user=1030000018633764)

[文章地址-掘金](https://juejin.im/post/5dce6b2b5188254eee54d77a)

**简单实用的前端部署, 一条命令搞定, 省去繁琐的步骤!**

主要是 nodejs shelljs(命令行命令) node-ssh(连接服务器)

[项目git 地址](https://github.com/bgwd666/deploy)


#### 如何在你项目中使用( 五步曲 )


**第一步, 把项目里 upload 文件夹复制到你项目根目录**

![avatar](https://segmentfault.com/img/bVbAfjP?w=505&h=219)

**第二步, 下载该js相关依赖**
npm 或 cnpm i chalk ora shelljs node-ssh inquirer compressing -D

**第三步, 打开 upload/config.js 配置文件, 配置ssh地址, 用户名, 验证方式,需要上传的目录**

![avatar](https://segmentfault.com/img/bVbAfkZ?w=858&h=376)

**第四步, 在你项目中 package.json 文件中 加上 "deploy": "node ./upload/upload.js"**

![avatar](https://segmentfault.com/img/bVbAflU?w=721&h=267)


**最后 在命令行输入 npm run deploy 选择发布环境 然后就ojbk了**

![avatar](https://segmentfault.com/img/bVbAfmw?w=566&h=115)
![avatar](https://segmentfault.com/img/bVbAfmQ?w=544&h=150)
![avatar](https://segmentfault.com/img/bVbAfmY?w=789&h=177)
![avatar](https://segmentfault.com/img/bVbAfm1?w=557&h=357)

大功告成--
* * *

### 来看主要文件 upload.js
> **首先项目依赖**
```
const chalk = require('chalk') //命令行颜色
const ora = require('ora') // 加载流程动画
const spinner_style = require('./spinner_style') //加载动画样式
const shell = require('shelljs') // 执行shell命令
const node_ssh = require('node-ssh') // ssh连接服务器
const inquirer = require('inquirer') //命令行交互
const zipFile = require('compressing')// 压缩zip
const fs = require('fs') // nodejs内置文件模块
const path = require('path') // nodejs内置路径模块
const CONFIG = require('./config') // 配置
```
> **一些常量,变量和logs**
```
const SSH = new node_ssh();
let config; // 用于保存 inquirer 命令行交互后选择正式|测试版的配置

//logs
const defaultLog = log => console.log(chalk.blue(`---------------- ${log} ----------------`));
const errorLog = log => console.log(chalk.red(`---------------- ${log} ----------------`));
const successLog = log => console.log(chalk.green(`---------------- ${log} ----------------`));

//文件夹目录
const distDir = path.resolve(__dirname, '../dist'); //待打包
const distZipPath = path.resolve(__dirname, `../dist.zip`);
//打包后地址(dist.zip是文件名,不需要更改, 主要在config中配置 PATH 即可)
```
> **首先 执行项目打包命令**
```
//项目打包代码 npm run build 
const compileDist = async () => {
  const loading = ora( defaultLog('项目开始打包') ).start();
  loading.spinner = spinner_style.arrow4;
  shell.cd(path.resolve(__dirname, '../'));
  const res = await shell.exec('npm run build'); //执行shell 打包命令
  loading.stop();
  if(res.code === 0) {
    successLog('项目打包成功!');
  } else {
    errorLog('项目打包失败, 请重试!');
    process.exit(); //退出流程
  }
}
```
> **然后 对打包的代码 /dist 目录打包 (如果不是dist, 请更改上面的 disDir 常量结尾的dist)**
```
//压缩代码
const zipDist = async ()=>{
  defaultLog('项目开始压缩');
  try {
    await zipFile.zip.compressDir(distDir, distZipPath)
    successLog('压缩成功!');
  } catch (error) {
    errorLog(error);
    errorLog('压缩失败, 退出程序!');
    process.exit(); //退出流程
  }
}
```
> **再然后 通过ssh连接服务器 有两种方式: 一是通过秘钥连接(推荐), 二是密码连接**
> **秘钥连接需要把本机公钥放服务器指定目录 (在upload/config.js 有说明)**
![avatar](https://segmentfault.com/img/bVbAfI1?w=871&h=102)
```
//连接服务器
const connectSSH = async ()=>{
  const loading = ora( defaultLog('正在连接服务器') ).start();
  loading.spinner = spinner_style.arrow4;
  try {
    await SSH.connect({
      host: config.SERVER_PATH,
      username: config.SSH_USER,
      // privateKey: config.PRIVATE_KEY, //秘钥登录(推荐) 方式一
      password: config.PASSWORD // 密码登录 方式二
    });
    successLog('SSH连接成功!'); 
  } catch (error) {
    errorLog(error);
    errorLog('SSH连接失败!');
    process.exit(); //退出流程
  }
  loading.stop();
}
```
> **紧接着 通过ssh执行线上命令 进行目标目录清空, 然后上传zip到服务器 并解压 等操作**
```
//线上执行命令
/**
 * 
 * @param {String} command 命令操作 如 ls
 */
const runCommand = async (command)=> {
  const result = await SSH.exec(command, [], { cwd: config.PATH})
  // defaultLog(result);
}

//清空线上目标目录里的旧文件
const clearOldFile = async () =>{
  const commands = ['ls', 'rm -rf *'];
  await Promise.all(commands.map(async (it)=>{
    return await runCommand(it);
  }));
}

//传送zip文件到服务器
const uploadZipBySSH = async () =>{
  //连接ssh
  await connectSSH();
  //线上目标文件清空
  await clearOldFile();
  const loading = ora( defaultLog('准备上传文件') ).start();
  loading.spinner = spinner_style.arrow4;
  try {
    await SSH.putFiles([{ local: distZipPath, remote: config.PATH + '/dist.zip' }]); //local 本地 ; remote 服务器 ;
    successLog('上传成功!'); 
    loading.text = '正在解压文件';
    await runCommand('unzip ./dist.zip'); //解压
    await runCommand(`rm -rf ${config.PATH}/dist.zip`); //解压完删除线上压缩包
    //将目标目录的dist里面文件移出到目标文件  
    //举个例子 假如我们部署在 /test/html 这个目录下 只有一个网站, 那么上传解压后的文件在 /test/html/dist 里
    //需要将 dist 目录下的文件 移出到 /test/html ;  多网站情况, 如 /test/html/h5  或者 /test/html/admin 都和上面同样道理
    await runCommand(`mv -f ${config.PATH}/dist/*  ${config.PATH}`); 
    await runCommand(`rm -rf ${config.PATH}/dist`); //移出后删除 dist 文件夹
    SSH.dispose(); //断开连接
  } catch (error) {
    errorLog(error);
    errorLog('上传失败!');
    process.exit(); //退出流程
  }
  loading.stop();
}
```
> **把这些整合在一个函数**
```
//------------发布程序---------------
const runUploadTask = async () => {
  console.log(chalk.yellow(`--------->  欢迎使用 波哥牌 2020年自动部署工具  <---------`));
  //打包
  await compileDist();
  //压缩
  await zipDist();
  //连接服务器上传文件
  await uploadZipBySSH(); 
  successLog('大吉大利, 部署成功!'); 
  process.exit();
}
```
> **发布前的检查配置**
```
// 开始前的配置检查
/**
 * 
 * @param {Object} conf 配置对象
 */
const checkConfig = (conf) =>{
  const checkArr = Object.entries(conf);
  checkArr.map(it=>{
    const key = it[0];
    if(key === 'PATH' && conf[key] === '/') { //上传zip前会清空目标目录内所有文件
      errorLog('PATH 不能是服务器根目录!'); 
      process.exit(); //退出流程
    }
    if(!conf[key]) {
      errorLog(`配置项 ${key} 不能为空`); 
      process.exit(); //退出流程
    }
  })
}
```
> **执行交互 选择发布环境 然后启动发布程序**
```
// 执行交互后 启动发布程序
inquirer
  .prompt([{
    type: 'list',
    message: '请选择发布环境',
    name: 'env',
    choices: [{
      name: '测试环境',
      value: 'development'
    },{
      name: '正式环境',
      value: 'production'
    }]
  }])
  .then(answers => {
    config = CONFIG[answers.env];
    checkConfig(config); // 检查
    runUploadTask(); // 发布
  });
```
> **大功告成**

* * *
### 结尾
**咳咳, 放心, 不会有公众号啥广告, 也不会求打赏, 如果您觉得对您有一点点帮助 点个赞或者去GitHub点个star 那就非常感谢了**
