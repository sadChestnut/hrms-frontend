<template lang="pug">
div
  el-card
    div(slot="header")
      span 项目人员需求详情
    div
      el-form
        el-form-item(label="项目名称:")
          span {{ proInfo.proname }}
        el-form-item(label="项目负责人:")
          span(@click="openStaffResume(proInfo.empnum)") {{ proInfo.empnum }}
          span(style="color: #409EFF; cursor: pointer;", @click="openStaffResume(proInfo.empnum)") （点击查看项目负责人详情>>）
        el-form-item(label="项目信息详情:")
          el-button(type="primary", size="small", @click="downloadFile") 点击下载
        el-form-item(label="确定起始日期:")
          span {{ formateTime(proInfo.certaintime) }}
        el-form-item(label="预计项目工期:")
          span {{ proInfo.timelimit }}个月
        // el-form-item(label="所需技能:")
        //   span {{ proInfo.skilllists }}
        el-form-item(label="职位/人数/技能:")
          span {{ formatePostLists(proInfo.postlists) }}
        el-form-item.employee-project-style(label="项目人员配置详情:")
          span(v-if="propersonlists.length === 0") 无
          span.project-item-style(v-else, v-for="(item, index) in propersonlists")
            el-tag(closable, @close="handleClose(item)") 工号：{{item.empnum}},&nbsp;&nbsp;职位：{{item.identity}},&nbsp;&nbsp;预计参与时间：{{formateTime(item.starttime)}}&nbsp;至&nbsp;{{formateTime(item.endtime)}}
  el-card(style="margin-top: 20px;")
    div(slot="header")
      span 项目人员配置
    div
      el-form(:inline="true")
        el-form-item(label="职位")
          el-select(v-model="searchList.post")
            el-option(v-for="role in roleList", :label="role.label", :key="role.value", :value="role.value")
        el-form-item(label="技能")
          el-input(v-model="searchList.skill")
        el-form-item
          el-button(type="primary", @click="searchEmployee") 查询
          el-button(@click="clearSearch") 重置
      el-table(style="width: 100%;", border, :data="employeeInfo")
        el-table-column(label="员工工号", prop="empnum")
        el-table-column(label="员工姓名", prop="empname")
        el-table-column(label="所在岗位", prop="identity")
        el-table-column(label="相关技能", prop="skill")
        el-table-column(label="操作")
          template(slot-scope="scope")
            el-button.operate-but-style(type="text", @click="openStaffResume(scope.row.empnum)") 查看员工简历
            el-button.operate-but-style(type="text", v-show="!scope.row.isJoin", @click="allocationProject(scope.row.empname, scope.row.empnum, scope.row.identity)") 项目分配
            el-button.operate-but-style(type="text", v-show="scope.row.isJoin", @click="releaseEmployee(scope.row.empname, scope.row.empnum, scope.row.identity)") 释放
  assign-date(v-if="isShowDate", :isShow="isShowDate", :empnum="empnum", @updateIsShow="updateIsShow", @click="getTimeInfo")
