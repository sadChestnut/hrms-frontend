<template lang="pug">
el-dialog(title="分配角色", :visible="dialogFormVisible", :before-close="closeDialog")
  div.role-show-style
    el-select(v-model="currentRole")
      el-option(v-for="(role, index) in roleList", :label="role.label", :value="role.value", :key="index")
  div
    div(style="color: #409EFF;font-size: 15px;margin-bottom: 10px;") 角色对应菜单:
    div(v-for="item in currentAuthLists") {{ item.label }}
  div(slot="footer")
    el-button(@click="closeDialog") 取 消
    el-button(type="primary", @click="okDialog") 确 定
</template>
<script>
import accountService from '@/service/accountService'
export default {
  name: 'assign-auth-modal',
  props: {
    isshow: {
      type: Boolean,
      required: true
    },
    authInfo: {
      type: Object,
      required: true
    },
    roleList: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      dialogFormVisible: this.isshow,
      currentRole: this.authInfo.identity,
      currentAuthLists: [],
      currentAuth: ''
    }
  },
  methods: {
    closeDialog () {
      this.dialogFormVisible = false
      this.currentRole = ''
      this.$emit('click', this.dialogFormVisible)
    },
    okDialog () {
      this.$emit('okModal', { identity: this.currentRole, auth: this.currentAuth })
      this.closeDialog()
    },
    getAuthMenus (val) {
      accountService.getAuthMenus({ auth: val }).then(res => {
        this.currentAuthLists = res.obj.list
      })
    }
  },
  watch: {
    isshow: function (newVal, oldVal) {
      this.dialogFormVisible = newVal
    },
    authInfo: {
      handler: function (newVal, oldVal) {
        this.currentRole = newVal.identity
      },
      deep: true
    },
    currentRole: function (newVal) {
      if (newVal === '项目经理') {
        this.currentAuth = '2'
      } else if (newVal === 'hr') {
        this.currentAuth = '3'
      } else {
        this.currentAuth = '1'
      }
      this.getAuthMenus(this.currentAuth)
    }
  }
}
</script>
<style lang="less" scoped>
.role-show-style {
  margin-bottom: 10px;
}
</style>
