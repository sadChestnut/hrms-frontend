import axios from 'axios'
const rootPath = 'http://localhost:8080/api'
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'
// 以json的形式进行提交

const xhr = ({url, body = null}) => {
  const reqPath = rootPath + url
  const promise = new Promise((resolve, reject) => {
    axios({
      method: 'post',
      url: reqPath,
      data: body
    }).then(res => {
      if (res.status !== 200) {
        this.$message.error('请求错误')
      }
      resolve(res.data)
    }).catch()
  })
  return promise
}
export default xhr
