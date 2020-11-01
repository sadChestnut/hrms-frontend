<template lang="pug">
  el-dialog(title="是否更新当前项目状态?", :visible="isShow", :before-close="closeDialog", width="60%")
    el-steps(finish-status="success", :active="active", simple)
      el-step(v-for="(item, index) in proStatusLists", :title="item", :key="index")
    div(slot="footer")
      el-button(@click="closeDialog") 取 消
      el-button(type="primary", @click="updateProjectStatus") 更 新
</template>
<script>
import projectService from '@/service/projectService'
export default {
  name: 'updateStatus',
  data () {
    return {
      proStatusLists: ['待启动', '项目人员配置', '开发中', '测试中', '已交付'],
      isShow: this.isShowDialog,
      active: this.proIdStatus.projectstatus
    }
  },
  props: {
    isShowDialog: {
      type: Boolean,
      required: true
    },
    proIdStatus: {
      type: Object,
      required: true
    }
  },
  methods: {
    closeDialog () {
      this.isShow = false
      this.$emit('click', this.isShow)
    },
    updateProjectStatus () {
      const proid = this.proIdStatus.projectid
      projectService.updateProStatus({ proid: proid, prostatus: this.active }).then(res => {
        if (res.msg === '0') {
          this.$message.success('状态更新成功')
        }
      }).then(() => {
        this.closeDialog()
        if (this.active === 4) {
          projectService.removeEmployees({ proid: proid }).then()
        }
      })
    }
  },
  watch: {
    isShowDialog: {
      handler: function (newVal, oldVal) {
        this.isShow = newVal
      },
      deep: true
    },
    proIdStatus: {
      handler: function (newVal, oldVal) {
        this.active = newVal.projectstatus
      },
      deep: true
    }
  }
}
</script>
<style>

</style>
