// 导入样式
import "../components/HeTable/index.css"
//导入组件

import HeTable from "./componenets/HeTable/index.ts"

//存在所有组件

const components = [HeTable]

// 定义 install 方法，接收 Vue 作为参数。如果使用 use 注册插件，则所有的组件都将被注册

const install = function (app) {
    components.map((component) => {
        app.component(component.name, component) //此处的使用的组件vue文件中的name属性
    })
}
export default {

// 导出的对象必须具有 install，才能被 Vue.use() 方法安装

    install,

}

// 按需导出

export {

    HeTable

}

