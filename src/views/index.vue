<template>
  <div>
    <nav-menu class="menu-style" :menus="menuItems"/>
    <div class="container">
      <top-bar class="top-bar-style"/>
      <router-view transition="fade" transition-mode="out-in" class="content-style" v-if="isRouterAlive"></router-view>
    </div>
  </div>
</template>
<script>
import navMenu from '@/components/menu/navMenu.vue'
import topBar from '@/components/topBar'
import menuList from '@/config/menus'
import accountService from '@/service/accountService'
import lodash from 'lodash'

// import { deepClone } from '@/utils/common'

export default {
  data () {
    return {
      menuItems: [],
      authLists: [],
      isRouterAlive: true
    }
  },
  components: { navMenu, topBar },
  methods: {
    filterMenus (menus) {
      // debugger
      for (let i = 0; i < menus.length; i++) {
        if (menus[i].auth && !this.match(menus[i].auth)) {
          menus.splice(i--, 1)
        } else if (menus[i].items) {
          menus[i].items = this.filterMenus(menus[i].items)
          if (menus[i].items.length === 0) menus.splice(i--, 1)
        }
      }
      return menus
    },
    match (auths) {
      if (typeof auths === 'string') {
        auths = [auths]
      }
      return auths.every(auth => this.authLists.find(al => al.auth === auth))
    }
    // reload () {
    //   this.isRouterAlive = false
    //   this.$nextTick(function () {
    //     this.isRouterAlive = true
    //   })
    // }
  },
  created () {
    accountService.getAuths({empnum: window.localStorage.getItem('empnum')}).then((res) => {
      this.authLists = res.obj.list
    }).then(() => {
      let arr = lodash.cloneDeep(menuList)
      // let arr = deepClone(menuList)
      this.menuItems = this.filterMenus(arr)
    })
  },
  watch: {
    menuItems: {
      handler: function (newVal, oldVal) {
        this.menuItems = newVal
      },
      deep: true
    }
  },
}
</script>
<style lang="less">
body {
  margin: 0;
  background: #f0f2f5;
  .menu-style {
    height: 100vh;
    background: #545c64;
    width: 200px;
    position: fixed;
  }
  .container {
    margin-left: 200px;
    .content-style {
      margin: 20px;
    }
  }
}
</style>
