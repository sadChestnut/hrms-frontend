<template lang="pug">
  el-menu(background-color="#545c64",text-color="#fff",active-text-color="#ffd04b")
    template(v-for="(menu, key) in menus")
      el-menu-item(v-if="!menu.items || menu.items.length === 0", :index="key.toString()")
        i(:class="menu.icon")
        span(slot="title") {{menu.label}}
      el-submenu(v-else, :index="key.toString()")
        template(slot="title")
          i(:class="menu.icon")
          span(slot="title") {{menu.label}}
        template(v-for="(item, itemkey) in menu.items")
          router-link.router-link-style(:to="{ path: '/' + transAuthFormat(item.auth) }")
            el-menu-item(:index="key+'-'+itemkey")
              span {{item.label}}
</template>
<script>
export default {
  name: 'navMenu',
  props: {
    menus: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    transAuthFormat (auths) {
      return auths.map(auth => auth.replace('-', '/'))
    }
  },
  watch: {
    menus: {
      handler: function (newVal, oldVal) {
        this.menus = newVal
        this.$forceUpdate()
      },
      deep: true
    }
  }
}
</script>
<style lang="less" scoped>
.router-link-style {
  text-decoration: none;
  color: #ffffff;
}
</style>
