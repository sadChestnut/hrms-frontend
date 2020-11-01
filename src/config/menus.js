export default [
  {
    label: '个人技能信息管理',
    icon: 'el-icon-tickets',
    items: [
      {
        label: '个人简历管理',
        name: 'staffResume.detail',
        auth: ['staffResume-detail']
      }
    ]
  },
  {
    label: '项目管理',
    icon: 'el-icon-star-on',
    items: [
      {
        label: '我的项目',
        name: 'project.myproject',
        auth: ['project-myproject']
      },
      {
        label: '项目人员配置审核',
        name: 'project.proemployeecheck',
        auth: ['project-proemployeecheck']
      },
      {
        label: '项目人员申请',
        name: 'project.procheck',
        auth: ['project-procheck']
      }
    ]
  },
  {
    label: '项目管理',
    icon: 'el-icon-setting',
    items: [
      {
        label: '项目人员配置',
        name: 'humanresource.listDetail',
        auth: ['humanresource-listDetail']
      },
      {
        label: '项目人员申请',
        name: 'humanresource.applyEmployee',
        auth: ['humanresource-applyEmployee']
      }
    ]
  },
  {
    label: '员工简历管理',
    icon: 'el-icon-document',
    items: [
      {
        label: '简历管理',
        name: 'resume.list',
        auth: ['resume-list']
      }
    ]
  },
  {
    label: '消息中心',
    icon: 'el-icon-message',
    items: [
      {
        label: '我的消息',
        name: 'message.mymessage',
        auth: ['message-mymessage']
      },
      {
        label: '我的消息',
        name: 'message.managermessage',
        auth: ['message-managermessage']
      }
    ]
  },
  {
    label: '图表管理',
    icon: 'el-icon-star-off',
    items: [
      {
        label: '图表生成',
        name: 'chart.mychart',
        auth: ['chart-mychart']
      }
    ]
  },
  {
    label: '角色管理',
    icon: 'el-icon-view',
    items: [
      {
        label: '分配角色',
        name: 'auth.asign',
        auth: ['auth-asign']
      }
    ]
  },
  {
    label: '用户管理',
    icon: 'el-icon-star-off',
    items: [
      {
        label: '用户管理',
        name: 'user.list',
        auth: ['user-list']
      }
    ]
  },
  {
    label: '系统字段管理',
    icon: 'el-icon-edit-outline',
    items: [
      {
        label: '项目类型管理',
        name: 'knowledge.project',
        auth: ['knowledge-project']
      },
      {
        label: '职位类型管理',
        name: 'knowledge.position',
        auth: ['knowledge-position']
      }
    ]
  }
]
