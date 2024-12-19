// 引入自定义组件
import HeTable from '@/components/HeTable/index.vue'
// 添加注册组件的方法
HeTable.install = function(Vue) {
    Vue.component(HeTable.name, HeTable)
}
export default HeTable
