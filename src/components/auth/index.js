import accountService from '@/service/accountService'
import transAuthFormat from './transAuthFormat'
class Auth {
  constructor () {
    this.authList = []
    this.logined = false
  }

  login (body) {
    return accountService.login(body).then(res => {
      if (res.msg === '0') {
        this.logined = true
        if (res.obj && res.obj.list && res.obj.list.length) {
          this.authList = transAuthFormat(res.obj.list)
        }
      } else {
        this.logined = false
      }
      return res
    })
  }

  logout (body) {
    return accountService.logout(body).then(res => {
      this.logined = false
      return res
    })
  }

  match (auths) {
    if (!auths || !auths.length) return true
    if (typeof auths === 'string') {
      auths = [auths]
    }
    return auths.every(auth => this.authList.find(al => al === auth))
  }

  getAuths (body) {
    return accountService.getAuths(body).then((res) => {
      if (res.msg === '0') {
        this.logined = true
        if (res.obj.list && res.obj.list.length > 0) {
          this.authList = transAuthFormat(res.obj.list)
        }
      } else {
        this.logined = false
      }
      return res
    }, () => {
      this.logined = false
    })
  }

  isLogined () {
    return this.logined
  }

  filterMenus (menus) {
    for (let i = 0; i < menus.length; i++) {
      if (menus[i].auth && !this.match(menus[i].auth)) {
        menus.splice(i--, 1)
      } else if (menus[i].items) {
        menus[i].items = this.filterMenus(menus[i].items)
        if (menus[i].items.length === 0) menus.splice(i--, 1)
      }
    }
    return menus
  }
}

function install (Vue, options) {
  Vue.auth = Vue.prototype.$auth = new Auth()
}
export default {install}
