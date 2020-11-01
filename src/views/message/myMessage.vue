<template lang="pug">
div
  el-card
    div(slot="header")
      span 消息列表
      // img.update-message-style(src="../../assets/update.svg", alt="update", @click="updateMessage")
    div
      div(style="text-align: center;margin-bottom: 10px")
        a.change-tab-style(:class="[tabType === item.value ? 'checked-tab-style change-tab-style' : 'unchecked-tab-style change-tab-style']", v-for='item in tabList', :key='item.value', @click='tabChange(item.value)') {{item.text}}
      el-table(:data="tableData", style="width:100%")
        el-table-column(type="index", width="50")
        el-table-column(property="senddate", label="发件日期", width="150")
          template(slot-scope="scope")
            span {{ formateTime(scope.row.senddate) }}
        el-table-column(property="sendname", label="发件人", width="150")
        el-table-column(property="acceptname", label="收件人", width="150")
        el-table-column(label="状态", width="150")
          template(slot-scope="scope")
            el-tag(v-if="scope.row.ischeck === 0") 待审批
            el-tag(v-else, type="danger") 已审批
        el-table-column(label="详情")
          template(slot-scope="scope")
            el-button(type="text", @click="openDialog(scope.row)") 点击查看信息详情
      el-pagination.pagination-style(
        background
        layout="prev, pager, next"
        :page-size="count"
        :total="total"
        @current-change="handleCurrentChange"
      )
  message-detail(:isdialogshow="isShow", @click="handleClose", :operateObj="operateObj")
</template>
<script>
import messageService from '@/service/messageService'
import projectService from '@/service/projectService'
import {formateTime} from '@/utils/common'
import messageDetail from './detail'
export default {
  name: 'my-message',
  data () {
    return {
      tableData: [],
      isShow: false,
      // timer: null,
      operateObj: {
        accept: '',
        ischeck: 0,
        empnum: '',
        empname: '',
        identity: '',
        proid: '',
        send: '',
        senddate: '',
        status: 0
      },
      page: 1,
      count: 5,
      total: 0,
      tabType: 'check',
      tabList: [
        { text: '审核', value: 'check' },
        { text: '申请', value: 'apply' }
      ]
    }
  },
  components: { messageDetail },
  methods: {
    formateTime,
    tabChange (type = '') {
      this.tabType = type
      if (type === 'check') {
        this.getTableData(this.page, this.count)
      } else {
        this.getSendMessage(this.page, this.count)
      }
    },
    getSendMessage (page, count) {
      const send = window.localStorage.getItem('empnum')
      messageService.getSendMessage({ send: send, page: page, count: count }).then(res => {
        this.tableData = res.obj.content
        this.total = res.obj.totalElements
      })
    },
    handleCurrentChange (page) {
      this.getTableData(page, this.count)
    },
    getTableData (page, count) {
      const accept = window.localStorage.getItem('empnum')
      messageService.getAllMessage({ accept: accept, page: page, count: count }).then(res => {
        this.tableData = res.obj.content
        this.total = res.obj.totalElements
      })
    },
    openDialog (obj) {
      // this.isShow = true
      // this.operateObj = JSON.parse(JSON.stringify(obj))
      let proname
      if (obj.status === 0 || obj.status === 1) {
        // let routeData = this.$router.resolve({ path: '/message/detail', query: { proid: obj.proid, empnum: obj.empnum, ischeck: obj.ischeck } })
        // window.open(routeData.href, '_blank')
        this.$router.push({ name: 'message.detail', params: { proid: obj.proid, empnum: obj.empnum, ischeck: obj.ischeck, status: obj.status } })
      } else if (obj.status === 2) {
        projectService.getProjectDetail({ proid: obj.proid }).then((res) => {
          proname = res.obj.proname
        }).then(() => {
          let content = proname + '项目人员配置计划审核未通过，具体原因:' + obj.reason + '。请重新进行项目人员配置'
          this.$alert(content, '消息通知', {
            confirmButtonText: '人员配置',
            callback: action => {
              if (obj.ischeck === 0) {
                messageService.updateMessagePlanCheck({proid: obj.proid, status: 2}).then(() => {
                  this.getTableData(this.page, this.count)
                  this.$router.push({ name: 'humanresource.assignhumanresource', params: { proid: obj.proid } })
                })
              } else {
                this.$message.info('已审批')
              }
            }
          })
        })
      } else if (obj.status === 3 || obj.status === 5) {
        projectService.getProjectDetail({ proid: obj.proid }).then((res) => {
          let str = ''
          if (obj.status === 3) {
            str = '申请员工' + obj.empname + '(工号' + obj.empnum + ')加入"' + res.obj.proname + '"项目,'
          } else {
            str = '申请员工' + obj.empname + '(工号' + obj.empnum + ')移除"' + res.obj.proname + '"项目,'
          }
          if (!obj.ischeck) {
            str += '请等待审核'
            this.$alert(str, '消息', {
              confirmButtonText: '确定',
              callback: action => {}
            })
          } else {
            if (obj.reason !== '') {
              str += '审核未通过。未通过原因:' + obj.reason
            } else {
              str += '审核通过.'
            }
            this.$alert(str, '消息', {
              confirmButtonText: obj.reason === '' ? '确定' : '人员配置',
              callback: action => {
                if (obj.reason !== '') {
                  this.$router.push({ name: 'humanresource.assigncheck', params: { proid: obj.proid, status: obj.status } })
                }
              }
            })
          }
        })
      } else {
        projectService.getProjectDetail({ proid: obj.proid }).then((res) => {
          proname = res.obj.proname
        }).then(() => {
          let content = proname + '项目人员配置计划发生变动, 请重新进行项目人员配置'
          this.$alert(content, '消息通知', {
            confirmButtonText: '人员配置',
            callback: action => {
              if (obj.ischeck === 0) {
                messageService.updateMessagePlanCheck({proid: obj.proid, status: 4}).then(() => {
                  this.getTableData(this.page, this.count)
                  this.$router.push({ name: 'humanresource.assigncheck', params: { proid: obj.proid } })
                })
              } else {
                this.$message.info('人员配置已配置完成')
              }
            }
          })
        })
      }
    },
    handleClose (val) {
      this.isShow = val
      this.getTableData(this.page, this.count)
    },
    // setTimer () {
    //   if (this.timer === null) {
    //     this.timer = setInterval(() => {
    //       this.getTableData()
    //     }, 10000)
    //   }
    // },
    updateMessage () {
      this.getTableData(this.page, this.count)
    }
  },
  created () {
    this.getTableData(this.page, this.count)
    // this.setTimer()
  }
  // destroyed () {
  //   clearInterval(this.timer)
  //   this.timer = null
  // }
}
</script>
<style lang="less">
.update-message-style {
  float: right;
  width: 18px;
  height: 18px;
  vertical-align: middle;
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
</style>
