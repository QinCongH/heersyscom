# 简介
`heersyscom`，记录工作中前端管理后台项目封装的一些组件，Hooks。

插件主要基于vue3+Element Plus封装，组件封装的目的，提高工作中开发效率，集成起来方便管理。

## 下载
- 本插件依赖elementPlus插件,需先安装elementUIPlus:
https://element-plus.org/zh-CN/guide/installation.html
- 安装`heersyscom` 
使用npm
```
npm i heersyscom
```
或者配置淘宝镜像,使用cnpm
```
cnpm i heersyscom
```
## Vue中引入
`main.ts`
```ts
import App from './App.vue'
import heersyscom from 'heersyscom';
const app = createApp(App)
app.use(heersyscom)
```


## ts支持
添加`index.d.ts`文件

加入：
`declare module 'heersyscom';`

# 组件列表
##  HeTable
基本使用
```angular2html
<template>
    <HeTable :total="tableData.length" :column-data="columns" :table-data="tableData"></HeTable>
</template>

<script setup lang="ts">

    const columns = [
        {
            label: "序号",
            prop: "no",
        }, {
            label: "IP",
            prop: "ip",
        },
        {
            label: "MAC",
            prop: "mac",
        },
        {
            label: "端口",
            prop: "port",
        }
    ]
    const tableData = [
        {
            no: 1,
            ip: "127.0.0.1",
            mac: "2a:4f:3c:5d:71:a4",
            port: "88",
        },
        {
            no: 2,
            ip: "127.0.0.2",
            mac: "1f:3e:2c:6d:89:3a",
            port: "89",
        }
    ]

</script>
```


<img src='https://gitee.com/qin_hu/drawingbed/raw/master/pic1.png'>


# 计划更新
- [ ] HeTable
- [ ] HeForm
- [ ] HeDialog
- [ ] HeUpload
- [ ] HeButton
- [ ] HeCodemirror
- [ ] HeDirectory
- [ ] useUpdate Hooks
- [ ] useDelete Hooks
- [ ] useSearch Hooks
- [ ] useFile Hooks
  
