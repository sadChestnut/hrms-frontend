<template lang="pug">
el-card
  div.clearfix(slot="header")
    span {{ viewType==='addproject' ? '新增项目类型' : '项目类型编辑'}}
  div
    el-form(label-width="100px", :model="projectTypeForm")
      el-form-item(label="项目类型ID")
        el-input(style="width:300px", v-model="projectTypeForm.projecttypeid", disabled)
      el-form-item(label="项目名称")
        el-input(style="width:300px", v-model="projectTypeForm.projecttypename")
      el-form-item(label="项目类型详情")
        el-input(type="textarea", :rows="8", style="width: 400px; font-size: 15px;", v-model="projectTypeForm.projecttypedetail")
      el-form-item
        el-button(size="small", @click="goBack") 返回
        el-button(type="primary", size="small", @click="okConfirm") 确认
</template>
<script>
import projectTypeService from '@/service/projectTypeService'
export default {
  data () {
    const viewType = this.$route.name.split('.')[1]
    return {
      viewType,
      projectTypeForm: {
        projecttypeid: '',
        projecttypename: '',
        projecttypedetail: ''
      }
    }
  },
  methods: {
    goBack () {
      this.$router.push({ name: 'knowledge.project' })
    },
    okConfirm () {
      if (this.viewType === 'addproject') {
        projectTypeService.addProjectType({ ...this.projectTypeForm }).then(res => {
          if (res.msg === '0') {
            this.$message.success('项目类型新增成功')
            this.goBack()
          }
        })
      } else {
        projectTypeService.updateProjectType({ ...this.projectTypeForm }).then(res => {
          if (res.msg === '0') {
            this.$message.success('项目信息更新成功')
            this.goBack()
          }
        })
      }
    }
  },
  created () {
    if (this.$route.params && this.$route.params.projecttypeid) {
      projectTypeService.getProjectTypeInfo({ projecttypeid: this.$route.params.projecttypeid }).then(res => {
        this.projectTypeForm = { ...res.obj }
      })
    } else {
      projectTypeService.getProjectTypeList({ page: '', count: '' }).then(res => {
        let positiontypelists = res.obj.list
        this.projectTypeForm.projecttypeid = Number(positiontypelists[positiontypelists.length - 1].projecttypeid) + 1
      })
    }
  }
}
</script>
<style lang="less">

</style>
