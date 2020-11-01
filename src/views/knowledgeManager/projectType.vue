<template lang="pug">
div
  el-card
    div(slot="header")
      span 项目类型管理
      el-button.add-user-but(type="primary", @click="addProjectType") 新增项目类型
    el-table(:data="tableData", border)
      el-table-column(prop="projecttypeid", label="项目类型ID")
      el-table-column(prop="projecttypename", label="项目名称")
      el-table-column(prop="projecttypedetail", label="项目类型详情")
      el-table-column(label="操作")
        template(slot-scope="scope")
          el-button(type="text",@click="editProjectType(scope.row.projecttypeid)") 编辑
          el-button(type="text",@click="removeProjectProject(scope.row.projecttypeid)") 移除
    el-pagination.pagination-style(
      background
      layout="prev, pager, next"
      :page-size="count"
      :total="total"
      @current-change="handleCurrentChange"
      :current-page="page"
    )
</template>
<script>
import projectTypeService from '@/service/projectTypeService'
export default {
  data () {
    return {
      tableData: [],
      page: 1,
      count: 5,
      total: 0
    }
  },
  methods: {
    addProjectType () {
      this.$router.push({ name: 'knowledge.addproject' })
    },
    editProjectType (id) {
      this.$router.push({ name: 'knowledge.projecdetailt', params: { projecttypeid: id } })
    },
    removeProjectProject (id) {
      this.$confirm('确定移除该项目类型吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        projectTypeService.delProjectType({ projecttypeid: id }).then((res) => {
          if (res.msg === '0') {
            this.$message.success('删除成功')
            this.handleCurrentChange(1)
          }
        })
      }).catch(() => {})
    },
    getProjectTypeList () {
      projectTypeService.getProjectTypeList({ page: this.page, count: this.count }).then(res => {
        this.tableData = res.obj.content
        this.total = res.obj.totalElements
      })
    },
    handleCurrentChange (page) {
      this.page = page
      this.getProjectTypeList()
    }
  },
  created () {
    this.getProjectTypeList()
  }
}
</script>
<style lang="less">
.add-user-but {
  float: right;
  padding: 10px;
}
</style>
