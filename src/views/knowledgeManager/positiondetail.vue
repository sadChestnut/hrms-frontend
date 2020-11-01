<template lang="pug">
el-card
  div.clearfix(slot="header")
    span {{ viewType==='addposition' ? '新增职位' : '职位编辑'}}
  div
    el-form(label-width="80px", :model="positionForm")
      el-form-item(label="职位ID")
        el-input(style="width:300px", v-model="positionForm.positionid", disabled)
      el-form-item(label="职位名称")
        el-input(style="width:300px", v-model="positionForm.positionname")
      el-form-item(label="职位详情")
        el-input(type="textarea", :rows="8", style="width:400px; font-size: 15px;", v-model="positionForm.positiondetail")
      el-form-item
        el-button(size="small", @click="goBack") 返回
        el-button(type="primary", size="small", @click="okConfirm") 确认
</template>
<script>
import positionService from '@/service/positionService'

export default {
  data () {
    const viewType = this.$route.name.split('.')[1]
    return {
      viewType,
      positionForm: {
        positionid: '',
        positionname: '',
        positiondetail: ''
      }
    }
  },
  methods: {
    goBack () {
      this.$router.push({ name: 'knowledge.position' })
    },
    okConfirm () {
      if (this.viewType === 'addposition') {
        positionService.addPosition({ ...this.positionForm }).then(res => {
          if (res.msg === '0') {
            this.$message.success('职位新增成功')
            this.goBack()
          }
        })
      } else {
        positionService.updatePosition({ ...this.positionForm }).then(res => {
          if (res.msg === '0') {
            this.$message.success('职位信息更新成功')
            this.goBack()
          }
        })
      }
    }
  },
  created () {
    if (this.$route.params && this.$route.params.positionid) {
      positionService.getPositionInfo({ positionid: this.$route.params.positionid }).then(res => {
        this.positionForm = { ...res.obj }
      })
    } else {
      positionService.getPositionList({ page: '', count: '' }).then(res => {
        let positionlists = res.obj.list
        this.positionForm.positionid = Number(positionlists[positionlists.length - 1].positionid) + 1
      })
    }
  }
}
</script>
<style lang="less">

</style>
