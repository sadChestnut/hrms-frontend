<template lang="pug">
div
  el-card
    div(slot="header")
      span 用户管理
      el-button.add-user-but(type="primary", @click="addUser", style="float: right; padding: 10px") 新增用户
    el-table(:data="tableData", style="width: 80%", border)
      el-table-column(prop="empnum", label="员工工号")
      el-table-column(prop="empname", label="员工姓名")
      el-table-column(prop="identity", label="担任职位")
      el-table-column(label="操作")
        template(slot-scope="scope")
          el-button(type="text",@click="modifyPassword(scope.row.empnum)") 修改密码
          el-button(type="text",@click="removeUser(scope.row.empnum)") 移除用户
    el-pagination.pagination-style(
      background
      layout="prev, pager, next"
      :page-size="count"
      :total="total"
      @current-change="handleCurrentChange"
      :current-page="page"
    )
  modify-password(:showPasswordDialog="showPasswordDialog", :passwordObj="passwordObj", @close-dialog="closeDialog")
  add-user(:showUserDialog="showUserDialog", @close-dialog="closeDialog", :useInfo="useInfo")
</template>
<script>
import accountService from '@/service/accountService'
import staffService from '@/service/staffService'
import modifyPassword from '@/views/userManager/modifyPassword'
import addUser from '@/views/userManager/addUserModify'

export default {
  components: { modifyPassword, addUser },
  data () {
    return {
      tableData: [],
      showPasswordDialog: false,
      showUserDialog: false,
      passwordObj: {},
      useInfo: {},
      page: 1,
      count: 5,
      total: 0
    }
  },
  methods: {
    getList (page, count) {
      accountService.getEmpInfoAndAuth({ page: page, count: count }).then(res => {
        this.tableData = res.obj.list
        this.total = res.obj.total
      })
    },
    addUser () {
      this.showUserDialog = true
      this.useInfo = {
        type: 'add'
      }
    },
    removeUser (empnum) {
      this.$confirm('确定移除该员工吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        accountService.removeUser({ empnum: empnum }).then(res => {
          if (res.msg === '0') {
            this.$message.success('用户移除成功')
            this.getList(this.page, this.count)
          }
        }).then(() => {
          staffService.delEmployee({ empnum: empnum }).then(() => {})
          this.handleCurrentChange(1)
        })
      }).catch(() => {})
    },
    modifyPassword (empnum) {
      this.showPasswordDialog = true
      this.passwordObj = {
        type: 'modify',
        empnum: empnum
      }
    },
    closeDialog (type, val) {
      switch (type) {
        case 'modify':
          this.showPasswordDialog = val
          break
        case 'add':
          this.showUserDialog = val
          this.handleCurrentChange(1)
          break
      }
    },
    handleCurrentChange (page) {
      this.page = page
      this.getList(page, this.count)
    }
  },
  created () {
    this.getList(this.page, this.count)
  }
}
</script>
<style lang="less">
.add-user-but {
  float: right;
}
.pagination-style {
  float: right;
  margin: 10px 0px;
}
</style>
