<template lang="pug">
div
  el-card
    div(slot="header")
      span 职位管理
      el-button.add-user-but(type="primary", @click="addPosition") 新增职位
    div
      el-table(:data="tableData", border)
        el-table-column(prop="positionid", label="职位ID")
        el-table-column(prop="positionname", label="职位名称")
        el-table-column(prop="positiondetail", label="职位详情")
        el-table-column(label="操作")
          template(slot-scope="scope")
            el-button(type="text",@click="editPosition(scope.row.positionid)") 编辑
            el-button(type="text",@click="removePosition(scope.row.positionid)") 删除
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
import positionService from '@/service/positionService'
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
    addPosition () {
      this.$router.push({ name: 'knowledge.addposition' })
    },
    editPosition (id) {
      this.$router.push({ name: 'knowledge.positiondetail', params: { positionid: id } })
    },
    getPositionList () {
      positionService.getPositionList({ page: this.page, count: this.count }).then(res => {
        this.tableData = res.obj.content
        this.total = res.obj.totalElements
      })
    },
    handleCurrentChange (page) {
      this.page = page
      this.getPositionList()
    },
    removePosition (id) {
      this.$confirm('确定移除该职位吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        positionService.delPosition({ positionid: id }).then((res) => {
          if (res.msg === '0') {
            this.$message.success('删除成功')
            this.handleCurrentChange(1)
          }
        })
      }).catch(() => {})
    }
  },
  created () {
    this.getPositionList()
  }
}
</script>
<style lang="less">
.add-user-but {
  float: right;
  padding: 10px;
}
</style>
