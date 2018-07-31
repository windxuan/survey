import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import http from './http'
import utils from './utils'

// 引入组件
import ElementUI from 'element-ui'
import VueClipboard from 'vue-clipboard2'

// 引入静态资源
import 'element-ui/lib/theme-chalk/base.css'
import 'element-ui/lib/theme-chalk/index.css'
import 'element-ui/lib/theme-chalk/display.css'

// 组件化
Vue.use(ElementUI)
Vue.use(VueClipboard)

// 全局绑定
Vue.prototype.$http = http
Vue.prototype.$utils = utils

// 关闭消息提示
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
