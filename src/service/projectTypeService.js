import xhr from './xhr/axios'
class ProjectTypeService {
  addProjectType (body) {
    return xhr({
      method: 'post',
      url: '/projectype/add',
      body
    })
  }
  delProjectType (body) {
    return xhr({
      method: 'post',
      url: '/projectype/delete',
      body
    })
  }

  updateProjectType (body) {
    return xhr({
      method: 'post',
      url: '/projectype/update',
      body
    })
  }

  getProjectTypeList (body) {
    return xhr({
      method: 'post',
      url: '/projectype/list',
      body
    })
  }

  getProjectTypeInfo (body) {
    return xhr({
      method: 'post',
      url: '/projectype/getProjectypeInfo',
      body
    })
  }
}

export default new ProjectTypeService()
