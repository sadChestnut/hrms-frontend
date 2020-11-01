<template lang="pug">
div
  el-dialog(title="消息提醒", :visible="dialogTableVisible", :before-close="closeDialog")
    div
      template
        div(v-if="operateObj.status === 0")
          span 项目经理（工号为{{ operateObj.send}}）申请将员工{{ operateObj.empname }}（工号为{{ operateObj.empnum}}）
          span.font-color-style 移除
          span {{proname}}项目, 是否通过审核？
        div(v-else)
          span 项目经理（工号为{{ operateObj.send}}）申请员工{{ operateObj.empname }}（工号为{{ operateObj.empnum}}）
          span.font-color-style 加入
          span {{proname}}项目, 是否通过审核？
    div(slot="footer")
      el-button(@click="closeDialog") 取 消
      el-button(type="primary", @click="confirmCheck(operateObj.status)") 确 定
  assign-date(v-if="isShow", :isShow="isShow", :empnum="empnum", @updateIsShow="updateIsShow", @click="addEmployeePlan")
</template>
<script>
import projectService from '@/service/projectService'
import messageService from '@/service/messageService'
import assignDate from '../humanResourceManager/assignDate'
export default {
  name: 'message-detail',
  props: {
    isdialogshow: {
      type: Boolean,
      required: true
    },
    operateObj: {
      type: Object,
      required: true
    }
  },
  components: { assignDate },
  data () {
    return {
      dialogTableVisible: this.isdialogshow,
      proname: '',
      isShow: false,
      empnum: ''
    }
  },
  methods: {
    closeDialog () {
      this.dialogTableVisible = false
      this.$emit('click', this.dialogTableVisible)
    },
    getProjectName (proid) {
      projectService.getProjectDetail({proid: proid}).then(res => {
        this.proname = res.obj.proname
      })
    },
    confirmCheck (status) {
      const params = {
        proid: this.operateObj.proid,
        empnum: this.operateObj.empnum
      }
      messageService.updateMessageCheck({ ...params }).then(res => {
        if (res.msg === '0') {
          this.$message.success('操作成功')
        }
      }).then(() => {
        if (status === 0) {
          projectService.delEmployee({ ...params }).then(res => {})
        } else {
          this.isShow = true
        }
        this.closeDialog()
      })
    },
    updateIsShow (val) {
      this.isShow = false
    },
    addEmployeePlan (val) {
      const params = {
        ...val,
        proid: this.operateObj.proid,
        empnum: this.operateObj.empnum,
        identity: this.operateObj.identity
      }
      projectService.setProjectTime({ ...params }).then(res => {})
    }
  },
  watch: {
    isdialogshow: {
      handler: function (newVal, oldVal) {
        this.dialogTableVisible = newVal
      },
      deep: true
    },
    operateObj: {
      handler: function (newVal, oldVal) {
        this.getProjectName(newVal.proid)
        this.operateObj = newVal
      },
      deep: true
    }
  }
}
</script>
<style lang="less">
.font-color-style {
  color: #409EFF;
}
</style>
