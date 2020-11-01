<template lang="pug">
  el-dialog(title="新增用户", :visible="dialogFormVisible", :before-close="closeDialog")
    el-form(:model="userform")
      el-form-item(label="员工职位", label-width="120px")
        el-select(v-model="userform.identity")
          el-option(v-for="(item, index) in roleList", :value="item.value", :label="item.label", :key="index")
      el-form-item(label="员工工号", label-width="120px")
        el-input.password-input-style(v-model="userform.empnum", :disabled="true")
      el-form-item(label="员工姓名", label-width="120px")
        el-input.password-input-style(v-model="userform.empname")
    div(slot="footer")
      el-button(@click="closeDialog") 取 消
      el-button(type="primary", @click="okDialog") 确 定
</template>
<script>
import accountService from '@/service/accountService'
import staffService from '@/service/staffService'
import positionService from '@/service/positionService'
export default {
  props: {
    showUserDialog: {
      type: Boolean
    },
    useInfo: {
      type: Object
    }
  },
  data () {
    return {
      roleList: [],
      userform: {
        identity: '',
        empnum: '',
        empname: ''
      },
      dialogFormVisible: this.showUserDialog,
      identityauth: 0
    }
  },
  methods: {
    closeDialog () {
      this.dialogFormVisible = false
      this.userform = {
        identity: '',
        empnum: '',
        empname: ''
      }
      this.$emit('close-dialog', this.useInfo.type, this.dialogFormVisible)
    },
    okDialog () {
      let _this = this
      accountService.addUser({ empnum: this.userform.empnum, identityauth: this.identityauth }).then(res => {
        if (res.msg === '0') {
          this.$message.success('新增用户成功')
        }
      }).then(() => {
        let _params = {
          empnum: _this.userform.empnum,
          empname: _this.userform.empname,
          phone: '',
          email: '',
          identity: _this.userform.identity,
          skill: ''
        }
        staffService.saveResume(_params).then(() => {
          this.closeDialog()
        })
      })
    },
    getRoleList () {
      positionService.getPositionList({ page: '', count: '' }).then(res => {
        res.obj.list.forEach(item => {
          this.roleList.push({ text: item.positionname, value: item.positionname })
        })
      })
    }
  },
  created () {
    this.getRoleList()
  },
  watch: {
    showUserDialog (val) {
      this.dialogFormVisible = val
    },
    'userform.identity' (val) {
      if (val !== '') {
        if (val === 'hr') {
          this.identityauth = 3
        } else if (val === '项目经理') {
          this.identityauth = 2
        } else {
          this.identityauth = 1
        }
        accountService.getEmpnum({ identityauth: this.identityauth }).then(res => {
          this.$set(this.userform, 'empnum', Number(res.obj.list[0].empnum) + 1)
        })
      }
    }
  }
}
</script>
<style lang="less">

</style>
