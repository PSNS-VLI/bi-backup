import 'element-plus/theme-chalk/el-loading.css'
import 'element-plus/theme-chalk/el-message.css'
import 'element-plus/theme-chalk/el-message-box.css'

import ElementPlus from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

const installElement = (vueAppInstance) => {
  vueAppInstance.use(ElementPlus, {
    locale: zhCn
  })
}

export default installElement
