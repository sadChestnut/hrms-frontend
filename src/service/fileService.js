import xhr from './xhr/axios'
class FileService {
  downloadFile (body) {
    return xhr({
      method: 'post',
      url: '/file/download',
      body
    })
  }
}
export default new FileService()
