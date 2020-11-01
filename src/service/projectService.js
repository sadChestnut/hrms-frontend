import xhr from './xhr/axios'
class ProjectService {
  saveProInfo (body) {
    return xhr({
      method: 'post',
      url: '/project/addInfo',
      body
    })
  }

  getProjectList (body) {
    return xhr({
      method: 'post',
      url: '/project/getproject',
      body
    })
  }

  getProjectDetail (body) {
    return xhr({
      method: 'post',
      url: '/project/getprojectdetail',
      body
    })
  }

  updateProInfo (body) {
    return xhr({
      method: 'post',
      url: '/project/saveInfo',
      body
    })
  }

  updateProStatus (body) {
    return xhr({
      method: 'post',
      url: '/project/updatestatus',
      body
    })
  }

  getAllProjects (body) {
    return xhr({
      method: 'post',
      url: '/project/getallprojects',
      body
    })
  }

  // 使某一成员加入项目
  setProjectTime (body) {
    return xhr({
      method: 'post',
      url: '/project/setemployeetime',
      body
    })
  }

  // 获取项目人员配置
  getConfigPlan (body) {
    return xhr({
      method: 'post',
      url: '/project/getconfigplan',
      body
    })
  }

  // 删除人员配置计划的某一成员
  delEmployee (body) {
    return xhr({
      method: 'post',
      url: '/project/delemployee',
      body
    })
  }

  // 移除项目中所有的成员
  removeEmployees (body) {
    return xhr({
      method: 'post',
      url: '/project/removeemployees',
      body
    })
  }

  // 获取项目详情以及人员配置详情
  getEmpPlan (body) {
    return xhr({
      method: 'post',
      url: '/project/getproemployeeplan',
      body
    })
  }
  // 获取员工工作安排详情
  getEmpWorkDetail (body) {
    return xhr({
      method: 'post',
      url: '/project/getempworkdetail',
      body
    })
  }

  getIsHaveTime (body) {
    return xhr({
      method: 'post',
      url: '/project/getishave',
      body
    })
  }

  checkEmployeePlan (body) {
    return xhr({
      method: 'post',
      url: '/project/checkemployeeplan',
      body
    })
  }

  checkcertainemployeeplan (body) {
    return xhr({
      method: 'post',
      url: '/project/checkcertainemployeeplan',
      body
    })
  }

  getProjectBetweenMaxandMin (body) {
    return xhr({
      method: 'post',
      url: '/project/getprojectbetweenmaxandmin',
      body
    })
  }

  searchProject (body) {
    return xhr({
      method: 'post',
      url: '/project/searchProject',
      body
    })
  }

  searchProjectstatus (body) {
    return xhr({
      method: 'post',
      url: '/project/searchProjectstatus',
      body
    })
  }

  updatePropost (body) {
    return xhr({
      method: 'post',
      url: '/project/updatepropost',
      body
    })
  }
}

export default new ProjectService()
