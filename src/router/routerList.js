export default [
  {
    path: '/',
    name: 'root',
    component (resolve) {
      require(['@/views/'], resolve)
    },
    children: [
      {
        path: '/staffResume',
        name: 'staffResume',
        component (resolve) {
          require(['@/views/staffResume/'], resolve)
        },
        redirect: to => {
          return '/staffResume/detail'
        },
        children: [
          {
            path: '/staffResume/detail',
            name: 'staffResume.detail',
            component (resolve) {
              require(['@/views/staffResume/detail'], resolve)
            }
          },
          {
            path: '/staffResume/edit',
            name: 'staffResume.edit',
            component (resolve) {
              require(['@/views/staffResume/detail'], resolve)
            }
          },
          {
            path: '/staffResume/prodetail',
            name: 'staffResume.prodetail',
            component (resolve) {
              require(['@/views/staffResume/joinProDetail'], resolve)
            }
          },
          {
            path: '/staffResume/initialProInfo',
            name: 'staffResume.initialProInfo',
            component (resolve) {
              require(['@/views/staffResume/joinProDetail'], resolve)
            }
          },
          {
            path: '/staffResume/workdetail',
            name: 'staffResume.workdetail',
            component (resolve) {
              require(['@/views/staffResume/workExperience'], resolve)
            }
          },
          {
            path: '/staffResume/initialedudetail',
            name: 'staffResume.initialEduDetail',
            component (resolve) {
              require(['@/views/staffResume/educationDetail'], resolve)
            }
          },
          {
            path: '/staffResume/edudetail',
            name: 'staffResume.edudetail',
            component (resolve) {
              require(['@/views/staffResume/educationDetail'], resolve)
            }
          }
        ]
      },
      {
        path: '/project',
        name: 'project',
        component (resolve) {
          require(['@/views/projectManager/'], resolve)
        },
        children: [
          {
            path: '/project/myproject',
            name: 'project.myproject',
            component (resolve) {
              require(['@/views/projectManager/projectlist'], resolve)
            }
          },
          {
            path: '/project/proemployeecheck',
            name: 'project.proemployeecheck',
            component (resolve) {
              require(['@/views/projectCheck/proemployeecheck'], resolve)
            }
          },
          {
            path: '/project/procheck',
            name: 'project.procheck',
            component (resolve) {
              require(['@/views/projectCheck/procheck'], resolve)
            }
          },
          {
            path: '/project/detail',
            name: 'project.detail',
            component (resolve) {
              require(['@/views/projectManager/detail'], resolve)
            }
          },
          {
            path: '/project/add',
            name: 'project.add',
            component (resolve) {
              require(['@/views/projectManager/detail'], resolve)
            }
          },
          {
            path: '/project/changepost',
            name: 'project.changepost',
            component (resolve) {
              require(['@/views/projectCheck/changePost'], resolve)
            }
          }
        ]
      },
      {
        path: '/humanresource',
        name: 'humanresource',
        component (resolve) {
          require(['@/views/humanResourceManager/'], resolve)
        },
        children: [
          {
            path: '/humanresource/listDetail',
            name: 'humanresource.listDetail',
            component (resolve) {
              require(['@/views/humanResourceManager/projectListDetail'], resolve)
            }
          },
          {
            path: '/humanresource/assignhumanresource',
            name: 'humanresource.assignhumanresource',
            component (resolve) {
              require(['@/views/humanResourceManager/assignHumanResource'], resolve)
            }
          },
          {
            path: '/humanresource/assigncheck',
            name: 'humanresource.assigncheck',
            component (resolve) {
              require(['@/views/humanResourceManager/assignHumanResource'], resolve)
            }
          },
          {
            path: '/humanresource/applyEmployee',
            name: 'humanresource.applyEmployee',
            component (resolve) {
              require(['@/views/humanResourceManager/applyEmployee'], resolve)
            }
          }
        ]
      },
      {
        path: '/message',
        name: 'message',
        component (resolve) {
          require(['@/views/message/'], resolve)
        },
        children: [
          {
            path: '/message/mymessage',
            name: 'message.mymessage',
            component (resolve) {
              require(['@/views/message/myMessage'], resolve)
            }
          },
          {
            path: '/message/managermessage',
            name: 'message.managermessage',
            component (resolve) {
              require(['@/views/managermessage/myMessage'], resolve)
            }
          },
          {
            path: '/message/detail',
            name: 'message.detail',
            component (resolve) {
              require(['@/views/managerMessage/messageDetail'], resolve)
            }
          }
        ]
      },
      {
        path: '/chart',
        name: 'chart',
        component (resolve) {
          require(['@/views/chart/'], resolve)
        },
        children: [
          {
            path: '/chart/mychart',
            name: 'chart.mychart',
            component (resolve) {
              require(['@/views/chart/mychart'], resolve)
            }
          }
        ]
      },
      {
        path: '/auth',
        name: 'auth',
        component (resolve) {
          require(['@/views/authAsign/'], resolve)
        },
        redirect: to => {
          return '/auth/asign'
        },
        children: [
          {
            path: '/auth/asign',
            name: 'auth.asign',
            component (resolve) {
              require(['@/views/authAsign/authAsign'], resolve)
            }
          }
        ]
      },
      {
        path: '/account',
        name: 'account',
        component (resolve) {
          require(['@/views/account/'], resolve)
        },
        children: [
          {
            path: '/account/modifypassword',
            name: 'account.modifypassword',
            component (resolve) {
              require(['@/views/account/modifyPassword'], resolve)
            }
          }
        ]
      },
      {
        path: '/resume',
        name: 'resume',
        component (resolve) {
          require(['@/views/resumeManager/'], resolve)
        },
        children: [
          {
            path: '/resume/list',
            name: 'resume.list',
            component (resolve) {
              require(['@/views/resumeManager/list'], resolve)
            }
          }
        ]
      },
      {
        path: '/user',
        name: 'user',
        component (resolve) {
          require(['@/views/userManager/'], resolve)
        },
        children: [
          {
            path: '/user/list',
            name: 'user.list',
            component (resolve) {
              require(['@/views/userManager/list'], resolve)
            }
          }
        ]
      },
      {
        path: '/knowledge',
        name: 'knowledge',
        component (resolve) {
          require(['@/views/knowledgeManager/'], resolve)
        },
        children: [
          {
            path: '/knowledge/position',
            name: 'knowledge.position',
            component (resolve) {
              require(['@/views/knowledgeManager/positionType'], resolve)
            }
          },
          {
            path: '/knowledge/project',
            name: 'knowledge.project',
            component (resolve) {
              require(['@/views/knowledgeManager/projectType'], resolve)
            }
          },
          {
            path: '/knowledge/positiondetail',
            name: 'knowledge.positiondetail',
            component (resolve) {
              require(['@/views/knowledgeManager/positiondetail'], resolve)
            }
          },
          {
            path: '/knowledge/addposition',
            name: 'knowledge.addposition',
            component (resolve) {
              require(['@/views/knowledgeManager/positiondetail'], resolve)
            }
          },
          {
            path: '/knowledge/projectdetail',
            name: 'knowledge.projecdetailt',
            component (resolve) {
              require(['@/views/knowledgeManager/projectTypeDetail'], resolve)
            }
          },
          {
            path: '/knowledge/addproject',
            name: 'knowledge.addproject',
            component (resolve) {
              require(['@/views/knowledgeManager/projectTypeDetail'], resolve)
            }
          }
        ]
      }
    ]
  },
  {
    path: '/',
    name: 'singlepage',
    component (resolve) {
      require(['@/views/singlePage'], resolve)
    },
    children: [
      // {
      //   path: '/humanresource/assignhumanresource',
      //   name: 'humanresource.assignhumanresource',
      //   component (resolve) {
      //     require(['@/views/humanResourceManager/assignHumanResource'], resolve)
      //   }
      // },
      {
        path: '/staffResume/resumedetail',
        name: 'staffResume.resumedetail',
        component (resolve) {
          require(['@/views/staffResume/resumeDetail'], resolve)
        }
      }
      // {
      //   path: '/project/detail',
      //   name: 'project.detail',
      //   component (resolve) {
      //     require(['@/views/projectManager/detail'], resolve)
      //   }
      // },
      // {
      //   path: '/message/detail',
      //   name: 'message.detail',
      //   component (resolve) {
      //     require(['@/views/managerMessage/messageDetail'], resolve)
      //   }
      // }
    ]
  },
  {
    path: '/',
    component (resolve) {
      require(['@/views/account/'], resolve)
    },
    redirect: to => {
      return '/login'
    },
    children: [
      {
        path: '/login',
        name: 'login',
        component (resolve) {
          require(['@/views/account/login'], resolve)
        }
      }
    ]
  }
]
