<template lang="pug">
  el-card
    div(slot="header")
      span 修改登陆密码
    el-form(:model="passwordform", ref="passwordform", :rules="rules", label-width="80px")
      el-form-item(label="原密码", prop="oldPassword")
        el-input.input-style(type="password", v-model="passwordform.oldPassword", autocomplete="off")
      el-form-item(label="新密码", prop="newPassword")
        el-input.input-style(type="password", v-model="passwordform.newPassword", autocomplete="off")
      el-form-item(label="确认密码", prop="confirmPassword")
        el-input.input-style(type="password", v-model="passwordform.confirmPassword", autocomplete="off")
      el-form-item
        el-button(type="primary", @click="onSubmit('passwordform')") 确认
</template>
<script>
import accountService from '@/service/accountService'
export default {
  data () {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (value === this.passwordform.oldPassword) {
        callback(new Error('新密码不能与旧密码相同'))
      } else {
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.passwordform.newPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      passwordform: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      rules: {
        oldPassword: [
          { required: true, message: '请输入原密码', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '请输入确认密码', trigger: 'blur' },
          { validator: validatePass2, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    onSubmit (formName) {
      let params = {
        empnum: window.localStorage.getItem('empnum'),
        oldPassword: this.passwordform.oldPassword,
        newPassword: this.passwordform.newPassword
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          accountService.modifyPassword(params).then(res => {
            if (res.msg === '0') {
              this.$message.success('密码修改成功')
            } else {
              this.$message.error(res.code)
            }
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>
<style lang="less">
.input-style {
  width: 300px;
}
</style>
