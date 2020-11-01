import auth from './auth'
const install = function (Vue) {
  Vue.use(auth)
}

export default Object.assign({}, auth, {install})
