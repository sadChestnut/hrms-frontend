import Vue from 'vue'
import VueRouter from 'vue-router'
import routerList from './routerList'
import menuList from '@/config/menus'
// import transform from '@/util
import lodash from 'lodash'
// import { deepClone } from '@/utils/common'
Vue.use(VueRouter)

const router = new VueRouter({
  routes: routerList
})
router.beforeEach((to, from, next) => {
  Vue.auth.getAuths({empnum: window.localStorage.getItem('empnum')}).then(() => {
    if (to.name === 'login') {
      next()
      Vue.auth.logout()
    } else if (Vue.auth.isLogined()) {
      if (!Vue.auth.match(to.meta.auth)) {
        next('/login')
      } else if (to.name === 'root') {
        let arr = lodash.cloneDeep(menuList)
        let menus = Vue.auth.filterMenus(arr)
        if (menus && menus[0] && menus[0].items && menus[0].items[0]) {
          next({name: menus[0].items[0].name})
        } else {
          next('/login')
        }
      } else {
        next()
      }
    } else {
      next('/login')
    }
  })
})
export default router