</template>
<script>
import moment from 'moment'
import axios from 'axios'
import projectService from '@/service/projectService'
import staffService from '@/service/staffService'
import messageService from '@/service/messageService'
import positionService from '@/service/positionService'
// import fileService from '@/service/fileService'
import assignDate from './assignDate'
import {formateTime, formatePostLists, openStaffResume, download} from '@/utils/common.js'
export default {
  name: 'assignHumanResource',
  data () {
    const viewType = this.$route.name.split('.')[1]
    return {
      viewType,
      proInfo: {
        postlists: []
      },
      roleList: [],
      searchList: {
        post: '',
        skill: ''
      },
      employeeInfo: [],
      isShowDate: false,
      empnum: '',
      empname: '',
      identity: '',
      propersonlists: [],
      saveIsJoin: [],
      workdetail: [],
      mark: true,
      currentmaxmonth: 0,
      conflictProjectid: ''
    }
  },
  components: { assignDate },
  methods: {
    formatePostLists,
    formateTime,
    openStaffResume,
    download,
    downloadFile () {
      let _this = this
      let filelists = this.proInfo.filelists ? this.proInfo.filelists.split(';') : []
      filelists.forEach(item => {
        axios({
          method: 'post',
          url: 'http://localhost:8080/api/file/download',
          data: {
            filename: item
          },
          responseType: 'blob'
        }).then(res => {
          let arr = item.split('-')
          _this.download(res.data, arr[arr.length - 1])
        }).catch((error) => {
          console.log(error)
        })
      })
    },
    clearSearch () {
      this.searchList = {
        post: '',
        skill: ''
      }
    },
    searchEmployee () {
      // if (this.searchList.post === '' || this.searchList.skill === '') {
      //   this.$message({
      //     message: '查询条件不能为空',
      //     type: 'warning'
      //   })
      //   return
      // }
      staffService.getEmployee({ ...this.searchList }).then(res => {
        if (res.obj.list.length === 0) {
          this.$message({
            message: '查询结果为空',
            type: 'info'
          })
        } else {
          this.employeeInfo = res.obj.list
          this.employeeInfo.map((item, index) => {
            let findindex = this.saveIsJoin.findIndex(s => s === item.empnum)
            if (findindex === -1) {
              item.isJoin = false
            } else {
              item.isJoin = true
            }
          })
        }
      })
    },
    allocationProject (empname, empnum, identity) {
      this.getworkDetail(empnum).then(() => {
        if (!this.mark) {
          if (this.currentmaxmonth === 11) {
            this.$message.warning('该员工的工作时间已被全部占用，不能再次分配')
          } else {
            projectService.getProjectDetail({ proid: this.conflictProjectid }).then(res => {
              this.$message.warning('该员工当前时间不可用, 冲突项目:' + res.obj.proname)
            })
          }
          return
        }
        this.empnum = empnum
        this.identity = identity
        this.empname = empname
        this.$confirm('是否加入该项目', {
          confirmButtonText: '加入',
          cancelButtonText: '取消',
          type: 'info'
        }).then(() => {
          this.isShowDate = true
        }).catch(() => {})
      })
    },
    updateIsShow (mark) {
      this.isShowDate = mark
    },
    getTimeInfo (obj) {
      if (this.viewType === 'assigncheck') {
        const send = window.localStorage.getItem('empnum')
        let sendname
        let acceptname
        staffService.getResume({empnum: send}).then(res => {
          sendname = res.obj.empname
        }).then(() => {
          staffService.getResume({empnum: this.proInfo.empnum}).then(res => {
            acceptname = res.obj.empname
          }).then(() => {
            const params = {
              send: send,
              sendname: sendname,
              accept: this.proInfo.empnum,
              acceptname: acceptname,
              empnum: this.empnum,
              empname: this.empname,
              proid: this.$route.params.proid,
              identity: this.identity,
              status: 3,
              ischeck: 0,
              senddate: new Date().getTime(),
              reason: ''
            }
            messageService.saveMessageInfo({ ...params }).then(res => {
              if (res.msg === '0') {
                this.$message({
                  type: 'info',
                  message: '请等待审核'
                })
              }
            })
          })
        })
      }
      const params = {
        ...obj,
        proid: this.$route.params.proid,
        empname: this.empname,
        empnum: this.empnum,
        identity: this.identity,
        ishascheck: 0
      }
      this.propersonlists.push({
        ...JSON.parse(JSON.stringify(params))
      })
      let infolists = this.employeeInfo.concat()
      let index = this.employeeInfo.findIndex(item => item.empnum === this.empnum)
      let _this = this
      infolists[index].isJoin = true
      this.saveIsJoin.push(this.empnum)
      this.$set(this, 'employeeInfo', infolists)
      projectService.setProjectTime({ ...params }).then(res => {
        if (res.msg === '0' && _this.viewType !== 'assigncheck') {
          this.$message.success('分配成功')
        }
      })
    },
    handleClose (tag) {
      this.propersonlists.splice(this.propersonlists.findIndex(item => item.empnum === tag.empnum), 1)
      projectService.delEmployee({proid: tag.proid, empnum: tag.empnum}).then(res => {
        if (res.msg === '0') {
          this.$message.success('移除成功')
        }
      })
      this.saveIsJoin.splice(this.saveIsJoin.indexOf(tag.empnum), 1)
      let index = this.employeeInfo.findIndex(item => item.empnum === tag.empnum)
      if (index !== -1) {
        this.employeeInfo[index].isJoin = false
        let arr = this.employeeInfo.concat()
        this.$set(this, 'employeeInfo', arr)
      }
    },
    getProInfo () {
      const proid = this.$route.params.proid
      projectService.getProjectDetail({ proid: proid }).then(res => {
        this.proInfo = res.obj
      })
    },
    // updateJoinTime (empnum) {
    //   this.isShowDate = true
    //   this.empnum = empnum
    // },
    releaseEmployee (empname, empnum, identity) {
      this.$confirm('确定将员工' + empnum + '从本项目中移除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let status = this.$route.params.status ? this.$route.params.status : 0
        if (this.viewType === 'assigncheck' && status !== 3) {
          const send = window.localStorage.getItem('empnum')
          let sendname
          let acceptname
          staffService.getResume({empnum: send}).then(res => {
            sendname = res.obj.empname
          }).then(() => {
            staffService.getResume({empnum: this.proInfo.empnum}).then(res => {
              acceptname = res.obj.empname
            }).then(() => {
              const params = {
                send: send,
                sendname: sendname,
                accept: this.proInfo.empnum,
                acceptname: acceptname,
                empnum: empnum,
                empname: empname,
                proid: this.$route.params.proid,
                identity: identity,
                status: 5,
                ischeck: 0,
                senddate: new Date().getTime(),
                reason: ''
              }
              messageService.saveMessageInfo({ ...params }).then(res => {
                if (res.msg === '0') {
                  this.$message({
                    type: 'info',
                    message: '请等待审核'
                  })
                }
              })
            })
          })
        } else {
          this.handleClose({ proid: this.$route.params.proid, empnum: empnum })
        }
      }).catch(() => {})
    },
    getConfigPlan () {
      const proid = this.$route.params.proid
      projectService.getConfigPlan({ proid: proid }).then(res => {
        this.propersonlists = res.obj.list
        this.propersonlists.forEach((item, index) => {
          staffService.getResume({ empnum: item.empnum }).then(res => {
            // this.$set(this.employeeInfo, index, { ...res.obj, isJoin: true })
            this.employeeInfo.push({ ...res.obj, isJoin: true })
            this.saveIsJoin.push(item.empnum)
          })
        })
      })
    },
    getworkDetail (empnum) {
      this.mark = true
      this.conflictProjectid = ''
      return projectService.getEmpWorkDetail({empnum: empnum}).then(res => {
        this.workdetail = res.obj.list
      }).then(() => {
        // let maxmonth = 0
        if (this.workdetail.length === 0) {
          this.mark = true
        } else {
          let workTime = []
          let proTime = []
          this.workdetail.map(item => {
            let startmonth = moment(item.starttime).get('month')
            let endmonth = moment(item.endtime).get('month')
            for (let i = startmonth; i <= endmonth; i++) {
              workTime.push({proid: item.proid, month: i})
            }
            // if (maxmonth < month) {
            //   maxmonth = month
            // }
          })
          if (workTime.length === 12) {
            this.currentmaxmonth = 11
            this.mark = false
          } else {
            this.currentmaxmonth = 0
            let proStarttime = moment(this.proInfo.certaintime).get('month')
            for (let i = proStarttime; i < proStarttime + this.proInfo.timelimit; i++) {
              proTime.push(i)
            }
            proTime.every((item, index) => {
              let findIndex = workTime.findIndex(w => w.month === item)
              if (findIndex !== -1) {
                this.mark = false
                this.conflictProjectid = workTime[findIndex].proid
                return false
              } else {
                return true
              }
            })
          }
          // if (maxmonth === 11) {
          //   this.currentmaxmonth = maxmonth
          //   this.mark = false
          // } else {
          //   this.currentmaxmonth = 0
          //   if (maxmonth >= moment(this.proInfo.certaintime).get('month')) {
          //     this.mark = false
          //   } else {
          //     this.mark = true
          //   }
          // }
        }
      })
    },
    getRoleList () {
      positionService.getPositionList({ page: '', count: '' }).then(res => {
        res.obj.list.forEach(item => {
          if (item.positionname !== 'hr' && item.positionname !== '项目经理') {
            this.roleList.push({ text: item.positionname, value: item.positionname })
          }
        })
      })
    }
  },
  watch: {
    employeeInfo: {
      handler: function (newVal, oldVal) {
        this.employeeInfo = newVal
      },
      deep: true
    }
  },
  created () {
    this.getProInfo()
    this.getConfigPlan()
    this.getRoleList()
  }
}
</script>
<style lang="less">
.employee-project-style {
  display: flex;
  flex-direction: row;
  .project-item-style {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-bottom: 10px;
  }
}
</style>
