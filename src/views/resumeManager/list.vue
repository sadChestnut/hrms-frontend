<template lang="pug">
  el-card
    div(slot="header")
      span 员工信息列表
    div
      el-form(:inline="true", :model="searchForm")
        el-form-item(label="员工工号")
          el-input.search-input-style(v-model="searchForm.empnum")
        el-form-item(label="员工姓名")
          el-input.search-input-style(v-model="searchForm.empname")
        el-form-item(label="所在岗位")
          el-select.search-input-style(v-model="searchForm.identity")
            el-option(v-for="role in roleList", :label="role.label", :key="role.value", :value="role.value")
        el-form-item
          el-button(type="primary", @click="searchEmployee") 搜索
          el-button(@click="clearSearch") 重置
      el-table(:data="tableData", style="width:100%", border)
        el-table-column(label="员工工号", prop="empnum")
        el-table-column(label="员工姓名", prop="empname")
        el-table-column(label="联系方式", prop="phone")
        el-table-column(label="电子邮箱", prop="email")
        el-table-column(label="所在岗位", prop="identity")
        el-table-column(label="操作")
          template(slot-scope="scope")
            el-button(@click="handleClick(scope.row.empnum)", type="text") 编辑简历
      el-pagination.pagination-style(
        background
        layout="prev, pager, next"
        :page-size="count"
        :total="total"
        @current-change="handleCurrentChange",
        :current-page="page"
      )
</template>
<script>
import staffService from '@/service/staffService'
import positionService from '@/service/positionService'
export default {
  data () {
    return {
      tableData: [],
      searchForm: {
        empnum: '',
        empname: '',
        identity: ''
      },
      roleList: [],
      page: 1,
      count: 5,
      total: 0
    }
  },
  methods: {
    handleCurrentChange (page) {
      this.page = page
      this.getList()
    },
    handleClick (empnum) {
      this.$router.push({name: 'staffResume.edit', params: { empnum: empnum }})
    },
    searchEmployee () {
      // staffService.searchEmployee({ ...this.searchForm }).then(res => {
      //   if (res.msg === '0') {
      //     this.tableData = res.obj.list
      //   }
      // })
      this.handleCurrentChange(1)
    },
    clearSearch () {
      this.searchForm = {
        empnum: '',
        empname: '',
        identity: ''
      }
    },
    getList () {
      staffService.getAllEmployee({ page: this.page, count: this.count, ...this.searchForm }).then(res => {
        this.tableData = res.obj.content
        this.total = res.obj.totalElements
      })
    },
    getPositionList () {
      positionService.getPositionList({ page: '', count: '' }).then(res => {
        res.obj.list.forEach(item => {
          if (item.positionname !== 'hr') {
            this.roleList.push({ label: item.positionname, value: item.positionname })
          }
        })
      })
    }
  },
  created () {
    this.getList()
    this.getPositionList()
  }
}
</script>
<style lang="less">
.search-input-style {
  width: 180px;
}
</style>
