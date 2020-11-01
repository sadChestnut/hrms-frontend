import xhr from './xhr/axios'
class StaffService {
  saveResume (body) {
    return xhr({
      method: 'post',
      url: '/employee/addInfo',
      body
    })
  }

  getResume (body) {
    return xhr({
      method: 'post',
      url: '/employee/getInfo',
      body
    })
  }

  updateResume (body) {
    return xhr({
      method: 'post',
      url: '/employee/updateInfo',
      body
    })
  }

  getEmployee (body) {
    return xhr({
      method: 'post',
      url: '/employee/getSearchInfo',
      body
    })
  }

  sendEmail (body) {
    return xhr({
      method: 'post',
      url: '/sendemail',
      body
    })
  }

  getSingleProDetail (body) {
    return xhr({
      method: 'post',
      url: '/employee/getSingleProDetail',
      body
    })
  }

  updateSingleProDetail (body) {
    return xhr({
      method: 'post',
      url: '/employee/updateSingleProDetail',
      body
    })
  }

  addEduListDetail (body) {
    return xhr({
      method: 'post',
      url: '/employee/addEduListDetail',
      body
    })
  }

  addProListDetail (body) {
    return xhr({
      method: 'post',
      url: '/employee/addProListDetail',
      body
    })
  }

  addWorkListDetail (body) {
    return xhr({
      method: 'post',
      url: '/employee/addWorkListDetail',
      body
    })
  }

  getAllWorkList (body) {
    return xhr({
      method: 'post',
      url: '/employee/getAllWorkList',
      body
    })
  }

  getAllEmployee (body) {
    return xhr({
      method: 'post',
      url: '/employee/getAllEmployee',
      body
    })
  }

  searchEmployee (body) {
    return xhr({
      method: 'post',
      url: '/employee/searchEmployee',
      body
    })
  }

  delEmployee (body) {
    return xhr({
      method: 'post',
      url: '/employee/delemployee',
      body
    })
  }
}

export default new StaffService()
