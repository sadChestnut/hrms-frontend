import xhr from './xhr/axios'
class AccountService {
  login (body) {
    return xhr({
      method: 'post',
      url: '/login',
      body
    })
  }
  logout (body) {
    return xhr({
      method: 'post',
      url: '/logout',
      body
    })
  }
  getAuths (body) {
    return xhr({
      method: 'post',
      url: '/getauths',
      body
    })
  }
  getValiCode (body) {
    return xhr({
      method: 'post',
      url: '/validateCode',
      body
    })
  }
  getEmpInfoAndAuth (body) {
    return xhr({
      method: 'post',
      url: '/getempinfoandauth',
      body
    })
  }
  getAuthMenus (body) {
    return xhr({
      method: 'post',
      url: '/getauthmenus',
      body
    })
  }
  changeEmpAuth (body) {
    return xhr({
      method: 'post',
      url: '/changeempauth',
      body
    })
  }
  modifyPassword (body) {
    return xhr({
      method: 'post',
      url: '/modifyPassword',
      body
    })
  }
  adminModifyPassword (body) {
    return xhr({
      method: 'post',
      url: '/adminModifyPassword',
      body
    })
  }
  getEmpnum (body) {
    return xhr({
      method: 'post',
      url: '/getEmpnum',
      body
    })
  }
  addUser (body) {
    return xhr({
      method: 'post',
      url: '/addUser',
      body
    })
  }
  removeUser (body) {
    return xhr({
      method: 'post',
      url: '/removeUser',
      body
    })
  }
}

export default new AccountService()
