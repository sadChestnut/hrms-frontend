<template lang="pug">
  el-dialog(title="设置驳回原因", :visible="isShow ", :before-close="closeDialog")
    el-form
      el-form-item(label="驳回原因")
        el-input(type="textarea", v-model="reason", placeholder="请输入驳回原因", style="width: 450px;", :rows="4")
    div(slot="footer")
      el-button(@click="closeDialog") 取 消
      el-button(type="primary", @click="confirmDialog") 确 定
</template>
<script>
export default {
  props: {
    dialogFormVisible: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      isShow: this.dialogFormVisible,
      reason: ''
    }
  },
  methods: {
    closeDialog () {
      this.isShow = false
      this.$emit('closeReasonDetail', this.isShow)
      this.reason = ''
    },
    confirmDialog () {
      this.$emit('click', this.reason)
      this.closeDialog()
    }
  },
  name: 'reasonDetail'
}
</script>
<style lang="less">

</style>
