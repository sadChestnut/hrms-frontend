<template lang="pug">
  el-card
    div(slot="header", style="margin-bottom: 10px;")
      span 教育背景(备注：从大学开始填写即可)
    div.edu-list-style(v-for="(edudetail, index) in empeducation")
      div.num-label-style
        span.index-style ({{index + 1}})
        el-form(label-width="80px")
          el-form-item(label="入学时间")
            el-date-picker.input-style(v-model="edudetail.starttime")
          el-form-item(label="毕业时间")
            el-date-picker.input-style(v-model="edudetail.endtime")
          el-form-item(label="毕业院校")
            el-input(v-model="edudetail.schoolname")
          el-form-item.input-style(label="学历")
            el-select.input-style(v-model="edudetail.degree")
              el-option(v-for="edu in degreeList", :label="edu.label", :key="edu.value", :value="edu.value")
          el-form-item(label="专业")
              el-input.input-style(v-model="edudetail.major")
      div
        el-button(icon="el-icon-plus", type="primary", circle, @click="addEducation(index)",v-if="mark")
        el-button(icon="el-icon-minus", circle, @click="removeProgramList(index)", :disabled="isRemoveProList",v-if="mark")
    div(style="margin-left: 80px;")
      el-button(@click="goBack") 返回
      el-button(type="primary", @click="okConfirm",v-if="mark") 确认
</template>
<script>
import staffService from '@/service/staffService'
export default {
  data () {
    const viewType = this.$route.name.split('.')[1]
    return {
      viewType,
      empeducation: [],
      degreeList: [
        {
          label: '本科',
          value: '本科'
        },
        {
          label: '专科',
          value: '专科'
        },
        {
          label: '硕士',
          value: '硕士'
        },
        {
          label: '博士',
          value: '博士'
        }
      ],
      mark: true
    }
  },
  methods: {
    addEducation (index) {
      let empnum = this.viewType === 'initialEduDetail' ? this.$route.params.empnum : window.localStorage.getItem('empnum')
      this.empeducation.splice(index + 1, 0, { starttime: '', endtime: '', schoolName: '', degree: '', major: '', empnum: empnum })
    },
    removeEducation (index) {
      if (index === 0) {
        return
      }
      this.empeducation.splice(index, 1)
    },
    goBack () {
      let params = { empnum: this.$route.params.empnum, empname: this.$route.params.empname, identity: this.$route.params.identity, email: this.$route.params.email, phone: this.$route.params.phone, skill: this.$route.params.skill }
      this.viewType === 'initialEduDetail' ? this.$router.push({ name: 'staffResume.edit', params: params }) : this.$router.push({ name: 'staffResume.detail', params: params })
    },
    okConfirm () {
      staffService.addEduListDetail(JSON.stringify(this.empeducation)).then(res => {
        if (res.msg === '0') {
          this.$message.success('教育背景编辑成功')
          this.goBack()
        }
      })
    }
  },
  computed: {
    isRemoveProList: function () {
      return this.empeducation.length <= 1
    }
  },
  created () {
    let empnum = this.viewType === 'initialEduDetail' ? this.$route.params.empnum : window.localStorage.getItem('empnum')
    staffService.getResume({empnum: empnum}).then(res => {
      if (this.viewType === 'initialEduDetail') {
        this.empeducation = res.obj.empeducation.length > 0 ? res.obj.empeducation : [{ starttime: '', endtime: '', schoolname: '', degree: '', major: '', empnum: this.$route.params.empnum }]
        if (res.obj.empeducation.length > 0) {
          this.mark = false
        } else {
          this.mark = true
        }
      } else {
        this.empeducation = [{ starttime: '', endtime: '', schoolname: '', degree: '', major: '', empnum: empnum }]
      }
    })
  }
}
</script>
<style lang="less">
.num-label-style {
  display: flex;
  flex-direction: row;
  .index-style {
    margin-top: 10px;
    font-size: 14px;
  }
}
.input-style {
  width: 500px;
}
.edu-list-style {
  display: flex;
  flex-direction: row;
  justify-content: space-around
}
</style>
