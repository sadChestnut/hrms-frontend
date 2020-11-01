<template lang="pug">
  el-card
    div(slot="header")
      span 项目人员申请
    div
      el-form(:inline="true", :model="searchForm")
        el-form-item(label="项目名称:")
          el-input.search-input-style(v-model="searchForm.proname")
        el-form-item
          el-button(type="primary", @click="searchProject") 搜索
          el-button(@click="clearSearch") 重置
      el-table(:data="projectList", border)
        el-table-column(prop="proname", label="项目名称")
        el-table-column(prop="protype", label="项目类别")
        el-table-column(prop="predicttime", label="预计起始日期")
          template(slot-scope="scope")
            span {{ formateTime(scope.row.predicttime) }}
        el-table-column(prop="certaintime", label="确定起始日期")
          template(slot-scope="scope")
            span {{ formateTime(scope.row.certaintime) }}
        el-table-column(prop="timelimit", label="预计项目工期")
          template(slot-scope="scope")
            span {{ scope.row.timelimit }} 个月
        el-table-column(prop="prostatus", label="项目状态")
          template(slot-scope="scope")
            el-tag(v-if="scope.row.prostatus === 1", type="success") 待启动
            el-tag(v-else-if="scope.row.prostatus === 2", type="success") 项目人员配置
            el-tag(v-else-if="scope.row.prostatus === 3", type="success") 开发中
            el-tag(v-else-if="scope.row.prostatus === 4", type="success") 测试中
            el-tag(v-else, type="success") 已交付
        el-table-column(label="操作")
          template(slot-scope="scope")
            el-button.operate-but-style(type="text", @click="changeEmployeePlan(scope.row.proid)") 更改人员配置
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
import {formateTime} from '@/utils/common'

export default {
  data () {
    return {
      searchForm: {
        proname: ''
      },
      projectList: [],
      page: 1,
      count: 5,
      total: 0
    }
  },
  methods: {
    formateTime,
    handleCurrentChange (page) {
      this.page = page
      this.searchProject()
    },
    clearSearch () {
      this.searchForm = { proname: '' }
    },
    searchProject () {
      this.projectList = []
      projectService.searchProjectstatus({ ...this.searchForm, page: this.page, count: this.count }).then(res => {
        if (res.msg === '0') {
          if (res.obj.content.length === 0) {
            this.$message.info('搜索结果为空')
          } else {
            this.projectList = res.obj.content
            this.total = res.obj.totalElements
          }
        }
      })
    },
    changeEmployeePlan (proid) {
      this.$router.push({ name: 'humanresource.assigncheck', params: { proid: proid } })
    }
  }
}
</script>
<style lang="less">

</style>
