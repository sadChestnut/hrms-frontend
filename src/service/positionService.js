import xhr from './xhr/axios'
class PositionService {
  addPosition (body) {
    return xhr({
      method: 'post',
      url: '/position/add',
      body
    })
  }

  delPosition (body) {
    return xhr({
      method: 'post',
      url: '/position/delete',
      body
    })
  }

  updatePosition (body) {
    return xhr({
      method: 'post',
      url: '/position/update',
      body
    })
  }

  getPositionList (body) {
    return xhr({
      method: 'post',
      url: '/position/list',
      body
    })
  }

  getPositionInfo (body) {
    return xhr({
      method: 'post',
      url: '/position/getPositionInfo',
      body
    })
  }
}
export default new PositionService()
