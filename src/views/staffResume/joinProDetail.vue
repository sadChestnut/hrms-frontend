<template lang="pug">
  el-card
    div(slot="header", style="margin-bottom: 10px;")
      span 项目经验
    div.work-list-style(v-for="(prodetail, index) in programList")
      div.num-label-style
        span.index-style ({{index + 1}})
        el-form(label-width="80px")
          el-form-item(label="项目名称")
            el-input.input-style(v-model="prodetail.proname")
          el-form-item(label="项目简介")
            el-input.input-style(type="textarea", :rows="8", v-model="prodetail.prodetail")
          el-form-item(label="充当角色")
            el-select.input-style(v-model="prodetail.role")
              el-option(v-for="role in roleList", :label="role.label", :key="role.value", :value="role.value")
          el-form-item(label="角色贡献")
            el-input.input-style(type="textarea", :rows="8", v-model="prodetail.rolecontribution")
      div
        el-button(icon="el-icon-plus", type="primary", circle, @click="addProgramList(index)",v-if="mark")
        el-button(icon="el-icon-minus", circle, @click="removeProgramList(index)", :disabled="isRemoveProList",v-if="mark")
    div(style="margin-left: 80px;")
      el-button(@click="goBack") 返回
      el-button(type="primary", @click="okConfirm",v-if="mark") 确认
</template>
<script>
import staffService from '@/service/staffService'
import positionService from '@/service/positionService'

export default {
  data () {
    const viewType = this.$route.name.split('.')[1]
    return {
      viewType,
      programList: [],
      roleList: [],
      mark: true
    }
  },
  methods: {
    goBack () {
      let params = { empnum: this.$route.params.empnum, empname: this.$route.params.empname, identity: this.$route.params.identity, email: this.$route.params.email, phone: this.$route.params.phone, skill: this.$route.params.skill }
      this.viewType === 'initialProInfo' ? this.$router.push({ name: 'staffResume.edit', params: params }) : this.$router.push({ name: 'staffResume.detail', params: params })
    },
    okConfirm () {
      staffService.addProListDetail(JSON.stringify(this.programList)).then(res => {
        if (res.msg === '0') {
          this.$message.success('项目经验编辑成功')
          this.goBack()
        }
      })
    },
    addProgramList (index) {
      this.programList.splice(index + 1, 0, {proName: '', proDetail: '', role: '', roleContribution: '', empnum: this.$route.params.empnum})
    },
    removeProgramList (index) {
      this.programList.splice(index, 1)
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
    isRemoveProList: function () {
      return this.programList.length <= 1
    }
  },
  created () {
    let empnum = this.viewType === 'initialProInfo' ? this.$route.params.empnum : window.localStorage.getItem('empnum')
    staffService.getResume({empnum: empnum}).then(res => {
      if (this.viewType === 'initialProInfo') {
        this.programList = res.obj.empprojects.length > 0 ? res.obj.empprojects : [{ proname: '', prodetail: '', role: '', rolecontribution: '', empnum: this.$route.params.empnum }]
        if (res.obj.empprojects.length > 0) {
          this.mark = false
        } else {
          this.mark = true
        }
      } else {
        this.programList = [{ proname: '', prodetail: '', role: '', rolecontribution: '', empnum: window.localStorage.getItem('empnum') }]
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
  justify-content: space-around
}
</style>
