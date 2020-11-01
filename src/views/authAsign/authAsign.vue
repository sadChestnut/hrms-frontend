<template lang="pug">
div
  el-card
    div(slot="header")
      span 角色管理
    el-table(:data="tableData", style="width: 100%")
      el-table-column(prop="empnum", label="员工工号")
      el-table-column(prop="empname", label="员工姓名")
      el-table-column(prop="email", label="邮箱")
      el-table-column(prop="identity", label="担任职位")
      el-table-column(label="操作")
        template(slot-scope="scope")
          el-button(@click="assignAuthority(scope.row)", type="text", v-if="scope.row.empnum !== '3001'") 角色更改
    el-pagination.pagination-style(
      background
      layout="prev, pager, next"
      :page-size="count"
      :total="total"
      @current-change="handleCurrentChange"
      :current-page="page"
    )
  assign-auth-modal(:isshow="isshow", :authInfo="authInfo", :roleList="roleList", @click="closeAuthModal", @okModal="okModal")
</template>
<script>
import accountService from '@/service/accountService'
import assignAuthModal from './assignAuthModal'
import positionService from '@/service/positionService'
export default {
  name: 'auth-asign',
  components: { assignAuthModal },
  data () {
    return {
      tableData: [],
      isshow: false,
      authInfo: {},
      empnum: '',
      page: 1,
      count: 5,
      total: 0,
      roleList: []
    }
  },
  methods: {
    assignAuthority (obj) {
      this.authInfo = {
        identity: obj.identity,
        currentAuth: obj.auth
      }
      this.empnum = obj.empnum
      this.isshow = true
    },
    getList (page, count) {
      accountService.getEmpInfoAndAuth({ page: page, count: count }).then(res => {
        this.tableData = res.obj.list
        this.total = res.obj.total
      })
    },
    handleCurrentChange (page) {
      this.page = page
      this.getList(page, this.count)
    },
    okModal (obj) {
      let params = {
        auth: obj.auth,
        identity: obj.identity,
        empnum: this.empnum
      }
      accountService.changeEmpAuth(params).then(res => {
        if (res.msg === '0') {
          this.$message.success('操作成功')
          this.getList(this.page, this.count)
        }
      }).then(() => {
        this.handleCurrentChange(1)
      })
    },
    closeAuthModal (val) {
      this.isshow = val
      this.authInfo = {}
    },
    getRoleList () {
      positionService.getPositionList({ page: '', count: '' }).then(res => {
        res.obj.list.forEach(item => {
          this.roleList.push({ label: item.positionname, value: item.positionname })
        })
      })
    }
  },
  created () {
    this.getList(this.page, this.count)
    this.getRoleList()
  }
}
</script>
<style lang="less" scoped>
.pagination-style {
  float: right;
  margin: 10px 0px;
}
</style>
