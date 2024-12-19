import {createApp} from 'vue'
import 'element-plus/dist/index.css'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
// import {HeTable} from "@/plugin/index.ts"

import App from './App.vue'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

// app.use(HeTable)
app.use(ElementPlus, {
    locale: zhCn,
}).mount('#app')
