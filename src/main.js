// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from '@/components/App'
import router from './router'
import ElementUI from 'element-ui'
import Components from '@/components/'
import echarts from 'echarts'
import 'element-ui/lib/theme-chalk/index.css'
import store from '@/store/'

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(Components)
Vue.prototype.$echarts = echarts

// Vue.prototype.$auth = auth
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  // template: '<App/>'
  render: h => h(App)
})
