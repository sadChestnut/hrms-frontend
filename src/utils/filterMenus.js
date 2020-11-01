import Vue from 'vue/dist/vue.js'
function filterMenus (menus) {
  for (let i = 0; i < menus.length; i++) {
    if (menus[i].auth && !Vue.auth.match(menus[i].auth)) {
      menus.splice(i--, 1)
    } else {
      menus[i].items = filterMenus(menus[i].items)
      if (menus[i].items.length === 0) menus.splice(i--, 1)
    }
  }
  return menus
}
export default filterMenus
