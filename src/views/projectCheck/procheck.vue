<template lang="pug">
div
  el-card
    div(slot="header" class="clearfix")
      span 项目人员申请/释放
      // img.update-message-style(src="../../assets/update.svg", alt="update", @click="updateProjectDetail")
    div
      el-form(:inline="true", :model="searchForm")
        el-form-item(label="项目名称")
          el-input.search-input-style(v-model="searchForm.proname")
        el-form-item
          el-button(type="primary", @click="searchProject") 搜索
          el-button(@click="clearSearch") 重置
      el-table(:data="prodata", style="width: 100%")
        el-table-column(type="expand")
          template(slot-scope="scope")
            el-form.demo-table-expand(label-position="left")
              el-form-item(label="项目名称")
                span {{ scope.row.proname }}
              el-form-item(label="项目所需职位详情")
                span {{ formatePostLists(scope.row.postlists) }}
              el-form-item(label="人员配置详情(点击查看简历)")
                div.skill-style(@click="openStaffResume(item.empnum)", v-for="(item, index) in scope.row.proemployeeplan", v-if="item.ishascheck")
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
            //- el-button.operate-but-style(type="text", @click="checkEmpPlan(scope.row.proid, scope.row.prostatus)") 人员配置审核
            el-button.operate-but-style(type="text", @click="changeEmployeePlan(scope.row.proname, scope.row.proemployeeplan, scope.row.proid)") 申请/释放人员
            el-button.operate-but-style(type="text", @click="sendMessage(scope.row)") 更改职位需求
      el-pagination.pagination-style(
        background
        layout="prev, pager, next"
        :page-size="count"
        :total="total"
        @current-change="handleCurrentChange"
      )
  apply-release-employee(v-if="isShow", :hasJoin="saveIsJoin", :proid="proid", :proname="proname")
</template>
<script>
import projectService from '@/service/projectService'
import applyReleaseEmployee from './applyReleaseEmployee'
import {formateTime, formatePostLists, formateEmpPlan, openStaffResume} from '@/utils/common.js'
export default {
  name: 'procheck',
  components: { applyReleaseEmployee },
  data () {
    return {
      searchForm: {
        proname: ''
      },
      prodata: [],
      saveIsJoin: [],
      isShow: false,
      proid: '',
      proname: '',
      page: 1,
      count: 5,
      total: 0,
      dialogFormVisible: false,
      postLists: []
    }
  },
  methods: {
    formateTime,
    formatePostLists,
    formateEmpPlan,
    openStaffResume,
    handleCurrentChange (page) {
      this.page = page
      this.getProInfoAndEmpPlan(page, this.count)
    },
    getProInfoAndEmpPlan (page, count) {
      let proname = this.searchForm.proname ? this.searchForm.proname : ''
      projectService.getProjectBetweenMaxandMin({minprostatus: 2, maxprostatus: 4, count: count, page: page, proname: proname}).then(res => {
        // res.obj.list.map(item => {
        //   if (item.proemployeeplan.length > 0) {
        //     this.prodata.push(item)
        //   }
        // })
        this.prodata = res.obj.list
        this.total = res.obj.total
      })
    },
    // checkEmpPlan (proid, prostatus) {
    //   this.$confirm('项目人员配置计划是否通过审核', {
    //     confirmButtonText: '通过',
    //     cancelButtonText: '取消',
    //     type: 'info'
    //   }).then(() => {
    //     this.$message({
    //       type: 'success',
    //       message: '审核通过'
    //     })
    //     projectService.updateProStatus({ proid: proid, prostatus: prostatus }).then(res => {
    //       this.getProInfoAndEmpPlan()
    //     })
    //     // 通过审核后项目状态更新为开发中
    //   }).then(() => {
    //     // 审核项目计划，
    //     projectService.checkEmployeePlan({ proid: proid }).then()
    //   }).catch(() => {})
    // },
    changeEmployeePlan (proname, val, id) {
      this.isShow = true
      this.proname = proname
      this.$set(this, 'saveIsJoin', [])
      val.map(item => {
        let index = this.saveIsJoin.findIndex(s => s === item.empnum)
        if (index === -1 && item.ishascheck) {
          this.saveIsJoin.push(item.empnum)
        }
      })
      this.proid = id
    },
    // updateProjectDetail () {
    //   this.getProInfoAndEmpPlan()
    // },
    clearSearch () {
      this.searchForm = {
        proname: ''
      }
    },
    searchProject () {
      // projectService.searchProject({ ...this.searchForm, protype: '', prostatus: '', empnum: window.localStorage.getItem('empnum'), showhasdone: false }).then(res => {
      //   if (res.msg === '0') {
      //     this.prodata = res.obj.list
      //   }
      // })
      this.getProInfoAndEmpPlan(this.page, this.count)
    },
    sendMessage (obj) {
      this.$router.push({name: 'project.changepost', params: { proid: obj.proid, proname: obj.proname, pLists: obj.postlists }})
    }
  },
  created () {
    this.getProInfoAndEmpPlan(this.page, this.count)
  },
  watch: {
    isShow: {
      handler: function (newVal, oldVal) {
        this.isShow = newVal
      },
      deep: true
    }
  }
}
</script>
<style lang="less">
.demo-table-expand {
  font-size: 0;
  label {
    width: 200px;
    color: #99a9bf;
  }
  .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 100%;
  }
  .skill-style {
    display: block;
    width: 100%;
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
.update-message-style {
  float: right;
  width: 18px;
  height: 18px;
  vertical-align: middle;
}
</style>
