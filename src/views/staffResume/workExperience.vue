<template lang="pug">
  el-card
    div(slot="header", style="margin-bottom: 10px;")
      span 工作经验
    div.work-list-style(v-for="(workdetail, index) in workList")
      div.num-label-style
        span.index-style ({{index + 1}})
        el-form(label-width="80px")
          el-form-item(label="就职公司")
            el-input.input-style(v-model="workdetail.companyname")
          el-form-item(label="入职时间")
            el-date-picker.input-style(type="date", v-model="workdetail.workstarttime")
          el-form-item(label="离职时间")
            el-date-picker.input-style(type="date", v-model="workdetail.workendtime")
          el-form-item(label="所在部门")
            el-input.input-style(v-model="workdetail.workdepartment")
          el-form-item(label="担任职位")
            el-select.input-style(v-model="workdetail.workpost")
              el-option(v-for="role in roleList", :label="role.label", :key="role.value", :value="role.value")
          el-form-item(label="工作经验")
            el-input.input-style(type="textarea", :rows="8", v-model="workdetail.experience")
      div(v-if="mark")
        el-button(icon="el-icon-plus", type="primary", circle, @click="addCompanyList(index)")
        el-button(icon="el-icon-minus", circle, @click="removeCompanyList(index)", :disabled="isRemoveCompanyList")
    div(style="margin-left: 80px;")
      el-button(@click="goBack") 返回
      el-button(type="primary", @click="okConfirm", v-if="mark") 确认
</template>
<script>
import staffService from '@/service/staffService'
import positionService from '@/service/positionService'

export default {
  data () {
    return {
      workList: [],
      mark: true,
      roleList: []
    }
  },
  methods: {
    addCompanyList (index) {
      this.workList.splice(index + 1, 0, { workstarttime: '', workendtime: '', companyname: '', experience: '', workdepartment: '', workpost: '', empnum: this.$route.params.empnum })
    },
    removeCompanyList (index) {
      this.workList.splice(index, 1)
    },
    goBack () {
      let params = { empnum: this.$route.params.empnum, empname: this.$route.params.empname, identity: this.$route.params.identity, email: this.$route.params.email, phone: this.$route.params.phone, skill: this.$route.params.skill }
      this.$router.push({ name: 'staffResume.edit', params: params })
    },
    okConfirm () {
      staffService.addWorkListDetail(JSON.stringify(this.workList)).then(res => {
        if (res.msg === '0') {
          this.$message.success('工作经验编辑成功')
          this.goBack()
        }
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
  computed: {
    isRemoveCompanyList: function () {
      return this.workList.length <= 1
    }
  },
  created () {
    staffService.getAllWorkList({ empnum: this.$route.params.empnum }).then(res => {
      this.workList = res.obj.list.length > 0 ? res.obj.list : [{ workstarttime: '', workendtime: '', companyname: '', experience: '', workdepartment: '', workpost: '', empnum: this.$route.params.empnum }]
      if (res.obj.list.length > 0) {
        this.mark = false
      } else {
        this.mark = true
      }
    })
    this.getRoleList()
  }
}
</script>
<style lang="less">
.input-style {
  width: 500px;
}
.work-list-style {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
</style>
