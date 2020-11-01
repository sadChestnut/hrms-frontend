<template lang="pug">
  el-dialog(title="修改密码", :visible="dialogFormVisible", :before-close="closeDialog")
    el-form(:model="passform")
      el-form-item(label="管理员密码", label-width="120px")
        el-input.password-input-style(type="password", v-model="passform.adminpassword", autocomplete="off")
      el-form-item(label="用户新密码", label-width="120px")
        el-input.password-input-style(type="password", v-model="passform.userpassword", autocomplete="off")
    div(slot="footer")
      el-button(@click="closeDialog") 取 消
      el-button(type="primary", @click="okDialog") 确 定
</template>
<script>
import accountService from '@/service/accountService'
export default {
  props: {
    showPasswordDialog: {
      type: Boolean
    },
    passwordObj: {
      type: Object
    }
  },
  data () {
    return {
      passform: {
        adminpassword: '',
        userpassword: ''
      },
      dialogFormVisible: this.showPasswordDialog
    }
  },
  methods: {
    closeDialog () {
      this.dialogFormVisible = false
      this.passform = {}
      this.$emit('close-dialog', this.passwordObj.type, this.dialogFormVisible)
    },
    okDialog () {
      let _params = {
        ...this.passform,
        admin: window.localStorage.getItem('empnum'),
        empnum: this.passwordObj.empnum
      }
      accountService.adminModifyPassword(_params).then(res => {
        if (res.msg === '0') {
          this.$message.success('用户密码修改成功')
        } else {
          this.$message.error(res.code)
        }
        this.closeDialog()
      })
    }
  },
  watch: {
    showPasswordDialog (val) {
      this.dialogFormVisible = val
    }
  }
}
</script>
<style lang="less">
.password-input-style {
  width: 300px;
}
</style>
