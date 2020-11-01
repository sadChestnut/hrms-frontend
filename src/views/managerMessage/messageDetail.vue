<template lang="pug">
div
  el-card
    div(slot="header", style="margin-bottom: 10px;")
      span 消息详情
    div
      el-form
        el-form-item(label="发件人:")
          span {{ messageForm.sendname }}
        el-form-item(label="收件人:")
          span {{ messageForm.acceptname }}
        el-form-item(label="发件日期:")
          span {{ formateTime(messageForm.senddate) }}
        el-form-item(label="发件详情:")
          span.pro-detail-style {{ messageForm.sendname }}申请员工{{ messageForm.empname }}(工号为{{ messageForm.empnum }})
          template
            span.pro-detail-style.skill-style(v-if="messageForm.status === 0") 移除
            span.pro-detail-style.skill-style(v-else) 加入
          span.pro-detail-style {{ messageForm.proname }}项目, 是否通过审核？
        el-form-item
          div.pro-detail-style(style="margin-left: 550px;")
            span(v-if="ischeck === 0")
              el-button(type="text", @click="confirmCheck(messageForm.status)") 通过
              el-button(type="text", @click="noPassCheck") 不通过
            span(v-else).skill-style 已审批
  el-card(style="margin-top: 20px;")
    div(slot="header", style="margin-bottom: 10px;")
      span {{ projectForm.proname }}项目详情
    div
      el-form(:inline="true")
        el-form-item(label="项目名:")
          span {{ projectForm.proname }}
        el-form-item(label="确定起始日期:")
          span {{ formateTime(projectForm.certaintime) }}
        el-form-item(label="项目持续时间:")
          span {{ projectForm.timelimit }}个月
        // el-form-item(label="所需技能:")
        //   span {{ projectForm.skilllists }}
        el-form-item(label="职位/人数/技能:")
          span {{ formatePostLists(projectForm.postlists) }}
        el-form-item(label="项目类型:")
          span {{ projectForm.protype }}
        el-form-item(label="项目已参与人员(工号/姓名/职位/参与时间):")
          span {{ formateEmpPlan(configPlan) }}
  el-card(style="margin-top: 20px;")
    div(slot="header", style="margin-bottom: 10px;")
      span {{ empnumtitle }}
      span.open-resume-style.skill-style(@click="openStaffResume(messageForm.empnum)") (点击查看简历>>)
    el-table(border,style="width: 100%; margin-top: 10px;", :data="joinProForm")
      el-table-column(label="项目名称", prop="proname")
      el-table-column(label="参与起始时间", prop="starttime")
        template(slot-scope="scope")
          span {{ formateTime(scope.row.starttime) }}
      el-table-column(label="参与结束时间", prop="endtime")
        template(slot-scope="scope")
          span {{ formateTime(scope.row.endtime) }}
      el-table-column(label="担任职责", prop="identity")
  assign-date(v-if="isShow", :isShow="isShow", :empnum="empnum", @updateIsShow="updateIsShow", @click="addEmployeePlan")
  reason-detail(v-if="isShowReason", :dialogFormVisible="isShowReason", @closeReasonDetail="closeReasonDetail", @click="submitReason")
