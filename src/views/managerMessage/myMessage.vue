<template lang="pug">
div
  el-card
    div(slot="header")
      span 消息通知
    // div(v-for="(item, index) in alertMessage")
    //   el-alert.alert-message-style(v-if="item.isreason", show-icon, type="error", :title="item.title", :key="index")
    //   el-alert.alert-message-style(v-else, show-icon, type="success", :title="item.title", :key="index")
    div(style="text-align: center;margin-bottom: 10px")
      a.change-tab-style(:class="[tabType === item.value ? 'checked-tab-style change-tab-style' : 'unchecked-tab-style change-tab-style']", v-for='item in tabList', :key='item.value', @click='tabChange(item.value)') {{item.text}}
    el-table(:data="tableData", style="width:100%")
      el-table-column(type="index")
      el-table-column(property="senddate", label="申请日期")
        template(slot-scope="scope")
          span {{ formateTime(scope.row.senddate) }}
      el-table-column(property="sendname", label="申请人", width="150")
      el-table-column(property="acceptname", label="审核人")
      el-table-column(label="申请/释放")
        template(slot-scope="scope")
          span(v-if="scope.row.status === 0") 释放
          span(v-else) 申请
      el-table-column(property="empnum",label="申请/释放员工", width="160")
        template(slot-scope="scope")
         span.open-staffresume(@click="openStaffResume(scope.row.empnum)") {{scope.row.empnum}}(点击打开简历)
      el-table-column(label="审批状态")
        template(slot-scope="scope")
          el-tag(v-if="scope.row.ischeck === 0", type="danger") 待审批
          el-tag(v-else, type="info") 已审批
      el-table-column(label="审批结果", v-if="tabType !== 'check'")
        template(slot-scope="scope")
          el-tag(v-if="scope.row.reason !== ''", type="danger") 失败
          el-tag(v-else, type="success") 成功
      el-table-column(label="操作")
        template(slot-scope="scope")
          el-button(type="text", @click="openDialog(scope.row)") 点击查看详情
    el-pagination.pagination-style(
      background
      layout="prev, pager, next"
      :page-size="count"
      :total="total"
      @current-change="handleCurrentChange"
    )
  reason-detail(v-if="isShowReason", :dialogFormVisible="isShowReason", @closeReasonDetail="closeReasonDetail", @click="submitReason")
