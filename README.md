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

## HeTable

基本使用

```vue

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

<img src='https://gitee.com/qin_hu/drawingbed/raw/master/heersyscom/pic1.png'>

### Props

| 属性名称                  | 说明                          | 类型                                | 默认值             | 示例                            |
|-----------------------|-----------------------------|-----------------------------------|-----------------|-------------------------------|
| column-data           | 表头数据                        | Array<{label:string,prop:string}> | []              | [{label:"标题"},{prop:"title"}] |
| table-data            | 表格数据                        | Array< ColumnsPropObject >        | []              | [{title:"你好"}]                |
| total                 | 表格数据总数                      | Number                            | 0               | -                             |
| showPagination        | 是否显示分页                      | Boolean                           | true            | -                             |
| paginationPosition    | 分页位置                        | String                            | 'right'         | -                             |
| v-model:pageNum       | 分页页码                        | Number                            | 1               | -                             |
| v-model:pageSize      | 分页每页显示数量                    | Number                            | 10              | -                             |
| tableConfig           | el-table属性                  | Object                            | {}              | -                             |
| showOperate           | 是否显示操作栏                     | Boolean                           | false           | -                             |
| operateType           | 操作栏样式类(0=按钮加图标 1=图标 2=下拉栏)  | Number                            | 0               | -                             |
| operateList           | 操作栏显示列表('edit','del','add') | Array<String>                     | ["edit", "del"] | -                             |
| operateWidth          | 操作栏宽度(px)                   | String                            | 'auto'          | -                             |
| showMultiple          | 是否多选                        | Boolean                           | true            | -                             |
| maxMultipleNum        | 多选最大选择数量                    | Number                            | undefined       | -                             |
| loading               | 是否显示加载状态                    | Boolean                           | false           | -                             |
| showSummary           | 是否显示表尾合计                    | Boolean                           | false           | -                             |
| hideSummaryList       | 不显示合计的字段                    | Array<String>                     | []              | :hideSummaryList="['no']"     |
| summaryList           | 指定显示合计的字段                   | Array<String>                     | []              | :summaryList="['count']"      |
| rowClassRowConditions | 设置自动显示行class的条件，表行显示样式      | Function                          | row => false    | -                             |
| rowClassName          | 行class类名                    | String                            | ""              | -                             |
| objectSpanMethod      | 合并单元格规则                     | String                            | data=>{}        | -                             |
| stripe                | 是否显示斑马线                     | Boolean                           | true            | -                             |
| showTooltip           | 行内容溢出是否溢出，鼠标悬浮显示悬浮提示        | Boolean                           | true            | -                             |

### Emits

| 属性名称                | 说明                               | 类型                                          
|---------------------|----------------------------------|---------------------------------------------|
| update:pageNum      | 页码响应式状态更新                        | (pageNum: number)=>void                     | 
| update:pageSize     | 页数响应式状态更新                        | (pageSize: number)=>void                    | 
| handleCurrentChange | 分页切换回调                           | (pageNum: number)=>void                     | 
| handleRowClick      | 点击行回调                            | (row)=>void                                 | 
| tableCurrentChange  | 表格单选回调，返回表格行数据                   | (row)=>void                                 | 
| select              | 表格多选回调，返回表格行列表，表格行id列表数据         | ({rowList,idList})=>void                    | 
| rowContextmenu      | 表格行鼠标右击事件，返回表格行，表格列，点击位置对象       | ({row,column,data:{clientX,clientY}})=>void | 
| sortChange          | 点击排序回调                           | ({column,prop,order})=>void                 | 
| editHandClick       | 点击操作栏编辑按钮回调 ，showOperate为true时有效 | ({column,prop,order})=>void                 | 
| delHandClick        | 点击操作栏删除按钮回调 ，showOperate为true时有效 | ({column,prop,order})=>void                 | 
| addHandClick        | 点击操作栏新增按钮回调 ，showOperate为true时有效 | ($index:number)=>void                       | 

### Slots

| 属性名称          | 说明                                 | 示例                                |
|---------------|------------------------------------|-----------------------------------| 
| [prop]Header  | 动态表头，插槽名称：prop字段+'Header'， 最多支持二级  | `<slot #noHeader="data"></data>`  |  
| [prop]Default | 动态表列，插槽名称：prop字段+'Default'， 最多支持二级 | `<slot #noDefault="data"></data>` |  
| more          | 自定义操作按钮 ，showOperate为true时有效       | `<slot #more></data>`             |  

# 计划更新

- [x] HeTable
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
  
