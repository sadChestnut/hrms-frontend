<template lang="pug">
div
  el-card
    div(slot="header" class="clearfix")
      span 项目人员配置计划审核
    el-table(:data="prodata", style="width: 100%")
      el-table-column(type="expand")
        template(slot-scope="scope")
          el-form.demo-table-expand(label-position="left", inline)
            el-form-item(label="项目名称")
              span {{ scope.row.proname }}
            // el-form-item(label="项目所需技能列表")
            //   span {{ scope.row.skilllists }}
            el-form-item(label="职位/人数/技能")
              span {{ formatePostLists(scope.row.postlists) }}
            el-form-item(label="人员配置详情(点击查看简历)")
              span.skill-style(@click="openStaffResume(item.empnum)", v-for="(item, index) in scope.row.proemployeeplan")
                el-tooltip(class="item", effect="dark", content="点击打开简历",placement="top")
                  span 员工工号: {{ item.empnum }} 员工姓名: {{ item.empname }} 担任职位:{{ item.identity }} 参与时间: {{ formateTime(item.starttime) }} 至 {{ formateTime(item.endtime) }};
      el-table-column(label="项目名称", prop="proname")
      el-table-column(prop="predicttime", label="预计起始日期")
        template(slot-scope="scope")
          span {{ formateTime(scope.row.predicttime) }}
      el-table-column(prop="certaintime", label="确定起始日期")
        template(slot-scope="scope")
          span {{ formateTime(scope.row.certaintime) }}
      el-table-column(prop="timelimit", label="项目持续时间")
        template(slot-scope="scope")
          span {{ scope.row.timelimit }} 个月
      el-table-column(label="操作", fixed="right")
        template(slot-scope="scope")
          el-button.operate-but-style(type="text", @click="checkEmpPlan(scope.row.proid, scope.row.prostatus)") 人员配置审核
    el-pagination.pagination-style(
      background
      layout="prev, pager, next"
      :page-size="count"
      :total="total"
      @current-change="handleCurrentChange"
    )
  reason-detail(v-if="isshow", :dialogFormVisible="isshow", @closeReasonDetail="closeReasonDetail", @click="submitReason")
</template>
<script>
import projectService from '@/service/projectService'
import staffService from '@/service/staffService'
import messageService from '@/service/messageService'
import reasonDetail from '../managerMessage/reasonDetail'
import {formateTime, formatePostLists, openStaffResume} from '@/utils/common.js'
export default {
  name: 'pro-employee-check',
  data () {
    return {
      prodata: [],
      isshow: false,
      proid: '',
      page: 1,
      count: 5,
      total: 0
    }
  },
  components: { reasonDetail },
  methods: {
    formateTime,
    formatePostLists,
    openStaffResume,
    handleCurrentChange (page) {
      this.page = page
      this.getProInfoAndEmpPlan()
    },
    getProInfoAndEmpPlan () {
      projectService.getEmpPlan({prostatus: 2, page: this.page, count: this.count, empnum: window.localStorage.getItem('empnum')}).then(res => {
        res.obj.list.map(item => {
          if (item.proemployeeplan.length > 0) {
            let index = this.prodata.findIndex(op => {
              return item.proid === op.proid
            })
            if (index === -1) {
              this.prodata.push(item)
            }
          }
        })
        this.total = res.obj.total
      })
    },
    closeReasonDetail (val) {
      this.isshow = val
    },
    checkEmpPlan (proid, prostatus) {
      this.proid = proid
      this.$confirm('项目人员配置计划是否通过审核', {
        confirmButtonText: '通过',
        cancelButtonText: '不通过',
        type: 'info'
      }).then(() => {
        projectService.updateProStatus({ proid: proid, prostatus: prostatus }).then(res => {
          if (res.msg === '0') {
            this.$message({
              type: 'success',
              message: '审核通过'
            })
          }
          let index = this.prodata.findIndex(item => item.proid === proid)
          this.prodata.splice(index, 1)
        })
        // 通过审核后项目状态更新为开发中
      }).then(() => {
        // 审核项目计划，
        projectService.checkEmployeePlan({ proid: proid })
      }).catch(() => {
        // 审核不通过
        this.isshow = true
      })
    },
    submitReason (reason) {
      // 配置的人员移除 删除掉
      const send = window.localStorage.getItem('empnum')
      let sendname
      let acceptname
      staffService.getResume({empnum: send}).then(res => {
        sendname = res.obj.empname
      }).then(() => {
        staffService.getResume({empnum: 3001}).then(res => {
          acceptname = res.obj.empname
        }).then(() => {
          const params = {
            send: send,
            sendname: sendname,
            accept: 3001,
            acceptname: acceptname,
            empnum: '',
            empname: '',
            proid: this.proid,
            identity: '',
            status: 2,
            ischeck: 0,
            senddate: new Date().getTime(),
            reason: reason
          }
          messageService.saveMessageInfo({ ...params }).then(res => {
            if (res.msg === '0') {
              this.$message({
                type: 'success',
                message: '操作成功'
              })
            }
          })
        })
      })
    }
  },
  watch: {
    prodata: {
      handler: function (newVal, oldVal) {},
      deep: true
    }
  },
  created () {
    this.getProInfoAndEmpPlan()
  }
}
</script>
<style lang="less">
.demo-table-expand {
  font-size: 0;
  label {
    width: 190px;
    color: #99a9bf;
  }
  .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 100%;
  }
  .skill-style {
    display: inline-block;
    &:hover {
      cursor: pointer;
      color: #409EFF;
    }
  }
  .join-project-style {
    display: flex;
    flex-direction: row;
    justify-content: center;
    &:hover {
      color: #409EFF;
    }
  }
  .additionnal-style {
    display: inline-block;
    width: 10px;
  }
}
</style>