</template>
<script>
import messageService from '@/service/messageService'
import projectService from '@/service/projectService'
import {formateTime, openStaffResume} from '@/utils/common'
import reasonDetail from '@/views/managerMessage/reasonDetail'
export default {
  name: 'my-message',
  data () {
    return {
      alertMessage: [],
      tableData: [],
      isShowReason: false,
      empnum: '',
      proid: '',
      status: 0,
      tabPosition: 'top',
      tabList: [
        { text: '申请', value: 'apply' },
        { text: '审核', value: 'check' }
      ],
      tabType: 'apply',
      page: 1,
      count: 5,
      total: 0
    }
  },
  components: { reasonDetail },
  methods: {
    formateTime,
    openStaffResume,
    tabChange (type = '') {
      this.tabType = type
      if (type === 'apply') {
        this.getCheckMessage(this.page, this.count)
      } else {
        this.getAcceptMessage(this.page, this.count)
      }
    },
    handleCurrentChange (page) {
      if (this.tabType === 'apply') {
        this.getCheckMessage(page, this.count)
      } else {
        this.getAcceptMessage(page, this.count)
      }
    },
    getAcceptMessage (page, count) {
      const accept = window.localStorage.getItem('empnum')
      messageService.getAcceptMessgae({ accept: accept, page: page, count: count }).then(res => {
        this.tableData = res.obj.content
        this.total = res.obj.totalElements
      })
    },
    getCheckMessage (page, count) {
      const send = window.localStorage.getItem('empnum')
      messageService.getCheckedMessage({ send: send, page: page, count: count }).then(res => {
        this.tableData = res.obj.content.filter(item => {
          return item.status !== 2 && item.status !== 4
        })
        this.total = res.obj.totalElements
        // res.obj.list.map(item => {
        //   let str = ''
        //   let proname = ''
        //   let mark = false
        //   projectService.getProjectDetail({proid: item.proid}).then(res => {
        //     proname = res.obj.proname
        //   }).then(() => {
        //     if (item.status === 0) {
        //       if (item.reason !== '') {
        //         str += '申请员工' + item.empname + '(工号' + item.empnum + ')移除"' + proname + '"项目,审核未通过。未通过原因:' + item.reason
        //         mark = true
        //       } else {
        //         str += '申请员工' + item.empname + '(工号' + item.empnum + ')移除"' + proname + '"项目,审核已通过'
        //         mark = false
        //       }
        //     } else if (item.status === 1) {
        //       if (item.reason !== '') {
        //         str += '申请员工' + item.empname + '(工号' + item.empnum + ')加入"' + proname + '"项目,审核未通过。未通过原因:' + item.reason
        //         mark = true
        //       } else {
        //         str += '申请员工' + item.empname + '(工号' + item.empnum + ')加入"' + proname + '"项目,审核已通过'
        //         mark = false
        //       }
        //     } else {
        //       return
        //     }
        //     this.alertMessage.push({title: str, isreason: mark})
        //   })
        // })
      })
    },
    getProjectName (proid) {
      projectService.getProjectDetail({proid: proid}).then(res => {
        return res.obj.proname
      })
    },
    openDialog (obj) {
      let proname = ''
      let str = ''
      if (obj.status !== 3 && obj.status !== 5) {
        projectService.getProjectDetail({proid: obj.proid}).then(res => {
          proname = res.obj.proname
        }).then(() => {
          if (obj.status === 0) {
            if (obj.reason !== '') {
              str += '申请员工' + obj.empname + '(工号' + obj.empnum + ')移除"' + proname + '"项目,审核未通过。未通过原因:' + obj.reason
            } else {
              str += '申请员工' + obj.empname + '(工号' + obj.empnum + ')移除"' + proname + '"项目,审核已通过'
            }
          } else if (obj.status === 1) {
            if (obj.reason !== '') {
              str += '申请员工' + obj.empname + '(工号' + obj.empnum + ')加入"' + proname + '"项目,审核未通过。未通过原因:' + obj.reason
            } else {
              str += '申请员工' + obj.empname + '(工号' + obj.empnum + ')加入"' + proname + '"项目,审核已通过'
            }
          }
          this.$alert(str, '消息', {
            confirmButtonText: '确定',
            callback: action => {}
          })
        })
      } else {
        if (this.tabType === 'check' && obj.ischeck) {
          this.$message.info('已审批')
          return
        }
        projectService.getProjectDetail({proid: obj.proid}).then(res => {
          proname = res.obj.proname
        }).then(() => {
          if (obj.status === 3) {
            str += '申请员工' + obj.empname + '(工号' + obj.empnum + ')加入"' + proname + '"项目,是否通过审核?'
          } else {
            str += '申请员工' + obj.empname + '(工号' + obj.empnum + ')移除"' + proname + '"项目,是否通过审核?'
          }
          this.$confirm(str, '消息', {
            confirmButtonText: '通过',
            cancelButtonText: '不通过',
            type: 'info'
          }).then(() => {
            if (obj.status === 3) {
              projectService.checkcertainemployeeplan({ proid: obj.proid, empnum: obj.empnum }).then(res => {
                if (res.msg === '0') {
                  this.$message.success('操作成功')
                }
              }).then(() => {
                const params = {
                  proid: obj.proid,
                  empnum: obj.empnum,
                  reason: '',
                  status: obj.status
                }
                messageService.updateMessageCheck({ ...params }).then(() => {
                  this.getCheckMessage(this.page, this.count)
                  this.tabChange('apply')
                })
              })
            } else {
              projectService.delEmployee({proid: obj.proid, empnum: obj.empnum}).then(res => {
                if (res.msg === '0') {
                  this.$message.success('操作成功')
                }
              }).then(() => {
                const params = {
                  proid: obj.proid,
                  empnum: obj.empnum,
                  reason: '',
                  status: obj.status
                }
                messageService.updateMessageCheck({ ...params }).then(() => {
                  this.getCheckMessage(this.page, this.count)
                  this.tabChange('apply')
                })
              })
            }
          }).catch(() => {
            this.isShowReason = true
            this.empnum = obj.empnum
            this.proid = obj.proid
            this.status = obj.status
          })
        })
      }
    },
    closeReasonDetail (val) {
      this.isShowReason = val
    },
    submitReason (val) {
      const params = {
        proid: this.proid,
        empnum: this.empnum,
        reason: val,
        status: this.status
      }
      messageService.updateMessageCheck({ ...params }).then(res => {
        if (res.msg === '0') {
          this.$message.success('操作成功')
          this.getCheckMessage(this.page, this.count)
          this.tabChange('apply')
        }
      })
    }
  },
  created () {
    this.getCheckMessage(this.page, this.count)
  }
}
</script>
<style lang="less">
.alert-message-style {
  margin-top: 20px;
}
.change-tab-style {
  border: 1px solid #409EFF;
  width: 70px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  display: inline-block;
  cursor: pointer;
}
.unchecked-tab-style {
  background-color: #ffffff;
  color: #409EFF;
}
.checked-tab-style {
  background-color: #409EFF;
  color: #ffffff;
}
.open-staffresume {
  color: #409EFF;
  cursor: pointer;
}
</style>
