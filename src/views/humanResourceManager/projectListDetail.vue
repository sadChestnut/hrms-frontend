<template lang="pug">
  el-card
    div(slot="header")
      span 项目列表
    el-table(style="width: 100%;", :data="datalist")
      el-table-column(type="expand")
        template(slot-scope="scope")
          el-form.demo-table-expand(label-position="left", inline)
            el-form-item(label="项目名称")
              span {{ scope.row.proname }}
            el-form-item(label="项目负责人")
              span {{ scope.row.empname }}
            el-form-item(label="项目负责人联系方式")
              span {{ scope.row.phone }}
            el-form-item(label="项目负责人电子邮件")
              span {{ scope.row.email }}
            // el-form-item(label="项目所需技能列表")
            //   span.skill-style {{ scope.row.skilllists }}
            el-form-item(label="项目所需职位详情")
              span.skill-style {{ formatePostLists(scope.row.postlists) }}
      el-table-column(label="项目名称", prop="proname")
      el-table-column(prop="predicttime", label="预计起始日期")
        template(slot-scope="scope")
          span {{ formateTime(scope.row.predicttime) }}
      el-table-column(prop="certaintime", label="确定起始日期")
        template(slot-scope="scope")
          span {{ formateTime(scope.row.certaintime) }}
      el-table-column(prop="timelimit", label="预计项目工期")
        template(slot-scope="scope")
          span {{ scope.row.timelimit }}&nbsp;个月
      el-table-column(label="操作", fixed="right")
        template(slot-scope="scope")
          el-button.operate-but-style(type="text",  @click="humanResourceConfig(scope.row.proid)") 项目人员配置
    el-pagination.pagination-style(
      background
      layout="prev, pager, next"
      :page-size="count"
      :total="total"
      @current-change="handleCurrentChange"
    )
</template>
<script>
import projectService from '@/service/projectService'
import staffService from '@/service/staffService'
import {formateTime, formatePostLists} from '@/utils/common.js'
export default {
  name: 'projectListDetail',
  data () {
    return {
      datalist: [],
      page: 1,
      count: 5,
      total: 0
    }
  },
  methods: {
    formateTime,
    formatePostLists,
    humanResourceConfig (proid) {
      // let routeData = this.$router.resolve({ path: '/humanresource/assignhumanresource', query: { proid: proid } })
      // window.open(routeData.href, '_blank')
      this.$router.push({ name: 'humanresource.assignhumanresource', params: { proid: proid } })
    },
    handleCurrentChange (page) {
      this.datalist = []
      this.page = page
      this.getList()
    },
    getList () {
      let empname = ''
      let phone = ''
      let email = ''
      projectService.getAllProjects({ prostatus: 2, page: this.page, count: this.count }).then((res) => {
        res.obj.list.map(item => {
          staffService.getResume({ empnum: item.empnum }).then(res => {
            empname = res.obj.empname
            phone = res.obj.phone
            email = res.obj.email
            this.datalist.push({ ...item, empname: empname, phone: phone, email: email })
          })
        })
        this.total = res.obj.total
      })
    }
  },
  created () {
    this.datalist = []
    this.getList()
  }
}
</script>
<style lang="less">
.demo-table-expand {
  font-size: 0;
  label {
    width: 150px;
    color: #99a9bf;
  }
  .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
  .skill-style {
    color: #409EFF;
  }
}
</style>
