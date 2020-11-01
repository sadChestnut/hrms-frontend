<template lang="pug">
  el-card(style="margin-top: 20px;")
    div(slot="header")
      span {{ title }}人员配置
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
        el-table-column(label="当前状态", prop="state")
          template(slot-scope="scope")
            el-tag(v-if="scope.row.isJoin") 已加入
            el-tag(v-else-if="!scope.row.isJoin && !scope.row.check") 未加入
            el-tag(v-else-if="scope.row.check") 待审核
        el-table-column(label="操作", fixed="right")
          template(slot-scope="scope")
            el-button.operate-but-style(type="text", @click="openStaffResume(scope.row.empnum)") 查看员工简历
            el-button.operate-but-style(type="text", v-if="scope.row.isJoin", @click="releaseEmployee(scope.row.empname, scope.row.empnum, scope.row.identity)") 释放
            el-button.operate-but-style(type="text", v-if="!scope.row.isJoin", @click="applyEmployee(scope.row.empname, scope.row.empnum, scope.row.identity)") 申请
</template>
<script>
import staffService from '@/service/staffService'
import messageService from '@/service/messageService'
import positionService from '@/service/positionService'
// import projectService from '@/service/projectService'
import {openStaffResume} from '@/utils/common.js'
export default {
  name: 'applyReleaseEmployee',
  props: {
    hasJoin: {
      type: Array,
      required: true
    },
    proid: {
      type: String,
      required: true
    },
    proname: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      searchList: {
        post: '',
        skill: ''
      },
      employeeInfo: [],
      roleList: [],
      mark: false,
      certaintime: '',
      title: this.proname,
      waitcheck: []
    }
  },
  methods: {
    openStaffResume,
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
            let findindex = this.hasJoin.findIndex(s => s === item.empnum)
            if (findindex !== -1) {
              item.isJoin = true
            } else {
              let findcheck = this.waitcheck.findIndex(s => s === item.empnum)
              if (findcheck === -1) {
                item.isJoin = false
              } else {
                item.check = true
              }
            }
          })
        }
      })
    },
    clearSearch () {
      this.searchList = {
        post: '',
        skill: ''
      }
    },
    // 申请和释放accept写死，都传给3001用户，人力资源部门只有一个员工
    releaseEmployee (empname, empnum, identity) {
      const send = window.localStorage.getItem('empnum')
      let sendname
      let acceptname
      staffService.getResume({empnum: send}).then(res => {
        sendname = res.obj.empname
      })
      staffService.getResume({empnum: 3001}).then(res => {
        acceptname = res.obj.empname
      })
      this.$confirm('是否将员工移除本项目？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        const params = {
          send: send,
          sendname: sendname,
          accept: 3001,
          acceptname: acceptname,
          empnum: empnum,
          empname: empname,
          proid: this.proid,
          identity: identity,
          status: 0,
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
          this.searchEmployee()
        })
      }).catch(() => {})
    },
    applyEmployee (empname, empnum, identity) {
      const send = window.localStorage.getItem('empnum')
      let sendname
      let acceptname
      staffService.getResume({empnum: send}).then(res => {
        sendname = res.obj.empname
      })
      staffService.getResume({empnum: 3001}).then(res => {
        acceptname = res.obj.empname
      })
      this.$confirm('是否将员工加入本项目？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        const params = {
          send: send,
          sendname: sendname,
          accept: 3001,
          acceptname: acceptname,
          empnum: empnum,
          empname: empname,
          proid: this.proid,
          identity: identity,
          status: 1,
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
        this.waitcheck.push(empnum)
        this.searchEmployee()
      }).catch(() => {})
      // projectService.getIsHaveTime({proid: this.proid, empnum: empnum}).then((res) => {
      //   if (res.code === 'false') {
      //     this.$confirm('是否将员工加入本项目？', '提示', {
      //       confirmButtonText: '确定',
      //       cancelButtonText: '取消',
      //       type: 'info'
      //     }).then(() => {
      //       const params = {
      //         send: send,
      //         sendname: sendname,
      //         accept: 3001,
      //         acceptname: acceptname,
      //         empnum: empnum,
      //         empname: empname,
      //         proid: this.proid,
      //         identity: identity,
      //         status: 1,
      //         ischeck: 0,
      //         senddate: new Date().getTime(),
      //         reason: ''
      //       }
      //       messageService.saveMessageInfo({ ...params }).then(res => {
      //         if (res.msg === '0') {
      //           this.$message({
      //             type: 'info',
      //             message: '请等待审核'
      //           })
      //         }
      //       })
      //       this.waitcheck.push(empnum)
      //       this.searchEmployee()
      //     }).catch(() => {})
      //   } else {
      //     this.$message.warning('参与项目时间冲突')
      //   }
      // })
    },
    getWaitCheck () {
      const send = window.localStorage.getItem('empnum')
      messageService.getNoCheckedMessage({ send: send, proid: this.proid }).then(res => {
        res.obj.list.map(item => {
          this.waitcheck.push(item.empnum)
        })
      })
    },
    getRoleList () {
      positionService.getPositionList({ page: '', count: '' }).then(res => {
        res.obj.list.forEach(item => {
          if (item.positionname !== 'hr') {
            this.roleList.push({ text: item.positionname, value: item.positionname })
          }
        })
      })
    }
  },
  created () {
    this.getWaitCheck()
    this.getRoleList()
  },
  watch: {
    hasJoin: {
      handler: function (newVal, oldVal) {
        this.employeeInfo = []
      },
      deep: true
    },
    proname: {
      handler: function (newVal, oldVal) {
        this.title = newVal
      },
      deep: true
    }
  }
}
</script>
<style lang="less">

</style>