</template>
<script>
import moment from 'moment'
import messageService from '@/service/messageService'
import projectService from '@/service/projectService'
import staffService from '@/service/staffService'
import assignDate from '@/views/humanResourceManager/assignDate'
import reasonDetail from '@/views/managerMessage/reasonDetail'
import { formateTime, formatePostLists, formateEmpPlan, openStaffResume } from '@/utils/common'
export default {
  name: 'messageDetail',
  data () {
    return {
      messageForm: {},
      projectForm: {
        postlists: []
      },
      configPlan: [],
      empnumtitle: '',
      employeeForm: {},
      joinProForm: [],
      ischeck: this.$route.params.ischeck,
      isShow: false,
      isShowReason: false,
      empnum: '',
      workdetail: []
    }
  },
  components: { assignDate, reasonDetail },
  methods: {
    formateTime,
    formatePostLists,
    formateEmpPlan,
    openStaffResume,
    getMessageDetail () {
      const empnum = this.$route.params.empnum
      const proid = this.$route.params.proid
      const status = this.$route.params.status
      messageService.getMessageDetail({empnum: empnum, proid: proid, status: status}).then(res => {
        const obj = { ...res.obj }
        this.empnumtitle = res.obj.empname + '参与项目详情'
        projectService.getProjectDetail({ proid: proid }).then(res => {
          this.projectForm = res.obj
          this.messageForm = { ...obj, proname: res.obj.proname }
        })
      })
    },
    getProjectConfig () {
      const proid = this.$route.params.proid
      projectService.getConfigPlan({proid: proid}).then(res => {
        this.configPlan = res.obj.list
      })
    },
    getEmpDetail () {
      const empnum = this.$route.params.empnum
      staffService.getResume({ empnum: empnum }).then(res => {
        this.employeeForm = res.obj
      })
    },
    getJoinProForm () {
      const empnum = this.$route.params.empnum
      this.joinProForm = []
      projectService.getEmpWorkDetail({ empnum: empnum }).then(res => {
        res.obj.list.map((item, index) => {
          projectService.getProjectDetail({proid: item.proid}).then(res => {
            this.joinProForm.push({...item, proname: res.obj.proname})
          })
        })
      })
    },
    confirmCheck (status) {
      if (status === 1) {
        let mark = true
        let currentmaxmonth = 0
        projectService.getEmpWorkDetail({empnum: this.messageForm.empnum}).then(res => {
          this.workdetail = res.obj.list
        }).then(() => {
          if (this.workdetail.length === 0) {
            currentmaxmonth = 0
            mark = true
          } else {
            let workTime = []
            let proTime = []
            this.workdetail.map(item => {
              let startmonth = moment(item.starttime).get('month')
              let endmonth = moment(item.endtime).get('month')
              for (let i = startmonth; i <= endmonth; i++) {
                workTime.push(i)
              }
            })
            if (workTime.length === 12) {
              currentmaxmonth = 11
              mark = false
            } else {
              currentmaxmonth = 0
              let proStarttime = moment(this.projectForm.certaintime).get('month')
              for (let i = proStarttime; i < proStarttime + this.projectForm.timelimit; i++) {
                proTime.push(i)
              }
              proTime.every((item, index) => {
                if (workTime.findIndex(w => w === item) !== -1) {
                  mark = false
                  return false
                } else {
                  return true
                }
              })
            }
          }
          if (mark) {
            const params = {
              proid: this.messageForm.proid,
              empnum: this.messageForm.empnum,
              reason: '',
              status: status
            }
            messageService.updateMessageCheck({ ...params }).then(res => {
            }).then(() => {
              this.empnum = this.messageForm.empnum
              this.isShow = true
            })
          } else {
            if (currentmaxmonth === 11) {
              this.$message.warning('该员工的工作时间已被全部占用，不能再次分配')
            } else {
              this.$message.warning('该员工当前时间不可用')
            }
          }
        })
      } else {
        const params = {
          proid: this.messageForm.proid,
          empnum: this.messageForm.empnum,
          reason: '',
          status: status
        }
        messageService.updateMessageCheck({ ...params }).then(res => {
        }).then(() => {
          projectService.delEmployee({ ...params }).then(res => {
            if (res.msg === '0') {
              this.$message.success('操作成功')
            }
          }).then(() => {
            this.$nextTick(() => {
              this.ischeck = '1'
            })
          }).then(() => {
            this.getProjectConfig()
            this.getJoinProForm()
          })
          this.getMessageDetail()
        })
      }
    },
    noPassCheck () {
      this.isShowReason = true
    },
    updateIsShow (val) {
      this.isShow = false
    },
    addEmployeePlan (val) {
      const params = {
        ...val,
        proid: this.messageForm.proid,
        empnum: this.messageForm.empnum,
        empname: this.messageForm.empname,
        identity: this.messageForm.identity
      }
      projectService.setProjectTime({ ...params }).then(res => {
        if (res.msg === '0') {
          this.$message.success('操作成功')
        }
      }).then(() => {
        projectService.checkEmployeePlan({proid: this.messageForm.proid}).then(res => {
          this.$nextTick(() => {
            this.ischeck = '1'
          })
        }).then(() => {
          this.getProjectConfig()
          this.getMessageDetail()
          this.getJoinProForm()
        })
      })
    },
    closeReasonDetail (val) {
      this.isShowReason = val
    },
    submitReason (val) {
      const params = {
        proid: this.messageForm.proid,
        empnum: this.messageForm.empnum,
        reason: val,
        status: this.$route.params.status
      }
      messageService.updateMessageCheck({ ...params }).then(res => {
        if (res.msg === '0') {
          this.$message.success('操作成功')
          this.ischeck = '1'
        }
      })
    }
  },
  created () {
    this.getMessageDetail()
    this.getProjectConfig()
    this.getEmpDetail()
    this.getJoinProForm()
  }
}
</script>
<style lang="less">
.skill-style {
  color: #409EFF;
}
.open-resume-style {
  cursor: pointer;
}
.pro-detail-style {
  font-size: 16px;
}
</style>
